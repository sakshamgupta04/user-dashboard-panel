
import React, { useState } from 'react';
import { Users, FileText, BarChart2, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import CandidateStats from '../components/dashboard/CandidateStats';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#0F111A]">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0F111A]">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Welcome back, {user?.firstName || 'User'}!
                </h1>
                <p className="text-gray-400 mt-1">
                  Here's what's happening with your recruiting activities today.
                </p>
              </div>
              
              <Button className="mt-4 md:mt-0 bg-purple hover:bg-purple-dark text-white">
                Add New Candidate
              </Button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total Candidates"
                value="248"
                change="12%"
                isPositive={true}
                icon={<Users size={20} className="text-purple-light" />}
              />
              <StatsCard
                title="Open Positions"
                value="15"
                change="5%"
                isPositive={true}
                icon={<Briefcase size={20} className="text-purple-light" />}
              />
              <StatsCard
                title="Applications Today"
                value="24"
                change="8%"
                isPositive={false}
                icon={<FileText size={20} className="text-purple-light" />}
              />
              <StatsCard
                title="Acceptance Rate"
                value="67%"
                change="3%"
                isPositive={true}
                icon={<BarChart2 size={20} className="text-purple-light" />}
              />
            </div>
            
            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentActivity />
              </div>
              <div className="lg:col-span-1">
                <CandidateStats />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
