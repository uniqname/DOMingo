/* eslint no-underscore-dangle:0 */
import nodeReduce from './nodeReduce';
import test from 'tape';
import dom from './mocks/dom.js';

test('nodeReduce', (t) => {
    const doc = dom().document,
        result1 = nodeReduce([], doc.querySelector('p')),
        resultAll = nodeReduce([], doc);

    t.equals(result1.length, 1, 'Finds only one result ');
    t.equals(result1[0].nodeType, 3, 'Node is of type 3 (TEXT_NODE)');
    t.equals(result1[0].nodeValue, 'Welcome {{ user.username }}', 'Finds the text content of the node');

    t.equals(resultAll.length, 23, 'Finds all nodes in fragment excluding element and docment nodes');

    t.end();
});
