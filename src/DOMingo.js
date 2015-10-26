import nodeReduce from './nodeReduce';
import hasBindingsWithDelem from './hasBindings';
import interleave from './interleave';
import dominate from './DOMinate';
import deepPath from './deepPath';

export const symbols = {
    dataPaths: Symbol('dataPaths'),
    staticValues: Symbol('staticValues')
};

export default function DOMingo(root, {
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
                    .map(val => val || ''),
                newText = interleave(node[symbols.staticValues], dataValues)
                    .join('');

            if (newText !== currText) {
                node.nodeValue = newText;
            }
        });
    };
}
