import "../Welcome/welcome.css";

import { Gift, Shield } from "lucide-react";

import Logo from "../../components/Logo/Logo";
import StaffAccess from "../../components/StaffAccess/StaffAccess";
import { useNavigate } from "react-router-dom";
function Welcome() {

  const navigate = useNavigate();

  return (

    <div className="main-page">

      {/* HERO */}
      <section className="hero-wrapper">

        {/* OVERLAY */}
        <div className="hero-overlay"></div>

        {/* NAVBAR */}
        <header className="welcome-navbar">

          <div className="welcome-logo">

            <div className="main-logo-icon">
              <Gift size={22} />
            </div>

            <div>
              <h2>The Steward</h2>
              <p>Banco de Alimentos</p>
            </div>

          </div>

          <nav className="welcome-nav">

            <button className="nav-btn">
              Nuestra labor
            </button>

            <button className="nav-btn">
              Impacto
            </button>

            <button
              className="nav-btn"
              onClick={() => navigate("/login")}
            >
              Acceso Personal
            </button>

            <button
              className="nav-donate-btn"
              onClick={() => navigate("/donation")}
            >
              Donar
            </button>

          </nav>

        </header>

        {/* CONTENIDO */}
        <div className="hero-content-wrapper">

          {/* IZQUIERDA */}
          <div className="hero-left">

            <span className="hero-badge">
              Alimentando esperanza cada día
            </span>

            <h1 className="hero-title">
              Dona alimentos y ayuda
              a transformar vidas.
            </h1>

            <p className="hero-description">
              Cada donación representa una oportunidad
              para apoyar familias vulnerables y combatir
              el desperdicio alimentario en nuestra comunidad.
            </p>

            <div className="hero-buttons">

              <button
                className="hero-donate-btn"
                onClick={() => navigate("/donation")}
              >

                <Gift size={18} />

                Realizar Donación

              </button>

              <button className="hero-secondary-btn">
                Conocer más
              </button>

            </div>

          </div>

          {/* DERECHA */}
          <div className="hero-right">

            <div className="main-container">

              
              {/* CARD */}
              <div className="main-card">

                <h2 className="main-title">
                  Ayuda a alimentar a nuestra comunidad
                </h2>

                <p className="main-description">
                  Donar comida es rápido y 100% anónimo.
                  Tu generosidad marca la diferencia hoy mismo.
                </p>

                <button
                  className="donate-btn"
                  onClick={() => navigate("/donation")}
                >

                  <Gift size={18} />

                  Hacer una Donación Ahora

                </button>

                <p className="main-note">
                  SIN REGISTROS - SIN COMPLICACIONES
                </p>

              </div>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Welcome;