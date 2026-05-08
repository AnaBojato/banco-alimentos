import "../styles/welcome.css";
import { Gift, Shield } from "lucide-react";

function Welcome() {
  return (
    <div className="main-page">
      <div className="main-container">

        {/* Logo */}
        <div className="main-logo">
          <div className="main-logo-icon">
            <Gift size={30} />
          </div>

          <h1 className="main-brand">The Steward</h1>

          <p className="main-subtitle">
            Sistema Inventario Banco Alimentos
          </p>
        </div>

        {/* Card principal */}
        <div className="main-card">
          <h2 className="main-title">
            Ayuda a alimentar a nuestra comunidad
          </h2>

          <p className="main-description">
            Donar comida es rapido y 100% anonimo.
            Tu generosidad marca la diferencia hoy mismo.
          </p>

          <button className="donate-btn">
            <Gift size={18} />
            Hacer una Donacion Ahora
          </button>

          <p className="main-note">
            SIN REGISTROS - SIN COMPLICACIONES
          </p>
        </div>

        {/* Acceso personal */}
        <div className="staff-card">
          <div className="staff-info">
            <div>
              <h3 className="staff-title">
                Acceso para Personal
              </h3>

              <p className="staff-subtitle">
                Solo administradores
              </p>
            </div>

            <Shield size={22} className="staff-icon" />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Welcome;