import e from "express";
import Handlebars from "handlebars";
import { ITestCase } from "../../models/testCase";

export function config() {
  Handlebars.registerHelper("parameterize", parameterize);

  Handlebars.registerHelper("arrayify", arrayify);

  Handlebars.registerHelper("nested_array", (aList: Array<Array<any>>) => {
    let aString = "[";
    for (let i = 0; i < aList.length; i++) {
      let list = aList[i];
      if (i < aList.length - 1) {
        aString += arrayify(list) + ",";
      } else {
        aString += arrayify(list);
      }
    }
    return aString + "]";
  });

  Handlebars.registerHelper("anonymous_invoke", (aString: string) => {
    let count = Number(aString);
    if (isNaN(count)) return "Error getting parameter count";
    let array: Array<String> = [];
    for (let i = 0; i < count; i++) {
      array.push(`testCase[${i}]`);
    }
    return "(" + array.map(v => v) + ")";
  });
}

function parameterize(aList: Array<any>) {
  return (
    "(" +
    aList.map((v: any) => {
      if (typeof v == "string") {
        return '"' + v + '"';
      }
      return v;
    }) +
    ")"
  );
}

function arrayify(aList: Array<any>) {
  return (
    "[" +
    aList.map((v: any) => {
      if (typeof v == "string") {
        return '"' + v + '"';
      }
      return v;
    }) +
    "]"
  );
}
