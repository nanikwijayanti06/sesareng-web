import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Building2,
  GraduationCap,
  MapPinned,
  Workflow,
  LogOut,
  HelpCircle,
} from "lucide-react";

import { logoutUser } from "../../logic/auth";
import imageMap from "../../assets/imageMap";

function Sidebar({ isOpen, isCollapsed, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`dashboard-sidebar ${
          `${isOpen ? "sidebar-open" : ""} ${isCollapsed ? "sidebar-collapsed" : ""}`
        }`}
      >
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            {imageMap.logoSesareng ? (
              <img
                src={imageMap.logoSesareng}
                alt="Logo Sesareng"
              />
            ) : (
              <span>S</span>
            )}
          </div>

          <div className="sidebar-brand-copy">
            <strong>SESARENG</strong>
            <small>Government Portal</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-section-title">UTAMA</p>

          <NavLink
            to="/dashboard"
            title={isCollapsed ? "Dashboard" : undefined}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
            onClick={onClose}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <p className="sidebar-section-title sidebar-space">
            EKOSISTEM
          </p>

          <NavLink
            to="/umkm"
            title={isCollapsed ? "UMKM" : undefined}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
            onClick={onClose}
          >
            <Store size={18} />
            <span>UMKM</span>
          </NavLink>

          <NavLink
            to="/provider"
            title={isCollapsed ? "Provider" : undefined}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
            onClick={onClose}
          >
            <Building2 size={18} />
            <span>Provider</span>
          </NavLink>

          <NavLink
            to="/universitas"
            title={isCollapsed ? "Perguruan Tinggi" : undefined}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
            onClick={onClose}
          >
            <GraduationCap size={18} />
            <span>Perguruan Tinggi</span>
          </NavLink>

          <NavLink
            to="/map"
            title={isCollapsed ? "Peta Ekosistem" : undefined}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
            onClick={onClose}
          >
            <MapPinned size={18} />
            <span>Peta Ekosistem</span>
          </NavLink>

          <p className="sidebar-section-title sidebar-space">
            PROGRAM
          </p>

          <NavLink
            to="/arpi"
            title={isCollapsed ? "Program ARPI" : undefined}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
            onClick={onClose}
          >
            <Workflow size={18} />
            <span>Program ARPI</span>
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help" title={isCollapsed ? "Pusat Bantuan · Panduan penggunaan" : undefined}>
            <HelpCircle size={18} />

            <div>
              <strong>Pusat Bantuan</strong>
              <span>Panduan penggunaan</span>
            </div>
          </div>

          <button
            type="button"
            className="logout-button"
            title={isCollapsed ? "Keluar" : undefined}
            onClick={handleLogout}
          >
            <LogOut size={17} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;