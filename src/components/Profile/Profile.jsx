import "./Profile.css";

import { Pencil, Info, Check } from "lucide-react";

function Profile() {
  return (
    <div className="profile-page">
      <div className="profile-top">
        <h1>Mi Perfil</h1>

        <p>
          Gestiona tu información personal y
          configuración de seguridad.
        </p>
      </div>

      <div className="profile-layout">
        {/* LEFT */}
        <div className="profile-user-card">
          <div className="profile-avatar-container">
            <img
              src="https://i.pravatar.cc/200"
              alt=""
              className="profile-avatar"
            />

            <button className="edit-avatar-btn">
              <Pencil size={16} />
            </button>
          </div>

          <h3>Admin Usuario</h3>

          <span>
            Administrador del Sistema
          </span>
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
                  defaultValue="Admin Usuario"
                />
              </div>

              <div>
                <label>Correo Electrónico</label>

                <input
                  type="email"
                  defaultValue="admin@bancoalimentos.org"
                  disabled
                />
              </div>

              <div>
                <label>Rol</label>

                <input
                  type="text"
                  defaultValue="Administrador"
                  disabled
                />
              </div>

              <div>
                <label>Teléfono</label>

                <input
                  type="text"
                  defaultValue="+34 600 000 000"
                />
              </div>
            </div>
          </div>

          {/* PASSWORD */}
          <div className="profile-card">
            <h3>Cambio de Contraseña</h3>

            <div className="profile-column">
              <div>
                <label>
                  Contraseña Actual
                </label>

                <input type="password" />
              </div>

              <div className="profile-grid">
                <div>
                  <label>
                    Nueva Contraseña
                  </label>

                  <input type="password" />
                </div>

                <div>
                  <label>
                    Confirmar Nueva Contraseña
                  </label>

                  <input type="password" />
                </div>
              </div>
            </div>

            <p className="password-hint">
              <Info size={14} />

              La contraseña debe tener al menos
              8 caracteres, una mayúscula y un
              número.
            </p>
          </div>

          {/* BUTTON */}
          <button className="save-profile-btn">
            <Check size={18} />

            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;