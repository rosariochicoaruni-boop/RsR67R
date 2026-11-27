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

## Leitura de SMS (APK)
Em **Ajustes › Ler SMS**, a Caderneta lê as SMS de movimentos do e-Mola (e, de forma experimental, M-Pesa e bancos),
cria os lançamentos e acerta o saldo da carteira com o saldo da mensagem. As mensagens ficam só no telemóvel.
Os formatos reconhecidos estão em `parseSms()` (`docs/app.js`).

## Integração com o LAF financeiro (APK)
Em **Ajustes › LAF financeiro**: endereço do servidor (ex.: `cotacoes.lafwoodworking.com`) e a mesma
chave de acesso (`API_KEY`) do app LAF. Cada gasto e cada entrada é enviado ao `api.php` do LAF
(acção `sync`) como registo `expenses`/`payments`, com o tipo "Pessoal – categoria". Edições e apagados
também são enviados; transferências entre carteiras e metas não. O pedido é feito pelo APK (`lafPedido`).
