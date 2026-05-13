import {
  Bell,
  CircleHelp,
  Menu,
  Search,
} from "lucide-react";

import "../Navbar/navbar.css";

function Navbar({
  openSidebar,
  children,
}) {
  return (
    <header className="topbar">
      {/* LEFT */}
      <div className="topbar-left">
        <button
          className="menu-btn"
          onClick={openSidebar}
        >
          <Menu size={20} />
        </button>

        <div className="search-wrapper">
          <Search
            size={16}
            className="search-icon"
          />

          <input
            type="text"
            placeholder="Buscar registros..."
            className="search-input"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="topbar-actions">
        <Bell size={18} />

        <CircleHelp size={18} />

        {/* PROFILE BUTTON */}
        {children}
      </div>
    </header>
  );
}

export default Navbar;