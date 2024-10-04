"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ko = require("knockout");
const test = require("tape");
const fs = require("fs");
const path = require("path");
const saxparser_1 = require("../src/sqlplan/saxparser");
//const detectCharacterEncoding = require('detect-character-encoding');
const char_encoding_detector_1 = require("char-encoding-detector");
const dirGlob = require('dir-glob');
ko.options.deferUpdates = true;
function safeJson(plan) {
    const js = ko.toJS(plan);
    const json = JSON.stringify(js, (key, value) => {
        switch (key) {
            case "batch":
            case "statement":
            case "plan":
                return null;
        }
        if (key.charAt(0) === "_") {
            return null;
        }
        return value;
    }, 4);
    return json;
}
function parseFile(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    //const charsetMatch = detectCharacterEncoding(fileBuffer);
    const charsetMatch = char_encoding_detector_1.detectEncoding(fileBuffer);
    const data = fileBuffer.toString(charsetMatch);
    return saxparser_1.parse("simplePlan", data);
}
// test('simple plan', {
// 	skip: true
// }, (t) => {
// 	const testFolder = "./plans/set01/plans";
// 	fs.readdirSync(testFolder).forEach((file: string) => {
// 		if (path.extname(file) === ".sqlplan") {
// 			const filePath = path.resolve(testFolder, file);
// 			console.log(filePath);
// 			const fileBuffer = fs.readFileSync(filePath);
// 			const charsetMatch = detectEncoding(fileBuffer);
// 			//const charsetMatch = detectCharacterEncoding(fileBuffer);
// 			console.log(charsetMatch);
// 			const data = fileBuffer.toString(charsetMatch as string);
// 			//console.log(data);
// 			const plan = parse("simplePlan", data);
// 			//const js = ko.toJS(plan);
// 		}
// 	})
// 	t.end();
// });
test('ConditionPlan', { skip: true }, (t) => {
    const filePath = path.resolve("./plans/ConditionPlan.sqlplan");
    const plan = parseFile(filePath);
    const rootNode = plan.statements[0].root;
    if (!rootNode) {
        t.fail();
        return;
    }
    //t.isEqual(rootNode.title, "MERGE");
    t.end();
});
// test('simple plan', { skip: true }, (t) => {
// 	const filePath = path.resolve("./plans/simplePlan.sqlplan");
// 	const plan = parseFile(filePath);
// 	const rootNode = plan.statements[0].root;
// 	if (!rootNode) { t.fail(); return; }
// 	//t.isEqual(rootNode.title, "MERGE");
// 	t.end();
// });
// test('TestPLan 02_5', { skip: false }, (t) => {
// 	const filePath = path.resolve("./plans/TestPlan02_5.sqlplan");
// 	const plan = parseFile(filePath);
// 	const rootNode = plan.statements[0].root;
// 	if (!rootNode) { t.fail(); return; }
// 	//t.isEqual(rootNode.title, "COND WITH QUERY");
// 	t.end();
// });
// //
// fs.readFile("../plans/simplePlan.sqlplan",{encoding:"UTF-16LE"}, (err, data) => {
//   const planData = data.toString();
// const plan = parse("simplePlan", planData);
// const js = ko.toJS(plan);
// const json = JSON.stringify(js, (key, value) => {
//   switch (key) {
//     case "batch":
//     case "statement":
//     case "plan":
//       return null;
//   }
//   if (key.charAt(0) === "_") {
//     return null;
//   }
//   return value;
// }, 4);
// });
//# sourceMappingURL=sqlplan.js.map