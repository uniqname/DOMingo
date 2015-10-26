import domingo from './DOMingo';
import dom from './mocks/dom';
import data from './mocks/data';
import tape from 'tape';

const doc = dom().document.cloneNode(true);

tape('DOMingo', t => {
    const render = domingo(doc.body);
    t.equals(typeof render, 'function', 'Accepts a DOM node and returns a function');

    render(data);

    t.equals(doc.querySelector('p').textContent, 'Welcome Cory', 'Updates DOM when data passed to render function');

    t.equals(doc.querySelector('li').textContent, 'pizza', 'Updates DOM when data passed to render function');

    const doc2 = dom().document.cloneNode(true),
        customRender = domingo(doc2.body, {
        delimiters: ['$:', ':$']
    });

    customRender(data);

    t.equals(doc2.querySelector('q').textContent, 'Hey Ohhhh!', 'Supports custom delimiters');

    t.end();
});
