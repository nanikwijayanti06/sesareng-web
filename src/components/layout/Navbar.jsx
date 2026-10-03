import {
  Menu,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

import { getCurrentUser } from "../../logic/auth";

function Navbar({ onMenuClick }) {
  const user = getCurrentUser();

  return (
    <header className="dashboard-navbar">
      <div className="navbar-left">
        <button
          className="mobile-menu-button"
          onClick={onMenuClick}
          type="button"
        >
          <Menu size={21} />
        </button>

        <div>
          <h2>Dashboard</h2>
          <p>
            Ringkasan ekosistem produktivitas daerah
          </p>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-search">
          <Search size={16} />

          <input
            type="text"
            placeholder="Cari UMKM, provider, mitra..."
          />
        </div>

        <button
          className="notification-button"
          type="button"
        >
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>

        <div className="navbar-profile">
          <div className="profile-avatar">
            AP
          </div>

          <div className="profile-copy">
            <strong>
              {user?.name || "Admin Pemerintah"}
            </strong>

            <span>
              {user?.agency ||
                "Pemerintah Daerah"}
            </span>
          </div>

          <ChevronDown
            size={15}
            className="profile-arrow"
          />
        </div>
      </div>
    </header>
  );
}

export default Navbar;