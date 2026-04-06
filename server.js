const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const db = new sqlite3.Database("privacy.db");

app.get("/api/stats", (req, res) => {
  db.get("SELECT COUNT(*) as total FROM questions", (err, row) => {
    res.json({total: row ? row.total : 0, status: "Privacy Clean"});
  });
});

app.get("/api/search", (req, res) => {
  const q = `%${req.query.q || ''}%`;
  db.all("SELECT * FROM questions WHERE question LIKE ? LIMIT 50", [q], (err, rows) => {
    res.json(rows || []);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Privacy Clean on ${port}`));
