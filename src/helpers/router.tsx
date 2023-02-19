import { createBrowserRouter } from "react-router-dom";
import { Protected } from "../components/Protected";
import ErrorPage from "../pages/Error";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { MySubs } from "../pages/MySubs";
import { AllSubs } from "../pages/AllSubs";
import { Profile } from "../pages/Profile";

export const router = createBrowserRouter([
	{
		path: "/",
		errorElement: <ErrorPage />,
		element: (
			<Protected>
				<Home />
			</Protected>
		),
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/mysubs",
		element: (
			<Protected>
				<MySubs />
			</Protected>
		),
	},
	{
		path: "/all",
		element: (
			<Protected>
				<AllSubs />
			</Protected>
		),
	},
	{
		path: "/profile",
		element: (
			<Protected>
				<Profile />
			</Protected>
		),
	},
]);
