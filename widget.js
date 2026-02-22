(function() {
    // আপনার মূল অ্যাপের লিংক
    const appUrl = 'https://kamrulhasanj.github.io/ramadan-app';

    // উইজেট কন্টেইনার
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'ramadan-widget-container';
    
    // স্টাইলস যুক্ত করা
    const styles = `
        #ramadan-widget-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            font-family: sans-serif;
        }
        #ramadan-widget-btn {
            background: #15803d;
            color: white;
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            transition: transform 0.2s;
            float: right;
        }
        #ramadan-widget-btn:hover {
            transform: scale(1.05);
        }
        #ramadan-widget-iframe-container {
            display: none;
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 400px;
            height: 700px;
            max-height: calc(100vh - 120px);
            max-width: calc(100vw - 40px);
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow: hidden;
            border: 1px solid #e5e7eb;
        }
        #ramadan-widget-iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        @media (max-width: 480px) {
            #ramadan-widget-iframe-container {
                width: calc(100vw - 40px);
                height: 85vh;
            }
        }
    `;

    const styleTag = document.createElement('style');
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);

    // আইফ্রেম তৈরি করা
    const iframeContainer = document.createElement('div');
    iframeContainer.id = 'ramadan-widget-iframe-container';
    
    const iframe = document.createElement('iframe');
    iframe.src = appUrl;
    iframe.id = 'ramadan-widget-iframe';
    
    // বাটন তৈরি করা
    const btn = document.createElement('button');
    btn.id = 'ramadan-widget-btn';
    btn.innerHTML = '🌙'; 
    
    iframeContainer.appendChild(iframe);
    widgetContainer.appendChild(iframeContainer);
    widgetContainer.appendChild(btn);
    document.body.appendChild(widgetContainer);

    // ক্লিক লজিক (ওপেন / ক্লোজ)
    let isOpen = false;
    btn.addEventListener('click', () => {
        isOpen = !isOpen;
        if(isOpen) {
            iframeContainer.style.display = 'block';
            btn.innerHTML = '✖';
        } else {
            iframeContainer.style.display = 'none';
            btn.innerHTML = '🌙';
        }
    });
})();