import { useContext } from "react";
import { NavBar } from "../components/Nav";
import { UserContext } from "../helpers/UserContext";
import { useQuery, useMutation } from "react-query";
import axios from "axios";

export const Home = () => {
	const { data, isLoading, isError, refetch } = useQuery("home", async () => {
		return await axios.get(`http://localhost:8080/users/home`);
	});

	if (isLoading) {
		return <div>Loading</div>;
	}

	if (isError) {
		return <div>Error</div>;
	}
	const mysubs = data!.data.subs;
	return (
		<div>
			<h2>Home Page</h2>
			<p>
				Welcome to greddiit, this page has all posts from the subs you have/will
				subscribed to.
			</p>
			<div>
				{mysubs.map((sub: any) => {
					return (
						<div>
							<h3>g/{sub.name}</h3>
							<div>
								{sub.posts.map((post: any) => {
									return (
										<div>
											<h4>{post.title}</h4>
											<p>{post.text}</p>
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
