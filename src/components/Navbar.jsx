import {
  Bell,
  CircleHelp,
  Menu,
} from "lucide-react";

import "../styles/navbar.css";

function Navbar({ openSidebar }) {

  return (

    <header className="topbar">

      <div className="topbar-left">

        <button
          className="menu-btn"
          onClick={openSidebar}
        >
          <Menu size={20} />
        </button>

        <input
          type="text"
          placeholder="Buscar registros..."
          className="search-input"
        />

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