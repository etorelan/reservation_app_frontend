import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const OnlyAnonRoute = ({ Component }) => {
	const { user } = useContext(AuthContext);

	return user ? <Navigate to="/"/> : <Component />;
};
export default OnlyAnonRoute;
