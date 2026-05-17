import { useEffect, useState } from "react";
import api from "../../api/api";
import { Pencil, Info, Check, Loader2 } from "lucide-react";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState({
    nombre_completo: "",
    correo: "",
    rol: "",
    telefono: ""
  });
  
  const [passwords, setPasswords] = useState({
    password_actual: "",
    password_nuevo: "",
    confirmar: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/auth/perfil");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({ type: "error", text: "Error al cargar el perfil" });
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      // 1. Actualizar Info Personal
      await api.put("/api/auth/perfil", {
        nombre_completo: user.nombre_completo,
        telefono: user.telefono
      });

      // 2. Si hay cambio de contraseña
      if (passwords.password_nuevo) {
        if (passwords.password_nuevo !== passwords.confirmar) {
          throw new Error("Las contraseñas no coinciden");
        }
        await api.put("/api/auth/cambiar-password", {
          password_actual: passwords.password_actual,
          password_nuevo: passwords.password_nuevo
        });
        setPasswords({ password_actual: "", password_nuevo: "", confirmar: "" });
      }

      setMessage({ type: "success", text: "Perfil actualizado correctamente" });
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.error || error.message || "Error al actualizar" 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <Loader2 className="animate-spin" size={40} />
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-top">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información personal y configuración de seguridad.</p>
      </div>

      <div className="profile-layout">
        {/* LEFT */}
        <div className="profile-user-card">
          <div className="profile-avatar-container">
            <div className="profile-avatar-placeholder">
              {user.nombre_completo?.charAt(0)}
            </div>
            <button className="edit-avatar-btn">
              <Pencil size={16} />
            </button>
          </div>
          <h3>{user.nombre_completo}</h3>
          <span className="rol-label">{user.rol}</span>
        </div>

        {/* RIGHT */}
        <div className="profile-right">
          {/* PERSONAL INFO */}
          <div className="profile-card">
            <h3>Información Personal</h3>
            <div className="profile-grid">
              <div>
                <label>Nombre Completo</label>
                <input
                  type="text"
                  name="nombre_completo"
                  value={user.nombre_completo}
                  onChange={handleUserChange}
                />
              </div>
              <div>
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  value={user.correo}
                  disabled
                />
              </div>
              <div>
                <label>Rol</label>
                <input
                  type="text"
                  value={user.rol}
                  disabled
                />
              </div>
              <div>
                <label>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={user.telefono || ""}
                  onChange={handleUserChange}
                  placeholder="+00 000 000 000"
                />
              </div>
            </div>
          </div>

          {/* PASSWORD */}
          <div className="profile-card">
            <h3>Cambio de Contraseña</h3>
            <div className="profile-column">
              <div>
                <label>Contraseña Actual</label>
                <input 
                  type="password" 
                  name="password_actual"
                  value={passwords.password_actual}
                  onChange={handlePasswordChange}
                  placeholder="********"
                />
              </div>
              <div className="profile-grid">
                <div>
                  <label>Nueva Contraseña</label>
                  <input 
                    type="password" 
                    name="password_nuevo"
                    value={passwords.password_nuevo}
                    onChange={handlePasswordChange}
                    placeholder="********"
                  />
                </div>
                <div>
                  <label>Confirmar Nueva Contraseña</label>
                  <input 
                    type="password" 
                    name="confirmar"
                    value={passwords.confirmar}
                    onChange={handlePasswordChange}
                    placeholder="********"
                  />
                </div>
              </div>
            </div>
            <p className="password-hint">
              <Info size={14} />
              La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.
            </p>
          </div>

          {message.text && (
            <div className={`profile-message ${message.type}`}>
              {message.text}
            </div>
          )}

          {/* BUTTON */}
          <button 
            className="save-profile-btn" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
