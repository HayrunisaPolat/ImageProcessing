# Ortak Evim – Filtreleme ve Görüntüleme Ekranları (HTML prototipi)

Teklif formundaki görev: **Frontend – kullanıcı filtreleme ve görüntüleme ekranı**.
Şimdilik saf HTML/CSS/JS; ASP.NET'e geçişte her dosyanın karşılığı aşağıda.

## Çalıştırma
Derleme gerekmez: `index.html` dosyasını tarayıcıda açmak yeterli.
(Veriyi yeniden üretmek için: `python3 tools/generate_users.py`)

## Filtreler

| # | Filtre | Tür | Kaynak |
|---|--------|-----|--------|
| 1 | Konum / Şehir | açılır liste (şehir + kişi sayısı) | ekran görüntüsü, teklif formu |
| 2 | Ne arıyorsunuz? (Ev Arkadaşı / Kiralık Ev / Hepsi) | çoklu seçim | ekran görüntüsü |
| 3 | Yaş aralığı (18–40) | çift tutamaklı kaydırıcı | ekran görüntüsü (hedef kitle 18–30) |
| 4 | Cinsiyet (Kadın / Erkek / Hepsi) | çoklu seçim | ekran görüntüsü, teklif formu |
| 5 | Aylık bütçe (en fazla) | kaydırıcı | "ekonomik beklenti" |
| 6 | Statü: Öğrenci / Çalışan, Sadece doğrulanmış öğrenciler | çoklu seçim + anahtar | "öğrenci olma durumu", `.edu.tr` doğrulaması |
| 7 | Bölüm / Üniversite / Meslek | serbest metin | "bölümü", "çalışılan iş" |
| 8 | Uyku düzeni (Erken / Gece kuşu / Esnek) | çoklu seçim | "uyku saatleri" |
| 9 | Ders / çalışma düzeni (Evde sessiz / Dışarıda / Fark etmez) | çoklu seçim | "ders çalışma düzeni" |
| 10 | Evcil hayvan (Var / Sorun değil / İstemiyor) | çoklu seçim | "evcil hayvan" |
| 11 | Sigara (İçmiyor / İçiyor) | çoklu seçim | **öneri** – formda yok, ev yaşamında sık kriter |

Ayrıca: sıralama (en yeni, bütçe artan/azalan, yaş), aktif filtre çipleri, "Filtreleri temizle",
sonuç sayısı, boş sonuç ekranı. Filtre durumu URL'ye yazılır
(`?sehir=Konya&yas=20-26&uyku=erken,gece`), böylece paylaşılabilir ve profilden geri dönüşte korunur.

Mantık: **gruplar arası AND, grup içi OR**; hiçbiri seçili değilse (= "Hepsi") o filtre uygulanmaz.

## Ekranlar
- `index.html` – filtre paneli + kullanıcı kartları (listeleme)
- `profil.html?id=N` – kullanıcı profili (görüntüleme): hakkında, bilgiler, yaşam tarzı, bütçe/ev bilgisi, benzer profiller

## Gizlilik (KVKK / teklif formu)
E-posta, telefon ve tam soyad veri modelinde **yoktur**. Soyadın yalnızca ilk harfi tutulur,
arayüzde `Ayşe K**` olarak gösterilir. Fotoğraf yerine baş harfli avatar kullanılır
(formda fotoğraf/video "yapılmayacak" olarak işaretli).

## Veri modeli (`data/users.json`) → ASP.NET sınıfı

```
int Id; string Ad; string SoyadBas; Cinsiyet Cinsiyet;      // kadin | erkek
int Yas; string Sehir; string Ilce;
AramaTuru AramaTuru;                                          // ev-arkadasi | kiralik-ev
bool Ogrenci; bool Calisiyor; string? Is;
string? Universite; string? Bolum; string? Sinif; bool Dogrulanmis;
int Butce; EvBilgisi? Ev {Tip, BosOda};
Uyku Uyku; CalismaDuzeni CalismaDuzeni;                       // erken|gece|esnek ; sessiz|disari|esnek
EvcilHayvan EvcilHayvan; Sigara Sigara;                       // sahibi|sorun-degil|istemiyor ; icmiyor|icer
string Hakkinda; DateOnly IlanTarihi;
```

## ASP.NET'e geçiş eşlemesi

| Prototip | ASP.NET |
|----------|---------|
| `assets/js/users.js` / `data/users.json` | EF Core `Kullanici` tablosu + seed |
| `filter.js` → `matches()` | `IQueryable` üzerinde `Where(...)` (servis katmanı) |
| URL parametreleri | GET action + `FiltreViewModel` (model binding) |
| `index.html` | `Views/Kullanici/Index.cshtml` (+ kart için partial view) |
| `profil.html` | `Views/Kullanici/Detay.cshtml` (`/Kullanici/Detay/5`) |
| `common.js` → `maskName`, `LABELS` | ViewModel'de maskeleme + enum `[Display(Name=...)]` |
| `assets/css/style.css` | `wwwroot/css/site.css` (aynen) |
