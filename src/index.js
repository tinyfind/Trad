import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { jsxs as createElement } from "react/jsx-runtime";
import { currentNodeList } from "./trad/core/gComp";
import { useState } from "react";

// console.log(App('dong'))
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <button onClick={()=>{console.log('dong')}}>dd</button>,
  App({name:'dong'})
  // <MyApp></MyApp>
);

