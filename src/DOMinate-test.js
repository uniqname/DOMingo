import tape from 'tape';
import dominate from './DOMinate';
import { symbols } from './DOMingo';
import dom from './mocks/dom';

tape('DOMinate', t => {

    const doc = dom().document,
        textNode = doc.querySelector('p').firstChild,
        dominatedNode = dominate()(textNode);

    t.equal(dominatedNode, textNode, 'Returns the node that was processed.');

    t.ok(Array.isArray(textNode[symbols.dataPaths]), 'Adds to the node a DOMingo well known Symbol property, `dataPaths`, which is an array.');

    t.deepEqual(textNode[symbols.dataPaths], ['user.username'], 'dataPaths property contains data path strings for binding.');

    t.ok(Array.isArray(textNode[symbols.staticValues]), 'Adds to the node a DOMingo well known Symbol property, `staticValues`, which is an array.');

    t.deepEqual(textNode[symbols.staticValues], ['Welcome ', ''], 'staticValues property contains data path strings for binding');

    t.end();

});
