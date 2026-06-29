import './PageShell.css';

export default function Portfolio() {
  return (
    <div className="portfolio-page">
      <section className="page-hero">
        <div className="container">
          <p className="section-label">Performance Samples</p>
          <h1 className="display text-red page-hero__title">Portfolio</h1>
          <p className="page-hero__sub text-dim">
            [Placeholder] Video clips and photos go here — same pattern as
            Performance Clips on the AfterDARK site (YouTube link + thumbnail).
          </p>
          <div className="placeholder-note">
            Pending: real clips/photos from Major, then build out a clip grid
            here (reusing the AfterDARK performance_clips pattern).
          </div>
        </div>
      </section>
    </div>
  );
}
