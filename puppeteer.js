const puppeteer = require("puppeteer");


(async ()=>{
    console.log("hi hello");
    const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser', headless:false, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9'
    });
    await page.goto('https://www.nseindia.com',{ waitUntil: 'networkidle2' });
    console.log("I ran this");
    return;
})();

