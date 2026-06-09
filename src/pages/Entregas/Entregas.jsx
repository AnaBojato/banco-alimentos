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
import MobileSidebar from "../../components/MobileSideBar/MobileSidebar";
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
  const [productosRaw, setProductosRaw] = useState([]); // Array crudo de la base de datos

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    beneficiario_nombre: "",
    beneficiario_telefono: "",
    beneficiario_direccion: "",
    producto_id: "", // Guardará el "nombre" del producto unificado
    cantidad: 1,
    fecha: "",
  });

  // ============================================
  // AGRUPACIÓN DE PRODUCTOS REPETIDOS (COMO INVENTARIO)
  // ============================================
  const productosAgrupados = useMemo(() => {
    const disponibles = productosRaw.filter(
      (p) => p && p.id && p.nombre && Number(p.cantidad) > 0
    );

    const agrupados = disponibles.reduce((acc, item) => {
      const key = item.nombre.trim().toLowerCase();
      if (acc[key]) {
        acc[key].cantidad += Number(item.cantidad);
        acc[key].idsOriginales.push({ id: item.id, cantidad: Number(item.cantidad) });
      } else {
        acc[key] = {
          nombre: item.nombre,
          cantidad: Number(item.cantidad),
          idsOriginales: [{ id: item.id, cantidad: Number(item.cantidad) }],
        };
      }
      return acc;
    }, {});

    return Object.values(agrupados);
  }, [productosRaw]);

  // Encontrar el producto seleccionado por su nombre único
  const productoSeleccionado = useMemo(() => {
    if (!formData.producto_id) return null;
    return productosAgrupados.find(
      (p) => p.nombre === formData.producto_id
    );
  }, [formData.producto_id, productosAgrupados]);

  // Opciones limpias para el CustomSelect sin duplicados
  const productoOptions = useMemo(() => {
    return productosAgrupados.map((producto) => ({
      value: producto.nombre,
      label: `${producto.nombre} (${producto.cantidad} disponibles)`,
    }));
  }, [productosAgrupados]);

  // ============================================
  // CÁLCULO DE 3 DÍAS HÁBILES ANTERIORES PARA EL CALENDARIO
  // ============================================
  const limitesFecha = useMemo(() => {
    const hoy = new Date();
    
    // Formatear max (hoy) a YYYY-MM-DD para el input tipo date
    const maxDateStr = hoy.toISOString().split("T")[0];

    // Calcular min (3 días hábiles atrás)
    let diasPorRestar = 3;
    const fechaMin = new Date(hoy);

    while (diasPorRestar > 0) {
      fechaMin.setDate(fechaMin.getDate() - 1);
      const diaSemana = fechaMin.getDay(); // 0 = Domingo, 6 = Sábado
      if (diaSemana !== 0 && diaSemana !== 6) {
        diasPorRestar--;
      }
    }
    const minDateStr = fechaMin.toISOString().split("T")[0];

    return { min: minDateStr, max: maxDateStr };
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await obtenerProductos();
      setProductosRaw(data || []);
    } catch (err) {
      console.warn("Error cargando productos:", err);
      setProductosRaw([]);
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

    if (!formData.beneficiario_nombre.trim() || !formData.beneficiario_telefono.trim() || !formData.beneficiario_direccion.trim()) {
      setError("Todos los campos del beneficiario son obligatorios");
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

    const stockTotal = Number(productoSeleccionado?.cantidad || 0);
    if (Number(formData.cantidad) > stockTotal) {
      setError(`Solo hay ${stockTotal} unidades disponibles en total`);
      setSaving(false);
      return;
    }

    try {
      // 1. Crear o Registrar Beneficiario
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

      // 2. Repartir y rebajar en cascada la cantidad solicitada sobre los registros originales repetidos
      let cantidadRestantePorEntregar = Number(formData.cantidad);
      const productosParaEndpoints = [];

      for (const item of productoSeleccionado.idsOriginales) {
        if (cantidadRestantePorEntregar <= 0) break;

        const aTomarDeEsteRegistro = Math.min(item.cantidad, cantidadRestantePorEntregar);
        
        productosParaEndpoints.push({
          producto_id: item.id,
          cantidad: aTomarDeEsteRegistro,
          nuevaCantidadStock: item.cantidad - aTomarDeEsteRegistro
        });

        cantidadRestantePorEntregar -= aTomarDeEsteRegistro;
      }

      // 3. Crear el Registro de la Entrega Principal utilizando el ID primario del primer bloque encontrado
      await api.post("/api/entregas", {
        beneficiario_id: Number(nuevoBeneficiarioId),
        fecha: formData.fecha,
        productos: productosParaEndpoints.map(p => ({
          producto_id: p.producto_id,
          cantidad: p.cantidad
        })),
      });

      // 4. Actualizar stocks individuales concurrentemente en el inventario real
      await Promise.all(
        productosParaEndpoints.map(p =>
          api.put(`/api/productos/${p.producto_id}`, { cantidad: p.nuevaCantidadStock })
        )
      );

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const currentItems = useMemo(() => {
    return entregasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  }, [entregasFiltradas, indexOfFirstItem, indexOfLastItem]);

  const totalPages = Math.ceil(entregasFiltradas.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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
                  <div className="usuarios-table-loading">
                    <div className="loading-spinner"></div>
                    <span>Cargando datos...</span>
                  </div>
                ) : currentItems.length === 0 ? (
                  <div className="usuarios-table-empty">
                    <span>No se encontraron entregas registradas.</span>
                  </div>
                ) : (
                  currentItems.map((entrega) => (
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

              {!loadingEntregas && totalPages > 1 && (
                <div className="usuarios-pagination-container">
                  <div className="usuarios-pagination-block">
                    <button 
                      type="button"
                      onClick={prevPage} 
                      disabled={currentPage === 1}
                      className="pagination-arrow-btn"
                    >
                      &laquo; Anterior
                    </button>
                    
                    <div className="pagination-numbers">
                      {Array.from({ length: totalPages }, (_, index) => (
                        <button
                          type="button"
                          key={index + 1}
                          onClick={() => paginate(index + 1)}
                          className={`pagination-number-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <button 
                      type="button"
                      onClick={nextPage} 
                      disabled={currentPage === totalPages}
                      className="pagination-arrow-btn"
                    >
                      Siguiente &raquo;
                    </button>
                  </div>
                </div>
              )}
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
                      productosAgrupados.length === 0
                        ? "No hay productos disponibles"
                        : "Seleccionar producto"
                    }
                  />
                  {productoSeleccionado && (
                    <span className="stock-hint">
                      Stock total disponible:{" "}
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
                      min={limitesFecha.min}
                      max={limitesFecha.max}
                      value={formData.fecha}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <span className="stock-hint">Permitido solo hasta 3 días hábiles anteriores.</span>
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