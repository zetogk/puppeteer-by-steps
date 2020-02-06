const puppeteer = require('puppeteer');
const { log } = console;

class Scrapper {

	constructor(dimensions, showBrowser, steps, objectData) {

		this.objectData = objectData;
		this.steps = steps;
		this.dimensions = dimensions;
		this.collectedData = {};

		const { height, width } = this.dimensions;

		this.optionsBrowser = {
			headless: !showBrowser,
			ignoreHTTPSErrors: true,
			timeout: 30000,
			args: [
				`--window-size=${width},${height}`,
				'--disable-gpu',
				'--disable-dev-shm-usage',
				'--no-sandbox',
				'--disable-setuid-sandbox'
			]
		}

	}

	async init() {

		this.browser = await puppeteer.launch(this.optionsBrowser);
		const pages = await this.browser.pages();
		this.page = pages[0];
		const { height, width } = this.dimensions;
		await this.page.setViewport({ width, height });

	}

	async scrap() {

		for (let $i = 0; $i < this.steps.length; $i++) {

			const step = this.steps[$i];

			switch (step.type) {

				case 'go-to':
					await this.goTo(step.link, step.waitFor);
					break;

				default:
					log(`${step.type} is not implemented yet.`);
					break;
			}

		}

	} // end scrap

	async goTo(url, waitFor = 0) {

        await this.page.goto(url, { waitUntil: 'networkidle2' });
        await this.page.waitFor(waitFor);

    } // en goTo

} // end class Scrapper