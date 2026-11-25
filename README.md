# Caderneta de Gastos

App pessoal para anotar gastos e entradas em meticais (MT) e ver para onde vai o dinheiro.

- Digite o valor (pode somar com `+`) e toque na categoria. O total soma sozinho.
- Resumo do dia, da semana e do mês, meta de poupança e comparação com o mês anterior.
- Funciona sem internet. Os dados ficam só no telemóvel: use **Ajustes › Fazer cópia** regularmente.

## Instalar no Android
Descarregue **[Caderneta.apk](../../releases/latest/download/Caderneta.apk)** no telemóvel, abra o ficheiro
e permita a instalação de "fontes desconhecidas" quando o Android pedir.
As versões novas instalam por cima e mantêm os dados.

## Estrutura
| Pasta | O que é |
|---|---|
| `docs/` | O app (HTML, CSS, JavaScript). Também pode ser publicado como site no GitHub Pages. |
| `app/` | Projeto Android que empacota `docs/` num APK. |
| `keystore/` | Chave de assinatura do APK (tem de ser sempre a mesma para as atualizações instalarem por cima). |
| `.github/workflows/` | Compila o APK e publica-o em *Releases* a cada envio para `main`. |

## Publicar uma nova versão
1. Altere os ficheiros em `docs/`.
2. Aumente `APP_VERSION` em `docs/app.js` e o número em `CACHE` em `docs/sw.js`.
3. Aumente `versionCode` (+1) e `versionName` em `app/build.gradle.kts`.
4. Envie para `main`. Em poucos minutos o novo `Caderneta.apk` aparece em *Releases*.

Envios para outros ramos geram uma **prévia** (pré-lançamento `previa`) para testar antes de juntar ao `main`.
