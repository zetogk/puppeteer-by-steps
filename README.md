# Puppeteer by steps

This package is a wrapper of Puppeteer which works setting an array of steps.

It allows you doing basic scrapping in a easy way.

## Get started

### Init
Get a new instance of Scrapper

```
Scrapper(<dimensions>, <showBrowser>, <steps>, <objectData>)

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
```

```
const Scrapper = require('puppeteer-by-steps');
s = new Scrapper({ width: 1366, height: 768}, true, newSteps, transformedData);
await s.init(); // Init setting required by Puppeteer
await s.scrap(); // Start the scrapping process

```

## Steps

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


### **go-to**

Definition:

```
{
    type: 'go-to',
    link: <string:url:required>, // URL which will be visited
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
}
```

Example:

```
{
    type: 'wait-for-selector',
    selector: '.mydiv'
}
```