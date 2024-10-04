"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Warning {
    constructor(title) {
        this.title = title;
        this.properties = [];
    }
    addProperties(properties) {
        if (properties) {
            for (const propName in properties) {
                if (properties.hasOwnProperty(propName)) {
                    const propValue = properties[propName];
                    this.addProperty(propName, propValue);
                }
            }
        }
        return this;
    }
    addProperty(name, value) {
        if (value !== undefined && value !== null) {
            if (typeof value === "number") {
                value = value.toString();
            }
            else if (typeof value === "boolean") {
                value = value.toString();
            }
            this.properties.push({ name: name, value: value });
        }
        return this;
    }
    addListItem(value) {
        if (value !== undefined && value !== null) {
            if (typeof value === "number") {
                value = value.toString();
            }
            else if (typeof value === "boolean") {
                value = value.toString();
            }
            this.properties.push({ value: value });
        }
        return this;
    }
}
exports.Warning = Warning;
//# sourceMappingURL=Warning.js.map