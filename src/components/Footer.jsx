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

        <div className="footer__contact">
          <p className="footer__contact-label">Management — Legend Enterprises</p>
          <a href="mailto:legendenterprises@me.com" className="footer__contact-email">legendenterprises@me.com</a>
          <span className="footer__contact-phone">267-278-9892</span>
        </div>

        <div className="footer__social">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">📷</a>
          <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">🎵</a>
        </div>

        <p className="footer__copy">© {new Date().getFullYear()} Major Johnson. All rights reserved.</p>
      </div>
    </footer>
  );
}
