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

router.post("/:id", async (req, res) => {
  if (!req.currentUser)
    return res
      .status(400)
      .json({ message: "You must be logged in to send start a test." });

  let test = await Test.findById(req.params.id);
  let testCases: Array<ITestCase> = [];
  await test
    .populate<Pick<PopulatedITest, "testCases">>("testCases")
    .then((doc) => {
      testCases = doc.testCases;
    });
  let testJSON = test.toJSON();
  // 1. create a test folder for this session
  const dir = `${test._id}-${req.currentUser._id}`;
  const pathname = Path.join(__dirname, "client", dir);
  if (fs.existsSync(pathname)) {
    return res
      .status(400)
      .json({ message: "You cannot run multiple instances of the same test." });
  } else {
    fs.mkdirSync(pathname, { recursive: true });
  }
  // 2. generate test file base off of test cases
  const templateContent = fs.readFileSync(
    Path.join(__dirname, "templates/javascript.handlebars")
  );
  const template = Handlebars.compile(templateContent.toString());

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
  console.log(data);
  const testFileContent = template(data);
  fs.writeFileSync(Path.join(pathname, "test.js"), testFileContent);
  // 3. execute synchronously
  try {
    const process = execSync(`node ${Path.join(pathname, "test.js")}`);
    const results = process.toString();
    res.status(200).send(results);
  } catch (err) {
    res.status(400).send(err);
  }
  fs.rmdir(pathname, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }

    console.log(`${pathname} is deleted!`);
  });
});

export default router;
