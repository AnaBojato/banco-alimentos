import { Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import Donation from "./pages/Donation";
import Usuarios from "./pages/Usuarios";

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
        element={<Inicio />}
      />

      <Route
        path="/usuarios"
        element={<Usuarios />}
      />

    </Routes>
  );
}

export default App;