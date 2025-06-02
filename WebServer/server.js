// server.js
import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const db = await open({
  filename: path.join(__dirname, "events.db"),
  driver: sqlite3.Database
});

// Ensure the 'events' table exists
await db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL
  );
`);

console.log("Database initialized and 'events' table ensured.");

// -------- API Endpoints --------//
// CRUD
app.get("/events", async (_, res) => {
  const rows = await db.all("SELECT * FROM events ORDER BY startDate");
  res.json(rows);
});

app.post("/events", async (req, res) => {
  const { name, startDate, endDate } = req.body;
  const r = await db.run("INSERT INTO events (name,startDate,endDate) VALUES (?,?,?)",[name,startDate,endDate]);
  res.status(201).json({ id: r.lastID, name, startDate, endDate });
});

app.put("/events/:id", async (req, res) => {
  const { id } = req.params;
  const { name, startDate, endDate } = req.body;
  await db.run("UPDATE events SET name=?, startDate=?, endDate=? WHERE id=?", [name,startDate,endDate,id]);
  res.sendStatus(204);
});

app.delete("/events/:id", async (req, res) => {
  await db.run("DELETE FROM events WHERE id=?", [req.params.id]);
  res.sendStatus(204);
});

// EXPORT
app.get("/events/export", async (req, res) => {
  const rows = await db.all("SELECT * FROM events ORDER BY startDate");
  if ((req.query.format||"json").toLowerCase()==="csv") {
    const header = "id,name,startDate,endDate\n";
    const body = rows.map(r=>[r.id,r.name,r.startDate,r.endDate]
      .map(v=>`"\${(v+"").replace(/"/g,'""')}"`).join(",")).join("\n");
    res.setHeader("Content-Type","text/csv");
    res.setHeader("Content-Disposition","attachment; filename=events.csv");
    res.send(header+body);
  } else {
    res.setHeader("Content-Disposition","attachment; filename=events.json");
    res.json(rows);
  }
});

// IMPORT
app.post("/events/import", async (req, res) => {
  let list = Array.isArray(req.body) ? req.body : req.body.events;
  if (!Array.isArray(list)) return res.status(400).json({error:"Expect JSON array"});
  try {
    await db.exec("BEGIN");
    const stmt = await db.prepare("INSERT INTO events (name,startDate,endDate) VALUES (?,?,?)");
    for (const e of list) {
      if (!e.name||!e.startDate||!e.endDate) continue;
      await stmt.run(e.name, e.startDate, e.endDate);
    }
    await db.exec("COMMIT");
    res.sendStatus(201);
  } catch (err) {
    await db.exec("ROLLBACK");
    console.error(err);
    res.status(500).json({error:"Failed to import"});
  }
});

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Listening on port", PORT));