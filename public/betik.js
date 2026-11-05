const turAdlari = {
    atolye: "Atölye",
    soylesi: "Söyleşi",
    topluluk: "Topluluk"
};

let etkinlikler = [
    { id: 1, baslik: "Web Programlama Atölyesi", tur: "atolye", tarih: "2026-11-12", yer: "Mühendislik Fakültesi Bilgisayar Lab 1", kontenjan: 30 },
    { id: 2, baslik: "Git ve GitHub Atölyesi", tur: "atolye", tarih: "2026-11-19", yer: "Mühendislik Fakültesi Bilgisayar Lab 2", kontenjan: 25 },
    { id: 3, baslik: "Yapay Zekâ ve Gelecek Söyleşisi", tur: "soylesi", tarih: "2026-11-26", yer: "Mühendislik Fakültesi Konferans Salonu", kontenjan: 200 },
    { id: 4, baslik: "Siber Güvenlik Topluluğu Tanışma Toplantısı", tur: "topluluk", tarih: "2026-11-17", yer: "Merkez Kütüphane Seminer Salonu", kontenjan: 120 },
    { id: 5, baslik: "CTF'ye Giriş Atölyesi", tur: "atolye", tarih: "2026-12-03", yer: "Mühendislik Fakültesi Bilgisayar Lab 1", kontenjan: 40 },
    { id: 6, baslik: "Kariyer Söyleşisi: Bilişim Sektörü", tur: "soylesi", tarih: "2026-12-08", yer: "Rektörlük Konferans Salonu", kontenjan: 250 },
    { id: 7, baslik: "Yazılım Topluluğu Kodlama Gecesi", tur: "topluluk", tarih: "2026-12-11", yer: "Merkez Kütüphane Grup Çalışma Odası", kontenjan: 50 },
    { id: 8, baslik: "Ağ Güvenliği Söyleşisi", tur: "soylesi", tarih: "2026-12-17", yer: "Mühendislik Fakültesi Konferans Salonu", kontenjan: 150 }
];

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

listeyiGuncelle();