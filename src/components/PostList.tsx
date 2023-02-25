import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export const PostList = () => {
	const { subName } = useParams();
	const { isLoading, isError, data, refetch } = useQuery(
		"posts",
		async () => {
			return await axios.get(`http://localhost:8080/subs/get/${subName}`);
		},
		{ retry: false }
	);

	const posts = data!.data.post;
};
