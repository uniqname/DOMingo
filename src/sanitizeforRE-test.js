import sanitize from './sanitizeforRE';
import test from 'tape';

test('sanitizeforRE', (t) => {
    t.equal(
        sanitize('escape these $^([{}])?.*+\\ and not these abcd1234!=&% but globally so $^([{}])?.*+\\'),
        'escape these \\$\\^\\(\\[\\{\\}\\]\\)\\?\\.\\*\\+\\\\ and not these abcd1234!=&% but globally so \\$\\^\\(\\[\\{\\}\\]\\)\\?\\.\\*\\+\\\\',
        'sanitized');
    t.end();
});
