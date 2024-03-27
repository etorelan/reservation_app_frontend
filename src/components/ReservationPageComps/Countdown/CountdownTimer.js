import React from "react";
import DateTimeDisplay from "./DateTimeDisplay";
import { useCountdown } from "./useCountdown";

const ExpiredNotice = () => {
	
	return (
		<div className="expired-notice">
			<span style={{color:"red", fontWeight:"bold"}}>Expired, return in a minute</span>
		</div>
	);
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
	return (
		<div className="show-counter" style={{ display: "flex" }}>
			<DateTimeDisplay value={minutes} type={"Mins"} isDanger={false} />

			<p style={{ marginLeft: "2px", marginRight: "2px" }}>:</p>

			<DateTimeDisplay
				value={seconds}
				type={"Seconds"}
				isDanger={false}
			/>
		</div>
	);
};

const CountdownTimer = ({ targetDate, setError }) => {
	const [days, hours, minutes, seconds] = useCountdown(targetDate);

	if (days + hours + minutes + seconds <= 0) {
		setError(true)
		return <ExpiredNotice />;
	} else {
		return (
			<ShowCounter
				minutes={minutes}
				seconds={seconds}
			/>
		);
	}
};

export default CountdownTimer;
