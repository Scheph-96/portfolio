class ExperienceRessourceType {
    // static enums = ['WEB', 'UIDESIGN', 'LOGO', 'POSTER'];
    static enums = ['html_css', 'react', 'nodejs'];

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