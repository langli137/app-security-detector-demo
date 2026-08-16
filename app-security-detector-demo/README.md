# 中文版移动应用安全检测 App Demo

这是一个演示级项目，包含：

- `backend/`：FastAPI 后端，支持上传 APK / ZIP / 文本文件、创建检测任务、执行演示级静态扫描、生成中文 JSON 和 HTML 报告。
- `android-client/`：Kotlin + Jetpack Compose Android 客户端骨架，支持文件选择、上传、轮询检测进度、展示中文报告。
- `samples/`：演示用存在风险的源码 ZIP。

> 说明：本项目用于课程项目、毕业设计原型或功能演示。扫描规则是演示级静态规则，不能替代专业安全产品或人工安全审计。

## 1. 启动后端

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows 使用 .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

启动后访问：

```text
http://127.0.0.1:8000/docs
```

健康检查：

```bash
curl http://127.0.0.1:8000/health
```

## 2. 命令行测试完整流程

上传演示样例：

```bash
curl -X POST "http://127.0.0.1:8000/api/upload"   -F "file=@samples/demo_vulnerable_source.zip"
```

返回示例：

```json
{
  "task_id": "task_xxxxxx",
  "filename": "demo_vulnerable_source.zip",
  "status": "pending",
  "message": "文件上传成功，检测任务已创建"
}
```

查询进度：

```bash
curl http://127.0.0.1:8000/api/tasks/task_xxxxxx
```

获取 JSON 报告：

```bash
curl http://127.0.0.1:8000/api/reports/task_xxxxxx
```

浏览器查看 HTML 报告：

```text
http://127.0.0.1:8000/api/reports/task_xxxxxx/html
```

下载 HTML 报告：

```text
http://127.0.0.1:8000/api/reports/task_xxxxxx/download
```

## 3. Android 客户端联调

### 模拟器

Android 模拟器访问电脑本机服务时，`MainActivity.kt` 中的后端地址默认配置为：

```kotlin
private const val BASE_URL = "http://10.0.2.2:8000/"
```

保持后端监听 `0.0.0.0:8000`，直接运行 App 即可。

### 真机 USB

如果使用真机 USB 调试，可以先执行：

```bash
adb reverse tcp:8000 tcp:8000
```

然后把 `BASE_URL` 改为：

```kotlin
private const val BASE_URL = "http://127.0.0.1:8000/"
```

### 真机局域网

如果手机和电脑在同一 Wi-Fi，把 `BASE_URL` 改为电脑局域网 IP，例如：

```kotlin
private const val BASE_URL = "http://192.168.1.100:8000/"
```

同时确认防火墙允许访问 8000 端口。

## 4. Android 工程运行

用 Android Studio 打开 `android-client/` 目录，等待 Gradle 同步后运行 `app`。

演示流程：

1. 打开 App 首页；
2. 点击“选择文件”；
3. 选择 `samples/demo_vulnerable_source.zip` 或自己的 APK / ZIP；
4. 点击“开始上传并检测”；
5. 等待进度页显示检测完成；
6. 自动进入报告页，查看评分和风险详情。

## 5. 接口清单

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/health` | 健康检查 |
| POST | `/api/upload` | 上传文件并创建检测任务 |
| GET | `/api/tasks/{task_id}` | 查询任务状态 |
| GET | `/api/reports/{task_id}` | 获取 JSON 报告 |
| GET | `/api/reports/{task_id}/html` | 在线查看 HTML 报告 |
| GET | `/api/reports/{task_id}/download` | 下载 HTML 报告 |

## 6. 当前已实现的演示规则

- 明文 HTTP 地址；
- 疑似硬编码 API Key / Token / Secret；
- 敏感权限字符串；
- `usesCleartextTraffic=true`；
- `debuggable=true`；
- WebView 启用 JavaScript；
- WebView 暴露 JavaScript 接口；
- 忽略 SSL 证书错误；
- HostnameVerifier 恒返回 true；
- MD5 / SHA1 / DES / AES-ECB 弱密码算法提示。

## 7. 后续可扩展方向

- 接入 apktool / jadx 做更完整 APK 解析；
- 使用 SQLite 保存历史任务；
- 增加登录和报告访问权限；
- 增加规则配置文件；
- 增加 PDF 报告导出；
- Android 端增加历史报告列表；
- 增加 CI/CD 扫描接口。
