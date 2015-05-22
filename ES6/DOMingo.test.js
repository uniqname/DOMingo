import DOMingo from './DOMingo';
import bindingsInStr from './bindingsInStr';
import makeEntry from './makeEntry';
import interleave from './interleave';
import mapNode from './mapNode';

describe('DOMingo', () => {

    describe('#bindingsInStr', () => {
        it('should return an array of keys for all bindings in a string', () => {
            let str = 'I {{have}} {{ exactly }} {{three }} bindings!';
            assert.deepEqual(['have', 'exactly', 'three'], bindingsInStr(str));
        });

        it('allow for custom delimeters', () => {
            let str = 'I <%=have%> <%= exactly %> <%=three %> bindings!';
            assert.deepEqual(['have', 'exactly', 'three'], bindingsInStr(str, {
                openDelim: '<%=',
                closeDelim: '%>'
            }));
        });
    });

    describe('#makeEntry', () => {
        let node = {};

        beforeEach(function () {
            node = {};
        });

        it('should return null if no bindings are found', () => {
            node.textContent = 'no bindings';

            assert.strictEqual(null, makeEntry(node));
        });

        it('should return an object with the proper structure if bindings are found', () => {
            node.textContent = 'I got {{your}} {{bindings}} right {{here}}';

            assert.property(makeEntry(node), 'node');
            assert.property(makeEntry(node), 'staticParts');
            assert.property(makeEntry(node), 'dataPaths');
            assert.property(makeEntry(node), 'currentValues');
        });

        it('should duck-type the node passed to it', () => {
            node.textContent = '{{text}}';

            assert.strictEqual('text', makeEntry(node).dataPaths[0]);

            node.textContent = undefined;
            node.value = '{{attr}}';

            assert.strictEqual('attr', makeEntry(node).dataPaths[0]);
        });

        it('`staticParts` should be an array', () => {
            node.value = '{{attr}}';
            assert(Array.isArray(makeEntry(node).staticParts));
        });

        it('`dataPaths` should be an array', () => {
            node.value = '{{attr}}';
            assert(Array.isArray(makeEntry(node).dataPaths));
        });

        it('`currentValues` should be an array', () => {
            node.value = '{{attr}}';
            assert(Array.isArray(makeEntry(node).currentValues));
        });

        it('allow for custom delimeters', () => {
            node.value = 'I <%=have%> <%= exactly %> <%=three %> bindings!';
            assert.deepEqual(['have', 'exactly', 'three'], makeEntry(node, {
                openDelim: '<%=',
                closeDelim: '%>'
            }).dataPaths);
        });
    });

    describe('#interleave', () => {
        let a1, a2;

        before(function () {
            a1 = [1, 2, 3, 4];
            a2 = ['a', 'b', 'c'];
        });

        it('should interleave two arrays', () => {
            assert.deepEqual([1, 'a', 2, 'b', 3, 'c', 4], interleave(a1, a2));
        });
    });

    describe('#mapNode', () => {
        let map;
        beforeEach(function () {
            map = [];
        });

        it('should add an entry to the map for a textNode with bindings', () => {
            let textNode = {
                nodeType: 3,
                textContent: 'I got {{your}} {{bindings}} right {{here}}'
            };
            assert.equal(mapNode(map, textNode).length, 1);
        });

        it('should add an entry to the map for an elementNode that has attributes with bindings', () => {
            let elNode = {
                nodeType: 1,
                attributes: [
                    {
                        name: 'title',
                        value: '{{attr}} binding'
                    }
                ]
            };
            assert.equal(mapNode(map, elNode).length, 1);
        });

        it('should traverse child nodes looking for bindings', () => {
            let elNode = {
                nodeType: 1,
                childNodes: [{
                    nodeType: 3,
                    textContent: 'I {{still}} have your {{bindings}}'
                }]
            };
            assert.equal(mapNode(map, elNode).length, 1);
        });

        it('should work for comment nodes', () => {
            let commentNode = {
                nodeType: 8,
                textContent: '{{bindings}} in {{comments}}?'
            };
            assert.equal(mapNode(map, commentNode).length, 1);
        });
    });

});
