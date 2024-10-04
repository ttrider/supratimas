import { stringItem } from "../common/stringBuilder";
import { PlanNode } from "./model";

export class Warning {
    properties: Array<{ name?: string, value: stringItem }> = [];
    constructor(public title: string) {

    }

    addProperties(properties?: { [name: string]: stringItem }) {
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

    addProperty(name: string, value?: stringItem | number | boolean) {
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
    addListItem(value?: stringItem | number | boolean) {
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