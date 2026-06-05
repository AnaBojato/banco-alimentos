import "./inventario.css";
import { useState, useEffect } from "react";
import { obtenerProductos } from "../../services/productoService";

import {
  Search,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import MobileSidebar from "../../components/MobileSidebar/MobileSidebar";
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

  // ============================================
  // DATA
  // ============================================

  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
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

      // Agrupar por nombre + tipo y sumar cantidades
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
      console.error(
        "Error al cargar productos:",
        error
      );
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

  return (

    <div className="inventario-layout">

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
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
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

              {inventarioFiltrado.map(
                (item) => (

                  <div
                    className="inventario-row"
                    key={`${item.name}-${item.type}`}
                  >

                    {/* PRODUCTO */}

                    <div className="producto-cell">

                      <div>

                        <h4>
                          {item.name}
                        </h4>

                      </div>

                    </div>

                    {/* QUANTITY */}

                    <span>

                      <strong>
                        {item.quantity}
                      </strong>{" "}

                      {item.unit}

                    </span>

                    {/* TYPE */}

                    <span>
                      {item.type}
                    </span>

                    {/* DONATION */}

                    <span>
                      {item.donationDate}
                    </span>

                    {/* STATUS */}

                    <span>

                      {getStatusBadge(
                        item.status
                      )}

                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Inventario;