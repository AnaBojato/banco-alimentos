import { Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import Donation from "./pages/Donation";

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

    </Routes>
  );
}

export default App;