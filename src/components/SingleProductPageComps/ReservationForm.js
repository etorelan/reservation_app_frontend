import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_ROUTE, BLUE_COLOR } from "../../utils/PrivateRoute";
import AvailabilityTable from "./AvailabiltyTable";
import { Typography } from "@mui/material";


const ReservationForm = ({ hotelId, roomTypes }) => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date(new Date().getTime()+(24*60*60*1000)))

	const handleDatePick = (date, startDateSelected) => {
		if (!(date < currentDate || (!startDateSelected && date < startDate))) {
			if (startDateSelected) {
				setStartDate(date);
			}
			setEndDate(date);
		} 
	};

	return (
		<div>
			<div
				style={{
					padding: "20px",
					margin: "50px 20px 20px 20px ",
					justifyContent: "center",
					display: "flex",
					backgroundColor: BLUE_COLOR,
					borderRadius: "30px",
				}}>
				<div>
					<Typography
						variant="body1"
						sx={{ color: "whitesmoke" }}>
						Check In Date:
					</Typography>
					<DatePicker
						placeholderText="I have been cleared!"
						selected={startDate}
						onChange={(date) => handleDatePick(date, true)}
					/>
				</div>
				<div style={{ marginLeft: "40px" }}>
					<Typography
						variant="body1"
						sx={{ color: "whitesmoke" }}>
						Check Out Date:
					</Typography>
					<DatePicker
						placeholderText="I have been cleared!"
						selected={endDate}
						onChange={(date) => handleDatePick(date, false)}
					/>
				</div>
			</div>
			<AvailabilityTable
				roomTypes={roomTypes}
				hotelId={hotelId}
				startDate={startDate}
				endDate={endDate}
			/>
		</div>
	);
};

export default ReservationForm;
