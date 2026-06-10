import "../Welcome/welcome.css";

import {
  Gift,
  HeartHandshake,
  Users,
  ShieldCheck
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Welcome() {

  const navigate = useNavigate();

  return (

    <div className="main-page">

      {/* HERO */}
      <section className="hero-wrapper">

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

        {/* HERO CONTENT */}
        <div className="hero-content-wrapper">

          {/* LEFT */}
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

                Hacer una Donación

              </button>

              <button className="hero-secondary-btn">
                Conocer más
              </button>

            </div>

          </div>

          {/* RIGHT */}
          <div className="hero-right">

            <div className="main-container">

              <div className="main-card">

                <h2 className="main-title">
                  Ayuda a alimentar a nuestra comunidad
                </h2>

                <p className="main-description">
                  Donar comida es rápido y 100% anónimo.
                  Tu generosidad puede cambiar vidas hoy mismo.
                </p>

                <button
                  className="donate-btn"
                  onClick={() => navigate("/donation")}
                >

                  <Gift size={18} />

                  Hacer una Donación

                </button>

                <p className="main-note">
                  DONACIONES ÚNICAMENTE DE ALIMENTOS
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* QUIENES AYUDAMOS */}
      <section className="help-section">

        <div className="section-container">

          <span className="section-tag">
            Nuestra misión
          </span>

          <h2 className="section-title">
            ¿A quiénes ayudamos?
          </h2>

          <p className="section-description">
            Trabajamos para apoyar familias en situación de vulnerabilidad,
            adultos mayores, niños con desnutrición y personas afectadas
            por la inseguridad alimentaria.
          </p>

          <div className="help-grid">

            <div className="help-card">

              <div className="help-icon">
                <Users size={28} />
              </div>

              <h3>Familias vulnerables</h3>

              <p>
                Entregamos alimentos esenciales a hogares que
                atraviesan dificultades económicas.
              </p>

            </div>

            <div className="help-card">

              <div className="help-icon">
                <HeartHandshake size={28} />
              </div>

              <h3>Niños y jóvenes</h3>

              <p>
                Ayudamos a combatir la desnutrición infantil
                mediante jornadas alimentarias.
              </p>

            </div>

            <div className="help-card">

              <div className="help-icon">
                <ShieldCheck size={28} />
              </div>

              <h3>Adultos mayores</h3>

              <p>
                Brindamos apoyo alimentario a personas mayores
                que viven solas o en abandono.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* IMPACTO */}
      <section className="impact-section">

        <div className="impact-overlay"></div>

        <div className="section-container impact-container">

          <span className="section-tag impact-tag">
            Nuestro impacto
          </span>

          <h2 className="section-title light">
            Juntos estamos cambiando vidas
          </h2>

          <div className="impact-grid">

            <div className="impact-card">
              <h3>+12,000</h3>
              <p>Alimentos entregados</p>
            </div>

            <div className="impact-card">
              <h3>850+</h3>
              <p>Familias beneficiadas</p>
            </div>

            <div className="impact-card">
              <h3>120</h3>
              <p>Voluntarios activos</p>
            </div>

            <div className="impact-card">
              <h3>45</h3>
              <p>Jornadas solidarias</p>
            </div>

          </div>

        </div>

      </section>

      {/* DONACIONES */}
      <section className="donation-info-section">

        <div className="section-container">

          <div className="donation-warning-card">

            <h2>
              Las donaciones son únicamente de alimentos
            </h2>

            <p>
              No recibimos dinero ni transferencias económicas.
            </p>

            <p>
              Nuestro objetivo es reducir el desperdicio alimentario
              y llevar comida a quienes más la necesitan mediante
              donaciones responsables y transparentes.
            </p>

            <button
              className="hero-donate-btn donation-section-btn"
              onClick={() => navigate("/donation")}
            >

              <Gift size={18} />

              Hacer una Donación

            </button>

          </div>

        </div>

      </section>

      {/* TESTIMONIOS */}
      <section className="testimonials-section">

        <div className="section-container">

          <span className="section-tag">
            Historias reales
          </span>

          <h2 className="section-title">
            Personas que hemos ayudado
          </h2>

          <div className="testimonials-grid">

            <div className="testimonial-card">

              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop"
                alt="Beneficiaria"
                className="testimonial-image"
              />

              <p>
                “Gracias a esta ayuda pude alimentar a mis hijos
                durante una situación muy difícil.”
              </p>

              <h4>María Gómez</h4>
              <span>Madre beneficiaria</span>

            </div>

            <div className="testimonial-card">

              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop"
                alt="Beneficiario"
                className="testimonial-image"
              />

              <p>
                “La organización nos apoyó cuando más lo necesitábamos.
                Estamos profundamente agradecidos.”
              </p>

              <h4>Carlos Ramírez</h4>
              <span>Beneficiario</span>

            </div>

            <div className="testimonial-card">

              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"
                alt="Beneficiaria"
                className="testimonial-image"
              />

              <p>
                “Recibir estos alimentos nos devolvió tranquilidad
                y esperanza para seguir adelante.”
              </p>

              <h4>Andrea López</h4>
              <span>Beneficiaria</span>

            </div>

          </div>

          <div className="testimonial-donate">

            <button
              className="hero-donate-btn"
              onClick={() => navigate("/donation")}
            >

              <Gift size={18} />

              Hacer una Donación

            </button>

          </div>

        </div>

      </section>

      {/* VOLUNTARIOS */}
      <section className="volunteer-section">

        <div className="section-container volunteer-content">

          {/* LEFT */}
          <div className="volunteer-left">

            <span className="section-tag">
              Sé parte del cambio
            </span>

            <h2 className="section-title">
              ¿Quieres ser voluntario?
            </h2>

            <p className="section-description">
              Si deseas ayudar presencialmente en jornadas de
              recolección, clasificación y entrega de alimentos,
              puedes comunicarte con nuestro equipo.
            </p>

            <div className="volunteer-contact-box">

              <p>📧 voluntarios@thesteward.org</p>

              <p>📞 +57 300 123 4567</p>

              <p>💬 WhatsApp: +57 300 123 4567</p>

              <p>📍 Bogotá, Colombia</p>

            </div>

          </div>

          {/* RIGHT */}
          <div className="volunteer-image-container">

          <img
            src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg"
            alt="Voluntarios ayudando"
            className="volunteer-image"
          />

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="footer-section">

        <div className="section-container footer-grid">

          <div>

            <h3>The Steward</h3>

            <p>
              Banco de alimentos comprometido
              con combatir el hambre y reducir
              el desperdicio alimentario.
            </p>

            <button
              className="footer-donate-btn"
              onClick={() => navigate("/donation")}
            >

              <Gift size={18} />

              Hacer una Donación

            </button>

          </div>

          <div>

            <h4>Contacto</h4>

            <p>📧 contacto@thesteward.org</p>
            <p>📞 +57 300 123 4567</p>
            <p>💬 WhatsApp: +57 300 123 4567</p>

          </div>

          <div>

            <h4>Redes sociales</h4>

            <p>Instagram: @thesteward</p>
            <p>Facebook: The Steward</p>

          </div>

          <div>

            <h4>Ubicación</h4>

            <p>Bogotá, Colombia</p>
            <p>Calle 123 #45-67</p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Welcome;