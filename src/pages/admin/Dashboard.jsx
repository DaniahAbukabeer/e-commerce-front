import { useEffect, useState } from "react";
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
import { api, asNumber, formatDate, normalizeStatus } from "../../api/client";
import { LoadingScreen } from "../../components/LoadingScreen";

const currency = (n) => `$${asNumber(n).toLocaleString()}`;

export const AdminDashboard = () => {
  const [data, setData] = useState({ orders: [], products: [], events: [], subscribers: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.admin.orders(), api.admin.products(), api.admin.events(), api.admin.subscribers()])
      .then(([ordersResponse, productsResponse, eventsResponse, subscribersResponse]) => setData({ orders: ordersResponse.orders, products: productsResponse.products, events: eventsResponse.events, subscribers: subscribersResponse.subscribers }))
        .catch((requestError) => setError(requestError.message))
        .finally(() => setLoading(false));
  }, []);

      if (loading) return <LoadingScreen inline label="Loading dashboard..." />;

  const { orders, products, events, subscribers } = data;
  const revenue = orders
    .filter((order) => normalizeStatus(order.payment) === "paid")
    .reduce((sum, order) => sum + asNumber(order.total), 0);

  const activeSubscribers = subscribers.filter(
    (subscriber) => normalizeStatus(subscriber.status) === "active",
  ).length;
  const upcomingEvents = events.filter((event) => normalizeStatus(event.status) === "upcoming");
  const lowStock = products.filter((p) => p.stock <= p.lowStockThreshold);
  const recentOrders = orders.slice(0, 6);

  return (
    <div>
      {error && <p className="admin-page-sub" role="alert">{error}</p>}
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
                to={`/admin/orders/${o.code}`}
                className="admin-list__row"
              >
                <div style={{ minWidth: 0, flex: "1 1 120px" }}>
                  <p className="admin-cell-title">{o.code}</p>
                  <p className="admin-cell-sub">{o.customerName}</p>
                </div>
                <span className="admin-cell-muted" style={{ fontSize: 12.5 }}>
                  {formatDate(o.createdAt)}
                </span>
                <span
                  style={{ fontWeight: 600, width: 56, textAlign: "right" }}
                >
                  {currency(o.total)}
                </span>
                <div style={{ width: 100, textAlign: "right" }}>
                  <StatusBadge status={normalizeStatus(o.status)} />
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
