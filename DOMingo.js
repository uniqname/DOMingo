(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = DOMingo;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _mapNode = require('./mapNode');

var _mapNode2 = _interopRequireDefault(_mapNode);

var _interleave = require('./interleave');

var _interleave2 = _interopRequireDefault(_interleave);

function DOMingo(frag, shadowRoot) {
    var shadow = frag.cloneNode(true),
        map = [].concat(_toConsumableArray(shadow.childNodes)).reduce(_mapNode2['default'], []);

    shadowRoot.appendChild(shadow);

    //the render function.
    return function (data) {
        map = map.map(function (bindObj) {
            bindObj.currentValues = bindObj.dataPaths.map(function (path, i) {
                var val = path.split(/\.|\//g).reduce(function (val, segment) {
                    return val && val[segment] || '';
                }, data);

                return val !== undefined ? val : bindObj.currentValues[i];
            });
            var propVal = (0, _interleave2['default'])(bindObj.staticParts, bindObj.currentValues).join('');

            var prop = bindObj.node.value !== undefined ? 'value' : 'textContent';
            bindObj.node[prop] = propVal;

            return bindObj;
        });

        return shadow;
    };
}

window.DOMingo = DOMingo;
module.exports = exports['default'];

},{"./interleave":3,"./mapNode":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = bindingsInStr;

function bindingsInStr() {
    var str = arguments[0] === undefined ? '' : arguments[0];

    var _ref = arguments[1] === undefined ? {} : arguments[1];

    var _ref$openDelim = _ref.openDelim;
    var openDelim = _ref$openDelim === undefined ? '{{' : _ref$openDelim;
    var _ref$closeDelim = _ref.closeDelim;
    var closeDelim = _ref$closeDelim === undefined ? '}}' : _ref$closeDelim;

    var bindPattern = new RegExp('' + openDelim + '([^' + closeDelim + ']*)' + closeDelim, 'g'),
        matches = str.match(bindPattern) || [],
        findLabel = RegExp(bindPattern.source);
    return matches.map(function (match) {
        return match.match(findLabel)[1].trim();
    });
}

module.exports = exports['default'];

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports["default"] = function (arr1, arr2) {
    return arr1.reduce(function (interleaved, item, i) {
        var arr2Item = arr2[i];
        interleaved.push(item);
        // console.log(interleaved);
        if (arr2Item !== undefined) {
            interleaved.push(arr2Item);
            // console.log(interleaved);
        }
        return interleaved;
    }, []);
};

module.exports = exports["default"];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = makeEntry;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bindingsInStr = require('./bindingsInStr');

var _bindingsInStr2 = _interopRequireDefault(_bindingsInStr);

function makeEntry(node) {
    var _ref = arguments[1] === undefined ? {} : arguments[1];

    var _ref$openDelim = _ref.openDelim;
    var openDelim = _ref$openDelim === undefined ? '{{' : _ref$openDelim;
    var _ref$closeDelim = _ref.closeDelim;
    var closeDelim = _ref$closeDelim === undefined ? '}}' : _ref$closeDelim;

    var bindPattern = new RegExp('' + openDelim + '[^' + closeDelim + ']*' + closeDelim, 'g'),
        prop = node.value ? 'value' : 'textContent',
        bindings = (0, _bindingsInStr2['default'])(node[prop], { openDelim: openDelim, closeDelim: closeDelim }),
        staticParts = node[prop].split(bindPattern);
    if (bindings.length) {
        return {
            node: node,
            staticParts: staticParts,
            dataPaths: bindings,
            currentValues: bindings.map(function (binding) {
                return '';
            })
        };
    } else {
        return null;
    }
}

/*
{
    node: <renderTargetNode>,
    staticParts: [String],
    dataPaths: [String],
    currentValues: [String]
}
*/

module.exports = exports['default'];

},{"./bindingsInStr":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = mapNode;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _makeEntry = require('./makeEntry');

var _makeEntry2 = _interopRequireDefault(_makeEntry);

function mapNode(map, node) {
    if (node.nodeType === 1) {
        return [].slice.call(node.childNodes).concat([].slice.call(node.attributes)).reduce(mapNode, map);
    } else {
        var entry = (0, _makeEntry2['default'])(node);
        if (entry !== null) {
            map.push(entry);
        }
        return map;
    }
}

module.exports = exports['default'];

},{"./makeEntry":4}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvRE9NaW5nby9FUzYvRE9NaW5nby5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS9ET01pbmdvL0VTNi9iaW5kaW5nc0luU3RyLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL0RPTWluZ28vRVM2L2ludGVybGVhdmUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvRE9NaW5nby9FUzYvbWFrZUVudHJ5LmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL0RPTWluZ28vRVM2L21hcE5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztxQkNHd0IsT0FBTzs7Ozs7O3VCQUhYLFdBQVc7Ozs7MEJBQ1IsY0FBYzs7OztBQUV0QixTQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO0FBQzlDLFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQzdCLEdBQUcsR0FBRyw2QkFBSSxNQUFNLENBQUMsVUFBVSxHQUFFLE1BQU0sdUJBQVUsRUFBRSxDQUFDLENBQUM7O0FBRXJELGNBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7OztBQUcvQixXQUFPLFVBQVUsSUFBSSxFQUFFO0FBQ25CLFdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFFLFVBQUMsT0FBTyxFQUFLO0FBQ3hCLG1CQUFPLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFFLFVBQUMsSUFBSSxFQUFFLENBQUMsRUFBSztBQUN4RCxvQkFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FDZixNQUFNLENBQUUsVUFBQyxHQUFHLEVBQUUsT0FBTzsyQkFBSyxBQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxD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LFFBQVE7QUFDbkIseUJBQWEsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsT0FBTzt1QkFBSSxFQUFFO2FBQUEsQ0FBQztTQUM3QyxDQUFDO0tBQ0wsTUFBTTtBQUNILGVBQU8sSUFBSSxDQUFDO0tBQ2Y7Q0FDSjs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7cUJDZnVCLE9BQU87Ozs7eUJBRlQsYUFBYTs7OztBQUVwQixTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQ3ZDLFFBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxDQUFDLEVBQUU7QUFDckIsZUFBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQzNCLE1BQU0sQ0FBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUUsQ0FDeEMsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztLQUNsQyxNQUFNO0FBQ0gsWUFBSSxLQUFLLEdBQUcsNEJBQVUsSUFBSSxDQUFDLENBQUM7QUFDNUIsWUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQUUsZUFBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUFFO0FBQ3hDLGVBQU8sR0FBRyxDQUFDO0tBQ2Q7Q0FDSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgbWFwTm9kZSBmcm9tICcuL21hcE5vZGUnO1xuaW1wb3J0IGludGVybGVhdmUgZnJvbSAnLi9pbnRlcmxlYXZlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRE9NaW5nbyhmcmFnLCBzaGFkb3dSb290KSB7XG4gICAgbGV0IHNoYWRvdyA9IGZyYWcuY2xvbmVOb2RlKHRydWUpLFxuICAgICAgICBtYXAgPSBbLi4uc2hhZG93LmNoaWxkTm9kZXNdLnJlZHVjZShtYXBOb2RlLCBbXSk7XG5cbiAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKHNoYWRvdyk7XG5cbiAgICAvL3RoZSByZW5kZXIgZnVuY3Rpb24uXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIG1hcCA9IG1hcC5tYXAoIChiaW5kT2JqKSA9PiB7XG4gICAgICAgICAgICBiaW5kT2JqLmN1cnJlbnRWYWx1ZXMgPSBiaW5kT2JqLmRhdGFQYXRocy5tYXAoIChwYXRoLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbCA9IHBhdGguc3BsaXQoL1xcLnxcXC8vZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoICh2YWwsIHNlZ21lbnQpID0+ICh2YWwgJiYgdmFsW3NlZ21lbnRdKSB8fCAnJywgZGF0YSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsICE9PSB1bmRlZmluZWQgPyB2YWwgOiBiaW5kT2JqLmN1cnJlbnRWYWx1ZXNbaV07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGxldCBwcm9wVmFsID0gaW50ZXJsZWF2ZShiaW5kT2JqLnN0YXRpY1BhcnRzLCBiaW5kT2JqLmN1cnJlbnRWYWx1ZXMpLmpvaW4oJycpO1xuXG4gICAgICAgICAgICBsZXQgcHJvcCA9IGJpbmRPYmoubm9kZS52YWx1ZSAhPT0gdW5kZWZpbmVkID8gJ3ZhbHVlJyA6ICd0ZXh0Q29udGVudCc7XG4gICAgICAgICAgICBiaW5kT2JqLm5vZGVbcHJvcF0gPSBwcm9wVmFsO1xuXG4gICAgICAgICAgICByZXR1cm4gYmluZE9iajtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHNoYWRvdztcbiAgICB9O1xufVxuXG53aW5kb3cuRE9NaW5nbyA9IERPTWluZ287XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBiaW5kaW5nc0luU3RyKHN0cj0nJywge29wZW5EZWxpbT0ne3snLCBjbG9zZURlbGltPSd9fSd9ID0ge30pIHtcbiAgICBsZXQgYmluZFBhdHRlcm4gPSBuZXcgUmVnRXhwKGAke29wZW5EZWxpbX0oW14ke2Nsb3NlRGVsaW19XSopJHtjbG9zZURlbGltfWAsICdnJyksXG4gICAgICAgIG1hdGNoZXMgPSBzdHIubWF0Y2goYmluZFBhdHRlcm4pIHx8IFtdLFxuICAgICAgICBmaW5kTGFiZWwgPSBSZWdFeHAoYmluZFBhdHRlcm4uc291cmNlKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoZXMubWFwKG1hdGNoID0+ICBtYXRjaC5tYXRjaChmaW5kTGFiZWwpWzFdLnRyaW0oKSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoYXJyMSwgYXJyMikge1xuICAgIHJldHVybiBhcnIxLnJlZHVjZSggKGludGVybGVhdmVkLCBpdGVtLCBpKSA9PiB7XG4gICAgICAgIGxldCBhcnIySXRlbSA9IGFycjJbaV07XG4gICAgICAgIGludGVybGVhdmVkLnB1c2goaXRlbSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGludGVybGVhdmVkKTtcbiAgICAgICAgaWYgKGFycjJJdGVtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGludGVybGVhdmVkLnB1c2goYXJyMkl0ZW0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaW50ZXJsZWF2ZWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnRlcmxlYXZlZDtcbiAgICB9LCBbXSk7XG59XG4iLCJpbXBvcnQgYmluZGluZ3NJblN0ciBmcm9tICcuL2JpbmRpbmdzSW5TdHInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYWtlRW50cnkobm9kZSwge29wZW5EZWxpbT0ne3snLCBjbG9zZURlbGltPSd9fSd9ID0ge30pIHtcbiAgICBsZXQgYmluZFBhdHRlcm4gPSBuZXcgUmVnRXhwKGAke29wZW5EZWxpbX1bXiR7Y2xvc2VEZWxpbX1dKiR7Y2xvc2VEZWxpbX1gLCAnZycpLFxuICAgICAgICBwcm9wID0gbm9kZS52YWx1ZSA/ICd2YWx1ZScgOiAndGV4dENvbnRlbnQnLFxuICAgICAgICBiaW5kaW5ncyA9IGJpbmRpbmdzSW5TdHIobm9kZVtwcm9wXSwge29wZW5EZWxpbTpvcGVuRGVsaW0sIGNsb3NlRGVsaW06Y2xvc2VEZWxpbX0pLFxuICAgICAgICBzdGF0aWNQYXJ0cyA9IG5vZGVbcHJvcF0uc3BsaXQoYmluZFBhdHRlcm4pO1xuICAgIGlmIChiaW5kaW5ncy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5vZGU6IG5vZGUsXG4gICAgICAgICAgICBzdGF0aWNQYXJ0czogc3RhdGljUGFydHMsXG4gICAgICAgICAgICBkYXRhUGF0aHM6IGJpbmRpbmdzLFxuICAgICAgICAgICAgY3VycmVudFZhbHVlczogYmluZGluZ3MubWFwKGJpbmRpbmcgPT4gJycpXG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuXG4vKlxue1xuICAgIG5vZGU6IDxyZW5kZXJUYXJnZXROb2RlPixcbiAgICBzdGF0aWNQYXJ0czogW1N0cmluZ10sXG4gICAgZGF0YVBhdGhzOiBbU3RyaW5nXSxcbiAgICBjdXJyZW50VmFsdWVzOiBbU3RyaW5nXVxufVxuKi9cbiIsImltcG9ydCBtYWtlRW50cnkgZnJvbSAnLi9tYWtlRW50cnknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXBOb2RlKG1hcCwgbm9kZSkge1xuICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgIHJldHVybiBbXS5zbGljZS5jYWxsKG5vZGUuY2hpbGROb2RlcylcbiAgICAgICAgICAgICAgICAgLmNvbmNhdCggW10uc2xpY2UuY2FsbChub2RlLmF0dHJpYnV0ZXMpIClcbiAgICAgICAgICAgICAgICAgLnJlZHVjZShtYXBOb2RlLCBtYXApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBlbnRyeSA9IG1ha2VFbnRyeShub2RlKTtcbiAgICAgICAgaWYgKGVudHJ5ICE9PSBudWxsKSB7IG1hcC5wdXNoKGVudHJ5KTsgfVxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cbn1cbiJdfQ==
