const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const PUBLIC_KLASOR = path.join(__dirname, "public");
const VERI_DOSYASI = path.join(__dirname, "etkinlikler.json");

const icerikTurleri = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8"
};

function gonder(res, durumKodu, icerikTuru, govde, ekBasliklar = {}) {
    res.writeHead(durumKodu, { "Content-Type": icerikTuru, ...ekBasliklar });
    res.end(govde);
}

function etkinlikleriOku() {
    const metin = fs.readFileSync(VERI_DOSYASI, "utf8");
    return JSON.parse(metin);
}

const sunucu = http.createServer(function (req, res) {
    console.log(req.method, req.url);

    if (req.method !== "GET") {
        gonder(res, 405, "text/plain; charset=utf-8", "Bu yöntem desteklenmiyor", { Allow: "GET" });
        return;
    }

    const adres = new URL(req.url, "http://localhost:" + PORT);
    const yol = adres.pathname;

    if (yol === "/api/etkinlikler") {
        let etkinlikler = etkinlikleriOku();
        const tur = adres.searchParams.get("tur");
        if (tur) {
            etkinlikler = etkinlikler.filter(function (e) {
                return e.tur === tur;
            });
        }
        gonder(res, 200, "application/json; charset=utf-8", JSON.stringify(etkinlikler));
        return;
    }

    if (yol.startsWith("/api/etkinlikler/")) {
        const parcalar = yol.split("/");
        const id = Number(parcalar[3]);
        const etkinlik = etkinlikleriOku().find(function (e) {
            return e.id === id;
        });
        if (etkinlik) {
            gonder(res, 200, "application/json; charset=utf-8", JSON.stringify(etkinlik));
        } else {
            gonder(res, 404, "application/json; charset=utf-8", JSON.stringify({ hata: "Etkinlik bulunamadı" }));
        }
        return;
    }

    const dosyaAdi = yol === "/" ? "index.html" : yol.slice(1);
    const dosyaYolu = path.join(PUBLIC_KLASOR, dosyaAdi);
    const icerikTuru = icerikTurleri[path.extname(dosyaYolu)];

    if (!dosyaYolu.startsWith(PUBLIC_KLASOR + path.sep) || !icerikTuru) {
        gonder(res, 404, "text/plain; charset=utf-8", "Sayfa bulunamadı");
        return;
    }

    fs.readFile(dosyaYolu, function (hata, icerik) {
        if (hata) {
            gonder(res, 404, "text/plain; charset=utf-8", "Sayfa bulunamadı");
            return;
        }
        gonder(res, 200, icerikTuru, icerik);
    });
});

sunucu.listen(PORT, function () {
    console.log("Sunucu http://localhost:" + PORT + " adresinde çalışıyor.");
});