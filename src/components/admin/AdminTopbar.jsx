import { useLocation } from "react-router-dom";
import { Bell, Search, Menu } from "lucide-react";
import { mascot } from "../../assets/mascot";
import { useAdminAuth } from "../../auth/AdminAuth";

const TITLES = [
  { match: /^\/admin\/pos/, title: "Point of Sale" },
  { match: /^\/admin\/orders/, title: "Orders" },
  { match: /^\/admin\/stock/, title: "Stock" },
  { match: /^\/admin\/events/, title: "Events" },
  { match: /^\/admin\/mail-club/, title: "Mail Club" },
  { match: /^\/admin\/?$/, title: "Dashboard" },
];

export const AdminTopbar = ({ onMenuClick }) => {
  const { pathname } = useLocation();
  const { user } = useAdminAuth();
  const title = TITLES.find((t) => t.match.test(pathname))?.title ?? "Dashboard";

  return (
    <header className="admin-topbar">
      <button className="admin-topbar__menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={20} />
      </button>

      <h1 className="admin-topbar__title">{title}</h1>

      <div className="admin-search">
        <Search size={16} />
        <input type="search" placeholder="Search…" />
      </div>

      <button className="admin-bell" aria-label="Notifications">
        <Bell size={19} />
        <span className="admin-bell__dot" />
      </button>

      <div className="admin-user">
        <img src={mascot.hello} alt="" />
        <div className="admin-user__meta">
          <p className="admin-user__name">{user?.name}</p>
          <p className="admin-user__role">{user?.role?.toLowerCase()}</p>
        </div>
      </div>
    </header>
  );
};