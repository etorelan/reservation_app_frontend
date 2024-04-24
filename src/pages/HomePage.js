import React, { useEffect } from "react";

import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";


import app, { auth, db } from "../config/cloudConfig";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { API_ROUTE } from "../utils/PrivateRoute";
import { useParams } from "react-router-dom";

const HomePage = () => {

	let payload = {}
	const searchParams = new URLSearchParams(window.location.search);
	searchParams.forEach((value, key) => {
		payload[key] = value
	});
	const navigate = useNavigate()
	const handleClick = () =>{
		navigate("/products")
	}


	useEffect(() =>{
		const changeStatusToCONF = async() =>{
			fetch(API_ROUTE + "reserve/" , {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(payload)
			}).catch((error) =>{
				console.error(error);
			})			
		}
		changeStatusToCONF()
	})


	return (
		<div style={{ textAlign: "center", padding: "50px" }}>
		  <Typography variant="h1" gutterBottom>Welcome to Dream On</Typography>
		  <Typography variant="h4" gutterBottom>Find your dream destination with us!</Typography>
		  <Button variant="contained" color="primary" style={{ margin: "20px" }} onClick={handleClick}>Explore Hotels</Button>
		  <Typography variant="body1">Already have a reservation? <a href="/login">Login here</a></Typography>
		  <Typography variant="body1" sx={{ color: 'red', fontWeight:"bold", marginTop:"20px"}}>
		  	To see what a complete entry looks like, check "Top Resort Turkey" or "Bot Resort Greece", as other entries do not have 
			fully furbished information, since there are 42k+ establishments in this demo
		   </Typography>
		</div>
	  );
		  
};
export default HomePage;
