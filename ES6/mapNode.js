import makeEntry from './makeEntry';

export default function mapNode(map, node) {
    if (node.nodeType === 1) {
        return [].slice.call(node.childNodes)
                 .concat( [].slice.call(node.attributes) )
                 .reduce(mapNode, map);
    } else {
        let entry = makeEntry(node);
        if (entry !== null) { map.push(entry); }
        return map;
    }
}
