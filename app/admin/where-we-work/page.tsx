'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminWherePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('hero');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    fetch('/api/where-we-work')
      .then((res) => res.json())
      .then((json) => {
        setData(json && Object.keys(json).length > 0 ? json : {});
        setLoading(false);
      })
      .catch(() => {
        setData({});
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setToast({ type: 'info', text: 'Saving changes…' });
    try {
      const res = await fetch('/api/where-we-work', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'Where We Work page saved!' });
      else setToast({ type: 'error', text: 'Save failed.' });
    } catch {
      setToast({ type: 'error', text: 'Network error.' });
    } finally {
      setSaving(false);
    }
  };

  const update = (section: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value },
    }));
  };

  const arrAdd = (section: string, field: string, item: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: [...(prev[section]?.[field] || []), item],
      },
    }));
  };

  const arrRemove = (section: string, field: string, index: number) => {
    setData((prev: any) => {
      const arr = [...(prev[section]?.[field] || [])];
      arr.splice(index, 1);
      return { ...prev, [section]: { ...prev[section], [field]: arr } };
    });
  };

  const arrChange = (section: string, field: string, index: number, key: string, value: any) => {
    setData((prev: any) => {
      const arr = [...(prev[section]?.[field] || [])];
      if (arr[index]) arr[index] = { ...arr[index], [key]: value };
      return { ...prev, [section]: { ...prev[section], [field]: arr } };
    });
  };

  const uploadImage = async (callback: (url: string) => void) => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (result.url) {
        callback(result.url);
        setToast({ type: 'success', text: 'Image uploaded!' });
      } else {
        setToast({ type: 'error', text: result.error || 'Upload failed' });
      }
    } catch {
      setToast({ type: 'error', text: 'Upload failed' });
    }
  };

  if (loading) {
    return <div style={{ fontFamily: 'Poppins, sans-serif', padding: 40 }}>Loading Where We Work…</div>;
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    marginBottom: 14,
    borderRadius: 10,
    border: '1.5px solid #E5E7EB',
    fontSize: '0.9rem',
    fontFamily: 'Poppins, sans-serif',
    outline: 'none',
    background: '#fff',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 6,
    fontWeight: 600,
    fontSize: '0.85rem',
    color: '#0A0F1F',
    fontFamily: 'Poppins, sans-serif',
  };

  const tabBtn = (tab: string) => ({
    padding: '8px 16px',
    borderRadius: 8,
    border: activeTab === tab ? '2px solid #D4A12A' : '1px solid #E5E7EB',
    background: activeTab === tab ? 'linear-gradient(135deg, #F5D67B, #D4A12A)' : 'white',
    color: activeTab === tab ? '#0A0F1F' : '#374151',
    fontWeight: 600,
    cursor: 'pointer',
    marginRight: 8,
    marginBottom: 8,
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.85rem',
  });

  const tabs = ['hero', 'presence', 'reaching', 'howWeWork', 'programsConnection'];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 9999,
            background:
              toast.type === 'success'
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : toast.type === 'error'
                ? 'linear-gradient(135deg, #EF4444, #B91C1C)'
                : 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            color: '#fff',
            padding: '16px 22px',
            borderRadius: 14,
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontWeight: 600,
            fontSize: '0.95rem',
            minWidth: 260,
            maxWidth: 400,
          }}
        >
          <span>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : '⏳'}</span>
          <span style={{ flex: 1 }}>{toast.text}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              width: 22,
              height: 22,
              borderRadius: '50%',
              fontSize: '0.7rem',
            }}
          >
            ✕
          </button>
        </div>
      )}

      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
        }}
      >
        <h1 style={{ fontSize: '1.8rem', color: '#0A0F1F', marginBottom: 6 }}>
          Edit Where We Work Page
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>
          Manage every section of the Where We Work page.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 20 }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} style={tabBtn(t)}>
              {t.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
            </button>
          ))}
        </div>

        {/* HERO */}
        {activeTab === 'hero' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.hero?.eyebrow || ''} onChange={(e) => update('hero', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.hero?.title || ''} onChange={(e) => update('hero', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.hero?.subtitle || ''} onChange={(e) => update('hero', 'subtitle', e.target.value)} rows={2} style={inputStyle} />
            <label style={labelStyle}>Description</label>
            <textarea value={data.hero?.description || ''} onChange={(e) => update('hero', 'description', e.target.value)} rows={3} style={inputStyle} />
            <label style={labelStyle}>Background Image</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input value={data.hero?.backgroundImage || ''} onChange={(e) => update('hero', 'backgroundImage', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={() => uploadImage((url) => update('hero', 'backgroundImage', url))} />
              <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: '#0D9488', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
                <i className="fas fa-upload" style={{ marginRight: 6 }} /> Upload
              </button>
            </div>
            {data.hero?.backgroundImage && (
              <img src={data.hero.backgroundImage} alt="" style={{ maxWidth: 240, borderRadius: 8, border: '1px solid #E5E7EB' }} />
            )}
          </div>
        )}

        {/* PRESENCE */}
        {activeTab === 'presence' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.presence?.eyebrow || ''} onChange={(e) => update('presence', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.presence?.title || ''} onChange={(e) => update('presence', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.presence?.subtitle || ''} onChange={(e) => update('presence', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>States</h4>

            {(data.presence?.states || []).map((s: any, i: number) => (
              <div
                key={i}
                style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 14,
                  background: '#FAFAFA',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: 1 }}>
                    State {i + 1}
                  </span>
                  <button
                    onClick={() => arrRemove('presence', 'states', i)}
                    style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}
                  >
                    Remove
                  </button>
                </div>

                <label style={labelStyle}>Icon (FontAwesome class)</label>
                <input
                  value={s.icon || ''}
                  onChange={(e) => arrChange('presence', 'states', i, 'icon', e.target.value)}
                  placeholder="fas fa-map-marker-alt"
                  style={inputStyle}
                />

                <label style={labelStyle}>State Name</label>
                <input
                  value={s.name || ''}
                  onChange={(e) => arrChange('presence', 'states', i, 'name', e.target.value)}
                  placeholder="e.g. Central Equatoria"
                  style={inputStyle}
                />

                <label style={labelStyle}>Locations (one per line)</label>
                <textarea
                  value={(s.locations || []).join('\n')}
                  onChange={(e) => arrChange('presence', 'states', i, 'locations', e.target.value.split('\n'))}
                  rows={5}
                  placeholder="Juba&#10;Yei River&#10;Morobo"
                  style={inputStyle}
                />
              </div>
            ))}

            <button
              onClick={() => arrAdd('presence', 'states', { icon: 'fas fa-map-marker-alt', name: '', locations: [] })}
              style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
            >
              + Add State
            </button>
          </div>
        )}

        {/* REACHING */}
        {activeTab === 'reaching' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.reaching?.eyebrow || ''} onChange={(e) => update('reaching', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.reaching?.title || ''} onChange={(e) => update('reaching', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Text</label>
            <textarea value={data.reaching?.text || ''} onChange={(e) => update('reaching', 'text', e.target.value)} rows={4} style={inputStyle} />
          </div>
        )}

        {/* HOW WE WORK */}
        {activeTab === 'howWeWork' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.howWeWork?.eyebrow || ''} onChange={(e) => update('howWeWork', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.howWeWork?.title || ''} onChange={(e) => update('howWeWork', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.howWeWork?.subtitle || ''} onChange={(e) => update('howWeWork', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Steps</h4>

            {(data.howWeWork?.steps || []).map((step: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 12, background: '#FAFAFA' }}>
                <input
                  value={step.number || ''}
                  onChange={(e) => arrChange('howWeWork', 'steps', i, 'number', e.target.value)}
                  placeholder="01"
                  style={inputStyle}
                />
                <input
                  value={step.icon || ''}
                  onChange={(e) => arrChange('howWeWork', 'steps', i, 'icon', e.target.value)}
                  placeholder="fas fa-search"
                  style={inputStyle}
                />
                <input
                  value={step.title || ''}
                  onChange={(e) => arrChange('howWeWork', 'steps', i, 'title', e.target.value)}
                  placeholder="Title"
                  style={inputStyle}
                />
                <textarea
                  value={step.text || ''}
                  onChange={(e) => arrChange('howWeWork', 'steps', i, 'text', e.target.value)}
                  placeholder="Description"
                  rows={2}
                  style={inputStyle}
                />
                <button
                  onClick={() => arrRemove('howWeWork', 'steps', i)}
                  style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                arrAdd('howWeWork', 'steps', {
                  number: String((data.howWeWork?.steps?.length || 0) + 1).padStart(2, '0'),
                  icon: '',
                  title: '',
                  text: '',
                })
              }
              style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
            >
              + Add Step
            </button>
          </div>
        )}

        {/* PROGRAMS CONNECTION */}
        {activeTab === 'programsConnection' && (
          <div>
            <label style={labelStyle}>Title</label>
            <input value={data.programsConnection?.title || ''} onChange={(e) => update('programsConnection', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Text</label>
            <textarea value={data.programsConnection?.text || ''} onChange={(e) => update('programsConnection', 'text', e.target.value)} rows={4} style={inputStyle} />
            <label style={labelStyle}>Button Text</label>
            <input value={data.programsConnection?.ctaText || ''} onChange={(e) => update('programsConnection', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Button Link</label>
            <input value={data.programsConnection?.ctaLink || ''} onChange={(e) => update('programsConnection', 'ctaLink', e.target.value)} style={inputStyle} />
          </div>
        )}

        {/* SAVE */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            marginTop: 30,
            width: '100%',
            padding: 16,
            background: saving ? 'rgba(212,161,42,0.5)' : 'linear-gradient(135deg, #F5D67B, #D4A12A)',
            color: '#0A0F1F',
            border: 'none',
            borderRadius: 12,
            fontSize: '1rem',
            fontWeight: 700,
            cursor: saving ? 'wait' : 'pointer',
            fontFamily: 'Poppins, sans-serif',
            boxShadow: '0 10px 24px rgba(212,161,42,0.35)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          {saving ? (
            <>
              <i className="fas fa-circle-notch fa-spin" /> Saving…
            </>
          ) : (
            <>
              <i className="fas fa-save" /> Save Where We Work Page
            </>
          )}
        </button>
      </div>
    </div>
  );
}