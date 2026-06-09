import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Menu } from "lucide-react";

import Sidebar from "../../components/Sidebar/Sidebar";
import MobileSidebar from "../../components/MobileSideBar/MobileSidebar";
import ProfileButton from "../../components/ProfileButton/ProfileButton";
import Profile from "../../components/Profile/Profile";
import { logoutService } from "../../services/authService";

import "../ProfilePage/profilePage.css";

function ProfilePage() {
  const navigate = useNavigate();

  const [activeNav, setActiveNav] =
    useState("perfil");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="profile-dashboard">
      {/* DESKTOP SIDEBAR */}
      <div className="desktop-sidebar">
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
        />
      </div>

      {/* MOBILE SIDEBAR */}
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* MAIN CONTENT */}
      <main className="profile-main-content">
        {/* TOP NAVBAR */}
        <header className="profile-header-navbar">
          <div className="profile-header-left">
            <button
              className="menu-btn"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              <Menu size={24} />
            </button>

            <h2>
              Sistema de Inventario
            </h2>
          </div>

          {/* PROFILE DROPDOWN */}
          <ProfileButton
            onProfileClick={() =>
              navigate("/profile")
            }
            onLogout={() => {
              logoutService();
              navigate("/login");
            }}
          />
        </header>

        {/* PROFILE CONTENT */}
        <Profile />
      </main>
    </div>
  );
}

export default ProfilePage;