import { Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
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

    </Routes>
  );
}

export default App;