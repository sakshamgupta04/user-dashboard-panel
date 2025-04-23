
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";

interface ActivityItem {
  id: string;
  candidateName: string;
  position: string;
  department: string;
  status: 'reviewing' | 'approved' | 'rejected';
  date: string;
}

const activities: ActivityItem[] = [
  {
    id: '1',
    candidateName: 'Dr. Jane Smith',
    position: 'Assistant Professor',
    department: 'Computer Science',
    status: 'approved',
    date: '2 hours ago'
  },
  {
    id: '2',
    candidateName: 'Dr. Michael Johnson',
    position: 'Associate Professor',
    department: 'Physics',
    status: 'reviewing',
    date: '5 hours ago'
  },
  {
    id: '3',
    candidateName: 'Dr. Sarah Williams',
    position: 'Professor',
    department: 'Mathematics',
    status: 'rejected',
    date: '1 day ago'
  },
  {
    id: '4',
    candidateName: 'Dr. Robert Brown',
    position: 'Assistant Professor',
    department: 'Chemistry',
    status: 'reviewing',
    date: '2 days ago'
  },
  {
    id: '5',
    candidateName: 'Dr. Emily Davis',
    position: 'Associate Professor',
    department: 'Biology',
    status: 'approved',
    date: '3 days ago'
  }
];

const getStatusColor = (status: string) => {
  switch(status) {
    case 'approved':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'rejected':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    default:
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  }
};

const RecentActivity: React.FC = () => {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
        <button className="text-purple-light text-sm hover:underline">
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-800">
              <TableHead className="text-gray-400">Candidate</TableHead>
              <TableHead className="text-gray-400">Position</TableHead>
              <TableHead className="text-gray-400">Department</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400 text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id} className="hover:bg-gray-800/50 border-gray-800">
                <TableCell className="font-medium text-white">
                  {activity.candidateName}
                </TableCell>
                <TableCell className="text-gray-300">{activity.position}</TableCell>
                <TableCell className="text-gray-300">{activity.department}</TableCell>
                <TableCell>
                  <span className={`px-2.5 py-1 rounded-full text-xs border ${getStatusColor(activity.status)}`}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-gray-400 text-right">{activity.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentActivity;
