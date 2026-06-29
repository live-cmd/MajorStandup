import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import QuoteTicker from '../components/QuoteTicker';
import './PageShell.css';
import './OpenMic.css';

const MIC_QUOTES = [
  'This mic really helps comedians improve their skills',
  'These guys helped me with my set and then booked me on a show',
  "It's like a support group for comedians",
  "It's the coolest combination for comedians, like half workout, half workshop",
  'Great way to network with other comedians',
];

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  stage_name: '',
  phone: '',
  hometown: '',
  comedy_style: '',
  first_time: '',
  show_updates_optin: false,
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
      .select('id, first_name, last_name, stage_name, created_at')
      .order('created_at', { ascending: true });
    if (!fetchErr) setSignups(data || []);
    setLoadingList(false);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        stage_name: form.stage_name || null,
        phone: form.phone || null,
        hometown: form.hometown || null,
        comedy_style: form.comedy_style || null,
        first_time: form.first_time || null,
      }]);

      if (insertErr) throw insertErr;

      // Add to Brevo (open mic list + optional show updates list) server-side.
      // If this fails, the signup itself still succeeded above — don't block
      // the user's confirmation over an email marketing hiccup.
      try {
        await fetch('/.netlify/functions/open-mic-brevo-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            stage_name: form.stage_name,
            phone: form.phone,
            hometown: form.hometown,
            comedy_style: form.comedy_style,
            first_time: form.first_time,
            show_updates_optin: form.show_updates_optin,
          }),
        });
      } catch (brevoErr) {
        console.error('Brevo signup failed (non-blocking):', brevoErr);
      }

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
          <p className="section-label">My Mic</p>
          <h1 className="display text-red glow-text page-hero__title">Major Open Mic</h1>
          <p className="page-hero__sub text-dim">
            Hey, athletes work out at the gym, and comedians work out at The
            Mic. Whether you're new to comedy, or a seasoned vet, my mic is
            here to help you increase your skill and further your comedy
            career.
          </p>
          <p className="page-hero__sub text-dim">
            <strong>Tuesdays, 7:30 PM</strong> &middot; Cool J's AfterDARK &middot;
            Free to the public, 1 drink minimum.
          </p>
        </div>
      </section>

      <QuoteTicker quotes={MIC_QUOTES} />

      <section className="section">
        <div className="container">
          <div className="placeholder-note" style={{ marginBottom: '40px' }}>
            NOTICE: You must register online to receive stage time for the
            open mic. Each session has limited performance slots — the first
            18 people on the list and present for the session are guaranteed
            to go up. All others will be on standby for that week's session,
            in the order of registration. Each performer receives 4 minutes,
            and will be lit at 30 seconds before the host comes back up. We
            suggest performers bring a notebook as each session will have a
            special guest for you to ask questions and get feedback on your
            set.
          </div>

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

              <div className="openmic-form__row">
                <div>
                  <label className="openmic-label">First Name</label>
                  <input name="first_name" value={form.first_name} onChange={handleChange} className="openmic-input" placeholder="e.g., Jane" required />
                </div>
                <div>
                  <label className="openmic-label">Last Name</label>
                  <input name="last_name" value={form.last_name} onChange={handleChange} className="openmic-input" placeholder="e.g., Garcia" required />
                </div>
              </div>

              <div>
                <label className="openmic-label">Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="openmic-input" placeholder="e.g., email@example.com" required />
              </div>

              <div>
                <label className="openmic-label">Stage Name</label>
                <input name="stage_name" value={form.stage_name} onChange={handleChange} className="openmic-input" placeholder="Enter stage name if different from legal name" />
              </div>

              <div className="openmic-form__row">
                <div>
                  <label className="openmic-label">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="openmic-input" placeholder="e.g., 555-555-5555" />
                </div>
                <div>
                  <label className="openmic-label">Hometown</label>
                  <input name="hometown" value={form.hometown} onChange={handleChange} className="openmic-input" placeholder="Add your hometown" />
                </div>
              </div>

              <div>
                <label className="openmic-label">In one sentence, describe your comedy style</label>
                <textarea name="comedy_style" value={form.comedy_style} onChange={handleChange} className="openmic-input" placeholder="My comedy style is..." rows={3} />
              </div>

              <div>
                <label className="openmic-label">Is this your first time attending?</label>
                <div className="openmic-radio-group">
                  <label className="openmic-radio">
                    <input type="radio" name="first_time" value="Yes" checked={form.first_time === 'Yes'} onChange={handleChange} />
                    Yes
                  </label>
                  <label className="openmic-radio">
                    <input type="radio" name="first_time" value="No" checked={form.first_time === 'No'} onChange={handleChange} />
                    No
                  </label>
                </div>
              </div>

              <label className="openmic-checkbox">
                <input
                  type="checkbox"
                  name="show_updates_optin"
                  checked={form.show_updates_optin}
                  onChange={handleChange}
                />
                <span>Keep me updated on where Major is performing</span>
              </label>

              {error && <p className="openmic-error">{error}</p>}

              <button type="submit" className="btn btn-red" disabled={submitting}>
                {submitting ? 'Registering...' : 'Register for Session'}
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
                <span className="openmic-list__name">
                  {s.stage_name || `${s.first_name} ${s.last_name}`}
                </span>
                {i < 18 && <span className="openmic-list__badge">Guaranteed</span>}
                {i >= 18 && <span className="openmic-list__badge openmic-list__badge--standby">Standby</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
