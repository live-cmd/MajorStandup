import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import './PageShell.css';

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="container">
          <ScrollReveal>
            <p className="section-label">Stand-Up Comedian</p>
            <h1 className="display text-red glow-text home-hero__title">Major<br />Standup</h1>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <p className="home-hero__sub text-dim">
              Major Johnson is a stand-up comedian, doing stand-up for five
              years under the stage name of Major. He tells his audiences that
              Major stands for Making A Joke Out of Reality, as a lot of his
              comedy references his real life experiences. However, in a more
              candid conversation, he shared that he believes his parents added
              Major to his name to signify that he was meant for bigger things
              than what the streets of Chester, PA expects.
            </p>
            <p className="home-hero__sub text-dim">
              Comedy came to Major in the form of a dream after spending a long
              weekend at the &ldquo;County Hotel&rdquo; aka jail. He recalls
              having a dream where none other than the King of Comedy himself,
              Bernie Mac, spoke to him and convinced him to get off the block
              and get on the stage to use his humor to help people deal with
              their reality. Major started hitting open mic nights wherever he
              could and has been performing as a feature and headliner for the
              last year. In a 2020 interview with Cut to The Chase he stated,
              &ldquo;Comedy saved me and showed me a better path. Comedy has
              been major to me. Now I just want to become major to comedy... I
              owe it that much, yesGod.&rdquo;
            </p>
          </ScrollReveal>
          <ScrollReveal delay={240}>
            <div className="home-hero__actions">
              <Link to="/portfolio" className="btn btn-red">See My Work</Link>
              <Link to="/booking" className="btn btn-outline-white">Book Major</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
