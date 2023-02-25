import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
import { serverURL } from "./server";

type User = {
	userName: String;
	email: String;
	password: String;
	firstName: String;
	lastName: String;
	age: String;
	contactNumber: String;
};

type LoginResponse = {
	status: String;
	token: String;
};

// specify return types
export const AuthUser = async (user: User, loginFlag: boolean) => {
	var data = JSON.stringify(user);

	var config = {
		method: "post",
		url: `http://localhost:8080/users/${loginFlag ? "register" : "login"}`,
		headers: {
			"Content-Type": "application/json",
		},
		data: data,
	};

	try {
		const response = await axios(config);
		console.log(response);
		return { status: response.status, token: response.data.token };
	} catch (e) {
		if (e instanceof AxiosError) {
			// console.log(e.response!.status)
			return { status: e.response!.status, error: e.response!.data };
		}
	}
};

export const AuthHandler = async (user: User, loginFlag: boolean) => {
	const res = await AuthUser(user, loginFlag);
	console.log("res", res!.status);
	if (res!.status == 200) {
		localStorage.setItem("token", res!.token);
		return { token: res!.token, error: null };
	}

	if (res!.status == 201) {
		localStorage.setItem("token", res!.token);
		return { token: res!.token, error: null };
	}

	if (res!.status == 409) {
		return {
			token: null,
			error: "The supplied username/email already exists, please try again.",
		};
	}
	if (res!.status == 404) {
		return { token: null, error: "The supplied username was not found." };
	}
	if (res!.status == 401) {
		return { token: null, error: "Please recheck your password." };
	}
	return {
		token: null,
		error: "Something went wrong, please report to Akshit.",
	};
};

export const getUser = async () => {
	const token = localStorage.getItem("token");
	var config = {
		method: "get",
		url: `${serverURL}/users/verify`,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios(config);
	return response.data;
};

export const useUser = () =>
	useQuery("user", getUser, {
		retry: false,
	});
