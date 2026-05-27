import { Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./pages/Welcome/Welcome";
import Login from "./pages/Login/Login";
import Inicio from "./pages/Inicio/Inicio";
import Donation from "./pages/Donation/Donation";
import Usuarios from "./pages/Usuarios/Usuarios";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import Entregas from "./pages/Entregas/Entregas";
import Inventario from "./pages/Inventario/Inventario";

const getCurrentUser = () => {
  const usuario = localStorage.getItem("usuario");
  if (!usuario) return null;
  try {
    return JSON.parse(usuario);
  } catch {
    return null;
  }
};

const isAuthenticated = () => !!localStorage.getItem("token");

const RequireAuth = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const RequireAdmin = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const usuario = getCurrentUser();
  if (usuario?.rol !== "administrador") {
    return <Navigate to="/inicio" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Welcome />}
      />

      <Route
        path="/donation"
        element={<Donation />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/inicio"
        element={<RequireAuth><Inicio /></RequireAuth>}
      />

      <Route
        path="/usuarios"
        element={<RequireAdmin><Usuarios /></RequireAdmin>}
      />

      <Route
        path="/profile"
        element={<RequireAuth><ProfilePage /></RequireAuth>}
      />

      <Route
        path="/usuarios"
        element={<Usuarios />}
      />

      <Route
        path="/profile"
        element={<ProfilePage />}
      />

      <Route
        path="/entregas"
        element={<RequireAuth><Entregas /></RequireAuth>}
      />
      
      <Route
        path="/inventario"
        element={<RequireAuth><Inventario /></RequireAuth>}
      />
    </Routes>
  );
}

export default App;