import { Shield } from "lucide-react";

function StaffAccess() {
  return (
    <button className="staff-card">

      <div className="staff-info">

        <div>
          <h3 className="staff-title">
            Acceso para Personal
          </h3>

          <p className="staff-subtitle">
            Solo administradores
          </p>
        </div>

        <Shield size={22} className="staff-icon" />

      </div>

    </button>
  );
}

export default StaffAccess;