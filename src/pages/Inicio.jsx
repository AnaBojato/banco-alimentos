import { useEffect, useState } from "react";
import {
  Package, TriangleAlert, HandHeart, Truck,
  Calendar, SlidersHorizontal,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import QuickActionCard from "../components/QuickActionCard";
import MobileSidebar from "../components/MobileSidebar";

import "../styles/inicio.css";

function Inicio() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    totalProductos: 0,
    productosPorVencer: 0,
    stockBajo: 0,
    totalDonaciones: 0,
  });

  const today = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/reportes/resumen", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setStats({
          totalProductos: data.resumen.total_productos,
          productosPorVencer: data.alertas.productos_por_vencer_7dias,
          stockBajo: data.alertas.productos_stock_bajo,
          totalDonaciones: data.resumen.total_donaciones,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-main">
        <Navbar openSidebar={() => setSidebarOpen(true)} />

        <div className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Bienvenido al Sistema</h1>
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
              subtitle="+12% vs mes anterior"
              icon={<Package size={22} />}
              iconClass=""
              badgeClass=""
            />
            <DashboardCard
              title="Próximos a Vencer"
              value={stats.productosPorVencer}
              subtitle="Atención requerida"
              icon={<TriangleAlert size={22} />}
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

          <div className="quick-section">
            <div className="quick-header">
              <h2>Reportes Rápidos</h2>
              <button className="filter-btn">
                <SlidersHorizontal size={15} />
                Filtros
              </button>
            </div>

            <div className="quick-grid">
              <QuickActionCard
                title="Ver Donaciones"
                description="Historial detallado de entradas y donantes activos."
                action="Explorar"
                icon={<HandHeart size={22} />}
                route="/donaciones"
              />
              <QuickActionCard
                title="Ver Inventario"
                description="Consulta el stock real disponible en almacén central."
                action="Gestionar"
                icon={<Package size={22} />}
                route="/inventario"
              />
              <QuickActionCard
                title="Ver Vencimientos"
                description="Listado de productos con caducidad próxima."
                action="Revisar"
                icon={<TriangleAlert size={22} />}
                route="/vencimientos"
                iconClass="orange"
              />
              <QuickActionCard
                title="Ver Entregas"
                description="Control de logística y distribución."
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