const puppeteer = require('puppeteer');
const { error, log } = console;

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

				case 'click':
					await this.click(step.selector, step.waitFor);
					break;

				case 'collect-data':
					await this.collectData(step.prop, step.selector, step.contentType, step.multiple);
					break;

				case 'go-to':
					await this.goTo(step.link, step.waitFor);
					break;

				case 'screenshot':
					await this.screenshot();
					break;

				case 'wait-for-selector':
					await this.waitForSelector(step.selector);
					break;

				default:
					log(`${step.type} is not implemented yet.`);
					break;
			}

		}

	} // end scrap

	async click(selector, waitFor = 0) {

		log(`Click on selector ${selector}`)
		await this.page.waitForSelector(selector);
		await this.page.click(selector, { waitUntil: 'domcontentloaded' });
		await this.page.waitFor(waitFor);

	} // end click

	async goTo(url, waitFor = 0) {

		log(`Going to ${link}`);
		await this.page.goto(url, { waitUntil: 'networkidle2' });
		await this.page.waitFor(waitFor);

	} // end goTo

	async screenshot() {

		log('Taking screenshot');
		await this.page.screenshot({ path: `./${Date.now()}.png` });

	} // end screenshot

	async waitForSelector(selector) {

		log(`Waiting for the selector ${selector}`);
		await this.page.waitForSelector(selector, {
			visible: true
		});

	} // end waitForSelector

	async collectData(prop, selector, contentType = 'innerText', multiple = false) {

		log(`Collecting data for selector ${selector} - multiple data? ${multiple}`);

		const availableContentTypes = ['innerText', 'outerHTML'];

		if (!availableContentTypes.includes(contentType)) {

			log('Content type is not valid, the action is omitted');
			return;

		}

		try {

			if (!multiple) {

				this.collectedData[prop] = await this.page.$eval(selector, el => el[contentType]);

			} else {

				this.collectedData[prop] = await this.page.$$eval(selector, els => {

					return els.map(el => el[contentType]);

				});

			}

			log(`Prop ${prop} collected with value ${this.collectedData[prop]}`);

		} catch (err) {

			error('Error getting data::: ', err);
			this.collectedData[prop] = 'error-getting-data';

		}

	} // end collectData

} // end class Scrapper
