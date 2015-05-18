import getOrMakeBoundNode from './getOrMakeBoundNode';

export default function logAttrNameBindings(attr, shadowAttr, bindKey, map) {
    let boundNode = getOrMakeBoundNode(attr, shadowAttr, bindKey, map);
    boundNode.name = true;
    return map;
}
