# DOMingo
A templating library for rendering DOM

##Example Usage

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
```

```
import DOMingo from 'DOMingo';

let docFrag = document.querySelector('template').content,
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
    };

DOMingo()
```
