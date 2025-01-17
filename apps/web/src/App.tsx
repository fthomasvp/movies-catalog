import { useState } from "react";
// import {} from '@rewee/ui'
// import {} from '@rewee/ui'
import "./App.css";
import { Button } from "@rewee/ui";
import "@rewee/ui/style.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>Some APP</div>
      <Button>Hey</Button>
    </>
  );
}

export default App;
