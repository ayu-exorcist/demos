export class AttrError extends Error {
    constructor(type) {
        let message = `Incorrect attribute for ${type}!!!`;
        super(message);
        this.name = this.constructor.name;
    }
}

export class ValueError extends Error {
    constructor(attr) {
        let message = `The ${attr} value is incorrect!!!`;
        super(message);
        this.name = this.constructor.name;
    }
}