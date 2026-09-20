'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminImpactPage() {
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
    fetch('/api/impact')
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
      const res = await fetch('/api/impact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'Impact page saved successfully!' });
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
    return <div style={{ fontFamily: 'Poppins, sans-serif', padding: 40 }}>Loading Impact page…</div>;
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

  const tabs = [
    'hero', 'stats', 'meaning', 'acrossSouthSudan',
    'throughPrograms', 'stories', 'howWeCreate', 'accountability', 'cta',
  ];

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
        <h1 style={{ fontSize: '1.8rem', color: '#0A0F1F', marginBottom: 6 }}>Edit Impact Page</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>
          Manage every section of the Impact page.
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

        {/* STATS */}
        {activeTab === 'stats' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.stats?.eyebrow || ''} onChange={(e) => update('stats', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.stats?.title || ''} onChange={(e) => update('stats', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.stats?.subtitle || ''} onChange={(e) => update('stats', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Impact Numbers</h4>

            {(data.stats?.items || []).map((s: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 12, background: '#FAFAFA' }}>
                <label style={labelStyle}>Icon (FontAwesome class)</label>
                <input value={s.icon || ''} onChange={(e) => arrChange('stats', 'items', i, 'icon', e.target.value)} placeholder="fas fa-school" style={inputStyle} />
                <label style={labelStyle}>Number</label>
                <input type="number" value={s.number || 0} onChange={(e) => arrChange('stats', 'items', i, 'number', Number(e.target.value))} style={inputStyle} />
                <label style={labelStyle}>Suffix (e.g. +)</label>
                <input value={s.suffix || ''} onChange={(e) => arrChange('stats', 'items', i, 'suffix', e.target.value)} placeholder="+" style={inputStyle} />
                <label style={labelStyle}>Label</label>
                <input value={s.label || ''} onChange={(e) => arrChange('stats', 'items', i, 'label', e.target.value)} placeholder="e.g. Schools Assessed" style={inputStyle} />
                <button onClick={() => arrRemove('stats', 'items', i)} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}

            <button onClick={() => arrAdd('stats', 'items', { icon: '', number: 0, suffix: '+', label: '' })} style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
              + Add Stat
            </button>
          </div>
        )}

        {/* MEANING */}
        {activeTab === 'meaning' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.meaning?.eyebrow || ''} onChange={(e) => update('meaning', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.meaning?.title || ''} onChange={(e) => update('meaning', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.meaning?.subtitle || ''} onChange={(e) => update('meaning', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Explanation Cards</h4>

            {(data.meaning?.items || []).map((m: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 12, background: '#FAFAFA' }}>
                <input value={m.icon || ''} onChange={(e) => arrChange('meaning', 'items', i, 'icon', e.target.value)} placeholder="Icon class" style={inputStyle} />
                <input value={m.category || ''} onChange={(e) => arrChange('meaning', 'items', i, 'category', e.target.value)} placeholder="Category (e.g. Education)" style={inputStyle} />
                <input value={m.number || ''} onChange={(e) => arrChange('meaning', 'items', i, 'number', e.target.value)} placeholder="e.g. 30+ schools assessed" style={inputStyle} />
                <textarea value={m.text || ''} onChange={(e) => arrChange('meaning', 'items', i, 'text', e.target.value)} placeholder="Explanation" rows={3} style={inputStyle} />
                <input value={m.linkText || ''} onChange={(e) => arrChange('meaning', 'items', i, 'linkText', e.target.value)} placeholder="Optional link text" style={inputStyle} />
                <input value={m.link || ''} onChange={(e) => arrChange('meaning', 'items', i, 'link', e.target.value)} placeholder="Optional link (e.g. /programs#wash)" style={inputStyle} />
                <button onClick={() => arrRemove('meaning', 'items', i)} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}

            <button onClick={() => arrAdd('meaning', 'items', { icon: '', category: '', number: '', text: '', linkText: '', link: '' })} style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
              + Add Card
            </button>
          </div>
        )}

        {/* ACROSS SOUTH SUDAN */}
        {activeTab === 'acrossSouthSudan' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.acrossSouthSudan?.eyebrow || ''} onChange={(e) => update('acrossSouthSudan', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.acrossSouthSudan?.title || ''} onChange={(e) => update('acrossSouthSudan', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.acrossSouthSudan?.subtitle || ''} onChange={(e) => update('acrossSouthSudan', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>States</h4>

            {(data.acrossSouthSudan?.states || []).map((s: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 12, background: '#FAFAFA' }}>
                <input value={s.name || ''} onChange={(e) => arrChange('acrossSouthSudan', 'states', i, 'name', e.target.value)} placeholder="State name" style={inputStyle} />
                <textarea value={s.areas || ''} onChange={(e) => arrChange('acrossSouthSudan', 'states', i, 'areas', e.target.value)} placeholder="Areas (separated by ·)" rows={2} style={inputStyle} />
                <button onClick={() => arrRemove('acrossSouthSudan', 'states', i)} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}

            <button onClick={() => arrAdd('acrossSouthSudan', 'states', { name: '', areas: '' })} style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, marginBottom: 16 }}>
              + Add State
            </button>

            <label style={labelStyle}>CTA Text</label>
            <input value={data.acrossSouthSudan?.ctaText || ''} onChange={(e) => update('acrossSouthSudan', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.acrossSouthSudan?.ctaLink || ''} onChange={(e) => update('acrossSouthSudan', 'ctaLink', e.target.value)} style={inputStyle} />
          </div>
        )}

        {/* THROUGH PROGRAMS */}
        {activeTab === 'throughPrograms' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.throughPrograms?.eyebrow || ''} onChange={(e) => update('throughPrograms', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.throughPrograms?.title || ''} onChange={(e) => update('throughPrograms', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.throughPrograms?.subtitle || ''} onChange={(e) => update('throughPrograms', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Programs</h4>

            {(data.throughPrograms?.items || []).map((p: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 12, background: '#FAFAFA' }}>
                <input value={p.icon || ''} onChange={(e) => arrChange('throughPrograms', 'items', i, 'icon', e.target.value)} placeholder="Icon class" style={inputStyle} />
                <input value={p.title || ''} onChange={(e) => arrChange('throughPrograms', 'items', i, 'title', e.target.value)} placeholder="Title" style={inputStyle} />
                <textarea value={p.text || ''} onChange={(e) => arrChange('throughPrograms', 'items', i, 'text', e.target.value)} placeholder="Short description" rows={2} style={inputStyle} />
                <button onClick={() => arrRemove('throughPrograms', 'items', i)} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}

            <button onClick={() => arrAdd('throughPrograms', 'items', { icon: '', title: '', text: '' })} style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, marginBottom: 16 }}>
              + Add Program
            </button>

            <label style={labelStyle}>CTA Text</label>
            <input value={data.throughPrograms?.ctaText || ''} onChange={(e) => update('throughPrograms', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.throughPrograms?.ctaLink || ''} onChange={(e) => update('throughPrograms', 'ctaLink', e.target.value)} style={inputStyle} />
          </div>
        )}

        {/* STORIES */}
        {activeTab === 'stories' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.stories?.eyebrow || ''} onChange={(e) => update('stories', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.stories?.title || ''} onChange={(e) => update('stories', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.stories?.subtitle || ''} onChange={(e) => update('stories', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Featured Story</h4>

            <label style={labelStyle}>Image</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input value={data.stories?.featured?.image || ''} onChange={(e) => update('stories', 'featured', { ...data.stories?.featured, image: e.target.value })} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={() => uploadImage((url) => update('stories', 'featured', { ...data.stories?.featured, image: url }))} />
              <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: '#0D9488', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
                <i className="fas fa-upload" style={{ marginRight: 6 }} /> Upload
              </button>
            </div>

            <label style={labelStyle}>Badge Label</label>
            <input value={data.stories?.featured?.badge || ''} onChange={(e) => update('stories', 'featured', { ...data.stories?.featured, badge: e.target.value })} style={inputStyle} />

            <label style={labelStyle}>Date</label>
            <input value={data.stories?.featured?.date || ''} onChange={(e) => update('stories', 'featured', { ...data.stories?.featured, date: e.target.value })} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.stories?.featured?.title || ''} onChange={(e) => update('stories', 'featured', { ...data.stories?.featured, title: e.target.value })} style={inputStyle} />

            <label style={labelStyle}>Excerpt</label>
            <textarea value={data.stories?.featured?.excerpt || ''} onChange={(e) => update('stories', 'featured', { ...data.stories?.featured, excerpt: e.target.value })} rows={3} style={inputStyle} />

            <label style={labelStyle}>Link</label>
            <input value={data.stories?.featured?.link || ''} onChange={(e) => update('stories', 'featured', { ...data.stories?.featured, link: e.target.value })} style={inputStyle} />
          </div>
        )}

        {/* HOW WE CREATE IMPACT */}
        {activeTab === 'howWeCreate' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.howWeCreate?.eyebrow || ''} onChange={(e) => update('howWeCreate', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.howWeCreate?.title || ''} onChange={(e) => update('howWeCreate', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.howWeCreate?.subtitle || ''} onChange={(e) => update('howWeCreate', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Steps</h4>

            {(data.howWeCreate?.steps || []).map((s: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 12, background: '#FAFAFA' }}>
                <input value={s.number || ''} onChange={(e) => arrChange('howWeCreate', 'steps', i, 'number', e.target.value)} placeholder="01" style={inputStyle} />
                <input value={s.icon || ''} onChange={(e) => arrChange('howWeCreate', 'steps', i, 'icon', e.target.value)} placeholder="Icon class" style={inputStyle} />
                <input value={s.title || ''} onChange={(e) => arrChange('howWeCreate', 'steps', i, 'title', e.target.value)} placeholder="Title" style={inputStyle} />
                <textarea value={s.text || ''} onChange={(e) => arrChange('howWeCreate', 'steps', i, 'text', e.target.value)} placeholder="Description" rows={2} style={inputStyle} />
                <button onClick={() => arrRemove('howWeCreate', 'steps', i)} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}

            <button onClick={() => arrAdd('howWeCreate', 'steps', { number: String((data.howWeCreate?.steps?.length || 0) + 1).padStart(2, '0'), icon: '', title: '', text: '' })} style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
              + Add Step
            </button>
          </div>
        )}

        {/* ACCOUNTABILITY */}
        {activeTab === 'accountability' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.accountability?.eyebrow || ''} onChange={(e) => update('accountability', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.accountability?.title || ''} onChange={(e) => update('accountability', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.accountability?.subtitle || ''} onChange={(e) => update('accountability', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Items</h4>

            {(data.accountability?.items || []).map((a: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 12, background: '#FAFAFA' }}>
                <input value={a.icon || ''} onChange={(e) => arrChange('accountability', 'items', i, 'icon', e.target.value)} placeholder="Icon class" style={inputStyle} />
                <input value={a.title || ''} onChange={(e) => arrChange('accountability', 'items', i, 'title', e.target.value)} placeholder="Title" style={inputStyle} />
                <textarea value={a.text || ''} onChange={(e) => arrChange('accountability', 'items', i, 'text', e.target.value)} placeholder="Description" rows={2} style={inputStyle} />
                <button onClick={() => arrRemove('accountability', 'items', i)} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}

            <button onClick={() => arrAdd('accountability', 'items', { icon: '', title: '', text: '' })} style={{ background: '#D4A12A', color: '#0A0F1F', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, marginBottom: 16 }}>
              + Add Item
            </button>

            <label style={labelStyle}>CTA Text</label>
            <input value={data.accountability?.ctaText || ''} onChange={(e) => update('accountability', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.accountability?.ctaLink || ''} onChange={(e) => update('accountability', 'ctaLink', e.target.value)} style={inputStyle} />
          </div>
        )}

        {/* FINAL CTA */}
        {activeTab === 'cta' && (
          <div>
            <label style={labelStyle}>Title</label>
            <input value={data.cta?.title || ''} onChange={(e) => update('cta', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Text</label>
            <textarea value={data.cta?.text || ''} onChange={(e) => update('cta', 'text', e.target.value)} rows={3} style={inputStyle} />
            <label style={labelStyle}>Button 1 Text</label>
            <input value={data.cta?.button1Text || ''} onChange={(e) => update('cta', 'button1Text', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Button 1 Link</label>
            <input value={data.cta?.button1Link || ''} onChange={(e) => update('cta', 'button1Link', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Button 2 Text</label>
            <input value={data.cta?.button2Text || ''} onChange={(e) => update('cta', 'button2Text', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Button 2 Link</label>
            <input value={data.cta?.button2Link || ''} onChange={(e) => update('cta', 'button2Link', e.target.value)} style={inputStyle} />
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
              <i className="fas fa-save" /> Save Impact Page
            </>
          )}
        </button>
      </div>
    </div>
  );
}