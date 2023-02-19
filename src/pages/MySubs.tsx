import { useState, useEffect } from "react";
import { CreateSub } from "../helpers/Sub";
import axios from "axios";

export const MySubs = () => {
	const [sub, setSub] = useState({
		name: "",
		description: "",
		tags: "",
		banned: "",
	});

	const [create, createToggle] = useState(false);
	const [created, createdToggle] = useState(0);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSub({
			...sub,
			[e.target.name]: e.target.value,
		});
	};

	useEffect(() => {
		const getSubs = async () => {
			const response = await axios.get("http://localhost:8080/subs/get");
			setSub(response.data.subs);
		};
		getSubs();
	}, [created]);

	return (
		<>
			<h2>My subs</h2>
			<button onClick={() => createToggle((tmp) => !tmp)}>
				{!create ? "Create a sub" : "Never mind"}
			</button>
			{create && (
				<>
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
						onClick={async () => {
							const res = await CreateSub(sub);
							createdToggle(res!);
							if (res == 201) {
								createToggle(false);
							}
						}}
					>
						Create!
					</button>
					<br /> <br />
					{created == 409 && (
						<>
							<hr />
							<i>Sub with that name already exists!</i> <hr />
						</>
					)}
				</>
			)}
			<br />
			<br />
			{!create && created == 201 && (
				<>
					<hr />
					<i>Created succesfully!</i> <hr />
				</>
			)}
		</>
	);
};
