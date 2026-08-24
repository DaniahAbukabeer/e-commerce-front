import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <section className="page paper-grain" style={{ padding: "40px 24px" }}>
      <div
        className="doodle item-card"
        style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}
      >
        <span className="sticky-note" style={{ alignSelf: "center" }}>
          oops!
        </span>
        <h1 style={{ fontSize: 36 }}>Page not found</h1>
        <p>This one must have fallen off the wall.</p>
        <Link
          to="/"
          className="btn btn-primary doodle doodle-tight"
          style={{ alignSelf: "center", marginTop: 8 }}
        >
          Go back home
        </Link>
      </div>
    </section>
  );
};
