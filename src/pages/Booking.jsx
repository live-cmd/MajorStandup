import './PageShell.css';

const SUPABASE = (path) =>
  `https://psxvjiuufwwcqrkdpueh.supabase.co/storage/v1/object/public/afterdark-media/major/${path}`;

export default function Booking() {
  return (
    <div className="booking-page">
      <section className="page-hero page-hero--with-photo">
        <div className="container page-hero__inner">
          <div className="page-hero__text">
            <p className="section-label">Book Major</p>
            <h1 className="display text-red glow-text page-hero__title">Booking Info</h1>
            <p className="page-hero__sub text-dim">
              [Placeholder] Booking inquiry form goes here — same secure
              pattern as the AfterDARK Private Events form (server-side
              Netlify function, no exposed API keys, honeypot + reCAPTCHA).
            </p>
            <div className="placeholder-note">
              Pending: confirm whether booking inquiries go to a Brevo list
              (and which one) or straight to email, then wire up the form +
              Netlify function.
            </div>
          </div>
          <div className="page-hero__photo-wrap">
            <img
              src={SUPABASE('Major-looking-up.jpg')}
              alt="Major Johnson"
              className="page-hero__photo"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
