import sanitize from './sanitizeforRE';

export default (openDelim, closeDelim) => new RegExp(`(?:${sanitize(openDelim)}\\s?)(\\S+)(?:\\s?${sanitize(closeDelim)})`, 'g');
