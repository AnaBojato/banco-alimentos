import "../styles/welcome.css";

import { Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Logo from "../components/Logo";
import StaffAccess from "../components/StaffAccess";

function Welcome() {

  const navigate = useNavigate();

  return (
    <div className="main-page">
      <div className="main-container">

        <Logo />

        {/* Card principal */}
        <div className="main-card">

          <h2 className="main-title">
            Ayuda a alimentar a nuestra comunidad
          </h2>

          <p className="main-description">
            Donar comida es rapido y 100% anonimo.
            Tu generosidad marca la diferencia hoy mismo.
          </p>

          <button className="donate-btn" onClick={() => navigate("/donation")}>
            <Gift size={18} />
            Hacer una Donación Ahora
          </button>

          <p className="main-note">
            SIN REGISTROS - SIN COMPLICACIONES
          </p>

        </div>

        <StaffAccess />

      </div>
    </div>
  );
}

export default Welcome;