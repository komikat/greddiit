import { useContext, useState } from "react";
import { useQuery } from "react-query";
import { Navigate, useLocation } from "react-router-dom";
import { serverURL } from "../helpers/server";
import { UserContext, UserLoad, UserValid } from "../helpers/UserContext";
import { NavBar } from "./Nav";
import axios from "axios";
import { getUser, useUser } from "../helpers/User";

type ProtectedProps = {
	children: React.ReactNode;
};

export const Protected = ({ children }: ProtectedProps) => {
	const { isLoading, isError } = useUser();

	if (isLoading) {
		return <div>Loading</div>;
	}

	if (isError) {
		return <Navigate to="/login" replace={true} />;
	}

	return (
		<>
			<NavBar />
			{children}
		</>
	);
};
