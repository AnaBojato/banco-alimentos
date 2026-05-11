import { Gift } from "lucide-react";

function Logo() {
  return (
    <div className="main-logo">
      <div className="main-logo-icon">
        <Gift size={30} />
      </div>

      <h1 className="main-brand">
        The Steward
      </h1>

      <p className="main-subtitle">
        Sistema Inventario Banco Alimentos
      </p>
    </div>
  );
}

export default Logo;