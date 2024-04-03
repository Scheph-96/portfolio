class ExperienceRessourceType {
    // static enums = ['WEB', 'UIDESIGN', 'LOGO', 'POSTER'];
    static enums = ['web', 'ui_design', 'poster', 'logo'];

    /**
     * Turn the list into a key-value object where 
     * the key is egal to the value
     * @returns Object
     */
    static enum() {
        let types = {};
        ExperienceRessourceType.enums.forEach((type, index) => {
            types[`${type}`] = type;
        });
        return types;
    }
}

module.exports = ExperienceRessourceType;