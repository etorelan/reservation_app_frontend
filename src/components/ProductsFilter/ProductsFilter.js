import * as React from "react";
import uniqid from "uniqid";
import { useNavigate } from "react-router-dom";

import PriceSlider from "./PriceSlider";
import QueryMenu from "./QueryMenu";
import QueryContext from "./QueryContext";

import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchBar from "./SearchBar";

export default function ProductsFilter({ refreshProducts, flex }) {
	const { queryParams, setQueryParams, destinationTags, setDestinationTags } =
		React.useContext(QueryContext);
	const [resetSearchValue, setResetSearchValue] = React.useState(false);
	const [searchIncomplete, setSearchIncomplete] = React.useState(false);

	const navigate = useNavigate();

	const QUERY_BUTTONS = [
		{
			displayName: "service",
			options: ["B&B", "All-Inclusive", "Ultra All-Inclusive", "Hostel"],
			dbName: "service",
		},
		{
			displayName: "stars",
			options: [1, 2, 3, 4, 5],
			dbName: "star_rating",
		},
		{
			displayName: "category",
			options: ["Family", "Only Adults"],
			dbName: "category",
		},
	];

	const queryDB = (e) => {
		if (!queryParams["country"]) {
			setSearchIncomplete(true);
			return;
		}
		setSearchIncomplete(false);


		var urlParams = new URLSearchParams();
		Object.keys(queryParams).forEach((key) => {
			if (key === "page"){
				urlParams.append(key.toString(), JSON.stringify(1));
			}else{
					urlParams.append(key.toString(), JSON.stringify(queryParams[key]));
			}
		});

		let path = "";

		if (
			window.location.pathname[window.location.pathname.length - 1] !==
			"/"
		) {
			path = window.location.pathname + "/?" + urlParams;
		} else {
			path = window.location.pathname + "?" + urlParams;
		}
		
		navigate(path.toString());
		refreshProducts();
	};

	return (
		<div
			style={{
				// width: "100%",
				paddingTop: "15px",
				marginLeft: flex && "50px",
			}}>
			<div
				style={{
					display: flex && "flex",
					justifyContent: "center",
				}}>
				{/* <PriceSlider flex={flex} /> */}
				<SearchBar
					resetSearchValue={resetSearchValue}
					searchIncomplete={searchIncomplete}
				/>
				<div
					style={{
						float: flex && "right",
						marginLeft: "10px",
						marginRight: "30px",
						paddingTop: "7px",
						display: "flex",
						justifyContent: "center",
					}}>
					{QUERY_BUTTONS.map((elem) => {
						return (
							<div key={uniqid()} style={{ marginLeft: "10px" }}>
								<QueryMenu
									key={uniqid()}
									displayName={elem.displayName}
									dbName={elem.dbName}
									options={elem.options}
								/>
							</div>
						);
					})}
					<IconButton
						size="small"
						sx={{
							paddingLeft: "30px",
							marginRight: "-30px",
							maxHeight: "50px",
						}}
						onClick={() => {
							setQueryParams({ page: 1 });
							setDestinationTags([]);
							setResetSearchValue(!resetSearchValue);
							setSearchIncomplete(false);
							navigate(window.location.pathname.toString());
							refreshProducts();
						}}>
						<DeleteIcon sx={{ fontSize: 30 }} />
					</IconButton>
					<Button
						variant="contained"
						color="success"
						sx={{ marginLeft: "45px", maxHeight: "45px" }}
						endIcon={<SearchIcon />}
						onClick={queryDB}>
						FIND
					</Button>
				</div>
			</div>
		</div>
	);
}
