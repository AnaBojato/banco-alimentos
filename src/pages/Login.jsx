import { useState } from "react";

import {
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

import Logo from "../components/Logo";
import BackButton from "../components/BackButton";

import "../styles/Login.css";

function Login() {

  const [formData, setFormData] = useState({
    correo: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      const response = await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            correo: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Error al iniciar sesión"
        );

      }

      localStorage.setItem(
        "token",
        data.token
      );

      console.log("Login exitoso");

      // navigate("/dashboard");

    } catch (err) {

      setError(err.message);

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

          <h1 className="login-title">
            Iniciar Sesión
          </h1>

          <p className="login-subtitle">
            Ingrese sus credenciales
            para gestionar el inventario.
          </p>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <div className="login-form-group">

              <label className="login-label">
                EMAIL
              </label>

              <div className="login-input-wrapper">

                <Mail
                  size={18}
                  className="login-input-icon"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="ejemplo@foodbank.org"
                  className="login-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <div className="login-form-group">

              <label className="login-label">
                PASSWORD
              </label>

              <div className="login-input-wrapper">

                <Lock
                  size={18}
                  className="login-input-icon"
                />

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

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >

              {loading ? (
                "Ingresando..."
              ) : (
                <>
                  Iniciar Sesión

                  <ArrowRight size={18} />
                </>
              )}

            </button>

          </form>

        </div>

        <div className="login-divider">
          <span></span>
        </div>

        <div className="security-badge">
          SEGURIDAD CERTIFICADA
        </div>

      </div>

    </div>

  );
}

export default Login;