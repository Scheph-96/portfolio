class ExperienceRessourceType {
    // static enums = ['WEB', 'UIDESIGN', 'LOGO', 'POSTER'];
    static enums = ['web', 'ui_design', 'logo', 'poster'];

    static enum() {
        let types = {};
        ExperienceRessourceType.enums.forEach((type, index) => {
            types[`${type}`] = type;
        });
        return types;
    }
}

module.exports = ExperienceRessourceType;