
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Logo from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signup(firstName, lastName, email, phoneNumber, password);
      // Navigate happens in signup function
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F111A] p-4">
      <div className="w-full max-w-lg my-10">
        <div className="bg-[#0F111A] rounded-3xl p-8 border border-purple/30 shadow-lg">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          
          <h1 className="text-2xl font-bold text-center text-purple-light mb-8">Sign Up</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-transparent border-gray-700 rounded-full"
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-transparent border-gray-700 rounded-full"
                  required
                />
              </div>
            </div>
            
            <div>
              <Input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-gray-700 rounded-full"
                required
              />
            </div>
            
            <div>
              <Input
                type="tel"
                placeholder="Enter Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-transparent border-gray-700 rounded-full"
                required
              />
            </div>
            
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-gray-700 rounded-full pr-10"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white py-6 rounded-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
            
            <div className="text-center mt-4">
              <div className="flex items-center justify-center space-x-1 text-sm">
                <span className="text-gray-400">Already have an account?</span>
                <Link to="/login" className="text-purple-light hover:underline">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
