"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringToken_1 = require("./stringToken");
class ClassSimpleObject {
    constructor(name) {
        this.enums = [];
        this.altEnums = [];
        if (typeof name === "string") {
            this.name = new stringToken_1.StringToken(name);
        }
        else {
            this.name = name;
        }
    }
    get hasEnums() {
        return this.altEnums.length > 0;
    }
}
exports.ClassSimpleObject = ClassSimpleObject;
//# sourceMappingURL=classSimpleObject.js.map