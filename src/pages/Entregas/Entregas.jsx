import { useEffect, useState } from "react";

import {
  ClipboardPlus,
  Filter,
  Package,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../../api/api";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import MobileSidebar from "../../components/MobileSidebar/MobileSidebar";
import ProfileButton from "../../components/ProfileButton/ProfileButton";
import CustomSelect from "../../components/CustomSelect/CustomSelect";

import "../Entregas/entregas.css";

function Entregas() {

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [entregas, setEntregas] =
    useState([]);

  const [beneficiarios, setBeneficiarios] =
    useState([]);

  const [productos, setProductos] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] =
    useState({
      beneficiario_id: "",
      producto_id: "",
      fecha: "",
    });

  // ========================================
  // FETCH
  // ========================================

  const fetchData = async () => {

    try {

      const [
        entregasRes,
        beneficiariosRes,
        productosRes,
      ] = await Promise.all([
        api.get("/api/entregas"),
        api.get("/api/beneficiarios"),
        api.get("/api/productos"),
      ]);

      setEntregas(entregasRes.data);

      setBeneficiarios(
        beneficiariosRes.data
      );

      setProductos(productosRes.data);

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    fetchData();

  }, []);

  // ========================================
  // FORM
  // ========================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

  };

  // ========================================
  // SUBMIT
  // ========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      await api.post(
        "/api/entregas",
        {
          beneficiario_id:
            formData.beneficiario_id,

          fecha:
            formData.fecha,

          productos: [
            {
              producto_id:
                formData.producto_id,
            },
          ],
        }
      );

      setFormData({
        beneficiario_id: "",
        producto_id: "",
        fecha: "",
      });

      fetchData();

    } catch (err) {

      setError(
        err.response?.data?.error ||
        "Error creando entrega"
      );

    } finally {

      setLoading(false);

    }

  };

  // ========================================
  // OPTIONS
  // ========================================

  const beneficiarioOptions =
    beneficiarios.map((b) => ({
      value: b.id,
      label: b.nombre,
    }));

  const productoOptions =
    productos.map((p) => ({
      value: p.id,
      label: p.nombre,
    }));

  return (

    <div className="entregas-layout">

      <Sidebar />

      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="entregas-main">

        <Navbar
          openSidebar={() =>
            setSidebarOpen(true)
          }
        >

          <ProfileButton
            onProfileClick={() =>
              navigate("/profile")
            }
            onLogout={() =>
              navigate("/login")
            }
          />

        </Navbar>

        <div className="entregas-content">

          {/* HEADER */}

          <div className="entregas-header">

            <div>

              <h1>
                Entregas / Salidas
              </h1>

              <p>
                Gestión y registro de
                distribución de suministros.
              </p>

            </div>

          </div>

          {/* GRID */}

          <div className="entregas-grid">

            {/* FORM */}

            <div className="entrega-form-card">

              <div className="entrega-form-title">

                <ClipboardPlus size={20} />

                <h2>
                  Nueva Salida
                </h2>

              </div>

              <form
                className="entrega-form"
                onSubmit={handleSubmit}
              >

                <div className="form-group">

                  <label>
                    Beneficiario
                  </label>

                  <CustomSelect
                    name="beneficiario_id"
                    value={
                      formData.beneficiario_id
                    }
                    onChange={handleChange}
                    options={
                      beneficiarioOptions
                    }
                    placeholder="Seleccionar beneficiario..."
                  />

                </div>

                <div className="form-group">

                  <label>
                    Producto
                  </label>

                  <CustomSelect
                    name="producto_id"
                    value={
                      formData.producto_id
                    }
                    onChange={handleChange}
                    options={
                      productoOptions
                    }
                    placeholder="Seleccionar producto..."
                  />

                </div>

                <div className="form-group">

                  <label>
                    Fecha
                  </label>

                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                  />

                </div>

                {error && (
                  <p className="form-error">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="confirm-btn"
                  disabled={loading}
                >

                  {loading
                    ? "Guardando..."
                    : "Confirmar Entrega"}

                </button>

              </form>

            </div>

            {/* TABLE */}

            <div className="entregas-table-card">

              <div className="entregas-table-header">

                <h2>
                  Historial de Salidas
                </h2>

                <button className="filter-btn">

                  <Filter size={16} />

                  Filtrar

                </button>

              </div>

              <div className="entregas-table">

                <div className="entregas-head">

                  <span>
                    Beneficiario
                  </span>

                  <span>
                    Producto
                  </span>

                  <span>
                    Fecha
                  </span>

                </div>

                {entregas.map((entrega) => (

                  <div
                    className="entrega-row"
                    key={entrega.id}
                  >

                    <div className="beneficiario-info">

                      <div className="beneficiario-icon">

                        <Package size={16} />

                      </div>

                      <span>
                        {
                          entrega.Beneficiario
                            ?.nombre
                        }
                      </span>

                    </div>

                    <span>

                      {entrega.Productos
                        ?.map((p) => p.nombre)
                        .join(", ")}

                    </span>

                    <span>

                      {new Date(
                        entrega.fecha
                      ).toLocaleDateString()}

                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Entregas;