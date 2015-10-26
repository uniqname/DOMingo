import interleave from './interleave';
import test from 'tape';

test('Interleave.', (t) => {

    const a1 = ['one', 'two', 'three'],
        a2 = [1, 2, 3, 4];

    t.deepEqual(interleave(a1, a2), ['one', 1, 'two', 2, 'three', 3], 'The interleaved array is propery interleaved');

    let interleaved = interleave(a1, a2);
    t.ok(a1.every(item => interleaved.indexOf(item) >= 0), 'The interleaved array contains all the properties of the first argument');

    t.ok(a2.slice(a1.length).every(item => interleaved.indexOf(item) < 0), 'The interleaved array contains at most as many properties of the second argument as there are in the first');


    t.end();
});
