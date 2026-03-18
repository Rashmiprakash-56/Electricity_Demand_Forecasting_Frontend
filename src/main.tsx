import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import LoginPage from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import Dashboard from './pages/Dashboard';
import ShapAnalysis from './pages/ShapAnalysis';

import RequireAuth from './components/RequireAuth';
import AuthBootstrap from './components/AuthBootstrap';
import ModelTrainingPage from './pages/ModelTraining';
import DatasetOverviewPage from './pages/DatasetOverview';
import AccountPage from './pages/AccountPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <App />
      </RequireAuth>
    ),
    children: [
      { path : 'predict', element: <Dashboard /> },
      { path: 'shap', element: <ShapAnalysis /> },
      { path : 'train' , element: <ModelTrainingPage />},
      { index: true, element: <DatasetOverviewPage />}
    ],
  },
  {path : '/account' , element : <AccountPage/>},
  { path: '/login', element: <LoginPage /> },
  { path: '*', element: <PageNotFound /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssBaseline />
    <AuthBootstrap>
      <RouterProvider router={router} />
    </AuthBootstrap>
  </StrictMode>
);
