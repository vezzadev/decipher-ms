CREATE TABLE IF NOT EXISTS briefing_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT,
  topic TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  email_sent INTEGER NOT NULL DEFAULT 0
);
