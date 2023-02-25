import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Comment } from "./../types/Comment";

type CommentComponentProp = {
	id: String;
};
export const CommentComponent = ({ id }: CommentComponentProp) => {
	const [replies, setReplies] = useState(true);

	const { isLoading, isError, data, refetch } = useQuery(
		["comments", id],
		async () => {
			return await axios.get(`http://localhost:8080/comments/${id}`);
		},
		{ retry: false }
	);

	const [create, createToggle] = useState(false);
	const [comment, setComment] = useState({
		text: "",
		parent: id,
	});

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setComment({
			...comment,
			[e.target.name]: e.target.value,
		});
	};
	var commentReplyReqConfig = {
		method: "post",
		url: `http://localhost:8080/comments/reply/`,
		headers: {
			"Content-Type": "application/json",
		},
		data: JSON.stringify(comment),
	};

	const addReply = () => {
		return axios(commentReplyReqConfig);
	};

	const commentMutat = useMutation(addReply, {
		onSuccess: () => {
			createToggle(false);
			refetch();
			setReplies(false);
		},
	});

	if (isLoading) {
		return <div>Loading comment</div>;
	}

	if (isError) {
		return <div>Error loading comment</div>;
	}

	const repliesArray = data!.data.replies;

	return (
		<>
			<div
				style={{
					paddingBottom: "10px",
					marginTop: "10px",
					borderLeft: "2px solid #1d7484",
					paddingLeft: "10px",
				}}
			>
				<i>{data!.data.user.userName}</i>: {data!.data.text}
				<br />
				<span
					onClick={() => createToggle((tmp) => !tmp)}
					style={{ cursor: "pointer", color: "#1d7484" }}
				>
					{!create ? "Reply" : "Never mind"}
				</span>
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
							disabled={commentMutat.isLoading}
							onClick={(event) => {
								event.preventDefault();
								commentMutat.mutate();
							}}
						>
							Create!
						</button>
					</form>
				)}
				<br />
				{(replies && repliesArray.length) > 0 ? (
					<span
						onClick={() => setReplies(false)}
						style={{ cursor: "pointer", color: "#1d7484" }}
					>
						show replies
					</span>
				) : (
					<div>
						<ul>
							{repliesArray &&
								repliesArray.map((reply: Comment) => {
									return (
										<li style={{ listStyle: "none" }}>
											<CommentComponent id={reply._id} />
										</li>
									);
								})}
						</ul>
					</div>
				)}
			</div>
		</>
	);
};
