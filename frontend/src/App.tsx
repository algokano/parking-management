import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/guards/ProtectedRoute';
import AdminRoute from './components/guards/AdminRoute';
import AppLayout from './components/layout/AppLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy-loaded pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('./pages/citizen/DashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const ZoneBrowserPage = lazy(() => import('./pages/citizen/ZoneBrowserPage'));
const ZoneDetailPage = lazy(() => import('./pages/citizen/ZoneDetailPage'));
const MyVehiclesPage = lazy(() => import('./pages/citizen/MyVehiclesPage'));
const MyReservationsPage = lazy(() => import('./pages/citizen/MyReservationsPage'));
const MySessionsPage = lazy(() => import('./pages/citizen/MySessionsPage'));
const MyInvoicesPage = lazy(() => import('./pages/citizen/MyInvoicesPage'));
const ZoneManagementPage = lazy(() => import('./pages/admin/ZoneManagementPage'));
const ZoneEditPage = lazy(() => import('./pages/admin/ZoneEditPage'));
const SpaceManagementPage = lazy(() => import('./pages/admin/SpaceManagementPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

function DashboardRouter() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboardPage /> : <DashboardPage />;
}

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/zones" element={<ZoneBrowserPage />} />
            <Route path="/zones/:zoneId" element={<ZoneDetailPage />} />
            <Route path="/my/vehicles" element={<MyVehiclesPage />} />
            <Route path="/my/reservations" element={<MyReservationsPage />} />
            <Route path="/my/sessions" element={<MySessionsPage />} />
            <Route path="/my/invoices" element={<MyInvoicesPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin/zones" element={<ZoneManagementPage />} />
              <Route path="/admin/zones/new" element={<ZoneEditPage />} />
              <Route path="/admin/zones/:zoneId/edit" element={<ZoneEditPage />} />
              <Route path="/admin/zones/:zoneId/spaces" element={<SpaceManagementPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
