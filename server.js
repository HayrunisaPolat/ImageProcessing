const http = require("http");
const fs = require("fs");

const kediler = JSON.parse(fs.readFileSync("kedi1.json", "utf8"));

const divler = kediler
  .map(
    (kedi) => `
    <div class="kedi">
      <p>ID: ${kedi.id}</p>
      <p>İsim: ${kedi.isim}</p>
      <p>Renk: ${kedi.renk}</p>
      <p>Yaş: ${kedi.yas}</p>
    </div>`
  )
  .join("");

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Kediler</title>
  <style>
    .kedi { border: 1px solid #999; border-radius: 8px; padding: 8px; margin: 8px; width: 160px; }
  </style>
</head>
<body>${divler}</body>
</html>`;

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  })
  .listen(3000, () => console.log("http://localhost:3000"));
