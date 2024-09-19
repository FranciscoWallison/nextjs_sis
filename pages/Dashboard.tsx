import React from 'react';
import withAuth from '../hoc/withAuth';
import MainLayout from '../components/layout/MainLayout';
import DashboardContent from '../components/dashboard/DashboardContent';

const Dashboard: React.FC = () => (
  <MainLayout title={"Dashboard"}>
    <DashboardContent />
  </MainLayout>
);

export default withAuth(Dashboard);
