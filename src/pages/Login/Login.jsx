import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Logo from "../../components/Logo/Logo";
import BackButton from "../../components/BackButton/BackButton";
import "../Login/Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: "",        
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Ajustado sin el "/api" inicial porque ya viene en tu VITE_API_URL
      const response = await api.post("/auth/login", {
        correo: formData.correo,
        password: formData.password,
      });

      const data = response.data;

      // Guardamos los datos de sesión de forma segura
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // Redirigimos al inicio de la app
      navigate("/inicio");

    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Logo />
        <div className="login-form-card">
          <BackButton />
          <h1 className="login-title">Iniciar Sesión</h1>
          <p className="login-subtitle">
            Ingrese sus credenciales para gestionar el inventario.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label className="login-label">EMAIL</label>
              <div className="login-input-wrapper">
                <Mail size={18} className="login-input-icon" />
                <input
                  type="email"
                  name="correo"
                  placeholder="ejemplo@foodbank.org"
                  className="login-input"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="login-form-group">
              <label className="login-label">PASSWORD</label>
              <div className="login-input-wrapper">
                <Lock size={18} className="login-input-icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="login-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label className="remember-checkbox">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              Recordarme en este equipo
            </label>

            {error && <p className="login-error">{error}</p>}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? "Ingresando..." : (
                <>Iniciar Sesión <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>

        <div className="login-divider"><span></span></div>
        <div className="security-badge">SEGURIDAD CERTIFICADA</div>
      </div>
    </div>
  );
}

export default Login;