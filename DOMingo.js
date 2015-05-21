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
    var bindPatter = arguments[2] === undefined ? /\{\{[^}}]*}}/g : arguments[2];

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
        bindings = (0, _bindingsInStr2['default'])(node[prop], bindPattern),
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
    dataPath: [String],
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

function mapNode(map, node, i) {
    if (node.nodeType === 3 || node.value) {
        var entry = (0, _makeEntry2['default'])(node);
        if (entry !== null) {
            map.push(entry);
        }
        return map;
    } else {
        var children = [].slice.call(node.childNodes);
        return children.reduce(mapNode, map);
    }
}

module.exports = exports['default'];

},{"./makeEntry":4}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvRE9NaW5nby9ET01pbmdvL0RPTWluZ28uanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvRE9NaW5nby9ET01pbmdvL2JpbmRpbmdzSW5TdHIuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvRE9NaW5nby9ET01pbmdvL2ludGVybGVhdmUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvRE9NaW5nby9ET01pbmdvL21ha2VFbnRyeS5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS9ET01pbmdvL0RPTWluZ28vbWFwTm9kZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O3FCQ0d3QixPQUFPOzs7Ozs7dUJBSFgsV0FBVzs7OzswQkFDUixjQUFjOzs7O0FBRXRCLFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQThCO1FBQTVCLFVBQVUsZ0NBQUMsZUFBZTs7QUFDeEUsUUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDN0IsR0FBRyxHQUFHLDZCQUFJLE1BQU0sQ0FBQyxVQUFVLEdBQUUsTUFBTSx1QkFBVSxFQUFFLENBQUMsQ0FBQzs7QUFFckQsY0FBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7O0FBRy9CLFdBQU8sVUFBVSxJQUFJLEVBQUU7QUFDbkIsV0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUUsVUFBQyxPQUFPLEVBQUs7QUFDeEIsbUJBQU8sQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUUsVUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFLO0FBQ3hELG9CQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUNmLE1BQU0sQ0FBRSxVQUFDLEdBQUcsRUFB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RUFBRSxRQUFRO0FBQ25CLHlCQUFhLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU87dUJBQUksRUFBRTthQUFBLENBQUM7U0FDN0MsQ0FBQztLQUNMLE1BQU07QUFDSCxlQUFPLElBQUksQ0FBQztLQUNmO0NBQ0o7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7O3FCQ2Z1QixPQUFPOzs7O3lCQUZULGFBQWE7Ozs7QUFFcEIsU0FBUyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUU7QUFDMUMsUUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ25DLFlBQUksS0FBSyxHQUFHLDRCQUFVLElBQUksQ0FBQyxDQUFDO0FBQzVCLFlBQUksS0FBSyxLQUFLLElBQUksRUFBRTtBQUFFLGVBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FBRTtBQUN4QyxlQUFPLEdBQUcsQ0FBQztLQUNkLE1BQU07QUFDSCxZQUFJLFFBQVEsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDOUMsZUFBTyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztLQUN4QztDQUNKIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBtYXBOb2RlIGZyb20gJy4vbWFwTm9kZSc7XG5pbXBvcnQgaW50ZXJsZWF2ZSBmcm9tICcuL2ludGVybGVhdmUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBET01pbmdvKGZyYWcsIHNoYWRvd1Jvb3QsIGJpbmRQYXR0ZXI9L1xce1xce1tefX1dKn19L2cpIHtcbiAgICBsZXQgc2hhZG93ID0gZnJhZy5jbG9uZU5vZGUodHJ1ZSksXG4gICAgICAgIG1hcCA9IFsuLi5zaGFkb3cuY2hpbGROb2Rlc10ucmVkdWNlKG1hcE5vZGUsIFtdKTtcblxuICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoc2hhZG93KTtcblxuICAgIC8vdGhlIHJlbmRlciBmdW5jdGlvbi5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgbWFwID0gbWFwLm1hcCggKGJpbmRPYmopID0+IHtcbiAgICAgICAgICAgIGJpbmRPYmouY3VycmVudFZhbHVlcyA9IGJpbmRPYmouZGF0YVBhdGhzLm1hcCggKHBhdGgsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsID0gcGF0aC5zcGxpdCgvXFwufFxcLy9nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSggKHZhbCwgc2VnbWVudCkgPT4gKHZhbCAmJiB2YWxbc2VnbWVudF0pIHx8ICcnLCBkYXRhKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB2YWwgIT09IHVuZGVmaW5lZCA/IHZhbCA6IGJpbmRPYmouY3VycmVudFZhbHVlc1tpXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGV0IHByb3BWYWwgPSBpbnRlcmxlYXZlKGJpbmRPYmouc3RhdGljUGFydHMsIGJpbmRPYmouY3VycmVudFZhbHVlcykuam9pbignJyk7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gYmluZE9iai5ub2RlLnZhbHVlICE9PSB1bmRlZmluZWQgPyAndmFsdWUnIDogJ3RleHRDb250ZW50JztcbiAgICAgICAgICAgIGJpbmRPYmoubm9kZVtwcm9wXSA9IHByb3BWYWw7XG5cbiAgICAgICAgICAgIHJldHVybiBiaW5kT2JqO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc2hhZG93O1xuICAgIH07XG59XG5cbndpbmRvdy5ET01pbmdvID0gRE9NaW5nbztcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJpbmRpbmdzSW5TdHIoc3RyPScnLCB7b3BlbkRlbGltPSd7eycsIGNsb3NlRGVsaW09J319J30gPSB7fSkge1xuICAgIGxldCBiaW5kUGF0dGVybiA9IG5ldyBSZWdFeHAoYCR7b3BlbkRlbGltfShbXiR7Y2xvc2VEZWxpbX1dKikke2Nsb3NlRGVsaW19YCwgJ2cnKSxcbiAgICAgICAgbWF0Y2hlcyA9IHN0ci5tYXRjaChiaW5kUGF0dGVybikgfHwgW10sXG4gICAgICAgIGZpbmRMYWJlbCA9IFJlZ0V4cChiaW5kUGF0dGVybi5zb3VyY2UpO1xuICAgICAgICByZXR1cm4gbWF0Y2hlcy5tYXAobWF0Y2ggPT4gIG1hdGNoLm1hdGNoKGZpbmRMYWJlbClbMV0udHJpbSgpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChhcnIxLCBhcnIyKSB7XG4gICAgcmV0dXJuIGFycjEucmVkdWNlKCAoaW50ZXJsZWF2ZWQsIGl0ZW0sIGkpID0+IHtcbiAgICAgICAgbGV0IGFycjJJdGVtID0gYXJyMltpXTtcbiAgICAgICAgaW50ZXJsZWF2ZWQucHVzaChpdGVtKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coaW50ZXJsZWF2ZWQpO1xuICAgICAgICBpZiAoYXJyMkl0ZW0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaW50ZXJsZWF2ZWQucHVzaChhcnIySXRlbSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpbnRlcmxlYXZlZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGludGVybGVhdmVkO1xuICAgIH0sIFtdKTtcbn1cbiIsImltcG9ydCBiaW5kaW5nc0luU3RyIGZyb20gJy4vYmluZGluZ3NJblN0cic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1ha2VFbnRyeShub2RlLCB7b3BlbkRlbGltPSd7eycsIGNsb3NlRGVsaW09J319J30gPSB7fSkge1xuICAgIGxldCBiaW5kUGF0dGVybiA9IG5ldyBSZWdFeHAoYCR7b3BlbkRlbGltfVteJHtjbG9zZURlbGltfV0qJHtjbG9zZURlbGltfWAsICdnJyksXG4gICAgICAgIHByb3AgPSBub2RlLnZhbHVlID8gJ3ZhbHVlJyA6ICd0ZXh0Q29udGVudCcsXG4gICAgICAgIGJpbmRpbmdzID0gYmluZGluZ3NJblN0cihub2RlW3Byb3BdLCBiaW5kUGF0dGVybiksXG4gICAgICAgIHN0YXRpY1BhcnRzID0gbm9kZVtwcm9wXS5zcGxpdChiaW5kUGF0dGVybik7XG4gICAgaWYgKGJpbmRpbmdzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgICAgIHN0YXRpY1BhcnRzOiBzdGF0aWNQYXJ0cyxcbiAgICAgICAgICAgIGRhdGFQYXRoczogYmluZGluZ3MsXG4gICAgICAgICAgICBjdXJyZW50VmFsdWVzOiBiaW5kaW5ncy5tYXAoYmluZGluZyA9PiAnJylcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cbi8qXG57XG4gICAgbm9kZTogPHJlbmRlclRhcmdldE5vZGU+LFxuICAgIHN0YXRpY1BhcnRzOiBbU3RyaW5nXSxcbiAgICBkYXRhUGF0aDogW1N0cmluZ10sXG4gICAgY3VycmVudFZhbHVlczogW1N0cmluZ11cbn1cbiovXG4iLCJpbXBvcnQgbWFrZUVudHJ5IGZyb20gJy4vbWFrZUVudHJ5JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFwTm9kZShtYXAsIG5vZGUsIGkpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMyB8fCBub2RlLnZhbHVlKSB7XG4gICAgICAgIGxldCBlbnRyeSA9IG1ha2VFbnRyeShub2RlKTtcbiAgICAgICAgaWYgKGVudHJ5ICE9PSBudWxsKSB7IG1hcC5wdXNoKGVudHJ5KTsgfVxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBjaGlsZHJlbiA9IFtdLnNsaWNlLmNhbGwobm9kZS5jaGlsZE5vZGVzKTtcbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuLnJlZHVjZShtYXBOb2RlLCBtYXApO1xuICAgIH1cbn1cbiJdfQ==
