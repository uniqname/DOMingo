import bindingsInStr from './bindingsInStr';

export default function makeEntry(node, {openDelim='{{', closeDelim='}}'} = {}) {
    let bindPattern = new RegExp(`${openDelim}[^${closeDelim}]*${closeDelim}`, 'g'),
        prop = node.value ? 'value' : 'textContent',
        bindings = bindingsInStr(node[prop], {openDelim:openDelim, closeDelim:closeDelim}),
        staticParts = node[prop].split(bindPattern);
    if (bindings.length) {
        return {
            node: node,
            staticParts: staticParts,
            dataPaths: bindings,
            currentValues: bindings.map(binding => '')
        };
    } else {
        return null;
    }
}

/*
{
    node: <renderTargetNode>,
    staticParts: [String],
    dataPaths: [String],
    currentValues: [String]
}
*/
