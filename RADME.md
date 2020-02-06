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