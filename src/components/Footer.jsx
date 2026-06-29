import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/.netlify/functions/stay-updated-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Signup failed');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

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

        <div className="footer__stay-updated">
          <p className="footer__contact-label">Stay Updated</p>
          {status === 'success' ? (
            <p className="footer__signup-success">✓ You're on the list.</p>
          ) : (
            <form className="footer__signup-form" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="footer__signup-input"
                aria-label="Email address"
              />
              <button type="submit" className="btn btn-red footer__signup-btn" disabled={status === 'sending'}>
                {status === 'sending' ? '...' : 'Follow Major'}
              </button>
            </form>
          )}
          {status === 'error' && <p className="footer__signup-error">Something went wrong — try again.</p>}
        </div>

        <div className="footer__contact">
          <p className="footer__contact-label">Management — Legend Enterprises</p>
          <a href="mailto:legendenterprises@me.com" className="footer__contact-email">legendenterprises@me.com</a>
          <span className="footer__contact-phone">267-278-9892</span>
        </div>

        <div className="footer__social">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">📷</a>
          <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">🎵</a>
        </div>

        <p className="footer__copy">
          © {new Date().getFullYear()} Major Johnson. All rights reserved.
          {' '}&middot;{' '}
          <Link to="/admin" className="footer__admin-link">Admin</Link>
        </p>
      </div>
    </footer>
  );
}
