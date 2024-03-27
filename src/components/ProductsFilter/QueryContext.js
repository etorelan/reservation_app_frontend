import React, { createContext, useState } from "react";

const QueryContext = createContext();
export default QueryContext;

export const QueryProvider = ({ children }) => {
	const [queryParams, setQueryParams] = useState({page:1});
	const [destinationTags, setDestinationTags] = useState([]);
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(1);

	const contextData = {
		queryParams: queryParams,
		setQueryParams: setQueryParams,
		destinationTags: destinationTags,
		setDestinationTags: setDestinationTags,
		page: page,
		setPage: setPage,
		pageCount: pageCount,
		setPageCount: setPageCount,
	};

	return (
		<QueryContext.Provider value={contextData}>
			{children}
		</QueryContext.Provider>
	);
};
