import { useEffect, useMemo, useState } from "react";

import {
  ClipboardPlus,
  Package,
  Search,
  Truck,
  Calendar,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../../api/api";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import MobileSidebar from "../../components/MobileSidebar/MobileSidebar";
import ProfileButton from "../../components/ProfileButton/ProfileButton";
import CustomSelect from "../../components/CustomSelect/CustomSelect";

import "./entregas.css";

function Entregas() {

  const navigate = useNavigate();

  // ============================================
  // UI
  // ============================================

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  // ============================================
  // DATA
  // ============================================

  const [entregas, setEntregas] =
    useState([]);

  const [beneficiarios, setBeneficiarios] =
    useState([]);

  const [productos, setProductos] =
    useState([]);

  // ============================================
  // FORM
  // ============================================

  const [formData, setFormData] =
    useState({
      beneficiario_id: "",
      producto_id: "",
      fecha: "",
    });

  // ============================================
  // FETCH DATA
  // ============================================

  const fetchData = async () => {

    try {

      setLoading(true);

      setError("");

      // ============================================
      // REQUESTS
      // ============================================

      const entregasRes =
        await api.get("/api/entregas");

      const beneficiariosRes =
        await api.get("/api/beneficiarios");

      const productosRes =
        await api.get("/api/productos");

      // ============================================
      // SAFE DATA
      // ============================================

      const entregasData =
        Array.isArray(entregasRes.data)
          ? entregasRes.data
          : [];

      const beneficiariosData =
        Array.isArray(beneficiariosRes.data)
          ? beneficiariosRes.data
          : [];

      const productosData =
        Array.isArray(productosRes.data)
          ? productosRes.data
          : [];

      // ============================================
      // PRODUCTOS DISPONIBLES
      // ============================================

      const productosDisponibles =
        productosData.filter(
          (producto) =>
            producto &&
            producto.id &&
            producto.nombre
        );

      setEntregas(entregasData);

      setBeneficiarios(
        beneficiariosData
      );

      setProductos(
        productosDisponibles
      );

    } catch (err) {

      console.log(
        "ERROR FETCH:",
        err
      );

      setError(
        "Error cargando información"
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchData();

  }, []);

  // ============================================
  // OPTIONS
  // ============================================

  const beneficiarioOptions =
    beneficiarios.map(
      (beneficiario) => ({
        value: beneficiario.id,
        label:
          beneficiario.nombre,
      })
    );

  const productoOptions =
    productos.map((producto) => ({
      value: producto.id,
      label: `${producto.nombre} (${producto.cantidad || 0})`,
    }));

  // ============================================
  // HANDLE CHANGE
  // ============================================

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

  // ============================================
  // CREATE ENTREGA
  // ============================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSaving(true);

    setError("");

    try {

      await api.post(
        "/api/entregas",
        {
          beneficiario_id:
            Number(
              formData.beneficiario_id
            ),

          fecha:
            formData.fecha,

          productos: [
            {
              producto_id:
                Number(
                  formData.producto_id
                ),
            },
          ],
        }
      );

      // RESET

      setFormData({
        beneficiario_id: "",
        producto_id: "",
        fecha: "",
      });

      await fetchData();

    } catch (err) {

      console.log(err);

      setError(
        err.response?.data
          ?.error ||
          "Error creando entrega"
      );

    } finally {

      setSaving(false);

    }

  };

  // ============================================
  // FILTER
  // ============================================

  const entregasFiltradas =
    useMemo(() => {

      return entregas.filter(
        (entrega) => {

          const beneficiario =
            entrega?.Beneficiario?.nombre
              ?.toLowerCase() || "";

          const productos =
            entrega?.Productos?.map(
              (p) =>
                p.nombre
            )
              .join(" ")
              .toLowerCase() || "";

          return (
            beneficiario.includes(
              search.toLowerCase()
            ) ||
            productos.includes(
              search.toLowerCase()
            )
          );

        }
      );

    }, [search, entregas]);

  return (

    <div className="entregas-layout">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MOBILE */}

      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* MAIN */}

      <div className="entregas-main">

        {/* NAVBAR */}

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

        {/* CONTENT */}

        <div className="entregas-content">

          {/* HEADER */}

          <div className="entregas-header">

            <div>

              <h1>
                Gestión de Entregas
              </h1>

              <p>
                Control y registro de
                salidas de productos.
              </p>

            </div>

            <button className="registrar-btn">

              <ClipboardPlus size={18} />

              Registrar Entrega

            </button>

          </div>

          {/* GRID */}

          <div className="entregas-grid">

            {/* ============================================ */}
            {/* TABLE */}
            {/* ============================================ */}

            <div className="entregas-table-card">

              <div className="entregas-table-header">

                <div>

                  <h2>
                    Historial de Entregas
                  </h2>

                  <span>
                    {
                      entregasFiltradas.length
                    }{" "}
                    registros
                  </span>

                </div>

                <div className="table-search">

                  <Search size={15} />

                  <input
                    type="text"
                    placeholder="Buscar entrega..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

              {/* HEAD */}

              <div className="entregas-table-head">

                <span>
                  Beneficiario
                </span>

                <span>
                  Dirección
                </span>

                <span>
                  Producto
                </span>

                <span>
                  Cantidad
                </span>

                <span>
                  Fecha
                </span>

              </div>

              {/* BODY */}

              <div className="entregas-table-body">

                {loading ? (

                  <div className="empty-state">
                    Cargando...
                  </div>

                ) : entregasFiltradas.length === 0 ? (

                  <div className="empty-state">
                    No hay entregas registradas
                  </div>

                ) : (

                  entregasFiltradas.map(
                    (entrega) => (

                      <div
                        className="entrega-row"
                        key={entrega.id}
                      >

                        {/* BENEFICIARIO */}

                        <div className="beneficiario-cell">

                          <div className="beneficiario-avatar">

                            <Truck size={14} />

                          </div>

                          <span>

                            {entrega
                              ?.Beneficiario
                              ?.nombre ||
                              "Sin nombre"}

                          </span>

                        </div>

                        {/* DIRECCION */}

                        <span className="direccion-cell">

                          {entrega
                            ?.Beneficiario
                            ?.direccion ||
                            "No registrada"}

                        </span>

                        {/* PRODUCTOS */}

                        <span className="producto-cell">

                          {entrega?.Productos
                            ?.map(
                              (
                                producto
                              ) =>
                                producto.nombre
                            )
                            .join(", ") ||
                            "Sin producto"}

                        </span>

                        {/* CANTIDAD */}

                        <span className="cantidad-cell">

                          {entrega
                            ?.Productos
                            ?.length || 0}

                        </span>

                        {/* FECHA */}

                        <span className="fecha-cell">

                          {entrega.fecha
                            ? new Date(
                                entrega.fecha
                              ).toLocaleDateString()
                            : "Sin fecha"}

                        </span>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

            {/* ============================================ */}
            {/* FORM */}
            {/* ============================================ */}

            <div className="entrega-form-card">

              <div className="form-title">

                <Package size={18} />

                <h2>
                  Nueva Entrega
                </h2>

              </div>

              <form
                onSubmit={handleSubmit}
                className="entrega-form"
              >

                {/* BENEFICIARIO */}

                <div className="form-group">

                  <label>
                    Beneficiario
                  </label>

                  <CustomSelect
                    name="beneficiario_id"
                    value={
                      formData.beneficiario_id
                    }
                    onChange={
                      handleChange
                    }
                    options={
                      beneficiarioOptions
                    }
                    placeholder="Seleccionar beneficiario"
                  />

                </div>

                {/* PRODUCTO */}

                <div className="form-group">

                  <label>
                    Producto
                  </label>

                  <CustomSelect
                    name="producto_id"
                    value={
                      formData.producto_id
                    }
                    onChange={
                      handleChange
                    }
                    options={
                      productoOptions
                    }
                    placeholder={
                      productos.length === 0
                        ? "No hay productos"
                        : "Seleccionar producto"
                    }
                  />

                </div>

                {/* FECHA */}

                <div className="form-group">

                  <label>
                    Fecha
                  </label>

                  <div className="date-input-wrapper">

                    <Calendar size={16} />

                    <input
                      type="date"
                      name="fecha"
                      value={
                        formData.fecha
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>

                </div>

                {/* ERROR */}

                {error && (

                  <div className="form-error">
                    {error}
                  </div>

                )}

                {/* BUTTON */}

                <button
                  type="submit"
                  className="confirm-btn"
                  disabled={saving}
                >

                  {saving
                    ? "Guardando..."
                    : "Confirmar Entrega"}

                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Entregas;