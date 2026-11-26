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
    // carteiras e interface
    cash: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/>',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10 6h4M11 18h2"/><path d="M9.5 12.5l2 2 3-3.5"/>',
    bank: '<path d="M3 9.5L12 4l9 5.5M4.5 9.5h15M6 9.5v8M10 9.5v8M14 9.5v8M18 9.5v8M3.5 20h17"/>',
    transfer: '<path d="M5 8h13l-3.5-3.5M19 16H6l3.5 3.5"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    repeat: '<path d="M4 11V9a3 3 0 0 1 3-3h12l-3-3M20 13v2a3 3 0 0 1-3 3H5l3 3"/>',
    piggy: '<path d="M5 11a6 5 0 0 1 6-5h3a6 5 0 0 1 5.5 3.2L21 9v4l-1.6.6A6 5 0 0 1 16 16.5V19h-2.5v-2H10v2H7.5v-3A5 5 0 0 1 5 11z"/><path d="M5 11H3.5M10 6.5l.5-2.5 2.5 2"/><circle cx="15.5" cy="10.5" r=".6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    list: '<path d="M8 6.5h12M8 12h12M8 17.5h12M4 6.5h.01M4 12h.01M4 17.5h.01"/>',
    shield: '<path d="M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z"/><path d="M9 12l2 2 4-4"/>',
    doc: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M3.5 10h17M7.5 14.5h4"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.3c-.5-1-1.6-1.6-2.8-1.6-1.6 0-2.8.9-2.8 2.1 0 2.8 5.7 1.6 5.7 4.4 0 1.2-1.2 2.1-2.9 2.1-1.3 0-2.4-.6-2.9-1.6M12 6.2v1.5M12 16.3v1.5"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'
  };
  const CAT_ICON_CHOICES = ["alim", "merc", "transp", "casa", "energ", "cred", "saude", "famil", "lazer", "cafe", "roupa", "book", "igreja", "gift", "salario", "negocio", "outent", "outros", "tag"];
  const svg = (name) => {
    const s = document.createElement("span");
    s.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.tag}</svg>`;
    return s.firstChild;
  };

  // ================= Dados base =================
  const KEY = "caderneta:v1";
  const DEFAULT_CATS = {
    out: [
      ["alim", "Alimentação", "#ff9f5a"], ["merc", "Mercado", "#4fd1a1"], ["transp", "Transporte", "#a58bff"],
      ["casa", "Casa", "#5b9dff"], ["energ", "Energia e água", "#ffd25a"], ["cred", "Crédito e dados", "#4cc9f0"],
      ["saude", "Saúde", "#ff6b8b"], ["famil", "Família", "#f6a6ff"], ["lazer", "Lazer", "#7ee0ff"], ["outros", "Outros", "#9aa6c8"]
    ],
    in: [["salario", "Salário", "#5fe3a1"], ["negocio", "Negócio / biscate", "#9be36f"], ["outent", "Outras entradas", "#7fd8c0"]]
  };
  const DEFAULT_WALLETS = [
    ["dinheiro", "Dinheiro", "cash", true], ["mpesa", "M-Pesa", "phone", true], ["emola", "e-Mola", "phone", true],
    ["mkesh", "mKesh", "phone", false], ["banco", "Banco", "bank", false]
  ];
  const OLD_COLORS = { alim: "#d9752a", merc: "#2f9568", transp: "#7259c4", casa: "#4874a6", energ: "#b8941c", cred: "#2f93aa", saude: "#c9404f", famil: "#a85f22", lazer: "#984a8c", outros: "#7d8a85", salario: "#187a49", negocio: "#36985f", outent: "#5fae82" };

  function freshData() {
    const cats = {};
    for (const t of ["out", "in"]) cats[t] = DEFAULT_CATS[t].map(([id, name, color]) => ({ id, name, color, icon: id }));
    return migrate({ version: 1, entries: [], cats, settings: { saveGoal: 0, lastBackup: 0 } });
  }
  function isValidData(d) {
    return d && d.version === 1 && Array.isArray(d.entries) && d.cats && Array.isArray(d.cats.out) && Array.isArray(d.cats.in) && d.settings;
  }
  // Atualiza dados de versões anteriores sem perder nada.
  function migrate(d) {
    const newColor = {}; for (const t of ["out", "in"]) for (const [id, , color] of DEFAULT_CATS[t]) newColor[id] = color;
    for (const t of ["out", "in"]) for (const c of d.cats[t]) {
      if (!c.icon) c.icon = ICONS[c.id] ? c.id : "tag";
      if (OLD_COLORS[c.id] && c.color === OLD_COLORS[c.id]) c.color = newColor[c.id];
    }
    const s = d.settings;
    if (!Array.isArray(s.wallets)) s.wallets = DEFAULT_WALLETS.map(([id, name, icon, show]) => ({ id, name, icon, show, adj: 0 }));
    if (!s.reminder) s.reminder = { on: false, h: 20, m: 0 };
    if (!Array.isArray(d.fixed)) d.fixed = [];
    if (!Array.isArray(d.goals)) d.goals = [];
    if (!Array.isArray(d.smsSeen)) d.smsSeen = [];
    if (!d.smsRules) d.smsRules = {};
    if (!s.sms) s.sms = { on: false };
    // versão 1.0/1.1: forma de pagamento em texto -> carteira
    for (const e of d.entries) {
      if (!e.w) { const w = s.wallets.find((x) => x.name === e.pay); e.w = w ? w.id : "dinheiro"; }
      delete e.pay;
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
    tellAndroidLastEntry();
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
  const monthsBetween = (a, b) => { const [y1, m1] = a.split("-").map(Number), [y2, m2] = b.split("-").map(Number); return (y2 - y1) * 12 + (m2 - m1); };
  const daysIn = (m) => { const [y, mo] = m.split("-").map(Number); return new Date(y, mo, 0).getDate(); };
  const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const MONTHS_S = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const monthName = (m) => { const [y, mo] = m.split("-").map(Number); const s = MONTHS[mo - 1]; return s[0].toUpperCase() + s.slice(1) + " de " + y; };
  const monthShort = (m) => { const [y, mo] = m.split("-").map(Number); return `${MONTHS_S[mo - 1]} ${y}`; };
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

  function fmtNum(cents) {
    const neg = cents < 0; cents = Math.abs(Math.round(cents));
    const int = Math.floor(cents / 100), dec = cents % 100;
    const s = String(int).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (neg ? "−" : "") + s + (dec ? "," + pad(dec) : "");
  }
  const fmt = (cents) => fmtNum(cents) + " MT";
  const fmtPlain = (cents) => fmtNum(cents).replace(/ /g, "").replace("−", "-");
  function moneyEl(cents) {
    const neg = cents < 0; const abs = Math.abs(Math.round(cents));
    const int = Math.floor(abs / 100), dec = abs % 100;
    const s = String(int).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return el("span", { class: "money num" }, (neg ? "−" : "") + s, dec ? el("span", { class: "dec", text: "," + pad(dec) }) : null, el("span", { class: "cur", text: "MT" }));
  }
  function parseMoney(s, allowZero = false) {
    s = String(s).trim().replace(/[\s ]|MT|MZN/gi, "");
    if (!s) return null;
    if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
    else if ((s.match(/\./g) || []).length > 1) s = s.replace(/\./g, "");
    const v = Number(s);
    if (!isFinite(v) || v < 0 || (!allowZero && v === 0)) return null;
    return Math.round(v * 100);
  }

  const catList = (type) => data.cats[type];
  const catById = (type, id) => (catList(type) || []).find((c) => c.id === id) || { id, name: "Sem categoria", color: "#9aa6c8", icon: "tag" };
  const sum = (list) => list.reduce((a, e) => a + e.v, 0);
  const inMonth = (m) => data.entries.filter((e) => monthOf(e.d) === m);
  const wallets = () => data.settings.wallets;
  const walletById = (id) => wallets().find((w) => w.id === id) || { id, name: "Carteira", icon: "cash", show: true, adj: 0 };
  const usedWallets = () => { const used = new Set(data.entries.flatMap((e) => [e.w, e.w2])); return wallets().filter((w) => w.show || used.has(w.id)); };
  const goalById = (id) => data.goals.find((g) => g.id === id) || { id, name: "Meta apagada", target: 0 };

  function walletBalance(id) {
    const w = walletById(id);
    let b = w.adj || 0;
    for (const e of data.entries) {
      if (e.t === "in" && e.w === id) b += e.v;
      else if (e.t === "out" && e.w === id) b -= e.v;
      else if (e.t === "tr") { if (e.w === id) b -= e.v; if (e.w2 === id) b += e.v; }
      else if (e.t === "goal" && e.w === id) b -= e.v;
    }
    return b;
  }
  const goalSaved = (id) => data.entries.filter((e) => e.t === "goal" && e.g === id).reduce((a, e) => a + e.v, 0);
  const catSpent = (id, m) => inMonth(m).filter((e) => e.t === "out" && e.cat === id).reduce((a, e) => a + e.v, 0);

  // Como mostrar qualquer lançamento (gasto, entrada, transferência, meta)
  function entryInfo(e) {
    if (e.t === "tr") return { title: e.note || "Transferência", sub: `${walletById(e.w).name} → ${walletById(e.w2).name}`, icon: "transfer", color: "#4f86ff", amount: fmt(e.v), cls: "" };
    if (e.t === "goal") {
      const g = goalById(e.g);
      return { title: e.v >= 0 ? `Guardado: ${g.name}` : `Retirado: ${g.name}`, sub: walletById(e.w).name, icon: "piggy", color: "#ffd25a", amount: (e.v >= 0 ? "→ " : "← ") + fmt(Math.abs(e.v)), cls: "" };
    }
    const c = catById(e.t, e.cat);
    return { title: e.note || c.name, sub: (e.note ? c.name + " · " : "") + walletById(e.w).name, icon: c.icon, color: c.color, amount: (e.t === "in" ? "+" : "−") + fmt(e.v), cls: e.t === "in" ? " in" : "" };
  }
  function iconTile(icon, color) { return el("span", { class: "tx-ic" }, svg(icon), color ? el("i", { style: `background:${color}` }) : null); }

  // ================= Ponte com o APK =================
  const android = window.CadernetaAndroid || null;
  function tellAndroidLastEntry() {
    if (!android || !android.ultimoLancamento) return;
    let last = "";
    for (const e of data.entries) if (e.d > last) last = e.d;
    try { android.ultimoLancamento(last); } catch (e) { /* ignorar */ }
  }
  function androidReminderState() {
    if (!android || !android.estadoLembrete) return null;
    try { return JSON.parse(android.estadoLembrete()); } catch (e) { return null; }
  }

  // ================= Aviso (toast) =================
  let toastTimer;
  function toast(text, action, ms) {
    $("toastText").textContent = text;
    const b = $("toastAction");
    if (action) { b.textContent = action[0]; b.onclick = () => { action[1](); $("toast").hidden = true; }; b.hidden = false; }
    else b.hidden = true;
    $("toast").hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => ($("toast").hidden = true), ms || (action ? 5000 : 2800));
  }

  // ================= Formulário genérico (diálogo) =================
  let formState = null;
  function openForm({ title, intro, fields, submit = "Guardar", onSubmit, onDelete, deleteLabel = "Apagar" }) {
    $("formTitle").textContent = title;
    $("formIntro").hidden = !intro; $("formIntro").textContent = intro || "";
    $("formErr").textContent = "";
    const box = $("formFields"); box.replaceChildren();
    const inputs = {};
    let row = null;
    for (const f of fields) {
      let input;
      if (f.type === "select") {
        input = el("select", { id: "f_" + f.id });
        for (const [v, label] of f.options) input.append(el("option", { value: v, text: label }));
        if (f.value != null) input.value = f.value;
      } else if (f.type === "seg") {
        input = el("div", { class: "seg-inline", role: "group" });
        input.value = f.value;
        for (const [v, label] of f.options) {
          const b = el("button", { type: "button", "aria-pressed": String(f.value === v), text: label });
          b.onclick = () => { input.value = v; input.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); if (f.onChange) f.onChange(v, inputs); };
          input.append(b);
        }
      } else {
        const attrs = { id: "f_" + f.id, autocomplete: "off" };
        if (f.type === "money") Object.assign(attrs, { inputmode: "decimal", placeholder: f.placeholder || "0" });
        else if (f.type === "date") attrs.type = "date";
        else if (f.type === "month") attrs.type = "month";
        else if (f.type === "number") Object.assign(attrs, { type: "number", inputmode: "numeric", min: f.min, max: f.max });
        else Object.assign(attrs, { maxlength: f.maxlength || 40, placeholder: f.placeholder || "" });
        input = el("input", attrs);
        if (f.value != null) input.value = f.value;
        if (f.max && f.type === "date") input.max = f.max;
      }
      inputs[f.id] = input;
      const field = el("label", { class: "field" }, el("span", { text: f.label }), input);
      if (f.half) {
        if (!row) { row = el("div", { class: "row2" }); box.append(row); }
        row.append(field); if (row.children.length === 2) row = null;
      } else { row = null; box.append(field); }
      if (f.hidden) field.hidden = true;
      input._field = field;
    }
    for (const f of fields) if (f.onChange && f.type === "seg") f.onChange(f.value, inputs);
    const del = $("formDelete"); let armed = false;
    del.hidden = !onDelete; del.textContent = deleteLabel; del.className = "btn danger-outline";
    del.onclick = () => {
      if (!armed) { armed = true; del.textContent = "Confirmar: " + deleteLabel.toLowerCase(); del.className = "btn danger"; return; }
      $("formDlg").close(); onDelete();
    };
    $("formSubmit").textContent = submit;
    formState = { inputs, onSubmit };
    $("formDlg").showModal();
    const first = Object.values(inputs).find((i) => i.tagName === "INPUT" && !i._field.hidden);
    if (first && first.inputMode === "decimal" && !first.value) setTimeout(() => first.focus(), 50);
  }
  $("formCancel").onclick = () => $("formDlg").close();
  $("formForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (!formState) return;
    const vals = {}; for (const [k, i] of Object.entries(formState.inputs)) vals[k] = i.value;
    const err = formState.onSubmit(vals, formState.inputs);
    if (err) { $("formErr").textContent = err; return; }
    $("formDlg").close();
  });

  // ================= Leitura de SMS (e-Mola, M-Pesa, banco) =================
  // Valores como "1,500.00", "312.50" ou "1.500,00" -> centavos
  function smsNum(str) {
    str = String(str).trim();
    const m = str.match(/^(.*?)[.,](\d{1,2})$/);
    const int = (m ? m[1] : str).replace(/[.,\s]/g, "");
    const v = Number(int + "." + (m ? m[2].padEnd(2, "0") : "0"));
    return isFinite(v) && int !== "" ? Math.round(v * 100) : null;
  }
  const AMT = "(\\d[\\d.,]*)\\s?MT";
  const titleCase = (t) => t.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase()).trim();
  const normParty = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, " ").trim();
  const WALLET_LABEL = { emola: "e-Mola", mpesa: "M-Pesa", banco: "Banco" };

  function parseSms(from, body, ts) {
    const b = String(body || "").replace(/\s+/g, " ").trim();
    const low = (String(from || "") + " " + b).toLowerCase();
    const r = (re) => b.match(new RegExp(re, "i"));
    const wallet = /e-?mola/.test(low) ? "emola" : /m-?pesa/.test(low) ? "mpesa"
      : /\b(bci|bim|millennium|standard ?bank|absa|moza|banco|fnb|nedbank|letshego|access bank|ecobank|socremo|bni)\b/.test(low) ? "banco" : null;
    if (!wallet || !/\d\s?MT/i.test(b)) return null;
    let kind = null, amount = null, party = "", m;
    if ((m = r("levantamento de " + AMT))) { kind = "withdraw"; amount = smsNum(m[1]); }
    else if ((m = r("Recebe(?:u|ste) " + AMT + " de ([^,]+),\\s*(.+?)\\s+(?:as|às)\\b"))) { kind = "in"; amount = smsNum(m[1]); party = m[3]; }
    else if ((m = r("Recebe(?:u|ste) " + AMT + "(?: de (.+?)(?:\\s+(?:as|às)\\b|[.,]))?"))) { kind = "in"; amount = smsNum(m[1]); party = m[2] || ""; }
    else if ((m = r("Transferi(?:ste|u) " + AMT))) { kind = "out"; amount = smsNum(m[1]); const n = r("nome:\\s*(.+?)\\s+(?:as|às)\\b"); party = n ? n[1] : ""; }
    else if ((m = r("pagamento de " + AMT + "\\s+(?:para|a|ao|à)\\s+(.+?)(?:\\s+(?:as|às)\\b|\\.\\s|,|$)"))) { kind = "out"; amount = smsNum(m[1]); party = m[2]; }
    else if ((m = r("(?:pagamento|compra|d[ée]bito|envio|enviou|envias?te|pagou|pagaste) de " + AMT))) { kind = "out"; amount = smsNum(m[1]); }
    else if ((m = r("(?:cr[ée]dito|dep[óo]sito|recebimento) de " + AMT))) { kind = "in"; amount = smsNum(m[1]); }
    if (!kind || !amount) return null;
    const fee = r("Taxa:?\\s*" + AMT);
    const bal = r("saldo[^0-9]{0,30}?" + AMT);
    const id = r("ID (?:Trans|da Transac[cç]?[aã]o)[:\\s]+([A-Za-z0-9.]+?)\\.(?:\\s|$)");
    const cont = r("Conte[uú]do:\\s*(.+?)\\.\\s");
    const when = r("(\\d{2}):(\\d{2})(?::\\d{2})?\\s+(?:de\\s+)?(\\d{2})/(\\d{2})/(\\d{4})");
    let d = isoOf(new Date(ts || Date.now())), t = ts || Date.now();
    if (when) { d = `${when[5]}-${when[4]}-${when[3]}`; t = new Date(+when[5], +when[4] - 1, +when[3], +when[1], +when[2]).getTime(); }
    party = party.replace(/^\d{6,}\s*,?\s*/, "").trim();
    return { wallet, kind, amount, fee: fee ? smsNum(fee[1]) : 0, bal: bal ? smsNum(bal[1]) : null, id: id ? id[1] : null,
      party: party ? titleCase(party) : "", content: cont ? cont[1].trim() : "", d, ts: t, body: b };
  }

  function ensureTaxasCat() {
    if (!catList("out").some((c) => c.id === "taxas")) catList("out").push({ id: "taxas", name: "Taxas", color: "#c08bff", icon: "bank" });
  }
  function balanceAt(id, ts) {
    let b = walletById(id).adj || 0;
    for (const e of data.entries) {
      if ((e.ts || 0) > ts) continue;
      if (e.t === "in" && e.w === id) b += e.v;
      else if (e.t === "out" && e.w === id) b -= e.v;
      else if (e.t === "tr") { if (e.w === id) b -= e.v; if (e.w2 === id) b += e.v; }
      else if (e.t === "goal" && e.w === id) b -= e.v;
    }
    return b;
  }
  function applySms(p) {
    const key = p.id || ("h" + Array.from(p.body).reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7));
    if (data.smsSeen.includes(key)) return 0;
    const w = walletById(p.wallet);
    if (!wallets().some((x) => x.id === p.wallet)) return 0;
    w.show = true;
    const rule = p.party ? data.smsRules[normParty(p.party)] : null;
    const base = { d: p.d, ts: p.ts, w: p.wallet, auto: true, sms: key };
    const note = p.party || p.content || "";
    let n = 0;
    if (p.kind === "withdraw") {
      data.entries.push({ id: uid(), t: "tr", v: p.amount, w2: "dinheiro", note: "Levantamento no agente", ...base }); n++;
    } else {
      const t = p.kind;
      const cat = rule && catList(t).some((c) => c.id === rule) ? rule : (t === "in" ? "outent" : "outros");
      data.entries.push({ id: uid(), t, v: p.amount, cat, note, party: p.party, review: !rule, ...base }); n++;
    }
    if (p.fee > 0) {
      ensureTaxasCat();
      data.entries.push({ id: uid(), t: "out", v: p.fee, cat: "taxas", note: `Taxa ${WALLET_LABEL[p.wallet] || ""}`.trim(), ...base, ts: p.ts + 1 }); n++;
    }
    if (p.bal != null) {
      w.adj = (w.adj || 0) + (p.bal - balanceAt(p.wallet, p.ts + 1));
      w.syncedAt = p.ts;
    }
    data.smsSeen.push(key);
    if (data.smsSeen.length > 2000) data.smsSeen = data.smsSeen.slice(-1500);
    return n;
  }
  // Recebe mensagens {from, body, ts} e cria os lançamentos. Devolve quantos movimentos entraram.
  function processSms(list) {
    const parsed = list.map((x) => parseSms(x.from, x.body, x.ts)).filter(Boolean).sort((a, b) => a.ts - b.ts);
    let moves = 0;
    for (const p of parsed) if (applySms(p)) moves++;
    if (moves) { save(); }
    return moves;
  }
  function pullSms(showToast = true) {
    if (!android || !android.smsPendentes) return;
    let list = [];
    try { list = JSON.parse(android.smsPendentes() || "[]"); } catch (e) { list = []; }
    if (!list.length) return;
    const n = processSms(list);
    try { android.smsLimpar(); } catch (e) { /* ignorar */ }
    if (n) { renderView(); if (showToast) toast(`${n} movimento${n > 1 ? "s" : ""} lido${n > 1 ? "s" : ""} das SMS`, ["Ver", () => { location.hash = "#historico"; }]); }
  }
  const reviewList = () => data.entries.filter((e) => e.review).sort((a, b) => b.ts - a.ts);
  window.__cadernetaSmsTeste = (list) => { const n = processSms(list); renderView(); return n; };

  // ================= Navegação =================
  const VIEWS = ["lancar", "resumo", "carteira", "historico", "ajustes"];
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
    else if (view === "carteira") renderCarteira();
    else if (view === "historico") renderHist();
    else renderAjustes();
  }

  // ================= Lançar =================
  const launch = { type: "out", expr: "", w: "dinheiro" };
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
  const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite"; };

  function renderLaunch() {
    $("greeting").textContent = greeting();
    $("todayAmount").replaceChildren(moneyEl(sum(data.entries.filter((e) => e.t === "out" && e.d === today()))));

    // aviso de pagamentos fixos por confirmar
    const due = fixedDue();
    const nb = $("launchNotice"); nb.replaceChildren();
    const rv = reviewList();
    if (rv.length) nb.append(el("a", { class: "notice", href: "#historico", style: "margin-bottom:8px" },
      el("span", {}, el("b", { text: `${rv.length} movimento${rv.length > 1 ? "s" : ""} das SMS` }), " por categorizar"),
      el("span", { class: "link", text: "Ver" })));
    if (due.length) nb.append(el("a", { class: "notice", href: "#carteira" },
      el("span", {}, el("b", { text: `${due.length} pagamento${due.length > 1 ? "s" : ""} fixo${due.length > 1 ? "s" : ""}` }), ` por confirmar · ${fmt(due.reduce((a, f) => a + f.v, 0))}`),
      el("span", { class: "link", text: "Ver" })));

    const grid = $("catGrid"); grid.replaceChildren();
    const cats = catList(launch.type);
    grid.classList.toggle("few", cats.length <= 6);
    for (const c of cats) grid.append(el("button", { type: "button", class: "action", onclick: () => commit(c) }, svg(c.icon), el("span", { text: c.name })));

    const ws = usedWallets();
    if (!ws.some((w) => w.id === launch.w)) launch.w = ws[0] ? ws[0].id : "dinheiro";
    const pc = $("payChips"); pc.replaceChildren();
    for (const w of ws) pc.append(el("button", { type: "button", class: "chip", "aria-pressed": String(launch.w === w.id), onclick: () => { launch.w = w.id; renderLaunch(); } }, w.name));
    if (!$("date").value) $("date").value = today();
    $("date").max = today();
    const d = $("date").value;
    $("moreSummary").textContent = `${walletById(launch.w).name} · ${d === today() ? "hoje" : dayName(d).toLowerCase()}${$("note").value ? " · " + $("note").value : ""}`;
    renderDisplay();
  }

  function shakeDisplay(msg) {
    const d = $("display"); d.classList.remove("shake"); void d.offsetWidth; d.classList.add("shake");
    $("hint").textContent = msg;
    setTimeout(() => { d.classList.remove("shake"); renderDisplay(); }, 1600);
  }

  function limitWarning(cat, m, before) {
    if (!cat.limit) return "";
    const after = catSpent(cat.id, m);
    if (before < cat.limit && after >= cat.limit) return `Atenção: passou o limite de ${cat.name} (${fmt(cat.limit)}).`;
    if (before < cat.limit * 0.8 && after >= cat.limit * 0.8) return `Atenção: ${cat.name} já vai em ${Math.round(after / cat.limit * 100)}% do limite.`;
    return "";
  }

  function commit(cat) {
    const v = exprTotal();
    if (!v) { shakeDisplay("Primeiro digite o valor"); return; }
    const d = $("date").value || today();
    const before = launch.type === "out" ? catSpent(cat.id, monthOf(d)) : 0;
    const entry = { id: uid(), t: launch.type, v, cat: cat.id, w: launch.w, note: $("note").value.trim(), d, ts: Date.now() };
    data.entries.push(entry); save();
    launch.expr = ""; $("note").value = ""; $("date").value = today(); launch.w = "dinheiro"; $("more").open = false;
    if (navigator.vibrate) navigator.vibrate(15);
    renderLaunch();
    const warn = launch.type === "out" ? limitWarning(cat, monthOf(d), before) : "";
    const undo = ["Desfazer", () => { data.entries = data.entries.filter((x) => x.id !== entry.id); save(); renderView(); toast("Lançamento desfeito"); }];
    if (warn) { if (navigator.vibrate) navigator.vibrate([30, 60, 30]); toast(`${fmt(v)} em ${cat.name}. ${warn}`, undo, 7000); }
    else toast(`${fmt(v)} em ${cat.name}`, undo);
  }

  $("moreToggle").onclick = () => { $("more").open = !$("more").open; };
  $("more").addEventListener("toggle", () => $("moreToggle").setAttribute("aria-expanded", String($("more").open)));
  $("typeOut").onclick = () => setLaunchType("out");
  $("typeIn").onclick = () => setLaunchType("in");
  $("keypad").addEventListener("click", (e) => { const b = e.target.closest("button[data-k]"); if (b) pressKey(b.dataset.k); });
  $("note").addEventListener("input", renderLaunch);
  $("date").addEventListener("change", renderLaunch);
  document.addEventListener("keydown", (e) => {
    if (view !== "lancar" || e.target.matches("input, select, textarea") || $("formDlg").open) return;
    if (/^\d$/.test(e.key)) pressKey(e.key);
    else if (e.key === "," || e.key === ".") pressKey(",");
    else if (e.key === "+") pressKey("+");
    else if (e.key === "Backspace") pressKey("back");
    else if (e.key === "Escape") pressKey("clear");
    else return;
    e.preventDefault();
  });

  // ================= Pagamentos fixos =================
  const fixedPaidEntry = (f, m) => data.entries.find((e) => e.fx === f.id && monthOf(e.d) === m);
  function fixedDue() {
    const m = monthOf(today()), dayNow = Number(today().slice(8));
    return data.fixed.filter((f) => !fixedPaidEntry(f, m) && Math.min(f.day, daysIn(m)) <= dayNow);
  }
  function confirmFixed(f) {
    const entry = { id: uid(), t: f.t, v: f.v, cat: f.cat, w: f.w, note: f.name, d: today(), ts: Date.now(), fx: f.id };
    const before = f.t === "out" ? catSpent(f.cat, monthOf(entry.d)) : 0;
    data.entries.push(entry); save(); renderView();
    const warn = f.t === "out" ? limitWarning(catById("out", f.cat), monthOf(entry.d), before) : "";
    toast(`${f.name}: ${fmt(f.v)} registado. ${warn}`.trim(), ["Desfazer", () => { data.entries = data.entries.filter((x) => x.id !== entry.id); save(); renderView(); }]);
  }
  function editFixed(f) {
    const isNew = !f;
    f = f || { t: "out", name: "", v: 0, cat: "casa", w: "dinheiro", day: 1 };
    const catOpts = (t) => catList(t).map((c) => [c.id, c.name]);
    openForm({
      title: isNew ? "Novo pagamento fixo" : "Pagamento fixo",
      intro: "Todos os meses, a partir do dia indicado, a Caderneta pede-lhe para confirmar este valor.",
      fields: [
        { id: "t", label: "Tipo", type: "seg", value: f.t, options: [["out", "Gasto"], ["in", "Entrada"]], onChange: (t, inputs) => {
          const sel = inputs.cat; if (!sel) return; const cur = sel.value; sel.replaceChildren();
          for (const [v, l] of catOpts(t)) sel.append(el("option", { value: v, text: l }));
          if (catList(t).some((c) => c.id === cur)) sel.value = cur;
        } },
        { id: "name", label: "Nome", type: "text", value: f.name, placeholder: "Ex.: Renda, Credelec, Salário" },
        { id: "v", label: "Valor (MT)", type: "money", value: f.v ? fmtPlain(f.v) : "", half: true },
        { id: "day", label: "Dia do mês", type: "number", value: f.day, min: 1, max: 31, half: true },
        { id: "cat", label: "Categoria", type: "select", options: catOpts(f.t), value: f.cat, half: true },
        { id: "w", label: "Carteira", type: "select", options: usedWallets().map((w) => [w.id, w.name]), value: f.w, half: true }
      ],
      submit: isNew ? "Adicionar" : "Guardar",
      onSubmit: (v) => {
        const name = v.name.trim(); const val = parseMoney(v.v); const day = Math.round(Number(v.day));
        if (!name) return "Dê um nome, por exemplo Renda.";
        if (!val) return "Escreva o valor, por exemplo 4500.";
        if (!(day >= 1 && day <= 31)) return "O dia tem de ser entre 1 e 31.";
        const rec = { t: v.t, name, v: val, cat: v.cat, w: v.w, day };
        if (isNew) data.fixed.push({ id: uid(), ...rec }); else Object.assign(f, rec);
        save(); renderView(); toast(isNew ? "Pagamento fixo adicionado" : "Pagamento fixo atualizado");
      },
      onDelete: isNew ? null : () => { data.fixed = data.fixed.filter((x) => x.id !== f.id); save(); renderView(); toast("Pagamento fixo removido. Os lançamentos já feitos ficam."); }
    });
  }

  // ================= Metas =================
  function goalForecast(g) {
    const saved = goalSaved(g.id), left = g.target - saved;
    if (left <= 0) return { text: "Meta alcançada!", good: true };
    const m = monthOf(today());
    if (g.deadline) {
      const n = monthsBetween(m, g.deadline) + 1;
      if (n <= 0) return { text: `Prazo passou · faltam ${fmt(left)}`, bad: true };
      return { text: `${fmt(Math.ceil(left / n / 100) * 100)} por mês até ${monthShort(g.deadline)}` };
    }
    // ao ritmo dos últimos 3 meses de depósitos nesta meta
    const since = shiftMonth(m, -2) + "-01";
    const rate = data.entries.filter((e) => e.t === "goal" && e.g === g.id && e.d >= since).reduce((a, e) => a + e.v, 0) / 3;
    if (rate > 0) { const n = Math.ceil(left / rate); return { text: `Faltam ${fmt(left)} · ≈ ${n} ${n === 1 ? "mês" : "meses"} a este ritmo` }; }
    return { text: `Faltam ${fmt(left)}` };
  }
  function editGoal(g) {
    const isNew = !g;
    g = g || { name: "", target: 0, deadline: "" };
    openForm({
      title: isNew ? "Nova meta" : "Meta",
      intro: isNew ? "Dê um objetivo ao dinheiro que guarda: um telemóvel novo, a reserva de emergência, a escola dos filhos…" : null,
      fields: [
        { id: "name", label: "Nome da meta", type: "text", value: g.name, placeholder: "Ex.: Telemóvel novo" },
        { id: "target", label: "Valor a juntar (MT)", type: "money", value: g.target ? fmtPlain(g.target) : "", half: true },
        { id: "deadline", label: "Até (opcional)", type: "month", value: g.deadline || "", half: true }
      ],
      submit: isNew ? "Criar meta" : "Guardar",
      onSubmit: (v) => {
        const name = v.name.trim(), target = parseMoney(v.target);
        if (!name) return "Dê um nome à meta.";
        if (!target) return "Escreva quanto quer juntar, por exemplo 15000.";
        const rec = { name, target, deadline: v.deadline || "" };
        if (isNew) data.goals.push({ id: uid(), ...rec, created: today() }); else Object.assign(g, rec);
        save(); renderView(); toast(isNew ? "Meta criada" : "Meta atualizada");
      },
      onDelete: isNew ? null : () => {
        const back = goalSaved(g.id);
        data.goals = data.goals.filter((x) => x.id !== g.id);
        data.entries = data.entries.filter((e) => !(e.t === "goal" && e.g === g.id));
        save(); renderView(); toast(back ? `Meta apagada. ${fmt(back)} voltaram às carteiras.` : "Meta apagada");
      }
    });
  }
  function moveGoal(g, withdraw = false) {
    if (!data.goals.length) { editGoal(null); return; }
    g = g || data.goals[0];
    const ws = usedWallets();
    // sugestão: o que sobrou este mês
    const m = monthOf(today()); const l = inMonth(m);
    const sobra = sum(l.filter((e) => e.t === "in")) - sum(l.filter((e) => e.t === "out")) - l.filter((e) => e.t === "goal").reduce((a, e) => a + e.v, 0);
    openForm({
      title: withdraw ? "Retirar da meta" : "Guardar na meta",
      intro: withdraw ? "O valor volta para a carteira escolhida." : (sobra > 0 ? `Este mês ainda sobram ${fmt(sobra)} por guardar.` : "O valor sai da carteira e fica reservado para a meta."),
      fields: [
        { id: "g", label: "Meta", type: "select", options: data.goals.map((x) => [x.id, x.name]), value: g.id },
        { id: "v", label: "Valor (MT)", type: "money", value: !withdraw && sobra > 0 ? fmtPlain(sobra) : "", half: true },
        { id: "w", label: withdraw ? "Para a carteira" : "Da carteira", type: "select", options: ws.map((w) => [w.id, w.name]), value: ws.some((w) => w.id === "dinheiro") ? "dinheiro" : ws[0].id, half: true }
      ],
      submit: withdraw ? "Retirar" : "Guardar",
      onSubmit: (v) => {
        const val = parseMoney(v.v);
        if (!val) return "Escreva o valor.";
        if (withdraw && val > goalSaved(v.g)) return `Esta meta só tem ${fmt(goalSaved(v.g))}.`;
        data.entries.push({ id: uid(), t: "goal", v: withdraw ? -val : val, g: v.g, w: v.w, d: today(), ts: Date.now(), note: "" });
        save(); renderView();
        const gg = goalById(v.g);
        toast(withdraw ? `${fmt(val)} retirados de ${gg.name}` : (goalSaved(gg.id) >= gg.target ? `Parabéns! A meta ${gg.name} foi alcançada.` : `${fmt(val)} guardados em ${gg.name}`));
      }
    });
  }

  // ================= Carteiras =================
  function transfer() {
    const ws = usedWallets();
    if (ws.length < 2) { toast("Ative mais uma carteira em Ajustes para transferir."); return; }
    openForm({
      title: "Transferir entre carteiras",
      intro: "Ex.: levantar dinheiro do M-Pesa. Não conta como gasto nem como entrada.",
      fields: [
        { id: "w", label: "De", type: "select", options: ws.map((w) => [w.id, w.name]), value: ws.find((w) => w.id === "mpesa") ? "mpesa" : ws[0].id, half: true },
        { id: "w2", label: "Para", type: "select", options: ws.map((w) => [w.id, w.name]), value: "dinheiro", half: true },
        { id: "v", label: "Valor (MT)", type: "money", half: true },
        { id: "d", label: "Data", type: "date", value: today(), max: today(), half: true },
        { id: "note", label: "Nota (opcional)", type: "text", placeholder: "Ex.: levantamento no agente" }
      ],
      submit: "Transferir",
      onSubmit: (v) => {
        const val = parseMoney(v.v);
        if (v.w === v.w2) return "Escolha duas carteiras diferentes.";
        if (!val) return "Escreva o valor.";
        data.entries.push({ id: uid(), t: "tr", v: val, w: v.w, w2: v.w2, d: v.d || today(), ts: Date.now(), note: v.note.trim() });
        save(); renderView(); toast(`${fmt(val)}: ${walletById(v.w).name} → ${walletById(v.w2).name}`);
      }
    });
  }
  function adjustWallet(w) {
    const cur = walletBalance(w.id);
    openForm({
      title: `Acertar saldo: ${w.name}`,
      intro: `A Caderneta calcula ${fmt(cur)}. Se tem outro valor na mão ou no telemóvel, escreva o saldo real e ela acerta a diferença (sem contar como gasto).`,
      fields: [{ id: "v", label: "Saldo real (MT)", type: "money", value: fmtPlain(cur), placeholder: "0" }],
      submit: "Acertar",
      onSubmit: (v) => {
        const real = parseMoney(v.v, true);
        if (real === null) return "Escreva o saldo, por exemplo 2500.";
        w.adj = (w.adj || 0) + (real - cur); data.settings.walletsSet = true; save(); renderView(); toast(`Saldo de ${w.name}: ${fmt(real)}`);
      }
    });
  }

  function renderCarteira() {
    const body = $("carteiraBody"); body.replaceChildren();
    const ws = usedWallets();
    const total = ws.reduce((a, w) => a + walletBalance(w.id), 0);
    body.append(el("div", { class: "hero-total" }, el("span", { class: "hero-label", text: "Saldo total" }), el("div", { class: "hero-amount", style: "font-size:2.2rem" }, moneyEl(total))));

    const row = el("div", { class: "wallet-row" });
    ws.forEach((w, i) => {
      const b = walletBalance(w.id);
      row.append(el("button", { type: "button", class: "glass-card wallet-card" + (i % 3 === 1 ? " alt" : i % 3 === 2 ? " alt2" : ""), onclick: () => adjustWallet(w) },
        el("div", { class: "wc-top" }, svg(w.icon), el("span", { class: "wc-hint", text: "Acertar" })),
        el("div", {}, el("div", { class: "wc-name", text: w.name }), el("div", { class: "wc-bal num" + (b < 0 ? " neg" : ""), text: fmt(b) }))));
    });
    body.append(row);
    if (!data.settings.walletsSet && data.entries.length) {
      body.append(el("div", { class: "nag" },
        el("span", { text: "Os saldos começam a contar só a partir dos lançamentos. Toque em cada carteira e escreva quanto tem hoje para ficarem certos." }),
        el("button", { type: "button", class: "btn small", text: "Já está certo", onclick: () => { data.settings.walletsSet = true; save(); renderView(); } })));
    }

    body.append(el("div", { class: "controls" },
      control("transfer", "Transferir", transfer),
      control("piggy", "Guardar", () => moveGoal(null)),
      control("repeat", "Novo fixo", () => editFixed(null)),
      control("target", "Nova meta", () => editGoal(null))));

    // Fixos
    const m = monthOf(today()), dayNow = Number(today().slice(8));
    const fxPanel = el("section", { class: "panel" });
    const pending = data.fixed.filter((f) => !fixedPaidEntry(f, m));
    fxPanel.append(el("h2", { class: "panel-title" }, el("span", { text: "Pagamentos fixos" }),
      pending.length ? el("span", { class: "label", text: `Por confirmar: ${fmt(pending.filter((f) => f.t === "out").reduce((a, f) => a + f.v, 0))}` }) : null));
    if (!data.fixed.length) fxPanel.append(el("p", { class: "muted", text: "Renda, Credelec, crédito, mensalidades, salário… Registe uma vez e confirme todos os meses com um toque." }),
      el("button", { type: "button", class: "btn", text: "+ Adicionar pagamento fixo", onclick: () => editFixed(null) }));
    else {
      const wrap = el("div");
      for (const f of data.fixed.slice().sort((a, b) => a.day - b.day)) {
        const paid = fixedPaidEntry(f, m);
        const c = catById(f.t, f.cat);
        const dueNow = !paid && Math.min(f.day, daysIn(m)) <= dayNow;
        wrap.append(el("div", { class: "fx" },
          el("button", { type: "button", class: "fx-main", onclick: () => editFixed(f) }, iconTile(c.icon, c.color),
            el("span", {}, el("div", { class: "t", text: f.name }), el("div", { class: "s", text: `Dia ${f.day} · ${walletById(f.w).name}${dueNow ? " · em atraso" : ""}` }))),
          el("div", { class: "right" }, el("span", { class: "amt num" + (f.t === "in" ? " in" : ""), text: (f.t === "in" ? "+" : "") + fmt(f.v) }),
            paid ? el("span", { class: "paid" }, svg("check"), f.t === "in" ? "Recebido" : "Pago")
              : el("button", { type: "button", class: "btn small" + (dueNow ? " primary" : ""), text: "Confirmar", onclick: () => confirmFixed(f) }))));
      }
      fxPanel.append(wrap);
    }
    body.append(fxPanel);

    // Metas
    const gPanel = el("section", { class: "panel" }, el("h2", { class: "panel-title" }, el("span", { text: "Metas" }),
      data.goals.length ? el("span", { class: "label", text: `Guardado: ${fmt(data.goals.reduce((a, g) => a + goalSaved(g.id), 0))}` }) : null));
    if (!data.goals.length) gPanel.append(el("p", { class: "muted", text: "Guardar com um objetivo motiva mais. Crie uma meta e vá guardando o que sobra." }),
      el("button", { type: "button", class: "btn primary", text: "Criar a primeira meta", onclick: () => editGoal(null) }));
    else {
      const wrap = el("div");
      for (const g of data.goals) {
        const saved = goalSaved(g.id), p = g.target ? saved / g.target : 0, fc = goalForecast(g);
        const shown = Math.min(100, Math.round(p * 100));
        wrap.append(el("div", { class: "goal" },
          el("div", { class: "goal-top" }, el("button", { type: "button", onclick: () => editGoal(g), text: g.name }), el("span", { class: "num" }, el("b", { text: fmtNum(saved) }), el("span", { class: "muted", text: " / " + fmt(g.target) }))),
          el("div", { class: "meter-wrap", style: `--pill-pos:${shown < 20 ? "flex-start" : shown > 80 ? "flex-end" : "center"}` },
            el("span", { class: "pill-pct", text: Math.round(p * 100) + "%" }),
            el("div", { class: "meter" + (p >= 1 ? " full" : "") }, el("span", { style: `width:${shown}%` }))),
          el("div", { class: "goal-actions" }, el("span", { class: "tile-note" + (fc.good ? " good" : fc.bad ? " bad" : ""), text: fc.text }),
            el("span", { class: "btnrow" },
              saved > 0 ? el("button", { type: "button", class: "btn small", text: "Retirar", onclick: () => moveGoal(g, true) }) : null,
              el("button", { type: "button", class: "btn small primary", text: "Guardar", onclick: () => moveGoal(g) })))));
      }
      gPanel.append(wrap);
    }
    body.append(gPanel);
  }

  // ================= Resumo =================
  function renderResumo() {
    const body = $("resumoBody"); body.replaceChildren();
    const m = viewMonth, isCur = m === monthOf(today());
    const list = inMonth(m);
    const outs = list.filter((e) => e.t === "out"), ins = list.filter((e) => e.t === "in");
    const S = sum(outs), E = sum(ins), G = data.settings.saveGoal || 0;
    const toGoals = list.filter((e) => e.t === "goal").reduce((a, e) => a + e.v, 0);
    const left = E - S;

    if (isCur) {
      const t = today(), ws = weekStart();
      body.append(el("div", { class: "kpis" },
        kpi("Hoje", sum(outs.filter((e) => e.d === t))),
        kpi("Esta semana", sum(data.entries.filter((e) => e.t === "out" && e.d >= ws && e.d <= t))),
        kpi("Este mês", S)));
    }

    const [y, mo] = m.split("-").map(Number);
    body.append(el("div", { class: "glass-card bank-card" },
      el("div", { class: "bank-top" }, el("span", { class: "bank-mark" }, svg("coin")), el("span", { class: "bank-month", text: `${MONTHS_S[mo - 1]} ${y}` })),
      el("div", {}, el("div", { class: "bank-label", text: "Sobra do mês" }),
        el("div", { class: "bank-number" }, fmtNum(left), el("span", { class: "cur", text: "MT" }))),
      el("div", { class: "bank-bottom" },
        el("span", {}, "Entradas", el("b", { text: fmt(E) })),
        toGoals ? el("span", { style: "text-align:center" }, "Em metas", el("b", { text: fmt(toGoals) })) : null,
        el("span", { style: "text-align:right" }, "Gastos", el("b", { text: fmt(S) })))));

    body.append(el("div", { class: "controls" },
      control("plus", "Novo gasto", () => { setLaunchType("out"); location.hash = "#lancar"; }),
      control("outent", "Nova entrada", () => { setLaunchType("in"); location.hash = "#lancar"; }),
      control("piggy", "Guardar", () => moveGoal(null)),
      control("shield", "Cópia", doBackup)));

    renderBackupNag(body);
    if (android && !data.settings.reminder.on && data.entries.length >= 3 && !data.settings.reminderNagDone) {
      body.append(el("div", { class: "nag" }, el("span", { text: "Quer um lembrete à noite nos dias em que não anotar nada?" }),
        el("span", { class: "btnrow" },
          el("button", { type: "button", class: "btn small", text: "Agora não", onclick: () => { data.settings.reminderNagDone = true; save(); renderView(); } }),
          el("button", { type: "button", class: "btn small primary", text: "Ativar", onclick: () => { setReminder(true); renderView(); } }))));
    }

    if (!data.entries.length) {
      body.append(el("div", { class: "panel empty" },
        el("strong", { text: "Ainda não há lançamentos" }),
        el("span", { text: "Vá a Lançar, digite um valor e toque numa categoria. O resumo aparece aqui." }),
        el("a", { class: "btn primary", href: "#lancar", text: "Fazer o primeiro lançamento" })));
      return;
    }

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

    body.append(el("a", { class: "row-card", href: "#historico" }, el("span", { class: "ic-box" }, svg("doc")), el("span", { class: "t", text: `Lançamentos de ${MONTHS[mo - 1]}` }), el("span", { class: "link", text: "Ver" })));

    // Categorias (com limites)
    const prevM = shiftMonth(m, -1);
    const prev = inMonth(prevM).filter((e) => e.t === "out");
    const byCat = {}, byPrev = {};
    for (const e of outs) byCat[e.cat] = (byCat[e.cat] || 0) + e.v;
    for (const e of prev) byPrev[e.cat] = (byPrev[e.cat] || 0) + e.v;
    for (const c of catList("out")) if (c.limit && !byCat[c.id]) byCat[c.id] = 0; // mostrar limites ainda sem gasto
    const rows = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    const catPanel = el("section", { class: "panel" }, el("h2", { class: "panel-title" }, el("span", { text: "Para onde foi o dinheiro" }), el("a", { href: "#ajustes", text: "Limites" })));
    if (!rows.length || !S && !rows.some(([id]) => catById("out", id).limit)) catPanel.append(el("p", { class: "muted", text: "Nenhum gasto neste mês." }));
    else {
      if (S) { const top = catById("out", rows[0][0]); catPanel.append(el("p", { class: "muted", text: `${top.name} é o seu maior gasto: ${Math.round(rows[0][1] / S * 100)}% do mês.` })); }
      const max = Math.max(1, rows[0][1]);
      const wrap = el("div");
      for (const [id, v] of rows) {
        const c = catById("out", id);
        const p = byPrev[id] || 0;
        let delta = null;
        if (prev.length && v) {
          if (!p) delta = el("span", { class: "up", text: "novo" });
          else { const ch = Math.round((v - p) / p * 100); delta = el("span", { class: ch > 0 ? "up" : ch < 0 ? "down" : "", text: ch === 0 ? "igual" : `${ch > 0 ? "▲" : "▼"} ${Math.abs(ch)}% vs ${MONTHS_S[Number(prevM.slice(5)) - 1]}` }); }
        }
        let barPct = v / max, barColor = c.color, limitLine = null;
        if (c.limit) {
          const lp = v / c.limit; barPct = Math.min(1, lp);
          const st = lp >= 1 ? "over" : lp >= 0.8 ? "warn" : "";
          if (st === "over") barColor = "var(--out)"; else if (st === "warn") barColor = "var(--warn)";
          limitLine = el("div", { class: "limit-line " + st }, el("span", { text: `Limite ${fmt(c.limit)}` }), el("span", { text: lp >= 1 ? `passou ${fmt(v - c.limit)}` : `restam ${fmt(c.limit - v)}` }));
        }
        wrap.append(el("div", { class: "tx" }, iconTile(c.icon, c.color),
          el("div", {}, el("div", { class: "t", text: c.name }),
            el("div", { class: "s" }, el("span", { text: S ? `${Math.round(v / S * 100)}% do mês` : "sem gastos" }), delta ? el("span", { class: "dotsep" }, delta) : null),
            el("div", { class: "bar" }, el("span", { style: `width:${(barPct * 100).toFixed(1)}%;background:${barColor}` })), limitLine),
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
  const filterKey = (e) => e.t === "tr" ? "tr" : e.t === "goal" ? "goal" : e.t + ":" + e.cat;
  function filterLabel(key) {
    if (key === "tr") return ["Transferências", "#4f86ff"];
    if (key === "goal") return ["Metas", "#ffd25a"];
    const [t, id] = key.split(":"); const c = catById(t, id); return [c.name, c.color];
  }
  function renderHist() {
    const list = inMonth(viewMonth);
    const fbox = $("histFilter"); fbox.replaceChildren();
    const used = [...new Set(list.map(filterKey))];
    if (used.length > 1) {
      fbox.append(el("button", { type: "button", class: "chip", "aria-pressed": String(!histFilter), onclick: () => { histFilter = null; renderHist(); } }, "Todos"));
      for (const key of used) {
        const [name, color] = filterLabel(key);
        fbox.append(el("button", { type: "button", class: "chip", "aria-pressed": String(histFilter === key), onclick: () => { histFilter = histFilter === key ? null : key; renderHist(); } },
          el("span", { style: `width:8px;height:8px;border-radius:50%;background:${color}` }), name));
      }
    }
    const box = $("histList"); box.replaceChildren();
    const rv = reviewList();
    if (rv.length) {
      const p = el("section", { class: "panel review" }, el("h2", { class: "panel-title" }, el("span", { text: "Por categorizar" }), el("span", { class: "label", text: "lidos das SMS" })),
        el("p", { class: "muted", text: "Toque para escolher a categoria. Da próxima vez, a mesma pessoa ou loja fica com a mesma categoria." }));
      const wrap = el("div");
      for (const e of rv.slice(0, 30)) {
        const info = entryInfo(e);
        wrap.append(el("button", { type: "button", class: "tx", onclick: () => editEntry(e) }, iconTile("tag", "#ffd25a"),
          el("div", {}, el("div", { class: "t", text: info.title }), el("div", { class: "s", text: `${dayName(e.d)} · ${walletById(e.w).name}` })),
          el("span", { class: "amt num" + info.cls, text: info.amount })));
      }
      p.append(wrap);
      if (rv.length > 1) p.append(el("button", { type: "button", class: "btn small", text: "Manter todos como estão", onclick: () => { for (const e of rv) e.review = false; save(); renderView(); } }));
      box.append(p);
    }
    let items = histFilter ? list.filter((e) => filterKey(e) === histFilter) : list;
    if (!items.length) {
      box.append(el("div", { class: "panel empty" }, el("strong", { text: "Nada em " + monthName(viewMonth) }),
        el("span", { text: "Os lançamentos que fizer aparecem aqui, agrupados por dia." })));
      return;
    }
    if (histFilter) box.append(el("p", { class: "muted", text: `${items.length} lançamento${items.length > 1 ? "s" : ""} · total ${fmt(Math.abs(sum(items)))}` }));
    items = items.slice().sort((a, b) => b.d.localeCompare(a.d) || b.ts - a.ts);
    const groups = new Map();
    for (const e of items) { if (!groups.has(e.d)) groups.set(e.d, []); groups.get(e.d).push(e); }
    for (const [d, g] of groups) {
      const dayOut = sum(g.filter((e) => e.t === "out"));
      const panel = el("section", { class: "panel" }, el("div", { class: "day-h" }, el("span", { text: dayName(d) }), el("span", { class: "num", text: dayOut ? fmt(dayOut) : "" })));
      const wrap = el("div");
      for (const e of g) {
        const info = entryInfo(e);
        const sameDay = e.ts && e.d === isoOf(new Date(e.ts));
        wrap.append(el("button", { type: "button", class: "tx", onclick: () => editEntry(e) }, iconTile(info.icon, info.color),
          el("div", {}, el("div", { class: "t", text: info.title }),
            el("div", { class: "s" }, sameDay ? el("span", { text: timeOf(e.ts) }) : null, el("span", { class: sameDay ? "dotsep" : "", text: info.sub + (e.fx ? " · fixo" : "") + (e.auto ? " · SMS" : "") }))),
          el("span", { class: "amt num" + info.cls, text: info.amount })));
      }
      panel.append(wrap);
      box.append(panel);
    }
  }

  function editEntry(e) {
    const ws = usedWallets().map((w) => [w.id, w.name]);
    if (!ws.some(([id]) => id === e.w)) ws.push([e.w, walletById(e.w).name]);
    const del = () => {
      data.entries = data.entries.filter((x) => x.id !== e.id); save(); renderView();
      toast("Lançamento apagado", ["Desfazer", () => { data.entries.push(e); save(); renderView(); }]);
    };
    if (e.t === "tr" || e.t === "goal") {
      openForm({
        title: e.t === "tr" ? "Transferência" : (e.v >= 0 ? "Guardado na meta" : "Retirado da meta"),
        intro: e.t === "tr" ? `${walletById(e.w).name} → ${walletById(e.w2).name}` : goalById(e.g).name,
        fields: [{ id: "v", label: "Valor (MT)", type: "money", value: fmtPlain(Math.abs(e.v)), half: true }, { id: "d", label: "Data", type: "date", value: e.d, max: today(), half: true }],
        onSubmit: (v) => { const val = parseMoney(v.v); if (!val) return "Escreva um valor maior que zero."; e.v = e.v < 0 ? -val : val; e.d = v.d || e.d; save(); renderView(); toast("Lançamento atualizado"); },
        onDelete: del
      });
      return;
    }
    const cats = catList(e.t).map((c) => [c.id, c.name]);
    if (!cats.some(([id]) => id === e.cat)) cats.push([e.cat, "Sem categoria"]);
    openForm({
      title: e.t === "out" ? "Editar gasto" : "Editar entrada",
      fields: [
        { id: "v", label: "Valor (MT)", type: "money", value: fmtPlain(e.v) },
        { id: "cat", label: "Categoria", type: "select", options: cats, value: e.cat },
        { id: "w", label: "Carteira", type: "select", options: ws, value: e.w, half: true },
        { id: "d", label: "Data", type: "date", value: e.d, max: today(), half: true },
        { id: "note", label: "Nota", type: "text", value: e.note || "", maxlength: 60 }
      ],
      onSubmit: (v) => {
        const val = parseMoney(v.v);
        if (!val) return "Escreva um valor maior que zero, por exemplo 350 ou 12,50.";
        if (!v.d) return "Escolha a data.";
        Object.assign(e, { v: val, cat: v.cat, w: v.w, d: v.d, note: v.note.trim() });
        let learned = 0;
        if (e.review || e.party) {
          e.review = false;
          if (e.party) {
            data.smsRules[normParty(e.party)] = v.cat;
            for (const o of data.entries) if (o.review && o.t === e.t && normParty(o.party) === normParty(e.party)) { o.cat = v.cat; o.review = false; learned++; }
          }
        }
        save(); renderView(); toast(learned ? `Atualizado. Mais ${learned} de ${e.party} ficaram em ${catById(e.t, v.cat).name}.` : "Lançamento atualizado");
      },
      onDelete: del
    });
  }

  // ================= Lembrete diário =================
  function setReminder(on, h, m) {
    const r = data.settings.reminder;
    r.on = on; if (h != null) { r.h = h; r.m = m; }
    data.settings.reminderNagDone = true;
    save();
    if (android && android.definirLembrete) {
      try { android.definirLembrete(r.on, r.h, r.m); } catch (e) { /* ignorar */ }
      if (on) toast(`Lembrete ativo: todos os dias às ${pad(r.h)}:${pad(r.m)}, se não tiver anotado nada.`);
    }
  }
  window.__cadernetaPermissao = (granted) => {
    if (!granted) { data.settings.reminder.on = false; save(); toast("Sem permissão de notificações o lembrete não pode aparecer. Pode ativá-la nas definições do Android."); }
    if (view === "ajustes" || view === "resumo") renderView();
  };

  // ================= Ajustes =================
  let installEvt = null;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installEvt = e; if (view === "ajustes") renderAjustes(); });

  function renderAjustes() {
    const body = $("ajustesBody"); body.replaceChildren();

    if (installEvt) body.append(el("section", { class: "panel" }, el("h2", { class: "panel-title", text: "Instalar no telemóvel" }),
      el("p", { class: "muted", text: "Adicione a Caderneta ao ecrã principal para abrir como um app, mesmo sem internet." }),
      el("button", { type: "button", class: "btn primary", text: "Instalar app", onclick: async () => { installEvt.prompt(); await installEvt.userChoice.catch(() => {}); installEvt = null; renderAjustes(); } })));

    // Meta mensal
    const goalIn = el("input", { id: "goalInput", inputmode: "decimal", autocomplete: "off", placeholder: "Ex.: 3 000", value: data.settings.saveGoal ? fmtPlain(data.settings.saveGoal) : "" });
    const goalErr = el("p", { class: "err" });
    const saveGoal = () => {
      const raw = goalIn.value.trim();
      const v = raw === "" ? 0 : parseMoney(raw);
      if (v === null) { goalErr.textContent = "Escreva um valor válido, por exemplo 3000."; return; }
      data.settings.saveGoal = v; save(); goalErr.textContent = ""; toast(v ? `Meta definida: guardar ${fmt(v)} por mês` : "Meta removida");
    };
    goalIn.addEventListener("keydown", (e) => { if (e.key === "Enter") saveGoal(); });
    body.append(el("section", { class: "panel" }, el("h2", { class: "panel-title", text: "Poupança mensal" }),
      el("p", { class: "muted", text: "Quanto quer guardar por mês? O resumo mostra quanto ainda pode gastar para cumprir." }),
      el("div", { class: "setrow" }, goalIn, el("button", { type: "button", class: "btn primary", text: "Guardar", onclick: saveGoal })), goalErr));

    // Lembrete
    const rem = data.settings.reminder;
    const remPanel = el("section", { class: "panel" }, el("h2", { class: "panel-title", text: "Lembrete diário" }));
    if (android && android.definirLembrete) {
      const st = androidReminderState();
      if (st) { rem.on = !!st.ativo && st.permitido !== false; rem.h = st.hora; rem.m = st.minuto; }
      const sw = el("input", { type: "checkbox", id: "remOn", "aria-label": "Ativar lembrete diário" }); sw.checked = rem.on;
      const time = el("input", { type: "time", id: "remTime", value: `${pad(rem.h)}:${pad(rem.m)}`, style: "max-width:130px" });
      sw.onchange = () => { const [h, m] = time.value.split(":").map(Number); setReminder(sw.checked, h, m); };
      time.onchange = () => { const [h, m] = time.value.split(":").map(Number); if (!isNaN(h)) setReminder(sw.checked, h, m); };
      remPanel.append(el("label", { class: "switch" }, el("span", { text: "Avisar-me se não anotar nada no dia" }), sw),
        el("div", { class: "setrow" }, el("span", { class: "muted", text: "Hora do aviso" }), time));
    } else remPanel.append(el("p", { class: "muted", text: "O lembrete funciona no app instalado (APK) para Android." }));
    body.append(remPanel);

    // Leitura de SMS
    const smsPanel = el("section", { class: "panel" }, el("h2", { class: "panel-title", text: "Ler SMS do e-Mola, M-Pesa e banco" }));
    if (android && android.definirSms) {
      let st = null; try { st = JSON.parse(android.estadoSms()); } catch (e) { st = null; }
      const on = !!(st && st.ativo && st.permitido);
      const sw = el("input", { type: "checkbox", id: "smsOn", "aria-label": "Ler SMS automaticamente" }); sw.checked = on;
      sw.onchange = () => { data.settings.sms.on = sw.checked; save(); android.definirSms(sw.checked); if (!sw.checked) toast("Leitura de SMS desligada"); };
      smsPanel.append(
        el("p", { class: "muted", text: "Quando chega uma SMS de pagamento, envio, recebimento ou levantamento, a Caderneta cria o lançamento e acerta o saldo da carteira com o saldo real da mensagem. As mensagens são lidas só neste telemóvel; nada é enviado para fora." }),
        el("label", { class: "switch" }, el("span", { text: "Ler SMS automaticamente" }), sw),
        el("p", { class: "muted", text: "e-Mola: reconhecido. M-Pesa e bancos: leitura experimental (mande exemplos para melhorar)." }),
        on ? el("button", { type: "button", class: "btn", text: "Importar SMS dos últimos 30 dias", onclick: () => {
          let list = []; try { list = JSON.parse(android.lerSmsAntigas(30) || "[]"); } catch (e) { list = []; }
          const n = processSms(list); renderView();
          toast(n ? `${n} movimento${n > 1 ? "s" : ""} importado${n > 1 ? "s" : ""}. Veja-os em Histórico.` : "Não encontrei movimentos novos nas SMS.");
        } }) : null);
    } else smsPanel.append(el("p", { class: "muted", text: "Disponível no app instalado (APK) para Android." }));
    body.append(smsPanel);

    // Carteiras
    const wPanel = el("section", { class: "panel" }, el("h2", { class: "panel-title", text: "Carteiras" }),
      el("p", { class: "muted", text: "Escolha as carteiras que usa. O saldo de cada uma aparece em Carteira." }));
    for (const w of wallets()) {
      const name = el("input", { value: w.name, maxlength: 20, "aria-label": "Nome da carteira" });
      name.addEventListener("change", () => { const v = name.value.trim(); if (v) { w.name = v; save(); toast("Carteira renomeada"); } else name.value = w.name; });
      const sw = el("input", { type: "checkbox", "aria-label": "Mostrar " + w.name }); sw.checked = w.show;
      sw.onchange = () => { w.show = sw.checked; if (!usedWallets().length) { w.show = true; sw.checked = true; toast("Precisa de pelo menos uma carteira."); } save(); };
      wPanel.append(el("div", { class: "setrow switch" }, el("span", { class: "icon-pick" }, svg(w.icon)), name, sw));
    }
    body.append(wPanel);

    for (const t of ["out", "in"]) body.append(catEditor(t));

    // Cópia
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
      el("p", { class: "muted", text: t === "out" ? "Toque no ícone para o trocar. Defina um limite por mês para receber um aviso aos 80% e ao passar." : "Toque no ícone para o trocar." }));
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
      if (t === "out") {
        const lim = el("input", { inputmode: "decimal", autocomplete: "off", placeholder: "sem limite", value: c.limit ? fmtPlain(c.limit) : "", "aria-label": "Limite mensal de " + c.name });
        lim.addEventListener("change", () => {
          const raw = lim.value.trim(); const v = raw === "" ? 0 : parseMoney(raw);
          if (v === null) { lim.value = c.limit ? fmtPlain(c.limit) : ""; toast("Escreva um valor, por exemplo 3000."); return; }
          c.limit = v; save(); toast(v ? `Limite de ${c.name}: ${fmt(v)} por mês` : `${c.name} sem limite`);
        });
        panel.append(el("div", { class: "setrow-sub" }, el("span", { text: "Limite/mês" }), lim));
      }
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
    if (android) { android.partilharFicheiro(filename, mime, text); return true; }
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
    const lines = [["Data", "Tipo", "Categoria / Meta", "Carteira", "Para carteira", "Nota", "Valor (MT)"].join(";")];
    const TYPE = { out: "Gasto", in: "Entrada", tr: "Transferência", goal: "Meta" };
    for (const e of data.entries.slice().sort((a, b) => a.d.localeCompare(b.d))) {
      const what = e.t === "goal" ? goalById(e.g).name : e.t === "tr" ? "" : catById(e.t, e.cat).name;
      const sign = e.t === "in" ? 1 : e.t === "out" ? -1 : e.t === "goal" ? -1 : 1;
      lines.push([e.d, TYPE[e.t], esc(what), esc(walletById(e.w).name), e.w2 ? esc(walletById(e.w2).name) : "", esc(e.note || ""), (sign * e.v / 100).toFixed(2).replace(".", ",")].join(";"));
    }
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
  const APP_VERSION = "1.3.0";
  const IN_APK = /CadernetaApp/.test(navigator.userAgent);
  window.__cadernetaVoltar = () => {
    if ($("formDlg").open) { $("formDlg").close(); return true; }
    if (view !== "lancar") { location.hash = "#lancar"; return true; }
    return false;
  };
  window.__cadernetaInsets = (top) => { document.documentElement.style.setProperty("--inset-top", top + "px"); };

  save(); // grava a migração e informa o APK do último lançamento
  setLaunchType("out");
  if (!location.hash) history.replaceState(null, "", "#lancar");
  route();
  let lastDay = today();
  window.__cadernetaPermissaoSms = (granted) => {
    if (!granted) { data.settings.sms.on = false; save(); toast("Sem permissão para ler SMS, a leitura automática fica desligada."); }
    else { toast("Leitura de SMS ativa. Pode importar as mensagens dos últimos 30 dias em Ajustes."); }
    if (view === "ajustes") renderView();
  };
  pullSms();
  document.addEventListener("visibilitychange", () => { if (!document.hidden) pullSms(); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden && today() !== lastDay) { lastDay = today(); viewMonth = monthOf(lastDay); $("date").value = lastDay; renderView(); } });

  if (!IN_APK && "serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
    let reloaded = false;
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (reloaded || !hadController) return; reloaded = true; if (!launch.expr) location.reload(); });
  }
})();
