import { AxiosResponse } from "axios";
import { useMutation } from "react-query";
import { Sub } from "./../types/Subs";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ListSubProps = {
	data: AxiosResponse;
	isLoading: boolean;
	isError: boolean;
	refetch: any;
};

export const ListSub = ({
	data,
	isLoading,
	isError,
	refetch,
}: ListSubProps) => {
	const navigate = useNavigate();
	const deleteMutate = useMutation(
		(subName: String) => {
			return axios({
				method: "get",
				url: `http://localhost:8080/subs/delete/${subName}`,
			});
		},
		{
			onSuccess: () => {
				refetch();
			},
		}
	);

	if (isLoading) {
		return <div>Loading</div>;
	}

	if (isError) {
		return <div>Something went wrong, text Akshit</div>;
	}

	const subs = data!.data;

	if (!subs) {
		return <div>Subs not loaded</div>;
	}

	return (
		<div>
			{subs.map((sub: Sub) => {
				console.log(sub);
				return (
					<>
						<hr />
						<h4>{sub.name}</h4>
						<p>
							<i>{sub.description ? sub.description : "No description yet"}</i>
						</p>
						<button onClick={() => navigate(`/g/${sub.name}`)}>open</button>

						<h6>{sub.followers.length} follower(s)</h6>
						<h6>{sub.posts.length} post(s)</h6>
						<h6>Banned keywords</h6>
						<i>
							{!(
								(sub.banned.length == 1 && sub.banned[0] == "") ||
								sub.banned.length == 0
							)
								? sub.banned.map((word) => <li>{word}</li>)
								: "None yet"}
						</i>
						<br />
						<button
							onClick={() => {
								deleteMutate.mutate(sub.name);
							}}
						>
							delete
						</button>
					</>
				);
			})}
		</div>
	);
};
