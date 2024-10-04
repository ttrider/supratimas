"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClassPlanStatement {
    constructor(name) {
        this.name = name;
    }
    get statementSetter() {
        if (!this.statementSetterValue) {
            return null;
        }
        return this.statementSetterValue;
    }
    set statementSetter(value) {
        if (value) {
            this.statementSetterValue = value.replace("{{value}}", `item.${this.name}`);
        }
    }
    get planNodeSetter() {
        if (!this.planNodeSetterValue) {
            return null;
        }
        return this.planNodeSetterValue;
    }
    set planNodeSetter(value) {
        if (value) {
            this.planNodeSetterValue = value.replace("{{value}}", `item.${this.name}`);
        }
    }
    get groupString() {
        return (!this.group) ? null : `"${this.group}"`;
    }
    get displayNameString() {
        return (!this.displayName) ? null : `"${this.displayName}"`;
    }
}
exports.ClassPlanStatement = ClassPlanStatement;
//# sourceMappingURL=classPlanStatement.js.map