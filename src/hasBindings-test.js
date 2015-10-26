import hasBindings from './hasBindings';
import dom from './mocks/dom.js';
import test from 'tape';

const doc = dom().document;

test('hasBindings.', (t) => {
    t.ok(hasBindings()(doc.querySelector('p').firstChild), 'Matches default binding pattern');

    t.notok(hasBindings('$:', ':$')(doc.querySelector('p').firstChild), 'Fails to match default binding pattern when custom binding pattern is provided');

    t.ok(hasBindings('$:', ':$')(doc.querySelector('q').firstChild), 'Matches custom binding pattern when custom binding pattern is provided');

    t.end();
});
