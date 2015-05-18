import getOrMakeBoundNode from './getOrMakeBoundNode';

export default function mapAttrValueBindings(attr, shadowAttr, bindKey, map) {
    let boundNode = getOrMakeBoundNode(attr, shadowAttr, bindKey, map);
    boundNode.value = true;
    return map;
}
