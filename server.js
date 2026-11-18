const http = require("http");
const fs = require("fs");

const dosyalar = {
  "/": { yol: "index.html", tur: "text/html; charset=utf-8" },
  "/kedi1.json": { yol: "kedi1.json", tur: "application/json; charset=utf-8" },
};

http
  .createServer((req, res) => {
    const dosya = dosyalar[req.url];
    if (!dosya) {
      res.writeHead(404);
      return res.end("Bulunamadı");
    }
    res.writeHead(200, { "Content-Type": dosya.tur });
    res.end(fs.readFileSync(dosya.yol));
  })
  .listen(3000, () => console.log("http://localhost:3000"));
