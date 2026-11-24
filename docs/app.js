/* Caderneta de Gastos — tudo fica guardado no próprio telemóvel (localStorage). */
(() => {
  "use strict";

  // ================= Dados base =================
  const KEY = "caderneta:v1";
  const PAYS = ["Dinheiro", "M-Pesa", "e-Mola", "mKesh", "Banco"];
  const DEFAULT_CATS = {
    out: [
      ["alim", "Alimentação", "#d9752a"], ["merc", "Mercado", "#2f9568"], ["transp", "Transporte", "#7259c4"],
      ["casa", "Casa", "#4874a6"], ["energ", "Energia e água", "#b8941c"], ["cred", "Crédito e dados", "#2f93aa"],
      ["saude", "Saúde", "#c9404f"], ["famil", "Família", "#a85f22"], ["lazer", "Lazer", "#984a8c"], ["outros", "Outros", "#7d8a85"]
    ],
    in: [["salario", "Salário", "#187a49"], ["negocio", "Negócio / biscate", "#36985f"], ["outent", "Outras entradas", "#5fae82"]]
  };

  function freshData() {
    const cats = {};
    for (const t of ["out", "in"]) cats[t] = DEFAULT_CATS[t].map(([id, name, color]) => ({ id, name, color }));
    return { version: 1, entries: [], cats, settings: { saveGoal: 0, lastBackup: 0 } };
  }
  function isValidData(d) {
    return d && d.version === 1 && Array.isArray(d.entries) && d.cats && Array.isArray(d.cats.out) && Array.isArray(d.cats.in) && d.settings;
  }
  function loadData() {
    try { const d = JSON.parse(localStorage.getItem(KEY)); if (isValidData(d)) return d; } catch (e) { /* sem dados */ }
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
  const weekStart = () => { const d = new Date(); const wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return isoOf(d); }; // segunda-feira
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  // Formato moçambicano: 1 250,50 MT (sem casas decimais quando o valor é inteiro)
  function fmtNum(cents) {
    const neg = cents < 0; cents = Math.abs(Math.round(cents));
    const int = Math.floor(cents / 100), dec = cents % 100;
    const s = String(int).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (neg ? "−" : "") + s + (dec ? "," + pad(dec) : "");
  }
  const fmt = (cents) => fmtNum(cents) + " MT";

  // "1 250,5" | "1250.50" -> centavos
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
  const catById = (type, id) => catList(type).find((c) => c.id === id) || { id, name: "Sem categoria", color: "#7d8a85" };
  const initials = (name) => { const w = name.trim().split(/\s+/)[0] || "?"; return w.charAt(0).toUpperCase() + (w.charAt(1) || "").toLowerCase(); };

  const sum = (list) => list.reduce((a, e) => a + e.v, 0);
  const inMonth = (m) => data.entries.filter((e) => monthOf(e.d) === m);

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
  const VIEWS = { lancar: "Lançar", resumo: "Resumo", historico: "Histórico", ajustes: "Ajustes" };
  let view = "lancar";
  let viewMonth = monthOf(today());
  function route() {
    const h = location.hash.replace("#", "");
    view = VIEWS[h] ? h : "lancar";
    for (const k of Object.keys(VIEWS)) $("v-" + k).hidden = k !== view;
    document.querySelectorAll(".tabs a").forEach((a) => { if (a.dataset.tab === view) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    $("viewTitle").textContent = VIEWS[view];
    document.querySelector("main").scrollTop = 0;
    renderView();
  }
  window.addEventListener("hashchange", route);
  document.querySelectorAll(".mbtn").forEach((b) => b.addEventListener("click", () => { viewMonth = shiftMonth(viewMonth, Number(b.dataset.mdelta)); histFilter = null; renderView(); }));

  function renderView() {
    renderAppbar();
    document.querySelectorAll(".mlabel").forEach((n) => (n.textContent = monthName(viewMonth)));
    if (view === "lancar") renderLaunch();
    else if (view === "resumo") renderResumo();
    else if (view === "historico") renderHist();
    else renderAjustes();
  }
  function renderAppbar() {
    const t = today();
    const spentToday = sum(data.entries.filter((e) => e.t === "out" && e.d === t));
    const spentMonth = sum(inMonth(monthOf(t)).filter((e) => e.t === "out"));
    $("appbarSub").textContent = `Hoje ${fmt(spentToday)} · Mês ${fmt(spentMonth)}`;
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

  function renderLaunch() {
    // categorias
    const grid = $("catGrid"); grid.replaceChildren();
    const cats = catList(launch.type);
    grid.classList.toggle("few", cats.length <= 6);
    for (const c of cats) {
      grid.append(el("button", { type: "button", class: "cat", onclick: () => commit(c) },
        el("span", { class: "ic", style: `background:${c.color}`, text: initials(c.name) }),
        el("span", { class: "nm", text: c.name })));
    }
    // pagamento
    const pc = $("payChips"); pc.replaceChildren();
    for (const p of PAYS) pc.append(el("button", { type: "button", class: "chip", "aria-pressed": String(launch.pay === p), onclick: () => { launch.pay = p; renderLaunch(); } }, p));
    pc.closest(".more-body").querySelector(".chips").hidden = false;
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
    renderAppbar(); renderLaunch();
    toast(`${fmt(v)} em ${cat.name}`, ["Desfazer", () => { data.entries = data.entries.filter((x) => x.id !== entry.id); save(); renderView(); toast("Lançamento desfeito"); }]);
  }

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
    renderBackupNag();
    const m = viewMonth, cur = monthOf(today()), isCur = m === cur;
    const list = inMonth(m);
    const outs = list.filter((e) => e.t === "out"), ins = list.filter((e) => e.t === "in");
    const S = sum(outs), E = sum(ins), G = data.settings.saveGoal || 0;

    if (!data.entries.length) {
      body.append(el("div", { class: "card empty" },
        el("strong", { text: "Ainda não há lançamentos" }),
        el("span", { text: "Vá a Lançar, digite um valor e toque numa categoria. O resumo aparece aqui." }),
        el("a", { class: "btn primary", href: "#lancar", text: "Fazer o primeiro lançamento" })));
      return;
    }

    // Hoje / semana / mês
    if (isCur) {
      const t = today(), ws = weekStart();
      const sToday = sum(outs.filter((e) => e.d === t));
      const sWeek = sum(data.entries.filter((e) => e.t === "out" && e.d >= ws && e.d <= t));
      body.append(el("div", { class: "kpis" },
        kpi("Hoje", sToday), kpi("Esta semana", sWeek), kpi("Este mês", S)));
    }

    // Sobra do mês e meta
    const left = E - S;
    const goalCard = el("div", { class: "card" },
      el("div", { class: "label", text: "Sobra do mês" }),
      el("div", { class: "big num " + (left < 0 ? "neg" : "pos"), text: fmt(left) }),
      el("div", { class: "split" },
        el("div", {}, el("span", { class: "label", text: "Entradas" }), el("span", { class: "num pos", text: fmt(E) })),
        el("div", {}, el("span", { class: "label", text: "Gastos" }), el("span", { class: "num neg", text: fmt(S) }))));
    if (!G) {
      goalCard.append(el("p", { class: "muted", text: "Defina quanto quer guardar por mês e o app diz quanto ainda pode gastar." }),
        el("a", { class: "btn", href: "#ajustes", text: "Definir meta de poupança" }));
    } else if (!E) {
      goalCard.append(el("p", { class: "muted", text: `Meta: guardar ${fmt(G)}. Registe as entradas do mês (salário, negócio) para ver quanto pode gastar.` }));
    } else {
      const canSpend = E - G;
      const remaining = canSpend - S;
      const pct = canSpend > 0 ? S / canSpend : 2;
      const meter = el("div", { class: "meter" + (pct > 1 ? " over" : pct > 0.85 ? " warn" : "") }, el("span", { style: `width:${Math.min(100, pct * 100).toFixed(1)}%` }));
      let status;
      if (remaining >= 0) {
        let perDay = "";
        if (isCur) { const days = daysIn(m) - Number(today().slice(8)) + 1; perDay = ` Isso dá cerca de ${fmt(Math.floor(remaining / days / 100) * 100)} por dia até ao fim do mês.`; }
        status = el("p", { class: "muted" }, el("span", { class: "pill good", text: "Dentro da meta" }), ` Ainda pode gastar ${fmt(remaining)} e guardar ${fmt(G)}.${perDay}`);
      } else {
        const saved = Math.max(0, E - S);
        status = el("p", { class: "muted" }, el("span", { class: "pill bad", text: "Meta em risco" }), ` Passou ${fmt(-remaining)} do que podia gastar. Assim, vai guardar ${fmt(saved)} em vez de ${fmt(G)}.`);
      }
      goalCard.append(el("div", { class: "label", text: `Meta: guardar ${fmt(G)} · pode gastar ${fmt(Math.max(0, canSpend))}` }), meter, status);
    }
    body.append(goalCard);

    // Categorias
    const prev = inMonth(shiftMonth(m, -1)).filter((e) => e.t === "out");
    const byCat = {}, byPrev = {};
    for (const e of outs) byCat[e.cat] = (byCat[e.cat] || 0) + e.v;
    for (const e of prev) byPrev[e.cat] = (byPrev[e.cat] || 0) + e.v;
    const rows = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    const catCard = el("div", { class: "card" }, el("h2", { text: "Para onde foi o dinheiro" }));
    if (!rows.length) catCard.append(el("p", { class: "muted", text: "Nenhum gasto neste mês." }));
    else {
      const top = catById("out", rows[0][0]);
      catCard.append(el("p", { class: "muted", text: `${top.name} é o seu maior gasto: ${Math.round(rows[0][1] / S * 100)}% de tudo o que gastou no mês.` }));
      const wrap = el("div", { class: "catrows" });
      const max = rows[0][1];
      for (const [id, v] of rows) {
        const c = catById("out", id);
        const p = byPrev[id] || 0;
        let delta;
        if (!prev.length) delta = el("span", { text: "" });
        else if (!p) delta = el("span", { class: "up", text: "novo este mês" });
        else { const ch = Math.round((v - p) / p * 100); delta = el("span", { class: ch > 0 ? "up" : ch < 0 ? "down" : "", text: ch === 0 ? "igual ao mês anterior" : `${ch > 0 ? "▲" : "▼"} ${Math.abs(ch)}% vs. ${MONTHS_S[Number(shiftMonth(m, -1).slice(5)) - 1]}` }); }
        wrap.append(el("div", { class: "catrow" },
          el("div", { class: "top" }, el("span", { class: "n" }, el("span", { class: "dot", style: `background:${c.color}` }), el("span", { text: c.name })), el("span", { class: "num", text: fmt(v) })),
          el("div", { class: "bar" }, el("span", { style: `width:${(v / max * 100).toFixed(1)}%;background:${c.color}` })),
          el("div", { class: "sub" }, el("span", { text: `${Math.round(v / S * 100)}% do mês` }), delta)));
      }
      catCard.append(wrap);
    }
    body.append(catCard);

    // Últimos 6 meses
    body.append(monthsChart(m));
  }

  function kpi(label, v) {
    return el("div", { class: "kpi" }, el("span", { class: "label", text: label }), el("span", { class: "v num", text: fmt(v) }));
  }

  function monthsChart(m) {
    const months = []; for (let i = 5; i >= 0; i--) months.push(shiftMonth(m, -i));
    const vals = months.map((mm) => { const l = inMonth(mm); return { m: mm, out: sum(l.filter((e) => e.t === "out")), in: sum(l.filter((e) => e.t === "in")) }; });
    const max = Math.max(1, ...vals.map((v) => Math.max(v.out, v.in)));
    const W = 340, H = 170, T = 22, B = 24, L = 4, R = 4;
    const colW = (W - L - R) / 6, bw = colW * 0.3;
    const NS = "http://www.w3.org/2000/svg";
    const mk = (tag, a, text) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); if (text != null) e.textContent = text; return e; };
    const svg = mk("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Entradas e gastos dos últimos seis meses" });
    svg.append(mk("line", { x1: L, x2: W - R, y1: H - B, y2: H - B, stroke: "var(--line)" }));
    const h = (v) => v ? Math.max(2, v / max * (H - T - B)) : 0;
    vals.forEach((v, i) => {
      const cx = L + colW * i + colW / 2;
      const hi = h(v.in), ho = h(v.out);
      svg.append(mk("rect", { x: cx - bw - 1, y: H - B - hi, width: bw, height: hi, rx: 2, fill: "var(--in)", opacity: v.m === m ? 1 : 0.55 }, null));
      svg.append(mk("rect", { x: cx + 1, y: H - B - ho, width: bw, height: ho, rx: 2, fill: "var(--out)", opacity: v.m === m ? 1 : 0.55 }, null));
      const lbl = mk("text", { x: cx, y: H - 7, "text-anchor": "middle" }, MONTHS_S[Number(v.m.slice(5)) - 1]);
      if (v.m === m) lbl.setAttribute("style", "fill:var(--ink);font-weight:700");
      svg.append(lbl);
    });
    const cur = vals[5];
    const card = el("div", { class: "card" }, el("h2", { text: "Últimos 6 meses" }),
      el("p", { class: "muted" }, el("span", { class: "dot", style: "display:inline-block;background:var(--in);margin-right:6px" }), "Entradas  ", el("span", { class: "dot", style: "display:inline-block;background:var(--out);margin:0 6px 0 12px" }), "Gastos"),
      el("div", { class: "chart" }, svg));
    const totalSaved = vals.reduce((a, v) => a + (v.in - v.out), 0);
    if (vals.some((v) => v.in || v.out)) card.append(el("p", { class: "muted", text: `Nestes 6 meses sobrou ${fmt(totalSaved)} no total.` }));
    return card;
  }

  function renderBackupNag() {
    const box = $("backupNag"); box.replaceChildren();
    if (data.entries.length < 5) return;
    const last = data.settings.lastBackup || 0;
    const days = Math.floor((Date.now() - last) / 86400000);
    if (last && days < 14) return;
    box.append(el("div", { class: "nag" },
      el("span", { text: last ? `Já passaram ${days} dias desde a última cópia de segurança.` : "Ainda não fez nenhuma cópia de segurança dos seus dados." }),
      el("button", { type: "button", class: "btn small", text: "Fazer cópia", onclick: doBackup })));
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
          el("span", { class: "dot", style: `background:${c.color}` }), c.name));
      }
    }
    const box = $("histList"); box.replaceChildren();
    let items = histFilter ? list.filter((e) => e.t + ":" + e.cat === histFilter) : list;
    if (!items.length) {
      box.append(el("div", { class: "empty" }, el("strong", { text: "Nada em " + monthName(viewMonth) }),
        el("span", { text: "Os lançamentos que fizer aparecem aqui, agrupados por dia." })));
      return;
    }
    if (histFilter) {
      const tot = sum(items);
      box.append(el("p", { class: "muted", text: `${items.length} lançamento${items.length > 1 ? "s" : ""} · total ${fmt(tot)}` }));
    }
    items = items.slice().sort((a, b) => b.d.localeCompare(a.d) || b.ts - a.ts);
    const groups = new Map();
    for (const e of items) { if (!groups.has(e.d)) groups.set(e.d, []); groups.get(e.d).push(e); }
    for (const [d, g] of groups) {
      const dayOut = sum(g.filter((e) => e.t === "out"));
      const card = el("div", { class: "day" }, el("div", { class: "day-h" }, el("span", { text: dayName(d) }), el("span", { class: "num", text: dayOut ? fmt(dayOut) : "" })));
      for (const e of g) {
        const c = catById(e.t, e.cat);
        card.append(el("button", { type: "button", class: "item", onclick: () => openEdit(e.id) },
          el("span", { class: "ic", style: `background:${c.color}`, text: initials(c.name) }),
          el("span", {}, el("div", { class: "t", text: e.note || c.name }), el("div", { class: "s", text: (e.note ? c.name + " · " : "") + e.pay })),
          el("span", { class: "amt num" + (e.t === "in" ? " in" : ""), text: (e.t === "in" ? "+" : "−") + fmt(e.v) })));
      }
      box.append(card);
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

    if (installEvt) body.append(el("div", { class: "card" }, el("h2", { text: "Instalar no telemóvel" }),
      el("p", { class: "muted", text: "Adicione a Caderneta ao ecrã principal para abrir como um app, mesmo sem internet." }),
      el("button", { type: "button", class: "btn primary", text: "Instalar app", onclick: async () => { installEvt.prompt(); await installEvt.userChoice.catch(() => {}); installEvt = null; renderAjustes(); } })));

    // Meta
    const goalIn = el("input", { id: "goalInput", inputmode: "decimal", autocomplete: "off", placeholder: "Ex.: 3 000", value: data.settings.saveGoal ? fmtNum(data.settings.saveGoal).replace(/ /g, "") : "" });
    const goalErr = el("p", { class: "err" });
    const saveGoal = () => {
      const raw = goalIn.value.trim();
      const v = raw === "" ? 0 : parseMoney(raw);
      if (v === null) { goalErr.textContent = "Escreva um valor válido, por exemplo 3000."; return; }
      data.settings.saveGoal = v; save(); goalErr.textContent = ""; toast(v ? `Meta definida: guardar ${fmt(v)} por mês` : "Meta removida");
    };
    goalIn.addEventListener("keydown", (e) => { if (e.key === "Enter") saveGoal(); });
    body.append(el("div", { class: "card" }, el("h2", { text: "Meta de poupança" }),
      el("p", { class: "muted", text: "Quanto quer guardar por mês? O resumo mostra quanto ainda pode gastar para cumprir a meta." }),
      el("div", { class: "setrow" }, goalIn, el("button", { type: "button", class: "btn primary", text: "Guardar", onclick: saveGoal })), goalErr));

    // Categorias
    for (const t of ["out", "in"]) body.append(catEditor(t));

    // Cópia de segurança
    const last = data.settings.lastBackup;
    const fileIn = el("input", { type: "file", accept: ".json,application/json", hidden: true, onchange: (e) => { const f = e.target.files[0]; e.target.value = ""; if (f) readBackup(f); } });
    body.append(el("div", { class: "card" }, el("h2", { text: "Cópia de segurança" }),
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
    const card = el("div", { class: "card" }, el("h2", { text: t === "out" ? "Categorias de gastos" : "Categorias de entradas" }));
    const used = new Set(data.entries.filter((e) => e.t === t).map((e) => e.cat));
    for (const c of catList(t)) {
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
      card.append(el("div", { class: "setrow" }, color, name, del));
    }
    card.append(el("button", { type: "button", class: "btn", text: "+ Nova categoria", onclick: () => {
      const palette = ["#d9752a", "#2f9568", "#7259c4", "#4874a6", "#b8941c", "#2f93aa", "#c9404f", "#a85f22", "#984a8c"];
      catList(t).push({ id: uid(), name: "Nova categoria", color: palette[catList(t).length % palette.length] }); save(); renderAjustes();
      const lastInput = [...document.querySelectorAll("#ajustesBody input:not([type])")].find((i) => i.value === "Nova categoria");
      if (lastInput) { lastInput.focus(); lastInput.select(); }
    } }));
    return card;
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
    const name = `caderneta-copia-${today()}.json`;
    const ok = await offerFile(name, JSON.stringify(data), "application/json");
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
          el("button", { type: "button", class: "btn small danger", text: "Restaurar", onclick: () => { data = d; save(); toast("Cópia restaurada"); renderView(); } }))));
    };
    r.readAsText(file);
  }

  // ================= Arranque =================
  const APP_VERSION = "1.0.1";
  const IN_APK = /CadernetaApp/.test(navigator.userAgent);
  // Botão "voltar" do Android (chamado pelo APK): devolve true se tratou o toque.
  window.__cadernetaVoltar = () => {
    if ($("editDlg").open) { $("editDlg").close(); return true; }
    if (view !== "lancar") { location.hash = "#lancar"; return true; }
    return false;
  };
  setLaunchType("out");
  if (!location.hash) history.replaceState(null, "", "#lancar");
  route();
  // dia mudou com o app aberto
  let lastDay = today();
  document.addEventListener("visibilitychange", () => { if (!document.hidden && today() !== lastDay) { lastDay = today(); viewMonth = monthOf(lastDay); $("date").value = lastDay; renderView(); } });

  if (!IN_APK && "serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
    let reloaded = false;
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (reloaded || !hadController) return; reloaded = true; if (!launch.expr) location.reload(); });
  }
})();
