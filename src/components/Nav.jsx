import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Nav.css';

const LOGO = 'https://psxvjiuufwwcqrkdpueh.supabase.co/storage/v1/object/public/afterdark-media/major/major%20logo.png';

const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/portfolio',  label: 'Portfolio' },
  { to: '/calendar',   label: 'Calendar' },
  { to: '/open-mic',   label: 'Open Mic' },
  { to: '/booking',    label: 'Booking' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}${menuOpen ? ' nav--open' : ''}`}>
      <div className="nav__inner">
        <Link to="/" className="nav__logo">
          <img src={LOGO} alt="M.A.J.O.R" className="nav__logo-img" />
        </Link>

        <nav className="nav__links" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}
              end={to === '/'}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <Link to="/booking" className="btn btn-red nav__cta">Book Major</Link>

        <button
          className="nav__hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className="nav__mobile" aria-hidden={!menuOpen}>
        <nav className="nav__mobile-links">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav__mobile-link${isActive ? ' nav__mobile-link--active' : ''}`}
              end={to === '/'}
            >
              {label}
            </NavLink>
          ))}
          <Link to="/booking" className="btn btn-red nav__mobile-cta">Book Major</Link>
        </nav>
      </div>
    </header>
  );
}
