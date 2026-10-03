import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  ShieldCheck,
  Store,
  UserRound,
  WalletCards,
} from "lucide-react";
import AdminDialog from "../common/AdminDialog";
import { getCurrentUser, logoutUser } from "../../logic/auth";
import "../../styles/dashboard.css";

const initialNotifications = [
  { id: "assessment", title: "Assessment menunggu validasi", description: "2 assessment perlu ditinjau admin.", time: "5 menit lalu", icon: ClipboardCheck, route: "/arpi?stage=diagnose", read: false },
  { id: "match", title: "Match menunggu approval", description: "Bakpia Kencana · Basic Digital Inventory.", time: "18 menit lalu", icon: ShieldCheck, route: "/arpi?stage=match", read: false },
  { id: "verify", title: "Verify perlu ditinjau", description: "2 outcome belum memenuhi target.", time: "35 menit lalu", icon: Check, route: "/arpi?stage=verify", read: false },
  { id: "provider", title: "Provider perlu verifikasi", description: "Gmedia · status akreditasi perlu dicek.", time: "1 jam lalu", icon: Store, route: "/provider", read: false },
  { id: "voucher", title: "Voucher mendekati batas penggunaan", description: "Alokasi produktivitas Bakpia Kencana.", time: "2 jam lalu", icon: WalletCards, route: "/arpi?stage=enable", read: false },
];

function Navbar({ onMenuClick, onToggleSidebar, isSidebarCollapsed }) {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [dialog, setDialog] = useState("");
  const [compactMode, setCompactMode] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const unreadCount = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false);
      if (!notificationRef.current?.contains(event.target)) setNotificationsOpen(false);
    };
    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const openNotification = (notification) => {
    setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, read: true } : item));
    setNotificationsOpen(false);
    navigate(notification.route);
  };

  const submitSearch = (event) => {
    if (event.key === "Enter" && search.trim()) navigate(`/umkm?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      <header className={`dashboard-navbar${compactMode ? " navbar-compact" : ""}`}>
        <div className="navbar-left">
          <button aria-label="Buka navigasi mobile" className="mobile-menu-button" onClick={onMenuClick} type="button"><Menu size={20} /></button>
          <button aria-label={isSidebarCollapsed ? "Perluas sidebar" : "Ciutkan sidebar"} className="sidebar-toggle-button" onClick={onToggleSidebar} title={isSidebarCollapsed ? "Perluas sidebar" : "Ciutkan sidebar"} type="button">
            {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
          <div className="navbar-heading-copy"><h2>Dashboard</h2><p>Regional AI Hub · Kabupaten Sleman</p></div>
        </div>

        <div className="navbar-right">
          <label className="navbar-search"><Search size={16} /><input aria-label="Pencarian global" onChange={(event) => setSearch(event.target.value)} onKeyDown={submitSearch} placeholder="Cari UMKM, provider, mitra..." value={search} /></label>
          <div className="navbar-menu-anchor" ref={notificationRef}>
            <button aria-expanded={notificationsOpen} aria-label={`Notifikasi, ${unreadCount} belum dibaca`} className="notification-button" onClick={() => { setNotificationsOpen((current) => !current); setProfileOpen(false); }} type="button">
              <Bell size={17} />{unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            {notificationsOpen && <div className="navbar-dropdown notification-dropdown">
              <div className="navbar-dropdown-heading"><div><strong>Notifikasi</strong><span>{unreadCount} belum dibaca</span></div><button onClick={() => setNotifications((current) => current.map((item) => ({ ...item, read: true })))} type="button">Tandai semua dibaca</button></div>
              <div className="notification-list">
                {notifications.map(({ id, title, description, time, icon: Icon, route, read }) => (
                  <button className={`notification-item${read ? " is-read" : ""}`} key={id} onClick={() => openNotification({ id, route })} type="button">
                    <span className="notification-item-icon"><Icon size={15} /></span>
                    <span className="notification-item-copy"><strong>{title}</strong><span>{description}</span><small>{time}</small></span>
                    {!read && <i className="notification-unread-dot" />}
                  </button>
                ))}
              </div>
              <button className="notification-see-all" onClick={() => { setNotificationsOpen(false); navigate("/dashboard#activity-panel"); }} type="button">Lihat semua aktivitas</button>
            </div>}
          </div>

          <div className="navbar-menu-anchor" ref={profileRef}>
            <button aria-expanded={profileOpen} className="navbar-profile" onClick={() => { setProfileOpen((current) => !current); setNotificationsOpen(false); }} type="button">
              <span className="profile-avatar">{user?.profilePhoto ? <img alt="" src={user.profilePhoto} /> : "AP"}</span>
              <span className="profile-copy"><strong>{user?.name || "Admin Pemerintah"}</strong><span>{user?.agency || "Pemerintah Kabupaten Sleman"}</span></span>
              <ChevronDown size={15} className="profile-arrow" />
            </button>
            {profileOpen && <div className="navbar-dropdown profile-dropdown">
              <div className="profile-dropdown-identity"><span className="profile-avatar">AP</span><div><strong>{user?.name || "Admin Pemerintah"}</strong><small>{user?.agency || "Pemerintah Kabupaten Sleman"}</small></div></div>
              <button onClick={() => { setDialog("profile"); setProfileOpen(false); }} type="button"><UserRound size={15} /> Profil Admin</button>
              <button onClick={() => { setDialog("settings"); setProfileOpen(false); }} type="button"><Settings size={15} /> Pengaturan</button>
              <button onClick={() => { setDialog("help"); setProfileOpen(false); }} type="button"><CircleHelp size={15} /> Bantuan</button>
              <button className="is-danger" onClick={handleLogout} type="button"><LogOut size={15} /> Keluar</button>
            </div>}
          </div>
        </div>
      </header>

      <AdminDialog open={Boolean(dialog)} onClose={() => setDialog("")} title={dialog === "profile" ? "Profil Admin" : dialog === "settings" ? "Pengaturan" : "Bantuan"}>
        {dialog === "profile" && <div className="admin-detail-grid"><div className="admin-detail-item"><span>Nama</span><strong>{user?.name || "Admin Pemerintah"}</strong></div><div className="admin-detail-item"><span>Instansi</span><strong>{user?.agency || "Pemerintah Kabupaten Sleman"}</strong></div><div className="admin-detail-item"><span>Role</span><strong>Admin Regional AI Hub</strong></div></div>}
        {dialog === "settings" && <label className="navbar-setting-toggle"><input checked={compactMode} onChange={(event) => setCompactMode(event.target.checked)} type="checkbox" /> Gunakan navbar ringkas</label>}
        {dialog === "help" && <p className="admin-confirm-copy">Hubungi administrator Regional AI Hub Kabupaten Sleman untuk bantuan akses, validasi data, dan pengelolaan mitra.</p>}
      </AdminDialog>
    </>
  );
}

export default Navbar;
