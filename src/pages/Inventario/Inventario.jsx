import "./inventario.css";
import { useState, useEffect } from "react";
import { obtenerProductos } from "../../services/productoService";
import { crearDonacion } from "../../services/donationService";

import {
  Search,
  Gift,
  Send,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import MobileSidebar from "../../components/MobileSideBar/MobileSidebar";
import ProfileButton from "../../components/ProfileButton/ProfileButton";

function Inventario() {

  const navigate = useNavigate();

  // ============================================
  // UI
  // ============================================

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [producto, setProducto] =
    useState("");

  const [tipo, setTipo] =
    useState("");

  const [cantidad, setCantidad] =
    useState("");

  const [unidad, setUnidad] =
    useState("kg");

  const [nombre, setNombre] =
    useState("");

  const [correo, setCorreo] =
    useState("");

  const [telefono, setTelefono] =
    useState("");

  const [direccion, setDireccion] =
    useState("");

  const [errores, setErrores] =
    useState({});

  const [cargando, setCargando] =
    useState(false);

  const [exito, setExito] =
    useState(false);

  // ============================================
  // DATA
  // ============================================

  const [inventoryData, setInventoryData] = useState([]);

  const [loadingProductos, setLoadingProductos] = useState(true);

  const [paginaActual, setPaginaActual] = useState(1);

  const productosPorPagina = 10;

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setLoadingProductos(true);

    try {
      const productos = await obtenerProductos();

      console.log("PRODUCTOS:", productos);

      const productosFormateados = productos.map((producto) => ({
        id: producto.id,
        name: producto.nombre,
        quantity: producto.cantidad,
        unit: "unidades",
        type:
          producto.tipo === "no_perecedero"
            ? "No Perecedero"
            : "Perecedero",
        donationDate: producto.createdAt
          ? new Date(producto.createdAt).toLocaleDateString("es-CO")
          : "-",
        status: "ok",
      }));

      const agrupados = Object.values(
        productosFormateados.reduce((acc, item) => {
          const key = `${item.name}-${item.type}`;

          if (acc[key]) {
            acc[key].quantity += item.quantity;
            acc[key].donationDate = item.donationDate;
          } else {
            acc[key] = { ...item };
          }

          return acc;
        }, {})
      );

      setInventoryData(agrupados);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setInventoryData([]);
    } finally {
      setLoadingProductos(false);
    }
  };

  // ============================================
  // STATUS
  // ============================================

  const getStatusBadge = (status) => {

    switch (status) {

      case "ok":
        return (
          <span className="status-badge status-ok">
            Disponible
          </span>
        );

      case "warning":
        return (
          <span className="status-badge status-warning">
            Próximo
          </span>
        );

      case "danger":
        return (
          <span className="status-badge status-danger">
            Vencido
          </span>
        );
      default:
        return null;

    }

  };

  // ============================================
  // FILTER
  // ============================================

  const inventarioFiltrado =
    inventoryData.filter((item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const totalPaginas = Math.ceil(
    inventarioFiltrado.length /
      productosPorPagina
  );

  const indiceInicial =
    (paginaActual - 1) * productosPorPagina;

  const productosPaginados =
    inventarioFiltrado.slice(
      indiceInicial,
      indiceInicial + productosPorPagina
    );

  const handleDonacion = async () => {

    const nuevosErrores = {};

    if (!producto.trim()) {
      nuevosErrores.producto =
        "El producto es obligatorio";
    }

    if (!tipo) {
      nuevosErrores.tipo =
        "Selecciona un tipo";
    }

    if (!cantidad || Number(cantidad) <= 0) {
      nuevosErrores.cantidad =
        "Ingresa una cantidad válida";
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    setCargando(true);

    try {

      const donacionData = {
        producto,
        tipo,
        cantidad: Number(cantidad),
        unidad,
        donante: nombre
          ? {
              nombre_completo: nombre,
              correo,
              telefono,
              direccion,
            }
          : null,
      };

      await crearDonacion(donacionData);

      setModalOpen(false);

      setExito(true);
      setTimeout(() => setExito(false), 4000);

      setProducto("");
      setTipo("");
      setCantidad("");
      setUnidad("kg");
      setNombre("");
      setCorreo("");
      setTelefono("");
      setDireccion("");
      setErrores({});

      cargarProductos();

    } catch (error) {

      console.error(error);

      alert("Error al registrar la donación");

    } finally {

      setCargando(false);

    }
  };

  return (

    <div className="inventario-layout">

      {/* TOAST */}

      {exito && (
        <div className="donation-toast">
          <div className="toast-icon">
            <Send size={16} />
          </div>
          <div>
            <p className="toast-title">¡Donación registrada!</p>
            <p className="toast-sub">Gracias por tu generosidad 💚</p>
          </div>
          <button className="toast-close" onClick={() => setExito(false)}>×</button>
        </div>
      )}

      {/* SIDEBAR */}

      <Sidebar />

      {/* MOBILE SIDEBAR */}

      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* MAIN */}

      <div className="inventario-main">

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

        <div className="inventario-content">

          {/* HEADER */}

          <div className="inventario-header">

            <div>

              <h1>
                Inventario
              </h1>

              <p>
                Gestión integral de
                suministros y productos
                almacenados.
              </p>

            </div>

            <button
              type="button"
              className="inventario-btn-primary"
              onClick={() =>
                setModalOpen(true)
              }
            >
              <Gift size={16} />
              Registrar Donación
            </button>

          </div>

          {/* TABLE CARD */}

          <div className="inventario-card">

            {/* TABLE HEADER */}

            <div className="inventario-table-header">

              <div>

                <h2>
                  Productos Registrados
                </h2>

                <span>
                  {inventarioFiltrado.length}{" "}
                  productos
                </span>

              </div>

              {/* SEARCH */}

              <div className="table-search">

                <Search size={15} />

                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPaginaActual(1);
                  }}
                />

              </div>

            </div>

            {/* TABLE HEAD */}

            <div className="inventario-table-head">

              <span>Producto</span>

              <span>Cantidad</span>

              <span>Tipo</span>

              <span>Fecha Donación</span>

              <span>Estado</span>

            </div>

            {/* TABLE BODY */}

            <div className="inventario-table-body">

            {loadingProductos ? (

              <div className="usuarios-table-loading">
                <div className="loading-spinner"></div>
                <span>Cargando datos...</span>
              </div>

            ) : productosPaginados.length === 0 ? (

              <div className="usuarios-table-empty">
                <span>No se encontraron productos registrados.</span>
              </div>

            ) : (
              productosPaginados.map((item) => (
                <div
                  className="inventario-row"
                  key={`${item.name}-${item.type}`}
                >
                  <div className="producto-cell">
                    <div>
                      <h4>{item.name}</h4>
                    </div>
                  </div>

                  <span data-label="Cantidad">
                    <strong>{item.quantity}</strong> {item.unit}
                  </span>

                  <span data-label="Tipo">{item.type}</span>

                  <span data-label="Fecha Donación">{item.donationDate}</span>

                  <span data-label="Estado">{getStatusBadge(item.status)}</span>
                </div>
              ))
            )}

            </div>

            {!loadingProductos && totalPaginas > 0 && (
              <div className="inventario-pagination">
                <button
                  type="button"
                  className="inventario-btn-secondary"
                  disabled={paginaActual === 1}
                  onClick={() =>
                    setPaginaActual(paginaActual - 1)
                  }
                >
                  Anterior
                </button>

                <span className="inventario-pagination-label">
                  Página {paginaActual} de {totalPaginas || 1}
                </span>

                <button
                  type="button"
                  className="inventario-btn-secondary"
                  disabled={paginaActual === totalPaginas || totalPaginas === 0}
                  onClick={() =>
                    setPaginaActual(paginaActual + 1)
                  }
                >
                  Siguiente
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* MODAL */}

      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setModalOpen(false)}
            >
              <X size={18} />
            </button>

            <div className="inventario-modal-header">
              <h2>Registrar Donación</h2>
            </div>

            <div className="inventario-modal-body">
              <div className="inventario-form-group">
                <label>Producto</label>
                <input
                  type="text"
                  value={producto}
                  onChange={(e) => setProducto(e.target.value)}
                  placeholder="Ej. Arroz, leche, etc."
                />
                {errores.producto && (
                  <span className="inventario-error-text">{errores.producto}</span>
                )}
              </div>

              <div className="inventario-form-group">
                <label>Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="perecedero">Perecedero</option>
                  <option value="no_perecedero">No Perecedero</option>
                </select>
                {errores.tipo && (
                  <span className="inventario-error-text">{errores.tipo}</span>
                )}
              </div>

              <div className="inventario-form-group">
                <label>Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder="Ej. 10"
                />
                {errores.cantidad && (
                  <span className="inventario-error-text">{errores.cantidad}</span>
                )}
              </div>

              <div className="inventario-form-group">
                <label>Unidad</label>
                <select
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                >
                  <option value="kg">kg</option>
                  <option value="unidades">unidades</option>
                  <option value="litros">litros</option>
                </select>
              </div>

              <div className="inventario-form-group">
                <label>Nombre (Opcional)</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre del donante"
                />
              </div>

              <div className="inventario-form-group">
                <label>Correo</label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="inventario-form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Número de contacto"
                />
              </div>

              <div className="inventario-form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Dirección del donante"
                />
              </div>

              <button
                type="button"
                className="inventario-submit-btn"
                onClick={handleDonacion}
                disabled={cargando}
              >
                {cargando ? (
                  <span className="inventario-btn-spinner" />
                ) : (
                  <Send size={16} />
                )}
                {cargando ? "Enviando..." : "Registrar Donación"}
              </button>

            </div>
          </div>
        </div>
      )}

    </div>

  );

}

export default Inventario;