# Budget Tracker Portal

A personal YNAB-style budget tracker that runs as a single-file web app. Voice input, chat assistant, receipt OCR, multi-currency income sources, monthly/quarterly/annual reports, zero-budget enforcement. Installable as a PWA on Android and desktop.

## Live app

Hosted on GitHub Pages → `https://kamethutechhub.github.io/budget-portal/`
(update the URL once the repo is created and Pages is enabled)

## Install on Android

1. Open the live URL in Chrome on your phone.
2. Tap the three-dot menu → **Install app** (or **Add to Home screen**).
3. Launch from the home-screen icon — runs full-screen, offline, with all your data saved locally.

## Install on desktop

1. Open the live URL in Chrome / Edge.
2. Click the install icon in the address bar.
3. Launches as a standalone window.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app — UI, data, JS logic |
| `manifest.json` | PWA manifest (name, icons, theme colors) |
| `service-worker.js` | Offline caching strategy |
| `icon.svg` / `icon-maskable.svg` | App icons |
| `Budget_Tracker.xlsx` | Source spreadsheet for the original data |

## Features

- **Profile → Plan → Spend → Monitor → Close → Forecast → Report** — end-to-end.
- **Onboarding wizard** captures name, income sources (multi-currency), bucket allocation, savings goals.
- **Planning** with Annual / Quarterly / Monthly editing modes, bucket allocation sliders (hard-capped at 100%), zero-budget enforcement.
- **Income sources** with optional start/end dates to project future revenue.
- **Transactions** — add via form, chat, voice (Web Speech API), CSV/JSON/XLSX import, or receipt image (Tesseract OCR).
- **Dashboard / Close / Forecast / Reports** — all live-compute from current state.
- **Reports** — Monthly, Quarterly, Annual, Bucket deep-dive; each is print-ready (Save as PDF via browser).
- **Auto-save** to localStorage; export/import JSON backups.

## Deploying updates

Edit `index.html`, commit, push. GitHub Pages republishes in ~30s. Bump the `CACHE_NAME` in `service-worker.js` (e.g. `budget-portal-v2`) whenever you want users' installed PWAs to pick up a new version.

## Upgrading to a real APK (later)

This PWA is the foundation for a native Android app. Wrap with [Capacitor](https://capacitorjs.com/) when you want:

- An APK to sideload or publish to Play Store
- Native notifications (daily "log your spend" reminders)
- Native file system access (backup to Google Drive)

```bash
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
mkdir www && cp index.html manifest.json service-worker.js icon*.svg www/
npx cap init "Budget Tracker" "com.kamethutechhub.budget" --web-dir=www
npx cap add android
npx cap open android
```

## License

Personal project — use freely.
