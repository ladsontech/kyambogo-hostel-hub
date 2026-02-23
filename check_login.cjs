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
        await page.type('#admin-email', 'admin@example.com');
        await page.type('#admin-password', 'password');
        await page.click('button[type="submit"]');
        console.log("Clicked login, waiting for route change");

        await new Promise(r => setTimeout(r, 15000));

        const bodyHTML = await page.evaluate(() => document.body.innerHTML);
        if (!bodyHTML.includes('Admin Dashboard') && !bodyHTML.includes('All Hostels')) {
            console.log("DASHBOARD DID NOT LOAD. HTML snapshot:");
            console.log(bodyHTML);
        } else {
            console.log("Dashboard loaded successfully!");

            // Let's check if the 'Brokers' tab can be clicked without throwing errors.
            await page.click('[value="brokers"]');
            await new Promise(r => setTimeout(r, 1000));
            console.log("Clicked Brokers tab");
        }
    } catch (e) {
        console.log("Script error:", e.message);
    }

    await browser.close();
})();
