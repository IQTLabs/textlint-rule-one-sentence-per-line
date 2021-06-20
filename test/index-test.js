import TextLintTester from "textlint-tester"
import rule from "../src/index"

const tester = new TextLintTester()

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
    "## This is a second title. It has two sentences.",
    // indentation after a new line shouldn't affect anything
    "This is a line.\n\n   This is a second.\n   This is a third indented line.",
    "This is a line.\n\n   This is a second.   \n   This is a third indented line.",
    "This is a line.\n\n   This is a second.  \t  \t\n   This is a third indented line.",
    "This is a line.\n\n   This is a second.\n\tThis is a third indented line.",
    // Ordered lists detect correctly
    "1. One sentence.\n2. Another sentence.",
    "1. This is a list.\n   It has complex entries.\n   Indentation causes them to group correctly.\n2. Each may have multiple sentences.",
    // Don't make code SemBr
    "This sentence precedes a code block:\n\n\tThis is code. Don't split me.",
    "This sentence precedes a code block:\n\n    This is code. Don't split me.",
    "This is a line with a URL https://example.com?foo=bar but only one sentence."
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
    // Disabled due to https://github.com/azu/sentence-splitter/issues/25
    //{
    //  text:
    //    "[This link has more than one sentence. It has two lines.](https://example.com)",
    //  output:
    //    "[This link has more than one sentence.\nIt has two lines.](https://example.com)",
    //  errors: [
    //    {
    //      message: "More than one sentence per line"
    //    }
    //  ]
    //},

    // inside emphasis
    // Disabled due to https://github.com/azu/sentence-splitter/issues/24
    //{
    //  text: "**This emphasis has more than one sentence. It has two lines.**",
    //  output:
    //    "**This emphasis has more than one sentence.\nIt has two lines.**",
    //  errors: [
    //    {
    //      message: "More than one sentence per line"
    //    }
    //  ]
    //},

    {
      text:
        "1. This is a sentence. \n\n   This is a second sentence. This is a third sentence.",
      output:
        "1. This is a sentence. \n\n   This is a second sentence.\nThis is a third sentence.",
      errors: [
        {
          message: "More than one sentence per line"
        }
      ]
    }
  ]
})
