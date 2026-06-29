import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './PageShell.css';
import './OpenMic.css';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  set_notes: '',
  website: '', // honeypot — real users never see or fill this
};

export default function OpenMic() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [signups, setSignups] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    fetchSignups();
  }, []);

  async function fetchSignups() {
    setLoadingList(true);
    const { data, error: fetchErr } = await supabase
      .from('major_open_mic_signups')
      .select('id, name, created_at')
      .order('created_at', { ascending: true });
    if (!fetchErr) setSignups(data || []);
    setLoadingList(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Honeypot: if this hidden field has anything in it, it was filled by a bot.
    if (form.website) {
      setSubmitted(true);
      setForm(EMPTY_FORM);
      setSubmitting(false);
      return;
    }

    try {
      const { error: insertErr } = await supabase.from('major_open_mic_signups').insert([{
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        set_notes: form.set_notes || null,
      }]);

      if (insertErr) throw insertErr;

      setSubmitted(true);
      setForm(EMPTY_FORM);
      fetchSignups();
    } catch (err) {
      setError('Something went wrong. Please try again or email directly.');
    }

    setSubmitting(false);
  }

  return (
    <div className="openmic-page">
      <section className="page-hero">
        <div className="container">
          <p className="section-label">Get On The List</p>
          <h1 className="display text-red page-hero__title">Open Mic Sign-Up</h1>
          <p className="page-hero__sub text-dim">
            Sign up below to grab a spot for the next open mic. Spots are
            first come, first served — the list updates live.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {submitted ? (
            <div className="openmic-success">
              <div className="openmic-success__icon">✓</div>
              <h3>You're On The List</h3>
              <p className="text-dim">We'll see you up there. Check the list below for your spot.</p>
            </div>
          ) : (
            <form className="openmic-form" onSubmit={handleSubmit}>
              {/* Honeypot field — hidden from real users via CSS */}
              <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="openmic-label">Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="openmic-input" placeholder="Your name" required />
              </div>
              <div>
                <label className="openmic-label">Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="openmic-input" placeholder="your@email.com" required />
              </div>
              <div>
                <label className="openmic-label">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="openmic-input" placeholder="(555) 000-0000" />
              </div>
              <div>
                <label className="openmic-label">Set Notes (optional)</label>
                <input name="set_notes" value={form.set_notes} onChange={handleChange} className="openmic-input" placeholder="Set length, material type, anything we should know" />
              </div>

              {error && <p className="openmic-error">{error}</p>}

              <button type="submit" className="btn btn-red" disabled={submitting}>
                {submitting ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
          )}

          <div className="openmic-list">
            <h2 className="openmic-list__title">Current List</h2>
            {loadingList && <p className="text-dim text-center">Loading...</p>}
            {!loadingList && signups.length === 0 && (
              <p className="openmic-list__empty">No one's signed up yet — be the first.</p>
            )}
            {!loadingList && signups.map((s, i) => (
              <div key={s.id} className="openmic-list__row">
                <span className="openmic-list__pos">{i + 1}</span>
                <span className="openmic-list__name">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
