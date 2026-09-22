import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import ProtectedRoute, { RoleGuard } from "./components/ProtectedRoute.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import { HOME_PATHS } from "./constants/index.js";

import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";

import PassengerHomePage from "./pages/passenger/HomePage.jsx";
import PassengerSearchPage from "./pages/passenger/SearchPage.jsx";
import PassengerFavoritesPage from "./pages/passenger/FavoritesPage.jsx";
import PassengerSchedulesPage from "./pages/passenger/SchedulesPage.jsx";
import PassengerNotificationsPage from "./pages/passenger/NotificationsPage.jsx";
import PassengerProfilePage from "./pages/passenger/ProfilePage.jsx";
import PassengerStopsListPage from "./pages/passenger/StopsListPage.jsx";
import PassengerStopDetailsPage from "./pages/passenger/StopDetailsPage.jsx";
import PassengerRouteDetailsPage from "./pages/passenger/RouteDetailsPage.jsx";
import PassengerBusDetailsPage from "./pages/passenger/BusDetailsPage.jsx";

import OperatorDashboardPage from "./pages/operator/DashboardPage.jsx";
import OperatorBusesPage from "./pages/operator/BusesPage.jsx";
import OperatorRoutesPage from "./pages/operator/RoutesPage.jsx";
import OperatorStopsPage from "./pages/operator/StopsPage.jsx";
import OperatorSchedulesPage from "./pages/operator/SchedulesPage.jsx";
import OperatorTripsPage from "./pages/operator/TripsPage.jsx";
import OperatorBusMovementPage from "./pages/operator/BusMovementPage.jsx";

import AdminDashboardPage from "./pages/admin/DashboardPage.jsx";
import AdminUsersPage from "./pages/admin/UsersPage.jsx";
import AdminOperatorsPage from "./pages/admin/OperatorsPage.jsx";
import AdminViewBusesPage from "./pages/admin/BusesViewPage.jsx";
import AdminViewRoutesPage from "./pages/admin/RoutesViewPage.jsx";
import AdminViewStopsPage from "./pages/admin/StopsViewPage.jsx";
import AdminViewSchedulesPage from "./pages/admin/SchedulesViewPage.jsx";
import AdminFeedbackPage from "./pages/admin/FeedbackPage.jsx";
import AdminLogsPage from "./pages/admin/LogsPage.jsx";

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? HOME_PATHS[user.role] : "/login"} replace />;
}

function AppRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* passenger */}
        <Route path="/" element={<PassengerHomePage />} />
        <Route path="/search" element={<PassengerSearchPage />} />
        <Route path="/favorites" element={<PassengerFavoritesPage />} />
        <Route path="/schedules" element={<PassengerSchedulesPage />} />
        <Route path="/notifications" element={<PassengerNotificationsPage />} />
        <Route path="/profile" element={<PassengerProfilePage />} />
        <Route path="/stops" element={<PassengerStopsListPage />} />
        <Route path="/stops/:id" element={<PassengerStopDetailsPage />} />
        <Route path="/routes/:id" element={<PassengerRouteDetailsPage />} />
        <Route path="/buses/:id" element={<PassengerBusDetailsPage />} />

        {/* operator */}
        <Route
          path="/operator"
          element={
            <RoleGuard roles={["OPERATOR"]}>
              <OperatorDashboardPage />
            </RoleGuard>
          }
        />
        <Route path="/operator/buses" element={<RoleGuard roles={["OPERATOR"]}><OperatorBusesPage /></RoleGuard>} />
        <Route path="/operator/routes" element={<RoleGuard roles={["OPERATOR"]}><OperatorRoutesPage /></RoleGuard>} />
        <Route path="/operator/stops" element={<RoleGuard roles={["OPERATOR"]}><OperatorStopsPage /></RoleGuard>} />
        <Route path="/operator/schedules" element={<RoleGuard roles={["OPERATOR"]}><OperatorSchedulesPage /></RoleGuard>} />
        <Route path="/operator/trips" element={<RoleGuard roles={["OPERATOR"]}><OperatorTripsPage /></RoleGuard>} />
        <Route path="/operator/movement" element={<RoleGuard roles={["OPERATOR"]}><OperatorBusMovementPage /></RoleGuard>} />

        {/* admin */}
        <Route
          path="/admin"
          element={
            <RoleGuard roles={["ADMIN"]}>
              <AdminDashboardPage />
            </RoleGuard>
          }
        />
        <Route path="/admin/users" element={<RoleGuard roles={["ADMIN"]}><AdminUsersPage /></RoleGuard>} />
        <Route path="/admin/operators" element={<RoleGuard roles={["ADMIN"]}><AdminOperatorsPage /></RoleGuard>} />
        <Route path="/admin/buses" element={<RoleGuard roles={["ADMIN"]}><AdminViewBusesPage /></RoleGuard>} />
        <Route path="/admin/routes" element={<RoleGuard roles={["ADMIN"]}><AdminViewRoutesPage /></RoleGuard>} />
        <Route path="/admin/stops" element={<RoleGuard roles={["ADMIN"]}><AdminViewStopsPage /></RoleGuard>} />
        <Route path="/admin/schedules" element={<RoleGuard roles={["ADMIN"]}><AdminViewSchedulesPage /></RoleGuard>} />
        <Route path="/admin/feedback" element={<RoleGuard roles={["ADMIN"]}><AdminFeedbackPage /></RoleGuard>} />
        <Route path="/admin/logs" element={<RoleGuard roles={["ADMIN"]}><AdminLogsPage /></RoleGuard>} />
      </Route>

      <Route path="/home" element={<HomeRedirect />} />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ToastProvider>
  );
}