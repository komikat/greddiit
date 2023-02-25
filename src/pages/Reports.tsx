import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../helpers/User";
import { Report } from "../types/Report";
import { useState, useEffect } from "react";

export const Reports = () => {
	const { subName } = useParams();
	const user = useUser();

	const { isLoading, isError, data, refetch } = useQuery(
		"reports",
		async () => {
			return await axios.get(`http://localhost:8080/reports/get/${subName}`);
		},
		{
			retry: false,
		}
	);

	const sub = useQuery(
		"followers",
		async () => {
			return await axios.get(`http://localhost:8080/subs/followers/${subName}`);
		},
		{ retry: false }
	);

	const deleteReportMutat = useMutation(
		(reportId: String) => {
			return axios({
				method: "post",
				url: `http://localhost:8080/reports/delete/${subName}`,
				headers: {
					"Content-Type": "application/json",
				},
				data: JSON.stringify({
					reportId,
				}),
			});
		},
		{
			onSuccess: () => {
				refetch();
			},
		}
	);

	const ignoreReportMutat = useMutation(
		(reportId: String) => {
			return axios({
				method: "post",
				url: `http://localhost:8080/reports/ignore/${subName}`,
				headers: {
					"Content-Type": "application/json",
				},
				data: JSON.stringify({
					reportId,
				}),
			});
		},
		{
			onSuccess: () => {
				refetch();
			},
		}
	);

	const blockReportMutat = useMutation(
		(reportId: String) => {
			return axios({
				method: "post",
				url: `http://localhost:8080/reports/block/${subName}`,
				headers: {
					"Content-Type": "application/json",
				},
				data: JSON.stringify({
					reportId,
				}),
			});
		},
		{
			onSuccess: () => {
				refetch();
				console.log("blocked!");
			},
		}
	);

	const [timeLeft, setTimeLeft] = useState(4);
	const [id, setId] = useState("");
	useEffect(() => {
		const timer = setTimeout(() => {
			console.log(timeLeft);
			if (timeLeft == 3) {
				setTimeLeft(2);
			}
			if (timeLeft == 2) {
				setTimeLeft(1);
			}
			if (timeLeft == 1) {
				setTimeLeft(4);
				blockReportMutat.mutate(id);
			}
		}, 1000);

		return () => clearTimeout(timer);
	}, [timeLeft]);

	if (isLoading) {
		return <div>Loading</div>;
	}

	if (isError) {
		return <div>Error</div>;
	}

	const reports = data!.data;
	const buttonStyle: React.CSSProperties = {
		background: "inherit",
		color: "black",
	};
	return (
		<div>
			<h3>Reports</h3>

			<div style={{ marginTop: "40px" }}>
				{reports &&
					reports.map((report: Report) => {
						return (
							<div>
								<span>
									<i>{report.reportedUser.userName}</i> was reported by
									<i> {report.reportBy.userName}</i> for
								</span>
								<h5 style={{ marginTop: "3px" }}>
									&quot;{report.concern}&quot;
								</h5>

								<p>
									<b>Post Title: </b>
									{report.post.title}
								</p>
								<p>
									<b>Content: </b>
									{report.post.title}
								</p>

								<br />
								<div style={{ marginBottom: "10px" }}>
									{report.blocked ? (
										<button
											disabled={true}
											style={{
												color: "white",
												background: "black",
												marginRight: "5px",
												border: "2px solid black",
											}}
										>
											Blocked
										</button>
									) : id !== report._id.toString() || timeLeft === 4 ? (
										<button
											style={{
												color: "white",
												background: "black",
												marginRight: "5px",
												border: "2px solid black",
											}}
											disabled={report.ignored}
											onClick={() => {
												setId(report._id.toString());
												setTimeLeft(3);
											}}
										>
											Block
										</button>
									) : (
										<button
											style={{
												color: "white",
												background: "black",
												marginRight: "5px",
												border: "2px solid black",
											}}
											onClick={() => {
												setTimeLeft(4);
											}}
										>
											Blocking in {timeLeft} seconds
										</button>
									)}

									<button
										style={{
											marginRight: "5px",
											border: "2px soid black",
										}}
										onClick={() => deleteReportMutat.mutate(report._id)}
										disabled={report.ignored}
									>
										Delete
									</button>
									<button
										style={{
											border: "2px solid 	black",
											background: "inherit",
											color: "black",
										}}
										onClick={() => ignoreReportMutat.mutate(report._id)}
										disabled={report.ignored}
									>
										Ignore
									</button>
								</div>
								<hr />
								<br />
							</div>
						);
					})}
			</div>
		</div>
	);
};
