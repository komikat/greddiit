import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { UserRequest } from "./../types/Users";

export const Requests = () => {
	const { subName } = useParams();
	const { isLoading, isError, data, refetch } = useQuery(
		"requests",
		async () => {
			return await axios.get(`http://localhost:8080/subs/requests/${subName}`);
		},
		{ retry: false }
	);

	const approveReq = useMutation(
		(_id: String) => {
			return axios({
				method: "post",
				url: `http://localhost:8080/subs/requests/approve/${subName}`,
				data: { _id: _id },
			});
		},
		{
			onSuccess: () => {
				refetch();
			},
		}
	);

	const declineReq = useMutation(
		(_id: String) => {
			return axios({
				method: "post",
				url: `http://localhost:8080/subs/requests/decline/${subName}`,
				data: { _id: _id },
			});
		},
		{
			onSuccess: () => {
				refetch();
			},
		}
	);
	//
	if (isLoading) {
		return <div>Loading</div>;
	}

	if (isError) {
		return <div>Error</div>;
	}
	const requests = data!.data.requests;
	console.log(requests);

	return (
		<div>
			<h2>Requests</h2>
			<br />
			{requests.length !== 0 ? (
				requests.map((request: UserRequest) => {
					return (
						<div>
							<h5>{request.userName}</h5>
							{request.firstName && <p>first name: {request.firstName}</p>}
							{request.lastName && <p>last name: {request.lastName}</p>}
							{request.email && <p>email: {request.email}</p>}
							{request.age && <p>age: {request.age.toString()}</p>}
							{request.contactNumber && (
								<p>contact: {request.contactNumber.toString()}</p>
							)}
							<div style={{ marginBottom: "10px" }}>
								<button
									style={{ marginRight: "10px" }}
									onClick={() => approveReq.mutate(request._id)}
								>
									Approve
								</button>
								<button onClick={() => declineReq.mutate(request._id)}>
									Decline
								</button>
							</div>
							<hr />
						</div>
					);
				})
			) : (
				<div>No requests yet</div>
			)}
		</div>
	);
};
