import { useContext } from "react";
import { useUser } from "../helpers/User";
import { UserContext } from "../helpers/UserContext";

export const Profile = () => {
	const { refetch } = useUser();
	return (
		<>
			<h2>Profile</h2>
			<button
				onClick={() => {
					localStorage.removeItem("token");
					refetch();
				}}
			>
				Logout
			</button>{" "}
			{/* logout function */}
		</>
	);
};
