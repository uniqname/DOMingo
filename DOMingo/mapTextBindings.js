import getOrMakeBoundNode from './getOrMakeBoundNode';

export default function mapTextBinding(node, shadowNode, bindKey, map) {
    let boundNode = getOrMakeBoundNode(node, shadowNode, bindKey, map);
    boundNode.textContent = true;
    return map;
}
