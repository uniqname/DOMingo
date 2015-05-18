(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var DOMingo = require('./DOMingo');
// import DOMingo from './DOMingo';
// import bindingsInStr from './bindingsInStr';
// import getOrMakeBoundNode from './getOrMakeBoundNode';
// import mapAttrBindings from './mapAttrBindings';
// import mapAttrNameBindings from './mapAttrNameBindings';
// import mapAttrValueBindings from './mapAttrValueBindings';
// import mapChildren from './mapChildren';
// import mapTextBindings from './mapTextBindings';

describe('DOMingo', function () {
    describe('#bindingsInStr', function () {
        it('should return an array of keys for all bindings in a string', function () {
            var str = 'I {{have}} {{ exactly }} {{three }} bindings!';
            assert.deepEqual(['have', 'exactly', 'three'], bindingsInStr(str));
        });
    });

    describe('#getOrMakeBoundNode', function () {
        var existingNode = Symbol('node'),
            newNode = Symbol('newNode'),
            map = {
            'have': [{
                templateNode: Symbol('templateNode'),
                shadowNode: Symbol('shadowNode')
            }],
            'exactly': [{
                templateNode: existingNode,
                shadowNode: Symbol('shadowNode')
            }],
            'three': [{
                templateNode: Symbol('templateNode'),
                shadowNode: Symbol('shadowNode')
            }]
        };

        it('should return the object that exists in the map', function () {
            assert.strictEqual(existingNode, getOrMakeBoundNode(existingNode, Symbol('shadowNode'), 'exactly', map));

            assert.equal(1, map.exactly.length);
        });

        it('should create a new object, add it to the map and return the object', function () {
            assert.strictEqual(newNode, getOrMakeBoundNode(newNode, Symbol('shadowNode'), 'exactly', map));

            assert.equal(2, map.exactly.length);
        });
    });
});

},{"./DOMingo":2}],2:[function(require,module,exports){
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

},{"./mapChildren":7}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./bindingsInStr":3,"./mapAttrValueBindings":6}],6:[function(require,module,exports){
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

},{"./getOrMakeBoundNode":4}],7:[function(require,module,exports){
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

},{"./bindingsInStr":3,"./mapAttrBindings":5,"./mapTextBindings":8}],8:[function(require,module,exports){
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

},{"./getOrMakeBoundNode":4}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvRE9NaW5nby9ET01pbmdvL0RPTWluZ28udGVzdC5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS9ET01pbmdvL0RPTWluZ28vRE9NaW5nby5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS9ET01pbmdvL0RPTWluZ28vYmluZGluZ3NJblN0ci5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS9ET01pbmdvL0RPTWluZ28vZ2V0T3JNYWtlQm91bmROb2RlLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL0RPTWluZ28vRE9NaW5nby9tYXBBdHRyQmluZGluZ3MuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvRE9NaW5nby9ET01pbmdvL21hcEF0dHJWYWx1ZUJpbmRpbmdzLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL0RPTWluZ28vRE9NaW5nby9tYXBDaGlsZHJlbi5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS9ET01pbmdvL0RPTWluZ28vbWFwVGV4dEJpbmRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7Ozs7Ozs7Ozs7QUFVbkMsUUFBUSxDQUFDLFNBQVMsRUFBRSxZQUFNO0FBQ3RCLFlBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFNO0FBQzdCLFVBQUUsQ0FBQyw2REFBNkQsRUFBRSxZQUFNO0FBQ3BFLGdCQUFJLEdBQUcsR0FBRywrQ0FBK0MsQ0FBQztBQUMxRCxrQkFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQUUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDdEUsQ0FBQyxDQUFDO0tBQ04sQ0FBQyxDQUFDOztBQUVI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QUMsQ0FBQztTQUM1RyxNQUFNO0FBQ0gsZUFBRyxHQUFHLGtDQUFnQixJQUFJLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ2hEO0FBQ0QsV0FBRyxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3pDLGVBQU8sR0FBRyxDQUFDO0tBQ2QsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNSLFdBQU8sR0FBRyxDQUFDO0NBQ2Q7Ozs7Ozs7Ozs7cUJDZnVCLGNBQWM7Ozs7a0NBRlAsc0JBQXNCOzs7O0FBRXRDLFNBQVMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRTtBQUNuRSxRQUFJLFNBQVMsR0FBRyxxQ0FBbUIsSUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbkUsYUFBUyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDN0IsV0FBTyxHQUFHLENBQUM7Q0FDZCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgRE9NaW5nbyA9IHJlcXVpcmUoJy4vRE9NaW5nbycpO1xuLy8gaW1wb3J0IERPTWluZ28gZnJvbSAnLi9ET01pbmdvJztcbi8vIGltcG9ydCBiaW5kaW5nc0luU3RyIGZyb20gJy4vYmluZGluZ3NJblN0cic7XG4vLyBpbXBvcnQgZ2V0T3JNYWtlQm91bmROb2RlIGZyb20gJy4vZ2V0T3JNYWtlQm91bmROb2RlJztcbi8vIGltcG9ydCBtYXBBdHRyQmluZGluZ3MgZnJvbSAnLi9tYXBBdHRyQmluZGluZ3MnO1xuLy8gaW1wb3J0IG1hcEF0dHJOYW1lQmluZGluZ3MgZnJvbSAnLi9tYXBBdHRyTmFtZUJpbmRpbmdzJztcbi8vIGltcG9ydCBtYXBBdHRyVmFsdWVCaW5kaW5ncyBmcm9tICcuL21hcEF0dHJWYWx1ZUJpbmRpbmdzJztcbi8vIGltcG9ydCBtYXBDaGlsZHJlbiBmcm9tICcuL21hcENoaWxkcmVuJztcbi8vIGltcG9ydCBtYXBUZXh0QmluZGluZ3MgZnJvbSAnLi9tYXBUZXh0QmluZGluZ3MnO1xuXG5kZXNjcmliZSgnRE9NaW5nbycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnI2JpbmRpbmdzSW5TdHInLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGFuIGFycmF5IG9mIGtleXMgZm9yIGFsbCBiaW5kaW5ncyBpbiBhIHN0cmluZycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdHIgPSAnSSB7e2hhdmV9fSB7eyBleGFjdGx5IH19IHt7dGhyZWUgfX0gYmluZGluZ3MhJztcbiAgICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoWydoYXZlJywgJ2V4YWN0bHknLCAndGhyZWUnXSwgYmluZGluZ3NJblN0cihzdHIpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnI2dldE9yTWFrZUJvdW5kTm9kZScsICgpID0+IHtcbiAgICAgICAgbGV0IGV4aXN0aW5nTm9kZSA9IFN5bWJvbCgnbm9kZScpLFxuICAgICAgICAgICAgbmV3Tm9kZSA9IFN5bWJvbCgnbmV3Tm9kZScpLFxuICAgICAgICAgICAgbWFwID0ge1xuICAgICAgICAgICAgICAgICdoYXZlJzogW3tcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVOb2RlOiBTeW1ib2woJ3RlbXBsYXRlTm9kZScpLFxuICAgICAgICAgICAgICAgICAgICBzaGFkb3dOb2RlOiBTeW1ib2woJ3NoYWRvd05vZGUnKVxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgICdleGFjdGx5JzogW3tcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVOb2RlOiBleGlzdGluZ05vZGUsXG4gICAgICAgICAgICAgICAgICAgIHNoYWRvd05vZGU6IFN5bWJvbCgnc2hhZG93Tm9kZScpXG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgJ3RocmVlJzogW3tcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVOb2RlOiBTeW1ib2woJ3RlbXBsYXRlTm9kZScpLFxuICAgICAgICAgICAgICAgICAgICBzaGFkb3dOb2RlOiBTeW1ib2woJ3NoYWRvd05vZGUnKVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBvYmplY3QgdGhhdCBleGlzdHMgaW4gdGhlIG1hcCcsICgpID0+IHtcbiAgICAgICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChleGlzdGluZ05vZGUsIGdldE9yTWFrZUJvdW5kTm9kZShleGlzdGluZ05vZGUsIFN5bWJvbCgnc2hhZG93Tm9kZScpLCAnZXhhY3RseScsIG1hcCkpO1xuXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoMSwgbWFwLmV4YWN0bHkubGVuZ3RoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBjcmVhdGUgYSBuZXcgb2JqZWN0LCBhZGQgaXQgdG8gdGhlIG1hcCBhbmQgcmV0dXJuIHRoZSBvYmplY3QnLCAoKSA9PiB7XG4gICAgICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwobmV3Tm9kZSwgZ2V0T3JNYWtlQm91bmROb2RlKG5ld05vZGUsIFN5bWJvbCgnc2hhZG93Tm9kZScpLCAnZXhhY3RseScsIG1hcCkpO1xuXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoMiwgbWFwLmV4YWN0bHkubGVuZ3RoKTtcblxuICAgICAgICB9KTtcbiAgICB9KTtcblxufSk7XG4iLCJpbXBvcnQgbWFwQ2hpbGRyZW4gZnJvbSAnLi9tYXBDaGlsZHJlbic7XG5cbmxldCBjb21waWxlID0gZnVuY3Rpb24gY29tcGlsZShmcmFnLCBzaGFkb3dSb290LCB7IG9wZW5EZWxpbT0ne3snLCBjbG9zZURlbGltPSd9fScgfSA9IHt9KSB7XG4gICAgbGV0IHNoYWRvdyA9IGZyYWcuY2xvbmVOb2RlKHRydWUpLFxuICAgICAgICBtYXAgPSBtYXBDaGlsZHJlbihmcmFnLCBzaGFkb3csIHt9KTtcblxuICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoc2hhZG93KTtcbiAgICAvL3RoZSByZW5kZXIgZnVuY3Rpb24uXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKG1hcCkuZm9yRWFjaCggYmluZGluZyA9PiB7XG4gICAgICAgICAgICBsZXQgZnVsbERlbGltID0gUmVnRXhwKG9wZW5EZWxpbSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdcXFxccyonICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZGluZyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdcXFxccyonICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VEZWxpbSksXG4gICAgICAgICAgICAgICAgdmFsID0gYmluZGluZy5zcGxpdCgvXFwufFxcLy9nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKCAodmFsLCBzZWdtZW50KSA9PiAodmFsICYmIHZhbFtzZWdtZW50XSkgfHwgJycsIGRhdGEpLFxuICAgICAgICAgICAgICAgIG5vZGVPYmpzID0gbWFwW2JpbmRpbmddO1xuXG4gICAgICAgICAgICBub2RlT2Jqcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlT2JqKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZU9iai50ZXh0Q29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dCA9IG5vZGVPYmoudGVtcGxhdGVOb2RlLnRleHRDb250ZW50LnNwbGl0KGZ1bGxEZWxpbSkuam9pbih2YWwpO1xuICAgICAgICAgICAgICAgICAgICBub2RlT2JqLnNoYWRvd05vZGUudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm9kZU9iai52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYXR0clZhbCA9IG5vZGVPYmoudGVtcGxhdGVOb2RlLnZhbHVlLnNwbGl0KGZ1bGxEZWxpbSkuam9pbih2YWwpO1xuICAgICAgICAgICAgICAgICAgICBub2RlT2JqLnNoYWRvd05vZGUudmFsdWUgPSBhdHRyVmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm9kZU9iai5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHRyTmFtZSA9IG5vZGVPYmoudGVtcGxhdGVOb2RlLm5hbWUuc3BsaXQoZnVsbERlbGltKS5qb2luKHZhbCk7XG4gICAgICAgICAgICAgICAgICAgIC8vU2lsZW50IGZhaWwuXG4gICAgICAgICAgICAgICAgICAgIG5vZGVPYmouc2hhZG93Tm9kZS5uYW1lID0gYXR0ck5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59O1xuXG53aW5kb3cuRE9NaW5nbyA9IGNvbXBpbGU7XG5leHBvcnQgZGVmYXVsdCBjb21waWxlO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYmluZGluZ3NJblN0cihzdHI9JycsIG9wZW5EZWxpbT0ne3snLCBjbG9zZURlbGltPSd9fScpIHtcbiAgICBsZXQgYmluZGluZ1JlID0gUmVnRXhwKG9wZW5EZWxpbSArICcoLio/KScgKyBjbG9zZURlbGltLCAnZycpLFxuICAgICAgICBtYXRjaGVzID0gc3RyLm1hdGNoKGJpbmRpbmdSZSkgfHwgW107XG4gICAgICAgIHJldHVybiBtYXRjaGVzLm1hcChtYXRjaCA9PiBtYXRjaC5yZXBsYWNlKG9wZW5EZWxpbSwgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKGNsb3NlRGVsaW0sICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE9yTWFrZUJvdW5kTm9kZShub2RlLCBzaGFkb3dOb2RlLCBiaW5kS2V5LCBtYXApIHtcbiAgICBtYXBbYmluZEtleV0gPSBtYXBbYmluZEtleV0gfHwgW107XG4gICAgbGV0IGJvdW5kTm9kZXMgPSBtYXBbYmluZEtleV0sXG4gICAgICAgIGJvdW5kTm9kZSA9IGJvdW5kTm9kZXMuZmlsdGVyKCBub2RlT2JqID0+IG5vZGVPYmoudGVtcGxhdGVOb2RlID09PSBub2RlIClbMF07XG5cbiAgICBpZiAoIWJvdW5kTm9kZSkge1xuICAgICAgICBib3VuZE5vZGUgPSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZU5vZGU6IG5vZGUsXG4gICAgICAgICAgICBzaGFkb3dOb2RlOiBzaGFkb3dOb2RlXG4gICAgICAgIH07XG4gICAgICAgIGJvdW5kTm9kZXMucHVzaChib3VuZE5vZGUpO1xuICAgIH1cbiAgICByZXR1cm4gYm91bmROb2RlO1xufVxuIiwiaW1wb3J0IG1hcEF0dHJWYWx1ZUJpbmRpbmdzIGZyb20gJy4vbWFwQXR0clZhbHVlQmluZGluZ3MnO1xuaW1wb3J0IGJpbmRpbmdzSW5TdHIgZnJvbSAnLi9iaW5kaW5nc0luU3RyJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFwQXR0ckJpbmRpbmdzKG5vZGUsIHNoYWRvd05vZGUsIG1hcCkge1xuICAgIGxldCBhdHRycyA9IG5vZGUuYXR0cmlidXRlcyA/IFsuLi5ub2RlLmF0dHJpYnV0ZXNdIDogW10sXG4gICAgICAgIHNoYWRvd0F0dHJzID0gc2hhZG93Tm9kZS5hdHRyaWJ1dGVzID8gWy4uLnNoYWRvd05vZGUuYXR0cmlidXRlc10gOiBbXTtcbiAgICByZXR1cm4gYXR0cnMucmVkdWNlKCAobWFwLCBhdHRyLCBpKSA9PiB7XG4gICAgICAgIGxldCBzaGFkb3dBdHRyID0gc2hhZG93QXR0cnNbaV0sXG4gICAgICAgICAgICAvL3RoZSBgbmFtZWAgcHJvcGVydHkgb24gYW4gYXR0cmlidXRlTm9kZSBhcmUgcmVhZCBvbmx5XG4gICAgICAgICAgICAvL1RPRE86IENvbnNpZGVyIHNvbHZpbmcgZm9yIHRoaXMgYW5kIHJlaW50cm9kdWNlLlxuICAgICAgICAgICAgLy8gYXR0ck5hbWVCaW5kaW5ncyA9IGJpbmRpbmdzSW5TdHIoYXR0ci5uYW1lKSxcbiAgICAgICAgICAgIGF0dHJWYWx1ZUJpbmRpbmdzID0gYmluZGluZ3NJblN0cihhdHRyLnZhbHVlKTtcblxuICAgICAgICAvLyBtYXAgPSBhdHRyTmFtZUJpbmRpbmdzLnJlZHVjZSggKG1hcCwgYmluZEtleSkgPT4gbG9nQXR0ck5hbWVCaW5kaW5nKGF0dHIsIHNoYWRvd0F0dHIsIGJpbmRLZXksIG1hcCksIG1hcCk7XG4gICAgICAgIG1hcCA9IGF0dHJWYWx1ZUJpbmRpbmdzLnJlZHVjZSggKG1hcCwgYmluZEtleSkgPT4gbWFwQXR0clZhbHVlQmluZGluZ3MoYXR0ciwgc2hhZG93QXR0ciwgYmluZEtleSwgbWFwKSwgbWFwKTtcblxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH0sIG1hcCk7XG59XG4iLCJpbXBvcnQgZ2V0T3JNYWtlQm91bmROb2RlIGZyb20gJy4vZ2V0T3JNYWtlQm91bmROb2RlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFwQXR0clZhbHVlQmluZGluZ3MoYXR0ciwgc2hhZG93QXR0ciwgYmluZEtleSwgbWFwKSB7XG4gICAgbGV0IGJvdW5kTm9kZSA9IGdldE9yTWFrZUJvdW5kTm9kZShhdHRyLCBzaGFkb3dBdHRyLCBiaW5kS2V5LCBtYXApO1xuICAgIGJvdW5kTm9kZS52YWx1ZSA9IHRydWU7XG4gICAgcmV0dXJuIG1hcDtcbn1cbiIsImltcG9ydCBtYXBUZXh0QmluZGluZ3MgZnJvbSAnLi9tYXBUZXh0QmluZGluZ3MnO1xuaW1wb3J0IG1hcEF0dHJCaW5kaW5ncyBmcm9tICcuL21hcEF0dHJCaW5kaW5ncyc7XG5pbXBvcnQgYmluZGluZ3NJblN0ciBmcm9tICcuL2JpbmRpbmdzSW5TdHInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXBDaGlsZHJlbihjb250YWluZXIsIHNoYWRvd0NvbnRhaW5lciwgbWFwKSB7XG4gICAgWy4uLmNvbnRhaW5lci5jaGlsZE5vZGVzXS5yZWR1Y2UoIChtYXAsIG5vZGUsIGkpID0+IHtcbiAgICAgICAgbGV0IHNoYWRvd05vZGUgPSBzaGFkb3dDb250YWluZXIuY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgIGxldCB0ZXh0QmluZGluZ3MgPSBiaW5kaW5nc0luU3RyKG5vZGUudGV4dENvbnRlbnQpO1xuICAgICAgICAgICAgbWFwID0gdGV4dEJpbmRpbmdzLnJlZHVjZSggKG1hcCwgc3RyQmluZGluZykgPT4gbWFwVGV4dEJpbmRpbmdzKG5vZGUsIHNoYWRvd05vZGUsIHN0ckJpbmRpbmcsIG1hcCksIG1hcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYXAgPSBtYXBBdHRyQmluZGluZ3Mobm9kZSwgc2hhZG93Tm9kZSwgbWFwKTtcbiAgICAgICAgfVxuICAgICAgICBtYXAgPSBtYXBDaGlsZHJlbihub2RlLCBzaGFkb3dOb2RlLCBtYXApO1xuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH0sIG1hcCk7XG4gICAgcmV0dXJuIG1hcDtcbn1cbiIsImltcG9ydCBnZXRPck1ha2VCb3VuZE5vZGUgZnJvbSAnLi9nZXRPck1ha2VCb3VuZE5vZGUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXBUZXh0QmluZGluZyhub2RlLCBzaGFkb3dOb2RlLCBiaW5kS2V5LCBtYXApIHtcbiAgICBsZXQgYm91bmROb2RlID0gZ2V0T3JNYWtlQm91bmROb2RlKG5vZGUsIHNoYWRvd05vZGUsIGJpbmRLZXksIG1hcCk7XG4gICAgYm91bmROb2RlLnRleHRDb250ZW50ID0gdHJ1ZTtcbiAgICByZXR1cm4gbWFwO1xufVxuIl19
