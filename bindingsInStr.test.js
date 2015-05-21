import bindingsInStr from './bindingsInStr';

describe('DOMingo', () => {
    describe('#bindingsInStr', () => {
        it('should return an array of keys for all bindings in a string', () => {
            let str = 'I {{have}} {{ exactly }} {{three }} bindings!';
            assert.deepEqual(['have', 'exactly', 'three'], bindingsInStr(str));
        });
    });

    describe('#getOrMakeBoundNode', () => {
        let existingNode = Symbol('node'),
            newNode = Symbol('newNode'),
            map = {
                'have': [{
                    templateNode: Symbol('templateNode'),
                    shadowNode: Symbol('shadowNode')
                }],
                'exactly': [{
                    templateNode: existingNode,
                    shadowNode: Symbol('shadowNode')
                }],
                'three': [{
                    templateNode: Symbol('templateNode'),
                    shadowNode: Symbol('shadowNode')
                }]
            };

        it('should return the object that exists in the map', () => {
            assert.strictEqual(existingNode, getOrMakeBoundNode(existingNode, Symbol('shadowNode'), 'exactly', map));

            assert.equal(1, map.exactly.length);
        });

        it('should create a new object, add it to the map and return the object', () => {
            assert.strictEqual(newNode, getOrMakeBoundNode(newNode, Symbol('shadowNode'), 'exactly', map));

            assert.equal(2, map.exactly.length);

        });
    });

});
