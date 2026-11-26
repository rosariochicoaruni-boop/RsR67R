package mz.caderneta.gastos

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

/**
 * Lembrete diário: todos os dias à hora escolhida, se ainda não houver
 * nenhum lançamento com a data de hoje, aparece uma notificação.
 */
object Lembretes {
    private const val PREFS = "lembrete"
    private const val CANAL = "lembrete_diario"
    private const val ID_NOTIFICACAO = 1001

    private fun prefs(ctx: Context) = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    fun hoje(): String = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

    fun definir(ctx: Context, ativo: Boolean, hora: Int, minuto: Int) {
        prefs(ctx).edit()
            .putBoolean("ativo", ativo)
            .putInt("hora", hora.coerceIn(0, 23))
            .putInt("minuto", minuto.coerceIn(0, 59))
            .apply()
        agendar(ctx)
    }

    fun ativo(ctx: Context) = prefs(ctx).getBoolean("ativo", false)
    fun hora(ctx: Context) = prefs(ctx).getInt("hora", 20)
    fun minuto(ctx: Context) = prefs(ctx).getInt("minuto", 0)

    fun registarUltimo(ctx: Context, dia: String) {
        prefs(ctx).edit().putString("ultimo", dia).apply()
        // Se já anotou hoje, tira a notificação que estiver à mostra.
        if (dia == hoje()) ctx.getSystemService(NotificationManager::class.java)?.cancel(ID_NOTIFICACAO)
    }

    private fun intentAlarme(ctx: Context): PendingIntent {
        val i = Intent(ctx, LembreteReceiver::class.java).setAction(LembreteReceiver.ACAO)
        return PendingIntent.getBroadcast(ctx, 0, i, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
    }

    /** Agenda o próximo aviso (ou cancela, se estiver desligado). */
    fun agendar(ctx: Context) {
        val am = ctx.getSystemService(AlarmManager::class.java) ?: return
        val pi = intentAlarme(ctx)
        am.cancel(pi)
        if (!ativo(ctx)) return
        val c = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, hora(ctx))
            set(Calendar.MINUTE, minuto(ctx))
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
            if (timeInMillis <= System.currentTimeMillis() + 1000) add(Calendar.DAY_OF_YEAR, 1)
        }
        // Alarme não exato: não precisa de permissões especiais e poupa bateria.
        am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, c.timeInMillis, pi)
    }

    fun avisarSePreciso(ctx: Context) {
        if (!ativo(ctx)) return
        if (prefs(ctx).getString("ultimo", "") == hoje()) return
        val nm = ctx.getSystemService(NotificationManager::class.java) ?: return
        if (Build.VERSION.SDK_INT >= 26) {
            nm.createNotificationChannel(NotificationChannel(CANAL, "Lembrete diário", NotificationManager.IMPORTANCE_DEFAULT).apply {
                description = "Aviso à noite quando ainda não anotou nenhum gasto no dia"
            })
        }
        if (Build.VERSION.SDK_INT >= 33 &&
            ctx.checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) != android.content.pm.PackageManager.PERMISSION_GRANTED
        ) return
        val abrir = PendingIntent.getActivity(
            ctx, 0, Intent(ctx, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val b = if (Build.VERSION.SDK_INT >= 26) android.app.Notification.Builder(ctx, CANAL)
        else @Suppress("DEPRECATION") android.app.Notification.Builder(ctx)
        val n = b.setSmallIcon(R.drawable.ic_notif)
            .setContentTitle("Já anotou os gastos de hoje?")
            .setContentText("Abra a Caderneta e registe o que gastou. Leva poucos segundos.")
            .setContentIntent(abrir)
            .setAutoCancel(true)
            .build()
        nm.notify(ID_NOTIFICACAO, n)
    }
}

class LembreteReceiver : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent) {
        when (intent.action) {
            ACAO -> {
                Lembretes.avisarSePreciso(ctx)
                Lembretes.agendar(ctx) // amanhã
            }
            Intent.ACTION_BOOT_COMPLETED, Intent.ACTION_MY_PACKAGE_REPLACED -> Lembretes.agendar(ctx)
        }
    }

    companion object {
        const val ACAO = "mz.caderneta.gastos.LEMBRETE"
    }
}
