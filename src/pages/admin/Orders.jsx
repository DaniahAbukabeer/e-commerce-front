import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Download, ChevronRight } from "lucide-react";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { orders as allOrders } from "../../data/orders";

const FILTERS = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const currency = (n) => `$${n.toLocaleString()}`;

export const AdminOrders = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    return allOrders.filter((o) => {
      const matchesFilter = filter === "all" || o.status === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

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
                      to={`/admin/orders/${o.id}`}
                      className="admin-cell-title"
                    >
                      {o.id}
                    </Link>
                  </td>
                  <td>
                    <p>{o.customer.name}</p>
                    <p className="admin-cell-sub">{o.customer.email}</p>
                  </td>
                  <td className="admin-hide-sm admin-cell-muted">{o.date}</td>
                  <td className="admin-hide-md">
                    <StatusBadge status={o.payment} />
                  </td>
                  <td>
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="admin-align-right" style={{ fontWeight: 600 }}>
                    {currency(o.total)}
                  </td>
                  <td>
                    <Link
                      to={`/admin/orders/${o.id}`}
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
