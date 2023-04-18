import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

import {
  createBrowserRouter,
  Link,
  RouterProvider,
  Router,
  BrowserRouter,
  Routes,
  Route,
  redirect,
} from "react-router-dom";

interface loggedProps {
	loggedIn: boolean;
}

interface reggedProps {
	loggedIn: boolean;
	setLogin: () => void
}

const Navbar: React.FC<loggedProps> = (props): JSX.Element => {
  return (
      <>
		<Link to="/">Home</Link>
		<br/>
		  {!(localStorage.getItem("token")) && <Link to="register">Register</Link>}
		  {localStorage.getItem("token") &&
		 <div>
		   <br/>
		   <div>
			 <Link to="profile">Profile</Link>
		   </div>
		 </div>
		}
		
      </>
  );
};

const Register: React.FC<reggedProps> = (props): JSX.Element => {
	useEffect(() => {
	const token = localStorage.getItem('token')
    if (token) {
      console.log("redirecting...");
      window.location.href = "/";
    }}, []);

  const [userName, setUserName] = useState("");
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [contact, setContact] = useState("");

  const [register, toggle] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
      console.log("logging in with", userName, password);
	  
	  const api = `https://greddiit-backend-production-4f3b.up.railway.app/users/${register ? "register" : "login"}`
	  axios.post(api, {
		  userName, password, email
	  }).then((res) => {
		  console.log(res)
		  if(res.status == 223)
			  setError("User already exists!")

		  if(res.status == 200 || res.status == 201)
		  {
			  const token = res.data.token
			  console.log(token)
			  localStorage.setItem("token", token)
			  props.setLogin()
			  window.location.href="/profile"
			  console.log(props.loggedIn)
		  }
	  }).catch(err => {
		  console.log(err.response.data)
		  if(err.response.status == 404)
			  setError("Username not found")
		  else
			  setError("Please check your password carefully")
	  })
	  console.log(api)
  };

	return (
		<div>
			<button
				onClick={() => {
					toggle((register) => !register);
				}}
			>
				{register ? "Login" : "Register"}
			</button>
			<h1>{register ? "Register" : "Login"}</h1>
			<form onSubmit={handleLogin}>
				<div>
					username
					<input
						type="text"
						value={userName}
						name="Username"
						onChange={({ target }) => setUserName(target.value)}
					/>
				</div>
				{register &&
					<div>
						email
						<input
							type="text"
							value={email}
							name="email"
							onChange={({ target }) => setEmail(target.value)}
						/>
					</div>
				}
				<div>
					password
					<input
						type="password"
						value={password}
						name="Password"
						onChange={({ target }) => setPassword(target.value)}
					/>
				</div>
				{register && (
					<div>
						<div>
							first name
							<input
								type="text"
								value={first}
								name="firstName"
								onChange={({ target }) => setFirst(target.value)}
							/>
						</div>
						<div>
							second name
							<input
								type="text"
								value={second}
								name="firstName"
								onChange={({ target }) => setSecond(target.value)}
							/>
						</div>
						<div>
							age
							<input
								type="text"
								value={age}
								name="firstName"
								onChange={({ target }) => setAge(target.value)}
							/>
						</div>
						<div>
							contact
							<input
								type="text"
								value={contact}
								name="firstName"
								onChange={({ target }) => setContact(target.value)}
							/>
						</div>
						<div>
							first name
							<input
								type="text"
								value={first}
								name="firstName"
								onChange={({ target }) => setFirst(target.value)}
							/>
						</div>
					</div>
				)}
				<button type="submit">login</button>
				<h4 style={{ color: "red" }}>{error}</h4>
			</form>
		</div>
	);
};

const Home = () => {
  return (
    <div>
      <h1>Welcome to greddiit</h1>
    </div>
  );
};

const Profile: React.FC<loggedProps> = (props): JSX.Element => {
	const [user, setUser] = useState({userName:"default",
									  email:"default",
									  firstName: "default",
									  secondName: "default",
									  age: "default",
									  contact: "default"
	})
	const [show, showT] = useState(false)
	const [show2, showT2] = useState(false)
  useEffect(() => {
	  const token = localStorage.getItem('token')
    if (!token) {
      console.log("redirecting...");
      window.location.href = "/register";
    }
	  const config = {
		  headers: { Authorization: `Bearer: ${token}` },
	  }
	  const getApi = `https://greddiit-backend-production-4f3b.up.railway.app/users/profile`
	  console.log(config)
	  axios.get(getApi, config).then(res => {
		  console.log(res)
		  setUser(res.data)
	  })

  }, []


  );



	const logOut = () => {
		localStorage.clear()
		window.location.href = "/register"
	}
	
	
  return (
		<div>
			<h1>Profile</h1>
			<h2>{JSON.stringify(user)}</h2>
			<h2>Followers</h2>
			<button onClick={() => showT(!show)}>Show followers</button>
			{show &&

			 <ul>
			   <li>Tejpaul</li>
			   <li>Shreyas</li>
			   <li>Mangi</li>
			 </ul>}
			<h2>Following</h2>
			<button onClick={() => showT2(!show2)}>Show following</button>
			{
				show2 &&
				<ul>
				  <li>Akshit</li>
				  <li>Adnan</li>
				  <li>Lakshya</li>
				</ul>
			}
			<button onClick={logOut}>log out</button>
		</div>
	);
};

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  // on load - check token
  // if token
  // send token to server - if verified - send to profile page
  // if not verified, remove from local storage and send to register

  // if no token
  // send to register
  // if already registered, send to login

  const [register, setReg] = useState(false);

	const LoginToggle = () => {
		setLoggedIn(true)
	}

	const LogoutToggle = () => {
		setLoggedIn(false)
	}

  return (
    <div>
      <BrowserRouter>
        <Navbar loggedIn={loggedIn} />

        <Routes>
          <Route path="/register" element={<Register loggedIn={loggedIn} setLogin={LoginToggle} />} />
          <Route path="/profile" element={<Profile loggedIn={loggedIn} />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
