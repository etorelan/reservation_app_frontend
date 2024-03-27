import * as React from "react";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FilterListIcon from "@mui/icons-material/FilterList";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";

import QueryContext from "./QueryContext";
import uniqid from "uniqid";


export default function QueryMenu({ displayName, dbName, options }) {
	const [open, setOpen] = React.useState(false);
	const [radioSelected, setRadioSelected] = React.useState("");
	const anchorRef = React.useRef(null);
	const { queryParams, setQueryParams } = React.useContext(QueryContext);
		

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}
		setOpen(false);
	};

	const handleSelect = (e) => {
		let selectedRadio = e.target.value.slice(e.target.value.length - 1, e.target.value.length)
		setRadioSelected(selectedRadio);
		queryParams[dbName] = +e.target.value[e.target.value.length-1];
		setQueryParams(queryParams);
	};

	const handleStarSelect = (e) =>{
		let starRating = +e.target.value
		
		if (!queryParams[dbName] || queryParams[dbName].length === 0){
			queryParams[dbName] = [starRating]
		}else{

			const i = queryParams[dbName].indexOf(starRating)
			if (i >= 0 ){
				queryParams[dbName].splice(i, 1)
				if(queryParams[dbName].length === 0){
					delete queryParams[dbName]
				}
			} else {				
				queryParams[dbName].push(starRating)
			}
		}
		setQueryParams(queryParams)
		e.target.setAttribute('defaultChecked', true);
	}


	// return focus to the button when we transitioned from !open -> open
	const prevOpen = React.useRef(open);
	React.useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current.focus();
		}

		prevOpen.current = open;
		
	}, [open]);

	return (
		<Stack direction="row" spacing={2}>
			<div>
				<Button
					ref={anchorRef}
					id="composition-button"
					aria-controls={open ? "composition-menu" : undefined}
					aria-expanded={open ? "true" : undefined}
					aria-haspopup="true"
					variant="contained"
					sx={{ p: 1.1 }}
					endIcon={<FilterListIcon />}
					onClick={handleToggle}>
					{displayName}
				</Button>
				<Popper
					open={open}
					anchorEl={anchorRef.current}
					role={undefined}
					placement="bottom-start"
					transition
					disablePortal>
					{({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							style={{
								transformOrigin:
									placement === "bottom-start"
										? "left top"
										: "left bottom",
							}}>
							<Paper>
								<ClickAwayListener onClickAway={handleClose}>
									<MenuList
										autoFocusItem={open}
										id="composition-menu"
										aria-labelledby="composition-button"
										>
										{displayName !== "stars" ? (
											<FormControl>
												<RadioGroup
													aria-labelledby="demo-controlled-radio-buttons-group"
													name="controlled-radio-buttons-group"
													value={queryParams[dbName] >= 0 ? queryParams[dbName]: "female"}
													onChange={handleSelect}>
													{options.map((option, index) => {
														return (
															<FormControlLabel
																key={uniqid()}
																value = {index.toString()}
																control={
																	<Radio />
																}
																label={option}
															/>
														);
													})}
												</RadioGroup>
											</FormControl>
										) : (
											<FormGroup >
														<div style={{display:"flex"}}>
														{options.map((option) => {
															return (
																<FormControlLabel
																	key={uniqid()}
																	control={
																		<Checkbox
																			value={option}
																			onChange={handleStarSelect}
																			defaultChecked={queryParams[dbName] && queryParams[dbName].indexOf(option) >= 0}
																		/>
																	}
																	label={option}
																/>
															);
														})}
												</div>
											</FormGroup>
										)}
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>
			</div>
		</Stack>
	);
}
