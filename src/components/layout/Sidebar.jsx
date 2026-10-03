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

function Sidebar({ isOpen, onClose }) {
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
          isOpen ? "sidebar-open" : ""
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
          <div className="sidebar-help">
            <HelpCircle size={18} />

            <div>
              <strong>Pusat Bantuan</strong>
              <span>Panduan penggunaan</span>
            </div>
          </div>

          <button
            type="button"
            className="logout-button"
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