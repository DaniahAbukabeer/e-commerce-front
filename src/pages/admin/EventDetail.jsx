import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Users, Mail, Trash2 } from "lucide-react";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { events } from "../../data/events";
import { registrants as allRegistrants } from "../../data/registrants";

export const AdminEventDetail = () => {
  const { eventId } = useParams();
  const event = events.find((e) => e.slug === eventId);
  const [roster, setRoster] = useState(allRegistrants[eventId] || []);

  if (!event) {
    return (
      <div>
        <p style={{ color: "var(--admin-text-soft)", marginBottom: 12 }}>
          We couldn't find that event.
        </p>
        <Link
          to="/admin/events"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontWeight: 600,
            color: "var(--admin-accent)",
          }}
        >
          <ArrowLeft size={15} /> Back to events
        </Link>
      </div>
    );
  }

  const seatsBooked = roster.reduce((sum, r) => sum + r.seats, 0);
  const removeRegistrant = (id) =>
    setRoster((prev) => prev.filter((r) => r.id !== id));

  return (
    <div>
      <Link
        to="/admin/events"
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
        <ArrowLeft size={15} /> Back to events
      </Link>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <div>
          <p className="admin-event-card__kicker">{event.kicker}</p>
          <h2 style={{ fontSize: 20, marginTop: 2 }}>{event.title}</h2>
          <p
            className="admin-page-sub"
            style={{ marginTop: 6, marginBottom: 0 }}
          >
            {event.location} · {event.duration} · ${event.price}
          </p>
        </div>
        <StatusBadge
          status={seatsBooked >= event.totalSeats ? "full" : event.status}
        />
      </div>

      <div
        className="admin-grid-stats"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        <div className="admin-stat">
          <p className="admin-stat__label">Seats booked</p>
          <p className="admin-stat__value" style={{ marginTop: 8 }}>
            {seatsBooked}/{event.totalSeats}
          </p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">Registrants</p>
          <p className="admin-stat__value" style={{ marginTop: 8 }}>
            {roster.length}
          </p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">Sessions</p>
          <p className="admin-stat__value" style={{ marginTop: 8 }}>
            {event.days.length}
          </p>
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <div className="admin-panel__header">
          <h3 className="admin-panel__title">Sessions</h3>
        </div>
        <div className="admin-chip-row">
          {event.days.map((d) => (
            <div key={`${d.date}-${d.month}`} className="admin-chip">
              <p className="admin-chip__title">
                {d.day} {d.date} {d.month}
              </p>
              <p className="admin-chip__sub">{d.slots.join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__header">
          <h3 className="admin-panel__title">
            <Users size={15} /> Registrants
          </h3>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th className="admin-hide-sm">Session</th>
                <th>Seats</th>
                <th className="admin-hide-md">Payment</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {roster.map((r) => (
                <tr key={r.id}>
                  <td>
                    <p className="admin-cell-title">{r.name}</p>
                    <p className="admin-cell-sub">{r.email}</p>
                  </td>
                  <td className="admin-hide-sm admin-cell-muted">
                    {r.day} · {r.time}
                  </td>
                  <td>{r.seats}</td>
                  <td className="admin-hide-md">
                    <StatusBadge status={r.payment} />
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                      }}
                    >
                      <a
                        href={`mailto:${r.email}`}
                        className="admin-icon-btn"
                        aria-label="Email registrant"
                      >
                        <Mail size={15} />
                      </a>
                      <button
                        onClick={() => removeRegistrant(r.id)}
                        className="admin-icon-btn admin-icon-btn--danger"
                        aria-label="Remove registrant"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {roster.length === 0 && (
                <tr className="admin-empty-row">
                  <td colSpan={5}>No one has booked this event yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
