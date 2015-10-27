import bindFinder from './bindFinder';

export default (openDelim = '{{', closeDelim = '}}') => node =>
    node.nodeValue.match(bindFinder(openDelim, closeDelim));
