import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../QuickActionCard/quickActionCard.css";

function QuickActionCard({ title, action, icon, route, iconClass = "" }) {
  const navigate = useNavigate();

  return (
    <button className="quick-card" onClick={() => navigate(route)}>
      <div className={`quick-icon ${iconClass}`}>
        {icon}
      </div>
      <h3>{title}</h3>
      <span className={`quick-action ${iconClass}`}>
        {action}
        <ArrowRight size={16} />
      </span>
    </button>
  );
}

export default QuickActionCard;