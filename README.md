# DOMingo
A small (2KB minified and 830byte gziped), DOM centric templating library. DOMingo is particularly well suited for for rendering `<template>` content into a shadowRoot for Web Components. Bindings can be added to either the textContent of an element or in the value of an attribute. When rendering, DOMingo will only update the parts of the DOM that have changed. This provides a number of benefits apart from performance. One major benefit is how well this works with Web Components and Mutation Observers. DOMingo's approach means that when a new render is performed, neither an `attributeChangedCallback` nor a mutation event is not triggered on nodes who's value have not changed. With rendering methods that treat templates as strings before dumping them into the DOM for rendering, the entire contents of the render target is destroyed before being replaced. This could break event listeners or node references attached to specific elements with the render target. This is unnecessary with DOMingo.

##API

###Compile stage
####`DOMingo(target [, { delimiters = ['{{', '}}'] }])`
DOMingo provides a `DOMingo` function which accepts a single DOM node or fragment that is acts as the target for rendering, and an optional `options` argument. The DOMingo function acts as a "compile" stage for the target and allows DOMingo to intelligently update only the nodes that change when a new render occurs. The DOMingo function returns another function used in the [render stage](#render-stage) that is used to update the target's contents.

_templateFragment_

The target is a DOM node or fragment that contains the text bindings. This is most commonly obtained by retrieving the `contents` of a `<template>` element, but any element node or fragment can be used.

```
<template>...</template>
...
target = document.querySelector('template').contents;
```

_options_

The options object is an optional argument that currently understands one property: delimiters, which is a two-array of open and close delimiters for data binding. The default values are '{{' and '}}' respectively. There should be no need to include an options object unless you want to override the data binding delimiters.

```
var options = {
        openDelim: '<%=',
        closeDelim: '%>'
    };

DOMingo(target, options);

```

###Render stage
####`render(data)`
The `DOMingo` function returns a function that is used to render the changes into the target. This function accepts just one argument, the data to be applied to the template.

```
var render = DOMingo(target);
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

let target = document.querySelector('template').content,
    customEl = document.querySelector('custom-element'),
    shadow = customEl.createShadowRoot(),
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
    render = DOMingo(target);

customEl.shadowRoot.appendChild(target);

render(data);
```
