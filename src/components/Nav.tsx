import { Link, NavLink } from 'react-router-dom'

export const NavItem = () => {

	return (
		<li>
			<NavLink
				to="messages"

			>
				Messages
			</NavLink>
		</li>

	)
}

type Link = {
	name: String,
	url: String
}


const links = [
	{
		"name": "Home",
		"url": "/"
	},
	{
		"name": "My subs",
		"url": "/mysubs"
	},
	{
		"name": "All subs",
		"url": "/all"
	},
	{
		"name": "Profile",
		"url": "/profile"
	}
]



export const NavBar = () => {
	let activeStyle = {
		"fontStyle":"italic"
	};
	return (
		<nav style={{
			display: "flex",
			flexDirection: "row",
			listStyle: "none",
			flexWrap: "nowrap",
			justifyContent: "space-between"

		}}>
			{links.map((link: Link) => {
				return (<li key={link.name.toString()}>
					<NavLink to={`${link.url}`} style={({ isActive }) =>
						isActive ? activeStyle : undefined
					}>{link.name}</NavLink>
				</li>)
			})}
		</nav>
	)
}
