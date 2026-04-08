import React, { useEffect } from "react";

export const Error = () => {
  return (
    <div className='d-flex flex-column justify-content-center align-items-center h-100 w-100'>
      <h1 className='text-danger'>404 Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
};
