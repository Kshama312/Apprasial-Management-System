import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navigation/Navbar';
import { DashboardLayout } from '../components/Dashboard/DashboardLayout';
import { EmployeeDashboard } from '../components/Dashboard/EmployeeDashboard';
import { ManagerDashboard } from '../components/Dashboard/ManagerDashboard';
import { SupervisorDashboard } from '../components/Dashboard/SupervisorDashboard';
import { Role } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  let dashboardContent;
  let title = 'Dashboard';

  switch (user?.role) {
    case Role.EMPLOYEE:
      dashboardContent = <EmployeeDashboard />;
      title = 'Employee Dashboard';
      break;
    case Role.MANAGER:
      dashboardContent = <ManagerDashboard />;
      title = 'Manager Dashboard';
      break;
    case Role.SUPERVISOR:
      dashboardContent = <SupervisorDashboard />;
      title = 'Supervisor Dashboard';
      break;
    case Role.PEER:
    case Role.JUNIOR:
      dashboardContent = <EmployeeDashboard />;
      title = 'Dashboard';
      break;
    default:
      dashboardContent = <div>Role not recognized</div>;
  }

  return (
    <div className="bg-blue-50 min-h-screen"> {/* Same background as Register Form */}
      <Navbar />
      <DashboardLayout title={title}>
        {dashboardContent}
      </DashboardLayout>
    </div>
  );
};
