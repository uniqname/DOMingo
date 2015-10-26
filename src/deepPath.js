export default (obj, path) => path.split(/[.\/]/)
        .reduce((currObj, nextProp) => Object(currObj)[nextProp], obj);
