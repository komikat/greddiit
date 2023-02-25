import axios from "axios";
import { useContext } from "react";
import { useMutation, useQuery } from "react-query";
import { useUser } from "../helpers/User";
import { UserContext } from "../helpers/UserContext";
import { useState, useEffect } from "react";
import { Follower } from "../types/Users";

export const Profile = () => {
	const token = useUser();

	const [user, setUser] = useState({
		userName: "",
		email: "",
		password: "",
		firstName: "",
		lastName: "",
		age: "",
		contactNumber: "",
	});

	const { status, data, isLoading, refetch, isError } = useQuery(
		"profile",
		async () => {
			return await axios.get("http://localhost:8080/users/profile");
		},
		{
			retry: false,
		}
	);

	useEffect(() => {
		if (status === "success") {
			const user = data!.data;

			setUser(user);
		}
	}, [status, data]);

	const [toggle, setToggle] = useState(true);
	const [toggleFollowers, setFollowers] = useState(false);
	const [toggleFollowing, setFollowing] = useState(false);

	var postReqConfig = {
		method: "post",
		url: `http://localhost:8080/users/profile/edit`,
		headers: {
			"Content-Type": "application/json",
		},
		data: JSON.stringify(user),
	};

	const editUser = () => {
		console.log(user);
		return axios(postReqConfig);
	};

	const [message, setMessage] = useState(
		"Click on edit button to make changes."
	);

	const { mutate } = useMutation(editUser, {
		onSuccess: () => {
			setMessage("Saved successfully.");
			setToggle(true);
		},
	});

	const unfollowMut = useMutation(
		(username: String) => {
			return axios({
				method: "get",
				url: `http://localhost:8080/users/unfollow/${username}`,
			});
		},
		{
			onSuccess: () => {
				refetch();
				console.log("testing");
			},
		}
	);

	const removeMut = useMutation(
		(username: String) => {
			return axios({
				method: "get",
				url: `http://localhost:8080/users/remove/${username}`,
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
		return (
			<div>
				<h2>Profile</h2>
				Loading
			</div>
		);
	}

	if (isError) {
		return <div>Error, please try again</div>;
	}

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUser({
			...user,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<>
			<h2>Profile</h2>
			{toggle ? (
				<button
					onClick={() => {
						setMessage("Click save once you are done.");
						setToggle((prev) => !prev);
					}}
				>
					Edit
				</button>
			) : (
				<button onClick={() => mutate()}>Save</button>
			)}
			<h6>{message}</h6>
			<form>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						paddingTop: "20px",
						flexWrap: "wrap",
					}}
				>
					<div style={{}}>
						<label>
							E-mail
							<br />
							<input value={user.email} disabled={true} />
						</label>
						<label>
							Username
							<br />
							<input value={user.userName} disabled={true} />
						</label>
						<label>
							Age
							<br />
							<input
								name="age"
								value={user.age}
								onChange={handleInput}
								type="number"
								disabled={toggle}
							/>
						</label>
					</div>
					<div>
						<label>
							First name
							<br />
							<input
								name="firstName"
								value={user.firstName}
								onChange={handleInput}
								disabled={toggle}
								placeholder={"Karl"}
							/>
						</label>
						<label>
							Last name
							<br />
							<input
								name="lastName"
								value={user.lastName}
								onChange={handleInput}
								disabled={toggle}
								placeholder={"Marx"}
							/>
						</label>

						<label>
							Contact number
							<br />
							<input
								name="contactNumber"
								value={user.contactNumber}
								onChange={handleInput}
								type="number"
								disabled={toggle}
								placeholder={"1917"}
							/>
						</label>
					</div>
				</div>
			</form>
			<div>
				<div>
					<button onClick={() => setFollowers((tmp) => !tmp)}>
						Followers: {data!.data.followers.length}
					</button>
					{toggleFollowers &&
						data!.data.followers.map((follower: Follower) => {
							return (
								<div>
									<h5>{follower.userName}</h5>
									<button
										onClick={() => removeMut.mutate(follower.userName)}
										disabled={follower.userName === data!.data.userName}
									>
										remove
									</button>
								</div>
							);
						})}
				</div>
				<br />
				<div>
					<button onClick={() => setFollowing((tmp) => !tmp)}>
						Following: {data!.data.following.length}
					</button>
					{toggleFollowing &&
						data!.data.following.map((following: Follower) => {
							return (
								<div>
									<h5>{following.userName}</h5>
									<button
										onClick={() => unfollowMut.mutate(following.userName)}
										disabled={following.userName === data!.data.userName}
									>
										unfollow
									</button>
								</div>
							);
						})}
				</div>
				<br />
			</div>
			<button
				onClick={() => {
					localStorage.removeItem("token");
					token.refetch();
				}}
			>
				Logout
			</button>{" "}
			{/* logout function */}
		</>
	);
};
