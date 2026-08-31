import { Link } from "react-router-dom";
import { mascot } from "../assets/mascot";

export const NotFound = () => {
  return (
    <section className="page paper-grain" style={{ padding: "40px 24px" }}>
      <div
        className="doodle item-card empty-state"
        style={{ maxWidth: 420, margin: "0 auto" }}
      >
        <img src={mascot.wander} alt="" className="mascot" />
        <span className="sticky-note">oops!</span>
        <h1 style={{ fontSize: 36 }}>Page not found</h1>
        <p>This one must have wandered off the wall.</p>
        <Link
          to="/"
          className="btn btn-primary doodle doodle-tight"
          style={{ marginTop: 8 }}
        >
          Go back home
        </Link>
      </div>
    </section>
  );
};