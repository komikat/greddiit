import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
} from "react-router-dom";
import { SubNavBar } from "../components/Nav";
import { Protected } from "../components/Protected";
import { AllSubs } from "../pages/AllSubs";
import ErrorPage from "../pages/Error";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { MySubs } from "../pages/MySubs";
import { NotFound } from "../pages/Notfound";
import { Profile } from "../pages/Profile";
import { Requests } from "../pages/Requests";
import { SubPage } from "../pages/SubPage";
import { Users } from "../pages/Users";
import { Stats } from "../pages/Stats";
import { Reports } from "../pages/Reports";
import { Saved } from "../pages/Saved";

export const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route
				path="/"
				errorElement={<ErrorPage />}
				element={
					<Protected>
						<Home />{" "}
					</Protected>
				}
			/>
			<Route path="/login" element={<Login />} />
			<Route
				path="/mysubs"
				element={
					<Protected>
						<MySubs />
					</Protected>
				}
			/>
			<Route
				path="/all"
				element={
					<Protected>
						<AllSubs />
					</Protected>
				}
			/>
			<Route
				path="/profile"
				element={
					<Protected>
						<Profile />
					</Protected>
				}
			/>
			<Route
				path="/saved"
				element={
					<Protected>
						<Saved />
					</Protected>
				}
			/>
			<Route
				path="/g/:subName"
				element={
					<Protected>
						<SubNavBar />
					</Protected>
				}
			>
				<Route path="users" element={<Users />} />
				<Route index element={<SubPage />} />

				<Route path="requests" element={<Requests />} />
				<Route path="stats" element={<Stats />} />
				<Route path="reports" element={<Reports />} />
			</Route>
			<Route
				path="/404"
				element={
					<Protected>
						<NotFound />
					</Protected>
				}
			/>
		</>
	)
);
