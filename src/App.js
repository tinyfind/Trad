import { Button, Card, Divider, Row, Column } from "./trad/antdComps";
import { GComp, catchChildren, generateElement, GTComp } from "./trad/core/gComp";
import { useState } from "react";
import { useReactive, useBinding } from "./customUse/useReactive";
import { jsxs as createStaticElement } from "react/jsx-runtime";
import { List } from "antd";


const View = GComp('div')

const Input = GComp(({bind})=>{
	const [value,setValue] = bind
	return <input value={value} onChange={event=>setValue(event.target.value)}/>
})

const Space = GComp('br')


function GView(render) {
	const type = (...args) => {
		const content = catchChildren(render.bind(this, ...args))
		return createStaticElement('div', { children: content })
	}
	return GComp(type)
}


const CustomApp = (name)=>{
	View(name)
}


const App = GView((props) => {
	const [data, setData] = useReactive({ name: 'dong',age:10 })
	// watch ----------> useMemo
	
	const merge = data.name + data.age

	// bind{get:,set:}
	Input({bind:useBinding(()=>data.name)})


	CustomApp('dong')
	Button('changeName').onClick(() => {
		data.name=""
	})
	// Button('changeData').onClick(() => {
	// 	setData({name:'li'})
	// })
})






export default App
