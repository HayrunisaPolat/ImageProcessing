/* Ortak Evim - filtreleme ve listeleme ekranı.
   Filtre durumu URL'ye yazılır (?sehir=Konya&yas=20-26...). ASP.NET'te aynı
   parametreler bir GET action'ına (FilterViewModel) bağlanabilir. */
(function () {
  "use strict";
  const { LABELS, maskName, formatTL, esc, occupation, avatarHTML, verifiedHTML, daysAgo } = OE;
  const USERS = window.USERS || [];

  const YAS = { min: 18, max: 40 };
  const BUTCE = { min: 2000, max: 15000 };
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const ARRAY_KEYS = ["tur", "cins", "statu", "uyku", "calisma", "hayvan", "sigara"];
  const defaults = () => ({
    q: "", sehir: "", tur: [], cins: [],
    yasMin: YAS.min, yasMax: YAS.max, butce: BUTCE.max,
    statu: [], dogru: false, uyku: [], calisma: [], hayvan: [], sigara: [], sirala: "yeni",
  });

  /* ---------- URL <-> durum ---------- */
  function readURL() {
    const s = defaults();
    const p = new URLSearchParams(location.search);
    if (p.get("q")) s.q = p.get("q");
    if (p.get("sehir")) s.sehir = p.get("sehir");
    ARRAY_KEYS.forEach((k) => { if (p.get(k)) s[k] = p.get(k).split(",").filter(Boolean); });
    if (p.get("yas")) {
      const [a, b] = p.get("yas").split("-").map(Number);
      if (a >= YAS.min && b <= YAS.max && a <= b) { s.yasMin = a; s.yasMax = b; }
    }
    const bu = Number(p.get("butce"));
    if (bu >= BUTCE.min && bu <= BUTCE.max) s.butce = bu;
    s.dogru = p.get("dogrulanmis") === "1";
    if (p.get("sirala")) s.sirala = p.get("sirala");
    return s;
  }

  function writeURL() {
    const d = defaults(), p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.sehir) p.set("sehir", state.sehir);
    ARRAY_KEYS.forEach((k) => { if (state[k].length) p.set(k, state[k].join(",")); });
    if (state.yasMin !== d.yasMin || state.yasMax !== d.yasMax) p.set("yas", state.yasMin + "-" + state.yasMax);
    if (state.butce !== d.butce) p.set("butce", state.butce);
    if (state.dogru) p.set("dogrulanmis", "1");
    if (state.sirala !== d.sirala) p.set("sirala", state.sirala);
    const qs = p.toString();
    try { history.replaceState(null, "", qs ? "?" + qs : location.pathname); } catch (e) { /* file:// vb. */ }
    try { sessionStorage.setItem("oeLastQuery", qs ? "?" + qs : ""); } catch (e) { /* depolama kapalı */ }
  }

  /* ---------- Filtre mantığı ---------- */
  const norm = (t) => String(t || "").toLocaleLowerCase("tr");

  function matches(u, s) {
    if (s.sehir && u.sehir !== s.sehir) return false;
    if (s.tur.length && !s.tur.includes(u.aramaTuru)) return false;
    if (u.yas < s.yasMin || u.yas > s.yasMax) return false;
    if (s.cins.length && !s.cins.includes(u.cinsiyet)) return false;
    if (s.butce < BUTCE.max && u.butce > s.butce) return false;
    if (s.statu.length) {
      const ok = (s.statu.includes("ogrenci") && u.ogrenci) || (s.statu.includes("calisan") && u.calisiyor);
      if (!ok) return false;
    }
    if (s.dogru && !u.dogrulanmis) return false;
    if (s.uyku.length && !s.uyku.includes(u.uyku)) return false;
    if (s.calisma.length && !s.calisma.includes(u.calismaDuzeni)) return false;
    if (s.hayvan.length && !s.hayvan.includes(u.evcilHayvan)) return false;
    if (s.sigara.length && !s.sigara.includes(u.sigara)) return false;
    if (s.q) {
      const hay = norm([u.ad, u.bolum, u.universite, u.is, u.ilce, u.sehir].join(" "));
      if (!norm(s.q).split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  }

  const SORTS = {
    yeni: (a, b) => b.ilanTarihi.localeCompare(a.ilanTarihi) || b.id - a.id,
    "butce-artan": (a, b) => a.butce - b.butce,
    "butce-azalan": (a, b) => b.butce - a.butce,
    "yas-artan": (a, b) => a.yas - b.yas,
  };

  /* ---------- Kontroller ---------- */
  let state = readURL();

  function buildCityOptions() {
    const counts = {};
    USERS.forEach((u) => { counts[u.sehir] = (counts[u.sehir] || 0) + 1; });
    const cities = Object.keys(counts).sort((a, b) => a.localeCompare(b, "tr"));
    $("#fSehir").innerHTML =
      `<option value="">Konum / Şehir (tümü)</option>` +
      cities.map((c) => `<option value="${esc(c)}">${esc(c)} (${counts[c]})</option>`).join("");
  }

  function setRangeFill(rangeEl, a, b) {
    rangeEl.style.setProperty("--a", a);
    rangeEl.style.setProperty("--b", b);
  }

  function syncControls() {
    $("#fSehir").value = state.sehir;
    $("#fQ").value = state.q;
    $("#fSirala").value = state.sirala;
    $("#fDogru").checked = state.dogru;

    $$(".checks[data-group]").forEach((box) => {
      const key = box.dataset.group;
      $$("input", box).forEach((cb) => {
        cb.checked = cb.value === "all" ? state[key].length === 0 : state[key].includes(cb.value);
      });
    });

    $("#fYasMin").value = state.yasMin;
    $("#fYasMax").value = state.yasMax;
    $("#yasLabel").textContent = `${state.yasMin} – ${state.yasMax}`;
    const span = YAS.max - YAS.min;
    setRangeFill($("#yasRange"), (state.yasMin - YAS.min) / span, (state.yasMax - YAS.min) / span);

    $("#fButce").value = state.butce;
    $("#butceLabel").textContent = state.butce >= BUTCE.max ? "Fark etmez" : "En fazla " + formatTL(state.butce);
    setRangeFill($("#butceRange"), 0, (state.butce - BUTCE.min) / (BUTCE.max - BUTCE.min));
  }

  function bindControls() {
    $("#fSehir").addEventListener("change", (e) => { state.sehir = e.target.value; update(); });
    $("#fSirala").addEventListener("change", (e) => { state.sirala = e.target.value; update(); });
    $("#fQ").addEventListener("input", (e) => { state.q = e.target.value.trim(); update(); });
    $("#fDogru").addEventListener("change", (e) => { state.dogru = e.target.checked; update(); });

    // Onay kutusu grupları ("Hepsi" = hiçbiri seçili değil)
    $$(".checks[data-group]").forEach((box) => {
      const key = box.dataset.group;
      const hasAll = !!$('input[value="all"]', box);
      const total = $$("input:not([value=all])", box).length;
      box.addEventListener("change", (e) => {
        const cb = e.target, val = cb.value;
        if (val === "all") state[key] = [];
        else if (cb.checked) state[key] = [...state[key], val];
        else state[key] = state[key].filter((v) => v !== val);
        if (hasAll && state[key].length === total) state[key] = []; // hepsi seçili = filtre yok
        update();
      });
    });

    // Yaş aralığı: tutamaklar birbirini geçmez
    const yMin = $("#fYasMin"), yMax = $("#fYasMax");
    yMin.addEventListener("input", () => { state.yasMin = Math.min(+yMin.value, state.yasMax); update(); });
    yMax.addEventListener("input", () => { state.yasMax = Math.max(+yMax.value, state.yasMin); update(); });
    $("#fButce").addEventListener("input", (e) => { state.butce = +e.target.value; update(); });

    $("#btnReset").addEventListener("click", () => { state = defaults(); update(); });
    $("#btnAra").addEventListener("click", () => {
      const r = $("#results");
      r.scrollIntoView({ behavior: "smooth", block: "start" });
      r.focus({ preventScroll: true });
    });
  }

  /* ---------- Aktif filtre çipleri ---------- */
  function activeChips() {
    const chips = [];
    const add = (label, clear) => chips.push({ label, clear });
    if (state.sehir) add("📍 " + state.sehir, () => (state.sehir = ""));
    state.tur.forEach((v) => add(v === "ev-arkadasi" ? "Ev Arkadaşı" : "Kiralık Ev", () => (state.tur = state.tur.filter((x) => x !== v))));
    if (state.yasMin !== YAS.min || state.yasMax !== YAS.max) add(`Yaş ${state.yasMin}–${state.yasMax}`, () => { state.yasMin = YAS.min; state.yasMax = YAS.max; });
    state.cins.forEach((v) => add(LABELS.cinsiyet[v], () => (state.cins = state.cins.filter((x) => x !== v))));
    if (state.butce < BUTCE.max) add("≤ " + formatTL(state.butce), () => (state.butce = BUTCE.max));
    state.statu.forEach((v) => add(v === "ogrenci" ? "Öğrenci" : "Çalışan", () => (state.statu = state.statu.filter((x) => x !== v))));
    if (state.dogru) add("✓ Doğrulanmış", () => (state.dogru = false));
    if (state.q) add("“" + state.q + "”", () => (state.q = ""));
    [["uyku", LABELS.uyku], ["calisma", LABELS.calismaDuzeni], ["hayvan", LABELS.evcilHayvan], ["sigara", LABELS.sigara]].forEach(([k, map]) =>
      state[k].forEach((v) => add(map[v], () => (state[k] = state[k].filter((x) => x !== v))))
    );
    return chips;
  }

  /* ---------- Kart ---------- */
  function cardHTML(u) {
    const home = u.aramaTuru === "kiralik-ev";
    const badge = home
      ? `<span class="badge badge--home">🏠 ${LABELS.aramaTuru["kiralik-ev"]}${u.ev ? " · " + esc(u.ev.tip) : ""}</span>`
      : `<span class="badge badge--find">🔎 ${LABELS.aramaTuru["ev-arkadasi"]}</span>`;
    const tags = [LABELS.uyku[u.uyku], LABELS.evcilHayvan[u.evcilHayvan], LABELS.sigara[u.sigara]]
      .map((t) => `<span class="tag">${esc(t)}</span>`).join("");
    return `
      <a class="card" href="profil.html?id=${u.id}" aria-label="${esc(maskName(u))} profilini görüntüle">
        <div class="card-top">
          ${avatarHTML(u, "md")}
          <div>
            <h3 class="card-name">${esc(maskName(u))}</h3>
            <div class="card-sub">${esc(LABELS.cinsiyet[u.cinsiyet])} · ${u.yas} yaş</div>
          </div>
        </div>
        <div>${badge} ${verifiedHTML(u)}</div>
        <div class="card-line"><span class="ic">📍</span><span>${esc(u.sehir)} · ${esc(u.ilce)}</span></div>
        <div class="card-line"><span class="ic">${u.ogrenci ? "🎓" : "💼"}</span><span>${esc(occupation(u))}</span></div>
        <div class="tags">${tags}</div>
        <div class="card-foot">
          <span class="price">${formatTL(u.butce)} <small>/ ay${home && u.ev ? " · " + u.ev.bosOda + " boş oda" : ""}</small></span>
          <span class="see">Profili Gör →</span>
        </div>
      </a>`;
  }

  /* ---------- Çizim ---------- */
  function render() {
    const list = USERS.filter((u) => matches(u, state)).sort(SORTS[state.sirala] || SORTS.yeni);
    $("#resCount").textContent = list.length;
    $("#araCount").textContent = `· ${list.length}`;

    const chipsBox = $("#activeChips");
    const chips = activeChips();
    chipsBox.innerHTML = chips
      .map((c, i) => `<button type="button" class="chip-x" data-i="${i}" aria-label="${esc(c.label)} filtresini kaldır">${esc(c.label)} ✕</button>`)
      .join("");
    $$(".chip-x", chipsBox).forEach((b) => b.addEventListener("click", () => { chips[+b.dataset.i].clear(); update(); }));

    $("#grid").innerHTML = list.length
      ? list.map(cardHTML).join("")
      : `<div class="empty" style="grid-column:1/-1">
           <div class="big">🔍</div><h3>Aramanıza uygun kişi bulunamadı</h3>
           <p>Filtreleri biraz gevşetmeyi deneyin (yaş aralığını genişletin ya da bütçe sınırını kaldırın).</p>
           <button type="button" class="btn-pill btn-ghost" id="emptyReset">Filtreleri temizle</button>
         </div>`;
    const er = $("#emptyReset");
    if (er) er.addEventListener("click", () => { state = defaults(); update(); });
  }

  function update() { syncControls(); writeURL(); render(); }

  /* ---------- Başlat ---------- */
  buildCityOptions();
  bindControls();
  // Masaüstünde ek filtreler açık, mobilde kapalı (ya da aktif filtre varsa açık)
  const more = $("#moreFilters");
  const hasAdvanced = state.butce < BUTCE.max || state.statu.length || state.dogru || state.q ||
    state.uyku.length || state.calisma.length || state.hayvan.length || state.sigara.length;
  more.open = window.matchMedia("(min-width: 901px)").matches || !!hasAdvanced;
  update();
})();
