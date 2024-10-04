"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringToken_1 = require("./stringToken");
class ClassProperty {
    constructor(convertors, name, altName) {
        this.convertors = convertors;
        this.name = name;
        this.propName = altName ? altName : name;
    }
    get tsType() {
        if (!this.type) {
            return null;
        }
        if (this.type.startsWith("shp:")) {
            return null;
        }
        switch (this.type) {
            case "xsd:double":
            case "xsd:float":
            case "xsd:byte":
            case "xsd:int":
            case "xsd:integer":
            case "xsd:negativeInteger":
            case "xsd:nonNegativeInteger":
            case "xsd:positiveIntege":
            case "xsd:short":
            case "xsd:unsignedByte":
            case "xsd:unsignedInt":
            case "xsd:unsignedLong":
            case "xsd:unsignedShort":
                return "<number>";
            case "xsd:boolean":
                return "<boolean>";
            case "xsd:string":
            case "xsd:anyURI":
            case "xsd:base64Binary":
            case "xsd:date":
            case "xsd:dateTime":
            case "xsd:duration":
            case "xsd:ENTITIES":
            case "xsd:ENTITY":
            case "xsd:gDay":
            case "xsd:gMonth":
            case "xsd:gMonthDay":
            case "xsd:gYear":
            case "xsd:gYearMonth":
            case "xsd:hexBinary":
            case "xsd:ID":
            case "xsd:IDREF":
            case "xsd:IDREFS":
            case "xsd:language":
            case "xsd:Name":
            case "xsd:NCName":
            case "xsd:NMTOKEN":
            case "xsd:NMTOKENS":
            case "xsd:normalizedString":
            case "xsd:NOTATION":
            case "xsd:QName":
            case "xsd:time":
            case "xsd:token":
                return "<string>";
            default:
                return null;
        }
    }
    get definedType() {
        if (!this.type) {
            return "any";
        }
        if (this.type.startsWith("shp:")) {
            return "any";
        }
        switch (this.type) {
            case "xsd:double":
            case "xsd:float":
            case "xsd:byte":
            case "xsd:int":
            case "xsd:integer":
            case "xsd:negativeInteger":
            case "xsd:nonNegativeInteger":
            case "xsd:positiveIntege":
            case "xsd:short":
            case "xsd:unsignedByte":
            case "xsd:unsignedInt":
            case "xsd:unsignedLong":
            case "xsd:unsignedShort":
                return "number";
            case "xsd:boolean":
                return "boolean";
            case "xsd:string":
            case "xsd:anyURI":
            case "xsd:base64Binary":
            case "xsd:date":
            case "xsd:dateTime":
            case "xsd:duration":
            case "xsd:ENTITIES":
            case "xsd:ENTITY":
            case "xsd:gDay":
            case "xsd:gMonth":
            case "xsd:gMonthDay":
            case "xsd:gYear":
            case "xsd:gYearMonth":
            case "xsd:hexBinary":
            case "xsd:ID":
            case "xsd:IDREF":
            case "xsd:IDREFS":
            case "xsd:language":
            case "xsd:Name":
            case "xsd:NCName":
            case "xsd:NMTOKEN":
            case "xsd:NMTOKENS":
            case "xsd:normalizedString":
            case "xsd:NOTATION":
            case "xsd:QName":
            case "xsd:time":
            case "xsd:token":
                return "string";
            default:
                return "any";
        }
    }
    get tsConvertor() {
        if (!this.type) {
            return null;
        }
        if (this.type.startsWith("shp:")) {
            if (this.convertors[this.type.substring(4)]) {
                return new stringToken_1.StringToken(this.type.substring(4)).camelCase;
            }
            return null;
        }
        switch (this.type) {
            case "xsd:double":
            case "xsd:float":
                return "float";
            case "xsd:byte":
            case "xsd:int":
            case "xsd:integer":
            case "xsd:negativeInteger":
            case "xsd:nonNegativeInteger":
            case "xsd:positiveIntege":
            case "xsd:short":
            case "xsd:unsignedByte":
            case "xsd:unsignedInt":
            case "xsd:unsignedLong":
            case "xsd:unsignedShort":
                return "int";
            case "xsd:boolean":
                return "bool";
            case "xsd:string":
            case "xsd:anyURI":
            case "xsd:base64Binary":
            case "xsd:date":
            case "xsd:dateTime":
            case "xsd:duration":
            case "xsd:ENTITIES":
            case "xsd:ENTITY":
            case "xsd:gDay":
            case "xsd:gMonth":
            case "xsd:gMonthDay":
            case "xsd:gYear":
            case "xsd:gYearMonth":
            case "xsd:hexBinary":
            case "xsd:ID":
            case "xsd:IDREF":
            case "xsd:IDREFS":
            case "xsd:language":
            case "xsd:Name":
            case "xsd:NCName":
            case "xsd:NMTOKEN":
            case "xsd:NMTOKENS":
            case "xsd:normalizedString":
            case "xsd:NOTATION":
            case "xsd:QName":
            case "xsd:time":
            case "xsd:token":
                return null;
            default:
                return null;
        }
    }
}
exports.ClassProperty = ClassProperty;
//# sourceMappingURL=classProperty.js.map