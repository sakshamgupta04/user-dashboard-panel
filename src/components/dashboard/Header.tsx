
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Search, Menu } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user } = useAuth();
  
  return (
    <header className="border-b border-gray-800 p-4 flex items-center justify-between bg-[#0F111A]">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm"
          className="md:hidden text-gray-400"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>
        <h1 className="text-xl font-semibold text-white hidden md:block">Dashboard</h1>
      </div>
      
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-gray-900 border-gray-700 rounded-full w-full"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="relative">
          <Bell size={18} className="text-gray-400" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            2
          </span>
        </Button>
        
        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-white">{user?.firstName || 'User'} {user?.lastName || ''}</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-purple-dark flex items-center justify-center">
            <span className="font-semibold text-white text-sm">
              {user?.firstName ? user.firstName[0] : 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
