import { Link } from "react-router-dom";

export const NotFound = () => {
	return (
		<h4>
			The requested page was not found, please <Link to={"/"}>go back</Link> or
			contact Akshit if you think this is unexpected.
		</h4>
	);
};
