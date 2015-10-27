export default (str) => str.replace(/[$^?.*+\\[\]{}()]/gm, match => `\\${match}`);
