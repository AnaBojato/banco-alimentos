import "../styles/dashboardCard.css";

function DashboardCard({ title, value, subtitle, icon, badgeClass = "", iconClass = "" }) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-top">
        <div className={`dashboard-card-icon ${iconClass}`}>
          {icon}
        </div>
        <span className={`dashboard-card-badge ${badgeClass}`}>
          {subtitle}
        </span>
      </div>

      <div className="dashboard-card-body">
        <p className="dashboard-card-title">{title}</p>
        <h2 className="dashboard-card-value">{value}</h2>
      </div>
    </div>
  );
}

export default DashboardCard;