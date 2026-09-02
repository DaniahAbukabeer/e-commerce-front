import { useEffect, useState } from "react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  CalendarDays,
  Mail,
  X,
  Palette,
} from "lucide-react";
import "../AdminApp.css";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminTopbar } from "../components/admin/AdminTopbar";

const MOBILE_NAV = [
  { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/stock", label: "Stock", icon: Package },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/mail-club", label: "Mail Club", icon: Mail },
];

const navClass = ({ isActive }) =>
  `admin-nav-link${isActive ? " is-active" : ""}`;

export default function AdminLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  // No real auth yet — swap this for a real session/token check once the
  // API exists. For now it just gates on the flag Login.jsx sets.
  const isAuthed = sessionStorage.getItem("aa-admin-session") === "1";
  if (!isAuthed) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-shell">
      <div className="admin-body">
        <AdminSidebar />

        {mobileNavOpen && (
          <div
            className="admin-drawer-overlay"
            onClick={() => setMobileNavOpen(false)}
          >
            <div className="admin-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="admin-drawer__header">
                <div className="admin-brand" style={{ padding: 0 }}>
                  <span className="admin-brand__icon">
                    <Palette size={16} strokeWidth={2.25} />
                  </span>
                  <div className="admin-brand__text">
                    <strong>Área de Arte</strong>
                  </div>
                </div>
                <button
                  className="admin-icon-btn"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="admin-nav">
                {MOBILE_NAV.map(({ to, end, label, icon: Icon }) => (
                  <NavLink key={to} to={to} end={end} className={navClass}>
                    <Icon size={16} strokeWidth={2} />
                    {label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}

        <div className="admin-content">
          <AdminTopbar onMenuClick={() => setMobileNavOpen(true)} />
          <main className="admin-main">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
