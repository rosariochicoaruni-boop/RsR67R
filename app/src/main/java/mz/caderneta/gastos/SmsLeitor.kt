package mz.caderneta.gastos

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.provider.Telephony
import org.json.JSONArray
import org.json.JSONObject

/**
 * Leitura de SMS de movimentos (e-Mola, M-Pesa, banco).
 * As mensagens ficam numa fila só neste telemóvel; a Caderneta lê-a ao abrir
 * e cria os lançamentos. Nada é enviado para fora.
 */
object SmsLeitor {
    private const val PREFS = "sms"
    private const val CANAL = "movimentos_sms"
    private const val ID_NOTIFICACAO = 2001
    private const val MAX_FILA = 300

    private fun prefs(ctx: Context) = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    fun ativo(ctx: Context) = prefs(ctx).getBoolean("ativo", false)
    fun definir(ctx: Context, ativo: Boolean) = prefs(ctx).edit().putBoolean("ativo", ativo).apply()

    /** Só interessam mensagens com um valor em MT e um saldo, ou de um remetente conhecido. */
    fun relevante(remetente: String, corpo: String): Boolean {
        val r = remetente.lowercase()
        val c = corpo.lowercase()
        if (c.contains("otp") && !c.contains("saldo")) return false
        val temValor = Regex("""\d\s?mt\b""").containsMatchIn(c)
        val conhecido = listOf("mola", "pesa", "bci", "bim", "millennium", "standard", "absa", "moza", "banco", "fnb", "nedbank", "letshego", "ecobank")
            .any { r.contains(it) || c.contains(it) }
        return temValor && (conhecido || c.contains("saldo"))
    }

    @Synchronized
    fun guardar(ctx: Context, remetente: String, corpo: String, quando: Long) {
        val fila = try { JSONArray(prefs(ctx).getString("fila", "[]")) } catch (e: Exception) { JSONArray() }
        fila.put(JSONObject().put("from", remetente).put("body", corpo).put("ts", quando))
        val cortada = JSONArray()
        val inicio = maxOf(0, fila.length() - MAX_FILA)
        for (i in inicio until fila.length()) cortada.put(fila.get(i))
        prefs(ctx).edit().putString("fila", cortada.toString()).apply()
    }

    @Synchronized
    fun pendentes(ctx: Context): String = prefs(ctx).getString("fila", "[]") ?: "[]"

    @Synchronized
    fun limpar(ctx: Context) = prefs(ctx).edit().putString("fila", "[]").apply()

    /** Mensagens já recebidas nos últimos [dias] dias (para a primeira importação). */
    fun antigas(ctx: Context, dias: Int): String {
        val out = JSONArray()
        val desde = System.currentTimeMillis() - dias.coerceIn(1, 365) * 86_400_000L
        try {
            ctx.contentResolver.query(
                Telephony.Sms.Inbox.CONTENT_URI,
                arrayOf(Telephony.Sms.ADDRESS, Telephony.Sms.BODY, Telephony.Sms.DATE),
                "${Telephony.Sms.DATE} > ?", arrayOf(desde.toString()),
                "${Telephony.Sms.DATE} ASC",
            )?.use { c ->
                while (c.moveToNext() && out.length() < 1000) {
                    val de = c.getString(0) ?: ""
                    val corpo = c.getString(1) ?: ""
                    if (relevante(de, corpo)) out.put(JSONObject().put("from", de).put("body", corpo).put("ts", c.getLong(2)))
                }
            }
        } catch (e: SecurityException) {
            // sem permissão: devolve lista vazia
        }
        return out.toString()
    }

    fun avisar(ctx: Context, remetente: String) {
        val nm = ctx.getSystemService(NotificationManager::class.java) ?: return
        if (Build.VERSION.SDK_INT >= 26) {
            nm.createNotificationChannel(NotificationChannel(CANAL, "Movimentos lidos das SMS", NotificationManager.IMPORTANCE_LOW))
        }
        if (Build.VERSION.SDK_INT >= 33 &&
            ctx.checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) != android.content.pm.PackageManager.PERMISSION_GRANTED
        ) return
        val abrir = PendingIntent.getActivity(
            ctx, 1, Intent(ctx, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val b = if (Build.VERSION.SDK_INT >= 26) android.app.Notification.Builder(ctx, CANAL)
        else @Suppress("DEPRECATION") android.app.Notification.Builder(ctx)
        val n = b.setSmallIcon(R.drawable.ic_notif)
            .setContentTitle("Novo movimento: $remetente")
            .setContentText("Toque para ver na Caderneta e escolher a categoria.")
            .setContentIntent(abrir)
            .setAutoCancel(true)
            .build()
        nm.notify(ID_NOTIFICACAO, n)
    }
}

class SmsReceiver : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent) {
        if (intent.action != Telephony.Sms.Intents.SMS_RECEIVED_ACTION) return
        if (!SmsLeitor.ativo(ctx)) return
        val partes = Telephony.Sms.Intents.getMessagesFromIntent(intent) ?: return
        // Uma SMS longa chega em várias partes: juntar por remetente.
        val porRemetente = LinkedHashMap<String, StringBuilder>()
        var quando = System.currentTimeMillis()
        for (p in partes) {
            if (p == null) continue
            val de = p.originatingAddress ?: ""
            porRemetente.getOrPut(de) { StringBuilder() }.append(p.messageBody ?: "")
            quando = p.timestampMillis
        }
        for ((de, corpo) in porRemetente) {
            val texto = corpo.toString()
            if (SmsLeitor.relevante(de, texto)) {
                SmsLeitor.guardar(ctx, de, texto, quando)
                SmsLeitor.avisar(ctx, de)
            }
        }
    }
}
