import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Download, ChevronRight } from "lucide-react";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { api, asNumber, formatDate, normalizeStatus } from "../../api/client";
import { LoadingScreen } from "../../components/LoadingScreen";

const FILTERS = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const currency = (n) => `$${asNumber(n).toLocaleString()}`;

export const AdminOrders = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.orders().then(({ orders: responseOrders }) => setOrders(responseOrders)).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesFilter = filter === "all" || normalizeStatus(o.status) === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        o.code.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        (o.customerEmail || "").toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [orders, query, filter]);

  if (loading) return <LoadingScreen inline label="Loading orders..." />;

  return (
    <div>
      <div className="admin-toolbar">
        <div className="admin-search-input">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order, name, or email…"
          />
        </div>
        <button className="admin-btn admin-btn--outline">
          <Download size={15} />
          Export
        </button>
      </div>
      {error && <p className="admin-page-sub" role="alert">{error}</p>}

      <div className="admin-pillbar">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`admin-pill${filter === f ? " is-active" : ""}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th className="admin-hide-sm">Date</th>
                <th className="admin-hide-md">Payment</th>
                <th>Status</th>
                <th className="admin-align-right">Total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link
                      to={`/admin/orders/${o.code}`}
                      className="admin-cell-title"
                    >
                      {o.code}
                    </Link>
                  </td>
                  <td>
                    <p>{o.customerName}</p>
                    <p className="admin-cell-sub">{o.customerEmail}</p>
                  </td>
                  <td className="admin-hide-sm admin-cell-muted">{formatDate(o.createdAt)}</td>
                  <td className="admin-hide-md">
                    <StatusBadge status={normalizeStatus(o.payment)} />
                  </td>
                  <td>
                    <StatusBadge status={normalizeStatus(o.status)} />
                  </td>
                  <td className="admin-align-right" style={{ fontWeight: 600 }}>
                    {currency(o.total)}
                  </td>
                  <td>
                    <Link
                      to={`/admin/orders/${o.code}`}
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <ChevronRight size={16} color="var(--admin-text-faint)" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr className="admin-empty-row">
                  <td colSpan={7}>No orders match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
