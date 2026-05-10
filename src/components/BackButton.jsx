import { ArrowLeft } from "lucide-react";

import { useNavigate } from "react-router-dom";

function BackButton() {

  const navigate = useNavigate();

  return (
    <button
      className="back-button"
      onClick={() => navigate("/")}
    >

      <ArrowLeft size={18} />

      Volver

    </button>
  );
}

export default BackButton;