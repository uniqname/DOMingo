import tape from 'tape';
import deepPath from './deepPath';

tape('deepPath', t => {

    const obj = {
        some: {
            deep: {
                path: 'Hi',
                array: ['Oh', 'Hi', 'there']
            }
        }
    };

    t.equal(deepPath(obj, 'some.deep.path'), 'Hi', 'returns value at path with dot notation');

    t.equal(deepPath(obj, 'some/deep/path'), 'Hi', 'returns value at path with slash notation');

    t.equal(deepPath(obj, 'some.deep.array.2'), 'there', 'returns value at path within array using dot notation');

    t.equal(deepPath(obj, 'some/deep/array/0'), 'Oh', 'returns value at path within array using slash notation');

    t.equal(deepPath(obj, 'some/deep/array/0'), 'Oh', 'returns value at path within array using slash notation');

    t.equal(deepPath(obj, 'some/random/path/2/nowhere'), undefined, 'returns undefined if object cannot be traversed with path');

    t.end();
});
