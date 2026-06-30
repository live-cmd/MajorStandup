import { useState, useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './PageShell.css';
import './Portfolio.css';

const SUPABASE = (path) =>
  `https://psxvjiuufwwcqrkdpueh.supabase.co/storage/v1/object/public/afterdark-media/major/${path}`;

const PHOTOS = [
  { src: SUPABASE('Major_black-red.jpg'), alt: 'Major Johnson — performance shot' },
  { src: SUPABASE('Major-big-smile.jpg'), alt: 'Major Johnson — connecting with the crowd' },
  { src: SUPABASE('Major-black-gold.jpg'), alt: 'Major Johnson — headliner set' },
];

function getYoutubeId(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : '';
}

export default function Portfolio() {
  const [clips, setClips] = useState([]);
  const [clipsLoading, setClipsLoading] = useState(true);
  const [activeClip, setActiveClip] = useState(null);

  useEffect(() => {
    fetchClips();
  }, []);

  async function fetchClips() {
    setClipsLoading(true);
    const { data, error } = await supabase
      .from('major_performance_clips')
      .select('*')
      .order('clip_date', { ascending: false });
    if (!error) setClips(data || []);
    setClipsLoading(false);
  }

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
          </ScrollReveal>

          {activeClip && (
            <div className="clip-player-wrap">
              <iframe
                className="clip-player"
                src={`https://www.youtube.com/embed/${getYoutubeId(activeClip.youtube_url)}?autoplay=1`}
                title={activeClip.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button className="clip-player-close" onClick={() => setActiveClip(null)}>✕ Close</button>
            </div>
          )}

          {clipsLoading && <p className="text-dim" style={{ marginTop: '24px' }}>Loading clips...</p>}

          {!clipsLoading && clips.length === 0 && (
            <p className="text-dim" style={{ maxWidth: '560px', marginTop: '24px' }}>
              Performance clips coming soon — full sets, features, and
              highlight reels from stages across the Mid-Atlantic.
            </p>
          )}

          {!clipsLoading && clips.length > 0 && (
            <div className="clip-grid">
              {clips.map((clip, i) => {
                const videoId = getYoutubeId(clip.youtube_url);
                const thumb = clip.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                return (
                  <ScrollReveal key={clip.id} delay={i * 80}>
                    <button className="clip-card" onClick={() => setActiveClip(clip)}>
                      <div className="clip-card__thumb" style={{ backgroundImage: `url(${thumb})` }}>
                        <span className="clip-card__play">▶</span>
                      </div>
                      <p className="clip-card__title">{clip.title}</p>
                      {clip.clip_date && <p className="clip-card__date">{clip.clip_date}</p>}
                    </button>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
