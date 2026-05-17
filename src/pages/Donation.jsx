import "../styles/donation.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Gift,
  Shield,
  ChevronDown,
  Send
} from "lucide-react";

import { crearDonacion } from "../services/donationService";

function Donation() {

  const navigate = useNavigate();

  const [producto, setProducto] = useState("");
  const [tipo, setTipo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("kg");

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const [errores, setErrores] = useState({});

  const handleSubmit = async () => {

    const nuevosErrores = {};

    if (!producto.trim()) {
      nuevosErrores.producto = "El producto es obligatorio";
    }

    if (!tipo) {
      nuevosErrores.tipo = "Selecciona un tipo";
    }

    if (!cantidad || Number(cantidad) <= 0) {
      nuevosErrores.cantidad = "Ingresa una cantidad válida";
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    try {

      const donacionData = {
        producto,
        tipo,
        cantidad: Number(cantidad),
        unidad,
        donante: nombre
          ? {
              nombre_completo: nombre,
              correo: correo,
              telefono: telefono,
              direccion: direccion
            }
          : null
      };

      await crearDonacion(donacionData);

      alert("Donación registrada correctamente");

      setProducto("");
      setTipo("");
      setCantidad("");
      setUnidad("kg");

      setNombre("");
      setCorreo("");
      setTelefono("");
      setDireccion("");

      setErrores({});

    } catch (error) {

      console.error(error);

      alert("Error al registrar la donación");
    }
  };

  return (
    <div className="donation-page">

      {/* HEADER */}
      <header className="donation-header">

        <div className="donation-header-logo">
          The Steward
        </div>

        <nav className="donation-nav">

          <button className="donation-nav-link" onClick={() => navigate("/")}>
            Inicio
          </button>

          <button className="donation-nav-link active">
            Donar
          </button>

          <button className="donation-nav-link" onClick={() => navigate("/login")}>
            Acceso para Personal
          </button>

        </nav>

      </header>

      {/* CONTENT */}
      <div className="donation-content">

        {/* LEFT */}
        <div className="donation-info">

          <h1 className="donation-page-title">
            Donar al Banco de Alimentos
          </h1>

          <p className="donation-page-description">
            Tu ayuda es fundamental.
            Puedes registrar tu donación aquí
            de forma rápida, incluso anónima.
          </p>

          {/* BENEFITS */}
          <div className="donation-benefits">

            <div className="benefit-item">

              <div className="benefit-icon green">
                <Gift size={20} />
              </div>

              <div className="benefit-text">

                <span className="benefit-title">
                  Impacto Directo
                </span>

                <span className="benefit-description">
                  Tus donaciones llegan directamente
                  a familias necesitadas.
                </span>

              </div>

            </div>

            <div className="benefit-item">

              <div className="benefit-icon blue">
                <Shield size={20} />
              </div>

              <div className="benefit-text">

                <span className="benefit-title">
                  Privacidad Garantizada
                </span>

                <span className="benefit-description">
                  Puedes donar de forma completamente anónima.
                </span>

              </div>

            </div>

          </div>

          {/* IMAGE */}
          <div className="donation-image">

            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop"
              alt="Vegetales"
            />

            <span className="image-caption">
              “Gracias por tu generosidad.”
            </span>

          </div>

        </div>

        {/* RIGHT */}
        <div className="donation-form-section">

          {/* PRODUCTO */}
          <div className="donation-form-grid">

            <div className="form-group">

              <label className="form-label">
                Producto
              </label>

              <input
                type="text"
                className={`form-input donation-input ${
                  errores.producto ? "input-error" : ""
                }`}
                placeholder="Ej: Arroz, Leche, Lentejas"
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
              />

              {errores.producto && (
                <p className="error-text">
                  {errores.producto}
                </p>
              )}

            </div>

            <div className="form-group">

              <label className="form-label">
                Tipo
              </label>

              <div className="select-wrapper">

                <select
                  className={`form-select donation-select ${
                    errores.tipo ? "input-error" : ""
                  }`}
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >

                  <option value="">
                    Seleccionar tipo
                  </option>

                  <option value="Perecedero">
                    Perecedero
                  </option>

                  <option value="No Perecedero">
                    No Perecedero
                  </option>

                </select>

                <ChevronDown
                  size={18}
                  className="select-icon"
                />

              </div>

              {errores.tipo && (
                <p className="error-text">
                  {errores.tipo}
                </p>
              )}

            </div>

          </div>

          {/* CANTIDAD */}
          <div className="donation-form-grid">

            <div className="form-group">

              <label className="form-label">
                Cantidad
              </label>

              <input
                type="number"
                className={`form-input donation-input ${
                  errores.cantidad ? "input-error" : ""
                }`}
                placeholder="0"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />

              {errores.cantidad && (
                <p className="error-text">
                  {errores.cantidad}
                </p>
              )}

            </div>

            <div className="form-group">

              <label className="form-label">
                Unidad
              </label>

              <div className="select-wrapper">

                <select
                  className="form-select donation-select"
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                >

                  <option value="kg">
                    kg (Kilogramos)
                  </option>

                  <option value="unidades">
                    Unidades
                  </option>

                  <option value="litros">
                    Litros
                  </option>

                </select>

                <ChevronDown
                  size={18}
                  className="select-icon"
                />

              </div>

            </div>

          </div>

          {/* NOMBRE */}
          <div className="form-group">

            <label className="form-label">
              Nombre del Donante (Opcional)
            </label>

            <input
              type="text"
              className="form-input donation-input"
              placeholder="Deja en blanco para donación anónima"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

          </div>

          {/* CORREO */}
          <div className="form-group">

            <label className="form-label">
              Correo de contacto (Opcional)
            </label>

            <input
              type="email"
              className="form-input donation-input"
              placeholder="Ejemplo@gmail.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            <p className="form-hint">
              Solo te contactaremos si hay dudas sobre la entrega.
            </p>

          </div>

          {/* TELEFONO */}
          <div className="form-group">

            <label className="form-label">
              Teléfono (Opcional)
            </label>

            <input
                type="text"
                className="form-input donation-input"
                placeholder="Ej: 555-1234-555"
                value={telefono}
                onChange={(e) => {

                    const soloNumeros = e.target.value.replace(/\D/g, "");

                    setTelefono(soloNumeros);
                }}
                />

          </div>

          {/* DIRECCION */}
          <div className="form-group">

            <label className="form-label">
              Dirección (Opcional)
            </label>

            <input
              type="text"
              className="form-input donation-input"
              placeholder="Ej: Calle Falsa 123, Ciudad"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />

          </div>

          {/* BOTON */}
          <button
            className="submit-donation-btn"
            onClick={handleSubmit}
          >

            <Send size={18} />

            Enviar Donación

          </button>

        </div>

      </div>

    </div>
  );
}

export default Donation;