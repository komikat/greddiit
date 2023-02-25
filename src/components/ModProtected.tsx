import axios from "axios";
import { Navigate } from "react-router-dom";
import { useUser } from "../helpers/User";

type ProtectedProps = {
	children: React.ReactNode;
};

export const ModProtected = ({ children }: ProtectedProps) => {
	const { isLoading, isError } = useUser();
	axios.defaults.headers.common[
		"Authorization"
	] = `Bearer ${localStorage.getItem("token")}`;

	if (isLoading) {
		return <div>Loading</div>;
	}

	if (isError) {
		return <Navigate to="/login" replace={true} />;
	}

	return <>{children}</>;
};
