import trackProps from './props.js';

// 按照文档要求测试
const props = {};
// 调用 trackProps 函数，传入 props 对象，然后进行链式调用
const chainedResult = trackProps(props).name('li').onClick(()=>{}).test('test');

// 打印结果
console.log('props 对象结果:', props);
console.log('\n最终测试结果:');
console.log('name:', props.name);
console.log('onClick:', props.onClick);
console.log('test:', props.test);

// 验证结果是否符合预期
console.log('\n验证结果:');
console.log('name 属性值是否正确:', props.name === 'li');
console.log('onClick 属性是否为函数:', typeof props.onClick === 'function');
console.log('test 属性值是否正确:', props.test === 'test');