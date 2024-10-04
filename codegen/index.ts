import * as path from "path";
import * as fs from "fs";

import { DOMParser as dom } from "xmldom";
import * as util from "util";
import { loadModel, Context } from "./context";
import * as m from "mustache";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);


console.info("Supratimas Model Generator");

if (process.argv.length < 3) {
    console.info("genjs <model file>");
    process.exit(0);
}

generate();


async function generate() {
    const modelDocument = await loadModelDocument();

    const context = loadModel(modelDocument);

    //await renderTemplate(context, "./literals.mustache", "../src/sqlplan/literals.ts");
    // await renderTemplate(context, "./factory.mustache", "../src/sqlplan/factory.ts");

    await renderTemplate(context, "./saxfactory.mustache", "../src/sqlplan/saxfactory.ts", {
        "saxtypes": "./saxtypes.mustache",
        "literals": "./literals.mustache"
    });

    await renderTemplate(context, "./list.mustache", "../src/list.md");
}


async function renderTemplate(context: Context, templateFile: string, outputFile: string, partials?: { [name: string]: string }) {

    templateFile = path.resolve(templateFile);
    outputFile = path.resolve(outputFile);

    console.info(`using template: ${templateFile}`);
    const templateData = await readFile(templateFile);

    if (partials) {
        for (const name in partials) {
            if (partials.hasOwnProperty(name)) {
                const partial = partials[name];
                const partialTemplate = await readFile(partial);
                partials[name] = partialTemplate.toString();
            }
        }
    }


    const outputData = m.render(templateData.toString(), context, partials);

    console.info(`output into: ${outputFile}`);
    return writeFile(outputFile, outputData);
}



async function loadModelDocument(): Promise<Document> {
    const modelFile = path.resolve(process.argv[2]);
    console.info(`loading model: ${modelFile}`);

    return readFile(modelFile)
        .then((data) => data.toString())
        .then((data) => {
            const modelDom = new dom();
            return modelDom.parseFromString(data);
        });
} 
