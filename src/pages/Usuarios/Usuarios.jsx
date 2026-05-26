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

  const [formData, setFormData] =
    useState({
      nombre_completo: "",
      correo: "",
      telefono: "",
      rol: "voluntario",
      password: "",
    });

  // ============================================
  // OBTENER USUARIOS
  // ============================================

  const fetchUsuarios = async () => {

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

  }, [search, usuarios]);

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
                Administra los permisos
                y accesos del personal.
              </p>

            </div>

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

                {filteredUsuarios.map(
                  (usuario) => (

                    <div
                      className="usuarios-row"
                      key={usuario.id}
                    >

                      <div className="usuario-name">

                        <div className="usuario-avatar">

                          {usuario.nombre_completo?.charAt(
                            0
                          )}

                        </div>

                        <span>
                          {
                            usuario.nombre_completo
                          }
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

                  )
                )}

              </div>

            </div>

            {/* FORM */}
            <div className="usuarios-form-card">

              <div className="usuarios-form-title">

                <UserPlus size={20} />

                <h2>
                  Nuevo Usuario
                </h2>

              </div>

              <form
                onSubmit={handleSubmit}
                className="usuarios-form"
              >

                <div className="form-group">

                  <label>
                    Nombre Completo
                  </label>

                  <input
                    type="text"
                    name="nombre_completo"
                    value={
                      formData.nombre_completo
                    }
                    onChange={handleChange}
                    placeholder="Ingrese su nombre completo"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Correo Electrónico
                  </label>

                  <input
                    type="email"
                    name="correo"
                    value={
                      formData.correo
                    }
                    onChange={handleChange}
                    placeholder="ejemplo@email.com"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Teléfono
                  </label>

                  <input
                    type="text"
                    name="telefono"
                    value={
                      formData.telefono
                    }
                    onChange={handleChange}
                    placeholder="Ingrese su número"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Rol del Sistema
                  </label>

                  <CustomSelect
                    name="rol"
                    options={
                      ROL_OPTIONS
                    }
                    value={
                      formData.rol
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {formData.rol ===
                  "administrador" && (

                  <div className="form-group">

                    <label>
                      Contraseña
                    </label>

                    <input
                      type="password"
                      name="password"
                      value={
                        formData.password
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="********"
                      required
                    />

                  </div>

                )}

                {error && (

                  <p className="form-error">
                    {error}
                  </p>

                )}

                <button
                  type="submit"
                  className="save-user-btn"
                  disabled={loading}
                >

                  {loading
                    ? "Guardando..."
                    : "Guardar Usuario"}

                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Usuarios;