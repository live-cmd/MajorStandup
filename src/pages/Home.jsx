import { Link } from 'react-router-dom';
import './PageShell.css';

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="container">
          <p className="section-label">Stand-Up Comedian</p>
          <h1 className="display text-red home-hero__title">Major<br />Johnson</h1>
          <p className="home-hero__sub text-dim">
            [Placeholder] One-line hook about Major's comedy style and what
            makes a show with him worth booking. Replace with real copy.
          </p>
          <div className="home-hero__actions">
            <Link to="/calendar" className="btn btn-red">See Upcoming Shows</Link>
            <Link to="/booking" className="btn btn-outline-white">Book Major</Link>
          </div>
          <div className="placeholder-note">
            Placeholder content — hero copy, photo, and featured clip to be
            replaced with real assets.
          </div>
        </div>
      </section>
    </div>
  );
}
