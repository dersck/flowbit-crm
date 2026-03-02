import { Suspense, lazy, type ReactElement } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/AuthContext';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Toaster } from 'sonner';

const LoginPage = lazy(() => import('@/features/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/RegisterPage'));
const OnboardingPage = lazy(() => import('@/features/onboarding/OnboardingPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const ClientsPage = lazy(() => import('@/features/clients/ClientsPage'));
const ClientDetailPage = lazy(() => import('@/features/clients/ClientDetailPage'));
const ProjectsPage = lazy(() => import('@/features/projects/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('@/features/projects/ProjectDetailPage'));
const TasksPage = lazy(() => import('@/features/tasks/TasksPage'));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'));
const testingRoutesEnabled = import.meta.env.VITE_ENABLE_TEST_ROUTES === '1';
const ClientsPlaygroundPage = testingRoutesEnabled
  ? lazy(() => import('@/features/testing/ClientsPlaygroundPage'))
  : null;
const SettingsPlaygroundPage = testingRoutesEnabled
  ? lazy(() => import('@/features/testing/SettingsPlaygroundPage'))
  : null;
const DashboardPlaygroundPage = testingRoutesEnabled
  ? lazy(() => import('@/features/testing/DashboardPlaygroundPage'))
  : null;

function RouteFallback({ contained = false }: { contained?: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={contained
        ? 'flex min-h-[40vh] items-center justify-center rounded-[2rem] border border-slate-100 bg-white px-6 py-12 shadow-xl shadow-slate-200/30'
        : 'flex min-h-screen items-center justify-center bg-slate-50 px-6'}
    >
      <div className="space-y-3 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">Cargando vista</p>
      </div>
    </div>
  );
}

function withRouteLoader(element: ReactElement, contained = false) {
  return (
    <Suspense fallback={<RouteFallback contained={contained} />}>
      {element}
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth">
          <Route path="login" element={withRouteLoader(<LoginPage />)} />
          <Route path="register" element={withRouteLoader(<RegisterPage />)} />
          <Route index element={<Navigate to="login" replace />} />
        </Route>

        {/* Protected Routes (No Workspace Required) */}
        <Route element={<ProtectedRoute requireWorkspace={false} />}>
          <Route path="/onboarding" element={withRouteLoader(<OnboardingPage />)} />
        </Route>

        {/* Protected Routes (Workspace Required) */}
        <Route element={<ProtectedRoute requireWorkspace={true} />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={withRouteLoader(<DashboardPage />, true)} />
            <Route path="/clients" element={withRouteLoader(<ClientsPage />, true)} />
            <Route path="/clients/:id" element={withRouteLoader(<ClientDetailPage />, true)} />

            <Route path="/projects" element={withRouteLoader(<ProjectsPage />, true)} />
            <Route path="/projects/:id" element={withRouteLoader(<ProjectDetailPage />, true)} />

            <Route path="/tasks" element={withRouteLoader(<TasksPage />, true)} />

            <Route path="/settings" element={withRouteLoader(<SettingsPage />, true)} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Catch-all */}
        {testingRoutesEnabled && ClientsPlaygroundPage ? (
          <Route path="/__testing__/clients" element={withRouteLoader(<ClientsPlaygroundPage />)} />
        ) : null}
        {testingRoutesEnabled && SettingsPlaygroundPage ? (
          <Route path="/__testing__/settings" element={withRouteLoader(<SettingsPlaygroundPage />)} />
        ) : null}
        {testingRoutesEnabled && DashboardPlaygroundPage ? (
          <Route path="/__testing__/dashboard" element={withRouteLoader(<DashboardPlaygroundPage />)} />
        ) : null}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
