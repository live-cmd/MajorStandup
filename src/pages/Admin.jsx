import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Admin.css';

const ADMIN_PASSWORD = 'majorstandup2026';

const EMPTY_FORM = {
  name: '',
  date: '',
  time: '',
  venue: '',
  city: '',
  ticket_url: '',
  notes: '',
};

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (authed) fetchShows();
  }, [authed]);

  async function fetchShows() {
    setLoading(true);
    const { data, error } = await supabase
      .from('major_shows')
      .select('*')
      .order('date', { ascending: true });
    if (!error) setShows(data || []);
    setLoading(false);
  }

  function handleLogin(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password.');
    }
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const payload = { ...form };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('major_shows').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('major_shows').insert([payload]));
    }

    if (error) {
      setMessage('❌ Error saving show: ' + error.message);
    } else {
      setMessage(editingId ? '✓ Show updated.' : '✓ Show added.');
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchShows();
    }
    setSaving(false);
  }

  function handleEdit(show) {
    setEditingId(show.id);
    setForm({
      name: show.name || '',
      date: show.date || '',
      time: show.time || '',
      venue: show.venue || '',
      city: show.city || '',
      ticket_url: show.ticket_url || '',
      notes: show.notes || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancel() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setMessage('');
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this show? This cannot be undone.')) return;
    setDeleting(id);
    const { error } = await supabase.from('major_shows').delete().eq('id', id);
    if (!error) { setMessage('✓ Show deleted.'); fetchShows(); }
    else { setMessage('❌ Error deleting show.'); }
    setDeleting(null);
  }

  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login__box">
          <div className="admin-login__brand">MAJOR<span className="text-red">JOHNSON</span></div>
          <form onSubmit={handleLogin} className="admin-login__form">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="admin-input"
              autoFocus
            />
            {authError && <p className="admin-error">{authError}</p>}
            <button type="submit" className="btn btn-red">Enter</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header__brand">Show Manager</div>
        <button className="admin-pill" onClick={() => { setAuthed(false); window.location.href = '/calendar'; }}>Sign Out</button>
      </div>

      <section className="admin-section">
        <h2 className="admin-section__title">{editingId ? 'Edit Show' : 'Add New Show'}</h2>
        {message && (
          <div className={`admin-message ${message.startsWith('❌') ? 'admin-message--error' : 'admin-message--success'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSave} className="admin-form">
          <div className="admin-form__row">
            <div>
              <label className="admin-label">Show Name *</label>
              <input name="name" value={form.name} onChange={handleFormChange} className="admin-input" placeholder="e.g. Headliner Set" required />
            </div>
            <div>
              <label className="admin-label">Date *</label>
              <input type="date" name="date" value={form.date} onChange={handleFormChange} className="admin-input" required />
            </div>
          </div>

          <div className="admin-form__row">
            <div>
              <label className="admin-label">Time</label>
              <input name="time" value={form.time} onChange={handleFormChange} className="admin-input" placeholder="e.g. 8:00 PM" />
            </div>
            <div>
              <label className="admin-label">City</label>
              <input name="city" value={form.city} onChange={handleFormChange} className="admin-input" placeholder="e.g. Philadelphia, PA" />
            </div>
          </div>

          <div>
            <label className="admin-label">Venue</label>
            <input name="venue" value={form.venue} onChange={handleFormChange} className="admin-input" placeholder="e.g. Cool J's AfterDARK" />
          </div>

          <div>
            <label className="admin-label">Ticket URL</label>
            <input name="ticket_url" value={form.ticket_url} onChange={handleFormChange} className="admin-input" placeholder="https://..." />
          </div>

          <div>
            <label className="admin-label">Notes</label>
            <input name="notes" value={form.notes} onChange={handleFormChange} className="admin-input" placeholder="Optional details" />
          </div>

          <div className="admin-form__actions">
            <button type="submit" className="btn btn-red" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Show' : 'Add Show'}
            </button>
            {editingId && <button type="button" className="admin-pill" onClick={handleCancel}>Cancel</button>}
          </div>
        </form>
      </section>

      <section className="admin-section">
        <h2 className="admin-section__title">Upcoming Shows</h2>
        {loading && <p className="admin-loading">Loading...</p>}
        {!loading && shows.length === 0 && <p className="admin-empty">No shows yet. Add one above.</p>}
        <div className="admin-shows">
          {shows.map(show => (
            <div key={show.id} className="admin-show-row">
              <div className="admin-show-row__info">
                <div className="admin-show-row__name">{show.name}</div>
                <div className="admin-show-row__meta">
                  {show.date} {show.time && `· ${show.time}`} {show.venue && `· ${show.venue}`} {show.city && `· ${show.city}`}
                </div>
              </div>
              <button className="admin-pill" onClick={() => handleEdit(show)}>Edit</button>
              <button className="admin-pill admin-pill--delete" onClick={() => handleDelete(show.id)} disabled={deleting === show.id}>
                {deleting === show.id ? '...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
