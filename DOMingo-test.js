(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _DOMingo = require('./DOMingo');

var _DOMingo2 = _interopRequireDefault(_DOMingo);

var _bindingsInStr = require('./bindingsInStr');

var _bindingsInStr2 = _interopRequireDefault(_bindingsInStr);

var _makeEntry = require('./makeEntry');

var _makeEntry2 = _interopRequireDefault(_makeEntry);

var _interleave = require('./interleave');

var _interleave2 = _interopRequireDefault(_interleave);

var _mapNode = require('./mapNode');

var _mapNode2 = _interopRequireDefault(_mapNode);

describe('DOMingo', function () {

    describe('#bindingsInStr', function () {
        it('should return an array of keys for all bindings in a string', function () {
            var str = 'I {{have}} {{ exactly }} {{three }} bindings!';
            assert.deepEqual(['have', 'exactly', 'three'], (0, _bindingsInStr2['default'])(str));
        });

        it('allow for custom delimeters', function () {
            var str = 'I <%=have%> <%= exactly %> <%=three %> bindings!';
            assert.deepEqual(['have', 'exactly', 'three'], (0, _bindingsInStr2['default'])(str, {
                openDelim: '<%=',
                closeDelim: '%>'
            }));
        });
    });

    describe('#makeEntry', function () {
        var node = {};

        beforeEach(function () {
            node = {};
        });

        it('should return null if no bindings are found', function () {
            node.textContent = 'no bindings';

            assert.strictEqual(null, (0, _makeEntry2['default'])(node));
        });

        it('should return an object with the proper structure if bindings are found', function () {
            node.textContent = 'I got {{your}} {{bindings}} right {{here}}';

            assert.property((0, _makeEntry2['default'])(node), 'node');
            assert.property((0, _makeEntry2['default'])(node), 'staticParts');
            assert.property((0, _makeEntry2['default'])(node), 'dataPaths');
            assert.property((0, _makeEntry2['default'])(node), 'currentValues');
        });

        it('should duck-type the node passed to it', function () {
            node.textContent = '{{text}}';

            assert.strictEqual('text', (0, _makeEntry2['default'])(node).dataPaths[0]);

            node.textContent = undefined;
            node.value = '{{attr}}';

            assert.strictEqual('attr', (0, _makeEntry2['default'])(node).dataPaths[0]);
        });

        it('`staticParts` should be an array', function () {
            node.value = '{{attr}}';
            assert(Array.isArray((0, _makeEntry2['default'])(node).staticParts));
        });

        it('`dataPaths` should be an array', function () {
            node.value = '{{attr}}';
            assert(Array.isArray((0, _makeEntry2['default'])(node).dataPaths));
        });

        it('`currentValues` should be an array', function () {
            node.value = '{{attr}}';
            assert(Array.isArray((0, _makeEntry2['default'])(node).currentValues));
        });

        it('allow for custom delimeters', function () {
            node.value = 'I <%=have%> <%= exactly %> <%=three %> bindings!';
            assert.deepEqual(['have', 'exactly', 'three'], (0, _makeEntry2['default'])(node, {
                openDelim: '<%=',
                closeDelim: '%>'
            }).dataPaths);
        });
    });

    describe('#interleave', function () {
        var a1 = undefined,
            a2 = undefined;

        before(function () {
            a1 = [1, 2, 3, 4];
            a2 = ['a', 'b', 'c'];
        });

        it('should interleave two arrays', function () {
            assert.deepEqual([1, 'a', 2, 'b', 3, 'c', 4], (0, _interleave2['default'])(a1, a2));
        });
    });

    describe('#mapNode', function () {
        var map = undefined;
        beforeEach(function () {
            map = [];
        });

        it('should add an entry to the map for a textNode with bindings', function () {
            var textNode = {
                nodeType: 3,
                textContent: 'I got {{your}} {{bindings}} right {{here}}'
            };
            assert.equal((0, _mapNode2['default'])(map, textNode).length, 1);
        });

        it('should add an entry to the map for an elementNode that has attributes with bindings', function () {
            var elNode = {
                attributes: [{
                    name: 'title',
                    value: '{{attr}} binding'
                }]
            };
            assert.equal((0, _mapNode2['default'])(map, elNode).length, 1);
        });

        it('should traverse child nodes looking for bindings', function () {
            var elNode = {
                childNodes: [{
                    nodeType: 3,
                    textContent: 'I {{still}} have your {{bindings}}'
                }]
            };
            assert.equal((0, _mapNode2['default'])(map, elNode).length, 1);
        });
    });
});

},{"./DOMingo":2,"./bindingsInStr":3,"./interleave":4,"./makeEntry":5,"./mapNode":6}],2:[function(require,module,exports){
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

},{"./interleave":4,"./mapNode":6}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./bindingsInStr":3}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = mapNode;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _makeEntry = require('./makeEntry');

var _makeEntry2 = _interopRequireDefault(_makeEntry);

function mapNode(map, node) {
    if (node.nodeType === 3 || node.value) {
        var entry = (0, _makeEntry2['default'])(node);
        if (entry !== null) {
            map.push(entry);
        }
        return map;
    } else {
        return [].slice.call(node.childNodes).concat([].slice.call(node.attributes)).reduce(mapNode, map);
    }
}

module.exports = exports['default'];

},{"./makeEntry":5}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvRE9NaW5nby9FUzYvRE9NaW5nby50ZXN0LmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL0RPTWluZ28vRVM2L0RPTWluZ28uanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvRE9NaW5nby9FUzYvYmluZGluZ3NJblN0ci5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS9ET01pbmdvL0VTNi9pbnRlcmxlYXZlLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL0RPTWluZ28vRVM2L21ha2VFbnRyeS5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS9ET01pbmdvL0VTNi9tYXBOb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozt1QkNBb0IsV0FBVzs7Ozs2QkFDTCxpQkFBaUI7Ozs7eUJBQ3JCLGFBQWE7Ozs7MEJBQ1osY0FBYzs7Ozt1QkFDakIsV0FBVzs7OztBQUUvQixRQUFRLENBQUMsU0FBUyxFQUFFLFlBQU07O0FBRXRCLFlBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFNO0FBQzdCLFVBQUUsQ0FBQyw2REFBNkQsRUFBRSxZQUFNO0FBQ3BFLGdCQUFJLEdBQUcsR0FBRywrQ0FBK0MsQ0FBQztBQUMxRCxrQkFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQUUsZ0NBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN0RSxDQUFDLENBQUM7O0FBRUgsVUFBRSxDQUFDLDZCQUE2QixFQUFFLFlBQU07QUFDcEMsZ0JBQUksR0FBRyxHQUFHLGtEQUFrRCxDQUFDO0FBQzdELGtCQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsRUFBRSxnQ0FBYyxHQUFHLEVBQUU7QUFDOUQseUJBQVMsRUFB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LEVBQUUsV0FBVztBQUN4QixxQkFBUyxFQUFFLFFBQVE7QUFDbkIseUJBQWEsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsT0FBTzt1QkFBSSxFQUFFO2FBQUEsQ0FBQztTQUM3QyxDQUFDO0tBQ0wsTUFBTTtBQUNILGVBQU8sSUFBSSxDQUFDO0tBQ2Y7Q0FDSjs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7cUJDZnVCLE9BQU87Ozs7eUJBRlQsYUFBYTs7OztBQUVwQixTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQ3ZDLFFBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNuQyxZQUFJLEtBQUssR0FBRyw0QkFBVSxJQUFJLENBQUMsQ0FBQztBQUM1QixZQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7QUFBRSxlQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUU7QUFDeEMsZUFBTyxHQUFHLENBQUM7S0FDZCxNQUFNO0FBQ0gsZUFBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQzNCLE1BQU0sQ0FBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUUsQ0FDeEMsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztLQUNsQztDQUNKIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBET01pbmdvIGZyb20gJy4vRE9NaW5nbyc7XG5pbXBvcnQgYmluZGluZ3NJblN0ciBmcm9tICcuL2JpbmRpbmdzSW5TdHInO1xuaW1wb3J0IG1ha2VFbnRyeSBmcm9tICcuL21ha2VFbnRyeSc7XG5pbXBvcnQgaW50ZXJsZWF2ZSBmcm9tICcuL2ludGVybGVhdmUnO1xuaW1wb3J0IG1hcE5vZGUgZnJvbSAnLi9tYXBOb2RlJztcblxuZGVzY3JpYmUoJ0RPTWluZ28nLCAoKSA9PiB7XG5cbiAgICBkZXNjcmliZSgnI2JpbmRpbmdzSW5TdHInLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGFuIGFycmF5IG9mIGtleXMgZm9yIGFsbCBiaW5kaW5ncyBpbiBhIHN0cmluZycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdHIgPSAnSSB7e2hhdmV9fSB7eyBleGFjdGx5IH19IHt7dGhyZWUgfX0gYmluZGluZ3MhJztcbiAgICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoWydoYXZlJywgJ2V4YWN0bHknLCAndGhyZWUnXSwgYmluZGluZ3NJblN0cihzdHIpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2FsbG93IGZvciBjdXN0b20gZGVsaW1ldGVycycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzdHIgPSAnSSA8JT1oYXZlJT4gPCU9IGV4YWN0bHkgJT4gPCU9dGhyZWUgJT4gYmluZGluZ3MhJztcbiAgICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoWydoYXZlJywgJ2V4YWN0bHknLCAndGhyZWUnXSwgYmluZGluZ3NJblN0cihzdHIsIHtcbiAgICAgICAgICAgICAgICBvcGVuRGVsaW06ICc8JT0nLFxuICAgICAgICAgICAgICAgIGNsb3NlRGVsaW06ICclPidcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnI21ha2VFbnRyeScsICgpID0+IHtcbiAgICAgICAgbGV0IG5vZGUgPSB7fTtcblxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG5vZGUgPSB7fTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gbnVsbCBpZiBubyBiaW5kaW5ncyBhcmUgZm91bmQnLCAoKSA9PiB7XG4gICAgICAgICAgICBub2RlLnRleHRDb250ZW50ID0gJ25vIGJpbmRpbmdzJztcblxuICAgICAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKG51bGwsIG1ha2VFbnRyeShub2RlKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGFuIG9iamVjdCB3aXRoIHRoZSBwcm9wZXIgc3RydWN0dXJlIGlmIGJpbmRpbmdzIGFyZSBmb3VuZCcsICgpID0+IHtcbiAgICAgICAgICAgIG5vZGUudGV4dENvbnRlbnQgPSAnSSBnb3Qge3t5b3VyfX0ge3tiaW5kaW5nc319IHJpZ2h0IHt7aGVyZX19JztcblxuICAgICAgICAgICAgYXNzZXJ0LnByb3BlcnR5KG1ha2VFbnRyeShub2RlKSwgJ25vZGUnKTtcbiAgICAgICAgICAgIGFzc2VydC5wcm9wZXJ0eShtYWtlRW50cnkobm9kZSksICdzdGF0aWNQYXJ0cycpO1xuICAgICAgICAgICAgYXNzZXJ0LnByb3BlcnR5KG1ha2VFbnRyeShub2RlKSwgJ2RhdGFQYXRocycpO1xuICAgICAgICAgICAgYXNzZXJ0LnByb3BlcnR5KG1ha2VFbnRyeShub2RlKSwgJ2N1cnJlbnRWYWx1ZXMnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBkdWNrLXR5cGUgdGhlIG5vZGUgcGFzc2VkIHRvIGl0JywgKCkgPT4ge1xuICAgICAgICAgICAgbm9kZS50ZXh0Q29udGVudCA9ICd7e3RleHR9fSc7XG5cbiAgICAgICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbCgndGV4dCcsIG1ha2VFbnRyeShub2RlKS5kYXRhUGF0aHNbMF0pO1xuXG4gICAgICAgICAgICBub2RlLnRleHRDb250ZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgbm9kZS52YWx1ZSA9ICd7e2F0dHJ9fSc7XG5cbiAgICAgICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbCgnYXR0cicsIG1ha2VFbnRyeShub2RlKS5kYXRhUGF0aHNbMF0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnYHN0YXRpY1BhcnRzYCBzaG91bGQgYmUgYW4gYXJyYXknLCAoKSA9PiB7XG4gICAgICAgICAgICBub2RlLnZhbHVlID0gJ3t7YXR0cn19JztcbiAgICAgICAgICAgIGFzc2VydChBcnJheS5pc0FycmF5KG1ha2VFbnRyeShub2RlKS5zdGF0aWNQYXJ0cykpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnYGRhdGFQYXRoc2Agc2hvdWxkIGJlIGFuIGFycmF5JywgKCkgPT4ge1xuICAgICAgICAgICAgbm9kZS52YWx1ZSA9ICd7e2F0dHJ9fSc7XG4gICAgICAgICAgICBhc3NlcnQoQXJyYXkuaXNBcnJheShtYWtlRW50cnkobm9kZSkuZGF0YVBhdGhzKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdgY3VycmVudFZhbHVlc2Agc2hvdWxkIGJlIGFuIGFycmF5JywgKCkgPT4ge1xuICAgICAgICAgICAgbm9kZS52YWx1ZSA9ICd7e2F0dHJ9fSc7XG4gICAgICAgICAgICBhc3NlcnQoQXJyYXkuaXNBcnJheShtYWtlRW50cnkobm9kZSkuY3VycmVudFZhbHVlcykpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnYWxsb3cgZm9yIGN1c3RvbSBkZWxpbWV0ZXJzJywgKCkgPT4ge1xuICAgICAgICAgICAgbm9kZS52YWx1ZSA9ICdJIDwlPWhhdmUlPiA8JT0gZXhhY3RseSAlPiA8JT10aHJlZSAlPiBiaW5kaW5ncyEnO1xuICAgICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChbJ2hhdmUnLCAnZXhhY3RseScsICd0aHJlZSddLCBtYWtlRW50cnkobm9kZSwge1xuICAgICAgICAgICAgICAgIG9wZW5EZWxpbTogJzwlPScsXG4gICAgICAgICAgICAgICAgY2xvc2VEZWxpbTogJyU+J1xuICAgICAgICAgICAgfSkuZGF0YVBhdGhzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnI2ludGVybGVhdmUnLCAoKSA9PiB7XG4gICAgICAgIGxldCBhMSwgYTI7XG5cbiAgICAgICAgYmVmb3JlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGExID0gWzEsIDIsIDMsIDRdO1xuICAgICAgICAgICAgYTIgPSBbJ2EnLCAnYicsICdjJ107XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgaW50ZXJsZWF2ZSB0d28gYXJyYXlzJywgKCkgPT4ge1xuICAgICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChbMSwgJ2EnLCAyLCAnYicsIDMsICdjJywgNF0sIGludGVybGVhdmUoYTEsIGEyKSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJyNtYXBOb2RlJywgKCkgPT4ge1xuICAgICAgICBsZXQgbWFwO1xuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1hcCA9IFtdO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGFkZCBhbiBlbnRyeSB0byB0aGUgbWFwIGZvciBhIHRleHROb2RlIHdpdGggYmluZGluZ3MnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgdGV4dE5vZGUgPSB7XG4gICAgICAgICAgICAgICAgbm9kZVR5cGU6IDMsXG4gICAgICAgICAgICAgICAgdGV4dENvbnRlbnQ6ICdJIGdvdCB7e3lvdXJ9fSB7e2JpbmRpbmdzfX0gcmlnaHQge3toZXJlfX0nXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcE5vZGUobWFwLCB0ZXh0Tm9kZSkubGVuZ3RoLCAxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBhZGQgYW4gZW50cnkgdG8gdGhlIG1hcCBmb3IgYW4gZWxlbWVudE5vZGUgdGhhdCBoYXMgYXR0cmlidXRlcyB3aXRoIGJpbmRpbmdzJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGVsTm9kZSA9IHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd0aXRsZScsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ3t7YXR0cn19IGJpbmRpbmcnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcE5vZGUobWFwLCBlbE5vZGUpLmxlbmd0aCwgMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdHJhdmVyc2UgY2hpbGQgbm9kZXMgbG9va2luZyBmb3IgYmluZGluZ3MnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZWxOb2RlID0ge1xuICAgICAgICAgICAgICAgIGNoaWxkTm9kZXM6IFt7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVUeXBlOiAzLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0Q29udGVudDogJ0kge3tzdGlsbH19IGhhdmUgeW91ciB7e2JpbmRpbmdzfX0nXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwobWFwTm9kZShtYXAsIGVsTm9kZSkubGVuZ3RoLCAxKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pO1xuIiwiaW1wb3J0IG1hcE5vZGUgZnJvbSAnLi9tYXBOb2RlJztcbmltcG9ydCBpbnRlcmxlYXZlIGZyb20gJy4vaW50ZXJsZWF2ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERPTWluZ28oZnJhZywgc2hhZG93Um9vdCwgYmluZFBhdHRlcj0vXFx7XFx7W159fV0qfX0vZykge1xuICAgIGxldCBzaGFkb3cgPSBmcmFnLmNsb25lTm9kZSh0cnVlKSxcbiAgICAgICAgbWFwID0gWy4uLnNoYWRvdy5jaGlsZE5vZGVzXS5yZWR1Y2UobWFwTm9kZSwgW10pO1xuXG4gICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChzaGFkb3cpO1xuXG4gICAgLy90aGUgcmVuZGVyIGZ1bmN0aW9uLlxuICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBtYXAgPSBtYXAubWFwKCAoYmluZE9iaikgPT4ge1xuICAgICAgICAgICAgYmluZE9iai5jdXJyZW50VmFsdWVzID0gYmluZE9iai5kYXRhUGF0aHMubWFwKCAocGF0aCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB2YWwgPSBwYXRoLnNwbGl0KC9cXC58XFwvL2cpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKCAodmFsLCBzZWdtZW50KSA9PiAodmFsICYmIHZhbFtzZWdtZW50XSkgfHwgJycsIGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbCAhPT0gdW5kZWZpbmVkID8gdmFsIDogYmluZE9iai5jdXJyZW50VmFsdWVzW2ldO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsZXQgcHJvcFZhbCA9IGludGVybGVhdmUoYmluZE9iai5zdGF0aWNQYXJ0cywgYmluZE9iai5jdXJyZW50VmFsdWVzKS5qb2luKCcnKTtcblxuICAgICAgICAgICAgbGV0IHByb3AgPSBiaW5kT2JqLm5vZGUudmFsdWUgIT09IHVuZGVmaW5lZCA/ICd2YWx1ZScgOiAndGV4dENvbnRlbnQnO1xuICAgICAgICAgICAgYmluZE9iai5ub2RlW3Byb3BdID0gcHJvcFZhbDtcblxuICAgICAgICAgICAgcmV0dXJuIGJpbmRPYmo7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBzaGFkb3c7XG4gICAgfTtcbn1cblxud2luZG93LkRPTWluZ28gPSBET01pbmdvO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYmluZGluZ3NJblN0cihzdHI9JycsIHtvcGVuRGVsaW09J3t7JywgY2xvc2VEZWxpbT0nfX0nfSA9IHt9KSB7XG4gICAgbGV0IGJpbmRQYXR0ZXJuID0gbmV3IFJlZ0V4cChgJHtvcGVuRGVsaW19KFteJHtjbG9zZURlbGltfV0qKSR7Y2xvc2VEZWxpbX1gLCAnZycpLFxuICAgICAgICBtYXRjaGVzID0gc3RyLm1hdGNoKGJpbmRQYXR0ZXJuKSB8fCBbXSxcbiAgICAgICAgZmluZExhYmVsID0gUmVnRXhwKGJpbmRQYXR0ZXJuLnNvdXJjZSk7XG4gICAgICAgIHJldHVybiBtYXRjaGVzLm1hcChtYXRjaCA9PiAgbWF0Y2gubWF0Y2goZmluZExhYmVsKVsxXS50cmltKCkpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGFycjEsIGFycjIpIHtcbiAgICByZXR1cm4gYXJyMS5yZWR1Y2UoIChpbnRlcmxlYXZlZCwgaXRlbSwgaSkgPT4ge1xuICAgICAgICBsZXQgYXJyMkl0ZW0gPSBhcnIyW2ldO1xuICAgICAgICBpbnRlcmxlYXZlZC5wdXNoKGl0ZW0pO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhpbnRlcmxlYXZlZCk7XG4gICAgICAgIGlmIChhcnIySXRlbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpbnRlcmxlYXZlZC5wdXNoKGFycjJJdGVtKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGludGVybGVhdmVkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW50ZXJsZWF2ZWQ7XG4gICAgfSwgW10pO1xufVxuIiwiaW1wb3J0IGJpbmRpbmdzSW5TdHIgZnJvbSAnLi9iaW5kaW5nc0luU3RyJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFrZUVudHJ5KG5vZGUsIHtvcGVuRGVsaW09J3t7JywgY2xvc2VEZWxpbT0nfX0nfSA9IHt9KSB7XG4gICAgbGV0IGJpbmRQYXR0ZXJuID0gbmV3IFJlZ0V4cChgJHtvcGVuRGVsaW19W14ke2Nsb3NlRGVsaW19XSoke2Nsb3NlRGVsaW19YCwgJ2cnKSxcbiAgICAgICAgcHJvcCA9IG5vZGUudmFsdWUgPyAndmFsdWUnIDogJ3RleHRDb250ZW50JyxcbiAgICAgICAgYmluZGluZ3MgPSBiaW5kaW5nc0luU3RyKG5vZGVbcHJvcF0sIHtvcGVuRGVsaW06b3BlbkRlbGltLCBjbG9zZURlbGltOmNsb3NlRGVsaW19KSxcbiAgICAgICAgc3RhdGljUGFydHMgPSBub2RlW3Byb3BdLnNwbGl0KGJpbmRQYXR0ZXJuKTtcbiAgICBpZiAoYmluZGluZ3MubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICAgICAgc3RhdGljUGFydHM6IHN0YXRpY1BhcnRzLFxuICAgICAgICAgICAgZGF0YVBhdGhzOiBiaW5kaW5ncyxcbiAgICAgICAgICAgIGN1cnJlbnRWYWx1ZXM6IGJpbmRpbmdzLm1hcChiaW5kaW5nID0+ICcnKVxuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuLypcbntcbiAgICBub2RlOiA8cmVuZGVyVGFyZ2V0Tm9kZT4sXG4gICAgc3RhdGljUGFydHM6IFtTdHJpbmddLFxuICAgIGRhdGFQYXRoczogW1N0cmluZ10sXG4gICAgY3VycmVudFZhbHVlczogW1N0cmluZ11cbn1cbiovXG4iLCJpbXBvcnQgbWFrZUVudHJ5IGZyb20gJy4vbWFrZUVudHJ5JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFwTm9kZShtYXAsIG5vZGUpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMyB8fCBub2RlLnZhbHVlKSB7XG4gICAgICAgIGxldCBlbnRyeSA9IG1ha2VFbnRyeShub2RlKTtcbiAgICAgICAgaWYgKGVudHJ5ICE9PSBudWxsKSB7IG1hcC5wdXNoKGVudHJ5KTsgfVxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXS5zbGljZS5jYWxsKG5vZGUuY2hpbGROb2RlcylcbiAgICAgICAgICAgICAgICAgLmNvbmNhdCggW10uc2xpY2UuY2FsbChub2RlLmF0dHJpYnV0ZXMpIClcbiAgICAgICAgICAgICAgICAgLnJlZHVjZShtYXBOb2RlLCBtYXApO1xuICAgIH1cbn1cbiJdfQ==
