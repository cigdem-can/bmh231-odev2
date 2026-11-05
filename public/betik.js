const turAdlari = {
    atolye: "Atölye",
    soylesi: "Söyleşi",
    topluluk: "Topluluk"
};

let etkinlikler = [];
const kartlarAlani = document.getElementById("kartlar");
const durum = document.getElementById("durum");

function kartOlustur(etkinlik) {
    const kart = document.createElement("article");
    kart.className = "kart";

    const baslik = document.createElement("h2");
    baslik.textContent = etkinlik.baslik;

    const tarih = document.createElement("p");
    tarih.textContent = "Tarih: " + new Date(etkinlik.tarih).toLocaleDateString("tr-TR");

    const yer = document.createElement("p");
    yer.textContent = "Yer: " + etkinlik.yer;

    const kontenjan = document.createElement("p");
    kontenjan.textContent = "Kontenjan: " + etkinlik.kontenjan + " kişi";

    const etiket = document.createElement("span");
    etiket.className = "etiket";
    etiket.textContent = turAdlari[etkinlik.tur];

    kart.append(baslik, tarih, yer, kontenjan, etiket);
    return kart;
}

function kartlariCiz(liste) {
    kartlarAlani.textContent = "";
    durum.textContent = "";
    for (const etkinlik of liste) {
        kartlarAlani.append(kartOlustur(etkinlik));
    }
}

const filtreDugmeleri = document.querySelectorAll(".filtre");
const aramaKutusu = document.getElementById("arama");
let secilenTur = "tumu";

function listeyiGuncelle() {
    const aranan = aramaKutusu.value.trim().toLocaleLowerCase("tr");
    const sonuc = etkinlikler.filter(function (etkinlik) {
        const turUyuyor = secilenTur === "tumu" || etkinlik.tur === secilenTur;
        const aramaUyuyor = etkinlik.baslik.toLocaleLowerCase("tr").includes(aranan);
        return turUyuyor && aramaUyuyor;
    });

    kartlariCiz(sonuc);
    if (sonuc.length === 0) {
        durum.textContent = "Aramanıza uygun etkinlik yok.";
    }
}

for (const dugme of filtreDugmeleri) {
    dugme.addEventListener("click", function () {
        for (const d of filtreDugmeleri) {
            d.classList.remove("secili");
        }
        dugme.classList.add("secili");
        secilenTur = dugme.dataset.tur;
        listeyiGuncelle();
    });
}

aramaKutusu.addEventListener("input", listeyiGuncelle);

async function etkinlikleriYukle() {
    kartlarAlani.textContent = "";
    durum.className = "";
    durum.textContent = "Yükleniyor...";
    try {
        const yanit = await fetch("/api/etkinlikler");
        if (!yanit.ok) {
            throw new Error("Sunucu " + yanit.status + " döndürdü");
        }
        etkinlikler = await yanit.json();
        listeyiGuncelle();
    } catch (hata) {
        durum.className = "hata";
        durum.textContent = "Etkinlikler yüklenemedi. Lütfen daha sonra tekrar deneyin.";
        console.error(hata);
    }
}

etkinlikleriYukle();
const form = document.getElementById("oneri-formu");
const formIleti = document.getElementById("form-ileti");

form.addEventListener("submit", function (olay) {
    olay.preventDefault();

    const ad = form.ad.value.trim();
    const tarih = form.tarih.value;
    const eposta = form.eposta.value.trim();
    const hatalar = [];

    if (ad.length < 5) {
        hatalar.push("Etkinlik adı en az 5 karakter olmalı.");
    }

    if (tarih === "") {
        hatalar.push("Tarih boş bırakılamaz.");
    } else {
        const secilenGun = new Date(tarih + "T00:00");
        const bugun = new Date();
        bugun.setHours(0, 0, 0, 0);
        if (secilenGun < bugun) {
            hatalar.push("Geçmiş bir tarih seçilemez.");
        }
    }

    const epostaKalibi = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!epostaKalibi.test(eposta)) {
        hatalar.push("Geçerli bir e-posta adresi yazın.");
    }

    if (hatalar.length > 0) {
        formIleti.className = "hata";
        formIleti.textContent = hatalar.join("\n");
    } else {
        formIleti.className = "basari";
        formIleti.textContent = "Teşekkürler! \"" + ad + "\" önerin alındı.";
        form.reset();
    }
});