import { Link } from "react-router-dom";
import { mascot } from "../assets/mascot";

export const Footer = () => {
  return (
    <footer className="site-footer">
      <span className="footer-background-text"> Área de Arte </span>

      <nav className="site-footer__links" aria-label="Footer">
        <div className="site-footer__col">
          <h3 className="site-footer__heading">Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/mail-club">Mail Club</Link>
        </div>
        <div className="site-footer__col">
          <h3 className="site-footer__heading">Legal</h3>
          <a href="#">Privacy Policy</a>
        </div>
        <div className="site-footer__col">
          <h3 className="site-footer__heading">Payments</h3>
          <span>Visa</span>
          <span>Cliq</span>
          <span>Apple Pay</span>
          <span>Cash</span>

        </div>
      </nav>

      <span className="site-footer__badge">
        <img src={mascot.housecall} alt="" className="mascot" />
      </span>

      <small>
        2026 Área de Arte | an art space for looking, making, buying.
      </small>
    </footer>
  );
};