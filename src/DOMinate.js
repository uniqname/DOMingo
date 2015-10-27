import {symbols} from './DOMingo';
import bindFinder from './bindFinder';

export default function (openDelem = '{{', closeDelem = '}}') {
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
