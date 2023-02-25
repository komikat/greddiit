import axios from "axios";
import { useQuery, useMutation } from "react-query";
import { Post } from "../types/Posts";

export const Saved = () => {
	const { data, isLoading, isError, refetch } = useQuery(
		"savedPosts",
		async () => {
			return await axios.get(`http://localhost:8080/users/saved`);
		}
	);

	const newUnSave = () => {};

	const unSaveMut = useMutation(
		(id: String) => {
			return axios({
				method: "post",
				url: `http://localhost:8080/users/unsave`,
				headers: {
					"Content-Type": "application/json",
				},
				data: JSON.stringify({
					postId: id,
				}),
			});
		},
		{
			onSuccess: () => {
				refetch();
				console.log("testing");
			},
		}
	);

	if (isLoading) {
		return <div>Loading</div>;
	}

	if (isError) {
		return <div>Error</div>;
	}

	const posts = data!.data.saved;
	return (
		<div>
			<h3>Saved posts</h3>
			<div>
				{posts.map((post: Post) => {
					return (
						<>
							<h3>{post.title}</h3>
							<p>{post.text}</p>
							<i>Sub: {post.sub.name}</i>
							<br />
							<button onClick={() => unSaveMut.mutate(post._id.toString())}>
								remove
							</button>
						</>
					);
				})}
			</div>
		</div>
	);
};
