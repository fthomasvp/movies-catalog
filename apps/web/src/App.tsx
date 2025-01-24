import { useState } from "react";
import "./App.css";
import "@rewee/ui/styles.css";
import { Button } from "@rewee/ui";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div>Some APP</div>
			<Button intent={"outline"} size={"small"}>
				Hey
			</Button>
		</>
	);
}

export default App;
