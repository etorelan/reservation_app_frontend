import React, { useContext, useEffect, useState } from "react";
import { Navigate,  useParams } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const PrivateRoute = ({ Component }) => {
	const { user } = useContext(AuthContext);
	let { reservationID } = useParams();
	const [isAllowed, setIsAllowed] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const checkUserAllowed = async () => {
			let packet = { email: user.email, reservationID: reservationID };
			try {
				const response = await fetch(API_ROUTE + "is-allowed/", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(packet),
				});
				if (response.status != 200) {
					setIsAllowed(false);
					setError("Access not allowed.");
				} else if (response.status === 200) {
					setIsAllowed(true);
				} 
			} catch (error) {
				setError("An error occurred while checking user access.");
			}
			setIsLoading(false);
		};
		checkUserAllowed();
	}, [user.email, reservationID]);

	let style = { display: "flex", justifyContent: "center" };

	if (isLoading) {
		return <h1 style={style}>Loading...</h1>;
	}

	if (error) {
		return <h1 style={style}>Error: {error}</h1>;
	}

	if (!isAllowed || user === undefined) {
		return <Navigate to="/not-found" />;
	}

	return <Component />;
};

export default PrivateRoute;

const API_ROUTE = "https://reservation-app-backend-emi8.onrender.com/api/";
const BLUE_COLOR = "#1976d2";
export { API_ROUTE, BLUE_COLOR };
// This function ensures the user accessing this page is
// also the one who made the reservation and thus checks:
// if the requested reservation id exists
// if reservation status == PEND
// if user's email is the one making a reservation
