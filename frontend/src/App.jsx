import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ReleasesPage from "./pages/ReleasesPage";
import AlertsPage from "./pages/AlertsPage";
import DemandesPage from "./pages/DemandesPage";
import UsersPage from "./pages/Users";
import ProfilePage from "./pages/ProfilePage";
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
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Releases : Directeur, Admin, Gestionnaire, Technicien */}
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

        {/* Alerts : Directeur, Admin, Technicien */}
        <Route
          path="/alerts"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Directeur", "Technicien"]}>
              <AlertsPage />
            </ProtectedRoute>
          }
        />

        {/* Demandes : tous les rôles authentifiés */}
        <Route path="/demandes" element={<DemandesPage />} />

        {/* Profile : tous les rôles authentifiés */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Users : Directeur uniquement */}
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["Directeur", "Admin"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>
    </Routes>
  );
}