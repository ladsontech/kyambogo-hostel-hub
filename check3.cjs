const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') console.log('BROWSER ERROR CONSOLE:', msg.text());
    });
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

    try {
        await page.goto('http://localhost:8080/admin', { waitUntil: 'networkidle0' });
        await page.waitForSelector('button[type="submit"]');
        await page.click('button[type="submit"]');
        console.log("Clicked login, waiting for route change");

        // waiting for a few seconds to let React render the next route.
        await new Promise(r => setTimeout(r, 4000));

        // Dump entire body to see where we are
        const bodyHTML = await page.evaluate(() => document.body.innerHTML);
        if (!bodyHTML.includes('Admin Dashboard') && !bodyHTML.includes('All Hostels')) {
            console.log("DASHBOARD DID NOT LOAD. HTML snapshot:");
            console.log(bodyHTML);
        } else {
            console.log("Dashboard loaded successfully!");
        }
    } catch (e) {
        console.log("Script error:", e.message);
    }

    await browser.close();
})();
