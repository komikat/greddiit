import { useMutation, useQuery } from "react-query";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { SubNavBar } from "../components/Nav";
import { useState } from "react";
import { CreatePost } from "../components/CreatePost";
import { Post } from "../types/Posts";
import { useUser } from "../helpers/User";
import { PostComponent } from "../components/PostComponent";

export const SubPage = () => {
	const { subName } = useParams();
	const user = useUser();

	const { isLoading, isError, data, refetch } = useQuery(
		"posts",
		async () => {
			return await axios.get(`http://localhost:8080/subs/posts/${subName}`);
		},
		{ retry: false }
	);

	if (isLoading) {
		return <div>Loading</div>;
	}

	if (isError) {
		return <Navigate to="/404" />;
	}

	const posts = data!.data.posts;

	return (
		<div>
			<h1>{subName}</h1>
			<br />
			<CreatePost refetch={refetch} />
			<div>
				{posts
					? posts.map((post: Post) => {
							return <PostComponent post={post} />;
					  })
					: "No posts yet"}
			</div>
		</div>
	);
};
