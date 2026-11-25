/* Caderneta de Gastos — os dados ficam guardados no próprio telemóvel (localStorage). */
(() => {
  "use strict";

  // ================= Ícones (linha branca) =================
  const ICONS = {
    alim: '<path d="M7 3v7M5 3v4.5a2 2 0 0 0 4 0V3M7 10v11"/><path d="M17 21V3c-2.2 1.2-3.3 3.4-3.3 6.2 0 2.3 1.1 3.8 3.3 3.8"/>',
    merc: '<path d="M3 4h2.2l2.3 11h10.8l2-7.5H6.3"/><circle cx="9.5" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>',
    transp: '<rect x="4.5" y="3.5" width="15" height="13" rx="3"/><path d="M4.5 10.5h15M8 16.5v3M16 16.5v3M8 13.5h.01M16 13.5h.01"/>',
    casa: '<path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5M10 20v-5.5h4V20"/>',
    energ: '<path d="M13 3L5.5 13.5H11L10 21l7.5-10.5H12L13 3z"/>',
    cred: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    saude: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/><path d="M12 10.5v4M10 12.5h4"/>',
    famil: '<circle cx="9" cy="8" r="3"/><path d="M3.5 20c.4-3.3 2.6-5.5 5.5-5.5s5.1 2.2 5.5 5.5"/><path d="M15.5 5.3a3 3 0 0 1 0 5.4M17.5 14.8c1.7.7 2.8 2.5 3 5.2"/>',
    lazer: '<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12"/><path d="M12 8C10.6 5 7 4.6 7 6.5S10 8 12 8zM12 8c1.4-3 5-3.4 5-1.5S14 8 12 8z"/>',
    outros: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/>',
    salario: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18M11 12.5v2h2v-2"/>',
    negocio: '<path d="M4 9l1.2-5h13.6L20 9M4 9v11h16V9"/><path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9M10 20v-5h4v5"/>',
    outent: '<circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/>',
    tag: '<path d="M3.5 12.5V4h8.5l8.5 8.5-8 8-9-8z"/><circle cx="8" cy="8.5" r="1.3"/>',
    gift: '<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12"/>',
    book: '<path d="M4 5.5A2 2 0 0 1 6 3.5h13v15H6a2 2 0 0 0-2 2z"/><path d="M4 20.5V5.5M8 7.5h7"/>',
    cafe: '<path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8zM17 9.5h1.5a2.5 2.5 0 0 1 0 5H17M7 3.5v2M10.5 3.5v2M14 3.5v2"/>',
    roupa: '<path d="M8.5 3.5L4 6l1.8 4 2-.8V20.5h8.4V9.2l2 .8L20 6l-4.5-2.5a3.5 3.5 0 0 1-7 0z"/>',
    igreja: '<path d="M12 2.5v5M9.5 5h5M5.5 21v-8L12 8l6.5 5v8z"/><path d="M10 21v-4h4v4"/>',
    // ícones da interface
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    list: '<path d="M8 6.5h12M8 12h12M8 17.5h12M4 6.5h.01M4 12h.01M4 17.5h.01"/>',
    shield: '<path d="M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z"/><path d="M9 12l2 2 4-4"/>',
    doc: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M3.5 10h17M7.5 14.5h4"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.3c-.5-1-1.6-1.6-2.8-1.6-1.6 0-2.8.9-2.8 2.1 0 2.8 5.7 1.6 5.7 4.4 0 1.2-1.2 2.1-2.9 2.1-1.3 0-2.4-.6-2.9-1.6M12 6.2v1.5M12 16.3v1.5"/>'
  };
  const CAT_ICON_CHOICES = ["alim", "merc", "transp", "casa", "energ", "cred", "saude", "famil", "lazer", "cafe", "roupa", "book", "igreja", "gift", "salario", "negocio", "outent", "outros", "tag"];
  const svg = (name, extra = "") => {
    const s = document.createElement("span");
    s.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" ${extra}>${ICONS[name] || ICONS.tag}</svg>`;
    return s.firstChild;
  };

  // ================= Dados base =================
  const KEY = "caderneta:v1";
  const PAYS = ["Dinheiro", "M-Pesa", "e-Mola", "mKesh", "Banco"];
  const DEFAULT_CATS = {
    out: [
      ["alim", "Alimentação", "#ff9f5a"], ["merc", "Mercado", "#4fd1a1"], ["transp", "Transporte", "#a58bff"],
      ["casa", "Casa", "#5b9dff"], ["energ", "Energia e água", "#ffd25a"], ["cred", "Crédito e dados", "#4cc9f0"],
      ["saude", "Saúde", "#ff6b8b"], ["famil", "Família", "#f6a6ff"], ["lazer", "Lazer", "#7ee0ff"], ["outros", "Outros", "#9aa6c8"]
    ],
    in: [["salario", "Salário", "#5fe3a1"], ["negocio", "Negócio / biscate", "#9be36f"], ["outent", "Outras entradas", "#7fd8c0"]]
  };

  function freshData() {
    const cats = {};
    for (const t of ["out", "in"]) cats[t] = DEFAULT_CATS[t].map(([id, name, color]) => ({ id, name, color, icon: id }));
    return { version: 1, entries: [], cats, settings: { saveGoal: 0, lastBackup: 0 } };
  }
  function isValidData(d) {
    return d && d.version === 1 && Array.isArray(d.entries) && d.cats && Array.isArray(d.cats.out) && Array.isArray(d.cats.in) && d.settings;
  }
  // Dados da versão 1.0: as categorias ainda não tinham ícone.
  const OLD_COLORS = { alim: "#d9752a", merc: "#2f9568", transp: "#7259c4", casa: "#4874a6", energ: "#b8941c", cred: "#2f93aa", saude: "#c9404f", famil: "#a85f22", lazer: "#984a8c", outros: "#7d8a85", salario: "#187a49", negocio: "#36985f", outent: "#5fae82" };
  function migrate(d) {
    const newColor = {}; for (const t of ["out", "in"]) for (const [id, , color] of DEFAULT_CATS[t]) newColor[id] = color;
    for (const t of ["out", "in"]) for (const c of d.cats[t]) {
      if (!c.icon) c.icon = ICONS[c.id] ? c.id : "tag";
      // cores antigas (tema claro) passam para as do tema azul, se não foram mudadas
      if (OLD_COLORS[c.id] && c.color === OLD_COLORS[c.id]) c.color = newColor[c.id];
    }
    return d;
  }
  function loadData() {
    try { const d = JSON.parse(localStorage.getItem(KEY)); if (isValidData(d)) return migrate(d); } catch (e) { /* sem dados */ }
    return freshData();
  }
  let data = loadData();
  let persistAsked = false;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch (e) { toast("Não foi possível guardar. O armazenamento do telemóvel pode estar cheio."); }
    if (!persistAsked && navigator.storage && navigator.storage.persist) { persistAsked = true; navigator.storage.persist().catch(() => {}); }
  }

  // ================= Utilidades =================
  const $ = (id) => document.getElementById(id);
  const el = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    for (const c of kids) if (c != null && c !== false) n.append(c);
    return n;
  };
  const pad = (n) => String(n).padStart(2, "0");
  const isoOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => isoOf(new Date());
  const monthOf = (iso) => iso.slice(0, 7);
  const shiftMonth = (m, k) => { const [y, mo] = m.split("-").map(Number); const d = new Date(y, mo - 1 + k, 1); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; };
  const daysIn = (m) => { const [y, mo] = m.split("-").map(Number); return new Date(y, mo, 0).getDate(); };
  const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const MONTHS_S = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const monthName = (m) => { const [y, mo] = m.split("-").map(Number); const s = MONTHS[mo - 1]; return s[0].toUpperCase() + s.slice(1) + " de " + y; };
  const dayName = (iso) => {
    const [y, mo, d] = iso.split("-").map(Number);
    if (iso === today()) return "Hoje";
    const yd = new Date(); yd.setDate(yd.getDate() - 1);
    if (iso === isoOf(yd)) return "Ontem";
    return `${WEEKDAYS[new Date(y, mo - 1, d).getDay()]}, ${d} de ${MONTHS_S[mo - 1]}`;
  };
  const weekStart = () => { const d = new Date(); const wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return isoOf(d); };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const timeOf = (ts) => { if (!ts) return ""; const d = new Date(ts); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };

  // Formato moçambicano: 1 250,50 MT (sem casas decimais quando o valor é inteiro)
  function fmtNum(cents) {
    const neg = cents < 0; cents = Math.abs(Math.round(cents));
    const int = Math.floor(cents / 100), dec = cents % 100;
    const s = String(int).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (neg ? "−" : "") + s + (dec ? "," + pad(dec) : "");
  }
  const fmt = (cents) => fmtNum(cents) + " MT";
  // Valor com as casas decimais e "MT" esbatidos, como no saldo grande
  function moneyEl(cents, sign = "") {
    const neg = cents < 0; const abs = Math.abs(Math.round(cents));
    const int = Math.floor(abs / 100), dec = abs % 100;
    const s = String(int).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return el("span", { class: "money num" }, (neg ? "−" : sign) + s, dec ? el("span", { class: "dec", text: "," + pad(dec) }) : null, el("span", { class: "cur", text: "MT" }));
  }

  function parseMoney(s) {
    s = String(s).trim().replace(/[\s ]|MT|MZN/gi, "");
    if (!s) return null;
    if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
    else if ((s.match(/\./g) || []).length > 1) s = s.replace(/\./g, "");
    const v = Number(s);
    if (!isFinite(v) || v <= 0) return null;
    return Math.round(v * 100);
  }

  const catList = (type) => data.cats[type];
  const catById = (type, id) => catList(type).find((c) => c.id === id) || { id, name: "Sem categoria", color: "#9aa6c8", icon: "tag" };
  const sum = (list) => list.reduce((a, e) => a + e.v, 0);
  const inMonth = (m) => data.entries.filter((e) => monthOf(e.d) === m);

  function catIcon(c, cls = "tx-ic") {
    return el("span", { class: cls }, svg(c.icon), el("i", { style: `background:${c.color}` }));
  }

  // ================= Aviso (toast) =================
  let toastTimer;
  function toast(text, action) {
    $("toastText").textContent = text;
    const b = $("toastAction");
    if (action) { b.textContent = action[0]; b.onclick = () => { action[1](); $("toast").hidden = true; }; b.hidden = false; }
    else b.hidden = true;
    $("toast").hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => ($("toast").hidden = true), action ? 5000 : 2600);
  }

  // ================= Navegação =================
  const VIEWS = ["lancar", "resumo", "historico", "ajustes"];
  let view = "lancar";
  let viewMonth = monthOf(today());
  function route() {
    const h = location.hash.replace("#", "");
    view = VIEWS.includes(h) ? h : "lancar";
    for (const k of VIEWS) $("v-" + k).hidden = k !== view;
    document.querySelectorAll(".tabs a").forEach((a) => { if (a.dataset.tab === view) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    $("main").scrollTop = 0;
    renderView();
  }
  window.addEventListener("hashchange", route);
  document.querySelectorAll(".mbtn").forEach((b) => b.addEventListener("click", () => { viewMonth = shiftMonth(viewMonth, Number(b.dataset.mdelta)); histFilter = null; renderView(); }));

  function renderView() {
    document.querySelectorAll(".mlabel").forEach((n) => (n.textContent = monthName(viewMonth)));
    if (view === "lancar") renderLaunch();
    else if (view === "resumo") renderResumo();
    else if (view === "historico") renderHist();
    else renderAjustes();
  }

  // ================= Lançar =================
  const launch = { type: "out", expr: "", pay: "Dinheiro" };

  function termsOf(expr) { return expr.split("+").filter((s) => s !== ""); }
  function termCents(t) { const v = parseMoney(t.endsWith(",") ? t.slice(0, -1) : t); return v || 0; }
  function exprTotal() { return termsOf(launch.expr).reduce((a, t) => a + termCents(t), 0); }

  function pressKey(k) {
    let e = launch.expr;
    const cur = e.split("+").pop();
    if (/^\d$/.test(k)) {
      if (cur.includes(",")) { if (cur.split(",")[1].length >= 2) return; }
      else if (cur.replace(/^0+/, "").length >= 9) return;
      if (cur === "0") e = e.slice(0, -1);
      e += k;
    } else if (k === "000") {
      if (!cur || cur.includes(",") || cur === "0" || cur.length >= 7) return;
      e += "000";
    } else if (k === ",") {
      if (cur.includes(",")) return;
      e += cur ? "," : "0,";
    } else if (k === "+") {
      if (!cur) return;
      if (e.endsWith(",")) e = e.slice(0, -1);
      e += "+";
    } else if (k === "back") e = e.slice(0, -1);
    else if (k === "clear") e = "";
    launch.expr = e;
    renderDisplay();
  }

  function renderDisplay() {
    const total = exprTotal();
    const terms = termsOf(launch.expr);
    $("total").textContent = fmtNum(total);
    $("expr").textContent = terms.length > 1 || launch.expr.endsWith("+") ? terms.map((t) => fmtNum(termCents(t))).join(" + ") + (launch.expr.endsWith("+") ? " +" : "") : " ";
    const d = $("display"); d.classList.toggle("in", launch.type === "in");
    if (!d.classList.contains("shake")) $("hint").textContent = total ? `Toque na categoria para guardar ${launch.type === "out" ? "o gasto" : "a entrada"}` : "Digite o valor e toque na categoria";
  }

  function setLaunchType(t) {
    launch.type = t;
    $("typeOut").setAttribute("aria-pressed", String(t === "out"));
    $("typeIn").setAttribute("aria-pressed", String(t === "in"));
    renderLaunch();
  }

  function greeting() {
    const h = new Date().getHours();
    return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  }

  function renderLaunch() {
    $("greeting").textContent = greeting();
    const spentToday = sum(data.entries.filter((e) => e.t === "out" && e.d === today()));
    $("todayAmount").replaceChildren(moneyEl(spentToday));

    const grid = $("catGrid"); grid.replaceChildren();
    const cats = catList(launch.type);
    grid.classList.toggle("few", cats.length <= 6);
    for (const c of cats) grid.append(el("button", { type: "button", class: "action", onclick: () => commit(c) }, svg(c.icon), el("span", { text: c.name })));

    const pc = $("payChips"); pc.replaceChildren();
    for (const p of PAYS) pc.append(el("button", { type: "button", class: "chip", "aria-pressed": String(launch.pay === p), onclick: () => { launch.pay = p; renderLaunch(); } }, p));
    if (!$("date").value) $("date").value = today();
    $("date").max = today();
    const d = $("date").value;
    $("moreSummary").textContent = `${launch.pay} · ${d === today() ? "hoje" : dayName(d).toLowerCase()}${$("note").value ? " · " + $("note").value : ""}`;
    renderDisplay();
  }

  function shakeDisplay(msg) {
    const d = $("display"); d.classList.remove("shake"); void d.offsetWidth; d.classList.add("shake");
    $("hint").textContent = msg;
    setTimeout(() => { d.classList.remove("shake"); renderDisplay(); }, 1600);
  }

  function commit(cat) {
    const v = exprTotal();
    if (!v) { shakeDisplay("Primeiro digite o valor"); return; }
    const d = $("date").value || today();
    const entry = { id: uid(), t: launch.type, v, cat: cat.id, pay: launch.pay, note: $("note").value.trim(), d, ts: Date.now() };
    data.entries.push(entry); save();
    launch.expr = ""; $("note").value = ""; $("date").value = today(); launch.pay = "Dinheiro"; $("more").open = false;
    if (navigator.vibrate) navigator.vibrate(15);
    renderLaunch();
    toast(`${fmt(v)} em ${cat.name}`, ["Desfazer", () => { data.entries = data.entries.filter((x) => x.id !== entry.id); save(); renderView(); toast("Lançamento desfeito"); }]);
  }

  $("moreToggle").onclick = () => { $("more").open = !$("more").open; };
  $("more").addEventListener("toggle", () => $("moreToggle").setAttribute("aria-expanded", String($("more").open)));
  $("typeOut").onclick = () => setLaunchType("out");
  $("typeIn").onclick = () => setLaunchType("in");
  $("keypad").addEventListener("click", (e) => { const b = e.target.closest("button[data-k]"); if (b) pressKey(b.dataset.k); });
  $("note").addEventListener("input", renderLaunch);
  $("date").addEventListener("change", renderLaunch);
  document.addEventListener("keydown", (e) => {
    if (view !== "lancar" || e.target.matches("input, select, textarea") || $("editDlg").open) return;
    if (/^\d$/.test(e.key)) pressKey(e.key);
    else if (e.key === "," || e.key === ".") pressKey(",");
    else if (e.key === "+") pressKey("+");
    else if (e.key === "Backspace") pressKey("back");
    else if (e.key === "Escape") pressKey("clear");
    else return;
    e.preventDefault();
  });

  // ================= Resumo =================
  function renderResumo() {
    const body = $("resumoBody"); body.replaceChildren();
    const m = viewMonth, isCur = m === monthOf(today());
    const list = inMonth(m);
    const outs = list.filter((e) => e.t === "out"), ins = list.filter((e) => e.t === "in");
    const S = sum(outs), E = sum(ins), G = data.settings.saveGoal || 0;
    const left = E - S;

    // Hoje / semana / mês
    if (isCur) {
      const t = today(), ws = weekStart();
      body.append(el("div", { class: "kpis" },
        kpi("Hoje", sum(outs.filter((e) => e.d === t))),
        kpi("Esta semana", sum(data.entries.filter((e) => e.t === "out" && e.d >= ws && e.d <= t))),
        kpi("Este mês", S)));
    }

    // Cartão de vidro: sobra do mês
    const [y, mo] = m.split("-").map(Number);
    body.append(el("div", { class: "glass-card bank-card" },
      el("div", { class: "bank-top" }, el("span", { class: "bank-mark" }, svg("coin")), el("span", { class: "bank-month", text: `${MONTHS_S[mo - 1]} ${y}` })),
      el("div", {}, el("div", { class: "bank-label", text: "Sobra do mês" }),
        el("div", { class: "bank-number" }, fmtNum(left), el("span", { class: "cur", text: "MT" }))),
      el("div", { class: "bank-bottom" },
        el("span", {}, "Entradas", el("b", { text: fmt(E) })),
        el("span", { style: "text-align:right" }, "Gastos", el("b", { text: fmt(S) })))));

    // Ações rápidas
    body.append(el("div", { class: "controls" },
      control("plus", "Novo gasto", () => { setLaunchType("out"); location.hash = "#lancar"; }),
      control("outent", "Nova entrada", () => { setLaunchType("in"); location.hash = "#lancar"; }),
      control("list", "Histórico", () => { location.hash = "#historico"; }),
      control("shield", "Cópia", doBackup)));

    renderBackupNag(body);

    if (!data.entries.length) {
      body.append(el("div", { class: "panel empty" },
        el("strong", { text: "Ainda não há lançamentos" }),
        el("span", { text: "Vá a Lançar, digite um valor e toque numa categoria. O resumo aparece aqui." }),
        el("a", { class: "btn primary", href: "#lancar", text: "Fazer o primeiro lançamento" })));
      return;
    }

    // Dois mosaicos: gasto do mês e poupança
    const tiles = el("div", { class: "tiles" });
    if (G && E) {
      const canSpend = Math.max(0, E - G);
      const pct = canSpend ? S / canSpend : (S ? 2 : 0);
      let note;
      if (S <= canSpend) {
        const days = isCur ? daysIn(m) - Number(today().slice(8)) + 1 : 0;
        note = isCur ? el("span", { class: "tile-note", text: `≈ ${fmt(Math.floor((canSpend - S) / days / 100) * 100)} por dia` }) : el("span", { class: "tile-note good", text: "Dentro do limite" });
      } else note = el("span", { class: "tile-note bad", text: `Passou ${fmt(S - canSpend)}` });
      tiles.append(tile("Gasto do mês", S, canSpend, pct, note));
      const saved = Math.max(0, left);
      tiles.append(tile("Poupança", saved, G, G ? saved / G : 0,
        el("span", { class: "tile-note " + (saved >= G ? "good" : ""), text: saved >= G ? "Meta cumprida" : `Faltam ${fmt(G - saved)}` }), true));
    } else {
      tiles.append(el("div", { class: "tile" }, el("span", { class: "tile-title", text: "Gasto do mês" }), el("span", { class: "tile-value", text: fmt(S) }),
        el("span", { class: "tile-note", text: `${outs.length} lançamento${outs.length === 1 ? "" : "s"}` })));
      tiles.append(el("div", { class: "tile" }, el("span", { class: "tile-title", text: "Poupança" }),
        el("span", { class: "tile-note", text: !G ? "Defina quanto quer guardar por mês." : "Registe as entradas do mês para ver o progresso." }),
        !G ? el("a", { class: "link", href: "#ajustes", text: "Definir meta" }) : el("a", { class: "link", href: "#lancar", onclick: () => setLaunchType("in"), text: "Registar entrada" })));
    }
    body.append(tiles);

    // Linha "extrato"
    body.append(el("a", { class: "row-card", href: "#historico" }, el("span", { class: "ic-box" }, svg("doc")), el("span", { class: "t", text: `Lançamentos de ${MONTHS[mo - 1]}` }), el("span", { class: "link", text: "Ver" })));

    // Categorias
    const prevM = shiftMonth(m, -1);
    const prev = inMonth(prevM).filter((e) => e.t === "out");
    const byCat = {}, byPrev = {};
    for (const e of outs) byCat[e.cat] = (byCat[e.cat] || 0) + e.v;
    for (const e of prev) byPrev[e.cat] = (byPrev[e.cat] || 0) + e.v;
    const rows = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    const catPanel = el("section", { class: "panel" }, el("h2", { class: "panel-title", text: "Para onde foi o dinheiro" }));
    if (!rows.length) catPanel.append(el("p", { class: "muted", text: "Nenhum gasto neste mês." }));
    else {
      const top = catById("out", rows[0][0]);
      catPanel.append(el("p", { class: "muted", text: `${top.name} é o seu maior gasto: ${Math.round(rows[0][1] / S * 100)}% do mês.` }));
      const max = rows[0][1];
      const wrap = el("div");
      for (const [id, v] of rows) {
        const c = catById("out", id);
        const p = byPrev[id] || 0;
        let delta = null;
        if (prev.length) {
          if (!p) delta = el("span", { class: "up", text: "novo" });
          else { const ch = Math.round((v - p) / p * 100); delta = el("span", { class: ch > 0 ? "up" : ch < 0 ? "down" : "", text: ch === 0 ? "igual" : `${ch > 0 ? "▲" : "▼"} ${Math.abs(ch)}% vs ${MONTHS_S[Number(prevM.slice(5)) - 1]}` }); }
        }
        wrap.append(el("div", { class: "tx" }, catIcon(c),
          el("div", {}, el("div", { class: "t", text: c.name }),
            el("div", { class: "s" }, el("span", { text: `${Math.round(v / S * 100)}% do mês` }), delta ? el("span", { class: "dotsep" }, delta) : null),
            el("div", { class: "bar" }, el("span", { style: `width:${(v / max * 100).toFixed(1)}%;background:${c.color}` }))),
          el("span", { class: "amt", text: fmt(v) })));
      }
      catPanel.append(wrap);
    }
    body.append(catPanel);
    body.append(monthsChart(m));
  }

  function kpi(label, v) { return el("div", { class: "kpi" }, el("span", { class: "label", text: label }), el("span", { class: "v num", text: fmt(v) })); }
  function control(icon, label, fn) { return el("button", { type: "button", class: "control", onclick: fn }, el("span", { class: "bubble" }, svg(icon)), el("span", { text: label })); }
  function tile(title, value, of, pct, note, overIsGood = false) {
    const p = Math.max(0, pct);
    const shown = Math.min(100, Math.round(p * 100));
    const pillPos = shown < 20 ? "flex-start" : shown > 80 ? "flex-end" : "center";
    return el("div", { class: "tile" },
      el("span", { class: "tile-title", text: title }),
      el("span", { class: "tile-value num" }, fmtNum(value), " ", el("small", { text: "/ " + fmtNum(of) })),
      el("div", { class: "meter-wrap", style: `--pill-pos:${pillPos}` },
        el("span", { class: "pill-pct", text: Math.round(p * 100) + "%" }),
        el("div", { class: "meter" + (overIsGood ? (p >= 1 ? " full" : "") : (p > 1 ? " over" : p > 0.85 ? " warn" : "")) }, el("span", { style: `width:${shown}%` }))),
      note);
  }

  function monthsChart(m) {
    const months = []; for (let i = 5; i >= 0; i--) months.push(shiftMonth(m, -i));
    const vals = months.map((mm) => { const l = inMonth(mm); return { m: mm, out: sum(l.filter((e) => e.t === "out")), in: sum(l.filter((e) => e.t === "in")) }; });
    const max = Math.max(1, ...vals.map((v) => Math.max(v.out, v.in)));
    const W = 340, H = 160, T = 12, B = 24, L = 4, R = 4;
    const colW = (W - L - R) / 6, bw = colW * 0.28;
    const NS = "http://www.w3.org/2000/svg";
    const mk = (tag, a, text) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); if (text != null) e.textContent = text; return e; };
    const s = mk("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Entradas e gastos dos últimos seis meses" });
    for (let g = 1; g <= 3; g++) { const yy = T + (H - T - B) * (1 - g / 3); s.append(mk("line", { x1: L, x2: W - R, y1: yy, y2: yy, stroke: "rgba(160,185,255,.08)" })); }
    s.append(mk("line", { x1: L, x2: W - R, y1: H - B, y2: H - B, stroke: "rgba(160,185,255,.18)" }));
    const h = (v) => v ? Math.max(3, v / max * (H - T - B)) : 0;
    vals.forEach((v, i) => {
      const cx = L + colW * i + colW / 2;
      const cur = v.m === m;
      s.append(mk("rect", { x: cx - bw - 1.5, y: H - B - h(v.in), width: bw, height: h(v.in), rx: 3, fill: "#5fe3a1", opacity: cur ? 1 : 0.45 }));
      s.append(mk("rect", { x: cx + 1.5, y: H - B - h(v.out), width: bw, height: h(v.out), rx: 3, fill: "#4f86ff", opacity: cur ? 1 : 0.45 }));
      const lbl = mk("text", { x: cx, y: H - 7, "text-anchor": "middle" }, MONTHS_S[Number(v.m.slice(5)) - 1]);
      if (cur) lbl.setAttribute("style", "fill:#fff;font-weight:600");
      s.append(lbl);
    });
    const total = vals.reduce((a, v) => a + (v.in - v.out), 0);
    return el("section", { class: "panel" },
      el("h2", { class: "panel-title", text: "Últimos 6 meses" }),
      el("div", { class: "legend" }, el("span", {}, el("i", { style: "background:#5fe3a1" }), "Entradas"), el("span", {}, el("i", { style: "background:#4f86ff" }), "Gastos")),
      el("div", { class: "chart" }, s),
      vals.some((v) => v.in || v.out) ? el("p", { class: "muted", text: `Nestes 6 meses sobrou ${fmt(total)} no total.` }) : null);
  }

  function renderBackupNag(box) {
    if (data.entries.length < 5) return;
    const last = data.settings.lastBackup || 0;
    const days = Math.floor((Date.now() - last) / 86400000);
    if (last && days < 14) return;
    box.append(el("div", { class: "nag" },
      el("span", { text: last ? `Já passaram ${days} dias desde a última cópia de segurança.` : "Ainda não fez nenhuma cópia de segurança." }),
      el("button", { type: "button", class: "btn small primary", text: "Fazer cópia", onclick: doBackup })));
  }

  // ================= Histórico =================
  let histFilter = null;
  function renderHist() {
    const list = inMonth(viewMonth);
    const fbox = $("histFilter"); fbox.replaceChildren();
    const used = [...new Set(list.map((e) => e.t + ":" + e.cat))];
    if (used.length > 1) {
      fbox.append(el("button", { type: "button", class: "chip", "aria-pressed": String(!histFilter), onclick: () => { histFilter = null; renderHist(); } }, "Todos"));
      for (const key of used) {
        const [t, id] = key.split(":"); const c = catById(t, id);
        fbox.append(el("button", { type: "button", class: "chip", "aria-pressed": String(histFilter === key), onclick: () => { histFilter = histFilter === key ? null : key; renderHist(); } },
          el("span", { style: `width:8px;height:8px;border-radius:50%;background:${c.color}` }), c.name));
      }
    }
    const box = $("histList"); box.replaceChildren();
    let items = histFilter ? list.filter((e) => e.t + ":" + e.cat === histFilter) : list;
    if (!items.length) {
      box.append(el("div", { class: "panel empty" }, el("strong", { text: "Nada em " + monthName(viewMonth) }),
        el("span", { text: "Os lançamentos que fizer aparecem aqui, agrupados por dia." })));
      return;
    }
    if (histFilter) box.append(el("p", { class: "muted", text: `${items.length} lançamento${items.length > 1 ? "s" : ""} · total ${fmt(sum(items))}` }));
    items = items.slice().sort((a, b) => b.d.localeCompare(a.d) || b.ts - a.ts);
    const groups = new Map();
    for (const e of items) { if (!groups.has(e.d)) groups.set(e.d, []); groups.get(e.d).push(e); }
    for (const [d, g] of groups) {
      const dayOut = sum(g.filter((e) => e.t === "out"));
      const panel = el("section", { class: "panel" }, el("div", { class: "day-h" }, el("span", { text: dayName(d) }), el("span", { class: "num", text: dayOut ? fmt(dayOut) : "" })));
      const wrap = el("div");
      for (const e of g) {
        const c = catById(e.t, e.cat);
        wrap.append(el("button", { type: "button", class: "tx", onclick: () => openEdit(e.id) }, catIcon(c),
          el("div", {}, el("div", { class: "t", text: e.note || c.name }),
            el("div", { class: "s" }, e.ts && e.d === isoOf(new Date(e.ts)) ? el("span", { text: timeOf(e.ts) }) : null, el("span", { class: e.ts && e.d === isoOf(new Date(e.ts)) ? "dotsep" : "", text: (e.note ? c.name + " · " : "") + e.pay }))),
          el("span", { class: "amt num" + (e.t === "in" ? " in" : ""), text: (e.t === "in" ? "+" : "−") + fmt(e.v) })));
      }
      panel.append(wrap);
      box.append(panel);
    }
  }

  // ================= Editar =================
  let editId = null, delArmed = false;
  function openEdit(id) {
    const e = data.entries.find((x) => x.id === id); if (!e) return;
    editId = id; delArmed = false;
    $("editTitle").textContent = e.t === "out" ? "Editar gasto" : "Editar entrada";
    $("eValue").value = fmtNum(e.v).replace(/ /g, "");
    const sel = $("eCat"); sel.replaceChildren();
    for (const c of catList(e.t)) sel.append(el("option", { value: c.id, text: c.name }));
    if (!catList(e.t).some((c) => c.id === e.cat)) sel.append(el("option", { value: e.cat, text: "Sem categoria" }));
    sel.value = e.cat;
    const ps = $("ePay"); ps.replaceChildren(); for (const p of PAYS) ps.append(el("option", { value: p, text: p }));
    ps.value = PAYS.includes(e.pay) ? e.pay : "Dinheiro";
    $("eDate").value = e.d; $("eDate").max = today();
    $("eNote").value = e.note || "";
    $("eErr").textContent = ""; $("eDelete").textContent = "Apagar"; $("eDelete").className = "btn danger-outline";
    $("editDlg").showModal();
  }
  $("eCancel").onclick = () => $("editDlg").close();
  $("editForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const v = parseMoney($("eValue").value);
    if (!v) { $("eErr").textContent = "Escreva um valor maior que zero, por exemplo 350 ou 12,50."; return; }
    if (!$("eDate").value) { $("eErr").textContent = "Escolha a data."; return; }
    const e = data.entries.find((x) => x.id === editId);
    if (e) Object.assign(e, { v, cat: $("eCat").value, pay: $("ePay").value, d: $("eDate").value, note: $("eNote").value.trim() });
    save(); $("editDlg").close(); renderView(); toast("Lançamento atualizado");
  });
  $("eDelete").onclick = () => {
    if (!delArmed) { delArmed = true; $("eDelete").textContent = "Confirmar: apagar"; $("eDelete").className = "btn danger"; return; }
    const removed = data.entries.find((x) => x.id === editId);
    data.entries = data.entries.filter((x) => x.id !== editId); save();
    $("editDlg").close(); renderView();
    toast("Lançamento apagado", ["Desfazer", () => { data.entries.push(removed); save(); renderView(); }]);
  };

  // ================= Ajustes =================
  let installEvt = null;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installEvt = e; if (view === "ajustes") renderAjustes(); });

  function renderAjustes() {
    const body = $("ajustesBody"); body.replaceChildren();

    if (installEvt) body.append(el("section", { class: "panel" }, el("h2", { class: "panel-title", text: "Instalar no telemóvel" }),
      el("p", { class: "muted", text: "Adicione a Caderneta ao ecrã principal para abrir como um app, mesmo sem internet." }),
      el("button", { type: "button", class: "btn primary", text: "Instalar app", onclick: async () => { installEvt.prompt(); await installEvt.userChoice.catch(() => {}); installEvt = null; renderAjustes(); } })));

    const goalIn = el("input", { id: "goalInput", inputmode: "decimal", autocomplete: "off", placeholder: "Ex.: 3 000", value: data.settings.saveGoal ? fmtNum(data.settings.saveGoal).replace(/ /g, "") : "" });
    const goalErr = el("p", { class: "err" });
    const saveGoal = () => {
      const raw = goalIn.value.trim();
      const v = raw === "" ? 0 : parseMoney(raw);
      if (v === null) { goalErr.textContent = "Escreva um valor válido, por exemplo 3000."; return; }
      data.settings.saveGoal = v; save(); goalErr.textContent = ""; toast(v ? `Meta definida: guardar ${fmt(v)} por mês` : "Meta removida");
    };
    goalIn.addEventListener("keydown", (e) => { if (e.key === "Enter") saveGoal(); });
    body.append(el("section", { class: "panel" }, el("h2", { class: "panel-title", text: "Meta de poupança" }),
      el("p", { class: "muted", text: "Quanto quer guardar por mês? O resumo mostra quanto ainda pode gastar para cumprir a meta." }),
      el("div", { class: "setrow" }, goalIn, el("button", { type: "button", class: "btn primary", text: "Guardar", onclick: saveGoal })), goalErr));

    for (const t of ["out", "in"]) body.append(catEditor(t));

    const last = data.settings.lastBackup;
    const fileIn = el("input", { type: "file", accept: ".json,application/json", hidden: true, onchange: (e) => { const f = e.target.files[0]; e.target.value = ""; if (f) readBackup(f); } });
    body.append(el("section", { class: "panel" }, el("h2", { class: "panel-title", text: "Cópia de segurança" }),
      el("p", { class: "muted", text: "Os dados ficam só neste telemóvel. Faça uma cópia de vez em quando e guarde-a no WhatsApp, e-mail ou Google Drive. Se mudar de telemóvel, use Restaurar." }),
      el("p", { class: "muted", text: last ? `Última cópia: ${dayName(isoOf(new Date(last)))} (${new Date(last).toLocaleDateString("pt-PT")}).` : "Ainda não fez nenhuma cópia." }),
      el("div", { class: "btnrow" },
        el("button", { type: "button", class: "btn primary", text: "Fazer cópia", onclick: doBackup }),
        el("button", { type: "button", class: "btn", text: "Restaurar cópia", onclick: () => fileIn.click() }),
        el("button", { type: "button", class: "btn", text: "Exportar para Excel", onclick: exportCsv })),
      fileIn, el("div", { id: "restoreBox" })));

    body.append(el("p", { class: "muted", style: "text-align:center", text: `Caderneta de Gastos · versão ${APP_VERSION} · ${data.entries.length} lançamentos guardados` }));
  }

  function catEditor(t) {
    const panel = el("section", { class: "panel" }, el("h2", { class: "panel-title", text: t === "out" ? "Categorias de gastos" : "Categorias de entradas" }),
      el("p", { class: "muted", text: "Toque no ícone para o trocar e no quadrado de cor para mudar a cor." }));
    const used = new Set(data.entries.filter((e) => e.t === t).map((e) => e.cat));
    for (const c of catList(t)) {
      const icon = el("button", { type: "button", class: "icon-pick", "aria-label": "Trocar ícone de " + c.name }, svg(c.icon));
      icon.onclick = () => { const i = CAT_ICON_CHOICES.indexOf(c.icon); c.icon = CAT_ICON_CHOICES[(i + 1) % CAT_ICON_CHOICES.length]; save(); icon.replaceChildren(svg(c.icon)); };
      const name = el("input", { value: c.name, maxlength: 24, "aria-label": "Nome da categoria" });
      name.addEventListener("change", () => { const v = name.value.trim(); if (v) { c.name = v; save(); toast("Categoria renomeada"); } else name.value = c.name; });
      const color = el("input", { type: "color", value: c.color, "aria-label": "Cor de " + c.name });
      color.addEventListener("change", () => { c.color = color.value; save(); });
      let armed = false;
      const del = el("button", { type: "button", class: "btn icon danger-outline", "aria-label": "Remover " + c.name, text: "✕" });
      del.onclick = () => {
        if (catList(t).length <= 1) { toast("Precisa de pelo menos uma categoria."); return; }
        if (!armed) { armed = true; del.textContent = used.has(c.id) ? "Remover? Lançamentos ficam sem categoria" : "Remover?"; del.className = "btn small danger"; return; }
        data.cats[t] = catList(t).filter((x) => x.id !== c.id); save(); renderAjustes();
      };
      panel.append(el("div", { class: "setrow" }, icon, name, color, del));
    }
    panel.append(el("button", { type: "button", class: "btn", text: "+ Nova categoria", onclick: () => {
      const palette = ["#ff9f5a", "#4fd1a1", "#a58bff", "#5b9dff", "#ffd25a", "#4cc9f0", "#ff6b8b", "#f6a6ff", "#7ee0ff"];
      catList(t).push({ id: uid(), name: "Nova categoria", color: palette[catList(t).length % palette.length], icon: "tag" }); save(); renderAjustes();
      const input = [...document.querySelectorAll("#ajustesBody input:not([type])")].find((i) => i.value === "Nova categoria");
      if (input) { input.focus(); input.select(); }
    } }));
    return panel;
  }

  // ---------- Ficheiros ----------
  async function offerFile(filename, text, mime) {
    // Dentro do APK: o Android abre a janela "Partilhar" (WhatsApp, Drive, Ficheiros…)
    if (window.CadernetaAndroid) { window.CadernetaAndroid.partilharFicheiro(filename, mime, text); return true; }
    const blob = new Blob([text], { type: mime });
    try {
      const file = new File([blob], filename, { type: mime });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: filename }); return true; }
    } catch (e) { if (e && e.name === "AbortError") return false; }
    const url = URL.createObjectURL(blob);
    const a = el("a", { href: url, download: filename }); document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  }
  async function doBackup() {
    const ok = await offerFile(`caderneta-copia-${today()}.json`, JSON.stringify(data), "application/json");
    if (ok) { data.settings.lastBackup = Date.now(); save(); toast("Cópia criada. Guarde o ficheiro num lugar seguro."); renderView(); }
  }
  function exportCsv() {
    const esc = (s) => `"${String(s).replace(/"/g, '""')}"`;
    const lines = [["Data", "Tipo", "Categoria", "Pagamento", "Nota", "Valor (MT)"].join(";")];
    for (const e of data.entries.slice().sort((a, b) => a.d.localeCompare(b.d)))
      lines.push([e.d, e.t === "in" ? "Entrada" : "Gasto", esc(catById(e.t, e.cat).name), e.pay, esc(e.note || ""), ((e.t === "in" ? 1 : -1) * e.v / 100).toFixed(2).replace(".", ",")].join(";"));
    offerFile(`caderneta-${today()}.csv`, "﻿" + lines.join("\r\n"), "text/csv");
  }
  function readBackup(file) {
    const box = $("restoreBox"); box.replaceChildren();
    const r = new FileReader();
    r.onload = () => {
      let d; try { d = JSON.parse(r.result); } catch (e) { d = null; }
      if (!isValidData(d)) { box.append(el("p", { class: "err", text: "Este ficheiro não é uma cópia da Caderneta. Escolha o ficheiro caderneta-copia-….json." })); return; }
      box.append(el("div", { class: "nag" },
        el("span", { text: `A cópia tem ${d.entries.length} lançamentos. Restaurar substitui os ${data.entries.length} lançamentos atuais.` }),
        el("div", { class: "btnrow" },
          el("button", { type: "button", class: "btn small", text: "Cancelar", onclick: () => box.replaceChildren() }),
          el("button", { type: "button", class: "btn small danger", text: "Restaurar", onclick: () => { data = migrate(d); save(); toast("Cópia restaurada"); renderView(); } }))));
    };
    r.readAsText(file);
  }

  // ================= Arranque =================
  const APP_VERSION = "1.1.0";
  const IN_APK = /CadernetaApp/.test(navigator.userAgent);
  // Botão "voltar" do Android (chamado pelo APK): devolve true se tratou o toque.
  window.__cadernetaVoltar = () => {
    if ($("editDlg").open) { $("editDlg").close(); return true; }
    if (view !== "lancar") { location.hash = "#lancar"; return true; }
    return false;
  };
  // O APK informa a altura da barra de estado (o céu azul passa por baixo dela).
  window.__cadernetaInsets = (top) => { document.documentElement.style.setProperty("--inset-top", top + "px"); };

  setLaunchType("out");
  if (!location.hash) history.replaceState(null, "", "#lancar");
  route();
  let lastDay = today();
  document.addEventListener("visibilitychange", () => { if (!document.hidden && today() !== lastDay) { lastDay = today(); viewMonth = monthOf(lastDay); $("date").value = lastDay; renderView(); } });

  if (!IN_APK && "serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
    let reloaded = false;
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (reloaded || !hadController) return; reloaded = true; if (!launch.expr) location.reload(); });
  }
})();
