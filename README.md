# Puppeteer by steps

This package is a wrapper of Puppeteer which works setting an array of steps.

It allows you doing basic scrapping in a easy way.

## Get started

### Init
Get a new instance of Scrapper

```
Scrapper(<dimensions>, <showBrowser>, <steps>, <objectData>, <customChromium>)

dimensions: {
    height: <number>
    width: <number>,
}

showBrowser: <boolean>

steps: [{
    type: <string>,
    ...propsAccordingToType
}]

objectData: {
    yourProp1: 'prop1',
    yourProp2: 'prop2',
    yourProp3: 'prop3'
}

customChromium: <string>
// if customChromium = ''. The Chromium to be used will be the installed by Puppeteer; otherwise, The Chromium to be used will be the past one.
```

```
const Scrapper = require('puppeteer-by-steps');
s = new Scrapper({ width: 1366, height: 768}, true, newSteps, transformedData);
await s.init(); // Init setting required by Puppeteer
await s.scrap(); // Start the scrapping process

```

## Methods

### ***async* init**

This method is required after you instance the Scrapper. This method will set your first page, which will called `main`.

Use:

```
await s.init();
```

### **getBrowser**

This method returns the Puppeteer browser. You can use whatever Puppeteer browser method.

```
s.getBrowser();
```

### **getCurrentPage**

This method returns the Puppeteer page which is being using currently. You can use whatever Puppeteer page method.

```
s.getCurrentPage();
```

### ***async*  createPage (name: `<string>`)**

This method will create a new page in the browser. It receives a name for the new page.

Use:

```
await s.createPage(name);
```

Example:

```
await s.createPage('secondPage');
```

### ***async*  selectPage (name: `<string>`)**

This method allows to switch between the different pages using the name. If does not exist a page with the given name by parameter, the browser will switch to the `main` page .

Use:

```
await s.selectPage(name);
```

Example:

```
await s.selectPage('secondPage');
await s.selectPage('main');
```

### ***async*  selectPageByIndex (index: `<number>`)**

This method allows to switch between the different pages using the index of array pages instances of the browser.

Use:

```
await s.selectPageByIndex(index);
```

Example:

```
await s.selectPageByIndex(0);
await s.selectPageByIndex(1);
await s.selectPageByIndex(5);
```



### ***async*  scrap**

This method will run the different steps which have been passed to the Scrapper.

Use:

```
await s.scrap();
```

### **getCollectedData**

This method returns the data collected across the different steps.
* If a string parameter is sent, the function will return the specific property stored according to the parameter.
* If is not sent any parameter, an array will be returned with all data collected.

Use:

```
const fullData = s.getCollectedData();
const specificData = s.getCollectedData('propertyStored');
```


### **getSteps**

This method returns the array with current steps

Use:

```
const data = s.getSteps();
```


### **setSteps**

This method sets the steps.

Use:

```
const data = s.setSteps([<Step>]);
```

### ***async* closeBrowser**

This method closes the browser.

Use:

```
await s.closeBrowser();
```

## Methods (Steps)
You can invoke it in individual way or using in steps.

### **click**

Definition:

```
{
    type: 'click',
    selector: <string:required>, // Selector which will be used for complete the action
    waitFor: <number:default=0> // Milliseconds to await after complete the action
}
```

Example:

```
{
    type: 'click',
    selector: 'a.mylink'
    waitFor: 10
}
```

### **collect-data**

Definition:
You can store data inside an object of the your Scrapper instance, this data can be retrieved using the method `getCollectedData`;

```
{
    type: 'collect-data',
    prop: '<string|required>', // Name of prop inside the *collectedData*
    selector: <string:required>, // Selector which will be used for complete the action
    contentType: <string:default=innerText:options=innerText,outerHTML> // Type of information you can extract form the selector,
    multiple: <boolean:default=false> // By default returns only one value, otherwise, if there are more one value matched with the selector, will be returned an array
}
```

Example not-multiple:

```
{
    type: 'collect-data',
    prop: 'title',
    selector: 'h1',
    contentType: 'innerText',
    multiple: false
}
```

Example multiple:

```
{
    type: 'collect-data',
    prop: 'subtitles',
    selector: 'h3',
    contentType: 'innerText',
    multiple: true
}
```

### **fill-data**

Definition:
You can set values to inputs, selects or radio buttoms.

```
{
    type: 'fill-data',
    data: [<Data>],
    waitFor: <number:default=0> // Milliseconds to await after complete the action
}

<Data>: {
    type: <string:required:options=input,select,radio>,
    selector: <string:required>, // Selector which will be used for complete the action
    origin: <string:options=static,dynamic>, // 'Static' will take the value of the prop *value*, 'dynamic' will take the value of the *objectData* passed at moment of instance creation.
    value: <string> //(For radio buttoms is the index of the option. Example: '0' or '2'),
    waitFor: <number:default=0> // Milliseconds to await after complete the action
}
```

Example static value:

```
{
    type: 'fill-data',
    data: [{
        type: 'input',
        selector: '#homeaddress',
        origin: 'static',
        value: 'street 32' // *street 32* will be the value set,
        waitFor: 1000
    },{
        type: 'input',
        selector: '#phonenumber',
        origin: 'static',
        value: '18601234567' //*18601234567* will be the value set
    }],
    waitFor: <number:default=0> // Milliseconds to await after complete the action
}
```

Example dynamic value:

```
{
    type: 'fill-data',
    data: [{
        type: 'input',
        selector: '#homeaddress',
        origin: 'dynamic',
        value: 'user_home_address' // The value set will be the value for objectClass.user_home_address (Passed in the creation of the Scrapper instance)
    },{
        type: 'input',
        selector: '#phonenumber',
        origin: 'dynamic',
        value: 'user_phone' // The value set will be the value for objectClass.user_phone (Passed in the creation of the Scrapper instance)
    }],
    waitFor: 2000
}
```


### **go-to**

Definition:

[Definition of Puppeteer options for goTo](https://pptr.dev/#?product=Puppeteer&version=v2.1.1&show=api-pagegotourl-options)

```
{
    type: 'go-to',
    link: <string:url:required>, // URL which will be visited
    waitUntil: <string:default=load:options=load,domcontentloaded,networkidle0,networkidle2>,
    timeout: <number>, // milliseconds
    waitFor: <number:default=0> // Milliseconds to await after complete the action
}
```

Example:

```
{
    type: 'go-to',
    link: 'https://github.com/zetogk',
    waitFor: 0
}
```

### **press-key**

Definition:

[List of keys - US Keyboard Layout](https://github.com/puppeteer/puppeteer/blob/master/lib/USKeyboardLayout.js)

```
{
    type: 'press-key',
    key: <string:required>, // Visit the keyboard layout to know the keys
    waitFor: <number:default=0> // Milliseconds to await after complete the action
}
```

Example:

```
{
    type: 'press-key',
    key: 'Escape',
    waitFor: 1000
}
```


### **screenshot**

Definition:

```
{
    type: 'screenshot'
}
```

Example:

```
{
    type: 'screenshot'
}
```

### **wait-for-selector**

Definition:

```
{
    type: 'wait-for-selector',
    selector: <string:required>, // Selector which will be used for complete the action
    timeout: <number> // milliseconds
}
```

Example:

```
{
    type: 'wait-for-selector',
    selector: '.mydiv',
    timeout: 10000
}
```

## Authors
* zetogk <zetogk@gmail.com>

### Contributors
* Maximo-Miranda <maximomirandah@gmail.com>