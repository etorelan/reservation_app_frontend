import React from "react";
import { auth } from "../config/cloudConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const style={
	input:
		{ display: "block", margin: "10px auto", width: "300px" }
	
}

const SignupPage = () => {
	const navigate = useNavigate();
	const [errorCode, setErrorCode] = React.useState();

	const handleSignUp = (e) => {
		e.preventDefault();
		let email = e.target.email.value;
		let password = e.target.password.value;

		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user;
				navigate("/");
			})
			.catch((error) => {
				setErrorCode(error.code);
				console.error(error.code);
			});
	};

	return (
		<div style={{textAlign:"center", padding:"50px"}}>
			<h1> Sign Up </h1>
			<form onSubmit={handleSignUp}>
				<input type="text" name="username" placeholder="Username" style={style.input} />
				<input type="email" name="email" placeholder="Email" style={style.input}/>
				<input type="password" name="password" placeholder="Password" style={style.input}/>
				<Button type="submit" variant="contained" sx={{width:"300px"}}>
					Sign up
				</Button>
			</form>
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

export default SignupPage;
