import './PageShell.css';

export default function Booking() {
  return (
    <div className="booking-page">
      <section className="page-hero">
        <div className="container">
          <p className="section-label">Book Major</p>
          <h1 className="display text-red page-hero__title">Booking Info</h1>
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
      </section>
    </div>
  );
}
