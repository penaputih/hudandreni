const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

const filePath = path.join(__dirname, "data", "rsvp.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/rsvp", (req, res) => {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).send("Gagal membaca file RSVP.");
    res.send(JSON.parse(data || "[]"));
  });
});

app.post("/api/rsvp", (req, res) => {
  const newEntry = { ...req.body, timestamp: new Date().toISOString() };

  fs.readFile(filePath, "utf-8", (err, data) => {
    const list = err ? [] : JSON.parse(data || "[]");
    list.unshift(newEntry); // prepend agar terbaru di atas
    fs.writeFile(filePath, JSON.stringify(list, null, 2), (err) => {
      if (err) return res.status(500).send("Gagal menyimpan.");
      res.status(200).send("Sukses");
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});