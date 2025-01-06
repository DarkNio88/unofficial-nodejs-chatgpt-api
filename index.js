const express = require('express');
const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const bodyParser = require('body-parser');

puppeteer.use(stealthPlugin());

const app = express();
app.use(bodyParser.json());

let browser = null;
let page = null;

const initBrowser = async () => {
    if (!browser) {
        browser = await puppeteer.launch({ headless: false });
        page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36');
    }
};

const navigateToPage = async () => {
    if (page) {
        const url = 'https://chatgpt.com/';
        //const url = 'file://C:\\Users\\sonic\\Desktop\\unofficial-nodejs-chatgpt-api\\ChatGPT.html';

        if (page.url() !== url) {
            await page.goto(url, { waitUntil: 'networkidle2' });
        }
    }
};

// Funzione per il ritardo (sleep)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

app.post('/send-message', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message parameter is required' });
    }

    try {
        await initBrowser(); // Ensure the browser is initialized
        await navigateToPage(); // Ensure the page is at the target URL

        if (message.trim().toLowerCase() === '/bye') {
            if (browser) {
                await browser.close();
                browser = null;
                page = null;
                return res.json({ message: 'Browser closed' });
            } else {
                return res.json({ message: 'Browser is already closed' });
            }
        }

        await page.waitForSelector('#prompt-textarea');
        const textarea = await page.$('#prompt-textarea');
        await textarea.focus();

        await page.keyboard.type(message);
        await page.keyboard.press('Enter');
        
        // Pausa di 1 secondo
        await sleep(1000); // Attende 1 secondo

        let textContent = '';
        let isComplete = false;

        // Ciclo while per aspettare il completamento della risposta finché non appare l'elemento "aria-label=Copy"
        while (!isComplete) {
            // Verifica se l'elemento con aria-label="Copy" è presente
            const stopStreamingElement = await page.$('[aria-label="Stop streaming"]');
            if (!stopStreamingElement) {
                // Se il bottone "Copy" è trovato, significa che la risposta è completa
                textContent = await page.evaluate(() => {
                    const elements = document.querySelectorAll('article[data-testid^="conversation-turn-"]');
                    if (elements.length > 0) {
                        const lastElement = elements[elements.length - 1];
                        const button = lastElement.querySelector('button');
                        if (button) {
                            const textDiv = lastElement.querySelector('div.markdown.prose.w-full.break-words.dark\\:prose-invert.dark');
                            if (textDiv) {
                                const pElement = textDiv;
                                return pElement.textContent || ''; // Ritorna il testo
                            }
                        }
                    }
                    return ''; // Se nessun contenuto è disponibile
                });
                isComplete = true; // Risposta completa
            } else {
                console.log("Waiting for the response to complete...");
                await sleep(1000); // Attende 1 secondo prima di riprovare
            }
        }

        // Risponde con il contenuto trovato
        return res.json({ message: textContent });

    } catch (error) {
        console.error('An error occurred:', error.message);
        return res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
