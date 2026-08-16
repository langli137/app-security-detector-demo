package com.demo

class MainActivity {
    val apiKey = "API_KEY_1234567890_DEMO_SECRET"
    val url = "http://example.com/api/login"

    fun setupWebView(webView: android.webkit.WebView) {
        webView.settings.setJavaScriptEnabled(true)
        webView.addJavascriptInterface(Any(), "bridge")
    }
}
