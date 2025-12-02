import React from "react";
import { Link } from "react-router-dom";
 
const NotFound = () => {
  return (
    // Container to center content both vertically and horizontally
    <div className="grid h-screen place-content-center bg-white px-4">
      <div className="text-center">
        {/* Display large '404' to indicate page not found */}
        <h1 className="text-9xl font-black text-gray-200">404</h1>
 
        {/* Main message in bold, large text */}
        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Uh-oh!
        </p>
 
        {/* Additional message explaining the error */}
        <p className="mt-4 mb-12 text-gray-500">
          We can't find that page.
        </p>
 
        {/* Link to redirect users back to the homepage */}
        <Link
          to="/"
          className="w-64 h-12 py-3 px-6  border border-red-500 font-bold bg-red-500 text-white rounded-md hover:bg-gray-200 hover:text-gray-900 transition transform hover:scale-105 shadow-md"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};
 
export default NotFound;