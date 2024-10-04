import { ClassProperty } from "./classProperty";
import { ClassPropertyElement } from "./classPropertyElement";
import { ClassPlanStatement } from "./classPlanStatement";
import { StringToken } from "./stringToken";

export class ClassObject {
    propertyElements: ClassPropertyElement[] = [];
    planNode: ClassPlanStatement[] = [];
    planStatement: ClassPlanStatement[] = [];
    properties: ClassProperty[] = [];
    isBatch: boolean = false;
    isStatement: boolean = false;
    isNode: boolean = false;
    baseName?: string | null;
    allPropertyElements: ClassPropertyElement[] = [];
    allPlanNode: ClassPlanStatement[] = [];
    allPlanStatement: ClassPlanStatement[] = [];
    allProperties: ClassProperty[] = [];
    inRef: number = 0;
    bindToNode: boolean = false;
    constructor(public name: string) {

    }

    get typeName() {
        if (this.isCollectionClass) {
            return this.collectionClassProperty + "[]";
        }
        return this.name;
    }

    get isCollectionClass() {
        return (this.baseName === undefined && this.properties.length == 0 && this.propertyElements.length == 1 && this.propertyElements[0].isArray);
    }
    get collectionClassProperty() {
        if (this.isCollectionClass) {
            return this.allPropertyElements[0];
        }
    }


    get hasPropertyElements() { return this.allPropertyElements.length > 0; }
    get hasPlanNode() {
        return (this.allPlanNode.length > 0) ||
            this.hasTitle ||
            this.hasSubTitle ||
            this.metrics.length > 0 ||
            this.nameSets.length > 0 ||
            this.flags.length > 0;
    }
    get hasPlanStatement() { return this.allPlanStatement.length > 0; }
    get hasTitle() {
        return this.titlePropertyName;
    }
    get hasSubTitle() {
        return this.subTitlePropertyName;
    }
    get titlePropertyName() {
        for (const prop of this.allProperties) {
            if (prop.title && prop.propName != null && prop.propName.length > 0) {
                return prop.propName;
            }
        }
        return null;
    }
    get subTitlePropertyName() {
        for (const prop of this.allProperties) {
            if (prop.subTitle && prop.propName != null && prop.propName.length > 0) {
                return prop.propName;
            }
        }
        return null;
    }

    get genericStatementSetters() {
        return this.allPlanStatement.filter((val, index, arr) => {
            return !val.statementSetter && !val.bindToStatementAs;
        });
    }
    get statementSetters() {
        return this.allPlanStatement.filter((val, index, arr) => {
            return !!val.statementSetter;
        });
    }
    get genericNodeSetters() {
        return this.allPlanNode.filter((val, index, arr) => {
            return !val.planNodeSetter && !val.bindToNodeAs;
        });
    }
    get nodeSetters() {
        return this.allPlanNode.filter((val, index, arr) => {
            return !!val.planNodeSetter;
        });
    }

    get nodeBinders() {
        return this.allPlanNode.filter((val, index, arr) => {
            return !!val.bindToNodeAs;
        });
    }

    get statementBinders() {
        return this.allPlanStatement.filter((val, index, arr) => {
            return !!val.bindToStatementAs;
        });
    }


    getDisplayName(propName: string, flag: string) {
        if (flag === "true") {
            return "\"" + new StringToken(propName).humanized + "\"";
        }

        // expand flagValue template
        const replacer = /\${/g;
        return "`" + flag.replace(replacer, (val => "${item.")) + "`";
    }

    get flags() {
        const ret: Array<{ expression: string }> = [];

        for (const prop of this.allProperties) {
            if (prop.flag && prop.propName) {

                if (!prop.flagValue) {
                    ret.push({ expression: `if (item.${prop.propName}) { planNode.flags.push("${(new StringToken(prop.propName)).humanized}"); }` });
                } else {

                    // expand flagValue template
                    const replacer = /\${/g;
                    const templ = "`" + prop.flagValue.replace(replacer, (val => "${item.")) + "`";
                    ret.push({ expression: `if (item.${prop.propName}) { planNode.flags.push(${templ}); }` });
                }
            }
        }
        return ret;
    }

    get nameSets() {
        const ret: Array<{ value: string }> = [];

        for (const prop of this.allProperties) {
            if (prop.nameSet && prop.propName) {

                if (prop.nameSet === "true") {
                    ret.push({ value: `if (item.${prop.propName}) { planNode.nameSet.push(item.${prop.propName}); }` });
                } else {

                    // expand template template
                    const replacer = /\${/g;
                    const templ = "`" + prop.nameSet.replace(replacer, (val => "${item.")) + "`";
                    ret.push({ value: `if (item.${prop.propName}) { planNode.flags.push(${templ}); }` });
                }
            }
        }
        return ret;
    }

    get metrics() {
        const ret: Array<{ value: string }> = [];

        for (const prop of this.allProperties) {

            if (prop.propName) {
                const group = prop.metricsCategory ? prop.metricsCategory : "General";

                if (prop.estimated) {
                    const val = this.getDisplayName(prop.propName, prop.estimated);
                    ret.push({ value: `planNode.metrics.add("${group}", ${val}, item.${prop.propName});` });
                }

                if (prop.actual) {
                    const val = this.getDisplayName(prop.propName, prop.actual);
                    ret.push({ value: `planNode.metrics.add("${group}", ${val}, item.${prop.propName}, 0);` });
                }

            }
        }
        return ret;
    }

    get convertableProperties() {
        return this.allProperties.filter((val, index, arr) => {
            return !!val.tsConvertor;
        });
    }
}