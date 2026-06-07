import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { UserPlus } from "lucide-react";

import api from "../../api/api";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import MobileSidebar from "../../components/MobileSidebar/MobileSidebar";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import ProfileButton from "../../components/ProfileButton/ProfileButton";

import "../Usuarios/usuarios.css";

const ROL_OPTIONS = [
  {
    value: "voluntario",
    label: "Voluntario",
  },
  {
    value: "administrador",
    label: "Administrador",
  },
];

function Usuarios() {

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [usuarios, setUsuarios] =
    useState([]);

  const [filteredUsuarios, setFilteredUsuarios] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [formData, setFormData] =
    useState({
      nombre_completo: "",
      correo: "",
      telefono: "",
      rol: "voluntario",
      password: "",
    });

  // ============================================
  // ESTADOS PARA PAGINACIÓN
  // ============================================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ============================================
  // OBTENER USUARIOS
  // ============================================

  const fetchUsuarios = async () => {
    setLoading(true); // Activa el cargando antes de la petición
    try {

      const response = await api.get(
        "/api/usuarios"
      );

      setUsuarios(response.data);

      setFilteredUsuarios(
        response.data
      );

    } catch (err) {

      console.log(err);

    } finally {
      setLoading(false); // Desactiva el cargando al finalizar
    }

  };

  useEffect(() => {

    fetchUsuarios();

  }, []);

  // ============================================
  // BUSCADOR
  // ============================================

  useEffect(() => {

    if (!search.trim()) {

      setFilteredUsuarios(
        usuarios
      );
      setCurrentPage(1);
      return;

    }

    const filtered =
      usuarios.filter((usuario) => {

        const text =
          `
            ${usuario.nombre_completo}
            ${usuario.correo}
            ${usuario.telefono}
            ${usuario.rol}
          `.toLowerCase();

        return text.includes(
          search.toLowerCase()
        );

      });

    setFilteredUsuarios(
      filtered
    );
    setCurrentPage(1);

  }, [search, usuarios]);

  // ============================================
  // LÓGICA DE PAGINACIÓN (CÁLCULOS)
  // ============================================
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // ============================================
  // INPUTS
  // ============================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

  };

  // ============================================
  // CREAR USUARIO
  // ============================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      let endpoint =
        "/api/usuarios";

      let bodyData = {
        nombre_completo:
          formData.nombre_completo,

        correo:
          formData.correo,

        telefono:
          formData.telefono,

        rol:
          formData.rol,
      };

      // ====================================
      // ADMIN
      // ====================================

      if (
        formData.rol ===
        "administrador"
      ) {

        endpoint =
          "/api/auth/registrar";

        bodyData.password =
          formData.password;

      }

      await api.post(
        endpoint,
        bodyData
      );

      setFormData({
        nombre_completo: "",
        correo: "",
        telefono: "",
        rol: "voluntario",
        password: "",
      });

      fetchUsuarios();
      setModalOpen(false);

    } catch (err) {

      setError(
        err.response?.data
          ?.error ||
          "Error creando usuario"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="usuarios-layout">

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
      <div className="usuarios-main">

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
        <div className="usuarios-content">

          {/* HEADER */}
          <div className="usuarios-header">

            <div>

              <h1>
                Gestión de Usuarios
              </h1>

              <p>
                Administra los permisos y accesos del personal.
              </p>

            </div>

            <button
              type="button"
              className="usuarios-btn-primary"
              onClick={() =>
                setModalOpen(true)
              }
            >
              <UserPlus size={16} />
              Nuevo Usuario
            </button>

          </div>

          {/* BUSCADOR */}
          <div className="usuarios-search-box">

            <input
              type="text"
              placeholder="Buscar usuario..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="usuarios-search-input"
            />

          </div>

          <div className="usuarios-grid">

            {/* TABLA */}
            <div className="usuarios-table-card">

              <div className="usuarios-table-header">

                <h2>
                  Listado de Personal
                </h2>

                <span>
                  {
                    filteredUsuarios.length
                  }{" "}
                  Total
                </span>

              </div>

              <div className="usuarios-table">

                <div className="usuarios-table-head">

                  <span>
                    Nombre
                  </span>

                  <span>
                    Correo
                  </span>

                  <span>
                    Rol
                  </span>

                  <span>
                    Teléfono
                  </span>

                </div>

                {/* ============================================
                    CONTROL DE CARGA / DATOS VACÍOS / FILAS
                   ============================================ */}
                {loading ? (
                  <div className="usuarios-table-loading">
                    <div className="loading-spinner"></div>
                    <span>Cargando datos...</span>
                  </div>
                ) : currentItems.length === 0 ? (
                  <div className="usuarios-table-empty">
                    <span>No se encontraron usuarios.</span>
                  </div>
                ) : (
                  currentItems.map((usuario) => (
                    <div
                      className="usuarios-row"
                      key={usuario.id}
                    >
                      <div className="usuario-name">
                        <div className="usuario-avatar">
                          {usuario.nombre_completo?.charAt(0)}
                        </div>
                        <span>
                          {usuario.nombre_completo}
                        </span>
                      </div>

                      <span>
                        {usuario.correo}
                      </span>

                      <span
                        className={`rol-badge ${usuario.rol}`}
                      >
                        {usuario.rol}
                      </span>

                      <span>
                        {usuario.telefono}
                      </span>
                    </div>
                  ))
                )}

              </div>

              {/* ============================================
                  BOTONERA DE PAGINACIÓN COMPACTA
                 ============================================ */}
              {!loading && totalPages > 1 && (
                <div className="usuarios-pagination-container">
                  <div className="usuarios-pagination-block">
                    <button 
                      onClick={prevPage} 
                      disabled={currentPage === 1}
                      className="pagination-arrow-btn"
                    >
                      &laquo; Anterior
                    </button>
                    
                    <div className="pagination-numbers">
                      {Array.from({ length: totalPages }, (_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => paginate(index + 1)}
                          className={`pagination-number-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={nextPage} 
                      disabled={currentPage === totalPages}
                      className="pagination-arrow-btn"
                    >
                      Siguiente &raquo;
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {modalOpen && (
        <div
          className="usuarios-modal-overlay"
          onClick={() =>
            setModalOpen(false)
          }
        >
          <div
            className="usuarios-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              type="button"
              className="usuarios-modal-close"
              onClick={() =>
                setModalOpen(false)
              }
            >
              ✕
            </button>

            <h2>Nuevo Usuario</h2>

            <form
              onSubmit={handleSubmit}
              className="usuarios-form"
            >
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  name="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={handleChange}
                  placeholder="Ingrese su nombre completo"
                  required
                />
              </div>

              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="ejemplo@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ingrese su número"
                  required
                />
              </div>

              <div className="form-group">
                <label>Rol del Sistema</label>
                <CustomSelect
                  name="rol"
                  options={ROL_OPTIONS}
                  value={formData.rol}
                  onChange={handleChange}
                />
              </div>

              {formData.rol === "administrador" && (
                <div className="form-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    required
                  />
                </div>
              )}

              {error && <p className="form-error">{error}</p>}

              <button
                type="submit"
                className="save-user-btn"
                disabled={loading} // Aquí se usa correctamente para el formulario también
              >
                {loading ? "Guardando..." : "Guardar Usuario"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>

  );
}

export default Usuarios;