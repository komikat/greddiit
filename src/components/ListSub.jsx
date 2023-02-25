const ListSub = (data) => {
		if (isLoading) {
			return <div>Loading</div>;
		}

		if (isError) {
			return <div>Something went wrong, text Akshit</div>;
		}
		const subs = data!.data.subs;

		return (
			<div>
				{subs.map((sub: sub) => {
					return (
						<>
							<hr />
							<h4>{sub.name}</h4>
							<i>{sub.description ? sub.description : "No description yet"}</i>
							<h6>Banned keywords</h6>
							<i>
								{!(
									(sub.banned.length == 1 && sub.banned[0] == "") ||
									sub.banned.length == 0
								)
									? sub.banned.map((word) => <li>{word}</li>)
									: "None yet"}
							</i>
							<h6>Tags</h6>
							<i>
								{sub.tags.length != 0
									? sub.tags.map((word) => <li>{word}</li>)
									: "None yet"}
							</i>
						</>
					);
				})}
			</div>
		);
	};
