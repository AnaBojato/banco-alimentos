import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Package,
  TriangleAlert,
  HandHeart,
  Truck,
  Calendar,
} from "lucide-react";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import QuickActionCard from "../../components/QuickActionCard/QuickActionCard";
import MobileSidebar from "../../components/MobileSideBar/MobileSidebar";
import ProfileButton from "../../components/ProfileButton/ProfileButton";
import { logoutService } from "../../services/authService";

import "../Inicio/inicio.css";

function Inicio() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    totalProductos: 0,
    totalUsuarios: 0,
    stockBajo: 0,
  });

  const today = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem("token");

        // PRODUCTOS
        const productosResponse = await fetch(
          "http://localhost:3000/api/productos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!productosResponse.ok) {
          throw new Error("No se pudo conectar al inventario");
        }

        const productos = await productosResponse.json();
        const listaProductos = Array.isArray(productos) ? productos : [];

        const totalProductos = listaProductos.length;

        const stockBajo = listaProductos.filter(
          (p) => parseFloat(p.cantidad) <= 10
        ).length;

        // USUARIOS
        let totalUsuarios = 0;

        const usuariosResponse = await fetch(
          "http://localhost:3000/api/usuarios",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (usuariosResponse.ok) {
          const usuarios = await usuariosResponse.json();
          totalUsuarios = usuarios.length;
        }

        setStats({
          totalProductos,
          totalUsuarios,
          stockBajo,
        });
      } catch (error) {
        console.error("⚠️ Error cargando dashboard:", error);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dashboard-main">
        <Navbar openSidebar={() => setSidebarOpen(true)}>
          <ProfileButton
            onProfileClick={() => navigate("/profile")}
            onLogout={() => {
              logoutService();
              navigate("/login");
            }}
          />
        </Navbar>

        <div className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">
                Bienvenido al Sistema
              </h1>
              <p className="dashboard-subtitle">
                Panel de control de recursos y logística humanitaria.
              </p>
            </div>

            <div className="dashboard-date">
              <Calendar size={15} />
              {today}
            </div>
          </div>

          <div className="dashboard-cards">
            <DashboardCard
              title="Total Productos"
              value={stats.totalProductos}
              subtitle="Items en inventario"
              icon={<Package size={22} />}
            />

            <DashboardCard
              title="Total Usuarios"
              value={stats.totalUsuarios}
              subtitle="Usuarios registrados"
              icon={<HandHeart size={22} />}
              iconClass="orange"
              badgeClass="warning"
            />

            <DashboardCard
              title="Alertas de Stock"
              value={stats.stockBajo}
              subtitle="Mínimo: 10 unidades"
              icon={<TriangleAlert size={22} />}
              iconClass="red"
              badgeClass="danger"
            />
          </div>

          <div className="quick-section">
            <div className="quick-header">
              <h2>Accesos Rápidos</h2>
            </div>

            <div className="quick-grid">
              <QuickActionCard
                title="Inventario"
                action="Gestionar"
                icon={<Package size={22} />}
                route="/inventario"
              />

              <QuickActionCard
                title="Entregas"
                action="Registrar"
                icon={<Truck size={22} />}
                route="/entregas"
                iconClass="olive"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;