/* Ortak Evim - kullanıcı profili görüntüleme ekranı (profil.html?id=N). */
(function () {
  "use strict";
  const { LABELS, maskName, formatTL, esc, occupation, avatarHTML, verifiedHTML, formatDate, daysAgo } = OE;
  const USERS = window.USERS || [];
  const root = document.getElementById("profile");

  // "Sonuçlara dön" linki filtreleri korur
  try {
    const q = sessionStorage.getItem("oeLastQuery");
    if (q) document.getElementById("backLink").href = "index.html" + q;
  } catch (e) { /* depolama kapalı olabilir */ }

  const id = Number(new URLSearchParams(location.search).get("id"));
  const u = USERS.find((x) => x.id === id);

  if (!u) {
    document.title = "Profil bulunamadı | Ortak Evim";
    root.innerHTML = `<div class="empty"><div class="big">🤷</div><h3>Profil bulunamadı</h3>
      <p>Aradığınız kişi kaldırılmış ya da bağlantı hatalı olabilir.</p>
      <a class="btn-pill btn-cyan" href="index.html">Aramaya dön</a></div>`;
    return;
  }

  document.title = `${maskName(u)} | Ortak Evim`;
  const home = u.aramaTuru === "kiralik-ev";

  const info = [
    ["Konum", `${u.sehir} · ${u.ilce}`],
    ["Yaş / Cinsiyet", `${u.yas} · ${LABELS.cinsiyet[u.cinsiyet]}`],
  ];
  if (u.ogrenci) {
    info.push(["Üniversite", u.universite], ["Bölüm", `${u.bolum} (${u.sinif})`]);
  }
  if (u.is) info.push([u.ogrenci ? "Çalışma durumu" : "Meslek", u.is]);
  info.push(["İlan tarihi", `${formatDate(u.ilanTarihi)} (${daysAgo(u.ilanTarihi)})`]);

  const lifestyle = [
    ["Uyku düzeni", LABELS.uyku[u.uyku]],
    ["Ders / çalışma düzeni", LABELS.calismaDuzeni[u.calismaDuzeni]],
    ["Evcil hayvan", LABELS.evcilHayvan[u.evcilHayvan]],
    ["Sigara", LABELS.sigara[u.sigara]],
  ];

  const similar = USERS.filter((x) => x.id !== u.id && x.sehir === u.sehir)
    .sort((a, b) => Math.abs(a.yas - u.yas) - Math.abs(b.yas - u.yas)).slice(0, 3);

  root.innerHTML = `
    <section class="profile-head">
      ${avatarHTML(u, "lg")}
      <div>
        <h1>${esc(maskName(u))}</h1>
        <div class="meta">${esc(LABELS.cinsiyet[u.cinsiyet])} · ${u.yas} yaş · ${esc(u.sehir)}, ${esc(u.ilce)}</div>
        <span class="badge ${home ? "badge--home" : "badge--find"}">${home ? "🏠" : "🔎"} ${esc(LABELS.aramaTuru[u.aramaTuru])}</span>
        ${verifiedHTML(u)}
      </div>
    </section>

    <div class="profile-grid" style="margin-top:20px">
      <div>
        <section class="panel">
          <h2>Hakkında</h2>
          <p class="about">${esc(u.hakkinda)}</p>
        </section>
        <section class="panel">
          <h2>Bilgiler</h2>
          <dl class="info-list">
            ${info.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
          </dl>
        </section>
        <section class="panel">
          <h2>Yaşam tarzı</h2>
          <div class="lifestyle">
            ${lifestyle.map(([k, v]) => `<div><small>${esc(k)}</small>${esc(v)}</div>`).join("")}
          </div>
        </section>
      </div>

      <aside>
        <section class="panel">
          <p class="side-price">${formatTL(u.butce)} <small>/ ay</small></p>
          <p style="margin:4px 0 0;color:var(--muted)">${home && u.ev
            ? `${esc(u.ev.tip)} ev · ${u.ev.bosOda} boş oda`
            : "Ayırabileceği aylık kira payı"}</p>
          <div class="notice" style="margin-top:16px">
            <strong>🔒 Güvenlik uyarısı</strong>
            Kişiyle yüz yüze görüşmeden kapora veya ön ödeme yapmayın. E-posta ve telefon bilgileri gizlidir.
          </div>
        </section>

        ${similar.length ? `
        <section class="panel">
          <h2>${esc(u.sehir)}'daki diğer profiller</h2>
          <div class="similar">
            ${similar.map((s) => `
              <a href="profil.html?id=${s.id}">
                ${avatarHTML(s, "md").replace("avatar--md", "avatar--md avatar--sm")}
                <span><b>${esc(maskName(s))}</b><span class="s">${s.yas} yaş · ${esc(s.ilce)} · ${formatTL(s.butce)}</span></span>
              </a>`).join("")}
          </div>
        </section>` : ""}
      </aside>
    </div>`;

})();
