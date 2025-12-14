function trackProps(props) {
  // 创建代理对象
  const proxy = new Proxy({}, {
    get(target, property) {
      // 返回一个函数，用于设置属性值
      return (arg) => {
        // 将函数名作为 key，函数传参作为 value 设置到 props 对象中
        props[property] = arg;
        // 返回代理对象，支持链式调用
        return proxy;
      };
    }
  });

  // 返回代理对象
  return proxy;
}

export default trackProps;