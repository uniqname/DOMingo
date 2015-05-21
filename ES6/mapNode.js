import makeEntry from './makeEntry';

export default function mapNode(map, node) {
    if (node.nodeType === 3 || node.nodeType === 8|| node.value) {
        let entry = makeEntry(node);
        if (entry !== null) { map.push(entry); }
        return map;
    } else {
        return [].slice.call(node.childNodes)
                 .concat( [].slice.call(node.attributes) )
                 .reduce(mapNode, map);
    }
}
