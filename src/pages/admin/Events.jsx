import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Users, ChevronRight } from "lucide-react";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { Modal } from "../../components/admin/Modal";
import { Field } from "../../components/admin/Field";
import { api, asNumber, normalizeStatus } from "../../api/client";
import { LoadingScreen } from "../../components/LoadingScreen";

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
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.events().then(({ events: responseEvents }) => setEvents(responseEvents)).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const matchesFilter = filter === "all" || normalizeStatus(e.status) === filter;
      const matchesQuery = !q || e.title.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [events, query, filter]);

  if (loading) return <LoadingScreen inline label="Loading events..." />;

  const addEvent = async (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    try {
      const { event } = await api.admin.createEvent({
        title: draft.title, location: draft.location, price: Number(draft.price),
        totalSeats: Number(draft.totalSeats),
        days: [{ day: draft.day, date: draft.date || "1", month: draft.month || "Oct", slots: draft.time ? [draft.time] : ["10:00am"] }],
      });
      setEvents((prev) => [event, ...prev]);
      setDraft(emptyDraft);
      setModalOpen(false);
    } catch (requestError) { setError(requestError.message); }
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
          className="admin-btn admin-btn--primary text-white!"
        >
          <Plus size={16} />
          New event
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

      <div className="admin-cards-grid">
        {filtered.map((ev) => {
          const pct = Math.round((asNumber(ev.bookedSeats) / ev.totalSeats) * 100);
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
                  status={ev.bookedSeats >= ev.totalSeats ? "full" : normalizeStatus(ev.status)}
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
            <button onClick={addEvent} className="admin-btn admin-btn--primary text-white!">
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
