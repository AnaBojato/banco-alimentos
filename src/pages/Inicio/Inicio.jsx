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

  // Mantenemos la estructura de estados limpia
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
    const cargarDatosDesdeInventario = async () => {
      try {
        const token = localStorage.getItem("token");

        // 1. LLAMAMOS AL ENDPOINT DE PRODUCTOS/INVENTARIO (El que sí funciona)
        const response = await fetch("http://localhost:3000/api/productos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo conectar al inventario");
        }

        const productos = await response.json(); 
        // Nota: Si tu API de productos devuelve un objeto como { data: [...] }, cambia la línea de abajo por: const lista = productos.data || [];
        const lista = Array.isArray(productos) ? productos : [];

        // 2. CALCULAMOS LAS MÉTRICAS EN TIEMPO REAL DESDE EL FRONTEND
        
        // A. Total Productos
        const total = lista.length;

        // B. Stock Bajo (Menos o igual a 10 unidades)
        const bajos = lista.filter(p => parseFloat(p.cantidad) <= 10).length;

        // C. Productos por vencer en los próximos 7 días
        const hoy = new Date();
        const limiteVencimiento = new Date();
        limiteVencimiento.setDate(hoy.getDate() + 7);

        const porVencer = lista.filter(p => {
          if (!p.fecha_vencimiento) return false;
          const fechaProd = new Date(p.fecha_vencimiento);
          return fechaProd >= hoy && fechaProd <= limiteVencimiento;
        }).length;

        // 3. ACTUALIZAMOS EL ESTADO
        setStats({
          totalProductos: total,
          productosPorVencer: porVencer,
          stockBajo: bajos,
          totalDonaciones: 0, // Lo dejamos en 0 de respaldo para que no rompa la tarjeta
        });

      } catch (error) {
        console.error("⚠️ Falló la simulación de reportes en el front:", error);
      }
    };

    cargarDatosDesdeInventario();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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

          {/* TARJETAS CALCULADAS DESDE EL FRONTEND */}
          <div className="dashboard-cards">
            <DashboardCard
              title="Total Productos"
              value={stats.totalProductos} // <--- ¡Aquí se verán tus 23 productos!
              subtitle="Items en inventario"
              icon={<Package size={22} />}
              iconClass=""
              badgeClass=""
            />

            <DashboardCard
              title="Próximos a Vencer"
              value={stats.productosPorVencer}
              subtitle="Límite: 7 días"
              icon={<TriangleAlert size={22} />}
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