import { Container, Box, Typography, Grid } from "@mui/material";
import {  ThemeProvider } from "@mui/material/styles";
import { API_ROUTE } from "../utils/PrivateRoute";
import { Link } from "react-router-dom";

const Product = ({ id, name, description, city, image, theme }) => {
	return (
		<Grid item>
			<ThemeProvider theme={theme}>
				<Box
					sx={{
						minWidth: "400px",
						maxWidth: "500px",
						display: { height: "350px" },
					}}>
					<Container
						maxWidth="xs"
						disableGutters={true}
						sx={{
							p: 2,
							paddingRight: "2em",
							backgroundColor: "#0e9aa7",
							borderRadius: "8px",
						}}>
						<Link
							to={id.toString()}
							style={{
								textDecoration: "none",
								color: "#1976d2",
							}}>
							<Typography
								variant="h6"
								align="left"
								color="whitesmoke"
								noWrap={true}
								style={{ padding: 2, fontWeight: "bolder" }}>
								{name}
							</Typography>
						</Link>
						<Typography>{description.slice(0, 70)}</Typography>
						<img
							// src={API_ROUTE.slice(0,-5) + image}
							src={API_ROUTE + "images/hotel-ga705b1519_1280.webp"}
							alt="image"
							height="80%"
							width="100%"
							fit="cover"
							style={{
								minWidth: "230px",
								maxWidth: "325px",
								maxHeight:"200px",
								display: "block",
								marginLeft: "auto",
								marginRight: "auto",
								// width: "50%",
							}}
						/>

					</Container>
				</Box>
			</ThemeProvider>
		</Grid>
	);
};
export default Product;
