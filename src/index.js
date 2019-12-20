// TODO: more reasonable example
const reporter = context => {
  // `context.fixer`
  const { Syntax, RuleError, fixer, report, getSource } = context
  return {
    [Syntax.Str](node) {
      const text = getSource(node)
      // "You fix this"
      //      ^^^
      const matchRegexp = /\bfix\b/
      if (!matchRegexp.test(text)) {
        return
      }
      // found "fixable" error
      const index = text.search(matchRegexp)
      const length = "fix".length
      const replace = fixer.replaceTextRange([index, index + length], "fixed")
      report(
        node,
        new RuleError("Replaced.", {
          // "You fix this"
          //      ^ index
          index,
          // "You fix this"
          //      ^^^
          //     fixed
          fix: replace
        })
      )
    }
  }
}
export default {
  linter: reporter,
  // This rule has fixer.
  fixer: reporter
}
