import { useEffect, useMemo, useState } from "react";

import {
  ClipboardPlus,
  Package,
  Search,
  Truck,
  Calendar,
  Minus,
  Plus,
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

  // ============================================
  // UI
  // ============================================
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingEntregas, setLoadingEntregas] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ============================================
  // DATA
  // ============================================
  const [entregas, setEntregas] = useState([]);
  const [productos, setProductos] = useState([]);

  // ============================================
  // FORM
  // ============================================
  const [formData, setFormData] = useState({
    beneficiario_nombre: "",
    producto_id: "",
    cantidad: 1,
    fecha: "",
  });

  // ============================================
  // PRODUCTO SELECCIONADO (para mostrar stock)
  // ============================================
  const productoSeleccionado = useMemo(() => {
    if (!formData.producto_id) return null;
    return productos.find(
      (p) => String(p.id) === String(formData.producto_id)
    );
  }, [formData.producto_id, productos]);

  // ============================================
  // FETCH PRODUCTOS — igual que Inventario
  // ============================================
  const cargarProductos = async () => {
    try {
      const data = await obtenerProductos();
      const disponibles = data.filter(
        (p) => p && p.id && p.nombre && p.cantidad > 0
      );
      setProductos(disponibles);
    } catch (err) {
      console.warn("Error cargando productos:", err);
      setProductos([]);
    }
  };

  // ============================================
  // FETCH ENTREGAS — independiente
  // ============================================
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

  // ============================================
  // OPTIONS
  // ============================================
  const productoOptions = productos.map((producto) => ({
    value: producto.id,
    label: `${producto.nombre} (${producto.cantidad || 0} disponibles)`,
  }));

  // ============================================
  // HANDLE CHANGE
  // ============================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "producto_id") {
      setFormData({ ...formData, producto_id: value, cantidad: 1 });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // ============================================
  // HANDLE CANTIDAD
  // ============================================
  const handleCantidadChange = (delta) => {
    const stock = productoSeleccionado?.cantidad || 0;
    const nuevaCantidad = Math.min(Math.max(1, formData.cantidad + delta), stock);
    setFormData({ ...formData, cantidad: nuevaCantidad });
  };

  const handleCantidadInput = (e) => {
    const stock = productoSeleccionado?.cantidad || 0;
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setFormData({ ...formData, cantidad: 1 });
      return;
    }
    setFormData({ ...formData, cantidad: Math.min(Math.max(1, val), stock) });
  };

  // ============================================
  // CREATE ENTREGA (Secuencia encadenada para Backend fijo)
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!formData.beneficiario_nombre.trim()) {
      setError("El nombre del beneficiario es requerido");
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

    const stock = productoSeleccionado?.cantidad || 0;
    if (formData.cantidad > stock) {
      setError(`Solo hay ${stock} unidades disponibles`);
      setSaving(false);
      return;
    }

    try {
      // 1. Crear el Beneficiario primero para obtener un ID válido
      const resBeneficiario = await api.post("/api/beneficiarios", {
        nombre: formData.beneficiario_nombre.trim(),
      });

      const nuevoBeneficiarioId = resBeneficiario.data?.id;

      if (!nuevoBeneficiarioId) {
        throw new Error("El backend no devolvió el ID del nuevo beneficiario.");
      }

      // 2. Crear la entrega asociada al ID que acabamos de generar
      await api.post("/api/entregas", {
        beneficiario_id: Number(nuevoBeneficiarioId),
        fecha: formData.fecha,
        productos: [
          {
            producto_id: Number(formData.producto_id),
          },
        ],
      });

      // 3. Descontar del inventario (Modificando el stock general del Producto)
      const nuevaCantidad = stock - Number(formData.cantidad);
      await api.put(`/api/productos/${formData.producto_id}`, {
        cantidad: nuevaCantidad,
      });

      // RESET FORMULARIO
      setFormData({
        beneficiario_nombre: "",
        producto_id: "",
        cantidad: 1,
        fecha: "",
      });

      // Recargar datos actualizados en la UI
      cargarProductos();
      cargarEntregas();

    } catch (err) {
      console.error("Error en el flujo de guardado:", err);
      setError(err.response?.data?.error || err.message || "Error creando entrega");
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // FILTER
  // ============================================
  const entregasFiltradas = useMemo(() => {
    return entregas.filter((entrega) => {
      const beneficiario = (
        entrega?.beneficiario_nombre ||
        entrega?.Beneficiario?.nombre ||
        ""
      ).toLowerCase();

      const prods =
        entrega?.Productos?.map((p) => p.nombre).join(" ").toLowerCase() || "";

      return (
        beneficiario.includes(search.toLowerCase()) ||
        prods.includes(search.toLowerCase())
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
          {/* HEADER */}
          <div className="entregas-header">
            <div>
              <h1>Gestión de Entregas</h1>
              <p>Control y registro de salidas de productos.</p>
            </div>
            <button className="registrar-btn">
              <ClipboardPlus size={18} />
              Registrar Entrega
            </button>
          </div>

          {/* GRID */}
          <div className="entregas-grid">
            {/* TABLE */}
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
                          {entrega?.Beneficiario?.nombre ||
                            entrega?.beneficiario_nombre ||
                            "Sin nombre"}
                        </span>
                      </div>

                      <span className="direccion-cell">
                        {entrega?.Beneficiario?.direccion || "—"}
                      </span>

                      <span className="producto-cell">
                        {entrega?.Productos?.map((p) => p.nombre).join(", ") ||
                          "Sin producto"}
                      </span>

                      <span className="cantidad-cell">
                        {entrega?.Productos?.[0]?.EntregaProducto?.cantidad ||
                          entrega?.Productos?.length ||
                          0}
                      </span>

                      <span className="fecha-cell">
                        {entrega.fecha
                          ? new Date(entrega.fecha).toLocaleDateString()
                          : "Sin fecha"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* FORM */}
            <div className="entrega-form-card">
              <div className="form-title">
                <Package size={18} />
                <h2>Nueva Entrega</h2>
              </div>

              <form onSubmit={handleSubmit} className="entrega-form">
                {/* BENEFICIARIO */}
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

                {/* PRODUCTO */}
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

                {/* CANTIDAD */}
                {formData.producto_id && (
                  <div className="form-group">
                    <label>Cantidad a entregar</label>
                    <div className="cantidad-control">
                      <button
                        type="button"
                        className="cantidad-btn"
                        onClick={() => handleCantidadChange(-1)}
                        disabled={formData.cantidad <= 1}
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
                          formData.cantidad >=
                          (productoSeleccionado?.cantidad || 1)
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* FECHA */}
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
      </div>
    </div>
  );
}

export default Entregas;