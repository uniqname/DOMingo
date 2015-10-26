'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function nodeReduce(nodes, node) {
    return [].concat(_toConsumableArray(node.childNodes || [])).reduce(nodeReduce, nodes).concat([].concat(_toConsumableArray(node.attributes || []))).concat(node.nodeValue ? node : []);
}

var sanitize = function sanitize(str) {
    return str.replace(/[$^?.*+\\[\]{}()]/gm, function (match) {
        return '\\' + match;
    });
};

var bindFinder = function bindFinder(openDelim, closeDelim) {
    return new RegExp('(?:' + sanitize(openDelim) + '\\s?)(\\S+)(?:\\s?' + sanitize(closeDelim) + ')', 'g');
};

var hasBindingsWithDelem = function hasBindingsWithDelem() {
    var openDelim = arguments.length <= 0 || arguments[0] === undefined ? '{{' : arguments[0];
    var closeDelim = arguments.length <= 1 || arguments[1] === undefined ? '}}' : arguments[1];
    return function (node) {
        return node.nodeValue.match(bindFinder(openDelim, closeDelim));
    };
};

function interleave(arr1, arr2) {
    return arr1.reduce(function (interleaved, item, i) {
        var arr2Item = arr2[i];
        interleaved.push(item);
        if (arr2Item !== undefined) {
            interleaved.push(arr2Item);
        }
        return interleaved;
    }, []);
}

function dominate() {
    var openDelem = arguments.length <= 0 || arguments[0] === undefined ? '{{' : arguments[0];
    var closeDelem = arguments.length <= 1 || arguments[1] === undefined ? '}}' : arguments[1];

    return function (node) {
        var re = bindFinder(openDelem, closeDelem),
            text = node.nodeValue,

        // splits string at delimiters.
        parts = text.split(re);

        //odd indicies: will always be data paths
        node[symbols.dataPaths] = parts.filter(function (part, i) {
            return i % 2;
        });

        //even indicies: will always be static values
        node[symbols.staticValues] = parts.filter(function (part, i) {
            return !(i % 2);
        });

        return node;
    };
}

var deepPath = function deepPath(obj, path) {
    return path.split(/[.\/]/).reduce(function (currObj, nextProp) {
        return Object(currObj)[nextProp];
    }, obj);
};

var symbols = {
    dataPaths: Symbol('dataPaths'),
    staticValues: Symbol('staticValues')
};

function DOMingo(root) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$delimiters = _ref.delimiters;
    var delimiters = _ref$delimiters === undefined ? ['{{', '}}'] : _ref$delimiters;

    var hasBindings = hasBindingsWithDelem.apply(undefined, _toConsumableArray(delimiters)),
        nodesWithBindings = [].concat(_toConsumableArray(root.childNodes))

    //collects flat list of all nodes
    .reduce(nodeReduce, [])

    //removes nodes that don't have bindings
    .filter(hasBindings)

    //adds symbol properties to nodes for quick rendering
    .map(dominate.apply(undefined, _toConsumableArray(delimiters)));

    //the render function.
    return function (data) {
        nodesWithBindings.map(function (node) {
            var currText = node.nodeValue,
                dataValues = node[symbols.dataPaths].map(function (dataPath) {
                return deepPath(data, dataPath);
            }).map(function (val) {
                return val || '';
            }),
                newText = interleave(node[symbols.staticValues], dataValues).join('');

            if (newText !== currText) {
                node.nodeValue = newText;
            }
        });
    };
}

exports.symbols = symbols;
exports['default'] = DOMingo;

