
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Logo from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      // Navigate happens in the login function
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Would be replaced with actual Google auth
    alert('Google Sign In would be implemented with Supabase');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F111A] p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#0F111A] rounded-3xl p-8 border border-purple/30 shadow-lg">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-gray-400">E-mail</label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-gray-700 rounded-full pl-10"
                  placeholder="Enter your email"
                  required
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-gray-400">Password</label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border-gray-700 rounded-full pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-gray-400 hover:text-purple-light">
                  Forgot Password?
                </Link>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-purple hover:bg-purple-dark text-white py-6 rounded-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0F111A] text-gray-400">OR</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent border border-gray-700 text-white hover:bg-gray-800 rounded-full py-6 flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18.1711 8.36788H17.4998V8.33329H9.99984V11.6666H14.7094C13.9614 13.6071 12.1211 15 9.99984 15C7.23859 15 4.99984 12.7612 4.99984 10C4.99984 7.23871 7.23859 5 9.99984 5C11.2744 5 12.4344 5.48 13.3177 6.26625L15.6744 3.90958C14.1897 2.52458 12.1961 1.66663 9.99984 1.66663C5.39775 1.66663 1.6665 5.39787 1.6665 10C1.6665 14.6021 5.39775 18.3333 9.99984 18.3333C14.6019 18.3333 18.3332 14.6021 18.3332 10C18.3332 9.44121 18.2757 8.89583 18.1711 8.36788Z" fill="#FFC107"/>
                <path d="M2.62744 6.12121L5.36536 8.12913C6.10619 6.29496 7.90036 5 9.99994 5C11.2745 5 12.4345 5.48 13.3178 6.26625L15.6745 3.90958C14.1899 2.52458 12.1962 1.66663 9.99994 1.66663C6.74494 1.66663 3.91869 3.47371 2.62744 6.12121Z" fill="#FF3D00"/>
                <path d="M10 18.3333C12.1413 18.3333 14.0892 17.5096 15.5567 16.1792L13.0067 13.9875C12.1489 14.6452 11.0885 15.0009 10 15C7.89917 15 6.06917 13.6229 5.31333 11.6979L2.64083 13.815C3.91833 16.4105 6.71333 18.3333 10 18.3333Z" fill="#4CAF50"/>
                <path d="M18.1711 8.36788H17.4998V8.33329H9.99984V11.6666H14.7094C14.3519 12.5902 13.7444 13.3879 12.9711 13.9887L12.9736 13.9871L15.5236 16.1788C15.3461 16.3421 18.3332 14.1666 18.3332 10C18.3332 9.44121 18.2757 8.89583 18.1711 8.36788Z" fill="#1976D2"/>
              </svg>
              <span>Sign in with Google</span>
            </Button>
            
            <div className="text-center mt-6">
              <div className="flex items-center justify-center space-x-1 text-sm">
                <span className="text-gray-400">Don't have an account?</span>
                <Link to="/signup" className="text-purple-light hover:underline">
                  OR SIGN UP
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
