import { Router } from "express";
import { execSync } from "child_process";
import { Test } from "../models";
import fs from "fs";
import Handlebars from "handlebars";
import Path from "path";

//Types
import { PopulatedITest } from "../models/test";
import { ITestCase } from "../models/testCase";

const router = Router();

// Handle testing request
router.post("/:id", async (req, res) => {
  if (!req.currentUser)
    return res
      .status(400)
      .json({ message: "You must be logged in to send start a test." });

  // Get Test data and convert it to JSON
  let test = await Test.findById(req.params.id);
  let testCases: Array<ITestCase> = [];
  await test
    .populate<Pick<PopulatedITest, "testCases">>("testCases")
    .then((doc) => {
      testCases = doc.testCases;
    });
  let testJSON = test.toJSON();

  // Create a test folder for this session
  const dir = `${test._id}-${req.currentUser._id}`;
  const pathname = Path.join(__dirname, "client", dir);
  if (fs.existsSync(pathname)) {
    return res
      .status(400)
      .json({ message: "You cannot run multiple instances of the same test." });
  } else {
    fs.mkdirSync(pathname, { recursive: true });
  }

  // Create handlebars template
  const templateContent = fs.readFileSync(
    Path.join(__dirname, "templates/javascript.handlebars")
  );
  const template = Handlebars.compile(templateContent.toString());

  // Format data and use it to create text with handlebars template
  const temp = testCases.at(0);
  let parameterCount = 0;
  if (temp) parameterCount = temp.parameters.length;

  const data = {
    parameters: testCases.map((testCases) => testCases.parameters),
    code: req.body.code,
    expectedOutputs: testCases.map((testCase) => testCase.expectedOutput),
    methodName: testJSON.methodName,
    className: testJSON.className,
    parameterCount,
  };

  const testFileContent = template(data);

  // Create test file, execute it synchronously and then send output to client
  fs.writeFileSync(Path.join(pathname, "test.js"), testFileContent);
  try {
    const process = execSync(`node ${Path.join(pathname, "test.js")}`);
    const results = process.toString().trim();
    
    const resultsSplit = results.split('\n');
    let resultData: Array<Object> = []
    for (let result of resultsSplit) {
      let resultSplit = result.split('|')
      resultData.push({
        status: resultSplit[0],
        inputs: resultSplit[1],
        expected: resultSplit[2],
        output: resultSplit[3]
      })
    }
    res.status(200).send({
      results: resultData
    });
  } catch (err) {
    res.status(400).send(err);
  }

  // Delete client test directory
  fs.rm(pathname, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
  });
});

export default router;
