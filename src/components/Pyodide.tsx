import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Typography, Box } from "@mui/material";

export default function Pyodide({
	pythonCode,
	loadingMessage = "loading…",
	evaluatingMessage = "evaluating…",
}) {
	const indexURL = "https://cdn.jsdelivr.net/pyodide/dev/full/";
	const pyodide = useRef(null);
	const [isPyodideLoading, setIsPyodideLoading] = useState(true);
	const [pyodideOutput, setPyodideOutput] = useState(evaluatingMessage);
	// load pyodide wasm module and initialize it
	useEffect(() => {
		(async function () {
			pyodide.current = await globalThis.loadPyodide({ indexURL: indexURL });
			setIsPyodideLoading(false);
		})();
	}, [pyodide]);
	// evaluate python code with pyodide and set output
	useEffect(() => {
		if (!isPyodideLoading) {
			const evaluatePython = async (pyodide, pythonCode) => {
				try {
					return await pyodide.runPython(pythonCode);
				} catch (error) {
					console.error(error);
					return "Error evaluating Python code. See console for details.";
				}
			};
			(async function () {
				setPyodideOutput(await evaluatePython(pyodide.current, pythonCode));
			})();
		}
	}, [isPyodideLoading, pyodide, pythonCode]);
	return (
		<>
			<Script src={`${indexURL}pyodide.js`} strategy="beforeInteractive" />
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center	" }}>
				<Typography variant="h6" sx={{fontWeight: "bold"}}>Program Output: </Typography>
				<Typography variant="h5" sx={{ color: "#ff3d00", m: "1rem", fontWeight:"bold" }}>
					{isPyodideLoading ? loadingMessage : pyodideOutput}
				</Typography>
			</Box>
		</>
	);
}