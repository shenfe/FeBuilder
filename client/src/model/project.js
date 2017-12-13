class Project {
    constructor({ tree, style, script, time, title, user } = {}) {
        tree = tree || {};
        this.content = JSON.parse(JSON.stringify(tree));
        this.style = style;
        this.script = script;
        this.time = time || Date.now();
        this.title = title;
        this.user = user;
        this.name = undefined;
    }
    updateTitle(title) {
        this.title = title;
    }
    updateTime() {
        this.time = Date.now();
    }
    updateName(v) {
        this.name = v;
    }
}

const proj = new Project();

module.exports = proj;
