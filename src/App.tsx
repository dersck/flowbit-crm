import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/AuthContext';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import LoginPage from '@/features/auth/LoginPage';
import RegisterPage from '@/features/auth/RegisterPage';
import OnboardingPage from '@/features/onboarding/OnboardingPage';
import DashboardPage from '@/features/dashboard/DashboardPage';
import ClientsPage from '@/features/clients/ClientsPage';
import ProjectsPage from '@/features/projects/ProjectsPage';
import TasksPage from '@/features/tasks/TasksPage';
import MainLayout from '@/components/layout/MainLayout';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route index element={<Navigate to="login" replace />} />
        </Route>

        {/* Protected Routes (No Workspace Required) */}
        <Route element={<ProtectedRoute requireWorkspace={false} />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        {/* Protected Routes (Workspace Required) */}
        <Route element={<ProtectedRoute requireWorkspace={true} />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/:id" element={<div>Client Detail</div>} />

            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<div>Project Detail</div>} />

            <Route path="/tasks" element={<TasksPage />} />

            <Route path="/settings" element={<div>Settings</div>} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>


        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
