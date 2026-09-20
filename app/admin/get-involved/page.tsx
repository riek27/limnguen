'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminGetInvolvedPage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('hero');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadRef = useRef<((url: string) => void) | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    fetch('/api/get-involved')
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
      const res = await fetch('/api/get-involved', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'Get Involved page saved successfully!' });
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

  /* ---------- WAYS HELPERS ---------- */
  const wayChange = (index: number, key: string, value: any) => {
    setData((prev: any) => {
      const items = [...(prev.ways?.items || [])];
      if (items[index]) items[index] = { ...items[index], [key]: value };
      return { ...prev, ways: { ...(prev.ways || {}), items } };
    });
  };

  const wayFeatureChange = (wayIdx: number, featIdx: number, value: string) => {
    setData((prev: any) => {
      const items = [...(prev.ways?.items || [])];
      if (items[wayIdx]) {
        const features = [...(items[wayIdx].features || [])];
        features[featIdx] = value;
        items[wayIdx] = { ...items[wayIdx], features };
      }
      return { ...prev, ways: { ...(prev.ways || {}), items } };
    });
  };

  const wayFeatureAdd = (wayIdx: number) => {
    setData((prev: any) => {
      const items = [...(prev.ways?.items || [])];
      if (items[wayIdx]) {
        items[wayIdx] = {
          ...items[wayIdx],
          features: [...(items[wayIdx].features || []), ''],
        };
      }
      return { ...prev, ways: { ...(prev.ways || {}), items } };
    });
  };

  const wayFeatureRemove = (wayIdx: number, featIdx: number) => {
    setData((prev: any) => {
      const items = [...(prev.ways?.items || [])];
      if (items[wayIdx]) {
        const features = [...(items[wayIdx].features || [])];
        features.splice(featIdx, 1);
        items[wayIdx] = { ...items[wayIdx], features };
      }
      return { ...prev, ways: { ...(prev.ways || {}), items } };
    });
  };

  /* ---------- WHY KEYWORDS HELPERS ---------- */
  const keywordChange = (index: number, value: string) => {
    setData((prev: any) => {
      const keywords = [...(prev.why?.keywords || [])];
      keywords[index] = value;
      return { ...prev, why: { ...(prev.why || {}), keywords } };
    });
  };
  const keywordAdd = () => {
    setData((prev: any) => ({
      ...prev,
      why: { ...(prev.why || {}), keywords: [...(prev.why?.keywords || []), ''] },
    }));
  };
  const keywordRemove = (index: number) => {
    setData((prev: any) => {
      const keywords = [...(prev.why?.keywords || [])];
      keywords.splice(index, 1);
      return { ...prev, why: { ...(prev.why || {}), keywords } };
    });
  };

  /* ---------- SUPPORT HELPERS ---------- */
  const supportChange = (index: number, key: string, value: any) => {
    setData((prev: any) => {
      const items = [...(prev.support?.items || [])];
      if (items[index]) items[index] = { ...items[index], [key]: value };
      return { ...prev, support: { ...(prev.support || {}), items } };
    });
  };
  const supportFeatureChange = (idx: number, fi: number, value: string) => {
    setData((prev: any) => {
      const items = [...(prev.support?.items || [])];
      if (items[idx]) {
        const features = [...(items[idx].features || [])];
        features[fi] = value;
        items[idx] = { ...items[idx], features };
      }
      return { ...prev, support: { ...(prev.support || {}), items } };
    });
  };
  const supportFeatureAdd = (idx: number) => {
    setData((prev: any) => {
      const items = [...(prev.support?.items || [])];
      if (items[idx]) {
        items[idx] = { ...items[idx], features: [...(items[idx].features || []), ''] };
      }
      return { ...prev, support: { ...(prev.support || {}), items } };
    });
  };
  const supportFeatureRemove = (idx: number, fi: number) => {
    setData((prev: any) => {
      const items = [...(prev.support?.items || [])];
      if (items[idx]) {
        const features = [...(items[idx].features || [])];
        features.splice(fi, 1);
        items[idx] = { ...items[idx], features };
      }
      return { ...prev, support: { ...(prev.support || {}), items } };
    });
  };

  /* ---------- CTA BUTTON HELPERS ---------- */
  const ctaBtnChange = (index: number, key: string, value: any) => {
    setData((prev: any) => {
      const buttons = [...(prev.cta?.buttons || [])];
      if (buttons[index]) buttons[index] = { ...buttons[index], [key]: value };
      return { ...prev, cta: { ...(prev.cta || {}), buttons } };
    });
  };
  const ctaBtnAdd = () => {
    setData((prev: any) => ({
      ...prev,
      cta: {
        ...(prev.cta || {}),
        buttons: [
          ...(prev.cta?.buttons || []),
          { text: 'New Button', link: '/', icon: 'fas fa-arrow-right', style: 'outline' },
        ],
      },
    }));
  };
  const ctaBtnRemove = (index: number) => {
    setData((prev: any) => {
      const buttons = [...(prev.cta?.buttons || [])];
      buttons.splice(index, 1);
      return { ...prev, cta: { ...(prev.cta || {}), buttons } };
    });
  };

  /* ---------- UPLOAD ---------- */
  const triggerUpload = (cb: (url: string) => void) => {
    pendingUploadRef.current = cb;
    fileInputRef.current?.click();
  };
  const onFileChosen = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !pendingUploadRef.current) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const result = await res.json();
      if (result.url) {
        pendingUploadRef.current(result.url);
        setToast({ type: 'success', text: 'Image uploaded!' });
      } else {
        setToast({ type: 'error', text: result.error || 'Upload failed' });
      }
    } catch {
      setToast({ type: 'error', text: 'Upload failed' });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      pendingUploadRef.current = null;
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: 'Poppins, sans-serif', padding: 40 }}>
        Loading Get Involved page…
      </div>
    );
  }

  /* ---------- STYLES ---------- */
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
  const tabBtn = (tab: string): React.CSSProperties => ({
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
  const goldBtn: React.CSSProperties = {
    background: '#D4A12A',
    color: '#0A0F1F',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 700,
    fontFamily: 'Poppins, sans-serif',
  };
  const tealBtn: React.CSSProperties = {
    background: '#0D9488',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    fontFamily: 'Poppins, sans-serif',
  };
  const smallBtn: React.CSSProperties = {
    background: 'none',
    border: '1px solid #E5E7EB',
    color: '#374151',
    borderRadius: 8,
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 600,
  };
  const dangerBtn: React.CSSProperties = {
    background: 'none',
    border: '1px solid #EF4444',
    color: '#EF4444',
    borderRadius: 8,
    padding: '6px 12px',
    cursor: 'pointer',
    fontWeight: 600,
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.8rem',
  };

  const tabs = ['hero', 'ways', 'why', 'support', 'cta'];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onFileChosen}
        accept="image/*"
      />

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
          Edit Get Involved Page
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>
          Manage every section, card, and button on the Get Involved page.
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
              <input
                value={data.hero?.backgroundImage || ''}
                onChange={(e) => update('hero', 'backgroundImage', e.target.value)}
                style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
              />
              <button
                type="button"
                onClick={() => triggerUpload((url) => update('hero', 'backgroundImage', url))}
                style={tealBtn}
              >
                <i className="fas fa-upload" style={{ marginRight: 6 }} /> Upload
              </button>
            </div>
            {data.hero?.backgroundImage && (
              <img
                src={data.hero.backgroundImage}
                alt=""
                style={{ maxWidth: 240, borderRadius: 8, border: '1px solid #E5E7EB' }}
              />
            )}
          </div>
        )}

        {/* WAYS */}
        {activeTab === 'ways' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.ways?.eyebrow || ''} onChange={(e) => update('ways', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.ways?.title || ''} onChange={(e) => update('ways', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.ways?.subtitle || ''} onChange={(e) => update('ways', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Cards</h4>

            {(data.ways?.items || []).map((w: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 16, marginBottom: 14, background: '#FAFAFA' }}>
                <strong style={{ display: 'block', marginBottom: 12, color: '#0A0F1F' }}>
                  Card {i + 1}: {w.title}
                </strong>

                <label style={labelStyle}>Icon (FontAwesome class)</label>
                <input value={w.icon || ''} onChange={(e) => wayChange(i, 'icon', e.target.value)} placeholder="fas fa-hands-helping" style={inputStyle} />

                <label style={labelStyle}>Title</label>
                <input value={w.title || ''} onChange={(e) => wayChange(i, 'title', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Text</label>
                <textarea value={w.text || ''} onChange={(e) => wayChange(i, 'text', e.target.value)} rows={2} style={inputStyle} />

                <label style={labelStyle}>Accent Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
                  <input
                    type="color"
                    value={w.accent || '#0D9488'}
                    onChange={(e) => wayChange(i, 'accent', e.target.value)}
                    style={{ width: 56, height: 40, border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <input value={w.accent || ''} onChange={(e) => wayChange(i, 'accent', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                </div>

                <label style={labelStyle}>Features (bullet points)</label>
                {(w.features || []).map((f: string, fi: number) => (
                  <div key={fi} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input
                      value={f}
                      onChange={(e) => wayFeatureChange(i, fi, e.target.value)}
                      style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                    />
                    <button type="button" onClick={() => wayFeatureRemove(i, fi)} style={dangerBtn}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => wayFeatureAdd(i)} style={{ ...smallBtn, marginBottom: 14 }}>
                  + Add Feature
                </button>

                <label style={labelStyle}>Button Text</label>
                <input value={w.buttonText || ''} onChange={(e) => wayChange(i, 'buttonText', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Button Link</label>
                <input value={w.buttonLink || ''} onChange={(e) => wayChange(i, 'buttonLink', e.target.value)} placeholder="/contact" style={inputStyle} />
              </div>
            ))}
          </div>
        )}

        {/* WHY */}
        {activeTab === 'why' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.why?.eyebrow || ''} onChange={(e) => update('why', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.why?.title || ''} onChange={(e) => update('why', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Text</label>
            <textarea value={data.why?.text || ''} onChange={(e) => update('why', 'text', e.target.value)} rows={3} style={inputStyle} />

            <label style={labelStyle}>Keywords (pill tags)</label>
            {(data.why?.keywords || []).map((k: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  value={k}
                  onChange={(e) => keywordChange(i, e.target.value)}
                  style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                />
                <button type="button" onClick={() => keywordRemove(i)} style={dangerBtn}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={keywordAdd} style={smallBtn}>
              + Add Keyword
            </button>
          </div>
        )}

        {/* SUPPORT */}
        {activeTab === 'support' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.support?.eyebrow || ''} onChange={(e) => update('support', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.support?.title || ''} onChange={(e) => update('support', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.support?.subtitle || ''} onChange={(e) => update('support', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Support Cards</h4>

            {(data.support?.items || []).map((s: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 16, marginBottom: 14, background: '#FAFAFA' }}>
                <strong style={{ display: 'block', marginBottom: 12, color: '#0A0F1F' }}>
                  Card {i + 1}: {s.title}
                </strong>

                <label style={labelStyle}>Icon</label>
                <input value={s.icon || ''} onChange={(e) => supportChange(i, 'icon', e.target.value)} placeholder="fas fa-hands-helping" style={inputStyle} />

                <label style={labelStyle}>Title</label>
                <input value={s.title || ''} onChange={(e) => supportChange(i, 'title', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Accent Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
                  <input
                    type="color"
                    value={s.accent || '#0D9488'}
                    onChange={(e) => supportChange(i, 'accent', e.target.value)}
                    style={{ width: 56, height: 40, border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <input value={s.accent || ''} onChange={(e) => supportChange(i, 'accent', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                </div>

                <label style={labelStyle}>Features</label>
                {(s.features || []).map((f: string, fi: number) => (
                  <div key={fi} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input
                      value={f}
                      onChange={(e) => supportFeatureChange(i, fi, e.target.value)}
                      style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                    />
                    <button type="button" onClick={() => supportFeatureRemove(i, fi)} style={dangerBtn}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => supportFeatureAdd(i)} style={smallBtn}>
                  + Add Feature
                </button>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {activeTab === 'cta' && (
          <div>
            <label style={labelStyle}>Title</label>
            <input value={data.cta?.title || ''} onChange={(e) => update('cta', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Text</label>
            <textarea value={data.cta?.text || ''} onChange={(e) => update('cta', 'text', e.target.value)} rows={3} style={inputStyle} />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 18,
                marginBottom: 12,
              }}
            >
              <h4 style={{ margin: 0 }}>Buttons</h4>
              <button type="button" onClick={ctaBtnAdd} style={goldBtn}>
                + Add Button
              </button>
            </div>

            {(data.cta?.buttons || []).map((b: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 12, background: '#FAFAFA' }}>
                <label style={labelStyle}>Button Text</label>
                <input value={b.text || ''} onChange={(e) => ctaBtnChange(i, 'text', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Button Link</label>
                <input value={b.link || ''} onChange={(e) => ctaBtnChange(i, 'link', e.target.value)} placeholder="/contact" style={inputStyle} />

                <label style={labelStyle}>Icon (FontAwesome class)</label>
                <input value={b.icon || ''} onChange={(e) => ctaBtnChange(i, 'icon', e.target.value)} placeholder="fas fa-heart" style={inputStyle} />

                <label style={labelStyle}>Style</label>
                <select
                  value={b.style || 'outline'}
                  onChange={(e) => ctaBtnChange(i, 'style', e.target.value)}
                  style={inputStyle}
                >
                  <option value="outline">Outline (white border)</option>
                  <option value="gold">Gold (filled)</option>
                </select>

                <button type="button" onClick={() => ctaBtnRemove(i)} style={dangerBtn}>
                  Remove Button
                </button>
              </div>
            ))}
          </div>
        )}

        {/* SAVE */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{
            marginTop: 30,
            width: '100%',
            padding: 16,
            background: saving
              ? 'rgba(212,161,42,0.5)'
              : 'linear-gradient(135deg, #F5D67B, #D4A12A)',
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
              <i className="fas fa-save" /> Save Get Involved Page
            </>
          )}
        </button>
      </div>
    </div>
  );
}