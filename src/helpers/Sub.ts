import axios, { AxiosError } from "axios";

type Sub = {
	name: String;
	description: String;
	tags: String;
	banned: String;
};

export const CreateSub = async (sub: Sub) => {
	var data = JSON.stringify({
		...sub,
		tags: sub.tags.split(","),
		banned: sub.banned.split(","),
	});
	var config = {
		method: "post",
		url: "http://localhost:8080/subs/new",
		headers: {
			"Content-Type": "application/json",
		},
		data: data,
	};

	try {
		const response = await axios(config);
		console.log(response);
		return response.status;
	} catch (e) {
		if (e instanceof AxiosError) {
			return e.response!.status;
		}
	}
};
