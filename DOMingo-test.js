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

        it('should work for comment nodes', function () {
            var commentNode = {
                nodeType: 8,
                textContent: '{{bindings}} in {{comments}}?'
            };
            assert.equal((0, _mapNode2['default'])(map, commentNode).length, 1);
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
    if (node.nodeType === 3 || node.nodeType === 8 || node.value) {
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

},{"./makeEntry":5}]},{},[1]);
