### 实现以下功能

- 在 props.js中
- 函数名 trackProps
- 使用 proxy 实现
- 功能，链式函数调用，函数名作为props的key，函数传参作为 props的value
```js

// 例如
const props = {};
trackProps(props).name('li').onClick(()=>{}).test('test')

// props 会返回
{
    name:"li",
    onClick:()=>{},
    test:"test"
}

```