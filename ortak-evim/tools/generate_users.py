#!/usr/bin/env python3
"""Ortak Evim - örnek (sahte) kullanıcı verisi üretici.

Çıktılar:
  ../assets/js/users.js   -> HTML prototipi için (window.USERS)
  ../data/users.json      -> ileride ASP.NET / veritabanı seed'i için

Çalıştırma:  python3 generate_users.py
Aynı seed her seferinde aynı veriyi üretir.

Gizlilik (teklif formu / KVKK): e-posta, telefon ve tam soyad tutulmaz.
Soyadının yalnızca ilk harfi saklanır, arayüzde "Ayşe K**" biçiminde gösterilir.
"""
import json
import random
from datetime import date, timedelta
from pathlib import Path

rnd = random.Random(2026)
BUGUN = date(2026, 11, 15)

KADIN = ["Ayşe", "Zeynep", "Elif", "Merve", "Büşra", "Selin", "Ece", "Defne", "Gizem",
         "Hilal", "Naz", "İrem", "Beyza", "Nehir", "Sude", "Aslı", "Damla", "Esra",
         "Yağmur", "Buse", "Rabia", "Melis", "Ceren", "Tuğçe"]
ERKEK = ["Mehmet", "Ahmet", "Emre", "Burak", "Can", "Mert", "Eren", "Furkan", "Kerem",
         "Oğuz", "Yusuf", "Berk", "Onur", "Barış", "Tolga", "Ozan", "Kaan", "Efe",
         "Arda", "Batuhan", "Hakan", "Murat", "Selim", "Umut"]
SOYAD_BAS = list("ABCDEGHKMOPSTUYZ") + ["Ç", "Ö", "Ş", "Ü"]

# şehir -> (ağırlık, ilçeler, üniversiteler, kira payı aralığı)
SEHIRLER = {
    "Konya": (12, ["Selçuklu", "Meram", "Karatay"],
              ["Selçuk Üniversitesi", "Necmettin Erbakan Üniversitesi", "KTO Karatay Üniversitesi"], (2500, 5000)),
    "İstanbul": (10, ["Kadıköy", "Beşiktaş", "Üsküdar", "Şişli", "Ataşehir", "Bahçelievler"],
                 ["İstanbul Teknik Üniversitesi", "Boğaziçi Üniversitesi", "Marmara Üniversitesi", "Yıldız Teknik Üniversitesi"], (6000, 12000)),
    "Ankara": (8, ["Çankaya", "Yenimahalle", "Keçiören", "Etimesgut"],
               ["Orta Doğu Teknik Üniversitesi", "Hacettepe Üniversitesi", "Gazi Üniversitesi", "Ankara Üniversitesi"], (4000, 8000)),
    "İzmir": (6, ["Bornova", "Karşıyaka", "Buca", "Konak"],
              ["Ege Üniversitesi", "Dokuz Eylül Üniversitesi"], (4000, 8000)),
    "Bursa": (3, ["Nilüfer", "Osmangazi"], ["Uludağ Üniversitesi"], (3000, 6000)),
    "Eskişehir": (3, ["Tepebaşı", "Odunpazarı"], ["Anadolu Üniversitesi", "Eskişehir Teknik Üniversitesi"], (3000, 5500)),
    "Kayseri": (2, ["Melikgazi", "Kocasinan"], ["Erciyes Üniversitesi"], (2500, 5000)),
    "Samsun": (2, ["İlkadım", "Atakum"], ["Ondokuz Mayıs Üniversitesi"], (3000, 5500)),
    "Trabzon": (1, ["Ortahisar"], ["Karadeniz Teknik Üniversitesi"], (3000, 5500)),
    "Antalya": (1, ["Muratpaşa", "Konyaaltı"], ["Akdeniz Üniversitesi"], (4000, 7500)),
}

BOLUMLER = ["Bilgisayar Mühendisliği", "Yazılım Mühendisliği", "Elektrik-Elektronik Mühendisliği",
            "Makine Mühendisliği", "İnşaat Mühendisliği", "Endüstri Mühendisliği", "Mimarlık",
            "Tıp", "Hemşirelik", "Eczacılık", "Psikoloji", "Hukuk", "İşletme", "İktisat",
            "Grafik Tasarım", "İngilizce Öğretmenliği", "Sınıf Öğretmenliği", "Fizyoterapi",
            "Gıda Mühendisliği", "Matematik"]

ISLER = ["Yazılım Geliştirici", "Grafik Tasarımcı", "Hemşire", "Öğretmen", "Muhasebe Uzmanı",
         "İnşaat Mühendisi", "Satış Danışmanı", "Eczane Teknisyeni", "Veri Analisti", "Mimar"]
YARI_ZAMANLI = ["Yarı zamanlı barista", "Yarı zamanlı dershane asistanı", "Freelance tasarımcı",
                "Yarı zamanlı yazılımcı", "Kafede part-time çalışıyor", "Özel ders veriyor"]

UYKU = ["erken", "gece", "esnek"]
CALISMA = ["sessiz", "disari", "esnek"]
HAYVAN = ["sahibi", "sorun-degil", "istemiyor"]
SIGARA = ["icmiyor", "icer"]

UYKU_TXT = {"erken": "Genelde erken yatıp erken kalkarım.",
            "gece": "Gece geç saatlere kadar uyanık olurum.",
            "esnek": "Uyku saatlerim oldukça esnek."}
CALISMA_TXT = {"sessiz": "Derslerime/işlerime evde sessiz bir ortamda çalışmayı severim.",
               "disari": "Çoğunlukla kütüphanede ya da kafede çalışırım.",
               "esnek": "Çalışma düzenim esnek."}
SIGARA_TXT = {"icmiyor": "Sigara içmiyorum.", "icer": "Sigara kullanıyorum (balkonda içiyorum)."}
KAPANIS_ARIYOR = ["Sorumluluk paylaşan, saygılı biriyle anlaşmak isterim.",
                  "Ev işlerinde adil bir düzen kurmak benim için önemli.",
                  "Misafir ve gürültü konusunda anlaşabilirsek sorun olmaz.",
                  "Temiz ve düzenli, sakin bir ev arkadaşı arıyorum."]
KAPANIS_PAYLASIYOR = ["Kira ve faturaları eşit paylaşırız.",
                      "Aidat ve internet dahil, ev eşyalı.",
                      "Evim toplu taşımaya yakın, sakin bir sokakta.",
                      "Birlikte rahat bir yaşam alanı oluşturmak istiyorum."]


def agirlikli_sehir():
    adlar = list(SEHIRLER)
    return rnd.choices(adlar, weights=[SEHIRLER[a][0] for a in adlar])[0]


def hayvan_cumlesi(h):
    if h == "sahibi":
        return f"{rnd.choice(['Kedim', 'Köpeğim', 'Muhabbet kuşum'])} var."
    if h == "sorun-degil":
        return "Evcil hayvana sorunum yok."
    return "Evcil hayvan istemiyorum."


def uret(n):
    kullanicilar = []
    kullanilan = set()
    for i in range(1, n + 1):
        cins = rnd.choice(["kadin", "erkek"])
        havuz = KADIN if cins == "kadin" else ERKEK
        while True:
            ad, bas = rnd.choice(havuz), rnd.choice(SOYAD_BAS)
            if (ad, bas) not in kullanilan:
                kullanilan.add((ad, bas))
                break

        sehir = agirlikli_sehir()
        _, ilceler, uniler, (kmin, kmax) = SEHIRLER[sehir]
        ilce = rnd.choice(ilceler)

        tip = rnd.choices(["ogrenci", "ogrenci-calisan", "calisan"], weights=[60, 15, 25])[0]
        ogrenci = tip != "calisan"
        calisiyor = tip != "ogrenci"

        if ogrenci:
            yas = min(max(round(rnd.gauss(21, 1.8)), 18), 27)
            universite = rnd.choice(uniler)
            bolum = rnd.choice(BOLUMLER)
            sinif = rnd.choice(["Hazırlık", "1. sınıf", "2. sınıf", "3. sınıf", "4. sınıf", "Yüksek lisans"])
            dogrulanmis = rnd.random() < 0.8  # .edu.tr doğrulaması
        else:
            yas = min(max(round(rnd.gauss(27, 3)), 22), 35)
            universite = bolum = sinif = None
            dogrulanmis = False

        is_ = None
        if tip == "calisan":
            is_ = rnd.choice(ISLER)
        elif tip == "ogrenci-calisan":
            is_ = rnd.choice(YARI_ZAMANLI)

        aranan = rnd.choices(["ev-arkadasi", "kiralik-ev"], weights=[62, 38])[0]
        butce = rnd.randrange(kmin, kmax + 1, 250)
        uyku, calisma = rnd.choice(UYKU), rnd.choice(CALISMA)
        hayvan, sigara = rnd.choice(HAYVAN), rnd.choices(SIGARA, weights=[78, 22])[0]

        ev = None
        if aranan == "kiralik-ev":
            ev = {"tip": rnd.choice(["1+1", "2+1", "3+1"]), "bosOda": rnd.choice([1, 1, 1, 2])}

        giris = []
        if ogrenci:
            giris.append(f"{universite} {bolum} bölümünde {sinif.lower() if sinif != 'Yüksek lisans' else 'yüksek lisans'} öğrencisiyim.")
        else:
            giris.append(f"{is_} olarak çalışıyorum.")
        if tip == "ogrenci-calisan":
            giris.append(f"Okurken {is_.lower()}.")
        bio = " ".join(giris + [UYKU_TXT[uyku], CALISMA_TXT[calisma], hayvan_cumlesi(hayvan), SIGARA_TXT[sigara]])
        if aranan == "kiralik-ev":
            bio += f" {ilce}'deki {ev['tip']} evimde {ev['bosOda']} boş oda var. " + rnd.choice(KAPANIS_PAYLASIYOR)
        else:
            bio += f" {ilce} çevresinde ev arkadaşı arıyorum. " + rnd.choice(KAPANIS_ARIYOR)

        ilan_tarihi = (BUGUN - timedelta(days=rnd.randint(0, 60))).isoformat()

        kullanicilar.append({
            "id": i,
            "ad": ad,
            "soyadBas": bas,
            "cinsiyet": cins,
            "yas": yas,
            "sehir": sehir,
            "ilce": ilce,
            "aramaTuru": aranan,
            "ogrenci": ogrenci,
            "calisiyor": calisiyor,
            "is": is_,
            "universite": universite,
            "bolum": bolum,
            "sinif": sinif,
            "dogrulanmis": dogrulanmis,
            "butce": butce,
            "ev": ev,
            "uyku": uyku,
            "calismaDuzeni": calisma,
            "evcilHayvan": hayvan,
            "sigara": sigara,
            "hakkinda": bio,
            "ilanTarihi": ilan_tarihi,
        })
    return kullanicilar


if __name__ == "__main__":
    kok = Path(__file__).resolve().parent.parent
    veri = uret(48)
    (kok / "data").mkdir(exist_ok=True)
    (kok / "assets" / "js").mkdir(parents=True, exist_ok=True)
    (kok / "data" / "users.json").write_text(json.dumps(veri, ensure_ascii=False, indent=2), encoding="utf-8")
    js = ("// Bu dosya tools/generate_users.py ile üretilmiştir. Elle düzenlemeyin.\n"
          "window.USERS = " + json.dumps(veri, ensure_ascii=False, indent=1) + ";\n")
    (kok / "assets" / "js" / "users.js").write_text(js, encoding="utf-8")
    print(f"{len(veri)} kullanıcı üretildi.")
