class Project {
    constructor(tree, { style, script }, { time, user, name }) {
        this.tree = JSON.parse(JSON.stringify(tree));
        this.style = style;
        this.script = script;
        this.time = time || Date.now();
        this.name = name;
        this.user = user;
    }
    updateName(name) {
        this.name = name;
    }
    updateTime() {
        this.time = Date.now();
    }
}

module.exports = Project;
