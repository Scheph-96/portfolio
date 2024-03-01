class ProjectType {
    static enums = ['new', 'ongoing', 'aborted', 'completed'];

    static enum() {
        let types = {};
        ProjectType.enums.forEach((type, index) => {
            types[`${type}`] = type;
        });

        return types;
    }
}

module.exports = ProjectType;