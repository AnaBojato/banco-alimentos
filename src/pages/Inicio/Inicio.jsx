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
import api from "../../api/api";

import "../Inicio/inicio.css";

function Inicio() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      try {
        const productosResponse = await api.get("/productos");
        const listaProductos = Array.isArray(productosResponse.data)
          ? productosResponse.data
          : [];

        const productosFormateados = listaProductos.map((producto) => ({
          id: producto.id,
          name: producto.nombre,
          quantity: Number(producto.cantidad),
          type:
            producto.tipo === "no_perecedero"
              ? "No Perecedero"
              : "Perecedero",
        }));

        const agrupados = Object.values(
          productosFormateados.reduce((acc, item) => {
            const key = `${item.name}-${item.type}`;

            if (acc[key]) {
              acc[key].quantity += item.quantity;
            } else {
              acc[key] = { ...item };
            }

            return acc;
          }, {})
        );

        const totalProductos = agrupados.length;
        const stockBajo = agrupados.filter(
          (p) => Number(p.quantity) <= 10
        ).length;

        let totalUsuarios = 0;
        try {
          const usuariosResponse = await api.get("/usuarios");
          totalUsuarios = usuariosResponse.data.length;
        } catch (uError) {
          console.error("⚠️ Error obteniendo usuarios:", uError);
        }

        setStats({
          totalProductos,
          totalUsuarios,
          stockBajo,
        });
      } catch (error) {
        console.error("⚠️ Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const renderValue = (value) => {
    if (loading) {
      return <div className="card-mini-spinner"></div>;
    }
    return value;
  };

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
              value={renderValue(stats.totalProductos)}
              subtitle="Items en inventario"
              icon={<Package size={22} />}
            />

            <DashboardCard
              title="Total Usuarios"
              value={renderValue(stats.totalUsuarios)}
              subtitle="Usuarios registrados"
              icon={<HandHeart size={22} />}
              iconClass="orange"
              badgeClass="warning"
            />

            <DashboardCard
              title="Alertas de Stock"
              value={renderValue(stats.stockBajo)}
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