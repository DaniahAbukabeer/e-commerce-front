import { NavLink } from 'react-router-dom'

export const Navbar = () => {
  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        Fatima Store
      </NavLink>
      <nav className="nav-links" aria-label="Primary">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/shop"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          Shop
        </NavLink>
      </nav>
    </header>
  )
}
