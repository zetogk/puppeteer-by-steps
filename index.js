const puppeteer = require('puppeteer');
const { error, log } = console;

class Scrapper {

	constructor(dimensions, showBrowser, steps, objectData, customChromium = '') {

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

		if (customChromium != '') {
			this.optionsBrowser.executablePath = customChromium;
		}

	}

	getSteps() {

		return this.steps;

	} // end getSteps

	setSteps(steps) {

		this.steps = steps;

	} // end setSteps

	async closeBrowser() {

		await this.browser.close();

	} // end closeBrowser

	async init() {

		this.browser = await puppeteer.launch(this.optionsBrowser);
		const pages = await this.browser.pages();
		this.page = pages[0];
		const { height, width } = this.dimensions;
		await this.page.setViewport({ width, height });

	} // end init

	getBrowser() {

		return this.browser;

	} // end getBrowser

	getCurrentPage() {

		return this.page;

	} // end getCurrentPage

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

				case 'fill-data':
					await this.fillData(step.data, step.waitFor);
					break;

				case 'go-to':
					await this.goTo(step.link, step.waitFor);
					break;

				case 'press-key':
					await this.pressKey(step.key, step.waitFor);
					break;

				case 'screenshot':
					await this.screenshot();
					break;

				case 'wait-for-selector':
					await this.waitForSelector(step.selector, step.timeout || 30000);
					break;

				default:
					log(`${step.type} is not implemented yet.`);
					break;
			}

		}

	} // end scrap

	async click(selector, waitFor = 0) {

		log(`Click on selector ${selector}`)
		try {

			await this.page.waitForSelector(selector);
			await this.page.click(selector, { waitUntil: 'domcontentloaded' });
			await this.page.waitFor(waitFor);

		} catch (err) {

			error('Error doing click: ', err.message);

		}

	} // end click

	async collectData(prop, selector, contentType = 'value', multiple = false) {

		log(`Collecting data for selector ${selector} - multiple data? ${multiple}`);

		const availableContentTypes = ['innerText', 'outerHTML', 'value'];

		if (!availableContentTypes.includes(contentType)) {

			log('Content type is not valid, the action is omitted');
			return;

		}

		try {

			if (!multiple) {

				this.collectedData[prop] = await this.page.$eval(selector, (el, contentType) => el[contentType], contentType);

			} else {

				this.collectedData[prop] = await this.page.$$eval(selector, (els, contentType) => {

					return els.map(el => el[contentType]);

				}, contentType);

			}

			log(`Prop ${prop} collected with value ${this.collectedData[prop]}`);

		} catch (err) {

			error('Error getting data::: ', err);
			this.collectedData[prop] = 'error-getting-data';

		}

	} // end collectData

	async fillData(data, waitFor = 0) {

		for (let $i = 0; $i < data.length; $i++) {

			const { type, selector, origin, value, waitFor } = data[$i];
			const valueToAssign = origin == 'static' ? value : this.objectData[value];

			await this.page.waitForSelector(selector);

			switch (type) {
				case 'input':
					log(`Enter input :${selector}: with value :${valueToAssign}:`);
					await this.page.$eval(selector, (el) => {

						el.value = ''

					}); // Delete data
					await this.page.focus(selector);
					await this.page.keyboard.type(valueToAssign.toString());
					break;

				case 'select':
					log(`Select :${selector}: with value :${valueToAssign}:`);
					await this.page.select(selector, valueToAssign);
					break;

				case 'radio':
					log(`Choose radio :${selector}: with value :${valueToAssign}:`);
					await this.page.$$eval(selector, (el, valueToAssign) => {

						el[valueToAssign].click();

					}, valueToAssign);
					break;

				default:
					await this.page.$eval(selector, (el, valueToAssign) => {

						el.value = valueToAssign

					}, valueToAssign);
					break;
			}

			await this.page.waitFor(waitFor || 0);

		}
		await this.page.waitFor(waitFor);

	} // end fillData

	getCollectedData() {

		return this.collectedData;

	} // end getCollectedData

	async goTo(url, waitFor = 0) {

		log(`Going to ${url}`);
		await this.page.goto(url, { waitUntil: 'networkidle2' });
		await this.page.waitFor(waitFor);

	} // end goTo

	async pressKey(key, waitFor = 0) {

		await this.page.keyboard.press(key);
		await this.page.waitFor(waitFor);

	} // end pressKey

	async screenshot() {

		log('Taking screenshot');
		await this.page.screenshot({ path: `./${Date.now()}.png` });

	} // end screenshot

	async waitForSelector(selector, timeout = 30000) {

		log(`Waiting for the selector ${selector}`);
		await this.page.waitForSelector(selector, {
			visible: true,
			timeout
		});

	} // end waitForSelector

} // end class Scrapper

module.exports = Scrapper;