import React from "react";

import "./AvailabilityTable.css";
import { API_ROUTE } from "../../utils/PrivateRoute";
import { AuthContext } from "../../utils/AuthContext";

import { useNavigate } from "react-router-dom";

import { Button, CircularProgress } from "@mui/material";
import Alert from "@mui/material/Alert";

import SearchIcon from "@mui/icons-material/Search";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

const AvailabilityTable = ({ roomTypes, hotelId, startDate, endDate }) => {
	const [availableRooms, setAvailableRooms] = React.useState({});
	const [loading, setLoading] = React.useState(true);
	const [reservationError, setReservationError] = React.useState(false);
	const { user } = React.useContext(AuthContext);
	const navigate = useNavigate();

	const checkAvailability = async (event) => {
		event.preventDefault();
		setLoading(true);
		let newRooms;

		const reservationData = {
			email: user && user.email,
			hotelId: hotelId,
			startDate: startDate.toISOString().split("T")[0],
			endDate: endDate.toISOString().split("T")[0],
		};

		try {
			const response = await fetch(API_ROUTE + "availability/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(reservationData),
			});
			const data = await response.json();

			newRooms = { ...availableRooms };
			Object.entries(data).forEach((arr) => {
				newRooms[arr[0]] = arr[1];
			});


			setAvailableRooms(newRooms);
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
		return newRooms;
	};

	const reserveRoomPEND = async (objType) => {
		const reservationData = {
			hotelId: hotelId,
			roomType: objType,
			roomId: availableRooms[objType][0],
			email: user.email,
			startDate: startDate.toISOString().split("T")[0],
			endDate: endDate.toISOString().split("T")[0],
		};

		let res = await fetch(API_ROUTE + "pend-reserve/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(reservationData),
		})
		setReservationError(!res.ok)
		let data = await res.json()
		return data
	};

	const handleRedirect = (objType) => {
		if (user) {
			reserveRoomPEND(objType).then((data) => {
				typeof data === "number" && navigate(`reservation/${data}`)
			});
		} else {
			let path = `/login/?to=/products/${hotelId}`;
			navigate(path);
		}
	};

	const setStyle = (obj, component) => {
		if (
			typeof availableRooms[obj.type] == "object" &&
			availableRooms[obj.type].length === 0
		) {
			if (component == "tableRow") {
				return { textDecoration: "line-through", color: "red" };
			}
		} else {
			if (component == "tableRow") {
				return {};
			}
			return "primary";
		}
	};

	const buttonTypeIfAvailable = (obj) => {
		if (
			typeof availableRooms[obj.type] == "object" &&
			availableRooms[obj.type].length != 0
		) {
			return (
				<Button
					endIcon={<ArrowOutwardIcon />}
					variant="contained"
					color={setStyle(obj, "button")}
					value={obj.type}
					onClick={async (event) => {
						let newRooms = await checkAvailability(event);
						if (newRooms[obj.type].length != 0) {
							handleRedirect(obj.type);
						}
					}}>
					{user ? "Reserve" : "Login to Reserve"}
				</Button>
			);
		} else {
			return (
				<Button
					disabled
					variant="contained"
					color={setStyle(obj, "button")}
					value={obj.type}>
					{typeof availableRooms[obj.type] == "object"
						? "Unavailable"
						: "Check Availability"}
				</Button>
			);
		}
	};

	React.useEffect(() => {
		if (roomTypes) {
			let first = {};

			for (const obj of roomTypes ){
				first[obj.type] = true;
			}

			setAvailableRooms(first);
			setLoading(false);
		}
	}, [roomTypes]);

	return (
		<div style={{ padding: "20px" }}>
			{reservationError && (
				<Alert severity="error">Room was reserved during request</Alert>
			)}
			<table className="availability-table">
				<thead>
					<tr>
						<th>Room Type</th>
						<th>Description</th>
						<th>Price</th>
						<th
							style={{
								justifyContent: "center",
								display: "flex",
							}}>
							{loading ? (
								<CircularProgress />
							) : (
								<Button
									startIcon={<SearchIcon />}
									variant="contained"
									onClick={checkAvailability}>
									Check Availability
								</Button>
							)}
						</th>
					</tr>
				</thead>
				<tbody key={availableRooms}>
					{roomTypes.map((obj) => (
						<tr key={obj.type} style={setStyle(obj, "tableRow")}>
							<td>{obj.type}</td>
							<td>{obj.description}</td>
							<td>{obj.price + "$"}</td>
							<td
								style={{
									justifyContent: "center",
									display: "flex",
								}}>
								{loading ? (
									<CircularProgress />
								) : (
									buttonTypeIfAvailable(obj)
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default AvailabilityTable;
