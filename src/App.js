import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./utils/PrivateRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./utils/AuthContext";
import ResponsiveAppBar from "./components/Header";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ReservationPage from "./pages/ReservationPage";
import ProductsScrollPage from "./pages/ProductsScrollPage";
import { QueryProvider } from "./components/ProductsFilter/QueryContext";
import SingleProductPage from "./pages/SingleProductPage";
import NotFoundPage from "./utils/NotFoundPage";

function App() {
	return (
		<div>
			<AuthProvider>
				<QueryProvider>
					<ResponsiveAppBar />
						<Routes>
							<Route element={<HomePage />} path="/" exact />
							
							<Route
								exact
								path="/products/"
								element={<ProductsScrollPage />}
							/>

							<Route
								path="/products/:hotelID/"
								element={<SingleProductPage />}
							/>
							<Route
								path="/products/:hotelID/reservation/:reservationID/"
								element={
									<PrivateRoute Component={ReservationPage} />
								}
							/>
						
							<Route path="/not-found" element={<NotFoundPage/>}/>
							<Route path="/login/" element={<LoginPage />} />
							<Route
								exact
								path="/signup/"
								element={<SignupPage />}
							/>
						</Routes>
				</QueryProvider>
			</AuthProvider>
		</div>
	);
}

export default App;
