export type Report = {
	reportedUser: {
		userName: String;
		_id: String;
	};
	reportBy: {
		userName: String;
		_id: String;
	};
	_id: String;
	post: {
		title: String;
		text: String;
		_id: String;
	};
	concern: String;
	ignored: boolean;
	blocked: boolean;
};
