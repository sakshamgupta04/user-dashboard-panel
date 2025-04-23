
import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../Logo';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronRight,
  BarChart2
} from 'lucide-react';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navLinks = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
      path: '/dashboard'
    },
    {
      label: 'Candidates',
      icon: <Users size={18} />,
      path: '/dashboard/candidates'
    },
    {
      label: 'Reports',
      icon: <BarChart2 size={18} />,
      path: '/dashboard/reports'
    },
    {
      label: 'Documents',
      icon: <FileText size={18} />,
      path: '/dashboard/documents'
    },
    {
      label: 'Settings',
      icon: <Settings size={18} />,
      path: '/dashboard/settings'
    }
  ];

  return (
    <aside className="w-64 border-r border-gray-800 h-screen bg-[#0d0f16] flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <Logo />
      </div>
      
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-purple-dark flex items-center justify-center">
            <span className="font-semibold text-white">
              {user?.firstName ? user.firstName[0] : 'U'}
            </span>
          </div>
          <div>
            <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => 
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-purple text-white' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
                <ChevronRight size={16} className="ml-auto opacity-50" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={logout}
          className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors w-full px-4 py-3"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
