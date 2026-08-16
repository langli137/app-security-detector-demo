
package com.example.securitydetector

import android.content.ContentResolver
import android.net.Uri
import android.os.Bundle
import android.provider.OpenableColumns
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.google.gson.annotations.SerializedName
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Path
import retrofit2.http.Query
import java.io.File

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                AppNavGraph()
            }
        }
    }
}

object RetrofitClient {
    // Android 模拟器访问电脑本机后端使用 10.0.2.2；真机请改成电脑局域网 IP 或使用 adb reverse。
    private const val BASE_URL = "http://10.0.2.2:8000/"
    val api: ApiService = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(ApiService::class.java)
}

interface ApiService {
    @Multipart
    @POST("api/upload")
    suspend fun uploadFile(@Part file: MultipartBody.Part): UploadResponse

    @GET("api/tasks/{taskId}")
    suspend fun getTask(@Path("taskId") taskId: String): TaskStatusResponse

    @GET("api/tasks")
    suspend fun getTaskList(@Query("limit") limit: Int = 20): List<TaskStatusResponse>

    @GET("api/reports/{taskId}")
    suspend fun getReport(@Path("taskId") taskId: String): ReportResponse
}

data class UploadResponse(
    @SerializedName("task_id") val taskId: String,
    val filename: String? = null,
    val status: String? = null,
    val message: String? = null
)

data class TaskStatusResponse(
    @SerializedName("task_id") val taskId: String,
    val filename: String? = null,
    val status: String,
    val progress: Int,
    val stage: String? = null,
    val message: String? = null,
    val score: Int? = null,
    @SerializedName("risk_level") val riskLevel: String? = null,
    val error: String? = null,
    @SerializedName("created_at") val createdAt: String? = null,
    @SerializedName("updated_at") val updatedAt: String? = null
)

data class ReportResponse(
    @SerializedName("task_id") val taskId: String,
    val filename: String,
    @SerializedName("generated_at") val generatedAt: String,
    val score: Int,
    @SerializedName("risk_level") val riskLevel: String,
    val summary: RiskSummary,
    @SerializedName("app_info") val appInfo: AppInfo,
    val findings: List<FindingDto>,
    val disclaimer: String? = null
)

data class RiskSummary(
    val critical: Int = 0,
    val high: Int = 0,
    val medium: Int = 0,
    val low: Int = 0,
    val info: Int = 0
)

data class AppInfo(
    @SerializedName("size_bytes") val sizeBytes: Long = 0,
    val md5: String = "",
    val sha256: String = "",
    @SerializedName("scanned_files") val scannedFiles: Int = 0
)

data class FindingDto(
    @SerializedName("rule_id") val ruleId: String,
    val name: String,
    val severity: String,
    val category: String,
    val file: String,
    val line: Int,
    val evidence: String,
    val description: String,
    val suggestion: String
)

class AuditRepository(private val api: ApiService = RetrofitClient.api) {
    suspend fun upload(contentResolver: ContentResolver, uri: Uri, cacheDir: File): UploadResponse {
        val name = FileUtils.getFileName(contentResolver, uri) ?: "upload.bin"
        val tempFile = File(cacheDir, name)
        contentResolver.openInputStream(uri).use { input ->
            requireNotNull(input) { "无法读取所选文件" }
            tempFile.outputStream().use { output -> input.copyTo(output) }
        }
        val body = tempFile.asRequestBody("application/octet-stream".toMediaTypeOrNull())
        val part = MultipartBody.Part.createFormData("file", tempFile.name, body)
        return api.uploadFile(part)
    }

    suspend fun getTask(taskId: String) = api.getTask(taskId)
    suspend fun getTaskList() = api.getTaskList()
    suspend fun getReport(taskId: String) = api.getReport(taskId)
}

object FileUtils {
    fun getFileName(contentResolver: ContentResolver, uri: Uri): String? {
        val cursor = contentResolver.query(uri, null, null, null, null)
        cursor?.use {
            val index = it.getColumnIndex(OpenableColumns.DISPLAY_NAME)
            if (index >= 0 && it.moveToFirst()) return it.getString(index)
        }
        return uri.lastPathSegment?.substringAfterLast('/')
    }
}

data class UploadUiState(
    val selectedUri: Uri? = null,
    val selectedFileName: String? = null,
    val isUploading: Boolean = false,
    val errorMessage: String? = null
)

class UploadViewModel : ViewModel() {
    private val repo = AuditRepository()
    private val _uiState = MutableStateFlow(UploadUiState())
    val uiState: StateFlow<UploadUiState> = _uiState

    fun onFileSelected(contentResolver: ContentResolver, uri: Uri?) {
        if (uri == null) return
        _uiState.value = UploadUiState(
            selectedUri = uri,
            selectedFileName = FileUtils.getFileName(contentResolver, uri)
        )
    }

    fun upload(contentResolver: ContentResolver, cacheDir: File, onSuccess: (String) -> Unit) {
        val uri = _uiState.value.selectedUri
        if (uri == null) {
            _uiState.value = _uiState.value.copy(errorMessage = "请先选择 APK 或 ZIP 文件")
            return
        }
        viewModelScope.launch {
            try {
                _uiState.value = _uiState.value.copy(isUploading = true, errorMessage = null)
                val resp = repo.upload(contentResolver, uri, cacheDir)
                _uiState.value = _uiState.value.copy(isUploading = false)
                onSuccess(resp.taskId)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(isUploading = false, errorMessage = e.message ?: "上传失败")
            }
        }
    }
}

data class ProgressUiState(
    val progress: Int = 0,
    val status: String = "pending",
    val stage: String = "任务已创建",
    val message: String = "等待检测",
    val errorMessage: String? = null
)

class ProgressViewModel : ViewModel() {
    private val repo = AuditRepository()
    private val _uiState = MutableStateFlow(ProgressUiState())
    val uiState: StateFlow<ProgressUiState> = _uiState
    private var pollingJob: Job? = null

    fun startPolling(taskId: String, onFinished: () -> Unit) {
        if (pollingJob != null) return
        pollingJob = viewModelScope.launch {
            while (true) {
                try {
                    val resp = repo.getTask(taskId)
                    _uiState.value = ProgressUiState(
                        progress = resp.progress,
                        status = resp.status,
                        stage = resp.stage ?: resp.status,
                        message = resp.message ?: "",
                        errorMessage = resp.error
                    )
                    if (resp.status == "success") {
                        onFinished()
                        break
                    }
                    if (resp.status == "failed") break
                    delay(2000)
                } catch (e: Exception) {
                    _uiState.value = _uiState.value.copy(errorMessage = e.message ?: "查询进度失败")
                    delay(3000)
                }
            }
        }
    }

    override fun onCleared() {
        pollingJob?.cancel()
        super.onCleared()
    }
}

data class ReportUiState(
    val isLoading: Boolean = true,
    val report: ReportResponse? = null,
    val errorMessage: String? = null
)

class ReportViewModel : ViewModel() {
    private val repo = AuditRepository()
    private val _uiState = MutableStateFlow(ReportUiState())
    val uiState: StateFlow<ReportUiState> = _uiState

    fun load(taskId: String) {
        viewModelScope.launch {
            try {
                _uiState.value = ReportUiState(isLoading = true)
                _uiState.value = ReportUiState(isLoading = false, report = repo.getReport(taskId))
            } catch (e: Exception) {
                _uiState.value = ReportUiState(isLoading = false, errorMessage = e.message ?: "报告加载失败")
            }
        }
    }
}

data class HistoryUiState(
    val isLoading: Boolean = true,
    val tasks: List<TaskStatusResponse> = emptyList(),
    val errorMessage: String? = null
)

class HistoryViewModel : ViewModel() {
    private val repo = AuditRepository()
    private val _uiState = MutableStateFlow(HistoryUiState())
    val uiState: StateFlow<HistoryUiState> = _uiState

    fun load() {
        viewModelScope.launch {
            try {
                _uiState.value = HistoryUiState(isLoading = true)
                _uiState.value = HistoryUiState(isLoading = false, tasks = repo.getTaskList())
            } catch (e: Exception) {
                _uiState.value = HistoryUiState(isLoading = false, errorMessage = e.message ?: "加载历史失败")
            }
        }
    }
}

@Composable
fun AppNavGraph() {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = "upload") {
        composable("upload") {
            UploadScreen(
                onTaskCreated = { taskId -> navController.navigate("progress/$taskId") },
                onHistory = { navController.navigate("history") }
            )
        }
        composable("history") {
            HistoryScreen(
                onTaskClick = { taskStatus ->
                    when (taskStatus.status) {
                        "success" -> navController.navigate("report/${taskStatus.taskId}")
                        "running", "pending" -> navController.navigate("progress/${taskStatus.taskId}")
                        else -> {}
                    }
                },
                onBack = { navController.popBackStack() }
            )
        }
        composable("progress/{taskId}", arguments = listOf(navArgument("taskId") { type = NavType.StringType })) { backStack ->
            val taskId = backStack.arguments?.getString("taskId") ?: ""
            ProgressScreen(taskId = taskId, onFinished = { navController.navigate("report/$taskId") })
        }
        composable("report/{taskId}", arguments = listOf(navArgument("taskId") { type = NavType.StringType })) { backStack ->
            val taskId = backStack.arguments?.getString("taskId") ?: ""
            ReportScreen(taskId = taskId, onBackHome = { navController.navigate("upload") { popUpTo("upload") { inclusive = true } } })
        }
    }
}

@Composable
fun UploadScreen(onTaskCreated: (String) -> Unit, onHistory: () -> Unit = {}, vm: UploadViewModel = viewModel()) {
    val context = LocalContext.current
    val state by vm.uiState.collectAsState()
    val picker = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        vm.onFileSelected(context.contentResolver, uri)
    }
    Column(Modifier.fillMaxSize().padding(20.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("移动应用安全检测 Demo", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Text("选择 APK 或 ZIP，上传到后端执行演示级静态安全检测。")
        Button(onClick = { picker.launch("*/*") }) { Text("选择文件") }
        Text("已选择：${state.selectedFileName ?: "未选择"}")
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Button(
                enabled = !state.isUploading,
                onClick = { vm.upload(context.contentResolver, context.cacheDir, onTaskCreated) }
            ) {
                Text(if (state.isUploading) "上传中..." else "开始上传并检测")
            }
            OutlinedButton(onClick = onHistory) { Text("历史记录") }
        }
        state.errorMessage?.let { Text(it, color = MaterialTheme.colorScheme.error) }
    }
}

@Composable
fun ProgressScreen(taskId: String, onFinished: () -> Unit, vm: ProgressViewModel = viewModel()) {
    val state by vm.uiState.collectAsState()
    LaunchedEffect(taskId) { vm.startPolling(taskId, onFinished) }
    Column(Modifier.fillMaxSize().padding(20.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("正在检测", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Text("任务编号：$taskId")
        Text("当前阶段：${state.stage}")
        LinearProgressIndicator(progress = { state.progress / 100f }, modifier = Modifier.fillMaxWidth())
        Text("进度：${state.progress}%")
        Text(state.message)
        if (state.status == "failed") Text("检测失败：${state.errorMessage ?: state.message}", color = MaterialTheme.colorScheme.error)
        state.errorMessage?.let { if (state.status != "failed") Text(it, color = MaterialTheme.colorScheme.error) }
    }
}

@Composable
fun ReportScreen(taskId: String, onBackHome: () -> Unit, vm: ReportViewModel = viewModel()) {
    val state by vm.uiState.collectAsState()
    LaunchedEffect(taskId) { vm.load(taskId) }
    Column(Modifier.fillMaxSize().padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("检测报告", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        when {
            state.isLoading -> CircularProgressIndicator()
            state.errorMessage != null -> Text(state.errorMessage ?: "报告加载失败", color = MaterialTheme.colorScheme.error)
            state.report != null -> ReportContent(state.report!!)
        }
        Button(onClick = onBackHome) { Text("返回首页") }
    }
}

@Composable
fun ReportContent(report: ReportResponse) {
    LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item {
            ElevatedCard(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("文件：${report.filename}", fontWeight = FontWeight.Bold)
                    Text("安全评分：${report.score} 分")
                    Text("整体等级：${report.riskLevel}")
                    Text("高危：${report.summary.high}  中危：${report.summary.medium}  低危：${report.summary.low}")
                    Text("SHA256：${report.appInfo.sha256.take(20)}...")
                }
            }
        }
        if (report.findings.isEmpty()) {
            item { Text("未发现明显风险。") }
        } else {
            items(report.findings) { f ->
                ElevatedCard(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text("${f.severity}｜${f.name}", fontWeight = FontWeight.Bold)
                        Text("类别：${f.category}")
                        Text("位置：${f.file}:${f.line}")
                        Text("证据：${f.evidence}")
                        Text("说明：${f.description}")
                        Text("建议：${f.suggestion}")
                    }
                }
            }
        }
    }
}

@Composable
fun HistoryScreen(onTaskClick: (TaskStatusResponse) -> Unit, onBack: () -> Unit, vm: HistoryViewModel = viewModel()) {
    val state by vm.uiState.collectAsState()
    LaunchedEffect(Unit) { vm.load() }
    Column(Modifier.fillMaxSize().padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
            Text("历史任务", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            OutlinedButton(onClick = onBack) { Text("返回") }
        }
        when {
            state.isLoading -> CircularProgressIndicator()
            state.errorMessage != null -> Text(state.errorMessage ?: "加载失败", color = MaterialTheme.colorScheme.error)
            state.tasks.isEmpty() -> Text("暂无历史任务", color = MaterialTheme.colorScheme.onSurfaceVariant)
            else -> LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(state.tasks) { task ->
                    ElevatedCard(
                        Modifier.fillMaxWidth(),
                        onClick = { onTaskClick(task) }
                    ) {
                        Row(
                            Modifier.padding(16.dp).fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
                        ) {
                            Column(Modifier.weight(1f)) {
                                Text(task.filename ?: "未知文件", fontWeight = FontWeight.Bold)
                                Text(
                                    "${task.createdAt ?: ""} | ${task.taskId}",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                if (task.score != null) {
                                    Text("${task.score}分", fontWeight = FontWeight.Bold)
                                }
                                val (statusText, statusColor) = when (task.status) {
                                    "success" -> "已完成" to MaterialTheme.colorScheme.primary
                                    "failed" -> "失败" to MaterialTheme.colorScheme.error
                                    "running" -> "检测中" to MaterialTheme.colorScheme.tertiary
                                    else -> "等待中" to MaterialTheme.colorScheme.onSurfaceVariant
                                }
                                Text(statusText, color = statusColor, style = MaterialTheme.typography.bodySmall)
                            }
                        }
                    }
                }
            }
        }
    }
}
