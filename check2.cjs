const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText));

    try {
        await page.goto('http://localhost:8080/admin', { waitUntil: 'networkidle0' });
        console.log("On Auth Page");
        await page.click('button[type="submit"]'); // assuming there's a submit button
        console.log("Clicked login");
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 });
        console.log("Navigated to dashboard");
    } catch (e) {
        console.log("Script error:", e.message);
    }

    await browser.close();
})();
