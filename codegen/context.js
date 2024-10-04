"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xpath = require("xpath");
const stringToken_1 = require("./stringToken");
const classObject_1 = require("./classObject");
const classSimpleObject_1 = require("./classSimpleObject");
const classProperty_1 = require("./classProperty");
const classPlanStatement_1 = require("./classPlanStatement");
const classPropertyElement_1 = require("./classPropertyElement");
function loadModel(doc) {
    const context = new Context(doc);
    return context;
}
exports.loadModel = loadModel;
class Context {
    constructor(doc) {
        this.doc = doc;
        this.baseClassNames = {};
        this.classSet = {};
        this.classes = [];
        this.simpleTypes = [];
        this.convertors = {};
        this.enums = new Map();
        this.root = new XElement(doc.documentElement);
        this.xp = xpath.useNamespaces(namespaces);
        this.collectBaseClasses();
        this.processBaseClasses();
        this.processClasses();
        this.processInferredClasses();
        this.collectEnums();
        this.collectSimpleTypes();
        this.postProcess();
    }
    get classesByRef() {
        const cls = [];
        for (const className in this.classSet) {
            if (this.classSet.hasOwnProperty(className)) {
                const classItem = this.classSet[className];
                cls.push(classItem);
            }
        }
        return cls.sort((f, s) => {
            return f.inRef - s.inRef;
        });
    }
    get nodeClasses() {
        const cls = [];
        for (const className in this.classSet) {
            if (this.classSet.hasOwnProperty(className)) {
                const classItem = this.classSet[className];
                if (classItem.isNode) {
                    cls.push(classItem);
                }
            }
        }
        return cls;
    }
    postProcess() {
        // adjust property names, types, etc
        for (const className in this.classSet) {
            if (this.classSet.hasOwnProperty(className)) {
                const classItem = this.classSet[className];
                if (!classItem.isCollectionClass) {
                    for (const propItem of classItem.propertyElements) {
                        if (propItem.definitionType) {
                            const pc = this.classSet[propItem.definitionType];
                            if (pc && pc.collectionClassProperty) {
                                propItem.declareType = pc.collectionClassProperty.definitionType + "[]";
                            }
                        }
                    }
                }
            }
        }
        // 
        for (const className in this.classSet) {
            if (this.classSet.hasOwnProperty(className)) {
                const classItem = this.classSet[className];
                this.combineClasses(classItem, classItem);
                let current = classItem;
                while (current.baseName) {
                    current = this.classSet[current.baseName];
                    this.combineClasses(current, classItem);
                }
            }
        }
        for (const st of this.simpleTypes) {
            if (st.hasEnums) {
                this.convertors[st.name.value] = true;
            }
        }
        // build a logical tree
        this.logicalTreeBuilder();
    }
    logicalTreeBuilder() {
        // calculate number of references to the class
        for (const className in this.classSet) {
            if (this.classSet.hasOwnProperty(className)) {
                const classItem = this.classSet[className];
                for (const prop of classItem.allPropertyElements) {
                    let defType = prop.definitionType;
                    if (defType) {
                        if (defType.endsWith("[]")) {
                            defType = defType.substring(0, defType.length - 2);
                        }
                        const tp = this.classSet[defType];
                        if (tp) {
                            tp.inRef++;
                        }
                    }
                }
            }
        }
    }
    combineClasses(source, target) {
        source.properties.forEach((item) => target.allProperties.push(item));
        source.planStatement.forEach((item) => target.allPlanStatement.push(item));
        source.planNode.forEach((item) => target.allPlanNode.push(item));
        source.propertyElements.forEach((item) => target.allPropertyElements.push(item));
        if (source.isBatch) {
            target.isBatch = true;
        }
        if (source.isStatement) {
            target.isStatement = true;
        }
        if (source.isNode) {
            target.isNode = true;
        }
    }
    collectBaseClasses() {
        console.info("collecting base classes");
        this.root.selectElements(".//xsd:extension")
            .forEach((el) => {
            const base = el.getAttribute("base");
            if (base) {
                const baseName = base.substring(4);
                this.baseClassNames[baseName] = el;
            }
        });
    }
    processBaseClasses() {
        console.info("processing base classes");
        this.root.selectElements(".//xsd:complexType")
            .forEach((el) => {
            const name = el.getAttribute("name");
            if (name) {
                if (this.baseClassNames[name] !== undefined) {
                    this.processClass(el);
                }
            }
        });
    }
    processClasses() {
        console.info("processing classes");
        this.root.selectElements(".//xsd:complexType")
            .forEach((el) => {
            const name = el.getAttribute("name");
            if (name) {
                if (this.baseClassNames[name] === undefined) {
                    this.processClass(el);
                }
            }
        });
    }
    processInferredClasses() {
        console.info("processing inferred classes");
        const elements = xPath([
            ".//xsd:complexType//xsd:element[not(@type)]",
            ".//xsd:element[not(@type)]",
            ".//xsd:element[not(@type)]//xsd:element[not(@type)]"
        ], this.doc);
        elements.forEach((item) => {
            const baseTypeItem = item.getAncestor("xsd:complexType");
            const baseName = item.getElementAttribute("ancestor::xsd:complexType", "name", "");
            const className = item.getClassName();
            const complexType = item.selectElement("xsd:complexType");
            if (!complexType) {
                throw new Error("complex type is missing");
            }
            this.processClass(complexType, className);
        });
    }
    collectEnums() {
        this.root.selectElements(".//xsd:enumeration").forEach((el) => {
            const value = el.getAttribute("value");
            if (value) {
                const camelSuffix = el.sspPreserveCase ? "Capital" : null;
                const key = value + camelSuffix;
                if (!this.enums.has(key)) {
                    this.enums.set(key, new stringToken_1.StringToken(value, camelSuffix));
                }
            }
        });
    }
    collectSimpleTypes() {
        this.root.selectElements(".//xsd:simpleType[@name]")
            .forEach((item) => {
            const name = item.getAttribute("name");
            if (name) {
                const so = new classSimpleObject_1.ClassSimpleObject(new stringToken_1.StringToken(name));
                const existing = this.simpleTypes.find(i => i.name.value === so.name.value);
                if (!existing) {
                    item
                        .selectElements("xsd:restriction/xsd:enumeration")
                        .forEach((eitem) => {
                        const val = eitem.getAttribute("value");
                        if (val) {
                            const cs = eitem.sspPreserveCase ? "Capital" : null;
                            const ev = new stringToken_1.StringToken(val, cs);
                            so.enums.push(ev);
                            if (!item.sspKeepAsIs) {
                                if (ev.humanized !== val) {
                                    so.altEnums.push(ev);
                                }
                            }
                        }
                    });
                    this.simpleTypes.push(so);
                }
            }
        });
    }
    processClass(cl, name) {
        const className = name ? name : cl.getAttribute("name");
        if (!className)
            throw new Error("class name is missing");
        const co = new classObject_1.ClassObject(className);
        co.name = className;
        if (!this.classSet[co.name]) {
            let baseName = cl.getElementAttribute("xsd:complexContent/xsd:extension", "base");
            co.baseName = (baseName) ?
                baseName.substring(4) : undefined;
            co.isNode = cl.sspPlanNode === "true";
            co.isStatement = cl.sspPlanStatement === "true";
            co.isBatch = cl.sspPlanBatch === "true";
            co.bindToNode = cl.bindToNode;
            if (co.isNode) {
                console.info(`processing node class ${className}`);
            }
            // collect properties
            cl.selectElements("xsd:attribute | xsd:complexContent/xsd:extension/xsd:attribute")
                .forEach(attr => {
                // console.info("processing class attribute");
                const propName = attr.getAttribute("name");
                if (!propName)
                    throw new Error("property name is missing");
                const prop = new classProperty_1.ClassProperty(this.convertors, propName, attr.sspAltName);
                prop.title = attr.sspTitle;
                prop.subTitle = attr.sspSubTitle;
                prop.type = attr.getAttribute("type");
                prop.group = attr.sspGroup;
                prop.displayName = attr.sspDisplayName;
                prop.flag = attr.sspFlag;
                prop.flagValue = attr.sspFlagValue;
                prop.flagDefault = attr.sspFlagDefault;
                prop.nameSet = attr.sspNameSet;
                prop.estimated = attr.sspEstimated;
                prop.actual = attr.sspProperty;
                prop.metricsCategory = attr.sspMetricsCategory;
                if (prop.actual)
                    console.info(prop);
                if (!prop.type) {
                    var so = new classSimpleObject_1.ClassSimpleObject(className + prop.propName + "Enum");
                    attr.selectElements("xsd:simpleType/xsd:restriction/xsd:enumeration")
                        .forEach(item => {
                        const val = item.getAttribute("value");
                        if (val) {
                            const cs = item.sspPreserveCase ? "Capital" : null;
                            const ev = new stringToken_1.StringToken(val, cs);
                            so.enums.push(ev);
                            if (ev.humanized !== val) {
                                so.altEnums.push(ev);
                            }
                        }
                    });
                    if (so.altEnums.length > 0) {
                        prop.type = "shp:" + so.name.value;
                        const existing = this.simpleTypes.find(i => i.name.value === so.name.value);
                        if (!existing) {
                            this.simpleTypes.push(so);
                        }
                    }
                }
                co.properties.push(prop);
            });
            cl.selectElements(".//xsd:attribute[ssp:annotation/@attachToStatement] | .//xsd:attribute[ssp:annotation/@statementSetter] | .//xsd:attribute[ssp:annotation/@setToStatement]")
                .forEach(item => {
                //console.info("processing class statement attach");
                const name = item.getAttribute("name");
                if (!name)
                    throw new Error("name is missing");
                var planst = new classPlanStatement_1.ClassPlanStatement(name);
                planst.group = item.sspGroup;
                planst.displayName = item.sspDisplayName;
                planst.statementSetter = item.sspSetToStatement ? `set${name}({{value}})` : item.sspStatementSetter;
                co.planStatement.push(planst);
            });
            cl.selectElements(".//xsd:attribute[ssp:annotation/@attachToNode] | .//xsd:attribute[ssp:annotation/@planNodeSetter] | .//xsd:attribute[ssp:annotation/@setToNode]")
                .forEach(item => {
                //console.info("processing class node attach");
                const name = item.getAttribute("name");
                if (!name)
                    throw new Error("name is missing");
                var planst = new classPlanStatement_1.ClassPlanStatement(name);
                planst.group = item.sspGroup;
                planst.displayName = item.sspDisplayName;
                planst.planNodeSetter = item.sspSetToNode ? `set${name}({{value}})` : item.sspPlanNodeSetter;
                co.planNode.push(planst);
            });
            const clElements = [];
            cl.lookupXsdElement(clElements);
            clElements.forEach(item => {
                //console.info("processing class elements");
                let type = item.getAttribute("type");
                if (type) {
                    type = type.substring(4);
                }
                else {
                    type = item.getClassName();
                }
                const name = item.getAttribute("name");
                if (!name)
                    throw new Error("name is missing");
                const prop = new classPropertyElement_1.ClassPropertyElement(name);
                prop.declareType = item.sspDeclareType;
                prop.className = type;
                prop.isArray = item.isArray;
                co.propertyElements.push(prop);
                const pprop = new classPlanStatement_1.ClassPlanStatement(name);
                pprop.group = item.sspGroup;
                pprop.displayName = item.sspDisplayName;
                pprop.planNodeSetter = item.sspSetToNode ? `set${name}({{value}})` : item.sspPlanNodeSetter;
                pprop.statementSetter = item.sspSetToStatement ? `set${name}({{value}})` : item.sspStatementSetter;
                pprop.bindToNodeAs = item.bindToNodeAs;
                pprop.bindToStatementAs = item.bindToStatementAs;
                pprop.property = prop;
                if (item.sspAttachToStatement) {
                    co.planStatement.push(pprop);
                }
                if (item.sspAttachToNode) {
                    co.planNode.push(pprop);
                }
            });
            if (!this.classSet[co.name]) {
                this.classes.push(co);
                this.classSet[co.name] = co;
            }
        }
    }
}
exports.Context = Context;
const namespaces = {
    "ssp": "http://schemas.ttrider.com/supratimas/annotations",
    "shp": "http://schemas.microsoft.com/sqlserver/2004/07/showplan",
    "xsd": "http://www.w3.org/2001/XMLSchema"
};
const xp = xpath.useNamespaces(namespaces);
function xPath(xpaths, node) {
    if (Array.isArray(xpaths)) {
        const m = new Set();
        for (const xpi of xpaths) {
            for (const item of xp(xpi, node)) {
                m.add(new XElement(item));
            }
        }
        return Array.from(m);
    }
    else {
        const a = [];
        for (const item of xp(xpaths, node)) {
            a.push(new XElement(item));
        }
        return a;
    }
}
class XElement {
    get value() {
        return this.el.textContent;
    }
    constructor(el) {
        this.el = el;
    }
    selectElement(path) {
        const sel = xp(path, this.el, true);
        if (sel) {
            return new XElement(sel);
        }
        return null;
    }
    selectElements(path) {
        const ret = [];
        const sel = xp(path, this.el);
        sel.forEach((item) => {
            ret.push(new XElement(item));
        });
        return ret;
    }
    getElementAttribute(elementXpath, attrName, defaultValue = null) {
        const sel = xp(elementXpath, this.el, true);
        if (sel) {
            const xsel = new XElement(sel);
            return xsel.getAttribute(attrName, defaultValue);
        }
        return defaultValue;
    }
    getAttribute(name, defaultValue = null) {
        // ssp attributes has been moved to elements
        const ns = this.getNS(name);
        if (ns === "http://schemas.ttrider.com/supratimas/annotations") {
            // let's try element first
            const ael = this.selectElement(name);
            if (ael && ael.value != null) {
                return ael.value;
            }
            return defaultValue;
        }
        const av = this.el.getAttribute(name);
        if (av !== null) {
            return av;
        }
        return defaultValue;
    }
    getNS(name) {
        const parts = name.split(":");
        if (parts.length > 1) {
            const name = parts[0];
            return namespaces[name];
        }
        return undefined;
    }
    // getElement(name: string) {
    //     for (const elItem of this.el.children) {
    //         if (elItem.nodeName === name) {
    //             return new XElement(elItem);
    //         }
    //     }
    //     return undefined;
    // }
    getAncestor(name) {
        let parent = this.el.parentElement;
        while (parent) {
            if (parent.nodeName === name) {
                return new XElement(parent);
            }
            parent = parent.parentElement;
        }
        return null;
    }
    getClassName() {
        const baseName = this.getElementAttribute("ancestor::xsd:complexType[@name]", "name", "");
        const name = this.getAttribute("name");
        if (baseName !== null) {
            return baseName + name;
        }
        return name;
    }
    get isRequired() {
        let minOccurs = this.el.getAttribute("minOccurs");
        return !(minOccurs === "0");
    }
    get isArray() {
        let maxOccurs = this.el.getAttribute("maxOccurs");
        if (maxOccurs === "unbounded") {
            return true;
        }
        if (maxOccurs === null) {
            maxOccurs = "1";
        }
        if (parseInt(maxOccurs) > 1) {
            return true;
        }
        return false;
    }
    lookupXsdElement(elements) {
        for (const el of this.selectElements("xsd:sequence | xsd:choice | xsd:complexContent | xsd:extension")) {
            el.lookupXsdElement(elements);
        }
        for (const el of this.selectElements("xsd:element")) {
            elements.push(el);
        }
    }
    //#region SSP
    get sspPreserveCase() {
        return this.getElementAttribute("ssp:annotation", "preserveCase", "false") === "true";
    }
    get sspKeepAsIs() {
        return this.getElementAttribute("ssp:annotation", "keepAsIs", "false") === "true";
    }
    get sspTitle() {
        return this.getElementAttribute("ssp:annotation", "title", "false") === "true";
    }
    get sspSubTitle() {
        return this.getElementAttribute("ssp:annotation", "subTitle", "false") === "true";
    }
    get bindToNode() {
        return this.getElementAttribute("ssp:annotation", "bindToNode", "false") === "true";
    }
    get bindToNodeAs() {
        return this.getElementAttribute("ssp:annotation", "bindToNodeAs");
    }
    get bindToStatementAs() {
        return this.getElementAttribute("ssp:annotation", "bindToStatementAs");
    }
    get sspFlag() {
        return this.getElementAttribute("ssp:annotation", "flag", "false") === "true";
    }
    get sspFlagValue() {
        return this.getElementAttribute("ssp:annotation", "flagValue");
    }
    get sspFlagDefault() {
        return this.getElementAttribute("ssp:annotation", "flagDefault");
    }
    get sspNameSet() {
        return this.getElementAttribute("ssp:annotation", "nameSet");
    }
    get sspAttachToStatement() {
        if (this.sspSetToStatement) {
            return true;
        }
        if (this.sspPlanNodeSetter) {
            return true;
        }
        if (this.bindToStatementAs) {
            return true;
        }
        return this.getElementAttribute("ssp:annotation", "attachToStatement", "false") === "true";
    }
    get sspAttachToNode() {
        if (this.sspSetToNode) {
            return true;
        }
        if (this.sspPlanNodeSetter) {
            return true;
        }
        if (this.bindToNodeAs) {
            return true;
        }
        if (this.sspEstimated) {
            return true;
        }
        if (this.sspProperty) {
            return true;
        }
        return this.getElementAttribute("ssp:annotation", "attachToNode", "false") === "true";
    }
    get sspSetToNode() {
        return this.getElementAttribute("ssp:annotation", "setToNode", "false") === "true";
    }
    get sspSetToStatement() {
        return this.getElementAttribute("ssp:annotation", "setToStatement", "false") === "true";
    }
    get sspEstimated() {
        return this.getElementAttribute("ssp:annotation", "estimated");
    }
    get sspProperty() {
        return this.getElementAttribute("ssp:annotation", "property");
    }
    get sspMetricsCategory() {
        return this.getElementAttribute("ssp:annotation", "category");
    }
    get sspPlanNode() {
        return this.getElementAttribute("ssp:annotation", "planNode");
    }
    get sspPlanStatement() {
        return this.getElementAttribute("ssp:annotation", "planStatement");
    }
    get sspPlanBatch() {
        return this.getElementAttribute("ssp:annotation", "planBatch");
    }
    get sspAltName() {
        return this.getElementAttribute("ssp:annotation", "altName");
    }
    get sspGroup() {
        return this.getElementAttribute("ssp:annotation", "group");
    }
    get sspDisplayName() {
        return this.getElementAttribute("ssp:annotation", "displayName");
    }
    get sspDeclareType() {
        return this.getElementAttribute("ssp:annotation", "declareType");
    }
    get sspPlanNodeSetter() {
        return this.getElementAttribute("ssp:annotation", "planNodeSetter");
    }
    get sspStatementSetter() {
        return this.getElementAttribute("ssp:annotation", "statementSetter");
    }
}
//# sourceMappingURL=context.js.map