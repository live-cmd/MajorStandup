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

const EMPTY_CLIP_FORM = {
  title: '',
  youtube_url: '',
  thumbnail_url: '',
  clip_date: '',
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

  // Open Mic list state
  const [signups, setSignups] = useState([]);
  const [signupsLoading, setSignupsLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [micMessage, setMicMessage] = useState('');

  // Performance Clips state
  const [clips, setClips] = useState([]);
  const [clipsLoading, setClipsLoading] = useState(false);
  const [clipForm, setClipForm] = useState(EMPTY_CLIP_FORM);
  const [clipEditingId, setClipEditingId] = useState(null);
  const [clipSaving, setClipSaving] = useState(false);
  const [clipMessage, setClipMessage] = useState('');
  const [clipDeleting, setClipDeleting] = useState(null);

  useEffect(() => {
    if (authed) {
      fetchShows();
      fetchSignups();
      fetchClips();
    }
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

  async function fetchSignups() {
    setSignupsLoading(true);
    const { data, error } = await supabase
      .from('major_open_mic_signups')
      .select('id, first_name, last_name, stage_name, created_at')
      .order('created_at', { ascending: true });
    if (!error) setSignups(data || []);
    setSignupsLoading(false);
  }

  async function handleClearList() {
    if (!window.confirm(`Clear all ${signups.length} signups for this week? This cannot be undone.`)) return;
    setClearing(true);
    setMicMessage('');
    const ids = signups.map(s => s.id);
    const { error } = await supabase
      .from('major_open_mic_signups')
      .delete()
      .in('id', ids);
    if (error) {
      setMicMessage('❌ Error clearing list: ' + error.message);
    } else {
      setMicMessage('✓ List cleared — ready for next week.');
      fetchSignups();
    }
    setClearing(false);
  }

  // ── PERFORMANCE CLIPS ──
  async function fetchClips() {
    setClipsLoading(true);
    const { data, error } = await supabase
      .from('major_performance_clips')
      .select('*')
      .order('clip_date', { ascending: false });
    if (!error) setClips(data || []);
    setClipsLoading(false);
  }

  function handleClipFormChange(e) {
    const { name, value } = e.target;
    setClipForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleClipSave(e) {
    e.preventDefault();
    setClipSaving(true);
    setClipMessage('');
    const payload = {
      title: clipForm.title,
      youtube_url: clipForm.youtube_url,
      thumbnail_url: clipForm.thumbnail_url || null,
      clip_date: clipForm.clip_date || null,
    };
    let error;
    if (clipEditingId) {
      ({ error } = await supabase.from('major_performance_clips').update(payload).eq('id', clipEditingId));
    } else {
      ({ error } = await supabase.from('major_performance_clips').insert([payload]));
    }
    if (error) {
      setClipMessage('❌ Error saving clip: ' + error.message);
    } else {
      setClipMessage(clipEditingId ? '✓ Clip updated.' : '✓ Clip added.');
      setClipForm(EMPTY_CLIP_FORM);
      setClipEditingId(null);
      fetchClips();
    }
    setClipSaving(false);
  }

  function handleClipEdit(clip) {
    setClipEditingId(clip.id);
    setClipForm({
      title: clip.title || '',
      youtube_url: clip.youtube_url || '',
      thumbnail_url: clip.thumbnail_url || '',
      clip_date: clip.clip_date || '',
    });
  }

  function handleClipCancel() {
    setClipForm(EMPTY_CLIP_FORM);
    setClipEditingId(null);
    setClipMessage('');
  }

  async function handleClipDelete(id) {
    if (!window.confirm('Delete this clip? This cannot be undone.')) return;
    setClipDeleting(id);
    const { error } = await supabase.from('major_performance_clips').delete().eq('id', id);
    if (!error) { setClipMessage('✓ Clip deleted.'); fetchClips(); }
    else { setClipMessage('❌ Error deleting clip.'); }
    setClipDeleting(null);
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

      {/* ── ADD / EDIT SHOW ── */}
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

      {/* ── SHOWS LIST ── */}
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

      {/* ── PERFORMANCE CLIPS ── */}
      <section className="admin-section">
        <h2 className="admin-section__title">🎬 {clipEditingId ? 'Edit Clip' : 'Add Performance Clip'}</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginBottom: '20px' }}>
          Upload the clip to YouTube as Unlisted first, then paste the link here. Thumbnail auto-pulls from YouTube unless you provide your own.
        </p>
        {clipMessage && (
          <div className={`admin-message ${clipMessage.startsWith('❌') ? 'admin-message--error' : 'admin-message--success'}`}>
            {clipMessage}
          </div>
        )}
        <form onSubmit={handleClipSave} className="admin-form">
          <div className="admin-form__row">
            <div>
              <label className="admin-label">Clip Title *</label>
              <input name="title" value={clipForm.title} onChange={handleClipFormChange} className="admin-input" placeholder="e.g. Headliner Set — Philly" required />
            </div>
            <div>
              <label className="admin-label">Clip Date</label>
              <input type="date" name="clip_date" value={clipForm.clip_date} onChange={handleClipFormChange} className="admin-input" />
            </div>
          </div>
          <div>
            <label className="admin-label">YouTube URL *</label>
            <input name="youtube_url" value={clipForm.youtube_url} onChange={handleClipFormChange} className="admin-input" placeholder="https://youtube.com/watch?v=..." required />
          </div>
          <div>
            <label className="admin-label">Custom Thumbnail URL (optional)</label>
            <input name="thumbnail_url" value={clipForm.thumbnail_url} onChange={handleClipFormChange} className="admin-input" placeholder="Leave blank to use YouTube's default thumbnail" />
          </div>
          <div className="admin-form__actions">
            <button type="submit" className="btn btn-red" disabled={clipSaving}>
              {clipSaving ? 'Saving...' : clipEditingId ? 'Update Clip' : 'Add Clip'}
            </button>
            {clipEditingId && <button type="button" className="admin-pill" onClick={handleClipCancel}>Cancel</button>}
          </div>
        </form>

        <h3 className="admin-section__title" style={{ marginTop: '32px', fontSize: '1rem' }}>
          Current Clips {clips.length > 0 && `(${clips.length})`}
        </h3>
        {clipsLoading && <p className="admin-loading">Loading...</p>}
        {!clipsLoading && clips.length === 0 && <p className="admin-empty">No clips yet. Add one above.</p>}
        <div className="admin-shows">
          {clips.map(clip => (
            <div key={clip.id} className="admin-show-row">
              <div className="admin-show-row__info">
                <div className="admin-show-row__name">{clip.title}</div>
                <div className="admin-show-row__meta">{clip.clip_date || 'No date set'}</div>
              </div>
              <button className="admin-pill" onClick={() => handleClipEdit(clip)}>Edit</button>
              <button className="admin-pill admin-pill--delete" onClick={() => handleClipDelete(clip.id)} disabled={clipDeleting === clip.id}>
                {clipDeleting === clip.id ? '...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── OPEN MIC LIST ── */}
      <section className="admin-section">
        <h2 className="admin-section__title">🎤 Open Mic Sign-Up List</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginBottom: '20px' }}>
          Clear the list each week before signups open for the next session.
        </p>

        {micMessage && (
          <div className={`admin-message ${micMessage.startsWith('❌') ? 'admin-message--error' : 'admin-message--success'}`}>
            {micMessage}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
            {signupsLoading ? 'Loading...' : `${signups.length} signup${signups.length !== 1 ? 's' : ''} on the current list`}
          </span>
          <button
            className="btn btn-red"
            style={{ padding: '10px 24px', fontSize: '0.8rem' }}
            onClick={handleClearList}
            disabled={clearing || signups.length === 0}
          >
            {clearing ? 'Clearing...' : '🗑 Clear List for Next Week'}
          </button>
        </div>

        {!signupsLoading && signups.length > 0 && (
          <div className="admin-shows">
            {signups.map((s, i) => (
              <div key={s.id} className="admin-show-row">
                <div className="admin-show-row__info">
                  <div className="admin-show-row__name">
                    {i + 1}. {s.stage_name || `${s.first_name} ${s.last_name}`}
                  </div>
                  <div className="admin-show-row__meta">
                    {i < 18 ? '✓ Guaranteed' : 'Standby'} · Signed up {new Date(s.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!signupsLoading && signups.length === 0 && (
          <p className="admin-empty">List is empty — ready for signups.</p>
        )}
      </section>
    </div>
  );
}
