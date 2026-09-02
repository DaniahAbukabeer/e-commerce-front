import { Link } from "react-router-dom";
import { mascot } from "../assets/mascot";

export const Home = () => {
  return (
    <section className="page">
      <div className="hero">
        <div className="hero-copy">
          <span className="eyebrow">psst new show up now</span>
          <h1>
            A little <span className="scribble-underline">studio</span>
            <br />
            for a lot of art.
          </h1>
          <p>
            Prints, pots, and one-offs made in the studio downstairs plus a
            running calendar of workshops and openings happening in the space.
          </p>

          <div
            style={{ marginTop: 8, display: "flex", gap: 14, flexWrap: "wrap" }}
          >
            <a href="/shop" className="btn btn-primary doodle doodle-tight">
              Browse the shop
            </a>
            <a href="#events" className="btn btn-outline doodle doodle-tight">
              See what's on
            </a>
          </div>
        </div>

        <div className="hero-collage">
          <div className="hero-collage__scrap" />
          <img
            src={mascot.hello}
            alt="The Área de Arte mascot, waving hello"
            id="hero-mascot-anchor"
            className="mascot hero-collage__mascot"
          />
          <span className="tag hero-collage__tag">est. studio</span>
        </div>
      </div>

      <div className="section-head" id="events">
        <div>
          <h2>Upcoming events</h2>
          <p className="section-sub">
            Workshops and open studio sessions pick a date, grab a seat.
          </p>
        </div>
      </div>
      <div className="event-grid">
        <Link to="/events/linocut-workshop" className="event-card doodle">
          <div className="event-card__date">
            <span className="event-card__day">Sat</span>
            <span className="event-card__num">29</span>
            <span className="event-card__month">Aug</span>
          </div>
          <div className="event-card__body">
            <h3>Linocut Workshop</h3>
            <p>
              Carve, ink, and pull your first print all materials included.
            </p>
            <div className="event-card__footer">
              <span className="tag tag--on-dark">$45</span>
              <span className="sticky-note sticky-note--on-dark">
                3 spots left
              </span>
            </div>
          </div>
        </Link>

        <Link to="/events/ceramics-open-studio" className="event-card doodle">
          <div className="event-card__date">
            <span className="event-card__day">Sun</span>
            <span className="event-card__num">30</span>
            <span className="event-card__month">Aug</span>
          </div>
          <div className="event-card__body">
            <h3>Ceramics Open Studio</h3>
            <p>Wheel time and glazing, self-directed, staff potter on hand.</p>
            <div className="event-card__footer">
              <span className="tag tag--on-dark">$38</span>
              <span className="sticky-note sticky-note--on-dark">
                5 spots left
              </span>
            </div>
          </div>
        </Link>
      </div>

      <div className="section-head">
        <div>
          <h2>From the studio</h2>
          <p className="section-sub">
            Prints, pots, and small-batch pieces ready to take home.
          </p>
        </div>
        <Link to="/shop" className="section-link">
          Shop all →
        </Link>
      </div>
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

        <article className="item-card doodle">
          <div className="item-card__media">hand-thrown</div>
          <h3>Clay Bud Vase</h3>
          <p>Small enough for one stem, or three.</p>
          <div className="item-card__footer">
            <span className="tag">$22</span>
          </div>
        </article>
      </div>

      <Link to="/mail-club" className="mail-club-band doodle">
        <div className="mail-club-band__text">
          <span className="eyebrow">✉ once a month</span>
          <h2>Join the Mail Club</h2>
          <p>
            A little envelope from the studio a small print, a note, and first
            dibs on what's new.
          </p>
        </div>
        <span className="btn btn-outline doodle-tight">Learn more</span>
      </Link>
    </section>
  );
};
