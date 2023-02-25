import { useContext, useState } from "react";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";
import { AuthHandler, getUser, useUser } from "../helpers/User";
import { UserContext, UserValid } from "../helpers/UserContext";

export const Login = () => {
	const [loginFlag, setLoginFlag] = useState(false); // true -> register, false -> login
	const [textError, setError] = useState("");
	const { isLoading, isError, data, error, refetch } = useUser();

	const [user, setUser] = useState({
		userName: "",
		email: "",
		password: "",
		firstName: "",
		lastName: "",
		age: "",
		contactNumber: "",
	});

	if (isLoading) {
		return <div>Loading</div>;
	}

	if (!isError) {
		return <Navigate to="/" replace={true} />;
	}

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUser({
			...user,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div>
			<h1>Welcome to greddiit!</h1>
			<p>
				A social media platform featuring exclusive communities —{" "}
				<i>subgreddits</i> — with extensive moderation options.
			</p>
			<hr style={{ marginBottom: "-10px" }} />
			<h4>
				<i>{loginFlag ? "Register" : "Login"}</i> to continue
			</h4>
			{loginFlag ? (
				<p>
					Already have an account?{" "}
					<button
						onClick={() => {
							setLoginFlag(false);
							setError("");
						}}
					>
						login
					</button>
				</p>
			) : (
				<p>
					New here? You can{" "}
					<button
						onClick={() => {
							setLoginFlag(true);
							setError("");
						}}
					>
						register
					</button>
				</p>
			)}
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
					<div>
						<label>
							Username*
							<br />
							<input
								name="userName"
								value={user.userName}
								onChange={handleInput}
								required={true}
							/>
						</label>
						<label>
							Password*
							<br />
							<input
								name="password"
								value={user.password}
								onChange={handleInput}
								type="password"
								required={true}
							/>
						</label>
						<button
							onClick={async (e) => {
								e.preventDefault();
								const res = await AuthHandler(user, loginFlag);
								if (res.token) {
									refetch();
								}
								setError(res.error!);
								// TODO: specify return type
							}}
							disabled={
								!(
									(loginFlag &&
										!!(user.email && user.userName && user.password)) ||
									(!loginFlag && !!(user.userName && user.password))
								)
							}
						>
							{loginFlag ? "Register" : "Login"}
						</button>
					</div>

					{loginFlag && (
						<div>
							<label>
								First name
								<br />
								<input
									name="firstName"
									value={user.firstName}
									onChange={handleInput}
								/>
							</label>
							<label>
								Last name
								<br />
								<input
									name="lastName"
									value={user.lastName}
									onChange={handleInput}
								/>
							</label>
							<label>
								Email*
								<br />
								<input
									name="email"
									value={user.email}
									onChange={handleInput}
									type="email"
									required={true}
								/>
							</label>
							<label>
								Age
								<br />
								<input
									name="age"
									value={user.age}
									onChange={handleInput}
									type="number"
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
								/>
							</label>
						</div>
					)}
				</div>
			</form>

			<br />
			<br />
			<hr />

			{textError && (
				<>
					<i>{textError}</i>
					<hr />
				</>
			)}
		</div>
	);
};
