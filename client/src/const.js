module.exports = {
    validation: {
        username: v => (typeof v === 'string' && /[0-9a-zA-Z]{6,12}/.test(v)),
        password: v => (typeof v === 'string' && /[0-9a-zA-Z]{6,12}/.test(v))
    }
};