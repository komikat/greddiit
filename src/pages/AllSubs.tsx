import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { ListSub } from "../components/ListSub";
import { useUser } from "../helpers/User";
import { Sub } from "../types/Subs";
import { useState } from "react";
import _ from "lodash";

export const AllSubs = () => {
	const user = useUser();
	const navigate = useNavigate();

	console.log(user.data);
	const { isLoading, isError, data, refetch } = useQuery("all", async () => {
		const newData = await axios.get("http://localhost:8080/subs/getall");
		console.log(newData.data);
		return newData;
	});

	const requestSub = useMutation(
		(subName: String) => {
			return axios({
				method: "get",
				url: `http://localhost:8080/subs/request/${subName}`,
			});
		},
		{
			onSuccess: () => {
				refetch();
			},
		}
	);

	const leaveSub = useMutation(
		(subName: String) => {
			return axios({
				method: "get",
				url: `http://localhost:8080/subs/leave/${subName}`,
			});
		},
		{
			onSuccess: () => {
				refetch();
			},
		}
	);

	const [search, setSearch] = useState("");
	const [tag, setTag] = useState("");

	if (isLoading) {
		return <div>Loading</div>;
	}

	if (isError) {
		return <div>Error</div>;
	}

	const subs = data!.data;
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	};
	const handleTag = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTag(e.target.value);
	};

	return (
		<div>
			<h1>All subs</h1>
			<input
				placeholder="Search by name"
				value={search}
				onChange={handleSearch}
			/>
			<br />
			<input
				placeholder="Filter by tag (commasep)"
				value={tag}
				onChange={handleTag}
			/>
			{subs
				.filter((sub: Sub) => {
					return sub.name.toLowerCase().includes(search.toLowerCase());
				})
				.filter((sub: Sub) => {
					const subtagList = sub.tags[0].split(",").map((s: String) => {
						return s.trim().toLowerCase();
					});

					const searchTagList = tag.split(",").map((s: String) => {
						return s.trim().toLowerCase();
					});

					const common = _.intersection(subtagList, searchTagList);
					if (tag === "") {
						return 1;
					}

					return common.length > 0;
				})
				.map((sub: Sub) => {
					return (
						<>
							<h3>{sub.name}</h3>

							<button
								disabled={
									sub.followers.includes(user.data._id) ||
									sub.bannedUsers.includes(user.data._id) ||
									sub.requests.includes(user.data._id) ||
									sub.left.includes(user.data._id) ||
									isLoading
								}
								onClick={() => {
									requestSub.mutate(sub.name);
								}}
							>
								Join
							</button>
							<button onClick={() => navigate(`/g/${sub.name}`)}>open</button>
							<button
								onClick={() => leaveSub.mutate(sub.name)}
								disabled={
									!sub.followers.includes(user.data._id.toString()) ||
									sub.creator.includes(user.data._id.toString())
								}
							>
								leave
							</button>
						</>
					);
				})}
		</div>
	);
};
