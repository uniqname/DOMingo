export default function bindingsInStr(str='', openDelim='{{', closeDelim='}}') {
    let bindingRe = RegExp(openDelim + '(.*?)' + closeDelim, 'g'),
        matches = str.match(bindingRe) || [];
        return matches.map(match => match.replace(openDelim, '')
                                         .replace(closeDelim, '')
                                         .trim());
}
