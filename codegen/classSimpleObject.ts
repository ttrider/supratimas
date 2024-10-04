import { StringToken } from "./stringToken";

export class ClassSimpleObject {

    name: StringToken;

    constructor(name: StringToken | string) {
        if (typeof name === "string") {
            this.name = new StringToken(name);
        }
        else {
            this.name = name;
        }
    }

    enums: StringToken[] = [];
    altEnums: StringToken[] = [];

    get hasEnums() {
        return this.altEnums.length > 0;
    }

}