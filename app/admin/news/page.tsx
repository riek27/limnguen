'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminNewsPage() {
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
    fetch('/api/news')
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
      const res = await fetch('/api/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'News page saved successfully!' });
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

  /* ---------- ARTICLE HELPERS ---------- */
  const articleChange = (index: number, key: string, value: any) => {
    setData((prev: any) => {
      const arr = [...(prev.articles || [])];
      if (arr[index]) arr[index] = { ...arr[index], [key]: value };
      return { ...prev, articles: arr };
    });
  };

  const articleAdd = () => {
    const newId = `article-${Date.now()}`;
    setData((prev: any) => ({
      ...prev,
      articles: [
        ...(prev.articles || []),
        {
          id: newId,
          featured: (prev.articles || []).length === 0,
          image: '',
          category: 'MILESTONE',
          date: '',
          title: 'New Article Title',
          excerpt: 'Short preview of the article…',
          body: 'Full article content goes here.\n\nUse blank lines to separate paragraphs.',
          tags: [],
        },
      ],
    }));
    setToast({ type: 'success', text: 'New article added — scroll down to edit it.' });
  };

  const articleRemove = (index: number) => {
    const title = data.articles?.[index]?.title || 'this article';
    if (!confirm(`Delete "${title}"?`)) return;
    setData((prev: any) => {
      const arr = [...(prev.articles || [])];
      arr.splice(index, 1);
      return { ...prev, articles: arr };
    });
  };

  const articleMove = (index: number, dir: -1 | 1) => {
    setData((prev: any) => {
      const arr = [...(prev.articles || [])];
      const newIdx = index + dir;
      if (newIdx < 0 || newIdx >= arr.length) return prev;
      const [item] = arr.splice(index, 1);
      arr.splice(newIdx, 0, item);
      return { ...prev, articles: arr };
    });
  };

  const articleSetFeatured = (index: number) => {
    setData((prev: any) => {
      const arr = (prev.articles || []).map((a: any, i: number) => ({
        ...a,
        featured: i === index,
      }));
      return { ...prev, articles: arr };
    });
  };

  /* ---------- UPLOAD ---------- */
  const triggerUpload = (callback: (url: string) => void) => {
    pendingUploadRef.current = callback;
    fileInputRef.current?.click();
  };

  const handleFileChosen = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !pendingUploadRef.current) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
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
    return <div style={{ fontFamily: 'Poppins, sans-serif', padding: 40 }}>Loading News page…</div>;
  }

  /* ---------- SHARED STYLES ---------- */
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

  const tabs = ['hero', 'latest', 'all', 'articles', 'cta'];
  const articles: any[] = data.articles || [];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Hidden file input for uploads */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChosen}
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
        <h1 style={{ fontSize: '1.8rem', color: '#0A0F1F', marginBottom: 6 }}>Edit News Page</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>
          Manage every section, article, and image on the News page.
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
                style={{
                  background: '#0D9488',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
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

        {/* LATEST */}
        {activeTab === 'latest' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.latest?.eyebrow || ''} onChange={(e) => update('latest', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.latest?.title || ''} onChange={(e) => update('latest', 'title', e.target.value)} style={inputStyle} />
          </div>
        )}

        {/* ALL */}
        {activeTab === 'all' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.all?.eyebrow || ''} onChange={(e) => update('all', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.all?.title || ''} onChange={(e) => update('all', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.all?.subtitle || ''} onChange={(e) => update('all', 'subtitle', e.target.value)} rows={2} style={inputStyle} />
          </div>
        )}

        {/* ARTICLES */}
        {activeTab === 'articles' && (
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
              <h4 style={{ margin: 0, color: '#0A0F1F' }}>
                Articles ({articles.length})
              </h4>
              <button type="button" onClick={articleAdd} style={goldBtn}>
                + Add News
              </button>
            </div>

            {articles.length === 0 && (
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
                No articles yet. Click <strong>+ Add News</strong> above to create one.
              </p>
            )}

            {articles.map((article: any, i: number) => (
              <div
                key={article.id || i}
                style={{
                  border: article.featured ? '2px solid #D4A12A' : '1px solid #E5E7EB',
                  borderRadius: 14,
                  padding: 18,
                  marginBottom: 16,
                  background: article.featured ? '#FFFDF5' : '#FAFAFA',
                }}
              >
                {/* Header row */}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: article.featured ? '#D4A12A' : '#0A0F1F',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                        fontWeight: 800,
                      }}
                    >
                      {i + 1}
                    </div>
                    <strong style={{ color: '#0A0F1F', fontSize: '0.95rem' }}>
                      {article.title || 'Untitled'}
                    </strong>
                    {article.featured && (
                      <span
                        style={{
                          background: '#D4A12A',
                          color: '#fff',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          letterSpacing: 0.5,
                        }}
                      >
                        ★ FEATURED
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => articleMove(i, -1)}
                      disabled={i === 0}
                      style={{ ...smallBtn, opacity: i === 0 ? 0.4 : 1 }}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => articleMove(i, 1)}
                      disabled={i === articles.length - 1}
                      style={{ ...smallBtn, opacity: i === articles.length - 1 ? 0.4 : 1 }}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => articleSetFeatured(i)}
                      disabled={article.featured}
                      style={{
                        ...smallBtn,
                        background: article.featured ? '#D4A12A' : 'none',
                        color: article.featured ? '#fff' : '#374151',
                        borderColor: article.featured ? '#D4A12A' : '#E5E7EB',
                      }}
                      title="Set as featured"
                    >
                      ★ Feature
                    </button>
                    <button
                      type="button"
                      onClick={() => articleRemove(i)}
                      style={dangerBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Fields */}
                <label style={labelStyle}>Title</label>
                <input
                  value={article.title || ''}
                  onChange={(e) => articleChange(i, 'title', e.target.value)}
                  style={inputStyle}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <input
                      value={article.category || ''}
                      onChange={(e) => articleChange(i, 'category', e.target.value)}
                      placeholder="MILESTONE / AWARENESS / FIELD UPDATE"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Date</label>
                    <input
                      value={article.date || ''}
                      onChange={(e) => articleChange(i, 'date', e.target.value)}
                      placeholder="Recent / August 19, 2026 / Field Report"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <label style={labelStyle}>Excerpt (short preview shown in the card)</label>
                <textarea
                  value={article.excerpt || ''}
                  onChange={(e) => articleChange(i, 'excerpt', e.target.value)}
                  rows={3}
                  style={inputStyle}
                />

                <label style={labelStyle}>
                  Full Article Body — use a blank line to separate paragraphs
                </label>
                <textarea
                  value={article.body || ''}
                  onChange={(e) => articleChange(i, 'body', e.target.value)}
                  rows={6}
                  style={inputStyle}
                />

                <label style={labelStyle}>Image URL (leave empty for text-only card)</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input
                    value={article.image || ''}
                    onChange={(e) => articleChange(i, 'image', e.target.value)}
                    placeholder="/images/news2.jpg"
                    style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => triggerUpload((url) => articleChange(i, 'image', url))}
                    style={{
                      background: '#0D9488',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <i className="fas fa-upload" style={{ marginRight: 6 }} /> Upload
                  </button>
                </div>
                {article.image && (
                  <img
                    src={article.image}
                    alt=""
                    style={{
                      maxWidth: 220,
                      borderRadius: 8,
                      border: '1px solid #E5E7EB',
                      marginBottom: 12,
                    }}
                  />
                )}

                <label style={labelStyle}>Tags (comma separated, e.g. #NCAGE,#Partnerships)</label>
                <input
                  value={(article.tags || []).join(',')}
                  onChange={(e) =>
                    articleChange(
                      i,
                      'tags',
                      e.target.value
                        .split(',')
                        .map((t: string) => t.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="#NCAGE,#Partnerships,#SouthSudan"
                  style={inputStyle}
                />
              </div>
            ))}

            {articles.length > 0 && (
              <button type="button" onClick={articleAdd} style={{ ...goldBtn, marginTop: 8 }}>
                + Add News
              </button>
            )}
          </div>
        )}

        {/* CTA */}
        {activeTab === 'cta' && (
          <div>
            <label style={labelStyle}>Title</label>
            <input value={data.cta?.title || ''} onChange={(e) => update('cta', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Text (headline line)</label>
            <input value={data.cta?.text || ''} onChange={(e) => update('cta', 'text', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.cta?.subtitle || ''} onChange={(e) => update('cta', 'subtitle', e.target.value)} rows={3} style={inputStyle} />

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
              <i className="fas fa-save" /> Save News Page
            </>
          )}
        </button>
      </div>
    </div>
  );
}