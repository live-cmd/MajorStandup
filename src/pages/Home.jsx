import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import './PageShell.css';
import './Home.css';

const SUPABASE = (path) =>
  `https://psxvjiuufwwcqrkdpueh.supabase.co/storage/v1/object/public/afterdark-media/major/${path}`;

const LOGO = SUPABASE('major%20logo.png');

export default function Home() {
  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="home-hero__bg" />
        <div className="container home-hero__inner">

          <div className="home-hero__left">
            <ScrollReveal>
              <img src={LOGO} alt="M.A.J.O.R" className="home-hero__logo" />
              <p className="section-label">Stand-Up Comedian</p>
              <h1 className="display text-red glow-text home-hero__title">
                Making A<br />Joke Out<br />Of Reality
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="home-hero__sub text-dim">
                Five years on stage. Every kind of room. From Chester, PA
                to wherever the next mic is — Major Johnson shows up and
                delivers every time.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="home-hero__actions">
                <Link to="/calendar" className="btn btn-red">Catch A Show</Link>
                <Link to="/booking" className="btn btn-outline-white">Book Major</Link>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={150}>
            <div className="home-hero__right">
              <div className="home-hero__photo-wrap">
                <div className="home-hero__photo-glow" />
                <img
                  src={SUPABASE('Major_black-red.heic')}
                  alt="Major Johnson — Stand-Up Comedian"
                  className="home-hero__photo"
                />
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ── BIO ── */}
      <section className="section home-bio">
        <div className="container home-bio__inner">
          <ScrollReveal>
            <div>
              <p className="section-label">The Story</p>
              <span className="red-line" />
              <h2 className="home-bio__title">M.A.J.O.R —<br />Making A Joke Out Of Reality</h2>
              <div className="home-bio__text">
                <p>
                  Major Johnson is a stand-up comedian, doing stand-up for five
                  years under the stage name of Major. He tells his audiences that
                  Major stands for Making A Joke Out of Reality — a lot of his
                  comedy references his real life experiences.
                </p>
                <p>
                  Comedy came to Major in the form of a dream after spending a
                  long weekend at the &ldquo;County Hotel&rdquo; aka jail. None
                  other than the King of Comedy himself, Bernie Mac, spoke to him
                  in that dream and convinced him to get off the block and use his
                  humor to help people deal with their reality.
                </p>
                <p>
                  Major started hitting open mic nights wherever he could and has
                  been performing as a feature and headliner ever since.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="home-bio__right">
              <img
                src={SUPABASE('Major-big-smile.heic')}
                alt="Major Johnson"
                className="home-bio__photo"
              />
              <blockquote className="home-bio__quote">
                &ldquo;Comedy saved me and showed me a better path. Comedy has been
                major to me. Now I just want to become major to comedy... I owe
                it that much, yesGod.&rdquo;
                <cite>— Major Johnson, Cut to The Chase (2020)</cite>
              </blockquote>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
