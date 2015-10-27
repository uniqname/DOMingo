export default function nodeReduce(nodes, node) {
    return [...(node.childNodes || [])]
        .reduce(nodeReduce, nodes)
        .concat([...(node.attributes || [])])
        .concat(node.nodeValue ? node : []);
}
