class OrderType {
    static enums = ['new', 'pending', 'rejected', 'accepted'];

    static enum = {new: 'new', pending: 'pending', rejected: 'rejected', accepted: 'accepted'};

    /**
     * Turn the list into a key-value object where 
     * the key is egal to the value
     * @returns Object
     */
    static enum() {
        let types = {};
        OrderType.enums.forEach((type, index) => {
            types[`${type}`] = type;
        });
        return types;
    }
}

module.exports = OrderType;