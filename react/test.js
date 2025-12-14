import { useState } from "react";
import "./App.css";
import { Button, Card } from "./trad/components";
import { GComp } from "./trad/GComp";
function App() {
  const [count, setCount] = useState(0);

  Card()
    .title(count)
    .onClick(() => {
      setCount((count) => count + 1);
    }).key('1');
}

export default GComp(App);
