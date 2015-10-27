function nodeReduce(nodes, node) {
    return [...(node.childNodes || [])]
        .reduce(nodeReduce, nodes)
        .concat([...(node.attributes || [])])
        .concat(node.nodeValue ? node : []);
}

var sanitize = (str) => str.replace(/[$^?.*+\\[\]{}()]/gm, match => `\\${match}`);

var bindFinder = (openDelim, closeDelim) => new RegExp(`(?:${sanitize(openDelim)}\\s?)(\\S+)(?:\\s?${sanitize(closeDelim)})`, 'g');

var hasBindingsWithDelem = (openDelim = '{{', closeDelim = '}}') => node =>
    node.nodeValue.match(bindFinder(openDelim, closeDelim));

function interleave (arr1, arr2) {
    return arr1.reduce((interleaved, item, i) => {
        let arr2Item = arr2[i];
        interleaved.push(item);
        if (arr2Item !== undefined) {
            interleaved.push(arr2Item);
        }
        return interleaved;
    }, []);
}

function dominate (openDelem = '{{', closeDelem = '}}') {
    return node => {
        let re = bindFinder(openDelem, closeDelem),
            text = node.nodeValue,

            // splits string at delimiters.
            parts = text.split(re);

        //odd indicies: will always be data paths
        node[symbols.dataPaths] = parts.filter((part, i) => i % 2);

        //even indicies: will always be static values
        node[symbols.staticValues] = parts.filter((part, i) => !(i % 2));

        return node;
    };
}

var deepPath = (obj, path) => path.split(/[.\/]/)
        .reduce((currObj, nextProp) => Object(currObj)[nextProp], obj);

const symbols = {
    dataPaths: Symbol('dataPaths'),
    staticValues: Symbol('staticValues')
};

function DOMingo(root, {
    delimiters = ['{{', '}}']
} = {}) {

    const hasBindings = hasBindingsWithDelem(...delimiters),

    nodesWithBindings = [...root.childNodes]

        //collects flat list of all nodes
        .reduce(nodeReduce, [])

        //removes nodes that don't have bindings
        .filter(hasBindings)

        //adds symbol properties to nodes for quick rendering
        .map(dominate(...delimiters));

    //the render function.
    return function (data) {
        nodesWithBindings.map(node => {
            const currText = node.nodeValue,
                dataValues = node[symbols.dataPaths]
                    .map(dataPath => deepPath(data, dataPath))
                    .map(val => val == null ? '' : val),
                newText = interleave(node[symbols.staticValues], dataValues)
                    .join('');

            if (newText !== currText) {
                node.nodeValue = newText;
            }
        });
    };
}

export { symbols };export default DOMingo;