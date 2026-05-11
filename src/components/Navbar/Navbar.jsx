import { Bell, CircleHelp, Menu, Search } from "lucide-react";
import "../Navbar/navbar.css";

function Navbar({ openSidebar }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-btn" onClick={openSidebar}>
          <Menu size={20} />
        </button>

        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar registros..."
            className="search-input"
          />
        </div>
      </div>

      <div className="topbar-actions">
        <Bell size={18} />
        <CircleHelp size={18} />
        <img
          src="https://i.pravatar.cc/100"
          alt="avatar"
          className="avatar"
        />
      </div>
    </header>
  );
}

export default Navbar;