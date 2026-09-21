'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminResourcesPage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('hero');

  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const pendingImageRef = useRef<((url: string) => void) | null>(null);
  const pendingDocRef = useRef<((res: { url: string; fileType: string; fileSize: string }) => void) | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    fetch('/api/resources')
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
      const res = await fetch('/api/resources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'Resources page saved successfully!' });
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

  const catChange = (index: number, key: string, value: any) => {
    setData((prev: any) => {
      const items = [...(prev.categories?.items || [])];
      if (items[index]) items[index] = { ...items[index], [key]: value };
      return { ...prev, categories: { ...(prev.categories || {}), items } };
    });
  };

  const transChange = (index: number, key: string, value: any) => {
    setData((prev: any) => {
      const items = [...(prev.transparency?.items || [])];
      if (items[index]) items[index] = { ...items[index], [key]: value };
      return { ...prev, transparency: { ...(prev.transparency || {}), items } };
    });
  };

  /* ---------- RESOURCE HELPERS ---------- */
  const resChange = (index: number, key: string, value: any) => {
    setData((prev: any) => {
      const arr = [...(prev.resources || [])];
      if (arr[index]) arr[index] = { ...arr[index], [key]: value };
      return { ...prev, resources: arr };
    });
  };

  const resAdd = () => {
    const newId = `resource-${Date.now()}`;
    setData((prev: any) => ({
      ...prev,
      resources: [
        ...(prev.resources || []),
        {
          id: newId,
          title: 'New Resource',
          description: 'Short description of this document…',
          category: (prev.categories?.items?.[0]?.id) || 'annual-reports',
          fileUrl: '',
          fileType: '',
          fileSize: '',
          date: '',
        },
      ],
    }));
    setToast({ type: 'success', text: 'New resource added — scroll down to edit and upload its file.' });
  };

  const resRemove = (index: number) => {
    const title = data.resources?.[index]?.title || 'this resource';
    if (!confirm(`Delete "${title}"?`)) return;
    setData((prev: any) => {
      const arr = [...(prev.resources || [])];
      arr.splice(index, 1);
      return { ...prev, resources: arr };
    });
  };

  const resMove = (index: number, dir: -1 | 1) => {
    setData((prev: any) => {
      const arr = [...(prev.resources || [])];
      const newIdx = index + dir;
      if (newIdx < 0 || newIdx >= arr.length) return prev;
      const [item] = arr.splice(index, 1);
      arr.splice(newIdx, 0, item);
      return { ...prev, resources: arr };
    });
  };

  /* ---------- UPLOADS ---------- */
  const triggerImageUpload = (cb: (url: string) => void) => {
    pendingImageRef.current = cb;
    imageInputRef.current?.click();
  };

  const triggerDocUpload = (cb: (res: { url: string; fileType: string; fileSize: string }) => void) => {
    pendingDocRef.current = cb;
    docInputRef.current?.click();
  };

  const onImageChosen = async () => {
    const file = imageInputRef.current?.files?.[0];
    if (!file || !pendingImageRef.current) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const result = await res.json();
      if (result.url) {
        pendingImageRef.current(result.url);
        setToast({ type: 'success', text: 'Image uploaded!' });
      } else {
        setToast({ type: 'error', text: result.error || 'Upload failed' });
      }
    } catch {
      setToast({ type: 'error', text: 'Upload failed' });
    } finally {
      if (imageInputRef.current) imageInputRef.current.value = '';
      pendingImageRef.current = null;
    }
  };

  const onDocChosen = async () => {
    const file = docInputRef.current?.files?.[0];
    if (!file || !pendingDocRef.current) return;

    try {
      // Upload directly to Vercel Blob — bypasses Vercel's 4.5 MB serverless limit
      const { upload } = await import('@vercel/blob/client');

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const blob = await upload(`documents/${Date.now()}-${safeName}`, file, {
        access: 'public',
        handleUploadUrl: '/api/upload-document',
      });

      // Compute size label
      const sizeKB = file.size / 1024;
      const sizeMB = sizeKB / 1024;
      const sizeLabel =
        sizeMB >= 1
          ? `${sizeMB.toFixed(1)} MB`
          : `${Math.max(1, Math.round(sizeKB))} KB`;
      const ext = (file.name.split('.').pop() || '').toUpperCase();

      pendingDocRef.current({
        url: blob.url,
        fileType: ext,
        fileSize: sizeLabel,
      });
      setToast({ type: 'success', text: 'Document uploaded!' });
    } catch (err: any) {
      console.error('Upload failed:', err);
      setToast({ type: 'error', text: err?.message || 'Upload failed' });
    } finally {
      if (docInputRef.current) docInputRef.current.value = '';
      pendingDocRef.current = null;
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: 'Poppins, sans-serif', padding: 40 }}>Loading Resources page…</div>
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

  const tabs = ['hero', 'categories', 'library', 'resources', 'transparency', 'cta'];
  const resources: any[] = data.resources || [];
  const categories: any[] = data.categories?.items || [];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <input type="file" ref={imageInputRef} style={{ display: 'none' }} onChange={onImageChosen} accept="image/*" />
      <input
        type="file"
        ref={docInputRef}
        style={{ display: 'none' }}
        onChange={onDocChosen}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
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
        <h1 style={{ fontSize: '1.8rem', color: '#0A0F1F', marginBottom: 6 }}>Edit Resources Page</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>
          Manage every section, category, and document on the Resources page.
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
                onClick={() => triggerImageUpload((url) => update('hero', 'backgroundImage', url))}
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

        {/* CATEGORIES */}
        {activeTab === 'categories' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.categories?.eyebrow || ''} onChange={(e) => update('categories', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.categories?.title || ''} onChange={(e) => update('categories', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.categories?.subtitle || ''} onChange={(e) => update('categories', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Categories</h4>

            {categories.map((c: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 12, background: '#FAFAFA' }}>
                <label style={labelStyle}>ID (used to link resources to this category)</label>
                <input value={c.id || ''} onChange={(e) => catChange(i, 'id', e.target.value)} placeholder="annual-reports" style={inputStyle} />

                <label style={labelStyle}>Icon (FontAwesome class)</label>
                <input value={c.icon || ''} onChange={(e) => catChange(i, 'icon', e.target.value)} placeholder="fas fa-file-alt" style={inputStyle} />

                <label style={labelStyle}>Title</label>
                <input value={c.title || ''} onChange={(e) => catChange(i, 'title', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Description</label>
                <textarea value={c.text || ''} onChange={(e) => catChange(i, 'text', e.target.value)} rows={2} style={inputStyle} />

                <label style={labelStyle}>Accent Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={c.accent || '#0D9488'}
                    onChange={(e) => catChange(i, 'accent', e.target.value)}
                    style={{ width: 56, height: 40, border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <input value={c.accent || ''} onChange={(e) => catChange(i, 'accent', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LIBRARY HEADERS */}
        {activeTab === 'library' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.library?.eyebrow || ''} onChange={(e) => update('library', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.library?.title || ''} onChange={(e) => update('library', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.library?.subtitle || ''} onChange={(e) => update('library', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <label style={labelStyle}>Search Placeholder</label>
            <input value={data.library?.searchPlaceholder || ''} onChange={(e) => update('library', 'searchPlaceholder', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>"All" Filter Label</label>
            <input value={data.library?.allLabel || ''} onChange={(e) => update('library', 'allLabel', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Empty State Title</label>
            <input value={data.library?.emptyTitle || ''} onChange={(e) => update('library', 'emptyTitle', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Empty State Text</label>
            <textarea value={data.library?.emptyText || ''} onChange={(e) => update('library', 'emptyText', e.target.value)} rows={2} style={inputStyle} />
          </div>
        )}

        {/* RESOURCES */}
        {activeTab === 'resources' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 18,
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <h4 style={{ margin: 0, color: '#0A0F1F' }}>Documents ({resources.length})</h4>
              <button type="button" onClick={resAdd} style={goldBtn}>
                + Add Resource
              </button>
            </div>

            {resources.length === 0 && (
              <p
                style={{
                  color: '#6B7280',
                  textAlign: 'center',
                  padding: 32,
                  background: '#FAFAFA',
                  borderRadius: 12,
                  border: '1px dashed #E5E7EB',
                }}
              >
                No resources yet. Click <strong>+ Add Resource</strong> above to upload your first document.
              </p>
            )}

            {resources.map((r: any, i: number) => (
              <div
                key={r.id || i}
                style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  padding: 18,
                  marginBottom: 16,
                  background: '#FAFAFA',
                }}
              >
                {/* HEADER ROW */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                    gap: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: '#0A0F1F',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>
                    <strong
                      style={{
                        color: '#0A0F1F',
                        fontSize: '0.95rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 280,
                      }}
                    >
                      {r.title || 'Untitled'}
                    </strong>
                    {r.fileType && (
                      <span
                        style={{
                          background: '#E0F2F1',
                          color: '#0D9488',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: 6,
                          letterSpacing: 0.5,
                        }}
                      >
                        {r.fileType}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => resMove(i, -1)}
                      disabled={i === 0}
                      style={{ ...smallBtn, opacity: i === 0 ? 0.4 : 1 }}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => resMove(i, 1)}
                      disabled={i === resources.length - 1}
                      style={{ ...smallBtn, opacity: i === resources.length - 1 ? 0.4 : 1 }}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button type="button" onClick={() => resRemove(i)} style={dangerBtn}>
                      Delete
                    </button>
                  </div>
                </div>

                {/* FIELDS */}
                <label style={labelStyle}>Title</label>
                <input value={r.title || ''} onChange={(e) => resChange(i, 'title', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Description</label>
                <textarea
                  value={r.description || ''}
                  onChange={(e) => resChange(i, 'description', e.target.value)}
                  rows={2}
                  style={inputStyle}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select
                      value={r.category || ''}
                      onChange={(e) => resChange(i, 'category', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="">— Select —</option>
                      {categories.map((c: any) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Date (optional)</label>
                    <input
                      value={r.date || ''}
                      onChange={(e) => resChange(i, 'date', e.target.value)}
                      placeholder="Jan 2026"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* FILE UPLOAD */}
                <label style={labelStyle}>Document File (PDF, Word, Excel, PowerPoint)</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  <input
                    value={r.fileUrl || ''}
                    onChange={(e) => resChange(i, 'fileUrl', e.target.value)}
                    placeholder="/uploads/my-file.pdf"
                    style={{ ...inputStyle, marginBottom: 0, flex: 1, minWidth: 200 }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      triggerDocUpload((res) => {
                        resChange(i, 'fileUrl', res.url);
                        resChange(i, 'fileType', res.fileType);
                        resChange(i, 'fileSize', res.fileSize);
                      })
                    }
                    style={tealBtn}
                  >
                    <i className="fas fa-upload" style={{ marginRight: 6 }} /> Upload File
                  </button>
                </div>

                {r.fileUrl && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      background: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: 10,
                      fontSize: '0.82rem',
                      color: '#374151',
                      marginBottom: 14,
                    }}
                  >
                    <i className="fas fa-file-alt" style={{ color: '#0D9488' }} />
                    <span style={{ flex: 1, wordBreak: 'break-all' }}>{r.fileUrl}</span>
                    <a
                      href={r.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#0D9488', fontWeight: 700, textDecoration: 'none' }}
                    >
                      Preview ↗
                    </a>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>File Type (auto-filled)</label>
                    <input
                      value={r.fileType || ''}
                      onChange={(e) => resChange(i, 'fileType', e.target.value)}
                      placeholder="PDF"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>File Size (auto-filled)</label>
                    <input
                      value={r.fileSize || ''}
                      onChange={(e) => resChange(i, 'fileSize', e.target.value)}
                      placeholder="2.4 MB"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            ))}

            {resources.length > 0 && (
              <button type="button" onClick={resAdd} style={{ ...goldBtn, marginTop: 8 }}>
                + Add Resource
              </button>
            )}
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

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Transparency Cards</h4>

            {(data.transparency?.items || []).map((t: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 12, background: '#FAFAFA' }}>
                <label style={labelStyle}>Icon</label>
                <input value={t.icon || ''} onChange={(e) => transChange(i, 'icon', e.target.value)} placeholder="fas fa-file-alt" style={inputStyle} />

                <label style={labelStyle}>Title</label>
                <input value={t.title || ''} onChange={(e) => transChange(i, 'title', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Text</label>
                <textarea value={t.text || ''} onChange={(e) => transChange(i, 'text', e.target.value)} rows={2} style={inputStyle} />
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

            <label style={labelStyle}>Button Text</label>
            <input value={data.cta?.buttonText || ''} onChange={(e) => update('cta', 'buttonText', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Button Link</label>
            <input value={data.cta?.buttonLink || ''} onChange={(e) => update('cta', 'buttonLink', e.target.value)} style={inputStyle} />
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
              <i className="fas fa-save" /> Save Resources Page
            </>
          )}
        </button>
      </div>
    </div>
  );
}