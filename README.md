# 🌙 Al-Ramadan 2026 Web App

A lightweight, fully responsive single-page web application (SPA) designed to help users track Ramadan 2026 schedules, daily routines, and spiritual activities. 

Built with Vanilla JavaScript and Tailwind CSS, this app operates entirely on the client side, ensuring blazing-fast performance and offline-like persistence using Local Storage.

## ✨ Features

* **⏱️ Live Countdown:** Real-time countdown timer to the next Sehri (end of eating) or Iftar (breaking fast).
* **📍 District-wise Scheduling:** Automatically calculates timings based on selected district offsets (Dhaka, Jamalpur, Sherpur, Tangail, Manikganj).
* **📅 Full 30-Day Calendar:** Auto-generates the entire month's schedule dynamically.
* **📄 PDF Generation:** Users can download a perfectly scaled, single-page A4 PDF of their district's schedule (powered by `html2pdf.js`).
* **📿 Digital Tasbih:** Clickable counter with haptic vibration feedback and persistent storage.
* **✅ Daily Amal Tracker:** Checkboxes to track daily prayers, Quran recitation, and charity (saves progress locally).
* **📖 Duas & Masala:** Built-in accordion UI for common Ramadan Q&As, Quranic verses, and essential Duas.
* **🌓 Dark/Light Mode:** Seamless theme toggling with system preference detection.
* **🛡️ Content Protection:** Basic anti-copy and dev-tool disabling measures built-in.

## 🛠️ Technologies Used

* **HTML5 / CSS3**
* **Tailwind CSS** (via CDN for rapid styling)
* **Vanilla JavaScript** (No heavy frameworks)
* **FontAwesome** (Icons)
* **html2pdf.js** (Client-side PDF rendering)

## 🚀 Local Development

Since this project requires no build step or backend, running it locally is extremely simple:

1. Clone this repository:
   \`\`\`bash
   git clone https://github.com/kamrulhasanj/ramadan-app.git
   \`\`\`
2. Open the directory.
3. Double-click `index.html` to run it directly in your browser.

## ☁️ Deployment (Cloudflare Pages)

This app is optimized for edge deployment via **Cloudflare Pages**. 

1. Push this repository to your GitHub account (Private or Public).
2. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
3. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
4. Select the `ramadan-app` repository.
5. In the **Set up builds and deployments** section, use the following settings:
   * **Framework preset:** `None`
   * **Build command:** *(leave blank)*
   * **Build output directory:** *(leave blank, or set to `/`)*
6. Click **Save and Deploy**. Cloudflare will provide a live URL (e.g., `ramadan-app.pages.dev`) in seconds.

---
*Design & Developed with ❤️ by [Kamrul Hasan](https://facebook.com/uikamrul)*