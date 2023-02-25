import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import _, { concat } from "lodash";
import { useUser } from "../helpers/User";

type CreatePostProps = {
	refetch: any;
};

export const CreatePost = ({ refetch }: CreatePostProps) => {
	const [create, createToggle] = useState(false);

	const { subName } = useParams();
	const user = useUser();

	const { data } = useQuery(
		"posts",
		async () => {
			return await axios.get(`http://localhost:8080/subs/posts/${subName}`);
		},
		{ retry: false }
	);

	const [post, setPost] = useState({
		title: "",
		text: "",
		subName: subName,
	});
	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPost({
			...post,
			[e.target.name]: e.target.value,
		});
	};

	var postReqConfig = {
		method: "post",
		url: `http://localhost:8080/posts/new`,
		headers: {
			"Content-Type": "application/json",
		},
		data: JSON.stringify(post),
	};

	const addPost = () => {
		console.log(post);
		return axios(postReqConfig);
	};

	const { isSuccess, isError, mutate } = useMutation(addPost, {
		onSuccess: () => {
			refetch();
			createToggle(false);
		},
	});

	// alert if banned keyword
	const alertIfBanned = () => {
		const bannedList = data!.data.banned[0].split(",");

		const trimmedBannedList = bannedList.map((word: String) =>
			word.trim().toLowerCase()
		);

		const postText = post.title + " " + post.text;

		const wordListPost = postText.split(" ").map((word: String) => {
			return word.trim().toLowerCase();
		});

		console.log(wordListPost, trimmedBannedList);

		const alertList = _.intersection(trimmedBannedList, wordListPost);

		if (alertList.length > 0) {
			alert(`You have banned keywords in your post: ${alertList.toString()}`);
		}
	};

	const member = data!.data.followers.includes(user.data._id);

	return (
		<>
			<button onClick={() => createToggle((tmp) => !tmp)} disabled={!member}>
				{!create ? "Create a post" : "Never mind"}
			</button>
			<br />
			{create && (
				<form>
					<label>
						Title
						<br />
						<input
							name="title"
							value={post.title}
							onChange={handleInput}
							required={true}
						/>
					</label>
					<label>
						Text
						<br />
						<input
							name="text"
							value={post.text}
							onChange={handleInput}
							required={true}
						/>
					</label>

					<button
						onClick={(event) => {
							event.preventDefault();
							alertIfBanned();
							mutate();
						}}
					>
						Create!
					</button>
				</form>
			)}
			<br />
			{isSuccess && (
				<>
					<hr />
					<i>Created succesfully!</i> <hr />
				</>
			)}
			{isError && (
				<>
					<hr />
					<i>Something went wrong.</i>
					<hr />
				</>
			)}
		</>
	);
};
