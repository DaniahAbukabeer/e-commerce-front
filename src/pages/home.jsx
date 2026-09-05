import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { mascot } from "../assets/mascot";
import { api, asNumber } from "../api/client";
import { LoadingScreen } from "../components/LoadingScreen";

export const Home = () => {
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.store.events(), api.store.products()])
      .then(([eventsResponse, productsResponse]) => {
        setEvents(eventsResponse.events.slice(0, 2));
        setProducts(productsResponse.products.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen label="Loading the studio..." />;

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
        {events.map((event) => (
          <Link key={event.slug} to={`/events/${event.slug}`} className="event-card doodle">
            <div className="event-card__date">
              <span className="event-card__day">{event.days[0]?.day}</span>
              <span className="event-card__num">{event.days[0]?.date}</span>
              <span className="event-card__month">{event.days[0]?.month}</span>
            </div>
            <div className="event-card__body">
              <h3>{event.title}</h3>
              <p>{event.location} · {event.duration}</p>
              <div className="event-card__footer">
                <span className="tag tag--on-dark">${asNumber(event.price)}</span>
                <span className="sticky-note sticky-note--on-dark">{event.seatsLeft} spots left</span>
              </div>
            </div>
          </Link>
        ))}
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
        {products.map((product) => (
          <article key={product.id} className="item-card doodle">
            <div className="item-card__media">{product.media}</div>
            <h3>{product.name}</h3>
            <p>{product.category}</p>
            <div className="item-card__footer"><span className="tag">${asNumber(product.price)}</span></div>
          </article>
        ))}
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
