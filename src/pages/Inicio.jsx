import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Package,
  TriangleAlert,
  HandHeart,
  Truck,
  Calendar,
  SlidersHorizontal,
} from "lucide-react";

import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import DashboardCard from "../components/DashboardCard/DashboardCard";
import QuickActionCard from "../components/QuickActionCard/QuickActionCard";
import MobileSidebar from "../components/MobileSideBar/MobileSidebar";
import ProfileButton from "../components/ProfileButton/ProfileButton";

import "../styles/inicio.css";

function Inicio() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [stats, setStats] = useState({
    totalProductos: 0,
    productosPorVencer: 0,
    stockBajo: 0,
    totalDonaciones: 0,
  });

  const today = new Date().toLocaleDateString(
    "es-ES",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3000/api/reportes/resumen",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        setStats({
          totalProductos:
            data.resumen.total_productos,

          productosPorVencer:
            data.alertas
              .productos_por_vencer_7dias,

          stockBajo:
            data.alertas
              .productos_stock_bajo,

          totalDonaciones:
            data.resumen.total_donaciones,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR DESKTOP */}
      <Sidebar />

      {/* SIDEBAR MOBILE */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* MAIN */}
      <div className="dashboard-main">
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
        <div className="dashboard-content">
          {/* HEADER */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">
                Bienvenido al Sistema
              </h1>

              <p className="dashboard-subtitle">
                Panel de control de recursos y
                logística humanitaria.
              </p>
            </div>

            <div className="dashboard-date">
              <Calendar size={15} />

              {today}
            </div>
          </div>

          {/* CARDS */}
          <div className="dashboard-cards">
            <DashboardCard
              title="Total Productos"
              value={stats.totalProductos}
              subtitle="+12% vs mes anterior"
              icon={<Package size={22} />}
              iconClass=""
              badgeClass=""
            />

            <DashboardCard
              title="Próximos a Vencer"
              value={stats.productosPorVencer}
              subtitle="Atención requerida"
              icon={
                <TriangleAlert size={22} />
              }
              iconClass="orange"
              badgeClass="warning"
            />

            <DashboardCard
              title="Donaciones del Mes"
              value={stats.totalDonaciones}
              subtitle="Meta: 90%"
              icon={<HandHeart size={22} />}
              iconClass="blue"
              badgeClass="blue"
            />
          </div>

          {/* QUICK ACTIONS */}
          <div className="quick-section">
            <div className="quick-header">
              <h2>Accesos Rápidos</h2>

              <button className="filter-btn">
                <SlidersHorizontal size={15} />
                Filtros
              </button>
            </div>

            <div className="quick-grid">
              <QuickActionCard
                title="Donaciones"
                action="Explorar"
                icon={<HandHeart size={22} />}
                route="/donaciones"
              />

              <QuickActionCard
                title="Inventario"
                action="Gestionar"
                icon={<Package size={22} />}
                route="/inventario"
              />

              <QuickActionCard
                title="Caducados"
                action="Revisar"
                icon={
                  <TriangleAlert size={22} />
                }
                route="/vencimientos"
                iconClass="orange"
              />

              <QuickActionCard
                title="Entregas"
                action="Rastreo"
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