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

## Methods

### ***async* init**

This method is required after you instance the Scrapper.

Use:

```
await s.init();
```

### ***async*  scrap**

This method will run the different steps which have been passed to the Scrapper.

Use:

```
await s.scrap();
```

### **getCollectedData**

This method returns the data collected across the different steps.

Use:

```
const data = s.getCollectedData();
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
    data: [<Data>]
}

<Data>: {
    type: <string:required:options=input,select,radio>,
    selector: <string:required>, // Selector which will be used for complete the action
    origin: <string:options=static,dynamic>, // 'Static' will take the value of the prop *value*, 'dynamic' will take the value of the *objectData* passed at moment of instance creation.
    value: <string> //(For radio buttoms is the index of the option. Example: '0' or '2')
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
        value: 'street 32' // *street 32* will be the value set
    },{
        type: 'input',
        selector: '#phonenumber',
        origin: 'static',
        value: '18601234567' //*18601234567* will be the value set
    }]
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
    }]
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