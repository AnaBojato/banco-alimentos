import {
  House,
  Package,
  Truck,
  Users,
  LogOut,
  HeartHandshake,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import "../Sidebar/sidebar.css";

function Sidebar({ inMobile = false }) {

  const navigate = useNavigate();

  const location = useLocation();

  return (

    <aside
      className={`sidebar ${
        inMobile
          ? "sidebar-mobile-inner"
          : ""
      }`}
    >

      <div>

        <div className="sidebar-logo">

          <div className="sidebar-logo-icon">
            <HeartHandshake size={26} />
          </div>

          <div>

            <h2>
              Banco de Alimentos
            </h2>

            <p>
              Administrador
            </p>

          </div>

        </div>

        <nav className="sidebar-nav">

          <button
            className={`sidebar-link ${
              location.pathname === "/inicio"
                ? "active"
                : ""
            }`}
            onClick={() => navigate("/inicio")}
          >

            <House size={18} />

            Inicio

          </button>

          <button
            className={`sidebar-link ${
              location.pathname === "/inventario"
                ? "active"
                : ""
            }`}
            onClick={() => navigate("/inventario")}
          >

            <Package size={18} />

            Inventario

          </button>

          <button
            className={`sidebar-link ${
              location.pathname === "/entregas"
                ? "active"
                : ""
            }`}
            onClick={() => navigate("/entregas")}
          >

            <Truck size={18} />

            Entregas

          </button>

          <button
            className={`sidebar-link ${
              location.pathname === "/usuarios"
                ? "active"
                : ""
            }`}
            onClick={() => navigate("/usuarios")}
          >

            <Users size={18} />

            Usuarios

          </button>

        </nav>

      </div>

    </aside>

  );
}

export default Sidebar;