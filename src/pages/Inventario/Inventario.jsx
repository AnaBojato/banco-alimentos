import "./inventario.css";

import {
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

import { useState } from "react";

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

  const inventoryData = [
    {
      id: "INV-00124",
      name: "Leche Entera (Lote A)",
      image:
        "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=80&h=80&fit=crop",
      category: "Lácteos",
      quantity: "450",
      unit: "Unidades",
      type: "Perecedero",
      donationDate: "10 Oct, 2023",
      expirationDate: "12 Oct, 2023",
      status: "ok",
    },

    {
      id: "INV-00852",
      name: "Manzanas Rojas",
      image:
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=80&h=80&fit=crop",
      category: "Frutas",
      quantity: "120",
      unit: "kg",
      type: "Perecedero",
      donationDate: "20 May, 2023",
      expirationDate: "25 May, 2023",
      status: "warning",
    },

    {
      id: "INV-00391",
      name: "Vegetales en Conserva",
      image:
        "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=80&h=80&fit=crop",
      category: "Enlatados",
      quantity: "85",
      unit: "Lote",
      type: "No Perecedero",
      donationDate: "05 Ene, 2023",
      expirationDate: "10 Ene, 2023",
      status: "danger",
    },
  ];

  // ============================================
  // STATUS
  // ============================================

  const getStatusBadge = (status) => {

    switch (status) {

      case "ok":
        return (
          <span className="status-badge status-ok">
            D
          </span>
        );

      case "warning":
        return (
          <span className="status-badge status-warning">
            P.V
          </span>
        );

      case "danger":
        return (
          <span className="status-badge status-danger">
            V
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
                Inventario y Vencimientos
              </h1>

              <p>
                Gestión integral de
                suministros y control
                preventivo de caducidad
                de alimentos.
              </p>

            </div>

            <div className="inventario-actions">

              <button className="action-btn">

                <Filter size={16} />

                Filtrar

              </button>

              <button className="action-btn">

                <Download size={16} />

                Exportar

              </button>

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
                  {
                    inventarioFiltrado.length
                  }{" "}
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
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* TABLE HEAD */}

            <div className="inventario-table-head">

              <span>Producto</span>

              <span>
                Categoría
              </span>

              <span>
                Cantidad
              </span>

              <span>Tipo</span>

              <span>
                Fecha Donación
              </span>

              <span>
                Fecha Vencimiento
              </span>

              <span>Estado</span>

            </div>

            {/* TABLE BODY */}

            <div className="inventario-table-body">

              {inventarioFiltrado.map(
                (item) => (

                  <div
                    className="inventario-row"
                    key={item.id}
                  >

                    {/* PRODUCTO */}

                    <div className="producto-cell">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="producto-img"
                      />

                      <div>

                        <h4>
                          {item.name}
                        </h4>

                        <span>
                          ID: {item.id}
                        </span>

                      </div>

                    </div>

                    {/* CATEGORY */}

                    <span>
                      {item.category}
                    </span>

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

                    {/* EXPIRATION */}

                    <span>
                      {item.expirationDate}
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

            {/* PAGINATION */}

            <div className="pagination-container">

              <span>
                Mostrando 3 productos
              </span>

              <div className="pagination">

                <button className="pagination-btn">

                  <ChevronLeft size={16} />

                </button>

                <button className="pagination-btn active">
                  1
                </button>

                <button className="pagination-btn">
                  2
                </button>

                <button className="pagination-btn">

                  <ChevronRight size={16} />

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Inventario;