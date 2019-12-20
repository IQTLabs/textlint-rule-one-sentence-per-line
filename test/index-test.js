"use strict"
const TextLintTester = require("textlint-tester")
const tester = new TextLintTester()
// rule
const rule = require("../src/index").default
// ruleName, rule, { valid, invalid }
tester.run("rule", rule, {
  valid: [
    // no problem
    "This is a sentence.\nThis is another sentence on a second line.",
    "This is a sentence.\n> This is another sentence in a quotation.",
    // Don't worry about multiple lines in titles
    "# This is the title.\nThis is a single sentence.",
    "# This is the title. It has two sentences.",
    // or H2 titles
    "## This is a second title. It has two sentences."
  ],
  invalid: [
    // single match
    {
      text: "This is a sentence. This is another sentence.",
      output: "This is a sentence.\nThis is another sentence.",
      errors: [
        {
          message: "More than one sentence per line"
        }
      ]
    },
    {
      text:
        "This is a sentence. This is another sentence. This is a third sentence.",
      output:
        "This is a sentence.\nThis is another sentence.\nThis is a third sentence.",
      errors: [
        {
          message: "More than one sentence per line"
        }
      ]
    },
    // inside a quote
    {
      text:
        "This is a sentence.\n> This is a quoted sentence. This is another sentence, which is also quoted.",
      output:
        "This is a sentence.\n> This is a quoted sentence.\nThis is another sentence, which is also quoted.",
      errors: [
        {
          message: "More than one sentence per line"
        }
      ]
    },

    // inside a link
    {
      text:
        "[This link has more than one sentence. It has two lines.](https://example.com)",
      output:
        "[This link has more than one sentence.\nIt has two lines.](https://example.com)",
      errors: [
        {
          message: "More than one sentence per line"
        }
      ]
    },

    // inside emphasis
    {
      text: "**This emphasis has more than one sentence. It has two lines.**",
      output:
        "**This emphasis has more than one sentence.\nIt has two lines.**",
      errors: [
        {
          message: "More than one sentence per line"
        }
      ]
    }
  ]
})
