import { useState } from "react";
import { CreateSub } from "../helpers/Sub";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import React from "react";
import { serverURL } from "../helpers/server";
import { ListSub } from "../components/ListSub";
import { Sub } from "../types/Subs";

type NewSub = {
	name: String;
	description: String;
	tags: String;
	banned: String;
};

export const MySubs = () => {
	const { isLoading, isError, data, refetch } = useQuery("subs", async () => {
		return await axios.get("http://localhost:8080/subs/get");
	});

	const [sub, setSub] = useState({
		name: "",
		description: "",
		tags: "",
		banned: "",
	});

	const [create, createToggle] = useState(false);

	var subReqConfig = {
		method: "post",
		url: "http://localhost:8080/subs/new",
		headers: {
			"Content-Type": "application/json",
		},
		data: JSON.stringify(sub),
	};

	const addSub = () => {
		console.log(sub);
		return axios(subReqConfig);
	};

	const createSub = useMutation(addSub, {
		onSuccess: () => {
			refetch();
			createToggle(false);
		},
	});

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSub({
			...sub,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<>
			<h2>My subs</h2>
			<button onClick={() => createToggle((tmp) => !tmp)}>
				{!create ? "Create a sub" : "Never mind"}
			</button>
			<br />
			{create && (
				<form>
					<label>
						Name
						<br />
						<input
							name="name"
							value={sub.name}
							onChange={handleInput}
							required={true}
						/>
					</label>
					<label>
						Description
						<br />
						<input
							name="description"
							value={sub.description}
							onChange={handleInput}
						/>
					</label>
					<label>
						Tags
						<br />
						<input
							name="tags"
							value={sub.tags}
							onChange={handleInput}
							placeholder={"Comma separated"}
						/>
					</label>
					<label>
						Banned words
						<br />
						<input
							name="banned"
							value={sub.banned}
							placeholder={"Comma separated"}
							onChange={handleInput}
						/>
					</label>
					<button
						onClick={(event) => {
							event.preventDefault();
							createSub.mutate();
						}}
					>
						Create!
					</button>
				</form>
			)}
			<br />
			{createSub.isSuccess && (
				<>
					<hr />
					<i>Created succesfully!</i> <hr />
				</>
			)}
			{createSub.isError && (
				<>
					<hr />
					<i>Sub already exists.</i>
					<hr />
				</>
			)}
			<ListSub
				data={data!}
				isLoading={isLoading}
				isError={isError}
				refetch={refetch}
			/>
		</>
	);
};
