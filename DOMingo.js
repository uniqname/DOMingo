(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mapChildren = require('./mapChildren');

var _mapChildren2 = _interopRequireDefault(_mapChildren);

var compile = function compile(frag, shadowRoot) {
    var _ref = arguments[2] === undefined ? {} : arguments[2];

    var _ref$openDelim = _ref.openDelim;
    var openDelim = _ref$openDelim === undefined ? '{{' : _ref$openDelim;
    var _ref$closeDelim = _ref.closeDelim;
    var closeDelim = _ref$closeDelim === undefined ? '}}' : _ref$closeDelim;

    var shadow = frag.cloneNode(true),
        map = (0, _mapChildren2['default'])(frag, shadow, {});

    shadowRoot.appendChild(shadow);
    //the render function.
    return function (data) {
        Object.keys(map).forEach(function (binding) {
            var fullDelim = RegExp(openDelim + '\\s*' + binding + '\\s*' + closeDelim),
                val = binding.split(/\.|\//g).reduce(function (val, segment) {
                return val && val[segment] || '';
            }, data),
                nodeObjs = map[binding];

            nodeObjs.forEach(function (nodeObj) {

                if (nodeObj.textContent) {
                    var text = nodeObj.templateNode.textContent.split(fullDelim).join(val);
                    nodeObj.shadowNode.textContent = text;
                }
                if (nodeObj.value) {
                    var attrVal = nodeObj.templateNode.value.split(fullDelim).join(val);
                    nodeObj.shadowNode.value = attrVal;
                }
                if (nodeObj.name) {
                    var attrName = nodeObj.templateNode.name.split(fullDelim).join(val);
                    //Silent fail.
                    nodeObj.shadowNode.name = attrName;
                }
            });
        });
    };
};

window.DOMingo = compile;
exports['default'] = compile;
module.exports = exports['default'];

},{"./mapChildren":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = bindingsInStr;

function bindingsInStr() {
    var str = arguments[0] === undefined ? '' : arguments[0];
    var openDelim = arguments[1] === undefined ? '{{' : arguments[1];
    var closeDelim = arguments[2] === undefined ? '}}' : arguments[2];

    var bindingRe = RegExp(openDelim + '(.*?)' + closeDelim, 'g'),
        matches = str.match(bindingRe) || [];
    return matches.map(function (match) {
        return match.replace(openDelim, '').replace(closeDelim, '').trim();
    });
}

module.exports = exports['default'];

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = getOrMakeBoundNode;

function getOrMakeBoundNode(node, shadowNode, bindKey, map) {
    map[bindKey] = map[bindKey] || [];
    var boundNodes = map[bindKey],
        boundNode = boundNodes.filter(function (nodeObj) {
        return nodeObj.templateNode === node;
    })[0];

    if (!boundNode) {
        boundNode = {
            templateNode: node,
            shadowNode: shadowNode
        };
        boundNodes.push(boundNode);
    }
    return boundNode;
}

module.exports = exports["default"];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = mapAttrBindings;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _mapAttrValueBindings = require('./mapAttrValueBindings');

var _mapAttrValueBindings2 = _interopRequireDefault(_mapAttrValueBindings);

var _bindingsInStr = require('./bindingsInStr');

var _bindingsInStr2 = _interopRequireDefault(_bindingsInStr);

function mapAttrBindings(node, shadowNode, map) {
    var attrs = node.attributes ? [].concat(_toConsumableArray(node.attributes)) : [],
        shadowAttrs = shadowNode.attributes ? [].concat(_toConsumableArray(shadowNode.attributes)) : [];
    return attrs.reduce(function (map, attr, i) {
        var shadowAttr = shadowAttrs[i],

        //the `name` property on an attributeNode are read only
        //TODO: Consider solving for this and reintroduce.
        // attrNameBindings = bindingsInStr(attr.name),
        attrValueBindings = (0, _bindingsInStr2['default'])(attr.value);

        // map = attrNameBindings.reduce( (map, bindKey) => logAttrNameBinding(attr, shadowAttr, bindKey, map), map);
        map = attrValueBindings.reduce(function (map, bindKey) {
            return (0, _mapAttrValueBindings2['default'])(attr, shadowAttr, bindKey, map);
        }, map);

        return map;
    }, map);
}

module.exports = exports['default'];

},{"./bindingsInStr":2,"./mapAttrValueBindings":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = mapAttrValueBindings;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _getOrMakeBoundNode = require('./getOrMakeBoundNode');

var _getOrMakeBoundNode2 = _interopRequireDefault(_getOrMakeBoundNode);

function mapAttrValueBindings(attr, shadowAttr, bindKey, map) {
    var boundNode = (0, _getOrMakeBoundNode2['default'])(attr, shadowAttr, bindKey, map);
    boundNode.value = true;
    return map;
}

module.exports = exports['default'];

},{"./getOrMakeBoundNode":3}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = mapChildren;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _mapTextBindings = require('./mapTextBindings');

var _mapTextBindings2 = _interopRequireDefault(_mapTextBindings);

var _mapAttrBindings = require('./mapAttrBindings');

var _mapAttrBindings2 = _interopRequireDefault(_mapAttrBindings);

var _bindingsInStr = require('./bindingsInStr');

var _bindingsInStr2 = _interopRequireDefault(_bindingsInStr);

function mapChildren(container, shadowContainer, map) {
    [].concat(_toConsumableArray(container.childNodes)).reduce(function (map, node, i) {
        var shadowNode = shadowContainer.childNodes[i];
        if (node.nodeType === 3) {
            var textBindings = (0, _bindingsInStr2['default'])(node.textContent);
            map = textBindings.reduce(function (map, strBinding) {
                return (0, _mapTextBindings2['default'])(node, shadowNode, strBinding, map);
            }, map);
        } else {
            map = (0, _mapAttrBindings2['default'])(node, shadowNode, map);
        }
        map = mapChildren(node, shadowNode, map);
        return map;
    }, map);
    return map;
}

module.exports = exports['default'];

},{"./bindingsInStr":2,"./mapAttrBindings":4,"./mapTextBindings":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = mapTextBinding;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _getOrMakeBoundNode = require('./getOrMakeBoundNode');

var _getOrMakeBoundNode2 = _interopRequireDefault(_getOrMakeBoundNode);

function mapTextBinding(node, shadowNode, bindKey, map) {
    var boundNode = (0, _getOrMakeBoundNode2['default'])(node, shadowNode, bindKey, map);
    boundNode.textContent = true;
    return map;
}

module.exports = exports['default'];

},{"./getOrMakeBoundNode":3}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvRE9NaW5nby9ET01pbmdvL0RPTWluZ28uanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvRE9NaW5nby9ET01pbmdvL2JpbmRpbmdzSW5TdHIuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvRE9NaW5nby9ET01pbmdvL2dldE9yTWFrZUJvdW5kTm9kZS5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS9ET01pbmdvL0RPTWluZ28vbWFwQXR0ckJpbmRpbmdzLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL0RPTWluZ28vRE9NaW5nby9tYXBBdHRyVmFsdWVCaW5kaW5ncy5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS9ET01pbmdvL0RPTWluZ28vbWFwQ2hpbGRyZW4uanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvRE9NaW5nby9ET01pbmdvL21hcFRleHRCaW5kaW5ncy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OzJCQ0F3QixlQUFlOzs7O0FBRXZDLElBQUksT0FBTyxHQUFHLFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQTRDOzRDQUFKLEVBQUU7OzhCQUF0QyxTQUFTO1FBQVQsU0FBUyxrQ0FBQyxJQUFJOytCQUFFLFVBQVU7UUFBVixVQUFVLG1DQUFDLElBQUk7O0FBQzlFLFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQzdCLEdBQUcsR0FBRyw4QkFBWSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUV4QyxjQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUUvQixXQUFPLFVBQVUsSUFBSSxFQUFFO0FBQ25CLGNBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMs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LElBQUksQ0FBQztBQUM3QixXQUFPLEdBQUcsQ0FBQztDQUNkIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBtYXBDaGlsZHJlbiBmcm9tICcuL21hcENoaWxkcmVuJztcblxubGV0IGNvbXBpbGUgPSBmdW5jdGlvbiBjb21waWxlKGZyYWcsIHNoYWRvd1Jvb3QsIHsgb3BlbkRlbGltPSd7eycsIGNsb3NlRGVsaW09J319JyB9ID0ge30pIHtcbiAgICBsZXQgc2hhZG93ID0gZnJhZy5jbG9uZU5vZGUodHJ1ZSksXG4gICAgICAgIG1hcCA9IG1hcENoaWxkcmVuKGZyYWcsIHNoYWRvdywge30pO1xuXG4gICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChzaGFkb3cpO1xuICAgIC8vdGhlIHJlbmRlciBmdW5jdGlvbi5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgT2JqZWN0LmtleXMobWFwKS5mb3JFYWNoKCBiaW5kaW5nID0+IHtcbiAgICAgICAgICAgIGxldCBmdWxsRGVsaW0gPSBSZWdFeHAob3BlbkRlbGltICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1xcXFxzKicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kaW5nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1xcXFxzKicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZURlbGltKSxcbiAgICAgICAgICAgICAgICB2YWwgPSBiaW5kaW5nLnNwbGl0KC9cXC58XFwvL2cpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoICh2YWwsIHNlZ21lbnQpID0+ICh2YWwgJiYgdmFsW3NlZ21lbnRdKSB8fCAnJywgZGF0YSksXG4gICAgICAgICAgICAgICAgbm9kZU9ianMgPSBtYXBbYmluZGluZ107XG5cbiAgICAgICAgICAgIG5vZGVPYmpzLmZvckVhY2goZnVuY3Rpb24gKG5vZGVPYmopIHtcblxuICAgICAgICAgICAgICAgIGlmIChub2RlT2JqLnRleHRDb250ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0ID0gbm9kZU9iai50ZW1wbGF0ZU5vZGUudGV4dENvbnRlbnQuc3BsaXQoZnVsbERlbGltKS5qb2luKHZhbCk7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVPYmouc2hhZG93Tm9kZS50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub2RlT2JqLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHRyVmFsID0gbm9kZU9iai50ZW1wbGF0ZU5vZGUudmFsdWUuc3BsaXQoZnVsbERlbGltKS5qb2luKHZhbCk7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVPYmouc2hhZG93Tm9kZS52YWx1ZSA9IGF0dHJWYWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub2RlT2JqLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJOYW1lID0gbm9kZU9iai50ZW1wbGF0ZU5vZGUubmFtZS5zcGxpdChmdWxsRGVsaW0pLmpvaW4odmFsKTtcbiAgICAgICAgICAgICAgICAgICAgLy9TaWxlbnQgZmFpbC5cbiAgICAgICAgICAgICAgICAgICAgbm9kZU9iai5zaGFkb3dOb2RlLm5hbWUgPSBhdHRyTmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn07XG5cbndpbmRvdy5ET01pbmdvID0gY29tcGlsZTtcbmV4cG9ydCBkZWZhdWx0IGNvbXBpbGU7XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBiaW5kaW5nc0luU3RyKHN0cj0nJywgb3BlbkRlbGltPSd7eycsIGNsb3NlRGVsaW09J319Jykge1xuICAgIGxldCBiaW5kaW5nUmUgPSBSZWdFeHAob3BlbkRlbGltICsgJyguKj8pJyArIGNsb3NlRGVsaW0sICdnJyksXG4gICAgICAgIG1hdGNoZXMgPSBzdHIubWF0Y2goYmluZGluZ1JlKSB8fCBbXTtcbiAgICAgICAgcmV0dXJuIG1hdGNoZXMubWFwKG1hdGNoID0+IG1hdGNoLnJlcGxhY2Uob3BlbkRlbGltLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoY2xvc2VEZWxpbSwgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKCkpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0T3JNYWtlQm91bmROb2RlKG5vZGUsIHNoYWRvd05vZGUsIGJpbmRLZXksIG1hcCkge1xuICAgIG1hcFtiaW5kS2V5XSA9IG1hcFtiaW5kS2V5XSB8fCBbXTtcbiAgICBsZXQgYm91bmROb2RlcyA9IG1hcFtiaW5kS2V5XSxcbiAgICAgICAgYm91bmROb2RlID0gYm91bmROb2Rlcy5maWx0ZXIoIG5vZGVPYmogPT4gbm9kZU9iai50ZW1wbGF0ZU5vZGUgPT09IG5vZGUgKVswXTtcblxuICAgIGlmICghYm91bmROb2RlKSB7XG4gICAgICAgIGJvdW5kTm9kZSA9IHtcbiAgICAgICAgICAgIHRlbXBsYXRlTm9kZTogbm9kZSxcbiAgICAgICAgICAgIHNoYWRvd05vZGU6IHNoYWRvd05vZGVcbiAgICAgICAgfTtcbiAgICAgICAgYm91bmROb2Rlcy5wdXNoKGJvdW5kTm9kZSk7XG4gICAgfVxuICAgIHJldHVybiBib3VuZE5vZGU7XG59XG4iLCJpbXBvcnQgbWFwQXR0clZhbHVlQmluZGluZ3MgZnJvbSAnLi9tYXBBdHRyVmFsdWVCaW5kaW5ncyc7XG5pbXBvcnQgYmluZGluZ3NJblN0ciBmcm9tICcuL2JpbmRpbmdzSW5TdHInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXBBdHRyQmluZGluZ3Mobm9kZSwgc2hhZG93Tm9kZSwgbWFwKSB7XG4gICAgbGV0IGF0dHJzID0gbm9kZS5hdHRyaWJ1dGVzID8gWy4uLm5vZGUuYXR0cmlidXRlc10gOiBbXSxcbiAgICAgICAgc2hhZG93QXR0cnMgPSBzaGFkb3dOb2RlLmF0dHJpYnV0ZXMgPyBbLi4uc2hhZG93Tm9kZS5hdHRyaWJ1dGVzXSA6IFtdO1xuICAgIHJldHVybiBhdHRycy5yZWR1Y2UoIChtYXAsIGF0dHIsIGkpID0+IHtcbiAgICAgICAgbGV0IHNoYWRvd0F0dHIgPSBzaGFkb3dBdHRyc1tpXSxcbiAgICAgICAgICAgIC8vdGhlIGBuYW1lYCBwcm9wZXJ0eSBvbiBhbiBhdHRyaWJ1dGVOb2RlIGFyZSByZWFkIG9ubHlcbiAgICAgICAgICAgIC8vVE9ETzogQ29uc2lkZXIgc29sdmluZyBmb3IgdGhpcyBhbmQgcmVpbnRyb2R1Y2UuXG4gICAgICAgICAgICAvLyBhdHRyTmFtZUJpbmRpbmdzID0gYmluZGluZ3NJblN0cihhdHRyLm5hbWUpLFxuICAgICAgICAgICAgYXR0clZhbHVlQmluZGluZ3MgPSBiaW5kaW5nc0luU3RyKGF0dHIudmFsdWUpO1xuXG4gICAgICAgIC8vIG1hcCA9IGF0dHJOYW1lQmluZGluZ3MucmVkdWNlKCAobWFwLCBiaW5kS2V5KSA9PiBsb2dBdHRyTmFtZUJpbmRpbmcoYXR0ciwgc2hhZG93QXR0ciwgYmluZEtleSwgbWFwKSwgbWFwKTtcbiAgICAgICAgbWFwID0gYXR0clZhbHVlQmluZGluZ3MucmVkdWNlKCAobWFwLCBiaW5kS2V5KSA9PiBtYXBBdHRyVmFsdWVCaW5kaW5ncyhhdHRyLCBzaGFkb3dBdHRyLCBiaW5kS2V5LCBtYXApLCBtYXApO1xuXG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgfSwgbWFwKTtcbn1cbiIsImltcG9ydCBnZXRPck1ha2VCb3VuZE5vZGUgZnJvbSAnLi9nZXRPck1ha2VCb3VuZE5vZGUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXBBdHRyVmFsdWVCaW5kaW5ncyhhdHRyLCBzaGFkb3dBdHRyLCBiaW5kS2V5LCBtYXApIHtcbiAgICBsZXQgYm91bmROb2RlID0gZ2V0T3JNYWtlQm91bmROb2RlKGF0dHIsIHNoYWRvd0F0dHIsIGJpbmRLZXksIG1hcCk7XG4gICAgYm91bmROb2RlLnZhbHVlID0gdHJ1ZTtcbiAgICByZXR1cm4gbWFwO1xufVxuIiwiaW1wb3J0IG1hcFRleHRCaW5kaW5ncyBmcm9tICcuL21hcFRleHRCaW5kaW5ncyc7XG5pbXBvcnQgbWFwQXR0ckJpbmRpbmdzIGZyb20gJy4vbWFwQXR0ckJpbmRpbmdzJztcbmltcG9ydCBiaW5kaW5nc0luU3RyIGZyb20gJy4vYmluZGluZ3NJblN0cic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1hcENoaWxkcmVuKGNvbnRhaW5lciwgc2hhZG93Q29udGFpbmVyLCBtYXApIHtcbiAgICBbLi4uY29udGFpbmVyLmNoaWxkTm9kZXNdLnJlZHVjZSggKG1hcCwgbm9kZSwgaSkgPT4ge1xuICAgICAgICBsZXQgc2hhZG93Tm9kZSA9IHNoYWRvd0NvbnRhaW5lci5jaGlsZE5vZGVzW2ldO1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgbGV0IHRleHRCaW5kaW5ncyA9IGJpbmRpbmdzSW5TdHIobm9kZS50ZXh0Q29udGVudCk7XG4gICAgICAgICAgICBtYXAgPSB0ZXh0QmluZGluZ3MucmVkdWNlKCAobWFwLCBzdHJCaW5kaW5nKSA9PiBtYXBUZXh0QmluZGluZ3Mobm9kZSwgc2hhZG93Tm9kZSwgc3RyQmluZGluZywgbWFwKSwgbWFwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hcCA9IG1hcEF0dHJCaW5kaW5ncyhub2RlLCBzaGFkb3dOb2RlLCBtYXApO1xuICAgICAgICB9XG4gICAgICAgIG1hcCA9IG1hcENoaWxkcmVuKG5vZGUsIHNoYWRvd05vZGUsIG1hcCk7XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgfSwgbWFwKTtcbiAgICByZXR1cm4gbWFwO1xufVxuIiwiaW1wb3J0IGdldE9yTWFrZUJvdW5kTm9kZSBmcm9tICcuL2dldE9yTWFrZUJvdW5kTm9kZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1hcFRleHRCaW5kaW5nKG5vZGUsIHNoYWRvd05vZGUsIGJpbmRLZXksIG1hcCkge1xuICAgIGxldCBib3VuZE5vZGUgPSBnZXRPck1ha2VCb3VuZE5vZGUobm9kZSwgc2hhZG93Tm9kZSwgYmluZEtleSwgbWFwKTtcbiAgICBib3VuZE5vZGUudGV4dENvbnRlbnQgPSB0cnVlO1xuICAgIHJldHVybiBtYXA7XG59XG4iXX0=
