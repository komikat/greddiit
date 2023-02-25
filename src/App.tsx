import { useState, useEffect } from "react";

import { RouterProvider } from "react-router-dom";
import { router } from "./helpers/router";
import axios from "axios";

const App = () => {
	// verify everytime load
	//	console.log(tokenValid)
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
};

export default App;
