import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__brand">MAJOR<span className="text-red">JOHNSON</span></div>
        <nav className="footer__links">
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/open-mic">Open Mic</Link>
          <Link to="/booking">Booking</Link>
        </nav>
        <p className="footer__copy">© {new Date().getFullYear()} Major Johnson. All rights reserved.</p>
      </div>
    </footer>
  );
}
