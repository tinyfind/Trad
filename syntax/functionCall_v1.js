module.exports = function(superClass) {
  return class FunctionCallParserMixin extends superClass {
    // After normal subscripts are parsed, support trailing closure syntax: fn{ ... } or fn(...){...}
    parseSubscripts(base, startLoc, noCalls) {
      // First let the original parser do its work
      base = super.parseSubscripts(base, startLoc, noCalls);

      // Only proceed if not in a no-calls context and next token is a brace
      // Token 5 corresponds to '{' (braceL) in this parser build.
      try {
        if (!noCalls && this.match(5)) {
          // Only allow trailing closure on simple call targets: Identifier, MemberExpression, or CallExpression
          if (base && (base.type === "Identifier" || base.type === "MemberExpression" || base.type === "CallExpression")) {
            // Parse the block as the body of an arrow function
            const block = this.parseBlock();

            // Build a simple ArrowFunctionExpression with empty params
            const arrowNode = this.startNodeAt(block.loc.start);
            arrowNode.params = [];
            arrowNode.async = false;
            arrowNode.generator = false;
            arrowNode.body = block;
            const arrowFn = this.finishNode(arrowNode, "ArrowFunctionExpression");

            // Correctly construct CallExpression:
            // - If base is a CallExpression with zero args (explicit empty parens), ignore the empty parens and use base.callee as callee with the arrow as sole argument: a(){} -> a(()=>{})
            // - If base is a CallExpression with existing args, append the arrow to arguments: a(1,2){} -> a(1,2, ()=>{})
            // - Otherwise (base is Identifier or MemberExpression), create CallExpression with base as callee and arrow as only argument
            let callNode;
            if (base.type === "CallExpression") {
              const callee = base.callee;
              const prevArgs = base.arguments || [];
              if (prevArgs.length === 0) {
                callNode = this.startNodeAt(callee.loc ? callee.loc.start : startLoc);
                callNode.callee = callee;
                callNode.arguments = [arrowFn];
              } else {
                callNode = this.startNodeAt(base.loc ? base.loc.start : startLoc);
                callNode.callee = callee;
                callNode.arguments = prevArgs.slice();
                callNode.arguments.push(arrowFn);
              }
            } else {
              callNode = this.startNodeAt(base.loc ? base.loc.start : startLoc);
              callNode.callee = base;
              callNode.arguments = [arrowFn];
            }

            const finished = this.finishNode(callNode, "CallExpression");

            // Continue parsing subscripts (chain calls / member access) on the newly created CallExpression
            return this.parseSubscripts(finished, startLoc, noCalls);
          }
        }
      } catch (e) {
        // On any unexpected error, fall back to returning the original base
        if (e instanceof SyntaxError) throw e; 
        return base;
      }

      return base;
    }
  };
};
