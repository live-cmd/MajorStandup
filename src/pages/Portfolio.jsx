import './PageShell.css';

export default function Portfolio() {
  return (
    <div className="portfolio-page">
      <section className="page-hero">
        <div className="container">
          <p className="section-label">My Work</p>
          <h1 className="display text-red page-hero__title">Portfolio</h1>
          <p className="page-hero__sub text-dim">
            I'm experienced in every role as a comedian, (well maybe not a
            comedic actor, but I'm working on that) I can be booked to host,
            open, feature, or headline shows. I've even been a celebrity judge
            for talent competitions. I can work any stage from comedy clubs,
            promoter shows, corporate/private events, and cruises.
          </p>
          <p className="page-hero__sub text-dim">
            This comedy thing takes work. Work to master the craft and work
            to get paid, so I'll take every opportunity my schedule will
            permit. Bookers and promoters can contact my management team with
            the information below. Supporters can join what we call{' '}
            <em>The Major League</em> by following me on social platforms
            and/or joining my mailing list.
          </p>
          <div className="placeholder-note">
            Pending: performance clip(s) — need the actual video file/link
            (the current cooljsafterdark.com page has one clip embedded) to
            wire up here, plus any additional clips/photos for a full grid.
          </div>
        </div>
      </section>
    </div>
  );
}
