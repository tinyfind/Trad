// import props from "./proxy/props"

import trackProps from "./proxy/props";
import React from "react";

let currentNodeList = [];

// 渲染节点列表
function renderNodeList(list) {
  return list?.map((node) => {
    return React.createElement(node.Comp, node.props, node.children);
  });
}

// 收集组件节点
function trackComp(Comp, props, children) {
  currentNodeList.push({ Comp, props, children });
}

// 收集children节点
export function trackChildren(childRender) {
  if (!childRender) return null;
  const prevNodeList = currentNodeList;
  currentNodeList = [];
  try {
    childRender?.();
    const children = renderNodeList(currentNodeList);
    return children;
  } finally {
    currentNodeList = prevNodeList;
  }
}

export function GRComp(Comp) {
  return (...args) => {
    const [childRender] = args.reverse();
    const children = trackChildren(childRender);
    const props = {};
    console.log(Comp, props, children, "props===");

    trackComp(Comp, props, children);
    return trackProps(props);
  };
}

// 高阶组件工厂
export function GComp(Comp) {
  return (...args) => {
    const [childRender] = args.reverse();
    const children = trackChildren(childRender);
    const props = {};
    console.log(Comp, props, children, "props===");

    // 定制Comp
    function SpecialComp(props) {
      const compHook = () => {
        Comp(props);
      };
      return trackChildren(compHook);
    }
    trackComp(SpecialComp, props, children);
    return trackProps(props);
  };
}

export function renderComp(Comp) {
  Comp();
  return renderNodeList(currentNodeList)[0];
}
