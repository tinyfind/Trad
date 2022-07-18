import { jsx as createElement } from "react/jsx-runtime";
import { jsxs as createStaticElement } from "react/jsx-runtime";
import { parseParams } from '../tools/parseParams'

// createElement(type,config,key)
import { warning, getType } from "../tools";
import { render } from "@testing-library/react";

// 定义 捕获 list
export let currentNodeList = null

// 解析element 随框架而定
function parseElement(comp, props = {}) {

	let element = { ...createStaticElement(comp, props) };
	return Object.assign(element, { props: { ...element.props } });

}

// 通过proxy 增加 扩展性
// 基础组件都集成 View 组件 View 不限制于div~
//
const basicMethods = {
	color(target, color) {
		Object.assign(target.props.style || (target.props.style = {}), { color });
	},
	onClick(target, onClick) {
		Object.assign(target.props, { onClick });
	},
	frame(target, width, height) {
		Object.assign(target.props.style || (target.props.style = {}), { width, height })
	},
	bindKey(target, key) {
		target.key = key
	},
	bindRef(target, ref) {
		target.ref = ref
	}
};
const basicConfig = {
	get: (target, prop, self) => {
		// 默认方法
		if (basicMethods.hasOwnProperty(prop)) {
			return (...value) => {
				basicMethods[prop](self, ...value);
				return self;
			};
		} else {
			return target[prop];
		}
	},
};
export function generateElement(type, props = {}) {

	const element = new Proxy(parseElement(type, props), basicConfig)

	currentNodeList?.push(element)

	return element;

};

// 捕获 children render
export function catchChildren(content) {

	// 存储父容器
	const temp = currentNodeList

	// 产生子容器
	currentNodeList = []

	// 填充子容器
	content()

	const catchNodeList = currentNodeList

	// 恢复父容器
	currentNodeList = temp

	return catchNodeList
}

// 针对react 组件
export function GComp(type) {
	return (...args) => {
		const { config } = parseParams(args)
		return generateElement(type, config)
	}
}

// 自定义组件
// 对 render 包装
// render(props,ref) --->  (props,ref)=>{ return catchChldren(render(props,ref))}


export default generateElement;
