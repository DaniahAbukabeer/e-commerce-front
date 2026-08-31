import { NavLink } from "react-router-dom";

export const Navbar = ({ scrolled = false }) => {
  return (
    <div className="navbar-float">
      <header className={`navbar-pill${scrolled ? " is-scrolled" : ""}`}>
        {/* landing slot for the flying mascot — MainLayout grows this via id */}
        <span id="mascot-dock" className="mascot-dock" aria-hidden="true" />

        <NavLink to="/" className="brand">
          Área de Arte
        </NavLink>
        <nav className="nav-links" aria-label="Primary">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Shop
          </NavLink>
          <NavLink
            to="/mail-club"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Mail Club
          </NavLink>
        </nav>
      </header>
    </div>
  );
};
