export type Post = {
	title: String;
	_id: String;
	text: String;
	postBy: {
		userName: String;
		_id: String;
	};
	upvotes: String[];
	downvotes: String[];
	comments: String[];
	creator: String;
	sub: any;
};
