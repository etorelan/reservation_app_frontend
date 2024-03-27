import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import {
	createTheme,
	responsiveFontSizes,
	ThemeProvider,
} from "@mui/material/styles";

import ReservationForm from "../components/SingleProductPageComps/ReservationForm";
import { API_ROUTE } from "../utils/PrivateRoute";
import Loading from "../components/Loading";
import DialogCarousel from "../components/SingleProductPageComps/DialogCarousel";

let theme = createTheme();
theme = responsiveFontSizes(theme);

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function SingleProductPage({}) {
	const [open, setOpen] = React.useState(false);
	const [hotelImages, setHotelImages] = React.useState([]);
	const [hotel, setHotel] = React.useState(null);
	const [roomTypes, setRoomTypes] = React.useState([])

	let hotelPK = +window.location.pathname.slice(
		window.location.pathname.lastIndexOf("/") + 1,
		window.location.pathname.length
	);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const turnImagesToCarouselJSON = (reqData) => {
		let images = [];

		reqData.map((imageText, i) => {
			let optionalText = imageText.split("/").at(-1).slice(0, -4);
			images.push({
				src: API_ROUTE + imageText,
				altText: optionalText,
				caption: optionalText,
				key: i,
			});
		});
		return images;
	};

	async function getHotelImages(hotelPK) {
		let res = await fetch(API_ROUTE + "images/hotel/" + hotelPK, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		let data = await res.json();
		if (res.status === 200) {
			let hotel = data[0];
			setHotel(hotel);
			setHotelImages(
				turnImagesToCarouselJSON(data.slice(1, data.length))
			);
		}
	}

	const getRoomTypes = async () => {
		const reservationData = {
			hotel: hotelPK,
		};
		try {
			const response = await fetch(API_ROUTE + "hotel-rooms/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(reservationData),
			});
			const data = await response.json();
			setRoomTypes(data)
		} catch (error) {
			console.error(error);
		}
	};


	React.useEffect(() => {
		getHotelImages(hotelPK);
		getRoomTypes()
	}, []);

	if (!hotel) {
		return <Loading />;
	}
	return (
		<div>
			<div
				style={{
					padding: "20px",
					display: "flex",
					width: "100%",
					height: 700,
					borderRadius: "30px",
				}}>
				<div
					style={{
						width: "50%",
						borderRadius: "30px",
						backgroundColor: "green",
						height: 700,
						overflowY: "scroll",
						scrollbarWidth: "none",
					}}>
					<ThemeProvider theme={theme}>
						<Typography
							variant="h2"
							gutterBottom={true}
							sx={{
								padding: "20px",
							}}>
							{hotel.name.slice(0, 100)}
						</Typography>
						<Typography
							sx={{
								marginTop: "-20px",
								padding: "0px 20px 0px 20px",
							}}>
							{hotel.hotel_description.description}
						</Typography>
					</ThemeProvider>
				</div>

				<button
					onClick={handleClickOpen}
					style={{
						border: "none",
						outline: "none",
						justifyContent: "right",
						width: "50%",
						display: "flex",
						borderRadius: "30px",
						height: 700,
					}}>
					<div
						style={{
							width: "100%",
							height: 700,
							overflowY: "scroll",
							outline: "none",
							borderRadius: "30px",
						}}>
						<ImageList variant="masonry" cols={2} gap={8}>
							{hotelImages.map((hotelImage) => (
								<ImageListItem key={hotelImage["src"]}>
									<img
										src={hotelImage["src"]}
										alt={hotelImage["altText"]}
										loading="lazy"
									/>
								</ImageListItem>
							))}
						</ImageList>
					</div>
				</button>
			</div>

			<ReservationForm hotelId={hotelPK} roomTypes={roomTypes}/>
			
			<Dialog
				maxWidth="lg"
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}>
				<AppBar sx={{ position: "relative" }}>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={handleClose}
							aria-label="close">
							<CloseIcon />
						</IconButton>
						<Typography
							sx={{ ml: 2, flex: 1, fontWeight: "bold" }}
							variant="h6"
							component="div">
							{hotel.name}
						</Typography>
					</Toolbar>
				</AppBar>
				<DialogCarousel items={hotelImages} />
			</Dialog>
		</div>
	);
}
