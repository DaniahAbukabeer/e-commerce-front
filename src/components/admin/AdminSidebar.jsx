import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  CalendarDays,
  Mail,
  Store,
  ArrowLeft,
  LogOut,
  Palette,
} from "lucide-react";
import { useAdminAuth } from "../../auth/AdminAuth";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Sales",
    items: [
      { to: "/admin/pos", label: "Point of Sale", icon: Store },
      { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { to: "/admin/stock", label: "Stock", icon: Package },
    ],
  },
  {
    label: "Programming",
    items: [
      { to: "/admin/events", label: "Events", icon: CalendarDays },
      { to: "/admin/mail-club", label: "Mail Club", icon: Mail },
    ],
  },
];

const navClass = ({ isActive }) =>
  `admin-nav-link${isActive ? " is-active" : ""}`;

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <span className="admin-brand__icon">
          <Palette size={16} strokeWidth={2.25} />
        </span>
        <div className="admin-brand__text">
          <strong>Área de Arte</strong>
          <span>Studio admin</span>
        </div>
      </div>

      <nav className="admin-nav">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="admin-nav-group">
            <p className="admin-nav-group__label">{group.label}</p>
            {group.items.map(({ to, end, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={end} className={navClass}>
                <Icon size={16} strokeWidth={2} />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <a href="/" className="admin-back-link">
          <ArrowLeft size={16} strokeWidth={2} />
          Back to site
        </a>
        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={16} strokeWidth={2} />
          Log out
        </button>
      </div>
    </aside>
  );
};
