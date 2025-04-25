# 🏁 Motorsport Session Countdown Timer

A fully local, browser-based countdown manager for motorsport sessions and events such as Practice, Qualifying, and Races. Configure, track, and display live countdowns with smart visuals, dark mode, and automatic transitions.

---

## 🌟 Features

### 🛠 Session Configuration
- Add custom session name, start date/time, and session duration.
- Automatically calculates end time based on session length.
- Quick-pick buttons.
- Edit or delete sessions with intuitive buttons.
- Sorts sessions by the soonest start time.

### 📅 Persistent Storage
- All sessions are saved to your browser's `localStorage`.
- Data is preserved across page reloads.

### 💡 Smart Visuals
- Countdown color:
  - **🔴 Red** before the session starts.
  - **🟢 Green** during the session.
- After a session ends, it’s labeled as **“Session Ended”**.

### 🌑 Dark Mode
- Toggle light/dark themes from both index and display pages.

### 📤 Import/Export
- **Import** events from a `.json` file.
- **Export** your current event list to a file for sharing or backup.

### 📺 Live Countdown Display (display.html)
- Bold, fullscreen countdown for the **current or next session**.
- Automatically moves to the next session when one ends.
- Displays:
  - Current session name and time remaining.
  - Next session name and start time in the top-right.

---

## 📂 Project Files

- `index.html` – Main UI for managing events.
- `display.html` – Fullscreen live countdown display.
- `styles.css` – Core styles (light/dark themes, responsive layout).
- `script.js` – Application logic (session handling, localStorage, transitions).
- `events.json` *(optional)* – Sample event data for import.

---

## 🚀 How to Use

1. **Open `index.html`** in your browser.
2. Click **“Add Event”** to configure sessions.
3. Use **quick pick** buttons or enter a custom session duration.
4. Events are saved automatically to localStorage.
5. Click the **“Live Countdown Display”** button (top-left) to open `display.html`.

### Optional:
- Click **Export Events** to save your schedule.
- Use **Import Events** to restore from a `.json` file.

---

## 💡 Example JSON Format

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

## Built for Motorsports Fans
Whether you're managing a track day, sim racing league, or major motorsport event – this tool gives you powerful control with a clean, customizable experience.
