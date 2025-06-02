# 🏁 Motorsport Session Countdown Timer - Local Web Server Version

A fully local, browser-based countdown manager for motorsport sessions and events such as Practice, Qualifying, and Races. Configure, track, and display live countdowns with smart visuals, dark mode, and automatic transitions.

---

##  Features

###  Session Configuration
- Add custom session name, start date/time, and session duration.
- Automatically calculates end time based on session length.
- Quick-pick buttons.
- Edit or delete sessions with intuitive buttons.
- Sorts sessions by the soonest start time.

###  Persistent Storage
- All sessions are saved to your browser's `localStorage`.
- Data is preserved across page reloads.

###  Smart Visuals
- Countdown color:
  - **🔴 Red** before the session starts.
  - **🟢 Green** during the session.
- After a session ends, it’s labeled as **“Session Ended”**.

###  Dark Mode
- Toggle light/dark themes from both index and display pages.

###  Import/Export
- **Import** events from a `.json` file.
- **Export** your current event list to a file for sharing or backup.

### 📺 Live Countdown Display (display.html)
- Bold, fullscreen countdown for the **current or next session**.
- Automatically moves to the next session when one ends.
- Displays:
  - Current session name and time remaining.
  - Next session name and start time in the top-right.

---

## Project Files

- `index.html` – Main UI for managing events.
- `display.html` – Fullscreen live countdown display.
- `styles.css` – Core styles (light/dark themes, responsive layout).
- `events.json` *(optional)* – Sample event data for import.

---

##  How to Use

1. **Open `index.html`** in your browser.
2. Click **“Add Event”** to configure sessions.
3. Use **quick pick** buttons or enter a custom session duration.
4. Events are saved automatically to localStorage.
5. Click the **“Live Countdown Display”** button (top-left) to open `display.html`.

### Optional:
- Click **Export Events** to save your schedule.
- Use **Import Events** to restore from a `.json` file.

---

##  Example JSON Format

```json
[
  {
    "name": "Practice 1",
    "startDate": "2025-04-18T07:15:00",
    "endDate": "2025-04-18T07:35:00"
  }
]
```

---

# Advanced Users

# 🏁 Motorsport Session Countdown Timer - Dedicated Web Server Version

A lightweight web‑based countdown manager for sessions, races, meetings—anything with a start & end time.

* Planner (`index.html`) – create, edit, import & export sessions  
* Display (`display.html`) – fullscreen live clock for the next session  
* Back‑end (`server.js`) – Node 20 + Express + SQLite, with REST API and static hosting

---

## Features

* CRUD REST API (`/events`)
* Bulk **import / export** (JSON or CSV)
* Display page fetches sessions **once**; ticks client‑side, no extra API calls
* Simple deployment: Node, systemd, NGINX
* Recipes for Let’s Encrypt *and* self‑signed TLS

---

## Quick start (local)

```bash
npm install express sqlite3 sqlite cors
node server.js          # serves API + pages on http://localhost:3000
open http://localhost:3000
open http://localhost:3000/display.html
```

`events.db` (SQLite) is created automatically.

---

## Production (Ubuntu 24.04)

### 1  Create user & folder

```bash
sudo adduser --system --group --no-create-home motorsport
sudo mkdir -p /opt/motorsport/public
sudo chown -R motorsport:motorsport /opt/motorsport
```

### 2  Copy files

Copy `server.js`, `public/` and (optionally) `package.json` into `/opt/motorsport`.

### 3  Install dependencies

```bash
cd /opt/motorsport
sudo -u motorsport npm install express sqlite3 sqlite cors
```

### 4  Systemd unit

Create **/etc/systemd/system/motorsport.service**

```ini
[Unit]
Description=Motorsport Countdown API
After=network.target

[Service]
Type=simple
User=motorsport
Group=motorsport
WorkingDirectory=/opt/motorsport
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

Enable & start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now motorsport
```

### 5  NGINX reverse proxy

Create **/etc/nginx/sites-available/motorsport**

```nginx
server {
    listen 80;
    server_name countdown.example.com;

    root /opt/motorsport/public;
    index index.html;

    location / {
        try_files $uri $uri/ @node;
    }

    location @node {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then:

```bash
sudo ln -s /etc/nginx/sites-available/motorsport /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Add TLS later (Let’s Encrypt or self‑signed).

---

## API

| Verb | Path | Description |
|------|------|-------------|
| GET  | `/events` | List all sessions |
| POST | `/events` | Create `{name,startDate,endDate}` |
| PUT  | `/events/:id` | Update |
| DELETE | `/events/:id` | Remove |
| GET  | `/events/export?format=json|csv` | Download all |
| POST | `/events/import` | Bulk import (array) |

Dates are **ISO‑8601 UTC** strings.

---

## Import / Export

* **Export** – Planner → “Export JSON” (or `/events/export?format=csv`)
* **Import** – Planner → “Import JSON” and select a JSON or CSV file

CSV must have header: `id,name,startDate,endDate` (id ignored).

---

## Folder layout

```
public/
  index.html      # planner UI
  display.html    # live clock
  style.css
server.js         # Express API
events.db         # SQLite (auto)
```

---

## Built for Motorsports Fans
Whether you're managing a track day, sim racing league, or major motorsport event – this tool gives you powerful control with a clean, customizable experience.