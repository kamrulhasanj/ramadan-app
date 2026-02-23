// ================= VERSION CONTROL & STORAGE CLEARING =================
      const APP_VERSION = 'v2'; 
      const STORAGE_KEY_VERSION = 'ramadan_app_version';

      function checkAppVersion() {
        const storedVersion = localStorage.getItem(STORAGE_KEY_VERSION);
        if (storedVersion !== APP_VERSION) {
          console.log("New version detected. Clearing storage.");
          localStorage.clear();
          localStorage.setItem(STORAGE_KEY_VERSION, APP_VERSION);
        }
      }
      checkAppVersion();

      // ================= PWA Service Worker Registration =================
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register(`sw.js?v=${APP_VERSION}`)
            .then((reg) => {
              console.log("PWA Service Worker registered:", reg);
            })
            .catch((err) => console.log("SW config error:", err));

          // When the new SW takes over, reload the page to apply changes
          let refreshing;
          navigator.serviceWorker.addEventListener('controllerchange', function () {
            if (refreshing) return;
            window.location.reload();
            refreshing = true;
          });
        });
      }

      // ================= Disable Right-Click (Context Menu) =================
      document.addEventListener("contextmenu", (event) => event.preventDefault());

      // ================= Disable common developer tools keyboard shortcuts =================
      document.onkeydown = function (e) {
        if (event.keyCode == 123) return false;
        if (e.ctrlKey && e.shiftKey && e.keyCode == "I".charCodeAt(0)) return false;
        if (e.ctrlKey && e.shiftKey && e.keyCode == "J".charCodeAt(0)) return false;
        if (e.ctrlKey && e.keyCode == "U".charCodeAt(0)) return false;
        if (e.ctrlKey && e.keyCode == "C".charCodeAt(0)) return false;
      };

      // ================= SPA NAVIGATION LOGIC =================
      function switchTab(tabId, btnElement) {
        document.querySelectorAll(".view-section").forEach((el) => el.classList.remove("active"));
        document.getElementById("view-" + tabId).classList.add("active");

        document.querySelectorAll(".nav-btn").forEach((btn) => {
          btn.classList.remove("text-green-600", "dark:text-green-500");
          btn.classList.add("text-gray-400");
          btn.querySelector("span").classList.remove("font-bold");
          btn.querySelector("span").classList.add("font-medium");
        });
        btnElement.classList.remove("text-gray-400");
        btnElement.classList.add("text-green-600", "dark:text-green-500");
        btnElement.querySelector("span").classList.remove("font-medium");
        btnElement.querySelector("span").classList.add("font-bold");

        const districtContainer = document.getElementById("district-container");
        if (tabId === 'home' || tabId === 'schedule') {
          districtContainer.style.display = 'flex'; // হোম এবং সূচী ট্যাবে দেখাবে
        } else {
          districtContainer.style.display = 'none'; // অন্য সব ট্যাবে লুকানো থাকবে
        }

        window.scrollTo(0, 0);
      }

      // ================= DARK MODE LOGIC =================
      const themeToggleBtn = document.getElementById("theme-toggle");
      const themeIconDark = document.getElementById("theme-icon-dark");
      const themeIconLight = document.getElementById("theme-icon-light");
      const htmlElement = document.documentElement;

      if (localStorage.getItem("color-theme") === "dark" || (!("color-theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        htmlElement.classList.add("dark");
        themeIconDark.classList.add("hidden");
        themeIconLight.classList.remove("hidden");
      } else {
        htmlElement.classList.remove("dark");
        themeIconLight.classList.add("hidden");
        themeIconDark.classList.remove("hidden");
      }

      themeToggleBtn.addEventListener("click", function () {
        themeIconDark.classList.toggle("hidden");
        themeIconLight.classList.toggle("hidden");
        if (htmlElement.classList.contains("dark")) {
          htmlElement.classList.remove("dark");
          localStorage.setItem("color-theme", "light");
        } else {
          htmlElement.classList.add("dark");
          localStorage.setItem("color-theme", "dark");
        }
      });

      // ================= AMAL TRACKER LOGIC =================
      for (let i = 1; i <= 5; i++) {
        let checkbox = document.getElementById("amal-" + i);
        if (checkbox) {
          if (localStorage.getItem("amal-" + i) === "true") checkbox.checked = true;
          checkbox.addEventListener("change", function () {
            localStorage.setItem("amal-" + i, this.checked);
          });
        }
      }

      // ================= ACCORDION LOGIC =================
      const accordionHeaders = document.querySelectorAll(".accordion-header");
      accordionHeaders.forEach((header) => {
        header.addEventListener("click", () => {
          const content = header.nextElementSibling;
          const icon = header.querySelector(".icon");

          document.querySelectorAll(".accordion-content").forEach((otherContent) => {
            if (otherContent !== content && otherContent.classList.contains("expanded")) {
              otherContent.classList.remove("expanded");
              otherContent.previousElementSibling.querySelector(".icon").innerText = "+";
            }
          });

          if (content.classList.contains("expanded")) {
            content.classList.remove("expanded");
            icon.innerText = "+";
          } else {
            content.classList.add("expanded");
            icon.innerText = "-";
          }
        });
      });

      // ================= DISTRICT SELECTION & OFFSET LOGIC =================
      const districtOffsets = {
        ঢাকা: 0,
        জামালপুর: 2,
        শেরপুর: 2,
        টাংগাইল: 1,
        মানিকগঞ্জ: 1,
      };

      const districtSelect = document.getElementById("district-select");
      let currentDistrict = localStorage.getItem("selected-district") || "জামালপুর";
      districtSelect.value = currentDistrict;

      districtSelect.addEventListener("change", function (e) {
        currentDistrict = e.target.value;
        localStorage.setItem("selected-district", currentDistrict);
        generateSchedule();
        updateTimer();
      });

      function bnDigit(str) {
        const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
        return str.toString().replace(/\d/g, (d) => bnDigits[d]);
      }

      // Convert Bengali input to English numbers for calculation
      function enDigit(str) {
        if (!str) return '';
        const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
        return str.replace(/[০-৯]/g, d => bnDigits.indexOf(d));
      }

      // ================= DATES & TIMER LOGIC =================
      const ramadanStartDate = new Date("2026-02-18T00:00:00");
      const currentHijriYear = "১৪৪৭";
      let scheduleData = [];

      function generateSchedule() {
        scheduleData = [];
        let curDate = new Date(ramadanStartDate);
        let sehriBase = new Date("2026-02-18T05:12:00");
        let sunriseBase = new Date("2026-02-18T06:30:00");
        let sunsetBase = new Date("2026-02-18T17:55:00");
        let offsetMs = (districtOffsets[currentDistrict] || 0) * 60 * 1000;

        const tbody = document.getElementById("schedule-body");
        tbody.innerHTML = "";

        for (let i = 1; i <= 30; i++) {
          let localSehri = new Date(sehriBase.getTime() + offsetMs);
          let localSunrise = new Date(sunriseBase.getTime() + offsetMs);
          let localSunset = new Date(sunsetBase.getTime() + offsetMs);

          let gapMs = localSunrise.getTime() - localSehri.getTime();
          let calculatedIftar = new Date(localSunset.getTime() + gapMs);

          let dayData = {
            ramadanDay: i,
            dateStr: curDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
            sehriStr: localSehri.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            iftarStr: calculatedIftar.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            sehriDate: new Date(localSehri),
            iftarDate: new Date(calculatedIftar),
          };
          scheduleData.push(dayData);

          const tr = document.createElement("tr");

          // এই আইডিটিই মূলত হাইলাইটারকে চিনিয়ে দেবে কোন সারিটি কালার করতে হবে
          tr.id = `schedule-row-${i - 1}`;

          tr.className = "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border-b dark:border-gray-700";
          tr.innerHTML = `
                    <td class="p-3 text-gray-700 dark:text-gray-300 font-bold font-mono">${bnDigit(dayData.ramadanDay)}</td>
                    <td class="p-3 border-l dark:border-gray-700 text-gray-700 dark:text-gray-300 font-mono">${bnDigit(dayData.dateStr)}</td>
                    <td class="p-3 border-l dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300">${bnDigit(dayData.sehriStr)}</td>
                    <td class="p-3 border-l dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300">${bnDigit(dayData.iftarStr)}</td>
                `;
          tbody.appendChild(tr);

          curDate.setDate(curDate.getDate() + 1);
          sehriBase.setDate(sehriBase.getDate() + 1);
          sehriBase.setMinutes(sehriBase.getMinutes() - 1);
          sunriseBase.setDate(sunriseBase.getDate() + 1);
          sunriseBase.setMinutes(sunriseBase.getMinutes() - 1);
          sunsetBase.setDate(sunsetBase.getDate() + 1);
          if (i % 2 === 0) sunsetBase.setMinutes(sunsetBase.getMinutes() + 1);
        }
      }

      generateSchedule();

      function updateTimer() {
        const now = new Date();

        // 1. Find the current Gregorian day index based on midnight
        const todayMidnight = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        let diffTime = todayMidnight.getTime() - ramadanStartDate.getTime();
        let baseDayIndex = Math.round(diffTime / (1000 * 3600 * 24));

        let activeDataIndex = baseDayIndex;
        let isRamadanStarted = false;

        if (baseDayIndex >= 0 && baseDayIndex < 30) {
          isRamadanStarted = true;
          const todaysIftarTime = scheduleData[baseDayIndex].iftarDate;
          if (now > todaysIftarTime) {
            activeDataIndex = baseDayIndex + 1; // ইফতারের পর আরবি দিন পরিবর্তন
          }
        } else if (baseDayIndex < 0) {
          activeDataIndex = 0;
          let eveOfRamadan = new Date("2026-02-17T17:55:00");
          let offsetMs = (districtOffsets[currentDistrict] || 0) * 60 * 1000;
          eveOfRamadan = new Date(eveOfRamadan.getTime() + offsetMs);

          if (now >= eveOfRamadan) {
            isRamadanStarted = true; // ১৭ তারিখ ইফতারের পর ১লা রমজানের রাত শুরু
          }
        } else {
          activeDataIndex = 29;
        }

        if (activeDataIndex > 29) activeDataIndex = 29;

        const activeData = scheduleData[activeDataIndex];

        // ইংরেজি তারিখ সব সময় বর্তমান সময় (রাত ১২টায় পরিবর্তন) অনুযায়ী হবে
        const currentEngDateStr = now.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        });

        let ramadanDayStr = "";
        if (isRamadanStarted || baseDayIndex >= 30) {
          ramadanDayStr = `${bnDigit(activeData.ramadanDay)} রমজান`;
          if (baseDayIndex >= 30) ramadanDayStr = "রমজান শেষ";
        }

        if (!isRamadanStarted && baseDayIndex < 0) {
          document.getElementById("current-date-display").innerText =
            `রমজানের অপেক্ষায় (${bnDigit(currentEngDateStr)})`;
        } else {
          document.getElementById("current-date-display").innerText =
            ` আজ ${ramadanDayStr} ${currentHijriYear} (${bnDigit(currentEngDateStr)})`;
        }

        document.getElementById("sehri-time").innerText = bnDigit(
          activeData.sehriStr,
        );
        document.getElementById("iftar-time").innerText = bnDigit(
          activeData.iftarStr,
        );

        let targetTime;
        let labelText = "";

        if (now < activeData.sehriDate) {
          targetTime = activeData.sehriDate;
          labelText = "সেহরির বাকি আছে";
        } else if (now >= activeData.sehriDate && now < activeData.iftarDate) {
          targetTime = activeData.iftarDate;
          labelText = "ইফতারের বাকি আছে";
        } else {
          targetTime = activeData.sehriDate;
          labelText = "সেহরির বাকি আছে";
        }

        document.getElementById("countdown-label").innerText = labelText;

        let diff = targetTime - now;
        if (diff <= 0) diff = 0;

        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        let timerStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
        if (baseDayIndex >= 30) timerStr = "০০:০০:০০";

        document.getElementById("countdown").innerText = bnDigit(timerStr);

        // Highlight active row in schedule
        for (let i = 0; i < 30; i++) {
          let row = document.getElementById(`schedule-row-${i}`);
          if (row) {
            // Check if this is the current active day and Ramadan is ongoing
            if (i === activeDataIndex && isRamadanStarted && baseDayIndex < 30) {
              row.classList.add("bg-green-200", "dark:bg-green-900/80");
              row.classList.remove("hover:bg-gray-50", "dark:hover:bg-gray-700/50");
            } else {
              row.classList.remove("bg-green-200", "dark:bg-green-900/80");
              row.classList.add("hover:bg-gray-50", "dark:hover:bg-gray-700/50");
            }
          }
        }
      }

      updateTimer();
      setInterval(updateTimer, 1000);

      // ================= PDF DOWNLOAD LOGIC =================
      function downloadPDF() {
        const element = document.createElement("div");

        element.style.width = "794px";
        element.style.height = "1123px";
        element.style.padding = "20px";
        element.style.boxSizing = "border-box";
        element.style.backgroundColor = "white";
        element.style.display = "block";

        element.innerHTML = `
                <div style="text-align: center; margin-bottom: 10px;">
                    <p dir="rtl" style="font-size: 16px; margin: 0; font-weight: bold; color: #15803d; font-family: 'Hind Siliguri';">أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ</p>
                    <h2 style="font-size: 22px; margin: 2px 0; color: #15803d; font-family: 'Hind Siliguri';">রমজান সূচী ২০২৬</h2>
                    <p style="font-size: 14px; margin: 0; color: black; font-family: 'Hind Siliguri';">জেলা: ${currentDistrict} | হিজরী: <span style="font-family: ui-monospace;">${currentHijriYear}</span></p>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 12px; font-family: 'Hind Siliguri';">
                    <thead>
                        <tr style="background-color: #15803d; color: white;">
                            <th style="border: 1px solid #14532d; padding: 6px;">রমজান</th>
                            <th style="border: 1px solid #14532d; padding: 6px;">তারিখ</th>
                            <th style="border: 1px solid #14532d; padding: 6px;">সেহরি (শেষ)</th>
                            <th style="border: 1px solid #14532d; padding: 6px;">ইফতার (শুরু)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${scheduleData.map((day) => `
                            <tr style="background-color: #ffffff; line-height: 1;">
                                <td style="border: 1px solid #000000; padding: 4px; font-family: ui-monospace; color: #000000;">${bnDigit(day.ramadanDay)}</td>
                                <td style="border: 1px solid #000000; padding: 4px; font-family: ui-monospace; color: #000000;">${bnDigit(day.dateStr)}</td>
                                <td style="border: 1px solid #000000; padding: 4px; font-family: ui-monospace; color: #000000;">${bnDigit(day.sehriStr)}</td>
                                <td style="border: 1px solid #000000; padding: 4px; font-family: ui-monospace; color: #000000;">${bnDigit(day.iftarStr)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
                
                <div style="margin-top: 15px; text-align: center; font-size: 10px; color: #000000; font-family: 'Hind Siliguri';">
                    Design & Developed with ❤️ by Kamrul Hasan
                </div>
            `;

        document.body.appendChild(element);

        const opt = {
          margin: 0,
          filename: `Ramadan-2026-${currentDistrict}.pdf`,
          image: { type: "jpeg", quality: 1.0 },
          html2canvas: { scale: 2, useCORS: true, logging: false, width: 794, height: 1123 },
          jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
        };

        html2pdf().set(opt).from(element).save().then(() => document.body.removeChild(element));
      }

      // ================= TOOLS LOGIC =================
      let count = parseInt(localStorage.getItem("tasbih-count")) || 0;
      document.getElementById("tasbih-counter").innerText = bnDigit(count);

      function incrementTasbih() {
        count++;
        document.getElementById("tasbih-counter").innerText = bnDigit(count);
        localStorage.setItem("tasbih-count", count);
        if (navigator.vibrate) navigator.vibrate(50);
      }
      function resetTasbih() {
        count = 0;
        document.getElementById("tasbih-counter").innerText = bnDigit(count);
        localStorage.setItem("tasbih-count", count);
      }

      // function calculateZakat() {
      //   let rawInput = document.getElementById("zakat-input").value;
      //   let amount = parseFloat(enDigit(rawInput));
      //   const resultElement = document.getElementById("zakat-result");

      //   if (!isNaN(amount) && amount > 0) {
      //     const zakat = amount * 0.025;
      //     // resultElement.innerText = bnDigit(Math.floor(zakat)) + "৳";
      //     resultElement.innerText = bnDigit(zakat.toFixed(2)) + "৳";
          
      //   } else {
      //     resultElement.innerText = "০৳";
      //   }
      // }

      // function calculateKhums() {
      //   let rawInput = document.getElementById("khums-input").value;
      //   let amount = parseFloat(enDigit(rawInput));
      //   const resultElement = document.getElementById("khums-result");

      //   if (!isNaN(amount) && amount > 0) {
      //     const khums = amount * 0.2; // 20% calculation
      //     //resultElement.innerText = bnDigit(Math.floor(khums)) + "৳";
      //     // Math.floor বাদ দিয়ে .toFixed(2) ব্যবহার করা হয়েছে
      //     resultElement.innerText = bnDigit(khums.toFixed(2)) + "৳";
      //   } else {
      //     resultElement.innerText = "০৳";
      //   }
      // }

      function calculateZakat() {
        let rawInput = document.getElementById("zakat-input").value;
        let amount = parseFloat(enDigit(rawInput));
        const resultElement = document.getElementById("zakat-result");

        if (!isNaN(amount) && amount > 0) {
          const zakat = amount * 0.025;
          
          // দশমিকের পর ২ ঘর পর্যন্ত রাউন্ড করা হচ্ছে
          let roundedZakat = Math.round(zakat * 100) / 100;
          // পূর্ণসংখ্যা হলে শুধু সংখ্যা, না হলে ২ ঘর দশমিক দেখাবে
          let displayValue = Number.isInteger(roundedZakat) ? roundedZakat : roundedZakat.toFixed(2);
          
          resultElement.innerText = bnDigit(displayValue) + "৳";
        } else {
          resultElement.innerText = "০৳";
        }
      }

      function calculateKhums() {
        let rawInput = document.getElementById("khums-input").value;
        let amount = parseFloat(enDigit(rawInput));
        const resultElement = document.getElementById("khums-result");

        if (!isNaN(amount) && amount > 0) {
          const khums = amount * 0.2; // 20% calculation
          
          // দশমিকের পর ২ ঘর পর্যন্ত রাউন্ড করা হচ্ছে
          let roundedKhums = Math.round(khums * 100) / 100;
          // পূর্ণসংখ্যা হলে শুধু সংখ্যা, না হলে ২ ঘর দশমিক দেখাবে
          let displayValue = Number.isInteger(roundedKhums) ? roundedKhums : roundedKhums.toFixed(2);
          
          resultElement.innerText = bnDigit(displayValue) + "৳";
        } else {
          resultElement.innerText = "০৳";
        }
      }

      function calculateFitra() {
        let rawMembers = document.getElementById("fitra-members").value;
        let members = parseFloat(enDigit(rawMembers));
        let rate = parseFloat(document.getElementById("fitra-rate").value);
        const resultElement = document.getElementById("fitra-result");

        if (!isNaN(members) && members > 0) {
          const fitra = members * rate;
          resultElement.innerText = bnDigit(Math.floor(fitra)) + "৳";
        } else {
          resultElement.innerText = "০৳";
        }
      }

      function calculateFidiya() {
        let rawDays = document.getElementById("fidiya-days").value;
        let days = parseFloat(enDigit(rawDays));
        let rate = parseFloat(document.getElementById("fidiya-rate").value);
        const resultElement = document.getElementById("fidiya-result");

        if (!isNaN(days) && days > 0) {
          const fidiya = days * rate;
          resultElement.innerText = bnDigit(Math.floor(fidiya)) + "৳";
          
        } else {
          resultElement.innerText = "০৳";
        }
      }

      // ================= BLOG / ARTICLE LOGIC =================
      function openArticle(articleId) {
        // ১. লিস্ট হাইড করো, রিডার ভিউ অন করো
        document.getElementById('article-list-container').style.display = 'none';
        document.getElementById('article-reader-container').style.display = 'block';

        // ২. সবগুলো আর্টিকেল আগে হাইড করো
        const allArticles = document.querySelectorAll('.blog-content');
        allArticles.forEach(el => el.style.display = 'none');

        // ৩. শুধু যেটায় ক্লিক করেছে, সেটা শো করো
        document.getElementById(articleId).style.display = 'block';

        // ৪. স্ক্রল করে পেজের একদম উপরে নিয়ে যাও
        window.scrollTo(0, 0);
      }

      function closeArticle() {
        // রিডার ভিউ হাইড করো, লিস্ট আবার ফিরিয়ে আনো
        document.getElementById('article-reader-container').style.display = 'none';
        document.getElementById('article-list-container').style.display = 'block';
        window.scrollTo(0, 0);
      }