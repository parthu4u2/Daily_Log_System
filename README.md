# Daily Log System (PWA)

A free, offline-first daily productivity tracker designed for **GitHub Pages** hosting.

## What is built in this phase

- Mobile-first daily log UI with 3 tasks:
  - 🚶 10,000 Steps Goal (4 points)
  - 📘 DSA Practice (3 points)
  - 🤖 AI/ML Learning (3 points)
- Proof image uploads with in-app preview.
- Auto score calculation out of 10.
- Daily auto-log creation (by date key).
- Current streak tracking (consecutive full 10/10 days).
- History timeline with missed-day highlighting.
- Offline support with Service Worker cache.
- PWA installability via `manifest.webmanifest`.
- Local persistence using `localStorage`.
- Optional GitHub Actions daily backup-template generation at **07:00 AM IST**.

---

## Project Structure

```text
Daily_Log_System/
├─ .github/
│  └─ workflows/
│     └─ daily-backup.yml
├─ assets/
│  ├─ icon.svg
│  └─ maskable.svg
├─ backups/
├─ app.js
├─ index.html
├─ manifest.webmanifest
├─ styles.css
├─ sw.js
└─ README.md
```

---

## Architecture (No backend, no DB, forever free)

### 1) Frontend only (GitHub Pages)
- Static files (`HTML/CSS/JS`) are hosted on GitHub Pages.
- No server, no paid APIs, no external database.

### 2) Data persistence
- Daily logs are saved in browser `localStorage` as JSON.
- Uploaded proof images are stored as Base64 Data URLs.
- This keeps everything working fully offline.

### 3) Date model
- Every day is keyed as `YYYY-MM-DD`.
- On app load, today's log is auto-created if missing.

### 4) Scoring
- Steps = 4
- DSA = 3
- AI/ML = 3
- Total = 10
- Score recalculates immediately whenever a checkbox changes.

### 5) Streak logic
- Streak counts consecutive days from today backwards where score is exactly `10/10`.

### 6) Offline/PWA
- `sw.js` caches app shell files.
- `manifest.webmanifest` enables install prompt/Add to Home Screen.

### 7) Optional backup automation
- GitHub Action creates `backups/YYYY-MM-DD.json` daily at `07:00 AM IST`.
- Note: Browser localStorage data is device-local and cannot be auto-exported by GitHub Actions.

---

## Run locally

Use any static server. Example with Python:

```bash
python3 -m http.server 8080
```

Then open:

- `http://localhost:8080`

---

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: `main` (or your default branch), folder `/ (root)`
4. Save and wait for deployment.
5. Open the Pages URL on desktop/mobile.

---

## Mobile install (Add to Home Screen)

### Android (Chrome)
1. Open deployed URL.
2. Tap browser menu.
3. Tap **Install app** / **Add to Home screen**.

### iPhone (Safari)
1. Open deployed URL.
2. Tap Share button.
3. Tap **Add to Home Screen**.

---

## Notes for low-end devices

- UI uses minimal layout and no heavy libraries.
- No frameworks (vanilla JS only).
- Images are displayed but should be kept compressed for better storage usage.

---

## Next phase suggestions

- Add edit/view page per historical day.
- Add monthly analytics.
- Add image compression before storing.
- Add import-from-backup file support.

