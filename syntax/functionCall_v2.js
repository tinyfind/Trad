module.exports = function(superClass) {
  return class FunctionCallParserMixin extends superClass {
    // After normal subscripts are parsed, support trailing closure syntax: fn{ ... } or fn(...){...}
    parseSubscripts(base, startLoc, noCalls) {
      // Try early handling: if base is a simple atom (Identifier/MemberExpression/CallExpression)
      // and next token is a brace, handle trailing closure before letting super consume subscripts.
      if (!noCalls && base && this.match(5)) {
        // Check if base is a CallExpression with a trailing closure
        if (base.type === "CallExpression") {
          const lastArg = base.arguments[base.arguments.length - 1];
          if (lastArg && lastArg.type === "ArrowFunctionExpression" && lastArg.body.type === "BlockStatement") {
            // This CallExpression already has a trailing closure, throw an error
            this.raise(Errors.UnexpectedToken, {
              unexpected: '{',
              expected: ';'
            });
          }
        }
        
        // Check if base is a valid expression for trailing closure
        if (base.type === "Identifier" || base.type === "MemberExpression" || base.type === "CallExpression") {
          try {
            const probe = this.tryParse(() => this.parseBlock());
            if (probe && !probe.error && !probe.aborted && probe.node) {
              const block = probe.node;
              const arrowNode = this.startNodeAt(block.loc.start);
              arrowNode.params = [];
              arrowNode.async = false;
              arrowNode.generator = false;
              arrowNode.body = block;
              const arrowFn = this.finishNode(arrowNode, "ArrowFunctionExpression");

              let callNode;
              if (base.type === "CallExpression") {
                const callee = base.callee;
                const prevArgs = base.arguments || [];
                callNode = this.startNodeAt(base.loc ? base.loc.start : startLoc);
                callNode.callee = callee;
                callNode.arguments = prevArgs.slice();
                callNode.arguments.push(arrowFn);
              } else {
                callNode = this.startNodeAt(base.loc ? base.loc.start : startLoc);
                callNode.callee = base;
                callNode.arguments = [arrowFn];
              }

              const finished = this.finishNode(callNode, "CallExpression");
              return this.parseSubscripts(finished, startLoc, noCalls);
            }
          } catch (e) {
            // On parse errors while probing, silently fall back and do not throw
            return base;
          }
        }
      }

      // Fallback: let the original parser consume subscripts (e.g. parentheses, member access)
      base = super.parseSubscripts(base, startLoc, noCalls);

      // After superclass handling, also attempt trailing closure when base may have become a CallExpression (e.g. a() then {} )
      try {
        if (!noCalls && this.match(5)) {
          // Check if base is a CallExpression with a trailing closure
          if (base.type === "CallExpression") {
            const lastArg = base.arguments[base.arguments.length - 1];
            if (lastArg && lastArg.type === "ArrowFunctionExpression" && lastArg.body.type === "BlockStatement") {
              // This CallExpression already has a trailing closure, throw an error
              this.raise(Errors.UnexpectedToken, {
                unexpected: '{',
                expected: ';'
              });
            }
          }
          
          if (base && (base.type === "Identifier" || base.type === "MemberExpression" || base.type === "CallExpression")) {
            const probe = this.tryParse(() => this.parseBlock());
            if (!probe || probe.error || probe.aborted || !probe.node) {
              return base;
            }
            const block = probe.node;
            const arrowNode = this.startNodeAt(block.loc.start);
            arrowNode.params = [];
            arrowNode.async = false;
            arrowNode.generator = false;
            arrowNode.body = block;
            const arrowFn = this.finishNode(arrowNode, "ArrowFunctionExpression");

            let callNode;
            if (base.type === "CallExpression") {
              const callee = base.callee;
              const prevArgs = base.arguments || [];
              callNode = this.startNodeAt(base.loc ? base.loc.start : startLoc);
              callNode.callee = callee;
              callNode.arguments = prevArgs.slice();
              callNode.arguments.push(arrowFn);
            } else {
              callNode = this.startNodeAt(base.loc ? base.loc.start : startLoc);
              callNode.callee = base;
              callNode.arguments = [arrowFn];
            }

            const finished = this.finishNode(callNode, "CallExpression");
            return this.parseSubscripts(finished, startLoc, noCalls);
          }
        }
      } catch (e) {
        // Re-throw any SyntaxError raised by this.raise()
        if (e instanceof SyntaxError) {
          throw e;
        }
        // On any unexpected non-SyntaxError, fall back to returning the original base
        return base;
      }

      return base;
    }
  };
};