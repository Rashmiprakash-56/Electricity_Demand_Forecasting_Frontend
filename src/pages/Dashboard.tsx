import React from 'react';
import DashboardComponent from '../components/dashboard/Dashboard' 

const Dashboard: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <DashboardComponent />
    </div>
  );
};

export default Dashboard;