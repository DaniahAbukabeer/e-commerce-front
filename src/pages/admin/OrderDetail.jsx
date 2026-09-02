import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Truck } from "lucide-react";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { orders } from "../../data/orders";

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];
const currency = (n) => `$${n.toLocaleString()}`;

export const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const order = orders.find((o) => o.id === orderId);

  // Local-only status control — wire this up to a real mutation
  // (e.g. `PATCH /api/orders/:id`) once the API exists.
  const [status, setStatus] = useState(order?.status);

  if (!order) {
    return (
      <div>
        <p style={{ color: "var(--admin-text-soft)", marginBottom: 12 }}>
          We couldn't find order "{orderId}".
        </p>
        <Link
          to="/admin/orders"
          className="admin-back-link"
          style={{ display: "inline-flex" }}
        >
          <ArrowLeft size={15} /> Back to orders
        </Link>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <div>
      <Link
        to="/admin/orders"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13.5,
          fontWeight: 500,
          color: "var(--admin-text-soft)",
          marginBottom: 16,
        }}
      >
        <ArrowLeft size={15} /> Back to orders
      </Link>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ fontSize: 20 }}>{order.id}</h2>
          <p className="admin-page-sub" style={{ marginBottom: 0 }}>
            Placed {order.date}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <StatusBadge status={order.payment} />
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="admin-grid-2col">
        <div className="admin-stack">
          <div className="admin-panel">
            <div className="admin-panel__header">
              <h3 className="admin-panel__title">Items</h3>
            </div>
            <div>
              {order.items.map((item) => (
                <div key={item.name} className="admin-list__row">
                  <div style={{ flex: 1 }}>
                    <p className="admin-cell-title">{item.name}</p>
                    <p className="admin-cell-sub">
                      Qty {item.qty} × {currency(item.price)}
                    </p>
                  </div>
                  <span style={{ fontWeight: 600 }}>
                    {currency(item.qty * item.price)}
                  </span>
                </div>
              ))}
            </div>
            <div className="admin-list__row">
              <span className="admin-cell-muted">Subtotal</span>
              <span style={{ marginLeft: "auto", fontWeight: 600 }}>
                {currency(subtotal)}
              </span>
            </div>
            <div className="admin-list__row">
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ marginLeft: "auto", fontWeight: 700 }}>
                {currency(order.total)}
              </span>
            </div>
          </div>

          <div className="admin-panel" style={{ padding: 20 }}>
            <h3 className="admin-panel__title" style={{ marginBottom: 12 }}>
              Update status
            </h3>
            <div className="admin-pillbar" style={{ marginBottom: 0 }}>
              {STATUS_STEPS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`admin-pill${status === s ? " is-active" : ""}`}
                >
                  {s}
                </button>
              ))}
              <button
                onClick={() => setStatus("cancelled")}
                className="admin-pill"
                style={
                  status === "cancelled"
                    ? {
                        background: "#b3261e",
                        color: "#fff",
                        borderColor: "#b3261e",
                      }
                    : { color: "#b3261e", borderColor: "#f3c6c3" }
                }
              >
                Cancel order
              </button>
            </div>
          </div>
        </div>

        <div className="admin-stack">
          <div className="admin-panel" style={{ padding: 20 }}>
            <h3 className="admin-panel__title" style={{ marginBottom: 10 }}>
              Customer
            </h3>
            <p className="admin-cell-title">{order.customer.name}</p>
            <p className="admin-cell-sub" style={{ marginBottom: 10 }}>
              {order.customer.email}
            </p>
            <a
              href={`mailto:${order.customer.email}`}
              className="admin-mail-link"
            >
              <Mail size={13} /> Email customer
            </a>
          </div>

          <div className="admin-panel" style={{ padding: 20 }}>
            <h3 className="admin-panel__title" style={{ marginBottom: 10 }}>
              Fulfillment
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                textTransform: "capitalize",
              }}
            >
              <Truck size={15} color="var(--admin-text-faint)" />
              {order.shipping}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
