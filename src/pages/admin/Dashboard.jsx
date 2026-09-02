import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  CalendarDays,
  Mail,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { StatCard } from "../../components/admin/StatCard";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { orders } from "../../data/orders";
import { products } from "../../data/products";
import { events } from "../../data/events";
import { mailClubSubscribers } from "../../data/mailClubSubscribers";

const currency = (n) => `$${n.toLocaleString()}`;

export const AdminDashboard = () => {
  const revenue = orders
    .filter((o) => o.payment === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  const activeSubscribers = mailClubSubscribers.filter(
    (s) => s.status === "active",
  ).length;
  const upcomingEvents = events.filter((e) => e.status === "upcoming");
  const lowStock = products.filter((p) => p.stock <= p.lowStockThreshold);
  const recentOrders = orders.slice(0, 6);

  return (
    <div>
      <div className="admin-grid-stats">
        <StatCard
          label="Revenue (paid)"
          value={currency(revenue)}
          delta="+12.4%"
          icon={ShoppingBag}
        />
        <StatCard
          label="Open orders"
          value={
            orders.filter(
              (o) => o.status !== "delivered" && o.status !== "cancelled",
            ).length
          }
          delta="+3"
          icon={Package}
        />
        <StatCard
          label="Upcoming events"
          value={upcomingEvents.length}
          icon={CalendarDays}
        />
        <StatCard
          label="Mail Club subscribers"
          value={activeSubscribers}
          delta="+5"
          icon={Mail}
        />
      </div>

      <div className="admin-grid-2col">
        <div className="admin-panel">
          <div className="admin-panel__header">
            <h2 className="admin-panel__title">Recent orders</h2>
            <Link to="/admin/orders" className="admin-panel__link">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div>
            {recentOrders.map((o) => (
              <Link
                key={o.id}
                to={`/admin/orders/${o.id}`}
                className="admin-list__row"
              >
                <div style={{ minWidth: 0, flex: "1 1 120px" }}>
                  <p className="admin-cell-title">{o.id}</p>
                  <p className="admin-cell-sub">{o.customer.name}</p>
                </div>
                <span className="admin-cell-muted" style={{ fontSize: 12.5 }}>
                  {o.date}
                </span>
                <span
                  style={{ fontWeight: 600, width: 56, textAlign: "right" }}
                >
                  {currency(o.total)}
                </span>
                <div style={{ width: 100, textAlign: "right" }}>
                  <StatusBadge status={o.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="admin-stack">
          <div className="admin-panel">
            <div className="admin-panel__header">
              <h2 className="admin-panel__title">Low stock</h2>
              <Link to="/admin/stock" className="admin-panel__link">
                Manage <ArrowRight size={13} />
              </Link>
            </div>
            <div>
              {lowStock.length === 0 && (
                <p className="admin-list__empty">Everything is well stocked.</p>
              )}
              {lowStock.map((p) => (
                <div key={p.id} className="admin-list__row">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p className="admin-cell-title">{p.name}</p>
                    <p className="admin-cell-sub">{p.sku}</p>
                  </div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#93650a",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <AlertTriangle size={13} />
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel__header">
              <h2 className="admin-panel__title">Upcoming events</h2>
              <Link to="/admin/events" className="admin-panel__link">
                Manage <ArrowRight size={13} />
              </Link>
            </div>
            <div>
              {upcomingEvents.map((e) => (
                <Link
                  key={e.id}
                  to={`/admin/events/${e.slug}`}
                  className="admin-list__row"
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p className="admin-cell-title">{e.title}</p>
                    <p className="admin-cell-sub">
                      {e.days[0].day} {e.days[0].date} {e.days[0].month}
                    </p>
                  </div>
                  <span
                    className="admin-cell-muted"
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {e.bookedSeats}/{e.totalSeats} seats
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
