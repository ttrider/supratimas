"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const xmldom_1 = require("xmldom");
const util = require("util");
const context_1 = require("./context");
const m = require("mustache");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
console.info("Supratimas Model Generator");
if (process.argv.length < 3) {
    console.info("genjs <model file>");
    process.exit(0);
}
generate();
function generate() {
    return __awaiter(this, void 0, void 0, function* () {
        const modelDocument = yield loadModelDocument();
        const context = context_1.loadModel(modelDocument);
        //await renderTemplate(context, "./literals.mustache", "../src/sqlplan/literals.ts");
        // await renderTemplate(context, "./factory.mustache", "../src/sqlplan/factory.ts");
        yield renderTemplate(context, "./saxfactory.mustache", "../src/sqlplan/saxfactory.ts", {
            "saxtypes": "./saxtypes.mustache",
            "literals": "./literals.mustache"
        });
        yield renderTemplate(context, "./list.mustache", "../src/list.md");
    });
}
function renderTemplate(context, templateFile, outputFile, partials) {
    return __awaiter(this, void 0, void 0, function* () {
        templateFile = path.resolve(templateFile);
        outputFile = path.resolve(outputFile);
        console.info(`using template: ${templateFile}`);
        const templateData = yield readFile(templateFile);
        if (partials) {
            for (const name in partials) {
                if (partials.hasOwnProperty(name)) {
                    const partial = partials[name];
                    const partialTemplate = yield readFile(partial);
                    partials[name] = partialTemplate.toString();
                }
            }
        }
        const outputData = m.render(templateData.toString(), context, partials);
        console.info(`output into: ${outputFile}`);
        return writeFile(outputFile, outputData);
    });
}
function loadModelDocument() {
    return __awaiter(this, void 0, void 0, function* () {
        const modelFile = path.resolve(process.argv[2]);
        console.info(`loading model: ${modelFile}`);
        return readFile(modelFile)
            .then((data) => data.toString())
            .then((data) => {
            const modelDom = new xmldom_1.DOMParser();
            return modelDom.parseFromString(data);
        });
    });
}
//# sourceMappingURL=index.js.map