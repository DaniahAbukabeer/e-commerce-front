import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Users, ChevronRight } from "lucide-react";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { Modal } from "../../components/admin/Modal";
import { Field } from "../../components/admin/Field";
import { events as initialEvents } from "../../data/events";

const FILTERS = ["all", "upcoming", "draft", "past"];
const emptyDraft = {
  title: "",
  location: "Studio downstairs",
  price: "",
  totalSeats: "",
  date: "",
  month: "",
  day: "Sat",
  time: "",
};

export const AdminEvents = () => {
  // Local state seeded from static data — swap for `GET /api/events` later.
  const [events, setEvents] = useState(initialEvents);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const matchesFilter = filter === "all" || e.status === filter;
      const matchesQuery = !q || e.title.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [events, query, filter]);

  const addEvent = (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    const slug = draft.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setEvents((prev) => [
      {
        id: `evt_${Date.now()}`,
        slug: slug || `event-${Date.now()}`,
        title: draft.title,
        kicker: "workshop",
        location: draft.location,
        duration: "2 hours",
        price: Number(draft.price) || 0,
        status: "draft",
        totalSeats: Number(draft.totalSeats) || 10,
        bookedSeats: 0,
        days: [
          {
            day: draft.day,
            date: draft.date || "1",
            month: draft.month || "Oct",
            slots: draft.time ? [draft.time] : ["10:00am"],
          },
        ],
      },
      ...prev,
    ]);
    setDraft(emptyDraft);
    setModalOpen(false);
  };

  return (
    <div>
      <div className="admin-toolbar">
        <div className="admin-search-input">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events…"
          />
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="admin-btn admin-btn--primary"
        >
          <Plus size={16} />
          New event
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

      <div className="admin-cards-grid">
        {filtered.map((ev) => {
          const pct = Math.round((ev.bookedSeats / ev.totalSeats) * 100);
          return (
            <Link
              key={ev.id}
              to={`/admin/events/${ev.slug}`}
              className="admin-event-card"
            >
              <div className="admin-event-card__top">
                <div>
                  <p className="admin-event-card__kicker">{ev.kicker}</p>
                  <h3 className="admin-event-card__title">{ev.title}</h3>
                </div>
                <ChevronRight
                  size={16}
                  color="var(--admin-text-faint)"
                  style={{ marginTop: 3, flexShrink: 0 }}
                />
              </div>

              <p className="admin-event-card__meta">
                {ev.days[0].day} {ev.days[0].date} {ev.days[0].month} ·{" "}
                {ev.location}
              </p>

              <div className="admin-event-card__row">
                <StatusBadge
                  status={ev.bookedSeats >= ev.totalSeats ? "full" : ev.status}
                />
                <span className="admin-event-card__price">${ev.price}</span>
              </div>

              <div>
                <div className="admin-progress-label">
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Users size={12} /> {ev.bookedSeats}/{ev.totalSeats} seats
                  </span>
                  <span>{pct}%</span>
                </div>
                <div className="admin-progress">
                  <div
                    className="admin-progress__bar"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <p className="admin-list__empty" style={{ gridColumn: "1 / -1" }}>
            No events match your search.
          </p>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New event"
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="admin-btn admin-btn--outline"
            >
              Cancel
            </button>
            <button onClick={addEvent} className="admin-btn admin-btn--primary">
              Create event
            </button>
          </>
        }
      >
        <form onSubmit={addEvent}>
          <Field label="Event title">
            <input
              className="admin-input"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="e.g. Botanical Watercolor Night"
              required
            />
          </Field>
          <Field label="Location">
            <input
              className="admin-input"
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            />
          </Field>
          <div className="admin-field-row">
            <Field label="Price (USD)">
              <input
                type="number"
                min="0"
                className="admin-input"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                placeholder="40"
              />
            </Field>
            <Field label="Total seats">
              <input
                type="number"
                min="1"
                className="admin-input"
                value={draft.totalSeats}
                onChange={(e) =>
                  setDraft({ ...draft, totalSeats: e.target.value })
                }
                placeholder="12"
              />
            </Field>
          </div>
          <div className="admin-field-row admin-field-row--3">
            <Field label="Day">
              <input
                className="admin-input"
                value={draft.day}
                onChange={(e) => setDraft({ ...draft, day: e.target.value })}
                placeholder="Sat"
              />
            </Field>
            <Field label="Date">
              <input
                className="admin-input"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                placeholder="19"
              />
            </Field>
            <Field label="Month">
              <input
                className="admin-input"
                value={draft.month}
                onChange={(e) => setDraft({ ...draft, month: e.target.value })}
                placeholder="Sep"
              />
            </Field>
          </div>
          <Field label="First time slot">
            <input
              className="admin-input"
              value={draft.time}
              onChange={(e) => setDraft({ ...draft, time: e.target.value })}
              placeholder="10:00am"
            />
          </Field>
        </form>
      </Modal>
    </div>
  );
};
