# 🌙 Shahru Ramadan 2026 Web App

A lightweight, blazing-fast, and fully responsive Single-Page Application (SPA) designed to help users track Ramadan 2026 schedules, daily routines, financial obligations, and spiritual activities. 

Built with Vanilla JavaScript and Tailwind CSS, this app operates entirely on the client side. It functions as an **Offline-First PWA (Progressive Web App)**, ensuring seamless performance and data persistence via LocalStorage.

## ✨ Key Features

### ⏱️ Core Timings & Smart Schedule
* **Live Countdown:** Real-time countdown timer to the next Sehri (end of eating) or Iftar (breaking fast).
* **Smart Islamic Date System:** Automatically advances to the next Ramadan day immediately after Iftar, perfectly aligning with the Islamic lunar calendar.
* **Dynamic Auto-Highlighting:** The 30-day schedule table automatically highlights the current day's row (adapts perfectly to both Light and Dark modes).
* **District-wise Calculation:** Automatically adjusts Sehri and Iftar timings based on selected district offsets (Dhaka, Jamalpur, Sherpur, Tangail, Manikganj).
* **PDF Generation:** Users can download a perfectly scaled, single-page A4 PDF of their district's schedule (powered by `html2pdf.js`).

### 🧮 Islamic Calculators & Tools
* **Financial Calculators:** Highly accurate, built-in calculators for **Zakat** (2.5%), **Khums** (20%), **Fitra**, and **Fidiya**. Features intelligent decimal formatting (shows exact amounts without unnecessary `.00`).
* **Digital Tasbih:** Clickable counter with haptic vibration feedback and persistent storage.
* **Daily Amal Tracker:** Interactive checkboxes to track daily prayers, Quran recitation, and charity (saves progress locally).

### 📖 Knowledge & Articles (Zero-Reload SPA)
* **Master-Detail Blog System:** A seamless, built-in article reader. Users can browse article lists and read full posts (like Health Tips, Masala, and Quranic guidelines) without any page reloads or URL changes.
* **Duas & Masala:** Built-in accordion UI for common Ramadan Q&As, Quranic verses, and essential Duas.
* **Health Guidelines:** Curated health tips for maintaining energy and hydration between Iftar and Sehri.

### ⚙️ Technical & UX Enhancements
* **Robust PWA Version Control:** Features a custom smart-updater that automatically detects new GitHub releases, flushes stale caches, wipes outdated LocalStorage safely, and serves the freshest code to the user.
* **Dark/Light Mode:** Seamless theme toggling with system preference detection.
* **Content Protection:** Basic anti-copy (right-click disable) and dev-tool disabling measures built-in.

## 🛠️ Technologies Used

* **HTML5 / CSS3**
* **Tailwind CSS** (via CDN for rapid, modern styling)
* **Vanilla JavaScript** (No heavy frameworks, ensuring maximum speed)
* **Service Workers & Cache API** (For offline PWA capabilities)
* **FontAwesome** (Vector icons)
* **html2pdf.js** (Client-side PDF rendering)

## 🚀 Local Development

Since this project requires no build step or backend, running it locally is extremely simple:

1. Clone this repository:
   ```bash
   git clone [https://github.com/kamrulhasanj/ramadan-app.git](https://github.com/kamrulhasanj/ramadan-app.git)
2. Open the directory.
3. Double-click `index.html` to run it directly in your browser.

---
*Design & Developed with ❤️ by [Kamrul Hasan](https://facebook.com/uikamrul)*