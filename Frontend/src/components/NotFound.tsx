import React from "react";

const NotFound = () => {
	return (
		<div className="flex flex-col items-center justify-center h-full text-center">
			<h1 className="text-6xl font-bold text-gray-800">404</h1>
			<p className="text-xl text-gray-600 mt-4">Page Not Found</p>
			<p className="text-gray-500 mt-2">
				The page you're looking for doesn't exist or has been moved.
			</p>
			<a
				href="/"
				className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
			>
				Go to Home
			</a>
		</div>
	);
};

export default NotFound;
