import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <section className="page">
      <div className="hero">
        <span className="eyebrow">psst — new show up now</span>
        <h1>
          A little <span className="scribble-underline">store</span>
          <br />
          for a lot of art.
        </h1>
        <p>
          Prints, pots, and one-offs made in the studio downstairs — plus a
          running calendar of workshops and openings happening in the space.
        </p>

        <div
          style={{ marginTop: 8, display: "flex", gap: 14, flexWrap: "wrap" }}
        >
          <a href="/shop" className="btn btn-primary doodle doodle-tight">
            Browse the shop
          </a>
          <a href="#" className="btn btn-outline doodle doodle-tight">
            See what's on
          </a>
        </div>
      </div>

      <h2 style={{ marginTop: 24 }}>From the studio</h2>
      <div className="card-grid">
        <article className="item-card doodle">
          <div className="item-card__media">hand-thrown</div>
          <h3>Speckled Mug</h3>
          <p>Wheel-thrown stoneware, dipped in a warm oatmeal glaze.</p>
          <div className="item-card__footer">
            <span className="tag">$28</span>
            <span className="sticky-note">new</span>
          </div>
        </article>

        <article className="item-card doodle">
          <div className="item-card__media">risograph</div>
          <h3>Sunday Market Print</h3>
          <p>Two-colour riso print, edition of 50, signed on the back.</p>
          <div className="item-card__footer">
            <span className="tag">$18</span>
          </div>
        </article>

        <Link
          to="/events/linocut-workshop"
          className="item-card doodle"
          style={{ textDecoration: "none" }}
        >
          <div className="item-card__media">Sat · 11am</div>
          <h3>Linocut Workshop</h3>
          <p>A beginner-friendly Saturday session, all materials included.</p>
          <div className="item-card__footer">
            <span className="tag">$45</span>
            <span className="sticky-note">3 spots left</span>
          </div>
        </Link>

        <Link
          to="/events/ceramics-open-studio"
          className="item-card doodle"
          style={{ textDecoration: "none" }}
        >
          <div className="item-card__media">Sun · 12pm</div>
          <h3>Ceramics Open Studio</h3>
          <p>Wheel time and glazing, self-directed, staff potter on hand.</p>
          <div className="item-card__footer">
            <span className="tag">$38</span>
            <span className="sticky-note">5 spots left</span>
          </div>
        </Link>
      </div>
    </section>
  );
};
