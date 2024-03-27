import React from "react";
import CountdownTimer from "./CountdownTimer";
import Loading from "../../Loading";
import { CircularProgress } from "@mui/material";

export default function Countdown({ createdAt, setError }) {
	if (createdAt === "2023-04-17T20:20:17.116450Z"){
		return <CircularProgress/>
	}
	const date = new Date(createdAt);
  
	// Get the epoch time (UNIX timestamp) in milliseconds + 18 minutes 
	//to ensure that an expired "PEND" Reservation will not be accessed
	const epochTime = date.getTime() +  18 * 60 * 1000 
  


	const dateTimeAfterThreeDays = epochTime;

	return <CountdownTimer targetDate={dateTimeAfterThreeDays} setError={setError} />;
}
