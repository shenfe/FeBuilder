const type = v => {
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    let t = Object.prototype.toString.call(v);
    return t.substring('[object '.length, t.length - 1).toLowerCase();
};

const jsonClone = obj => JSON.parse(JSON.stringify(obj));

const cast = (src, ...dest) => {
    if (type(src) !== 'object') src = {};
    dest.forEach(d => {
        if (type(d) !== 'object') return;
        for (let k in d) {
            if (!d.hasOwnProperty(k)) continue;
            if (!src.hasOwnProperty(k)) {
                src[k] = jsonClone(d[k]);
            } else {
                src[k] = cast(src[k], d[k]);
            }
        }
    });
    return src;
};

module.exports = {
    type,
    cast
};