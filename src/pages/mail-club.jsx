import { useState } from "react";
import { mascot } from "../assets/mascot";
import { api } from "../api/client";

const BENEFITS = [
  {
    mark: "✒",
    title: "A handwritten note",
    body: "Every parcel comes with a note from whoever's in the studio that week no two are the same.",
  },
  {
    mark: "★",
    title: "First dibs",
    body: "New prints and small-batch pieces go to the mail club before they ever hit the shop.",
  },
  {
    mark: "%",
    title: "10% off, always",
    body: "A standing discount across the shop, for as long as you stay subscribed.",
  },
  {
    mark: "✉",
    title: "Member-only openings",
    body: "You'll get first invites to workshops and gallery openings before we post them publicly.",
  },
];

export const MailClub = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.store.subscribe({ name, email });
      setSubscribed(true);
    } catch (requestError) { setError(requestError.message); }
    finally { setSubmitting(false); }
  };

  return (
    <section className="page">
      <div className="mail-club-hero">
        <span className="eyebrow">a little something in the mail</span>
        <h1>The Mail Club</h1>
        <p style={{ fontSize: "1.05rem", color: "var(--brown-soft)" }}>
          A once-a-month envelope from the studio a small print, a scrap of
          whatever we're working on, and a note about what's new. It's part
          newsletter, part care package.
        </p>
      </div>

      <h2 style={{ marginTop: 40 }}>What you get</h2>
      <div className="mail-club-benefits">
        {BENEFITS.map((b) => (
          <div className="mail-club-benefit doodle" key={b.title}>
            <span className="mail-club-benefit__mark">{b.mark}</span>
            <h3>{b.title}</h3>
            <p>{b.body}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Join up</h2>
        <img
          src={mascot.crafting}
          alt=""
          className="mascot section-mascot"
          style={{ width: 48 }}
        />
      </div>
      <div className="mail-club-form doodle" style={{ marginTop: 20 }}>
        {subscribed ? (
          <div className="confirm-note">
            <img src={mascot.yay} alt="" className="mascot" />
            <span className="sticky-note" style={{ fontSize: "1.15rem" }}>
              you're on the list check your inbox for a welcome note
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ color: "var(--brown-soft)" }}>
              $12/month, cancel anytime. First envelope goes out the 1st of next
              month.
            </p>
            <div className="mail-club-form__row">
              <input required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary doodle doodle-tight"
                disabled={submitting}
              >
                {submitting ? "Subscribing..." : "Subscribe $12/mo"}
              </button>
            </div>
            {error && <p style={{ color: "var(--brown-soft)" }} role="alert">{error}</p>}
          </form>
        )}
      </div>
    </section>
  );
};
