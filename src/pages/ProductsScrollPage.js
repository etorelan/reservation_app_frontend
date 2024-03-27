import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Grid, createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";

import Loading from "../components/Loading";
import Product from "../components/Product";
import ProductsFilter from "../components/ProductsFilter/ProductsFilter";
import QueryContext from "../components/ProductsFilter/QueryContext";
import { API_ROUTE } from "../utils/PrivateRoute";

const ProductsScrollPage = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const {
		queryParams,
		setQueryParams,
		setDestinationTags,
		page,
		setPage,
		pageCount,
		setPageCount,
	} = useContext(QueryContext);
	let navigate = useNavigate();

	const theme = createTheme({
		breakpoints: {
			values: {
				xs: 400,
				sm: 600,
				md: 800,
				lg: 1200,
				xl: 1900,
			},
		},
	});

	const setQueryParamsFromURL = () => {
		let urlParams = new URLSearchParams(window.location.search);
		urlParams.forEach((value, key) => {
			queryParams[key] = JSON.parse(value);
		});
		setQueryParams(queryParams);

		if (queryParams["country"]) {
			let countryString = queryParams["country"].toString();
			if (queryParams["city"]) {
				let cityString = queryParams["city"].toString();
				setDestinationTags([cityString + ", " + countryString]);
			} else {
				setDestinationTags([countryString]);
			}
		}
	};

	const refreshProducts = () => {
		const getFilteredProducts = async () => {
			let res = await fetch(
				API_ROUTE + "products/" + window.location.search,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			let data = await res.json();
			if (res.status === 200) {
				setProducts(data["hotels_info"]);
				setPageCount(data["count_of_pages_to_show"]);
			}
		};
		getFilteredProducts();
		setLoading(false);
	};

	const hadlePageChange = (event, value) => {
		let newQueryParams = queryParams;
		newQueryParams["page"] = value;
		setQueryParams(newQueryParams);
		setPage(value);
		let urlParams = new URLSearchParams(window.location.search);
		urlParams.delete("page");
		urlParams.append("page", value);
		const fullPath =
			window.location.pathname + "?" + urlParams + window.location.hash;

		navigate(fullPath);
		refreshProducts();
	};

	useEffect(() => {
		refreshProducts();
		setQueryParamsFromURL();
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<div>
			<ThemeProvider theme={theme}>
				<div className="d-none d-xxl-block d-xl-block">
					<ProductsFilter
						refreshProducts={refreshProducts}
						flex={true}
					/>
				</div>
				<div
					className="d-block d-xxl-none d-xl-none"
					style={{
						textAlign: "center",
						paddingTop: "15px",
					}}>
					<button
						className="btn btn-primary"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#collapseExample"
						aria-expanded="false"
						aria-controls="collapseExample">
						Search parameters
					</button>
					<div className="collapse" id="collapseExample">
						<div className="card card-body">
							<ProductsFilter
								refreshProducts={refreshProducts}
								flex={false}
							/>
						</div>
					</div>
				</div>
				<Grid
					container
					spacing={2}
					sx={{
						marginTop: "10px",
						display: "flex",
						justifyContent: "center",
					}}>
					{products.map((product, i) => {
						return (
							<Product
								key={product.id}
								id={product.id}
								name={product.name}
								city={product.city_name}
								description={
									product.hotel_description.description
								}
								image={"images/hotel-ga705b1519_1280.webp"}
								theme={theme}
							/>
						);
					})}
				</Grid>
				<div style={{marginTop:"20px",  display: "flex", justifyContent: "center" }}>
					<Pagination
						color="primary"
						count={pageCount}
						page={page}
						size="large"
						onChange={hadlePageChange}
					/>
				</div>
			</ThemeProvider>
		</div>
	);
};
export default ProductsScrollPage;
