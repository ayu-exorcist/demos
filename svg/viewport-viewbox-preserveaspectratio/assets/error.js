export class AttrError extends Error {
    constructor(type) {
        let message = `Incorrect attribute for ${type}!!!`;
        super(message);
        this.name = this.constructor.name;
    }
}