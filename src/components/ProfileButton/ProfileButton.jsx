import "./ProfileButton.css";

import { useState } from "react";

import {
  User,
  LogOut,
} from "lucide-react";

function ProfileButton({
  onProfileClick,
  onLogout,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="profile-dropdown-container">
      {/* PROFILE BUTTON */}
      <button
        className="profile-button"
        onClick={() => setOpen(!open)}
      >
        <div className="profile-button-info">
          <span>Admin Usuario</span>

          <small>Administrador</small>
        </div>

        <img
          src="https://i.pravatar.cc/300"
          alt=""
          className="profile-avatar"
        />
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          className="profile-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* DROPDOWN */}
      {open && (
        <div className="profile-dropdown">
          <button
            className="dropdown-item"
            onClick={() => {
              onProfileClick();
              setOpen(false);
            }}
          >
            <User size={18} />

            Mi Perfil
          </button>

          <button
            className="dropdown-item logout"
            onClick={() => {
              onLogout();
              setOpen(false);
            }}
          >
            <LogOut size={18} />

            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileButton;