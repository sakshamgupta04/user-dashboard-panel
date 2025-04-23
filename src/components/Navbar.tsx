
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "../components/ui/button";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="w-full py-4 px-6 md:px-12 flex items-center justify-between">
      <Logo />
      
      <div className="hidden md:flex space-x-10">
        <Link to="/" className="text-white hover:text-purple-light transition-colors">
          About
        </Link>
        <Link to="/" className="text-white hover:text-purple-light transition-colors">
          Services
        </Link>
        <Link to="/" className="text-white hover:text-purple-light transition-colors">
          Reviews
        </Link>
        <Link to="/" className="text-white hover:text-purple-light transition-colors">
          Request a Demo
        </Link>
      </div>
      
      <div>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline text-white">Welcome, {user.firstName || user.email}</span>
            <div className="flex space-x-2">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="border border-purple rounded-full text-white bg-transparent hover:bg-purple/10"
              >
                Dashboard
              </Button>
              <Button 
                onClick={logout}
                variant="ghost" 
                className="text-white hover:bg-purple/10"
              >
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={() => navigate('/login')}
            className="bg-transparent border border-purple hover:bg-purple/10 text-purple-light rounded-full px-6"
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
