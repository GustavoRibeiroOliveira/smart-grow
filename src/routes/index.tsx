import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import MainLayout from '../components/layout/MainLayout';
import HomePage from '../pages/Home/HomePage';
import DashboardPage from '../pages/Dashboard/DashboardPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
    ],
  },
]);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
}

export default AppRoutes;