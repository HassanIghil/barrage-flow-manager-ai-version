import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ReleasesPage from "./pages/ReleasesPage";
import AlertsPage from "./pages/AlertsPage";
import UsersPage from "./pages/Users";
import UnauthorizedPage from "./pages/UnauthorizedPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Releases : Directeur, Gestionnaire, Technicien */}
        <Route
          path="/releases"
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "Directeur", "Gestionnaire", "Technicien"]}
            >
              <ReleasesPage />
            </ProtectedRoute>
          }
        />

        {/* Alerts : Directeur, Technicien */}
        <Route
          path="/alerts"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Directeur", "Technicien"]}>
              <AlertsPage />
            </ProtectedRoute>
          }
        />

        {/* Users : Directeur uniquement */}
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["Directeur"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>
    </Routes>
  );
}