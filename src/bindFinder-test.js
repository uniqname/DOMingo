import test from 'tape';
import bindFinder from './bindFinder';

test('bindFinder', t => {

    let bnd = bindFinder('{{', '}}'),
        bndMatches = bnd.exec('a {{ foof }} b {{ poof}}');

    t.ok(bndMatches, 'finds a binding');

    t.equal(bndMatches[1], 'foof', 'matches an the path of an occurance of a binding.');

    t.equal(bnd.exec('a {{ foof }} b {{ poof}}')[1], 'poof', 'matches the next occurance of a binding.');

    t.end();
});
