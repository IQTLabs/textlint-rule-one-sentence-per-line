"use strict"
const TextLintTester = require("textlint-tester")
const tester = new TextLintTester()
// rule
const rule = require("../src/index").default
// ruleName, rule, { valid, invalid }
tester.run("rule", rule, {
  valid: [
    // no problem
    "text"
  ],
  invalid: [
    // single match
    {
      text: "This is a sentence. This is another sentence.",
      output: "This is a sentence.\nThis is another sentence.",
      errors: [
        {
          message: "Replaced."
        }
      ]
    }
    // multiple match
    //         {
    //             text: `It has many bugs.

    // One more bugs`,
    //             errors: [
    //                 {
    //                     message: "Found bugs.",
    //                     line: 1,
    //                     column: 13
    //                 },
    //                 {
    //                     message: "Found bugs.",
    //                     line: 3,
    //                     column: 10
    //                 }
    //             ]
    //         },
  ]
})
