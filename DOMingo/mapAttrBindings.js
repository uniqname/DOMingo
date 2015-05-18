import mapAttrValueBindings from './mapAttrValueBindings';
import bindingsInStr from './bindingsInStr';

export default function mapAttrBindings(node, shadowNode, map) {
    let attrs = node.attributes ? [...node.attributes] : [],
        shadowAttrs = shadowNode.attributes ? [...shadowNode.attributes] : [];
    return attrs.reduce( (map, attr, i) => {
        let shadowAttr = shadowAttrs[i],
            //the `name` property on an attributeNode are read only
            //TODO: Consider solving for this and reintroduce.
            // attrNameBindings = bindingsInStr(attr.name),
            attrValueBindings = bindingsInStr(attr.value);

        // map = attrNameBindings.reduce( (map, bindKey) => logAttrNameBinding(attr, shadowAttr, bindKey, map), map);
        map = attrValueBindings.reduce( (map, bindKey) => mapAttrValueBindings(attr, shadowAttr, bindKey, map), map);

        return map;
    }, map);
}
