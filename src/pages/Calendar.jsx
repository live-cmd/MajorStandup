import './PageShell.css';

export default function Calendar() {
  return (
    <div className="calendar-page">
      <section className="page-hero">
        <div className="container">
          <p className="section-label">On The Road</p>
          <h1 className="display text-red page-hero__title">Upcoming Shows</h1>
          <p className="page-hero__sub text-dim">
            [Placeholder] Calendar of Major's upcoming performances goes here.
          </p>
          <div className="placeholder-note">
            Pending: decide data source — Eventbrite (if Major runs ticketed
            shows independently) and/or a Supabase table for shows booked
            through AfterDARK or other venues. Build out once confirmed.
          </div>
        </div>
      </section>
    </div>
  );
}
