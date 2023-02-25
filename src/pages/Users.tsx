import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Follower } from "./../types/Users";

export const Users = () => {
	const { subName } = useParams();

	const { isLoading, isError, data, refetch } = useQuery(
		"followers",
		async () => {
			return await axios.get(`http://localhost:8080/subs/followers/${subName}`);
		},
		{ retry: false }
	);

	if (isLoading) {
		return <div>Loading</div>;
	}

	if (isError) {
		return <div>Error, please try again later.</div>;
	}

	const followers = data!.data.followers;
	const banned = data!.data.bannedUsers;
	return (
		<div>
			<div>
				<h3>Followers</h3>
				{followers.map((follower: Follower) => {
					return <p>{follower.userName}</p>;
				})}
			</div>
			<div>
				<h3>Banned users</h3>
				{banned.map((banned: Follower) => {
					return <p>{banned.userName}</p>;
				})}
			</div>
		</div>
	);
};
