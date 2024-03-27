import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import QueryContext from "./QueryContext";
import { Typography } from "@mui/material";

function valuetext(value) {
	return `${value}°C`;
}

const minDistance = 100;

export const getStartValue = () => {
	if (window.location.search) {
		const urlParams = new URLSearchParams(window.location.search);
		const slider = JSON.parse(urlParams.get("slider"));
		return slider;
	}
	return [500, 8000];
};

export default function PriceSlider({ flex }) {
	const { queryParams, setQueryParams } = React.useContext(QueryContext);
	const [value, setValue] = React.useState([500, 8000]);

	const handleChange = (event, newValue, activeThumb) => {
		if (!Array.isArray(newValue)) {
			return;
		}
		let changeValue = value;
		if (activeThumb === 0) {
			changeValue = [
				Math.min(newValue[0], value[1] - minDistance),
				value[1],
			];
			setValue(changeValue);
		} else {
			changeValue = [
				value[0],
				Math.max(newValue[1], value[0] + minDistance),
			];
			setValue(changeValue);
		}
	};

	const handleSubmit = (event) => {
		queryParams["slider"] = value ? value : [500,8000];
		setQueryParams(queryParams);
	};

	React.useEffect(() => {
		setValue(getStartValue());
		handleSubmit();
	}, []);

	return (
		<div style={{ display: flex ? "flex" : "inline", marginRight:"30px"}}>
			<Typography
				sx={{
					fontWeight: "bold",
					marginTop: "17px",
					marginRight: "20px",
					marginLeft: flex ? "-150px" : "25px",
					textAlign: "center",
					marginBottom: "-15px",
				}}>
					{(value[0] + "€ - " + value[1] + "€")}
			</Typography>
			<Box
				sx={{
					width: flex ? 300 : "98%",
					paddingLeft: flex ? "0px" : "20px",
					textAlign: "center",
					paddingTop: "15px",
				}}>
				<Slider
					getAriaLabel={() => "Minimum distance"}
					value={value ? value : [500,8000]}
					min={500}
					step={100}
					max={8000}
					onChange={handleChange}
					onMouseUp={handleSubmit}
					onKeyUp={handleSubmit}
					valueLabelDisplay="off"
					getAriaValueText={valuetext}
					disableSwap
				/>
			</Box>
		</div>
	);
}
