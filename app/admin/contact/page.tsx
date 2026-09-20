'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminContactPage() {
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
    fetch('/api/contact')
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
      const res = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'Contact page saved successfully!' });
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

  /* MAIN INFO CARDS */
  const mainCardChange = (i: number, key: string, value: any) => {
    setData((prev: any) => {
      const cards = [...(prev.mainInfo?.cards || [])];
      if (cards[i]) cards[i] = { ...cards[i], [key]: value };
      return { ...prev, mainInfo: { ...(prev.mainInfo || {}), cards } };
    });
  };
  const mainLineChange = (i: number, li: number, value: string) => {
    setData((prev: any) => {
      const cards = [...(prev.mainInfo?.cards || [])];
      if (cards[i]) {
        const lines = [...(cards[i].lines || [])];
        lines[li] = value;
        cards[i] = { ...cards[i], lines };
      }
      return { ...prev, mainInfo: { ...(prev.mainInfo || {}), cards } };
    });
  };
  const mainLineAdd = (i: number) => {
    setData((prev: any) => {
      const cards = [...(prev.mainInfo?.cards || [])];
      if (cards[i]) cards[i] = { ...cards[i], lines: [...(cards[i].lines || []), ''] };
      return { ...prev, mainInfo: { ...(prev.mainInfo || {}), cards } };
    });
  };
  const mainLineRemove = (i: number, li: number) => {
    setData((prev: any) => {
      const cards = [...(prev.mainInfo?.cards || [])];
      if (cards[i]) {
        const lines = [...(cards[i].lines || [])];
        lines.splice(li, 1);
        cards[i] = { ...cards[i], lines };
      }
      return { ...prev, mainInfo: { ...(prev.mainInfo || {}), cards } };
    });
  };
  const mainBtnChange = (i: number, bi: number, key: string, value: any) => {
    setData((prev: any) => {
      const cards = [...(prev.mainInfo?.cards || [])];
      if (cards[i]) {
        const buttons = [...(cards[i].buttons || [])];
        if (buttons[bi]) buttons[bi] = { ...buttons[bi], [key]: value };
        cards[i] = { ...cards[i], buttons };
      }
      return { ...prev, mainInfo: { ...(prev.mainInfo || {}), cards } };
    });
  };

  /* DEPARTMENTS */
  const deptChange = (i: number, key: string, value: any) => {
    setData((prev: any) => {
      const items = [...(prev.departments?.items || [])];
      if (items[i]) items[i] = { ...items[i], [key]: value };
      return { ...prev, departments: { ...(prev.departments || {}), items } };
    });
  };
  const deptAdd = () => {
    setData((prev: any) => ({
      ...prev,
      departments: {
        ...(prev.departments || {}),
        items: [
          ...(prev.departments?.items || []),
          {
            id: `dept-${Date.now()}`,
            icon: 'fas fa-envelope',
            accent: '#0D9488',
            title: 'New Department',
            email: 'department@limnguenfoundation.org',
            text: 'Short description of this department.',
          },
        ],
      },
    }));
  };
  const deptRemove = (i: number) => {
    const title = data.departments?.items?.[i]?.title || 'this department';
    if (!confirm(`Delete "${title}"?`)) return;
    setData((prev: any) => {
      const items = [...(prev.departments?.items || [])];
      items.splice(i, 1);
      return { ...prev, departments: { ...(prev.departments || {}), items } };
    });
  };
  const deptMove = (i: number, dir: -1 | 1) => {
    setData((prev: any) => {
      const items = [...(prev.departments?.items || [])];
      const newIdx = i + dir;
      if (newIdx < 0 || newIdx >= items.length) return prev;
      const [item] = items.splice(i, 1);
      items.splice(newIdx, 0, item);
      return { ...prev, departments: { ...(prev.departments || {}), items } };
    });
  };

  /* QUICK HELP */
  const helpChange = (i: number, key: string, value: any) => {
    setData((prev: any) => {
      const items = [...(prev.quickHelp?.items || [])];
      if (items[i]) items[i] = { ...items[i], [key]: value };
      return { ...prev, quickHelp: { ...(prev.quickHelp || {}), items } };
    });
  };

  /* SOCIAL */
  const socialChange = (i: number, key: string, value: any) => {
    setData((prev: any) => {
      const links = [...(prev.social?.links || [])];
      if (links[i]) links[i] = { ...links[i], [key]: value };
      return { ...prev, social: { ...(prev.social || {}), links } };
    });
  };
  const socialAdd = () => {
    setData((prev: any) => ({
      ...prev,
      social: {
        ...(prev.social || {}),
        links: [
          ...(prev.social?.links || []),
          { icon: 'fas fa-link', label: 'New Link', url: '' },
        ],
      },
    }));
  };
  const socialRemove = (i: number) => {
    setData((prev: any) => {
      const links = [...(prev.social?.links || [])];
      links.splice(i, 1);
      return { ...prev, social: { ...(prev.social || {}), links } };
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
        Loading Contact page…
      </div>
    );
  }

  /* STYLES */
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

  const tabs = ['hero', 'mainInfo', 'departments', 'form', 'map', 'quickHelp', 'social', 'cta'];

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
          Edit Contact Page
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>
          Manage every section, department, and social link on the Contact page.
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

        {/* MAIN INFO */}
        {activeTab === 'mainInfo' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.mainInfo?.eyebrow || ''} onChange={(e) => update('mainInfo', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.mainInfo?.title || ''} onChange={(e) => update('mainInfo', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.mainInfo?.subtitle || ''} onChange={(e) => update('mainInfo', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Contact Cards</h4>

            {(data.mainInfo?.cards || []).map((c: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 16, marginBottom: 14, background: '#FAFAFA' }}>
                <strong style={{ display: 'block', marginBottom: 12, color: '#0A0F1F' }}>
                  Card {i + 1}: {c.title}
                </strong>

                <label style={labelStyle}>Icon</label>
                <input value={c.icon || ''} onChange={(e) => mainCardChange(i, 'icon', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Title</label>
                <input value={c.title || ''} onChange={(e) => mainCardChange(i, 'title', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Accent Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
                  <input
                    type="color"
                    value={c.accent || '#0D9488'}
                    onChange={(e) => mainCardChange(i, 'accent', e.target.value)}
                    style={{ width: 56, height: 40, border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <input value={c.accent || ''} onChange={(e) => mainCardChange(i, 'accent', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                </div>

                <label style={labelStyle}>Lines</label>
                {(c.lines || []).map((line: string, li: number) => (
                  <div key={li} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input
                      value={line}
                      onChange={(e) => mainLineChange(i, li, e.target.value)}
                      style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                    />
                    <button type="button" onClick={() => mainLineRemove(i, li)} style={dangerBtn}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => mainLineAdd(i)} style={smallBtn}>
                  + Add Line
                </button>

                {c.buttons?.length > 0 && (
                  <>
                    <label style={{ ...labelStyle, marginTop: 16 }}>Buttons</label>
                    {c.buttons.map((b: any, bi: number) => (
                      <div
                        key={bi}
                        style={{
                          border: '1px solid #E5E7EB',
                          borderRadius: 10,
                          padding: 10,
                          marginBottom: 8,
                          background: '#fff',
                        }}
                      >
                        <input
                          value={b.text || ''}
                          onChange={(e) => mainBtnChange(i, bi, 'text', e.target.value)}
                          placeholder="Button text"
                          style={{ ...inputStyle, marginBottom: 8 }}
                        />
                        <input
                          value={b.icon || ''}
                          onChange={(e) => mainBtnChange(i, bi, 'icon', e.target.value)}
                          placeholder="fas fa-phone"
                          style={{ ...inputStyle, marginBottom: 8 }}
                        />
                        <input
                          value={b.url || ''}
                          onChange={(e) => mainBtnChange(i, bi, 'url', e.target.value)}
                          placeholder="https://… or tel:…"
                          style={{ ...inputStyle, marginBottom: 8 }}
                        />
                        <input
                          value={b.style || ''}
                          onChange={(e) => mainBtnChange(i, bi, 'style', e.target.value)}
                          placeholder="primary | whatsapp"
                          style={{ ...inputStyle, marginBottom: 0 }}
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.departments?.eyebrow || ''} onChange={(e) => update('departments', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.departments?.title || ''} onChange={(e) => update('departments', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.departments?.subtitle || ''} onChange={(e) => update('departments', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 12 }}>
              <h4 style={{ margin: 0 }}>Departments ({(data.departments?.items || []).length})</h4>
              <button type="button" onClick={deptAdd} style={goldBtn}>
                + Add Department
              </button>
            </div>

            {(data.departments?.items || []).map((d: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 16, marginBottom: 14, background: '#FAFAFA' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <strong style={{ color: '#0A0F1F' }}>
                    Department {i + 1}: {d.title}
                  </strong>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button type="button" onClick={() => deptMove(i, -1)} disabled={i === 0} style={{ ...smallBtn, opacity: i === 0 ? 0.4 : 1 }}>↑</button>
                    <button type="button" onClick={() => deptMove(i, 1)} disabled={i === (data.departments?.items || []).length - 1} style={{ ...smallBtn, opacity: i === (data.departments?.items || []).length - 1 ? 0.4 : 1 }}>↓</button>
                    <button type="button" onClick={() => deptRemove(i)} style={dangerBtn}>Delete</button>
                  </div>
                </div>

                <label style={labelStyle}>Icon</label>
                <input value={d.icon || ''} onChange={(e) => deptChange(i, 'icon', e.target.value)} placeholder="fas fa-envelope" style={inputStyle} />

                <label style={labelStyle}>Title</label>
                <input value={d.title || ''} onChange={(e) => deptChange(i, 'title', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Email</label>
                <input value={d.email || ''} onChange={(e) => deptChange(i, 'email', e.target.value)} placeholder="dept@limnguenfoundation.org" style={inputStyle} />

                <label style={labelStyle}>Description</label>
                <textarea value={d.text || ''} onChange={(e) => deptChange(i, 'text', e.target.value)} rows={2} style={inputStyle} />

                <label style={labelStyle}>Accent Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={d.accent || '#0D9488'}
                    onChange={(e) => deptChange(i, 'accent', e.target.value)}
                    style={{ width: 56, height: 40, border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <input value={d.accent || ''} onChange={(e) => deptChange(i, 'accent', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                </div>
              </div>
            ))}
          </div>
        )}

               {/* FORM */}
        {activeTab === 'form' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.form?.eyebrow || ''} onChange={(e) => update('form', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.form?.title || ''} onChange={(e) => update('form', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.form?.subtitle || ''} onChange={(e) => update('form', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            {/* ⭐ Web3Forms Access Key */}
            <div
              style={{
                marginTop: 20,
                padding: 18,
                background: '#F0FDFA',
                border: '1.5px solid #99F6E4',
                borderRadius: 12,
                marginBottom: 20,
              }}
            >
              <h4 style={{ margin: '0 0 6px', color: '#0F766E', fontSize: '0.95rem' }}>
                <i className="fas fa-key" style={{ marginRight: 8 }} />
                Web3Forms Access Key
              </h4>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: '#0F766E',
                  margin: '0 0 12px',
                  lineHeight: 1.5,
                }}
              >
                This key is required for the contact form to actually send emails. Get a free key at{' '}
                <a
                  href="https://web3forms.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0D9488', fontWeight: 700, textDecoration: 'underline' }}
                >
                  web3forms.com
                </a>
                . Submissions will be emailed to the address you register there.
              </p>

              <label style={labelStyle}>Access Key</label>
              <input
                value={data.form?.web3formsKey || ''}
                onChange={(e) => update('form', 'web3formsKey', e.target.value)}
                placeholder="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
                style={{
                  ...inputStyle,
                  fontFamily: 'monospace',
                  letterSpacing: '0.5px',
                  marginBottom: 0,
                }}
              />

              {data.form?.web3formsKey ? (
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#059669',
                    margin: '8px 0 0',
                    fontWeight: 600,
                  }}
                >
                  <i className="fas fa-check-circle" style={{ marginRight: 6 }} />
                  Key is set — the contact form is active.
                </p>
              ) : (
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#DC2626',
                    margin: '8px 0 0',
                    fontWeight: 600,
                  }}
                >
                  <i className="fas fa-exclamation-circle" style={{ marginRight: 6 }} />
                  No key set — the contact form will not send emails yet.
                </p>
              )}
            </div>

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Field Labels & Placeholders</h4>

            <label style={labelStyle}>Name Label</label>
            <input value={data.form?.fields?.nameLabel || ''} onChange={(e) => update('form', 'fields', { ...data.form?.fields, nameLabel: e.target.value })} style={inputStyle} />

            <label style={labelStyle}>Name Placeholder</label>
            <input value={data.form?.fields?.namePlaceholder || ''} onChange={(e) => update('form', 'fields', { ...data.form?.fields, namePlaceholder: e.target.value })} style={inputStyle} />

            <label style={labelStyle}>Email Label</label>
            <input value={data.form?.fields?.emailLabel || ''} onChange={(e) => update('form', 'fields', { ...data.form?.fields, emailLabel: e.target.value })} style={inputStyle} />

            <label style={labelStyle}>Email Placeholder</label>
            <input value={data.form?.fields?.emailPlaceholder || ''} onChange={(e) => update('form', 'fields', { ...data.form?.fields, emailPlaceholder: e.target.value })} style={inputStyle} />

            <label style={labelStyle}>Subject Label</label>
            <input value={data.form?.fields?.subjectLabel || ''} onChange={(e) => update('form', 'fields', { ...data.form?.fields, subjectLabel: e.target.value })} style={inputStyle} />

            <label style={labelStyle}>Subject Placeholder</label>
            <input value={data.form?.fields?.subjectPlaceholder || ''} onChange={(e) => update('form', 'fields', { ...data.form?.fields, subjectPlaceholder: e.target.value })} style={inputStyle} />

            <label style={labelStyle}>Department Label</label>
            <input value={data.form?.fields?.departmentLabel || ''} onChange={(e) => update('form', 'fields', { ...data.form?.fields, departmentLabel: e.target.value })} style={inputStyle} />

            <label style={labelStyle}>Message Label</label>
            <input value={data.form?.fields?.messageLabel || ''} onChange={(e) => update('form', 'fields', { ...data.form?.fields, messageLabel: e.target.value })} style={inputStyle} />

            <label style={labelStyle}>Message Placeholder</label>
            <input value={data.form?.fields?.messagePlaceholder || ''} onChange={(e) => update('form', 'fields', { ...data.form?.fields, messagePlaceholder: e.target.value })} style={inputStyle} />

            <label style={labelStyle}>Submit Button Text</label>
            <input value={data.form?.submitText || ''} onChange={(e) => update('form', 'submitText', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 24, marginBottom: 12 }}>Success Message</h4>

            <label style={labelStyle}>Success Title</label>
            <input value={data.form?.successTitle || ''} onChange={(e) => update('form', 'successTitle', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Success Message</label>
            <textarea value={data.form?.successMessage || ''} onChange={(e) => update('form', 'successMessage', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 24, marginBottom: 12 }}>Error Message</h4>

            <label style={labelStyle}>Error Title</label>
            <input value={data.form?.errorTitle || ''} onChange={(e) => update('form', 'errorTitle', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Error Message</label>
            <textarea value={data.form?.errorMessage || ''} onChange={(e) => update('form', 'errorMessage', e.target.value)} rows={2} style={inputStyle} />
          </div>
        )}

        {/* MAP */}
        {activeTab === 'map' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.map?.eyebrow || ''} onChange={(e) => update('map', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.map?.title || ''} onChange={(e) => update('map', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Address</label>
            <textarea value={data.map?.address || ''} onChange={(e) => update('map', 'address', e.target.value)} rows={2} style={inputStyle} />

            <label style={labelStyle}>Google Maps Embed URL</label>
            <input value={data.map?.embedUrl || ''} onChange={(e) => update('map', 'embedUrl', e.target.value)} placeholder="https://www.google.com/maps?q=...&output=embed" style={inputStyle} />
            <p style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: -6, marginBottom: 14 }}>
              Tip: On Google Maps, search your location → Share → Embed a map → copy the <code>src</code> URL from the iframe.
            </p>

            <label style={labelStyle}>Directions URL</label>
            <input value={data.map?.directionsUrl || ''} onChange={(e) => update('map', 'directionsUrl', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Directions Button Text</label>
            <input value={data.map?.directionsText || ''} onChange={(e) => update('map', 'directionsText', e.target.value)} style={inputStyle} />
          </div>
        )}

        {/* QUICK HELP */}
        {activeTab === 'quickHelp' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.quickHelp?.eyebrow || ''} onChange={(e) => update('quickHelp', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.quickHelp?.title || ''} onChange={(e) => update('quickHelp', 'title', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Cards</h4>

            {(data.quickHelp?.items || []).map((h: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 16, marginBottom: 14, background: '#FAFAFA' }}>
                <strong style={{ display: 'block', marginBottom: 12, color: '#0A0F1F' }}>
                  Card {i + 1}: {h.title}
                </strong>

                <label style={labelStyle}>Icon</label>
                <input value={h.icon || ''} onChange={(e) => helpChange(i, 'icon', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Title</label>
                <input value={h.title || ''} onChange={(e) => helpChange(i, 'title', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Text</label>
                <textarea value={h.text || ''} onChange={(e) => helpChange(i, 'text', e.target.value)} rows={2} style={inputStyle} />

                <label style={labelStyle}>Button Text</label>
                <input value={h.buttonText || ''} onChange={(e) => helpChange(i, 'buttonText', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Button Link</label>
                <input value={h.buttonLink || ''} onChange={(e) => helpChange(i, 'buttonLink', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Accent Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={h.accent || '#0D9488'}
                    onChange={(e) => helpChange(i, 'accent', e.target.value)}
                    style={{ width: 56, height: 40, border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <input value={h.accent || ''} onChange={(e) => helpChange(i, 'accent', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SOCIAL */}
        {activeTab === 'social' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.social?.eyebrow || ''} onChange={(e) => update('social', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.social?.title || ''} onChange={(e) => update('social', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.social?.subtitle || ''} onChange={(e) => update('social', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 12 }}>
              <h4 style={{ margin: 0 }}>Social Links</h4>
              <button type="button" onClick={socialAdd} style={goldBtn}>
                + Add Link
              </button>
            </div>

            {(data.social?.links || []).map((s: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 12, background: '#FAFAFA' }}>
                <label style={labelStyle}>Icon (FontAwesome class)</label>
                <input value={s.icon || ''} onChange={(e) => socialChange(i, 'icon', e.target.value)} placeholder="fab fa-facebook-f" style={inputStyle} />

                <label style={labelStyle}>Label</label>
                <input value={s.label || ''} onChange={(e) => socialChange(i, 'label', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>URL (leave empty to disable)</label>
                <input value={s.url || ''} onChange={(e) => socialChange(i, 'url', e.target.value)} placeholder="https://…" style={inputStyle} />

                <button type="button" onClick={() => socialRemove(i)} style={dangerBtn}>
                  Remove Link
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
            <textarea value={data.cta?.text || ''} onChange={(e) => update('cta', 'text', e.target.value)} rows={2} style={inputStyle} />

            <label style={labelStyle}>Phone (display)</label>
            <input value={data.cta?.phone || ''} onChange={(e) => update('cta', 'phone', e.target.value)} placeholder="+211 927 960 466" style={inputStyle} />

            <label style={labelStyle}>Phone Link (tel:…)</label>
            <input value={data.cta?.phoneLink || ''} onChange={(e) => update('cta', 'phoneLink', e.target.value)} placeholder="tel:+211927960466" style={inputStyle} />

            <label style={labelStyle}>Email (display)</label>
            <input value={data.cta?.email || ''} onChange={(e) => update('cta', 'email', e.target.value)} placeholder="info@limnguenfoundation.org" style={inputStyle} />

            <label style={labelStyle}>Email Link (mailto:…)</label>
            <input value={data.cta?.emailLink || ''} onChange={(e) => update('cta', 'emailLink', e.target.value)} placeholder="mailto:info@limnguenfoundation.org" style={inputStyle} />
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
              <i className="fas fa-save" /> Save Contact Page
            </>
          )}
        </button>
      </div>
    </div>
  );
}