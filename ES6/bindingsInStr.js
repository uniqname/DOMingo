export default function bindingsInStr(str='', {openDelim='{{', closeDelim='}}'} = {}) {
    let bindPattern = new RegExp(`${openDelim}([^${closeDelim}]*)${closeDelim}`, 'g'),
        matches = str.match(bindPattern) || [],
        findLabel = RegExp(bindPattern.source);
        return matches.map(match =>  match.match(findLabel)[1].trim());
}
