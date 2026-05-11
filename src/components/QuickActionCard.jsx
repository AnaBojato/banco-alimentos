import { ArrowRight } from "lucide-react";

import { useNavigate } from "react-router-dom";

import "../styles/quickActionCard.css";

function QuickActionCard({
  title,
  description,
  action,
  icon,
  route,
}) {

  const navigate = useNavigate();

  return (

    <button
      className="quick-card"
      onClick={() => navigate(route)}
    >

      <div className="quick-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

      <span className="quick-action">

        {action}

        <ArrowRight size={16} />

      </span>

    </button>

  );
}

export default QuickActionCard;