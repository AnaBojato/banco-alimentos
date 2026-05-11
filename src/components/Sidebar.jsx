import {
  House,
  Package,
  Truck,
  Users,
  LogOut,
} from "lucide-react";

import "../styles/sidebar.css";

function Sidebar() {

  return (

    <aside className="sidebar">

      <div>

        <div className="sidebar-logo">

          <div className="sidebar-logo-icon">
            🍎
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

          <button className="sidebar-link active">
            <House size={18} />
            Inicio
          </button>

          <button className="sidebar-link">
            <Package size={18} />
            Inventario
          </button>

          <button className="sidebar-link">
            <Truck size={18} />
            Entregas
          </button>

          <button className="sidebar-link">
            <Users size={18} />
            Usuarios
          </button>

        </nav>

      </div>

      <button className="logout-btn">
        <LogOut size={18} />
        Cerrar Sesión
      </button>

    </aside>

  );
}

export default Sidebar;