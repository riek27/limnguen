'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminDonatePage() {
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
    fetch('/api/donate')
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
      const res = await fetch('/api/donate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'Donate page saved successfully!' });
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

  /* Generic array helpers (section.field = array of strings or objects) */
  const arrChange = (section: string, field: string, index: number, key: string | null, value: any) => {
    setData((prev: any) => {
      const arr = [...(prev[section]?.[field] || [])];
      if (key === null) arr[index] = value;
      else if (arr[index]) arr[index] = { ...arr[index], [key]: value };
      return { ...prev, [section]: { ...(prev[section] || {}), [field]: arr } };
    });
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

  const arrMove = (section: string, field: string, index: number, dir: -1 | 1) => {
    setData((prev: any) => {
      const arr = [...(prev[section]?.[field] || [])];
      const newIdx = index + dir;
      if (newIdx < 0 || newIdx >= arr.length) return prev;
      const [item] = arr.splice(index, 1);
      arr.splice(newIdx, 0, item);
      return { ...prev, [section]: { ...prev[section], [field]: arr } };
    });
  };

  /* UPLOAD */
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
        Loading Donate page…
      </div>
    );
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
    boxSizing: 'border-box',
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

  const tabs = [
    'hero', 'why', 'bank', 'steps', 'advance', 'impact', 'transparency', 'contact',
  ];

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
          Edit Donate Page
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>
          Manage every section, bank detail, and impact figure on the Donate page.
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

            <label style={labelStyle}>Button Text</label>
            <input value={data.hero?.buttonText || ''} onChange={(e) => update('hero', 'buttonText', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Button Link</label>
            <input value={data.hero?.buttonLink || ''} onChange={(e) => update('hero', 'buttonLink', e.target.value)} placeholder="#bank-transfer" style={inputStyle} />

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

        {/* WHY */}
        {activeTab === 'why' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.why?.eyebrow || ''} onChange={(e) => update('why', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.why?.title || ''} onChange={(e) => update('why', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.why?.subtitle || ''} onChange={(e) => update('why', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Cards</h4>

            {(data.why?.items || []).map((w: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 16, marginBottom: 14, background: '#FAFAFA' }}>
                <label style={labelStyle}>Icon</label>
                <input value={w.icon || ''} onChange={(e) => arrChange('why', 'items', i, 'icon', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Title</label>
                <input value={w.title || ''} onChange={(e) => arrChange('why', 'items', i, 'title', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Text</label>
                <textarea value={w.text || ''} onChange={(e) => arrChange('why', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />

                <label style={labelStyle}>Accent Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={w.accent || '#0D9488'}
                    onChange={(e) => arrChange('why', 'items', i, 'accent', e.target.value)}
                    style={{ width: 56, height: 40, border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <input value={w.accent || ''} onChange={(e) => arrChange('why', 'items', i, 'accent', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BANK */}
        {activeTab === 'bank' && (
          <div>
            <div
              style={{
                padding: 16,
                background: '#FEF3C7',
                border: '1.5px solid #FDE68A',
                borderRadius: 12,
                marginBottom: 20,
                fontSize: '0.85rem',
                color: '#78350F',
                lineHeight: 1.6,
              }}
            >
              <strong>⚠️ Verify all banking details before publishing.</strong> Double-check account number, beneficiary name, SWIFT/BIC, branch, and currency with LNF finance team.
            </div>

            <label style={labelStyle}>Eyebrow</label>
            <input value={data.bank?.eyebrow || ''} onChange={(e) => update('bank', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.bank?.title || ''} onChange={(e) => update('bank', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.bank?.subtitle || ''} onChange={(e) => update('bank', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Bank Details</h4>

            {(data.bank?.details || []).map((d: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 12, marginBottom: 10, background: '#FAFAFA' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
                  <input
                    value={d.label || ''}
                    onChange={(e) => arrChange('bank', 'details', i, 'label', e.target.value)}
                    placeholder="Label"
                    style={{ ...inputStyle, marginBottom: 0 }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      value={d.value || ''}
                      onChange={(e) => arrChange('bank', 'details', i, 'value', e.target.value)}
                      placeholder="Value"
                      style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                    />
                    <button type="button" onClick={() => arrRemove('bank', 'details', i)} style={dangerBtn}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => arrAdd('bank', 'details', { label: 'New Field', value: '' })}
              style={{ ...goldBtn, marginBottom: 24 }}
            >
              + Add Bank Field
            </button>

            <label style={labelStyle}>Copy Button Text</label>
            <input value={data.bank?.copyButtonText || ''} onChange={(e) => update('bank', 'copyButtonText', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Copied Feedback Text</label>
            <input value={data.bank?.copiedText || ''} onChange={(e) => update('bank', 'copiedText', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Safety Note</h4>

            <label style={labelStyle}>Note Title</label>
            <input value={data.bank?.noteTitle || ''} onChange={(e) => update('bank', 'noteTitle', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Note Text</label>
            <textarea value={data.bank?.noteText || ''} onChange={(e) => update('bank', 'noteText', e.target.value)} rows={3} style={inputStyle} />
          </div>
        )}

        {/* STEPS */}
        {activeTab === 'steps' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.steps?.eyebrow || ''} onChange={(e) => update('steps', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.steps?.title || ''} onChange={(e) => update('steps', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.steps?.subtitle || ''} onChange={(e) => update('steps', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Steps</h4>

            {(data.steps?.items || []).map((s: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 16, marginBottom: 14, background: '#FAFAFA' }}>
                <label style={labelStyle}>Number</label>
                <input value={s.number || ''} onChange={(e) => arrChange('steps', 'items', i, 'number', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Icon</label>
                <input value={s.icon || ''} onChange={(e) => arrChange('steps', 'items', i, 'icon', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Title</label>
                <input value={s.title || ''} onChange={(e) => arrChange('steps', 'items', i, 'title', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Text</label>
                <textarea value={s.text || ''} onChange={(e) => arrChange('steps', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />
              </div>
            ))}
          </div>
        )}

        {/* ADVANCE */}
        {activeTab === 'advance' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.advance?.eyebrow || ''} onChange={(e) => update('advance', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.advance?.title || ''} onChange={(e) => update('advance', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.advance?.subtitle || ''} onChange={(e) => update('advance', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Cards</h4>

            {(data.advance?.items || []).map((a: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 16, marginBottom: 14, background: '#FAFAFA' }}>
                <label style={labelStyle}>Icon</label>
                <input value={a.icon || ''} onChange={(e) => arrChange('advance', 'items', i, 'icon', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Title</label>
                <input value={a.title || ''} onChange={(e) => arrChange('advance', 'items', i, 'title', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Text</label>
                <textarea value={a.text || ''} onChange={(e) => arrChange('advance', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />
              </div>
            ))}
          </div>
        )}

        {/* IMPACT */}
        {activeTab === 'impact' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.impact?.eyebrow || ''} onChange={(e) => update('impact', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.impact?.title || ''} onChange={(e) => update('impact', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.impact?.subtitle || ''} onChange={(e) => update('impact', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Impact Stats</h4>

            {(data.impact?.items || []).map((s: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 16, marginBottom: 14, background: '#FAFAFA' }}>
                <label style={labelStyle}>Icon</label>
                <input value={s.icon || ''} onChange={(e) => arrChange('impact', 'items', i, 'icon', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Number</label>
                <input
                  type="number"
                  value={s.number || 0}
                  onChange={(e) => arrChange('impact', 'items', i, 'number', Number(e.target.value))}
                  style={inputStyle}
                />

                <label style={labelStyle}>Suffix (e.g. +)</label>
                <input value={s.suffix || ''} onChange={(e) => arrChange('impact', 'items', i, 'suffix', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Label</label>
                <input value={s.label || ''} onChange={(e) => arrChange('impact', 'items', i, 'label', e.target.value)} style={inputStyle} />
              </div>
            ))}

            <h4 style={{ marginTop: 24, marginBottom: 12 }}>CTA Button</h4>

            <label style={labelStyle}>Button Text</label>
            <input value={data.impact?.buttonText || ''} onChange={(e) => update('impact', 'buttonText', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Button Link</label>
            <input value={data.impact?.buttonLink || ''} onChange={(e) => update('impact', 'buttonLink', e.target.value)} style={inputStyle} />
          </div>
        )}

        {/* TRANSPARENCY */}
        {activeTab === 'transparency' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.transparency?.eyebrow || ''} onChange={(e) => update('transparency', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.transparency?.title || ''} onChange={(e) => update('transparency', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Text</label>
            <textarea value={data.transparency?.text || ''} onChange={(e) => update('transparency', 'text', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Pill Items</h4>

            {(data.transparency?.items || []).map((t: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input
                  value={t.icon || ''}
                  onChange={(e) => arrChange('transparency', 'items', i, 'icon', e.target.value)}
                  placeholder="Icon"
                  style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                />
                <input
                  value={t.title || ''}
                  onChange={(e) => arrChange('transparency', 'items', i, 'title', e.target.value)}
                  placeholder="Title"
                  style={{ ...inputStyle, marginBottom: 0, flex: 2 }}
                />
                <button type="button" onClick={() => arrRemove('transparency', 'items', i)} style={dangerBtn}>
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => arrAdd('transparency', 'items', { icon: 'fas fa-check', title: 'New Item' })}
              style={{ ...goldBtn, marginBottom: 20 }}
            >
              + Add Pill
            </button>

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>CTA Button</h4>

            <label style={labelStyle}>Button Text</label>
            <input value={data.transparency?.buttonText || ''} onChange={(e) => update('transparency', 'buttonText', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Button Link</label>
            <input value={data.transparency?.buttonLink || ''} onChange={(e) => update('transparency', 'buttonLink', e.target.value)} style={inputStyle} />
          </div>
        )}

        {/* CONTACT */}
        {activeTab === 'contact' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.contact?.eyebrow || ''} onChange={(e) => update('contact', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.contact?.title || ''} onChange={(e) => update('contact', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Text</label>
            <textarea value={data.contact?.text || ''} onChange={(e) => update('contact', 'text', e.target.value)} rows={2} style={inputStyle} />

            <label style={labelStyle}>Email (display)</label>
            <input value={data.contact?.email || ''} onChange={(e) => update('contact', 'email', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Email Link</label>
            <input value={data.contact?.emailLink || ''} onChange={(e) => update('contact', 'emailLink', e.target.value)} placeholder="mailto:…" style={inputStyle} />

            <label style={labelStyle}>Phone (display)</label>
            <input value={data.contact?.phone || ''} onChange={(e) => update('contact', 'phone', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Phone Link</label>
            <input value={data.contact?.phoneLink || ''} onChange={(e) => update('contact', 'phoneLink', e.target.value)} placeholder="tel:…" style={inputStyle} />

            <label style={labelStyle}>Button Text</label>
            <input value={data.contact?.buttonText || ''} onChange={(e) => update('contact', 'buttonText', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Button Link</label>
            <input value={data.contact?.buttonLink || ''} onChange={(e) => update('contact', 'buttonLink', e.target.value)} style={inputStyle} />
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
              <i className="fas fa-save" /> Save Donate Page
            </>
          )}
        </button>
      </div>
    </div>
  );
}