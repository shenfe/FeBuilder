class Project {
    constructor({ tree, style, script, time, title, user } = {}) {
        tree = tree || {};
        this.tree = JSON.parse(JSON.stringify(tree));
        this.style = style;
        this.script = script;
        this.time = time || Date.now();
        this.title = title;
        this.user = user;
    }
    updateTitle(title) {
        this.title = title;
    }
    updateTime() {
        this.time = Date.now();
    }
}

module.exports = Project;
