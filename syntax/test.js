const parser = require("./parser");
const generate = require("@babel/generator").default;

// 测试场景1：基本语法
const ast1 = parser.parse(
  `
 

    class A {
      test(){
        console.log("class method");
      }
    }

    const obj = {
      method(){
        console.log("object method");
      }
    };

    A.nest{
      deeper(){
      }
    }

    Flex{
    }
    `,
  {
    plugins: ["functionblock"],
  }
);

// 测试场景2：带参数的函数调用
const ast2 = parser.parse(
  `
    a(1, 2){
      console.log("with params");
    }
    `,
  {
    plugins: ["functionblock"],
  }
);

// 测试场景3：空括号函数调用
const ast3 = parser.parse(
  `
    a(){
      console.log("empty params");
    }
    `,
  {
    plugins: ["functionblock"],
  }
);

// 测试场景4：链式调用
const ast4 = parser.parse(
  `
    a{
      console.log("first");
    }.b{
      console.log("second");
    }
    `,
  {
    plugins: ["functionblock"],
  }
);

console.log("=== 场景1：基本语法 ===");
console.log(generate(ast1).code);
// console.log("\n=== 场景2：带参数的函数调用 ===");
// console.log(generate(ast2).code);
// console.log("\n=== 场景3：空括号函数调用 ===");
// console.log(generate(ast3).code);
// console.log("\n=== 场景4：链式调用 ===");
// console.log(generate(ast4).code);
