import * as ko from "knockout";
import * as test from 'tape';

import * as fs from 'fs';
import * as path from 'path';
import { parse } from "../src/sqlplan/saxparser";
import { AppPlan } from "../src/app/plan";
import { Plan, PlanNode } from "../src/sqlplan/model";

//const detectCharacterEncoding = require('detect-character-encoding');

import { detectEncoding } from 'char-encoding-detector';

const dirGlob = require('dir-glob');

ko.options.deferUpdates = true;

function safeJson(plan: Plan): string {
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

function parseFile(filePath: string) {
	const fileBuffer = fs.readFileSync(filePath);
	//const charsetMatch = detectCharacterEncoding(fileBuffer);

	const charsetMatch = detectEncoding(fileBuffer);

	const data = fileBuffer.toString(charsetMatch as string);
	return parse("simplePlan", data);
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
	if (!rootNode) { t.fail(); return; }

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

