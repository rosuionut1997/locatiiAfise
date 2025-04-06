const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

// Configurare body-parser
app.use(bodyParser.json());

// Creare/conectare la baza de date SQLite
const db = new sqlite3.Database(':memory:');

// Creare tabel pentru locații
db.serialize(() => {
  db.run(`CREATE TABLE locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    localitate TEXT NOT NULL,
    strada_numar TEXT NOT NULL
  )`);
});

// Endpoint GET pentru a obține toate locațiile
app.get('/locations', (req, res) => {
  db.all('SELECT * FROM locations', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ locations: rows });
  });
});

// Endpoint POST pentru a adăuga o locație
app.post('/locations', (req, res) => {
  const { localitate, strada_numar } = req.body;
  const stmt = db.prepare('INSERT INTO locations (localitate, strada_numar) VALUES (?, ?)');
  stmt.run([localitate, strada_numar], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID });
  });
  stmt.finalize();
});

// Pornire server
app.listen(port, () => {
  console.log(`Serverul rulează la http://localhost:${port}`);
});
