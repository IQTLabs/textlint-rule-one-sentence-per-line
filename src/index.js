const splitter = require("sentence-splitter")

/**
 * Get parents of node.
 * The parent nodes are returned in order from the closest parent to the outer ones.
 * @param node
 * @returns {Array}
 */
function getParents(node) {
  const result = []
  // child node has `parent` property.
  let parent = node.parent
  while (parent != null) {
    result.push(parent)
    parent = parent.parent
  }
  return result
}

/**
 * Return true if `node` is wrapped any one of `types`.
 * @param {TxtNode} node is target node
 * @param {string[]} types are wrapped target node
 * @returns {boolean|*}
 */
function isNodeWrapped(node, types) {
  const parents = getParents(node)
  const parentsTypes = parents.map(function(parent) {
    return parent.type
  })
  return types.some(function(type) {
    return parentsTypes.some(function(parentType) {
      return parentType === type
    })
  })
}

const reporter = context => {
  const { Syntax, RuleError, fixer, report, getSource } = context
  return {
    [Syntax.Str](node) {
      // Titles aren't sembr since breaks do affect them
      if (isNodeWrapped(node, [Syntax.Header])) {
        return
      }

      const text = getSource(node)
      const split = splitter.split(text)

      // if there is only one sentence in the line, return early it's following sembr
      if (split.filter(x => x.type == "Sentence").length == 1) {
        return
      }
      // Sometimes, we might get a case where two lines separated by whitespaces are
      // treated as a string Syntax.Str
      //
      // For example:
      //
      // Hello World!
      // My Name is Benjamin.
      //
      // Would yield ["Hello World!", "\n", "My name is Benjamin."] when split by sentence-splitter
      // This has two sentences in it but is proper sembr
      else if (
        split
          .filter(x => x.type == "WhiteSpace")
          .every(x => x.type == "WhiteSpace" && x.raw == "\n")
      ) {
        return
      }

      // insert the newlines
      const fixed = split
        .filter(x => x.type == "Sentence")
        .map(x => x.raw)
        .join("\n")

      // when we found more than one sentence per line, propose a fix
      report(
        node,
        new RuleError("More than one sentence per line", {
          fix: fixer.replaceText(node, fixed)
        })
      )
    }
  }
}

export default {
  linter: reporter,
  fixer: reporter
}
