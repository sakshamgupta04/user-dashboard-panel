
import React from 'react';
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '../components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F111A] px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-purple">404</h1>
        <p className="text-xl text-gray-300 mb-6 mt-4">Oops! Page not found</p>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button className="bg-purple hover:bg-purple-dark text-white">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
