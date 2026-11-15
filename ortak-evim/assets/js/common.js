/* Ortak Evim - ortak yardımcılar (etiketler, maskeleme, biçimlendirme).
   ASP.NET'e geçişte: LABELS -> enum + display name, maskName -> ViewModel. */
(function () {
  "use strict";

  const LABELS = {
    aramaTuru: { "ev-arkadasi": "Ev arkadaşı arıyor", "kiralik-ev": "Kiralık ev ilanı" },
    cinsiyet: { kadin: "Kadın", erkek: "Erkek" },
    uyku: { erken: "🌅 Erken yatar", gece: "🌙 Gece kuşu", esnek: "😴 Uyku düzeni esnek" },
    calismaDuzeni: { sessiz: "🤫 Evde sessizlik ister", disari: "📚 Dışarıda çalışır", esnek: "🔀 Çalışma düzeni esnek" },
    evcilHayvan: { sahibi: "🐾 Evcil hayvanı var", "sorun-degil": "🐾 Hayvana sorunu yok", istemiyor: "🚫 Evcil hayvan istemiyor" },
    sigara: { icmiyor: "🚭 Sigara içmiyor", icer: "🚬 Sigara içiyor" },
  };

  // Gizlilik: yalnızca soyadın ilk harfi tutulur -> "Ayşe K**"
  const maskName = (u) => `${u.ad} ${u.soyadBas}**`;

  const formatTL = (n) => "₺" + Number(n).toLocaleString("tr-TR");

  const initials = (u) => (u.ad[0] + u.soyadBas).toLocaleUpperCase("tr");

  const AVATAR_COLORS = ["#5f78ff", "#ff7a59", "#2bb6a3", "#a259ff", "#f5a524", "#e5588b", "#3aa0ff", "#6bbf4e"];
  const avatarColor = (u) => AVATAR_COLORS[u.id % AVATAR_COLORS.length];

  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const formatDate = (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

  function daysAgo(iso) {
    const diff = Math.round((new Date("2026-11-15T00:00:00") - new Date(iso + "T00:00:00")) / 86400000);
    if (diff <= 0) return "Bugün";
    if (diff === 1) return "Dün";
    return diff + " gün önce";
  }

  // Kişinin "ne yapıyor" satırı: okul + bölüm veya meslek
  function occupation(u) {
    const parts = [];
    if (u.ogrenci) parts.push(`${u.universite} · ${u.bolum}`);
    if (u.is) parts.push(u.is);
    return parts.join(" · ");
  }

  function avatarHTML(u, size) {
    return `<span class="avatar avatar--${size || "md"}" style="background:${avatarColor(u)}" aria-hidden="true">${esc(initials(u))}</span>`;
  }

  function verifiedHTML(u) {
    return u.dogrulanmis
      ? `<span class="verified" title="Öğrencilik durumu .edu.tr e-postası ile doğrulandı">✓ Doğrulanmış öğrenci</span>`
      : "";
  }

  window.OE = { LABELS, maskName, formatTL, initials, avatarColor, esc, formatDate, daysAgo, occupation, avatarHTML, verifiedHTML };
})();
