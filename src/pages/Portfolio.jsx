import ScrollReveal from '../components/ScrollReveal';
import { Link } from 'react-router-dom';
import './PageShell.css';
import './Portfolio.css';

const SUPABASE = (path) =>
  `https://psxvjiuufwwcqrkdpueh.supabase.co/storage/v1/object/public/afterdark-media/major/${path}`;

const PHOTOS = [
  { src: SUPABASE('Major_black-red.heic'), alt: 'Major Johnson — performance shot' },
  { src: SUPABASE('Major-big-smile.heic'), alt: 'Major Johnson — connecting with the crowd' },
  { src: SUPABASE('Major-black-gold.heic'), alt: 'Major Johnson — headliner set' },
];

export default function Portfolio() {
  return (
    <div className="portfolio-page">
      <section className="page-hero">
        <div className="container">
          <ScrollReveal>
            <p className="section-label">My Work</p>
            <h1 className="display text-red glow-text page-hero__title">Portfolio</h1>
            <p className="page-hero__sub text-dim">
              Experienced in every role — host, opener, feature, headliner.
              Celebrity judge for talent competitions. Any stage: comedy clubs,
              promoter shows, corporate events, cruises.
            </p>
            <p className="page-hero__sub text-dim">
              Bookers and promoters, contact my management team below.
              Supporters, join <em>The Major League</em> — follow me on socials
              or sign up for the mailing list in the footer.
            </p>
            <div style={{ marginTop: '24px' }}>
              <Link to="/booking" className="btn btn-red">Book Major</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ScrollReveal>
            <p className="section-label">Press Photos</p>
            <span className="red-line" />
          </ScrollReveal>
          <div className="portfolio-grid">
            {PHOTOS.map((photo, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="portfolio-photo">
                  <img src={photo.src} alt={photo.alt} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="container">
          <ScrollReveal>
            <p className="section-label">Performance Clips</p>
            <span className="red-line" />
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: '12px' }}>Watch Major Work</h2>
            <p className="text-dim" style={{ maxWidth: '560px' }}>
              Performance clips coming soon — full sets, features, and
              highlight reels from stages across the Mid-Atlantic.
            </p>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
