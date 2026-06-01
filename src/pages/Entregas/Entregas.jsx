import { useEffect, useMemo, useState } from "react";
import {
  ClipboardPlus,
  Package,
  Search,
  Truck,
  Calendar,
  Minus,
  Plus,
  Phone,
  MapPin,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../api/api";
import { obtenerProductos } from "../../services/productoService";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import MobileSidebar from "../../components/MobileSidebar/MobileSidebar";
import ProfileButton from "../../components/ProfileButton/ProfileButton";
import CustomSelect from "../../components/CustomSelect/CustomSelect";

import "./entregas.css";

function Entregas() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingEntregas, setLoadingEntregas] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [entregas, setEntregas] = useState([]);
  const [productos, setProductos] = useState([]);

  const [formData, setFormData] = useState({
    beneficiario_nombre: "",
    beneficiario_telefono: "",
    beneficiario_direccion: "",
    producto_id: "",
    cantidad: 1,
    fecha: "",
  });

  const productoSeleccionado = useMemo(() => {
    if (!formData.producto_id) return null;
    return productos.find((p) => String(p.id) === String(formData.producto_id));
  }, [formData.producto_id, productos]);

  const cargarProductos = async () => {
    try {
      const data = await obtenerProductos();
      const disponibles = data.filter(
        (p) => p && p.id && p.nombre && Number(p.cantidad) > 0
      );
      setProductos(disponibles);
    } catch (err) {
      console.warn("Error cargando productos:", err);
      setProductos([]);
    }
  };

  const cargarEntregas = async () => {
    setLoadingEntregas(true);
    try {
      const res = await api.get("/api/entregas");
      const data = Array.isArray(res.data) ? res.data : [];
      setEntregas(data);
    } catch (err) {
      console.warn("Error cargando entregas:", err);
      setEntregas([]);
    } finally {
      setLoadingEntregas(false);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarEntregas();
  }, []);

  const productoOptions = productos.map((producto) => ({
    value: producto.id,
    label: `${producto.nombre} (${producto.cantidad || 0} disponibles)`,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "producto_id") {
      setFormData((prev) => ({ ...prev, producto_id: value, cantidad: 1 }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCantidadChange = (delta) => {
    const stock = Number(productoSeleccionado?.cantidad || 0);
    const nuevaCantidad = Math.min(
      Math.max(1, Number(formData.cantidad) + delta),
      stock
    );

    setFormData((prev) => ({ ...prev, cantidad: nuevaCantidad }));
  };

  const handleCantidadInput = (e) => {
    const stock = Number(productoSeleccionado?.cantidad || 0);
    const val = parseInt(e.target.value, 10);

    if (isNaN(val)) {
      setFormData((prev) => ({ ...prev, cantidad: 1 }));
      return;
    }

    const cantidadClamped = Math.min(Math.max(1, val), stock);
    setFormData((prev) => ({ ...prev, cantidad: cantidadClamped }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!formData.beneficiario_nombre.trim()) {
      setError("El nombre del beneficiario es requerido");
      setSaving(false);
      return;
    }

    if (!formData.beneficiario_telefono.trim()) {
      setError("El teléfono del beneficiario es requerido");
      setSaving(false);
      return;
    }

    if (!formData.beneficiario_direccion.trim()) {
      setError("La dirección del beneficiario es requerida");
      setSaving(false);
      return;
    }

    if (!formData.producto_id) {
      setError("Debes seleccionar un producto");
      setSaving(false);
      return;
    }

    if (!formData.fecha) {
      setError("La fecha es requerida");
      setSaving(false);
      return;
    }

    const stock = Number(productoSeleccionado?.cantidad || 0);
    if (Number(formData.cantidad) > stock) {
      setError(`Solo hay ${stock} unidades disponibles`);
      setSaving(false);
      return;
    }

    try {
      const resBeneficiario = await api.post("/api/beneficiarios", {
        nombre_completo: formData.beneficiario_nombre.trim(),
        telefono: formData.beneficiario_telefono.trim(),
        direccion: formData.beneficiario_direccion.trim(),
        correo: "",
      });

      const nuevoBeneficiarioId = resBeneficiario.data?.id;

      if (!nuevoBeneficiarioId) {
        throw new Error("El backend no devolvió el ID del nuevo beneficiario.");
      }

      await api.post("/api/entregas", {
        beneficiario_id: Number(nuevoBeneficiarioId),
        fecha: formData.fecha,
        productos: [
          {
            producto_id: Number(formData.producto_id),
            cantidad: Number(formData.cantidad),
          },
        ],
      });

      const nuevaCantidad = stock - Number(formData.cantidad);

      await api.put(`/api/productos/${formData.producto_id}`, {
        cantidad: nuevaCantidad,
      });

      setFormData({
        beneficiario_nombre: "",
        beneficiario_telefono: "",
        beneficiario_direccion: "",
        producto_id: "",
        cantidad: 1,
        fecha: "",
      });

      setModalOpen(false);
      cargarProductos();
      cargarEntregas();
    } catch (err) {
      console.error("Error en el flujo de guardado:", err);
      setError(err.response?.data?.error || err.message || "Error creando entrega");
    } finally {
      setSaving(false);
    }
  };

  const entregasFiltradas = useMemo(() => {
    return entregas.filter((entrega) => {
      const beneficiario = (
        entrega?.Beneficiario?.nombre_completo ??
        entrega?.Beneficiario?.nombre ??
        entrega?.beneficiario?.nombre_completo ??
        entrega?.beneficiario?.nombre ??
        entrega?.beneficiario_nombre ??
        ""
      ).toLowerCase();

      const direccion = (
        entrega?.Beneficiario?.direccion ??
        entrega?.beneficiario?.direccion ??
        entrega?.direccion ??
        ""
      ).toLowerCase();

      const telefono = (
        entrega?.Beneficiario?.telefono ??
        entrega?.beneficiario?.telefono ??
        entrega?.telefono ??
        ""
      ).toLowerCase();

      const prods =
        entrega?.Productos?.map((p) => p.nombre).join(" ").toLowerCase() || "";

      const textoBusqueda = search.toLowerCase();

      return (
        beneficiario.includes(textoBusqueda) ||
        direccion.includes(textoBusqueda) ||
        telefono.includes(textoBusqueda) ||
        prods.includes(textoBusqueda)
      );
    });
  }, [search, entregas]);

  return (
    <div className="entregas-layout">
      <Sidebar />

      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="entregas-main">
        <Navbar openSidebar={() => setSidebarOpen(true)}>
          <ProfileButton
            onProfileClick={() => navigate("/profile")}
            onLogout={() => navigate("/login")}
          />
        </Navbar>

        <div className="entregas-content">
          <div className="entregas-header">
            <div>
              <h1>Gestión de Entregas</h1>
              <p>Control y registro de salidas de productos.</p>
            </div>
            <button className="registrar-btn" onClick={() => setModalOpen(true)}>
              <ClipboardPlus size={18} />
              Registrar Entrega
            </button>
          </div>

          <div className="entregas-grid">
            <div className="entregas-table-card">
              <div className="entregas-table-header">
                <div>
                  <h2>Historial de Entregas</h2>
                  <span>{entregasFiltradas.length} registros</span>
                </div>
                <div className="table-search">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Buscar entrega..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="entregas-table-head">
                <span>Beneficiario</span>
                <span>Dirección</span>
                <span>Teléfono</span>
                <span>Producto</span>
                <span>Cantidad</span>
                <span>Fecha</span>
              </div>

              <div className="entregas-table-body">
                {loadingEntregas ? (
                  <div className="empty-state">Cargando...</div>
                ) : entregasFiltradas.length === 0 ? (
                  <div className="empty-state">No hay entregas registradas</div>
                ) : (
                  entregasFiltradas.map((entrega) => (
                    <div className="entrega-row" key={entrega.id}>
                      <div className="beneficiario-cell">
                        <div className="beneficiario-avatar">
                          <Truck size={14} />
                        </div>
                        <span>
                          {entrega?.Beneficiario?.nombre_completo ??
                            entrega?.Beneficiario?.nombre ??
                            entrega?.beneficiario?.nombre_completo ??
                            entrega?.beneficiario?.nombre ??
                            entrega?.beneficiario_nombre ??
                            "Sin nombre"}
                        </span>
                      </div>

                      <span className="direccion-cell" data-label="Dirección">
                        {entrega?.Beneficiario?.direccion ??
                          entrega?.beneficiario?.direccion ??
                          entrega?.direccion ??
                          "—"}
                      </span>

                      <span className="telefono-cell" data-label="Teléfono">
                        {entrega?.Beneficiario?.telefono ??
                          entrega?.beneficiario?.telefono ??
                          entrega?.telefono ??
                          "—"}
                      </span>

                      <span className="producto-cell" data-label="Producto">
                        {entrega?.Productos?.map((p) => p.nombre).join(", ") ||
                          "Sin producto"}
                      </span>

                      <span className="cantidad-cell" data-label="Cantidad">
                        {entrega?.Productos?.[0]?.EntregaProducto?.cantidad ||
                          entrega?.Productos?.length ||
                          0}
                      </span>

                      <span className="fecha-cell" data-label="Fecha">
                        {entrega.fecha
                          ? new Date(entrega.fecha).toLocaleDateString()
                          : "Sin fecha"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>
              <X size={18} />
            </button>

            <div className="modal-content">
              <div className="form-title">
                <Package size={18} />
                <h2>Nueva Entrega</h2>
              </div>

              <form onSubmit={handleSubmit} className="entrega-form">
                <div className="form-group">
                  <label>Beneficiario</label>
                  <input
                    type="text"
                    name="beneficiario_nombre"
                    className="text-input"
                    placeholder="Nombre del beneficiario"
                    value={formData.beneficiario_nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <div className="date-input-wrapper">
                    <Phone size={16} />
                    <input
                      type="text"
                      name="beneficiario_telefono"
                      className="text-input"
                      placeholder="Teléfono del beneficiario"
                      value={formData.beneficiario_telefono}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Dirección</label>
                  <div className="date-input-wrapper">
                    <MapPin size={16} />
                    <input
                      type="text"
                      name="beneficiario_direccion"
                      className="text-input"
                      placeholder="Dirección del beneficiario"
                      value={formData.beneficiario_direccion}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Producto</label>
                  <CustomSelect
                    name="producto_id"
                    value={formData.producto_id}
                    onChange={handleChange}
                    options={productoOptions}
                    placeholder={
                      productos.length === 0
                        ? "No hay productos disponibles"
                        : "Seleccionar producto"
                    }
                  />
                  {productoSeleccionado && (
                    <span className="stock-hint">
                      Stock disponible:{" "}
                      <strong>{productoSeleccionado.cantidad}</strong> unidades
                    </span>
                  )}
                </div>

                {formData.producto_id && (
                  <div className="form-group">
                    <label>Cantidad a entregar</label>
                    <div className="cantidad-control">
                      <button
                        type="button"
                        className="cantidad-btn"
                        onClick={() => handleCantidadChange(-1)}
                        disabled={Number(formData.cantidad) <= 1}
                      >
                        <Minus size={14} />
                      </button>

                      <input
                        type="number"
                        className="cantidad-input"
                        min={1}
                        max={productoSeleccionado?.cantidad || 1}
                        value={formData.cantidad}
                        onChange={handleCantidadInput}
                      />

                      <button
                        type="button"
                        className="cantidad-btn"
                        onClick={() => handleCantidadChange(1)}
                        disabled={
                          Number(formData.cantidad) >=
                          Number(productoSeleccionado?.cantidad || 1)
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Fecha</label>
                  <div className="date-input-wrapper">
                    <Calendar size={16} />
                    <input
                      type="date"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {error && <div className="form-error">{error}</div>}

                <button
                  type="submit"
                  className="confirm-btn"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Confirmar Entrega"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Entregas;