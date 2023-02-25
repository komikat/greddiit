import axios from "axios";
import { useQuery } from "react-query";
import { Link, Navigate, NavLink, Outlet, useParams } from "react-router-dom";
import { useUser } from "../helpers/User";
import {
	AccessAlarm,
	ThreeDRotation,
	SvgIconComponent,
	Home,
	FilterList,
	List,
	Person,
	Save,
} from "@mui/icons-material";

export const NavItem = () => {
	return (
		<li>
			<NavLink to="messages">Messages</NavLink>
		</li>
	);
};

type Link = {
	name: String;
	url: String;
	icon: SvgIconComponent;
};

const links = [
	{
		name: "G(red)diit",
		url: "/",
		icon: Home,
	},
	{
		name: "My subs",
		url: "/mysubs",
		icon: FilterList,
	},
	{
		name: "All subs",
		url: "/all",
		icon: List,
	},
	{
		name: "Saved",
		url: "/saved",
		icon: Save,
	},
	{
		name: "Profile",
		url: "/profile",
		icon: Person,
	},
];

const subPageLinks = [
	{
		name: "Users",
		url: "/users",
		icon: AccessAlarm,
	},
	{
		name: "Join requests",
		url: "/requests",
		icon: AccessAlarm,
	},
	{
		name: "Stats",
		url: "/stats",
		icon: AccessAlarm,
	},
	{
		name: "Reports",
		url: "/reports",
		icon: AccessAlarm,
	},
];

export const SubNavBar = () => {
	const { subName } = useParams();
	const user = useUser();
	let activeStyle = {
		fontStyle: "italic",
	};

	const { isLoading, isError, data } = useQuery(
		"sub",
		async () => {
			return await axios.get(`http://localhost:8080/subs/get/${subName}`);
		},
		{ retry: false }
	);

	if (isLoading) {
		return <div>Loading</div>;
	}

	if (isError) {
		return <Navigate to="/404" />;
	}

	return (
		<>
			<hr />
			<nav
				style={{
					display: "flex",
					flexDirection: "row",
					listStyle: "none",
					flexWrap: "nowrap",
					justifyContent: "space-between",
					paddingTop: "10px",
				}}
			>
				<li key="subName">
					<NavLink to={`./`}>
						/g/<span style={{ fontWeight: "bold" }}>{subName}</span>
					</NavLink>
				</li>
				{user.data._id === data!.data.creator &&
					subPageLinks.map((link: Link) => {
						return (
							<li key={link.name.toString()}>
								<NavLink
									to={`.${link.url}`}
									style={({ isActive }) => (isActive ? activeStyle : undefined)}
								>
									{link.name}
								</NavLink>
							</li>
						);
					})}
			</nav>
			<Outlet />
		</>
	);
};

export const NavBar = () => {
	let activeStyle = {
		fontStyle: "italic",
	};
	return (
		<nav
			style={{
				display: "flex",
				flexDirection: "row",
				listStyle: "none",
				flexWrap: "nowrap",
				justifyContent: "space-between",
			}}
		>
			{links.map((link: Link) => {
				return (
					<li key={link.name.toString()}>
						<NavLink
							to={`${link.url}`}
							style={({ isActive }) => (isActive ? activeStyle : undefined)}
						>
							<link.icon />
							{link.name}
						</NavLink>
					</li>
				);
			})}
		</nav>
	);
};
