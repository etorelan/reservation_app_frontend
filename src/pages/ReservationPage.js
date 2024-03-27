import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Button, InputAdornment, Typography } from "@mui/material";
import { AuthContext } from "../utils/AuthContext";
import CountrySelect from "../components/ReservationPageComps/CountrySelect";
import Countdown from "../components/ReservationPageComps/Countdown/Countdown";
import { API_ROUTE } from "../utils/PrivateRoute";
import Loading from "../components/Loading";

export default function ReservationPage() {
	const DEFAULT_TIME_PREVENT_ERROR = "2023-04-17T20:20:17.116450Z";
	const { hotelID, reservationID } = useParams();
	const { user } = React.useContext(AuthContext);
	const [reservationInfo, setReservationInfo] = useState({
		checkIn: "",
		checkOut: "",
		createdAt: DEFAULT_TIME_PREVENT_ERROR,
	});
	const [error, setError] = useState(true);
	const [userError, setUserError] = useState(false);
	const [country, setCountry] = useState({
		code: "AD",
		label: "Andorra",
		phone: "376",
	});
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		phoneNumber: "",
	});
	let navigate = useNavigate();

	const getReservationInfo = async () => {
		try {
			let res = await fetch(API_ROUTE + "reservation-info/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ reservationID: reservationID }),
			});
			let data = await res.json();
			if (res.status == 200) {
				let newInfo = reservationInfo;
				newInfo["createdAt"] = data["time_created"];
				newInfo["checkIn"] = new Date(data["check_in_date_time"]);
				newInfo["checkOut"] = new Date(data["check_out_date_time"]);

				setReservationInfo(newInfo);
				setError(false);
			}
		} catch (error) {
			console.error("Error fetching reservation info:", error);
			const EXPIRED_DATE_TIME = "1900-04-17T20:20:17.116450Z";

			let newInfo = reservationInfo;
			newInfo["createdAt"] = EXPIRED_DATE_TIME;

			setReservationInfo(newInfo);
			setError(true);
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		// possible phoneRegex  /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/
		const phoneRegex = /^\d{9}$/;
		const isValidPhone = phoneRegex.test(formData.phoneNumber);

		if (!isValidPhone) {
			setUserError(true);
			return;
		}

		let body = formData;
		body["country"] = country;
		body["reservationID"] = reservationID;

		fetch(API_ROUTE + "create-checkout-session/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		})
			.then((res) => res.json())
			.then((data) => {
				window.location.href = data["url"];
			})
			.catch((error) => {
				console.error("Error fetching reservation info:", error);
			});
	};

	const cancelReservation = async () => {
		let res = await fetch(API_ROUTE + "cancel-reservation/", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				reservationID: reservationID,
				email: user["email"],
			}),
		});
		if (res.status == 200) {
			navigate(`/products/${hotelID}`);
		} else {
			setError(true);
		}
	};

	React.useEffect(() => {
		getReservationInfo();
	}, []);

	return (
		<div style={{ maxWidth: "100%" }}>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					marginTop: "40px",
				}}>
				<form onSubmit={handleSubmit}>
					<div style={{ display: "flex", justifyContent: "center" }}>
						<h6>Time left to complete reservation</h6>
						<div style={{ marginLeft: "15px", marginTop: "-2px" }}>
							<Countdown
								createdAt={reservationInfo["createdAt"]}
								setError={setError}
							/>
						</div>
					</div>
					<h6 style={{ display: "flex", justifyContent: "center" }}>
						{/* Check-in date: {reservationInfo["checkIn"].toDateString()} 						
						Check-out date: {reservationInfo["checkOut"].toDateString()}  */}
						{reservationInfo["checkIn"] &&
							reservationInfo["checkIn"].toDateString()}{" "}
						✈{" "}
						{reservationInfo["checkOut"] &&
							reservationInfo["checkOut"].toDateString()}
					</h6>
					<div className="form-row">
						<div
							style={{ maxWidth: "300px" }}
							className="form-group ">
							<label htmlFor="inputEmail4">First Name</label>

							<TextField
								error={error}
								required
								style={{ outlineColor: error && "red" }}
								name="firstName"
								className="form-control "
								placeholder="John"
								value={formData.firstName}
								onChange={handleChange}
							/>
						</div>
						<div
							style={{ maxWidth: "300px" }}
							className="form-group">
							<label
								htmlFor="inputPassword4"
								style={{ marginTop: "10px" }}>
								Last Name
							</label>
							<TextField
								required
								error={error}
								name="lastName"
								className="form-control"
								placeholder="Smith"
								value={formData.lastName}
								onChange={handleChange}
							/>
						</div>
					</div>
					<CountrySelect setCountry={setCountry} />
					<div style={{ margin: "20px -9px 0px -8px" }}>
						<TextField
							required
							error={userError}
							label="Phone Number"
							name="phoneNumber"
							value={formData.phoneNumber}
							onChange={handleChange}
							id="outlined-start-adornment"
							sx={{ m: 1, width: "30", display: "flex" }}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										{
											<h6
												style={{
													marginTop: "6px",
												}}>{`+${country.phone}`}</h6>
										}
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position="end">
										<div>
											<img
												loading="lazy"
												src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
												srcSet={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 2x`}
												alt=""
											/>
										</div>
									</InputAdornment>
								),
							}}
						/>
					</div>
					{error ? (
						<Button variant="contained" disabled>
							Reservation unavailable
						</Button>
					) : (
						<div>
							<Button type="submit" variant="contained">
								Complete reservation
							</Button>
							<Button
								variant="outlined"
								color="error"
								onClick={cancelReservation}>
								Cancel reservation
							</Button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
}
