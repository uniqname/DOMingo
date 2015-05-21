import mapNode from './mapNode';
import interleave from './interleave';

export default function DOMingo(frag, shadowRoot, bindPatter=/\{\{[^}}]*}}/g) {
    let shadow = frag.cloneNode(true),
        map = [...shadow.childNodes].reduce(mapNode, []);

    shadowRoot.appendChild(shadow);

    //the render function.
    return function (data) {
        map = map.map( (bindObj) => {
            bindObj.currentValues = bindObj.dataPaths.map( (path, i) => {
                let val = path.split(/\.|\//g)
                              .reduce( (val, segment) => (val && val[segment]) || '', data);

                return val !== undefined ? val : bindObj.currentValues[i];
            });
            let propVal = interleave(bindObj.staticParts, bindObj.currentValues).join('');

            let prop = bindObj.node.value !== undefined ? 'value' : 'textContent';
            bindObj.node[prop] = propVal;

            return bindObj;
        });

        return shadow;
    };
}

window.DOMingo = DOMingo;
