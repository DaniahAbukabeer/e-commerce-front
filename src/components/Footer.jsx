import { mascot } from "../assets/mascot";

export const Footer = () => {
  return (
    <footer className="site-footer">
      <span className="site-footer__badge">
        <img src={mascot.housecall} alt="" className="mascot" />
      </span>
      <small>
        2026 Área de Arte | an art space for looking, making, buying.
      </small>
    </footer>
  );
};