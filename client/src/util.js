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

const querify = obj => {
    if (obj == null) return '';
    if (type(obj) === 'array') return encodeURIComponent(JSON.stringify(obj));
    if (type(obj) !== 'object') return encodeURIComponent(String(obj));
    let encoded = [];
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            encoded.push(encodeURIComponent(prop) + '=' +
                encodeURIComponent(!(obj[prop] instanceof Object) ? String(obj[prop]) : JSON.stringify(obj[prop]))
            );
        }
    }
    return encoded.join('&');
};

module.exports = {
    type,
    cast,
    querify
};