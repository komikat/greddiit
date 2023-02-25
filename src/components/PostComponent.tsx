import { useMutation, useQuery } from "react-query";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { SubNavBar } from "../components/Nav";
import { useState } from "react";
import { CreatePost } from "../components/CreatePost";
import { Post } from "../types/Posts";
import { useUser } from "../helpers/User";
import { CommentComponent } from "./Comment";
import { Comment } from "./../types/Comment";
import {
	ArrowCircleDown,
	ArrowCircleDownTwoTone,
	ArrowCircleUp,
	ArrowCircleUpTwoTone,
	ArrowDropDown,
	ArrowDropUp,
	ArrowDropUpOutlined,
	Cancel,
} from "@mui/icons-material";

type PostCompProps = {
	post: Post;
};

export const PostComponent = ({ post }: PostCompProps) => {
	const { subName } = useParams();
	const { isLoading, isError, data, refetch } = useQuery(
		"posts",
		async () => {
			return await axios.get(`http://localhost:8080/subs/posts/${subName}`);
		},
		{ retry: false }
	);

	const user = useUser();

	const profileQuery = useQuery("profile", async () => {
		return await axios.get("http://localhost:8080/users/profile");
	});

	const upvoteMut = useMutation(
		async (postId: String) => {
			await axios({
				method: "get",
				url: `http://localhost:8080/posts/upvote/${postId}`,
			});
		},
		{
			onSuccess: () => {
				refetch();
			},
		}
	);

	const removeUpvoteMut = useMutation(
		async (postId: String) => {
			await axios({
				method: "get",
				url: `http://localhost:8080/posts/upvote/remove/${postId}`,
			});
		},
		{
			onSuccess: () => {
				refetch();
			},
		}
	);

	const downvoteMut = useMutation(
		async (postId: String) => {
			await axios({
				method: "get",
				url: `http://localhost:8080/posts/downvote/${postId}`,
			});
		},
		{
			onSuccess: () => {
				refetch();
			},
		}
	);

	const removeDownvoteMut = useMutation(
		async (postId: String) => {
			await axios({
				method: "get",
				url: `http://localhost:8080/posts/downvote/remove/${postId}`,
			});
		},
		{
			onSuccess: () => {
				refetch();
			},
		}
	);
	console.log(post);
	const [create, createToggle] = useState(false);
	const [comments, commentsToggle] = useState(false);
	const [comment, setComment] = useState({
		text: "",
	});
	const [reportFlag, reportFlagToggle] = useState(false);
	const [concern, setConcern] = useState("");
	const [reportCreated, setReportCreated] = useState(false);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setComment({
			...comment,
			[e.target.name]: e.target.value,
		});
	};
	const handleConcern = (e: React.ChangeEvent<HTMLInputElement>) => {
		setConcern(e.target.value);
	};

	const newReport = () => {
		return axios({
			method: "post",
			url: `http://localhost:8080/reports/new/${subName}`,
			headers: {
				"Content-Type": "application/json",
			},
			data: JSON.stringify({
				reportedUser: post.postBy._id,
				concern,
				post: post._id,
			}),
		});
	};

	const reportMutat = useMutation(newReport, {
		onSuccess: () => {
			setReportCreated(true);
		},
	});

	const savedPosts = useQuery("saved", async () => {
		return await axios.get(`http://localhost:8080/users/saved`);
	});

	const newSave = () => {
		return axios({
			method: "post",
			url: `http://localhost:8080/users/save`,
			headers: {
				"Content-Type": "application/json",
			},
			data: JSON.stringify({
				postId: post._id,
			}),
		});
	};

	const saveMut = useMutation(newSave, {
		onSuccess: () => {
			savedPosts.refetch();
			console.log("testing");
		},
	});

	const followMut = useMutation(
		(username: String) => {
			return axios({
				method: "get",
				url: `http://localhost:8080/users/follow/${username}`,
			});
		},
		{
			onSuccess: () => {
				profileQuery.refetch();
				refetch();
				console.log("testing");
			},
		}
	);

	var commentReqConfig = {
		method: "post",
		url: `http://localhost:8080/posts/comment/${post._id}`,
		headers: {
			"Content-Type": "application/json",
		},
		data: JSON.stringify(comment),
	};

	const addComment = () => {
		return axios(commentReqConfig);
	};

	const commentMutat = useMutation(addComment, {
		onSuccess: () => {
			refetch();
			createToggle(false);
			commentsToggle(true);
		},
	});

	const buttonStyle = {
		display: "flex",
		alignItems: "center",
		backgroundColor: "inherit",
		color: "#1d7484",
		border: "none",
		height: "30px",
		justifyContent: "center",
		padding: "0px",
	};

	if (profileQuery.isLoading || savedPosts.isLoading || isLoading) {
		return <div>Loading</div>;
	}

	if (profileQuery.isError || savedPosts.isError || isError) {
		return <div>Error</div>;
	}

	const member = data!.data.followers.includes(user.data._id);

	return (
		<li key={post._id.toString()} style={{ listStyle: "none" }}>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						flexDirection: "column",
						paddingRight: "15px",
					}}
				>
					<div>
						{post.upvotes.includes(user.data._id) ? (
							<button
								onClick={() => removeUpvoteMut.mutate(post._id)}
								disabled={
									post.downvotes.includes(user.data._id) ||
									removeUpvoteMut.isLoading ||
									!member
								}
								style={buttonStyle}
							>
								<ArrowCircleUpTwoTone
									style={{ height: "30px" }}
									fontSize="large"
								/>
							</button>
						) : (
							<button
								onClick={() => upvoteMut.mutate(post._id)}
								disabled={
									post.downvotes.includes(user.data._id) ||
									upvoteMut.isLoading ||
									!member
								}
								style={buttonStyle}
							>
								<ArrowCircleUp fontSize="large" style={{ height: "30px" }} />
							</button>
						)}
					</div>

					<span
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						{" "}
						{post.upvotes.length - post.downvotes.length}{" "}
					</span>

					{post.downvotes.includes(user.data._id) ? (
						<button
							onClick={() => removeDownvoteMut.mutate(post._id)}
							disabled={
								post.upvotes.includes(user.data._id) ||
								removeDownvoteMut.isLoading ||
								!member
							}
							style={buttonStyle}
						>
							<ArrowCircleDownTwoTone
								style={{ height: "30px" }}
								fontSize="large"
							/>
						</button>
					) : (
						<button
							onClick={() => downvoteMut.mutate(post._id)}
							disabled={
								post.upvotes.includes(user.data._id) ||
								downvoteMut.isLoading ||
								!member
							}
							style={buttonStyle}
						>
							<ArrowCircleDown fontSize="large" style={{ height: "30px" }} />
						</button>
					)}
				</div>
				<div>
					<h5>{post.title}</h5>
					<span>
						by<i> {post.postBy.userName} </i>
					</span>
					<br />
					<p>{post.text}</p>
				</div>

				<div style={{ marginLeft: "20px" }}>
					<button
						onClick={() => followMut.mutate(post.postBy.userName)}
						disabled={
							profileQuery.isSuccess &&
							profileQuery.data!.data.following.some((i: { _id: string }) =>
								i._id.includes(post.postBy._id.toString())
							)
						}
					>
						Follow
					</button>

					<button
						onClick={() => saveMut.mutate()}
						disabled={savedPosts.data!.data.saved.some((i: { _id: string }) =>
							i._id.includes(post._id.toString())
						)}
					>
						Save
					</button>
				</div>
			</div>
			<div>
				{!reportCreated && (
					<div style={{ marginBottom: "10px" }}>
						{!reportFlag ? (
							<button
								onClick={() => reportFlagToggle((tmp) => !tmp)}
								disabled={!member}
							>
								Report
							</button>
						) : (
							<button
								onClick={() => {
									reportMutat.mutate();
								}}
								disabled={concern === ""}
							>
								Send Report
							</button>
						)}
						{reportFlag && (
							<div>
								<label>Concern</label>
								<input
									name="concern"
									value={concern}
									onChange={handleConcern}
								/>
							</div>
						)}
					</div>
				)}

				<div>
					{" "}
					<button
						onClick={() => {
							createToggle((tmp) => !tmp);
							setComment({ text: "" });
						}}
						disabled={!member}
					>
						{!create ? "Comment" : "Never mind"}
					</button>
					{create && (
						<form>
							<label>
								Text
								<br />
								<input
									name="text"
									value={comment.text}
									onChange={handleInput}
									required={true}
								/>
							</label>

							<button
								onClick={(event) => {
									event.preventDefault();
									commentMutat.mutate();
								}}
								disabled={commentMutat.isLoading}
							>
								Create!
							</button>
						</form>
					)}
				</div>
			</div>
			<br />
			<button
				onClick={() => {
					commentsToggle((tmp) => !tmp);
				}}
				style={{ marginTop: "10px", marginBottom: "10px" }}
			>
				{!comments ? "Comments" : "Close"}
			</button>
			{comments && (
				<ul>
					{post.comments.map((comment: String) => {
						return <CommentComponent id={comment} />;
					})}
				</ul>
			)}

			<hr />
		</li>
	);
};
