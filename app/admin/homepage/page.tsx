'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminHomepagePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('hero');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
  // Set a fallback timer: if the fetch takes > 6 seconds, force loading to end
  const timeoutId = setTimeout(() => {
    setLoading(false);
    setToast({ type: 'info', text: 'Loaded with default content (DB slow)' });
  }, 6000);

  fetch('/api/homepage')
    .then((res) => res.json())
    .then((json) => {
      clearTimeout(timeoutId);
      setData(json && Object.keys(json).length > 0 ? json : {});
      setLoading(false);
    })
    .catch(() => {
      clearTimeout(timeoutId);
      setData({});
      setLoading(false);
    });

  return () => clearTimeout(timeoutId);
}, []);

  const handleSave = async () => {
    setSaving(true);
    setToast({ type: 'info', text: 'Saving changes…' });

    try {
      const res = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setToast({ type: 'success', text: 'Changes saved successfully!' });
      } else {
        setToast({ type: 'error', text: 'Failed to save. Please try again.' });
      }
    } catch {
      setToast({ type: 'error', text: 'Network error. Please check your connection.' });
    } finally {
      setSaving(false);
    }
  };

  // ---------- HELPERS ----------
  const update = (section: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value },
    }));
  };

  const updateNested = (section: string, parent: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [parent]: { ...(prev[section]?.[parent] || {}), [field]: value },
      },
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
        setToast({ type: 'success', text: 'Image uploaded successfully!' });
      }
    } catch {
      setToast({ type: 'error', text: 'Upload failed.' });
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: 'Poppins, sans-serif', padding: '40px' }}>
        Loading homepage…
      </div>
    );
  }

  // ---------- STYLES ----------
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    marginBottom: '14px',
    borderRadius: '10px',
    border: '1.5px solid #E5E7EB',
    fontSize: '0.9rem',
    fontFamily: 'Poppins, sans-serif',
    outline: 'none',
    background: '#fff',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 600,
    fontSize: '0.85rem',
    color: '#0A0F1F',
    fontFamily: 'Poppins, sans-serif',
  };

  const tabBtn = (tab: string) => ({
    padding: '8px 16px',
    borderRadius: '8px',
    border: activeTab === tab ? '2px solid #D4A12A' : '1px solid #E5E7EB',
    background: activeTab === tab ? 'linear-gradient(135deg, #F5D67B, #D4A12A)' : 'white',
    color: activeTab === tab ? '#0A0F1F' : '#374151',
    fontWeight: 600,
    cursor: 'pointer',
    marginRight: 8,
    marginBottom: 8,
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
  });

  const tabs = [
    'hero', 'about', 'mission', 'programs', 'where',
    'impact', 'whyPartner', 'partners', 'news',
    'resources', 'governance', 'involved', 'contact',
  ];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* ============ TOAST ============ */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            background:
              toast.type === 'success'
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : toast.type === 'error'
                ? 'linear-gradient(135deg, #EF4444, #B91C1C)'
                : 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            color: '#fff',
            padding: '16px 22px',
            borderRadius: '14px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: 600,
            fontSize: '0.95rem',
            minWidth: '280px',
            maxWidth: '420px',
            animation: 'slideIn 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>
            {toast.type === 'success' && '✓'}
            {toast.type === 'error' && '✕'}
            {toast.type === 'info' && (
              <i className="fas fa-circle-notch fa-spin" />
            )}
          </span>
          <span style={{ flex: 1 }}>{toast.text}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              fontSize: '0.8rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            ✕
          </button>
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(120%); opacity: 0; }
              to   { transform: translateX(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {/* ============ MAIN CONTENT ============ */}
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
        }}
      >
        <h1 style={{ fontSize: '1.8rem', color: '#0A0F1F', marginBottom: '6px' }}>
          Edit Homepage
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '20px' }}>
          Manage every section of the LNF homepage.
        </p>

        {/* TABS */}
        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '20px' }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} style={tabBtn(t)}>
              {t.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
            </button>
          ))}
        </div>

        {/* ---------- HERO ---------- */}
        {activeTab === 'hero' && (
          <div>
            <label style={labelStyle}>Hero Slides</label>
            {(data.hero?.slides || []).map((slide: string, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: 12, marginBottom: 10 }}>
                <input
                  value={slide}
                  onChange={(e) => {
                    const arr = [...(data.hero?.slides || [])];
                    arr[i] = e.target.value;
                    update('hero', 'slides', arr);
                  }}
                  placeholder="Image URL"
                  style={inputStyle}
                />
                <input
                  type="file"
                  id={`hero-slide-${i}`}
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('file', file);
                    fetch('/api/upload', { method: 'POST', body: formData })
                      .then((r) => r.json())
                      .then((res) => {
                        if (res.url) {
                          const arr = [...(data.hero?.slides || [])];
                          arr[i] = res.url;
                          update('hero', 'slides', arr);
                          setToast({ type: 'success', text: 'Slide uploaded!' });
                        }
                      });
                  }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById(`hero-slide-${i}`)?.click()}
                  style={{ background: '#0D9488', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, marginRight: 8 }}
                >
                  Upload
                </button>
                <button
                  onClick={() => arrRemove('hero', 'slides', i)}
                  style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
                >
                  Remove
                </button>
                {slide && (
                  <img src={slide} alt="" style={{ maxWidth: 200, marginTop: 10, borderRadius: 8 }} />
                )}
              </div>
            ))}
            <button
              onClick={() => arrAdd('hero', 'slides', '')}
              style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
            >
              + Add Slide
            </button>
          </div>
        )}

        {/* ---------- ABOUT ---------- */}
        {activeTab === 'about' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.about?.eyebrow || ''} onChange={(e) => update('about', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.about?.title || ''} onChange={(e) => update('about', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Paragraph 1</label>
            <textarea value={data.about?.paragraph1 || ''} onChange={(e) => update('about', 'paragraph1', e.target.value)} rows={5} style={inputStyle} />
            <label style={labelStyle}>Paragraph 2</label>
            <textarea value={data.about?.paragraph2 || ''} onChange={(e) => update('about', 'paragraph2', e.target.value)} rows={5} style={inputStyle} />
            <label style={labelStyle}>Image</label>
            <input value={data.about?.image || ''} onChange={(e) => update('about', 'image', e.target.value)} style={inputStyle} />
            <input type="file" ref={fileInputRef} onChange={() => uploadImage((url) => update('about', 'image', url))} style={{ display: 'none' }} />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ background: '#0D9488', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
            >
              Upload Image
            </button>
            {data.about?.image && <img src={data.about.image} alt="" style={{ maxWidth: 200, marginTop: 10, borderRadius: 8 }} />}
          </div>
        )}

        {/* ---------- MISSION ---------- */}
        {activeTab === 'mission' && (
          <div>
            <label style={labelStyle}>Section Eyebrow</label>
            <input value={data.mission?.eyebrow || ''} onChange={(e) => update('mission', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Section Title</label>
            <input value={data.mission?.title || ''} onChange={(e) => update('mission', 'title', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 10 }}>Mission</h4>
            <label style={labelStyle}>Icon</label>
            <input value={data.mission?.mission?.icon || ''} onChange={(e) => updateNested('mission', 'mission', 'icon', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.mission?.mission?.title || ''} onChange={(e) => updateNested('mission', 'mission', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Text</label>
            <textarea value={data.mission?.mission?.text || ''} onChange={(e) => updateNested('mission', 'mission', 'text', e.target.value)} rows={4} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 10 }}>Vision</h4>
            <label style={labelStyle}>Icon</label>
            <input value={data.mission?.vision?.icon || ''} onChange={(e) => updateNested('mission', 'vision', 'icon', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.mission?.vision?.title || ''} onChange={(e) => updateNested('mission', 'vision', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Text</label>
            <textarea value={data.mission?.vision?.text || ''} onChange={(e) => updateNested('mission', 'vision', 'text', e.target.value)} rows={4} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 10 }}>Core Values</h4>
            {(data.mission?.values || []).map((v: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input value={v.icon || ''} onChange={(e) => arrChange('mission', 'values', i, 'icon', e.target.value)} placeholder="Icon" style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                <input value={v.label || ''} onChange={(e) => arrChange('mission', 'values', i, 'label', e.target.value)} placeholder="Label" style={{ ...inputStyle, marginBottom: 0, flex: 2 }} />
                <button onClick={() => arrRemove('mission', 'values', i)} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 8, padding: '0 12px', cursor: 'pointer' }}>
                  ✕
                </button>
              </div>
            ))}
            <button onClick={() => arrAdd('mission', 'values', { icon: '', label: '' })} style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, marginTop: 8 }}>
              + Add Value
            </button>

            <h4 style={{ marginTop: 20, marginBottom: 10 }}>How We Work Steps</h4>
            {(data.mission?.steps || []).map((s: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: 10, marginBottom: 8 }}>
                <input value={s.number || ''} onChange={(e) => arrChange('mission', 'steps', i, 'number', e.target.value)} placeholder="Number" style={inputStyle} />
                <input value={s.title || ''} onChange={(e) => arrChange('mission', 'steps', i, 'title', e.target.value)} placeholder="Title" style={inputStyle} />
                <textarea value={s.text || ''} onChange={(e) => arrChange('mission', 'steps', i, 'text', e.target.value)} placeholder="Text" rows={2} style={inputStyle} />
                <button onClick={() => arrRemove('mission', 'steps', i)} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}
            <button onClick={() => arrAdd('mission', 'steps', { number: '', title: '', text: '' })} style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, marginTop: 8 }}>
              + Add Step
            </button>
          </div>
        )}

        {/* ---------- PROGRAMS ---------- */}
        {activeTab === 'programs' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.programs?.eyebrow || ''} onChange={(e) => update('programs', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.programs?.title || ''} onChange={(e) => update('programs', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.programs?.subtitle || ''} onChange={(e) => update('programs', 'subtitle', e.target.value)} rows={2} style={inputStyle} />
            <h4 style={{ marginTop: 20, marginBottom: 10 }}>Programs</h4>
            {(data.programs?.items || []).map((p: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                <input value={p.icon || ''} onChange={(e) => arrChange('programs', 'items', i, 'icon', e.target.value)} placeholder="Icon class" style={inputStyle} />
                <input value={p.title || ''} onChange={(e) => arrChange('programs', 'items', i, 'title', e.target.value)} placeholder="Title" style={inputStyle} />
                <textarea value={p.text || ''} onChange={(e) => arrChange('programs', 'items', i, 'text', e.target.value)} placeholder="Text" rows={3} style={inputStyle} />
                <label style={labelStyle}>List (one per line)</label>
                <textarea value={(p.list || []).join('\n')} onChange={(e) => arrChange('programs', 'items', i, 'list', e.target.value.split('\n'))} rows={3} style={inputStyle} />
                <button onClick={() => arrRemove('programs', 'items', i)} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}
            <button onClick={() => arrAdd('programs', 'items', { icon: '', title: '', text: '', list: [] })} style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, marginTop: 8 }}>
              + Add Program
            </button>
          </div>
        )}

        {/* ---------- WHERE ---------- */}
        {activeTab === 'where' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.where?.eyebrow || ''} onChange={(e) => update('where', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.where?.title || ''} onChange={(e) => update('where', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.where?.subtitle || ''} onChange={(e) => update('where', 'subtitle', e.target.value)} rows={2} style={inputStyle} />
            <label style={labelStyle}>Background Image</label>
            <input value={data.where?.backgroundImage || ''} onChange={(e) => update('where', 'backgroundImage', e.target.value)} style={inputStyle} />
            <input type="file" ref={fileInputRef} onChange={() => uploadImage((url) => update('where', 'backgroundImage', url))} style={{ display: 'none' }} />
            <button onClick={() => fileInputRef.current?.click()} style={{ background: '#0D9488', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              Upload Background
            </button>
            <h4 style={{ marginTop: 20, marginBottom: 10 }}>States</h4>
            {(data.where?.states || []).map((s: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: 10, marginBottom: 8 }}>
                <input value={s.name || ''} onChange={(e) => arrChange('where', 'states', i, 'name', e.target.value)} placeholder="State" style={inputStyle} />
                <input value={s.areas || ''} onChange={(e) => arrChange('where', 'states', i, 'areas', e.target.value)} placeholder="Areas" style={inputStyle} />
                <button onClick={() => arrRemove('where', 'states', i)} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}
            <button onClick={() => arrAdd('where', 'states', { name: '', areas: '' })} style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, marginTop: 8 }}>
              + Add State
            </button>
          </div>
        )}

        {/* ---------- IMPACT ---------- */}
        {activeTab === 'impact' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.impact?.eyebrow || ''} onChange={(e) => update('impact', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.impact?.title || ''} onChange={(e) => update('impact', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.impact?.subtitle || ''} onChange={(e) => update('impact', 'subtitle', e.target.value)} rows={2} style={inputStyle} />
            <h4 style={{ marginTop: 20, marginBottom: 10 }}>Stats</h4>
            {(data.impact?.stats || []).map((s: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: 10, marginBottom: 8 }}>
                <input value={s.icon || ''} onChange={(e) => arrChange('impact', 'stats', i, 'icon', e.target.value)} placeholder="Icon" style={inputStyle} />
                <input value={s.number || ''} onChange={(e) => arrChange('impact', 'stats', i, 'number', e.target.value)} placeholder="Number" style={inputStyle} />
                <input value={s.label || ''} onChange={(e) => arrChange('impact', 'stats', i, 'label', e.target.value)} placeholder="Label" style={inputStyle} />
                <button onClick={() => arrRemove('impact', 'stats', i)} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}
            <button onClick={() => arrAdd('impact', 'stats', { icon: '', number: 0, label: '' })} style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, marginTop: 8 }}>
              + Add Stat
            </button>
          </div>
        )}

        {/* ---------- WHY PARTNER ---------- */}
        {activeTab === 'whyPartner' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.whyPartner?.eyebrow || ''} onChange={(e) => update('whyPartner', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.whyPartner?.title || ''} onChange={(e) => update('whyPartner', 'title', e.target.value)} style={inputStyle} />
            <h4 style={{ marginTop: 20, marginBottom: 10 }}>Items</h4>
            {(data.whyPartner?.items || []).map((it: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: 10, marginBottom: 8 }}>
                <input value={it.icon || ''} onChange={(e) => arrChange('whyPartner', 'items', i, 'icon', e.target.value)} placeholder="Icon" style={inputStyle} />
                <input value={it.title || ''} onChange={(e) => arrChange('whyPartner', 'items', i, 'title', e.target.value)} placeholder="Title" style={inputStyle} />
                <textarea value={it.text || ''} onChange={(e) => arrChange('whyPartner', 'items', i, 'text', e.target.value)} placeholder="Text" rows={2} style={inputStyle} />
                <button onClick={() => arrRemove('whyPartner', 'items', i)} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}
            <button onClick={() => arrAdd('whyPartner', 'items', { icon: '', title: '', text: '' })} style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, marginTop: 8 }}>
              + Add Item
            </button>
          </div>
        )}

        {/* ---------- PARTNERS ---------- */}
        {activeTab === 'partners' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.partners?.eyebrow || ''} onChange={(e) => update('partners', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.partners?.title || ''} onChange={(e) => update('partners', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Partners (one per line)</label>
            <textarea value={(data.partners?.items || []).join('\n')} onChange={(e) => update('partners', 'items', e.target.value.split('\n'))} rows={12} style={inputStyle} />
          </div>
        )}

       {/* ---------- NEWS ---------- */}
{activeTab === 'news' && (
  <div>
    <label style={labelStyle}>Eyebrow</label>
    <input value={data.news?.eyebrow || ''} onChange={(e) => update('news', 'eyebrow', e.target.value)} style={inputStyle} />
    <label style={labelStyle}>Title</label>
    <input value={data.news?.title || ''} onChange={(e) => update('news', 'title', e.target.value)} style={inputStyle} />
    <label style={labelStyle}>Subtitle</label>
    <textarea value={data.news?.subtitle || ''} onChange={(e) => update('news', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

    <h4 style={{ marginTop: 20, marginBottom: 10 }}>News Items</h4>

    {(data.news?.items || []).map((n: any, i: number) => (
      <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 16, marginBottom: 16, background: '#FAFAFA' }}>

        {/* Image section with upload */}
        <label style={labelStyle}>Image</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input
            value={n.image || ''}
            onChange={(e) => arrChange('news', 'items', i, 'image', e.target.value)}
            placeholder="Image URL or upload"
            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
          />
          <input
            type="file"
            id={`news-image-${i}`}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const formData = new FormData();
              formData.append('file', file);
              fetch('/api/upload', { method: 'POST', body: formData })
                .then((r) => r.json())
                .then((res) => {
                  if (res.url) {
                    arrChange('news', 'items', i, 'image', res.url);
                    setToast({ type: 'success', text: 'Image uploaded!' });
                  } else {
                    setToast({ type: 'error', text: res.error || 'Upload failed' });
                  }
                })
                .catch(() => setToast({ type: 'error', text: 'Upload failed' }));
            }}
          />
          <button
            type="button"
            onClick={() => document.getElementById(`news-image-${i}`)?.click()}
            style={{
              background: '#0D9488',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            <i className="fas fa-upload" style={{ marginRight: 6 }} /> Upload
          </button>
        </div>
        {n.image && (
          <img
            src={n.image}
            alt="Preview"
            style={{ maxWidth: 240, borderRadius: 8, marginBottom: 12, border: '1px solid #E5E7EB' }}
          />
        )}

        <label style={labelStyle}>Badge Label</label>
        <input value={n.badge || ''} onChange={(e) => arrChange('news', 'items', i, 'badge', e.target.value)} placeholder="e.g. Milestone" style={inputStyle} />

        <label style={labelStyle}>Badge Style</label>
        <select
          value={n.badgeClass || ''}
          onChange={(e) => arrChange('news', 'items', i, 'badgeClass', e.target.value)}
          style={inputStyle}
        >
          <option value="">Teal (default)</option>
          <option value="gold">Gold</option>
          <option value="navy">Navy</option>
        </select>

        <label style={labelStyle}>Date</label>
        <input value={n.date || ''} onChange={(e) => arrChange('news', 'items', i, 'date', e.target.value)} placeholder="e.g. August 19, 2026" style={inputStyle} />

        <label style={labelStyle}>Title</label>
        <input value={n.title || ''} onChange={(e) => arrChange('news', 'items', i, 'title', e.target.value)} placeholder="Headline" style={inputStyle} />

        <label style={labelStyle}>Excerpt</label>
        <textarea value={n.excerpt || ''} onChange={(e) => arrChange('news', 'items', i, 'excerpt', e.target.value)} placeholder="Short summary" rows={3} style={inputStyle} />

        <label style={labelStyle}>Tags (one per line)</label>
        <textarea
          value={(n.tags || []).join('\n')}
          onChange={(e) => arrChange('news', 'items', i, 'tags', e.target.value.split('\n'))}
          rows={2}
          style={inputStyle}
        />

        <label style={labelStyle}>Read More Link</label>
        <input value={n.link || ''} onChange={(e) => arrChange('news', 'items', i, 'link', e.target.value)} placeholder="e.g. /news#ncage" style={inputStyle} />

        <button
          onClick={() => arrRemove('news', 'items', i)}
          style={{
            background: 'none',
            border: '1px solid #EF4444',
            color: '#EF4444',
            borderRadius: 8,
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: 600,
            marginTop: 4,
          }}
        >
          <i className="fas fa-trash" style={{ marginRight: 6 }} /> Remove Item
        </button>
      </div>
    ))}

    <button
      onClick={() => arrAdd('news', 'items', { image: '', badge: '', badgeClass: '', date: '', title: '', excerpt: '', tags: [], link: '' })}
      style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
    >
      + Add News Item
    </button>
  </div>
)}

        {/* ---------- RESOURCES ---------- */}
{activeTab === 'resources' && (
  <div>
    <label style={labelStyle}>Eyebrow</label>
    <input
      value={data.resources?.eyebrow || ''}
      onChange={(e) => update('resources', 'eyebrow', e.target.value)}
      placeholder="e.g. Knowledge & Transparency"
      style={inputStyle}
    />

    <label style={labelStyle}>Title</label>
    <input
      value={data.resources?.title || ''}
      onChange={(e) => update('resources', 'title', e.target.value)}
      placeholder="e.g. Resources & Publications"
      style={inputStyle}
    />

    <h4 style={{ marginTop: 20, marginBottom: 10 }}>Resource Cards</h4>

    {(data.resources?.items || []).map((r: any, i: number) => (
      <div
        key={i}
        style={{
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          background: '#FAFAFA',
        }}
      >
        {/* Icon */}
        <label style={labelStyle}>Icon (FontAwesome class)</label>
        <input
          value={r.icon || ''}
          onChange={(e) => arrChange('resources', 'items', i, 'icon', e.target.value)}
          placeholder="e.g. fas fa-book-open"
          style={inputStyle}
        />

        {/* Icon Background (optional) */}
        <label style={labelStyle}>Icon Background (CSS gradient)</label>
        <input
          value={r.iconBg || ''}
          onChange={(e) => arrChange('resources', 'items', i, 'iconBg', e.target.value)}
          placeholder="e.g. linear-gradient(135deg, #5EEAD4, #0D9488)"
          style={inputStyle}
        />

        {/* Title */}
        <label style={labelStyle}>Title</label>
        <input
          value={r.title || ''}
          onChange={(e) => arrChange('resources', 'items', i, 'title', e.target.value)}
          placeholder="e.g. Annual Reports"
          style={inputStyle}
        />

        {/* Description */}
        <label style={labelStyle}>Description</label>
        <textarea
          value={r.text || ''}
          onChange={(e) => arrChange('resources', 'items', i, 'text', e.target.value)}
          placeholder="Short description of what's in this category"
          rows={3}
          style={inputStyle}
        />

        {/* Remove */}
        <button
          onClick={() => arrRemove('resources', 'items', i)}
          style={{
            background: 'none',
            border: '1px solid #EF4444',
            color: '#EF4444',
            borderRadius: 8,
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: 600,
            marginTop: 4,
          }}
        >
          <i className="fas fa-trash" style={{ marginRight: 6 }} /> Remove Card
        </button>
      </div>
    ))}

    <button
      onClick={() =>
        arrAdd('resources', 'items', {
          icon: '',
          iconBg: 'linear-gradient(135deg, #5EEAD4, #0D9488)',
          title: '',
          text: '',
        })
      }
      style={{
        background: '#D4A12A',
        color: '#0A0F1F',
        border: 'none',
        padding: '10px 20px',
        borderRadius: 8,
        cursor: 'pointer',
        fontWeight: 700,
      }}
    >
      + Add Resource Card
    </button>

    {/* Helpful note */}
    <div
      style={{
        marginTop: 24,
        padding: '14px 18px',
        background: '#E0F2F1',
        border: '1px solid #99F6E4',
        borderRadius: 10,
        fontSize: '0.85rem',
        color: '#0F766E',
        lineHeight: 1.6,
      }}
    >
      <strong>Note:</strong> These are the quick overview cards shown on the homepage.
      The actual downloadable files (PDFs) will be managed separately on the
      <strong> Resources page</strong> admin section.
    </div>
  </div>
)}

        {/* ---------- GOVERNANCE ---------- */}
        {activeTab === 'governance' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.governance?.eyebrow || ''} onChange={(e) => update('governance', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.governance?.title || ''} onChange={(e) => update('governance', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.governance?.subtitle || ''} onChange={(e) => update('governance', 'subtitle', e.target.value)} rows={2} style={inputStyle} />
            <h4 style={{ marginTop: 20, marginBottom: 10 }}>Items</h4>
            {(data.governance?.items || []).map((it: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: 10, marginBottom: 8 }}>
                <input value={it.icon || ''} onChange={(e) => arrChange('governance', 'items', i, 'icon', e.target.value)} placeholder="Icon" style={inputStyle} />
                <input value={it.title || ''} onChange={(e) => arrChange('governance', 'items', i, 'title', e.target.value)} placeholder="Title" style={inputStyle} />
                <textarea value={it.text || ''} onChange={(e) => arrChange('governance', 'items', i, 'text', e.target.value)} placeholder="Text" rows={2} style={inputStyle} />
                <button onClick={() => arrRemove('governance', 'items', i)} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}
            <button onClick={() => arrAdd('governance', 'items', { icon: '', title: '', text: '' })} style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, marginTop: 8 }}>
              + Add Item
            </button>
          </div>
        )}

        {/* ---------- INVOLVED ---------- */}
        {activeTab === 'involved' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.involved?.eyebrow || ''} onChange={(e) => update('involved', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.involved?.title || ''} onChange={(e) => update('involved', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.involved?.subtitle || ''} onChange={(e) => update('involved', 'subtitle', e.target.value)} rows={2} style={inputStyle} />
            <h4 style={{ marginTop: 20, marginBottom: 10 }}>Cards</h4>
            {(data.involved?.items || []).map((it: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: 10, marginBottom: 8 }}>
                <input value={it.icon || ''} onChange={(e) => arrChange('involved', 'items', i, 'icon', e.target.value)} placeholder="Icon" style={inputStyle} />
                <input value={it.title || ''} onChange={(e) => arrChange('involved', 'items', i, 'title', e.target.value)} placeholder="Title" style={inputStyle} />
                <textarea value={it.text || ''} onChange={(e) => arrChange('involved', 'items', i, 'text', e.target.value)} placeholder="Text" rows={2} style={inputStyle} />
                <button onClick={() => arrRemove('involved', 'items', i)} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}
            <button onClick={() => arrAdd('involved', 'items', { icon: '', iconBg: '', title: '', text: '', list: [], linkText: '', link: '', accent: '' })} style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, marginTop: 8 }}>
              + Add Card
            </button>
          </div>
        )}

        {/* ---------- CONTACT ---------- */}
{activeTab === 'contact' && (
  <div>
    <label style={labelStyle}>Eyebrow</label>
    <input
      value={data.contact?.eyebrow || ''}
      onChange={(e) => update('contact', 'eyebrow', e.target.value)}
      placeholder="e.g. Get In Touch"
      style={inputStyle}
    />

    <label style={labelStyle}>Title</label>
    <input
      value={data.contact?.title || ''}
      onChange={(e) => update('contact', 'title', e.target.value)}
      placeholder="e.g. Contact Us"
      style={inputStyle}
    />

    <h4 style={{ marginTop: 24, marginBottom: 12, color: '#0A0F1F' }}>Contact Details</h4>

    <label style={labelStyle}>Address</label>
    <textarea
      value={data.contact?.address || ''}
      onChange={(e) => update('contact', 'address', e.target.value)}
      placeholder="e.g. Tambura Road, Opposite Ethiopian Church, Juba..."
      rows={2}
      style={inputStyle}
    />

    <label style={labelStyle}>Phone</label>
    <input
      value={data.contact?.phone || ''}
      onChange={(e) => update('contact', 'phone', e.target.value)}
      placeholder="e.g. +211 927 960 466"
      style={inputStyle}
    />

    <label style={labelStyle}>Email</label>
    <input
      value={data.contact?.email || ''}
      onChange={(e) => update('contact', 'email', e.target.value)}
      placeholder="e.g. info@limnguenfoundation.org"
      style={inputStyle}
    />

    <label style={labelStyle}>Website</label>
    <input
      value={data.contact?.website || ''}
      onChange={(e) => update('contact', 'website', e.target.value)}
      placeholder="e.g. www.limnguenfoundation.org"
      style={inputStyle}
    />

    {/* Helpful note */}
    <div
      style={{
        marginTop: 24,
        padding: '14px 18px',
        background: '#E0F2F1',
        border: '1px solid #99F6E4',
        borderRadius: 10,
        fontSize: '0.85rem',
        color: '#0F766E',
        lineHeight: 1.6,
      }}
    >
      <strong>Note:</strong> The contact form is not on the homepage. It lives on
      the dedicated <strong>Contact page</strong> (<code>/contact</code>),
      where visitors can send messages. The homepage only shows these quick
      contact details plus a button linking to the Contact page.
    </div>
  </div>
)}

        {/* ---------- SAVE ---------- */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            marginTop: 30,
            width: '100%',
            padding: '16px',
            background: saving
              ? 'rgba(212,161,42,0.5)'
              : 'linear-gradient(135deg, #F5D67B, #D4A12A)',
            color: '#0A0F1F',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: saving ? 'wait' : 'pointer',
            fontFamily: 'Poppins, sans-serif',
            boxShadow: '0 10px 24px rgba(212,161,42,0.35)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          {saving ? (
            <>
              <i className="fas fa-circle-notch fa-spin" /> Saving…
            </>
          ) : (
            <>
              <i className="fas fa-save" /> Save Homepage
            </>
          )}
        </button>
      </div>
    </div>
  );
}