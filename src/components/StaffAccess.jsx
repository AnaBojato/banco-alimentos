import { Shield } from "lucide-react";

import { useNavigate } from "react-router-dom";

function StaffAccess() {

  const navigate = useNavigate();

  return (
    <div
      className="staff-card"
      onClick={() => navigate("/login")}
    >

      <div className="staff-info">

        <div>

          <h3 className="staff-title">
            Acceso para Personal
          </h3>

          <p className="staff-subtitle">
            Solo administradores
          </p>

        </div>

        <Shield
          size={22}
          className="staff-icon"
        />

      </div>

    </div>
  );
}

export default StaffAccess;