import mapChildren from './mapChildren';

let compile = function compile(frag, shadowRoot, { openDelim='{{', closeDelim='}}' } = {}) {
    let shadow = frag.cloneNode(true),
        map = mapChildren(frag, shadow, {});

    shadowRoot.appendChild(shadow);
    //the render function.
    return function (data) {
        Object.keys(map).forEach( binding => {
            let fullDelim = RegExp(openDelim +
                                   '\\s*' +
                                   binding +
                                   '\\s*' +
                                   closeDelim),
                val = binding.split(/\.|\//g)
                             .reduce( (val, segment) => (val && val[segment]) || '', data),
                nodeObjs = map[binding];

            nodeObjs.forEach(function (nodeObj) {

                if (nodeObj.textContent) {
                    let text = nodeObj.templateNode.textContent.split(fullDelim).join(val);
                    nodeObj.shadowNode.textContent = text;
                }
                if (nodeObj.value) {
                    let attrVal = nodeObj.templateNode.value.split(fullDelim).join(val);
                    nodeObj.shadowNode.value = attrVal;
                }
                if (nodeObj.name) {
                    let attrName = nodeObj.templateNode.name.split(fullDelim).join(val);
                    //Silent fail.
                    nodeObj.shadowNode.name = attrName;
                }
            });
        });
    };
};

window.DOMingo = compile;
export default compile;
