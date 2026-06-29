import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './PageShell.css';
import './Calendar.css';

export default function Calendar() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShows();
  }, []);

  async function fetchShows() {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('major_shows')
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true });
    if (!error) setShows(data || []);
    setLoading(false);
  }

  return (
    <div className="calendar-page">
      <section className="page-hero">
        <div className="container">
          <p className="section-label">On The Road</p>
          <h1 className="display text-red page-hero__title">Upcoming Shows</h1>
          <p className="page-hero__sub text-dim">
            Catch Major live — comedy clubs, promoter shows, corporate
            events, and everywhere in between.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading && <p className="text-dim text-center">Loading...</p>}
          {!loading && shows.length === 0 && (
            <p className="calendar-empty text-dim text-center">
              No upcoming shows posted right now — check back soon.
            </p>
          )}
          <div className="calendar-list">
            {shows.map(show => (
              <div key={show.id} className="calendar-row">
                <div className="calendar-row__date">
                  <span className="calendar-row__month">
                    {new Date(show.date + 'T00:00:00').toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                  </span>
                  <span className="calendar-row__day">
                    {new Date(show.date + 'T00:00:00').getDate()}
                  </span>
                </div>
                <div className="calendar-row__info">
                  <h3 className="calendar-row__name">{show.name}</h3>
                  <p className="calendar-row__meta">
                    {show.time && `${show.time} · `}
                    {show.venue}{show.venue && show.city && ', '}{show.city}
                  </p>
                  {show.notes && <p className="calendar-row__notes">{show.notes}</p>}
                </div>
                {show.ticket_url && (
                  <a href={show.ticket_url} target="_blank" rel="noreferrer" className="btn btn-red calendar-row__cta">
                    Tickets
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
