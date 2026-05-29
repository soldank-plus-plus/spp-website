/*
Generates screenshots for all maps found in data/filelist.
Requires puppeteer and the dev server running on localhost:5173.

To launch this script you have to be in public/mapviewer folder then
node scripts/screenshots.js to update screenshots.
*/

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const FILELIST = path.join(__dirname, '..', 'data', 'filelist');
const OUT_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function getMaps() {
    const lines = fs.readFileSync(FILELIST, 'utf-8').split(/\r?\n/).filter(Boolean);
    return lines
        .filter(l => l.endsWith('.pms'))
        .map(l => {
            const parts = l.split('/');
            const category = parts[0];
            const filename = parts[parts.length - 1];
            const mapname = filename.slice(0, -4);
            return { category, mapname, id: `${category}_${mapname}` };
        });
}

(async () => {
    const maps = getMaps();
    console.log(`[Screenshots] ${maps.length} maps has been found.`);

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    const client = await page.target().createCDPSession();
    await client.send('Browser.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: OUT_DIR,
    });

    for (const { category, mapname, id } of maps) {
        const outPath = path.join(OUT_DIR, `${id}.png`);

        if (fs.existsSync(outPath)) {
            console.log(`skip  ${id} (already exists)`);
            continue;
        }

        const url = `${BASE_URL}/mapviewer?map=${category}/${encodeURIComponent(mapname)}`;
        console.log(`render ${id}...`);

        try {
            // give a moment for canvas and texture to make screenshot properly
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

            await page.waitForFunction(
                () => {
                    const canvas = document.querySelector('canvas');
                    return canvas && canvas.style.display !== 'none';
                },
                { timeout: 20000 }
            );

            await new Promise(r => setTimeout(r, 1500));

            // screenshot button saves as {id}.png to OUT_DIR via intercepted download
            await page.evaluate(() => {
                const btn = document.querySelector('button[title="Screenshot"]');
                if (btn) btn.click();
            });

            await new Promise((resolve, reject) => {
                const deadline = Date.now() + 10000;
                const check = setInterval(() => {
                    if (fs.existsSync(outPath)) {
                        clearInterval(check);
                        resolve();
                    } else if (Date.now() > deadline) {
                        clearInterval(check);
                        reject(new Error('download timeout'));
                    }
                }, 200);
            });

            console.log(`  saved ${id}.png`);
        } catch (err) {
            console.warn(`  failed ${id}: ${err.message}`);
        }
    }

    await browser.close();
    console.log('Done.');
})();
