import { useMemo, useState } from "react";
import {
  Search,
  Mail,
  Ban,
  Download,
  Users,
  RefreshCcw,
  PauseCircle,
} from "lucide-react";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { StatCard } from "../../components/admin/StatCard";
import { mailClubSubscribers as initialSubscribers } from "../../data/mailClubSubscribers";

const FILTERS = ["all", "active", "paused", "past_due", "cancelled"];

export const AdminMailClub = () => {
  // Local state seeded from static data — swap for a real
  // `GET /api/mail-club/subscribers` fetch when the API exists.
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subscribers.filter((s) => {
      const matchesFilter = filter === "all" || s.status === filter;
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [subscribers, query, filter]);

  const active = subscribers.filter((s) => s.status === "active").length;
  const mrr = active * 12;

  const toggleStatus = (id) => {
    setSubscribers((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "paused" : "active" }
          : s,
      ),
    );
  };

  return (
    <div>
      <div
        className="admin-grid-stats"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        <StatCard label="Active subscribers" value={active} icon={Users} />
        <StatCard
          label="Monthly recurring revenue"
          value={`$${mrr.toLocaleString()}`}
          delta="+8.1%"
          icon={RefreshCcw}
        />
        <StatCard
          label="Paused / past due"
          value={
            subscribers.filter(
              (s) => s.status === "paused" || s.status === "past_due",
            ).length
          }
          icon={PauseCircle}
        />
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-input">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subscribers…"
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
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Subscriber</th>
                <th className="admin-hide-sm">Joined</th>
                <th className="admin-hide-md">Next billing</th>
                <th>Envelopes</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <p className="admin-cell-title">{s.name}</p>
                    <p className="admin-cell-sub">{s.email}</p>
                  </td>
                  <td className="admin-hide-sm admin-cell-muted">
                    {s.joinDate}
                  </td>
                  <td className="admin-hide-md admin-cell-muted">
                    {s.nextBilling}
                  </td>
                  <td>{s.envelopesSent}</td>
                  <td>
                    <StatusBadge status={s.status} />
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
                        href={`mailto:${s.email}`}
                        className="admin-icon-btn"
                        aria-label="Email subscriber"
                      >
                        <Mail size={15} />
                      </a>
                      <button
                        onClick={() => toggleStatus(s.id)}
                        className="admin-icon-btn"
                        aria-label={
                          s.status === "active"
                            ? "Pause subscription"
                            : "Resume subscription"
                        }
                      >
                        <Ban size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr className="admin-empty-row">
                  <td colSpan={6}>No subscribers match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
