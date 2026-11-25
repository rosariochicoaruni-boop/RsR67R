package mz.caderneta.gastos

import android.annotation.SuppressLint
import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.Toast
import androidx.core.content.FileProvider
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.webkit.WebViewAssetLoader
import java.io.File

/**
 * Abre a Caderneta (pasta docs/ do repositório, empacotada como assets).
 * Os dados ficam no armazenamento do WebView, dentro do próprio app,
 * e continuam lá quando se instala uma versão nova por cima.
 */
class MainActivity : Activity() {

    private lateinit var web: WebView
    private var topInsetCss = 0f

    private fun sendInsets() {
        if (::web.isInitialized) {
            web.evaluateJavascript("window.__cadernetaInsets && window.__cadernetaInsets($topInsetCss)", null)
        }
    }
    private var fileCallback: ValueCallback<Array<Uri>>? = null

    private val assetLoader by lazy {
        WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Ecrã inteiro (obrigatório no Android 15): o conteúdo recebe margens das barras do sistema.
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val bg = getColor(R.color.fundo)

        val root = FrameLayout(this).apply { setBackgroundColor(bg) }
        web = WebView(this).apply { setBackgroundColor(bg) }
        root.addView(web, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        setContentView(root)

        // Tema escuro: ícones claros nas barras do sistema.
        WindowCompat.getInsetsController(window, root).apply {
            isAppearanceLightStatusBars = false
            isAppearanceLightNavigationBars = false
        }
        // O céu azul do topo passa por baixo da barra de estado: a altura dela vai para o CSS.
        ViewCompat.setOnApplyWindowInsetsListener(root) { v, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout())
            val ime = insets.getInsets(WindowInsetsCompat.Type.ime())
            v.setPadding(bars.left, 0, bars.right, maxOf(bars.bottom, ime.bottom))
            topInsetCss = bars.top / resources.displayMetrics.density
            sendInsets()
            WindowInsetsCompat.CONSUMED
        }

        web.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = false
            allowContentAccess = false
            userAgentString = "$userAgentString CadernetaApp/${BuildConfigInfo.VERSION}"
        }
        web.addJavascriptInterface(Ponte(), "CadernetaAndroid")

        web.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? =
                assetLoader.shouldInterceptRequest(request.url)

            override fun onPageFinished(view: WebView, url: String) {
                sendInsets()
            }

            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                if (request.url.host == HOST) return false
                // Links externos abrem no navegador.
                try { startActivity(Intent(Intent.ACTION_VIEW, request.url)) } catch (e: ActivityNotFoundException) { }
                return true
            }
        }

        web.webChromeClient = object : WebChromeClient() {
            // "Restaurar cópia": escolher o ficheiro .json no telemóvel.
            override fun onShowFileChooser(
                view: WebView,
                callback: ValueCallback<Array<Uri>>,
                params: FileChooserParams,
            ): Boolean {
                fileCallback?.onReceiveValue(null)
                fileCallback = callback
                val pick = Intent(Intent.ACTION_GET_CONTENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "*/*"
                }
                return try {
                    @Suppress("DEPRECATION")
                    startActivityForResult(Intent.createChooser(pick, "Escolher a cópia de segurança"), PEDIDO_FICHEIRO)
                    true
                } catch (e: ActivityNotFoundException) {
                    fileCallback = null
                    false
                }
            }
        }

        if (savedInstanceState == null || web.restoreState(savedInstanceState) == null) {
            web.loadUrl("https://$HOST/assets/index.html#lancar")
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        web.saveState(outState)
    }

    @Deprecated("Deprecated in Java")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == PEDIDO_FICHEIRO) {
            val uri = data?.data
            fileCallback?.onReceiveValue(if (resultCode == RESULT_OK && uri != null) arrayOf(uri) else null)
            fileCallback = null
            return
        }
        @Suppress("DEPRECATION")
        super.onActivityResult(requestCode, resultCode, data)
    }

    // Botão "voltar": fecha a janela aberta ou volta a Lançar; em Lançar, sai do app.
    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        web.evaluateJavascript("(window.__cadernetaVoltar && window.__cadernetaVoltar()) ? 'sim' : 'nao'") { r ->
            if (r?.contains("sim") != true) finish()
        }
    }

    override fun onDestroy() {
        web.destroy()
        super.onDestroy()
    }

    /** Chamado pelo JavaScript para partilhar a cópia de segurança e o ficheiro do Excel. */
    inner class Ponte {
        @JavascriptInterface
        fun partilharFicheiro(nome: String, tipo: String, conteudo: String) {
            runOnUiThread {
                try {
                    val pasta = File(cacheDir, "partilha").apply { mkdirs() }
                    val seguro = nome.replace(Regex("[^A-Za-z0-9._-]"), "_").ifBlank { "caderneta.txt" }
                    val ficheiro = File(pasta, seguro).apply { writeText(conteudo, Charsets.UTF_8) }
                    val uri = FileProvider.getUriForFile(this@MainActivity, "$packageName.ficheiros", ficheiro)
                    val enviar = Intent(Intent.ACTION_SEND).apply {
                        type = tipo
                        putExtra(Intent.EXTRA_STREAM, uri)
                        putExtra(Intent.EXTRA_SUBJECT, seguro)
                        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    }
                    startActivity(Intent.createChooser(enviar, "Guardar ou enviar $seguro"))
                } catch (e: Exception) {
                    Toast.makeText(this@MainActivity, "Não foi possível criar o ficheiro.", Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    private object BuildConfigInfo { const val VERSION = "1" }

    companion object {
        private const val HOST = "appassets.androidplatform.net"
        private const val PEDIDO_FICHEIRO = 41
    }
}
