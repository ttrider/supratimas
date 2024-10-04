"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClassPropertyElement {
    constructor(name) {
        this.name = name;
    }
    get definitionType() {
        return this.declareType ? this.declareType : this.className;
    }
}
exports.ClassPropertyElement = ClassPropertyElement;
//# sourceMappingURL=classPropertyElement.js.map