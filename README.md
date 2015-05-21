# DOMingo
A small (4KB minified and 1KB gziped), DOM centric templating library particularly for rendering `<template>` content into a shadowRoot. Bindings can be added to either the textContent of an element or in the value of an attribute. When rendering, DOMingo will only update the parts of the render target -- usually a `shadowRoot` -- that have changed. This provides a number of benefits apart from performance. One major benefit is how well this works with Web Components. DOMingo's approach means that when a new render is performed, an `attributeChangedCallback` event is not triggered on attributes who's value has not changed. With rendering methods that treat templates as strings before dumping them into the DOM for rendering, the entire contents of the render target is destroyed before being replaced. This could break event listeners or node references attached to specific elements with the render target. This is unnecessary with DOMingo.

##API

###Compile stage
####`DOMingo(templateFragment, renderTarget[, { openDelim='{{', closeDelim='}}' }])`
DOMingo exports and exposes a global `DOMingo` function which accepts two arguments with an optional `options` third argument. This function acts as a "compile" stage for a template and target. This function creates a mapping between the template fragment and a fragment that will be inserted into the render target. It is this stage that allows DOMingo to update only the differences from one render to the next. This function returns another function that is used to update the render target's contents.

_templateFragment_

The templateFragment is a DOMFragment that contains the text bindings. This is most commonly obtained by retrieving the `contents` of a `<template>` element, but any DOMFragment can be used.

```
<template>...</template>
...
templateFragment = document.querySelector('template').contents;
```

_renderTarget_

The renderTarget is the container for where the rendered DOM should go. This is most often a `shadowRoot` but may be any DOM element or fragment.

```
customElement = document.querySelector('custom-element');
renderTarget = customElement.createShadowRoot();
```

_options_

The options object is an optional argument that currently understands two properties: openDelim and closeDelim. These properties represent strings that identify the opening and closing delimeters for data binding. The default values are '{{' and '}}' respectively. There should be no need to include an options object unless you want to override the data binding delimeters.

```
var options = {
        openDelim: '<%=',
        closeDelim: '%>'
    };

DOMingo(templateFragment, renderTarget, options);

```

###Render stage
####`render(data)`
The `DOMingo` function returns a function that is used to render the changes into the render target. This function accepts just one argument, the data to be applied to the template.

```
var render = DOMingo(templateFragment, renderTarget);
render(data);
```

##Putting it all together

Assuming an HTML document similar to below:
```
<template>
    <figure>
        <style>
            [data-forcast-for] {

            }
        </style>
        <div data-forcast-for="{{forecast.label}}"></div>
        <figcaption>
            Today's forecast is {{forecast.label}} with a {{forecast.rain-chance}}% chance of rain. The high will be {{forecast.temperatures.high}}{{forecast.temperatures.units}} and a low of {{forecast.temperatures.low}}.
        </figcaption>
    </figure>
</template>

<custom-element></custom-element>
```

DOMingo could be used like this:
```
import DOMingo from 'DOMingo';

let templateFragment = document.querySelector('template').content,
    renderTarget = document.querySelector('custo-element'),
    targetRoot = renderTarget.createShadowRoot(),
    data = {
        forecast: {
            label: 'partly cloudy',
            'rain-chance': 50,
            temperatures: {
                high: 75,
                low: 58,
                units: 'F'
            }
        }
    },
    render = DOMingo(templateFragment, targetRoot);

render(data);
```
