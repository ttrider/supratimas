import { ClassProperty } from "./classProperty";
import { ClassPropertyElement } from "./classPropertyElement";

export class ClassPlanStatement {
    private planNodeSetterValue?: string | null;
    private statementSetterValue?: string | null;
    bindToNodeAs?: string | null;
    bindToStatementAs?: string | null;
    property?: ClassPropertyElement;

    get statementSetter() {
        if (!this.statementSetterValue) {
            return null;
        }
        return this.statementSetterValue;
    }
    set statementSetter(value: string | null | undefined) {
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
    set planNodeSetter(value: string | null | undefined) {
        if (value) {
            this.planNodeSetterValue = value.replace("{{value}}", `item.${this.name}`);
        }
    }

    displayName?: string | null;
    group?: string | null;
    constructor(public name: string) { }


    get groupString() {
        return (!this.group) ? null : `"${this.group}"`;
    }
    get displayNameString() {
        return (!this.displayName) ? null : `"${this.displayName}"`;
    }
}