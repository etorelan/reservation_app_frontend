import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ErrorIcon from "@mui/icons-material/Error";
import QueryContext from "./QueryContext";
import debounce from "lodash.debounce";
import { API_ROUTE } from "../../utils/PrivateRoute";

export default function SearchBar({ resetSearchValue, searchIncomplete }) {
	const [locations, setLocations] = React.useState(["Turkey"]);
	const { queryParams, setQueryParams, destinationTags, setDestinationTags } =
		React.useContext(QueryContext);
	let isSearchIncomplete = searchIncomplete;

	const doCityFilter = debounce(async (query) => {
		if (!query) return setLocations([""]);


		let searchBarQuery = JSON.stringify({
			query: query,
			countryName: queryParams["country"] ? queryParams["country"] : "",
		});

		let res = await fetch(API_ROUTE + "search-bar/" + searchBarQuery, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		let data = await res.json();
		if (res.status === 200) {
			let newLocations = [];
			data.map((elem) => {
				if (typeof elem === "object") {
					newLocations.push(
						elem["city"] + ", " + elem["country_name"]
					);
				} else {
					newLocations.push(elem);
				}
			});
			setLocations(newLocations);
		}
	}, 500);

	const handleUserChoice = (event, value, reason, detail) => {
		if (reason == "selectOption") {
			let chosen = detail.option;
			let commaIndex = chosen.indexOf(",");

			if (commaIndex !== -1) {
				queryParams["city"] = chosen.slice(0, commaIndex);
				queryParams["country"] = chosen.slice(commaIndex + 2);
			} else {
				delete queryParams["city"];
				queryParams["country"] = chosen;
			}

			setQueryParams(queryParams);
			setLocations([chosen]);
		} else if (reason == "removeOption") {
			let commaIndex = detail.option.indexOf(",");
			if (commaIndex !== -1) {
				delete queryParams["city"];
			}
			if (value.length === 0) {
				delete queryParams["country"];
				isSearchIncomplete = true;
			}

		} else if (reason == "clear") {
			delete queryParams["city"];
			delete queryParams["country"];
			setDestinationTags([]);
			isSearchIncomplete = true;
		}
		setDestinationTags(value);
	};

	return (
		<div
			style={{
				justifyContent: "center",
				display: "flex",
				marginBottom: "20px",
			}}>
			<Autocomplete
				key={resetSearchValue}
				multiple
				id="tags-outlined"
				autoHighlight
				options={locations}
				sx={{
					width: 300,
				}}
				value={destinationTags}
				onChange={(event, value, reason, detail) =>
					handleUserChoice(event, value, reason, detail)
				}
				renderInput={(params) => (
					<TextField
						key={searchIncomplete}
						{...params}
						variant="standard"
						sx={{
							textEmphasisColor: "Highlight",
							border: isSearchIncomplete
								? "2px groove red"
								: "none",
						}}
						color={isSearchIncomplete ? "error" : "primary"}
						label={
							isSearchIncomplete
								? "Please input city or country"
								: "Destination"
						}
						onChange={(event) => {
							if (queryParams["city"] === undefined) {
								doCityFilter(event.target.value);
							}
						}}
					/>
				)}
			/>
		</div>
	);
}
