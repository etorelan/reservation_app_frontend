import React from "react";
import { auth, provider } from "../config/cloudConfig";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { style } from "./SignupPage";

const LoginPage = () => {
	const [errorCode, setErrorCode] = React.useState();
	let navigate = useNavigate();

	const handleGoogleLogin = (e) => {
		e.preventDefault();
		signInWithPopup(auth, provider)
			.then((res) => {
				if (res) {
					if (window.location.search) {
						let urlParams = new URLSearchParams(
							window.location.search
						);
						urlParams.forEach((val, key) => {
							if (key == "to") {
								navigate(val);
								return;
							}
						});
					} else {
						navigate("/products");
					}
				}
			})
			.catch((error) => {
				setErrorCode(error.code);
				console.error(error);
			});
	};

	const handleLogin = (e) => {
		e.preventDefault();
		let email = e.target.email.value;
		let password = e.target.password.value;

		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user;
				navigate("/");
			})
			.catch((error) => {
				setErrorCode(error.code);
				console.error(error);
			});
	};

	return (
		<div style={{textAlign:"center", padding:"50px"}}>
			<h1> Login </h1>
			<form onSubmit={handleLogin}>
				<input type="email" name="email" placeholder="Email" style={style.input}/>
				<input type="password" name="password" placeholder="Password" style={style.input}/>
				<Button type="submit" variant="contained" style={{width:"300px"}}>
					Login
				</Button>
			</form>

			<Button variant="contained" onClick={() => navigate("/signup/")} style={{width:"300px"}} color="success">
				Signup
			</Button>
			<div>
				<Button
					variant="outlined"
					size="large"
					startIcon={<GoogleIcon />}
					onClick={handleGoogleLogin}
					sx={{width:"300px"}}>
					Login
				</Button>
			</div>
			<h6>
				{errorCode
					? errorCode
							.slice(errorCode.indexOf("/") + 1)
							.replaceAll("-", " ")
							.toUpperCase()
					: ""}
			</h6>

		</div>
	);
};
export default LoginPage;
