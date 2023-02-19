import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
	const error = useRouteError();
	console.error(error);

	return (
		<div id="error-page">
			<h1>Not found</h1>
			<p>This page doesn't exist, text/email Akshit if you think it should.</p>
			<Link to={"/"}>Go back.</Link>
		</div>
	);
}
