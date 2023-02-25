import { useParams } from "react-router-dom";

export const SubPage = () => {
	let subName = useParams();
	return <div>Sub</div>;
};

export {};
