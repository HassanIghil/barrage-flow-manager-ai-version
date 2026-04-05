import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ReleasesPage from "./pages/ReleasesPage";
import AlertsPage from "./pages/AlertsPage";
import UsersPage from "./pages/Users";
import UnauthorizedPage from "./pages/UnauthorizedPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/releases"
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "admin", "Directeur", "directeur", "Gestionnaire", "gestionnaire", "Technicien", "technicien"]}
            >
              <ReleasesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "admin", "Directeur", "directeur", "Technicien", "technicien"]}
            >
              <AlertsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["Admin", "admin", "Directeur", "directeur"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
