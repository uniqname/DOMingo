import mapTextBindings from './mapTextBindings';
import mapAttrBindings from './mapAttrBindings';
import bindingsInStr from './bindingsInStr';

export default function mapChildren(container, shadowContainer, map) {
    [...container.childNodes].reduce( (map, node, i) => {
        let shadowNode = shadowContainer.childNodes[i];
        if (node.nodeType === 3) {
            let textBindings = bindingsInStr(node.textContent);
            map = textBindings.reduce( (map, strBinding) => mapTextBindings(node, shadowNode, strBinding, map), map);
        } else {
            map = mapAttrBindings(node, shadowNode, map);
        }
        map = mapChildren(node, shadowNode, map);
        return map;
    }, map);
    return map;
}
