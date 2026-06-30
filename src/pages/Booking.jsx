import { useState } from 'react';
import './PageShell.css';
import './Booking.css';

const SUPABASE = (path) =>
  `https://psxvjiuufwwcqrkdpueh.supabase.co/storage/v1/object/public/afterdark-media/major/${path}`;

const STAGE_TIME_OPTIONS = ['5–7 min', '8–10 min', '11–15 min', '20 min', '30+ min'];

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  eventDate: '',
  eventLocation: '',
  stageTime: '',
  comedianCount: '',
  budget: '',
  message: '',
  website: '', // honeypot — real users never see or fill this
};

export default function Booking() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Honeypot: if this hidden field has anything in it, it was filled by a bot.
    // Pretend success so the bot doesn't learn it was caught.
    if (form.website) {
      setSubmitted(true);
      setForm(EMPTY_FORM);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/.netlify/functions/booking-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          eventDate: form.eventDate,
          eventLocation: form.eventLocation,
          stageTime: form.stageTime,
          comedianCount: form.comedianCount,
          budget: form.budget,
          message: form.message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Submission failed');
      }

      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError('Something went wrong. Please try again or email directly.');
    }

    setSubmitting(false);
  }

  return (
    <div className="booking-page">
      <section className="page-hero page-hero--with-photo">
        <div className="container page-hero__inner">
          <div className="page-hero__text">
            <p className="section-label">Book Major</p>
            <h1 className="display text-red glow-text page-hero__title">Booking Info</h1>
            <p className="page-hero__sub text-dim">
              Looking to book Major for a show, club night, corporate event,
              or private function? Fill out the details below and we'll get
              back to you to talk through the date and the deal.
            </p>
          </div>
          <div className="page-hero__photo-wrap">
            <img
              src={SUPABASE('Major-looking-up.jpg')}
              alt="Major Johnson"
              className="page-hero__photo"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {submitted ? (
            <div className="booking-success">
              <div className="booking-success__icon">✓</div>
              <h3>Inquiry Received</h3>
              <p className="text-dim">
                Thanks for reaching out — we'll review the details and get
                back to you soon.
              </p>
            </div>
          ) : (
            <form className="booking-form" onSubmit={handleSubmit}>
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

              <div className="booking-form__row">
                <div>
                  <label className="booking-label">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} className="booking-input" placeholder="Your name" required />
                </div>
                <div>
                  <label className="booking-label">Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="booking-input" placeholder="your@email.com" required />
                </div>
              </div>

              <div className="booking-form__row">
                <div>
                  <label className="booking-label">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="booking-input" placeholder="(555) 000-0000" />
                </div>
                <div>
                  <label className="booking-label">Event Date</label>
                  <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} className="booking-input" />
                </div>
              </div>

              <div>
                <label className="booking-label">Event Location / Venue</label>
                <input name="eventLocation" value={form.eventLocation} onChange={handleChange} className="booking-input" placeholder="City, venue name" />
              </div>

              <div className="booking-form__row">
                <div>
                  <label className="booking-label">Stage Time Requested *</label>
                  <select name="stageTime" value={form.stageTime} onChange={handleChange} className="booking-input booking-select" required>
                    <option value="">Select time</option>
                    {STAGE_TIME_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="booking-label"># of Comedians on Show</label>
                  <input
                    type="number"
                    min="1"
                    name="comedianCount"
                    value={form.comedianCount}
                    onChange={handleChange}
                    className="booking-input"
                    placeholder="e.g., 4"
                  />
                </div>
              </div>

              <div>
                <label className="booking-label">What Does This Gig Pay? *</label>
                <input
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className="booking-input"
                  placeholder="Let us know the offer for this booking"
                  required
                />
              </div>

              <div>
                <label className="booking-label">Tell Us About The Event</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="booking-input booking-textarea"
                  placeholder="What kind of show is this? Any other details that'll help us evaluate the offer?"
                  rows={4}
                />
              </div>

              {error && <p className="booking-error">{error}</p>}

              <button type="submit" className="btn btn-red" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Booking Inquiry'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
