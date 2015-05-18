export default function getOrMakeBoundNode(node, shadowNode, bindKey, map) {
    map[bindKey] = map[bindKey] || [];
    let boundNodes = map[bindKey],
        boundNode = boundNodes.filter( nodeObj => nodeObj.templateNode === node )[0];

    if (!boundNode) {
        boundNode = {
            templateNode: node,
            shadowNode: shadowNode
        };
        boundNodes.push(boundNode);
    }
    return boundNode;
}
