'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminTeamPage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('hero');
  const [activeTeamId, setActiveTeamId] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadRef = useRef<((url: string) => void) | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    fetch('/api/team')
      .then((res) => res.json())
      .then((json) => {
        setData(json && Object.keys(json).length > 0 ? json : {});
        const teams = json?.teams || [];
        if (teams[0]?.id) setActiveTeamId(teams[0].id);
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
      const res = await fetch('/api/team', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'Team page saved successfully!' });
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

  /* TEAMS */
  const teamChange = (idx: number, key: string, value: any) => {
    setData((prev: any) => {
      const teams = [...(prev.teams || [])];
      if (teams[idx]) teams[idx] = { ...teams[idx], [key]: value };
      return { ...prev, teams };
    });
  };

  const teamMove = (idx: number, dir: -1 | 1) => {
    setData((prev: any) => {
      const teams = [...(prev.teams || [])];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= teams.length) return prev;
      const [item] = teams.splice(idx, 1);
      teams.splice(newIdx, 0, item);
      return { ...prev, teams };
    });
  };

  /* MEMBERS */
  const memberChange = (teamIdx: number, memberIdx: number, key: string, value: any) => {
    setData((prev: any) => {
      const teams = [...(prev.teams || [])];
      if (teams[teamIdx]) {
        const members = [...(teams[teamIdx].members || [])];
        if (members[memberIdx]) members[memberIdx] = { ...members[memberIdx], [key]: value };
        teams[teamIdx] = { ...teams[teamIdx], members };
      }
      return { ...prev, teams };
    });
  };

  const memberAdd = (teamIdx: number) => {
    setData((prev: any) => {
      const teams = [...(prev.teams || [])];
      if (teams[teamIdx]) {
        const members = [
          ...(teams[teamIdx].members || []),
          {
            id: `member-${Date.now()}`,
            name: 'New Team Member',
            position: 'Position Title',
            photo: '',
            department: '',
            shortBio: 'Short description shown on the card.',
            fullBio: 'Full biography.\n\nUse blank lines to separate paragraphs.',
            expertise: [],
            responsibilities: [],
            education: [],
            location: '',
            email: '',
            linkedin: '',
          },
        ];
        teams[teamIdx] = { ...teams[teamIdx], members };
      }
      return { ...prev, teams };
    });
  };

  const memberRemove = (teamIdx: number, memberIdx: number) => {
    const name = data.teams?.[teamIdx]?.members?.[memberIdx]?.name || 'this member';
    if (!confirm(`Delete "${name}"?`)) return;
    setData((prev: any) => {
      const teams = [...(prev.teams || [])];
      if (teams[teamIdx]) {
        const members = [...(teams[teamIdx].members || [])];
        members.splice(memberIdx, 1);
        teams[teamIdx] = { ...teams[teamIdx], members };
      }
      return { ...prev, teams };
    });
  };

  const memberMove = (teamIdx: number, memberIdx: number, dir: -1 | 1) => {
    setData((prev: any) => {
      const teams = [...(prev.teams || [])];
      if (teams[teamIdx]) {
        const members = [...(teams[teamIdx].members || [])];
        const newIdx = memberIdx + dir;
        if (newIdx < 0 || newIdx >= members.length) return prev;
        const [item] = members.splice(memberIdx, 1);
        members.splice(newIdx, 0, item);
        teams[teamIdx] = { ...teams[teamIdx], members };
      }
      return { ...prev, teams };
    });
  };

  /* Array field helpers for member fields like expertise/responsibilities/education */
  const memberArrayChange = (teamIdx: number, memberIdx: number, key: string, arrIdx: number, value: string) => {
    setData((prev: any) => {
      const teams = [...(prev.teams || [])];
      if (teams[teamIdx]) {
        const members = [...(teams[teamIdx].members || [])];
        if (members[memberIdx]) {
          const arr = [...(members[memberIdx][key] || [])];
          arr[arrIdx] = value;
          members[memberIdx] = { ...members[memberIdx], [key]: arr };
        }
        teams[teamIdx] = { ...teams[teamIdx], members };
      }
      return { ...prev, teams };
    });
  };
  const memberArrayAdd = (teamIdx: number, memberIdx: number, key: string) => {
    setData((prev: any) => {
      const teams = [...(prev.teams || [])];
      if (teams[teamIdx]) {
        const members = [...(teams[teamIdx].members || [])];
        if (members[memberIdx]) {
          members[memberIdx] = {
            ...members[memberIdx],
            [key]: [...(members[memberIdx][key] || []), ''],
          };
        }
        teams[teamIdx] = { ...teams[teamIdx], members };
      }
      return { ...prev, teams };
    });
  };
  const memberArrayRemove = (teamIdx: number, memberIdx: number, key: string, arrIdx: number) => {
    setData((prev: any) => {
      const teams = [...(prev.teams || [])];
      if (teams[teamIdx]) {
        const members = [...(teams[teamIdx].members || [])];
        if (members[memberIdx]) {
          const arr = [...(members[memberIdx][key] || [])];
          arr.splice(arrIdx, 1);
          members[memberIdx] = { ...members[memberIdx], [key]: arr };
        }
        teams[teamIdx] = { ...teams[teamIdx], members };
      }
      return { ...prev, teams };
    });
  };

  /* TREE HELPERS */
  const treeLayerChange = (idx: number, key: string, value: any) => {
    setData((prev: any) => {
      const layers = [...(prev.tree?.layers || [])];
      if (layers[idx]) layers[idx] = { ...layers[idx], [key]: value };
      return { ...prev, tree: { ...(prev.tree || {}), layers } };
    });
  };
  const treeBranchChange = (idx: number, key: string, value: any) => {
    setData((prev: any) => {
      const branches = [...(prev.tree?.branches || [])];
      if (branches[idx]) branches[idx] = { ...branches[idx], [key]: value };
      return { ...prev, tree: { ...(prev.tree || {}), branches } };
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
        Loading Team page…
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

  const tabs = ['hero', 'tree', 'teams', 'emptyState', 'modal', 'cta'];
  const teams: any[] = data.teams || [];
  const activeTeamIdx = teams.findIndex((t) => t.id === activeTeamId);

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
          Edit People & Leadership Page
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>
          Manage the hero, organizational tree, teams, members, and CTA.
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
              <button type="button" onClick={() => triggerUpload((url) => update('hero', 'backgroundImage', url))} style={tealBtn}>
                <i className="fas fa-upload" style={{ marginRight: 6 }} /> Upload
              </button>
            </div>
            {data.hero?.backgroundImage && (
              <img src={data.hero.backgroundImage} alt="" style={{ maxWidth: 240, borderRadius: 8, border: '1px solid #E5E7EB' }} />
            )}
          </div>
        )}

        {/* TREE */}
        {activeTab === 'tree' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.tree?.eyebrow || ''} onChange={(e) => update('tree', 'eyebrow', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title</label>
            <input value={data.tree?.title || ''} onChange={(e) => update('tree', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.tree?.subtitle || ''} onChange={(e) => update('tree', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Root</h4>
            <label style={labelStyle}>Root Label</label>
            <input
              value={data.tree?.root?.label || ''}
              onChange={(e) => update('tree', 'root', { ...data.tree?.root, label: e.target.value })}
              style={inputStyle}
            />
            <label style={labelStyle}>Root Icon</label>
            <input
              value={data.tree?.root?.icon || ''}
              onChange={(e) => update('tree', 'root', { ...data.tree?.root, icon: e.target.value })}
              style={inputStyle}
            />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Layers</h4>
            {(data.tree?.layers || []).map((l: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 12, background: '#FAFAFA' }}>
                <label style={labelStyle}>Label</label>
                <input value={l.label || ''} onChange={(e) => treeLayerChange(i, 'label', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Subtitle</label>
                <input value={l.sub || ''} onChange={(e) => treeLayerChange(i, 'sub', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Icon</label>
                <input value={l.icon || ''} onChange={(e) => treeLayerChange(i, 'icon', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Accent</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={l.accent || '#0D9488'}
                    onChange={(e) => treeLayerChange(i, 'accent', e.target.value)}
                    style={{ width: 56, height: 40, border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <input value={l.accent || ''} onChange={(e) => treeLayerChange(i, 'accent', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                </div>
              </div>
            ))}

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Branches</h4>
            {(data.tree?.branches || []).map((b: any, i: number) => (
              <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 12, background: '#FAFAFA' }}>
                <label style={labelStyle}>Label</label>
                <input value={b.label || ''} onChange={(e) => treeBranchChange(i, 'label', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Icon</label>
                <input value={b.icon || ''} onChange={(e) => treeBranchChange(i, 'icon', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Accent</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={b.accent || '#0D9488'}
                    onChange={(e) => treeBranchChange(i, 'accent', e.target.value)}
                    style={{ width: 56, height: 40, border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <input value={b.accent || ''} onChange={(e) => treeBranchChange(i, 'accent', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TEAMS */}
        {activeTab === 'teams' && (
          <div>
            {/* Team selector chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {teams.map((t: any, i: number) => (
                <button
                  key={t.id || i}
                  type="button"
                  onClick={() => setActiveTeamId(t.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 999,
                    border: activeTeamId === t.id ? '2px solid #D4A12A' : '1px solid #E5E7EB',
                    background: activeTeamId === t.id ? 'linear-gradient(135deg, #F5D67B, #D4A12A)' : '#fff',
                    color: activeTeamId === t.id ? '#0A0F1F' : '#374151',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.85rem',
                  }}
                >
                  {t.title}
                  <span
                    style={{
                      marginLeft: 8,
                      background: activeTeamId === t.id ? 'rgba(0,0,0,0.08)' : '#F3F4F6',
                      borderRadius: 999,
                      padding: '1px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    {t.members?.length || 0}
                  </span>
                </button>
              ))}
            </div>

            {activeTeamIdx === -1 ? (
              <p style={{ color: '#6B7280', textAlign: 'center', padding: 24 }}>
                Select a team above to edit.
              </p>
            ) : (
              <div>
                {/* Team meta */}
                <div style={{ border: '1px solid #E5E7EB', borderRadius: 14, padding: 18, marginBottom: 22, background: '#FAFAFA' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <strong style={{ color: '#0A0F1F' }}>Team Settings</strong>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => teamMove(activeTeamIdx, -1)}
                        disabled={activeTeamIdx === 0}
                        style={{ ...smallBtn, opacity: activeTeamIdx === 0 ? 0.4 : 1 }}
                      >
                        ↑ Move Up
                      </button>
                      <button
                        type="button"
                        onClick={() => teamMove(activeTeamIdx, 1)}
                        disabled={activeTeamIdx === teams.length - 1}
                        style={{ ...smallBtn, opacity: activeTeamIdx === teams.length - 1 ? 0.4 : 1 }}
                      >
                        ↓ Move Down
                      </button>
                    </div>
                  </div>

                  <label style={labelStyle}>Title</label>
                  <input value={teams[activeTeamIdx].title || ''} onChange={(e) => teamChange(activeTeamIdx, 'title', e.target.value)} style={inputStyle} />

                  <label style={labelStyle}>Subtitle</label>
                  <textarea value={teams[activeTeamIdx].subtitle || ''} onChange={(e) => teamChange(activeTeamIdx, 'subtitle', e.target.value)} rows={2} style={inputStyle} />

                  <label style={labelStyle}>Icon</label>
                  <input value={teams[activeTeamIdx].icon || ''} onChange={(e) => teamChange(activeTeamIdx, 'icon', e.target.value)} style={inputStyle} />

                  <label style={labelStyle}>Accent Color</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="color"
                      value={teams[activeTeamIdx].accent || '#0D9488'}
                      onChange={(e) => teamChange(activeTeamIdx, 'accent', e.target.value)}
                      style={{ width: 56, height: 40, border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer' }}
                    />
                    <input value={teams[activeTeamIdx].accent || ''} onChange={(e) => teamChange(activeTeamIdx, 'accent', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                  </div>
                </div>

                {/* Members */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                  <h4 style={{ margin: 0 }}>
                    Members of {teams[activeTeamIdx].title} ({teams[activeTeamIdx].members?.length || 0})
                  </h4>
                  <button type="button" onClick={() => memberAdd(activeTeamIdx)} style={goldBtn}>
                    + Add Member
                  </button>
                </div>

                {(teams[activeTeamIdx].members || []).length === 0 && (
                  <p
                    style={{
                      color: '#6B7280',
                      textAlign: 'center',
                      padding: 28,
                      background: '#FAFAFA',
                      borderRadius: 12,
                      border: '1px dashed #E5E7EB',
                    }}
                  >
                    No members yet. Click <strong>+ Add Member</strong> to add the first one.
                  </p>
                )}

                {(teams[activeTeamIdx].members || []).map((m: any, mi: number) => (
                  <div
                    key={m.id || mi}
                    style={{
                      border: '1px solid #E5E7EB',
                      borderRadius: 14,
                      padding: 18,
                      marginBottom: 16,
                      background: '#FAFAFA',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 14,
                        flexWrap: 'wrap',
                        gap: 8,
                      }}
                    >
                      <strong style={{ color: '#0A0F1F' }}>
                        {mi + 1}. {m.name || 'Untitled'}
                      </strong>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button type="button" onClick={() => memberMove(activeTeamIdx, mi, -1)} disabled={mi === 0} style={{ ...smallBtn, opacity: mi === 0 ? 0.4 : 1 }}>↑</button>
                        <button type="button" onClick={() => memberMove(activeTeamIdx, mi, 1)} disabled={mi === (teams[activeTeamIdx].members || []).length - 1} style={{ ...smallBtn, opacity: mi === (teams[activeTeamIdx].members || []).length - 1 ? 0.4 : 1 }}>↓</button>
                        <button type="button" onClick={() => memberRemove(activeTeamIdx, mi)} style={dangerBtn}>Delete</button>
                      </div>
                    </div>

                    <label style={labelStyle}>Full Name</label>
                    <input value={m.name || ''} onChange={(e) => memberChange(activeTeamIdx, mi, 'name', e.target.value)} style={inputStyle} />

                    <label style={labelStyle}>Position / Role</label>
                    <input value={m.position || ''} onChange={(e) => memberChange(activeTeamIdx, mi, 'position', e.target.value)} style={inputStyle} />

                    <label style={labelStyle}>Department (optional)</label>
                    <input value={m.department || ''} onChange={(e) => memberChange(activeTeamIdx, mi, 'department', e.target.value)} style={inputStyle} />

                    <label style={labelStyle}>Location (optional)</label>
                    <input value={m.location || ''} onChange={(e) => memberChange(activeTeamIdx, mi, 'location', e.target.value)} placeholder="Juba, South Sudan" style={inputStyle} />

                    <label style={labelStyle}>Photo URL</label>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <input
                        value={m.photo || ''}
                        onChange={(e) => memberChange(activeTeamIdx, mi, 'photo', e.target.value)}
                        placeholder="/uploads/member.jpg (leave empty for initials)"
                        style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => triggerUpload((url) => memberChange(activeTeamIdx, mi, 'photo', url))}
                        style={tealBtn}
                      >
                        <i className="fas fa-upload" style={{ marginRight: 6 }} /> Upload
                      </button>
                    </div>
                    {m.photo && (
                      <img
                        src={m.photo}
                        alt=""
                        style={{
                          width: 90,
                          height: 90,
                          objectFit: 'cover',
                          borderRadius: 12,
                          border: '1px solid #E5E7EB',
                          marginBottom: 14,
                        }}
                      />
                    )}

                    <label style={labelStyle}>Short Bio (card)</label>
                    <textarea value={m.shortBio || ''} onChange={(e) => memberChange(activeTeamIdx, mi, 'shortBio', e.target.value)} rows={2} style={inputStyle} />

                    <label style={labelStyle}>
                      Full Bio (modal — blank line = new paragraph)
                    </label>
                    <textarea value={m.fullBio || ''} onChange={(e) => memberChange(activeTeamIdx, mi, 'fullBio', e.target.value)} rows={5} style={inputStyle} />

                    {/* Expertise */}
                    <label style={labelStyle}>Areas of Expertise</label>
                    {(m.expertise || []).map((x: string, xi: number) => (
                      <div key={xi} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input
                          value={x}
                          onChange={(e) => memberArrayChange(activeTeamIdx, mi, 'expertise', xi, e.target.value)}
                          style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                        />
                        <button type="button" onClick={() => memberArrayRemove(activeTeamIdx, mi, 'expertise', xi)} style={dangerBtn}>×</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => memberArrayAdd(activeTeamIdx, mi, 'expertise')} style={{ ...smallBtn, marginBottom: 14 }}>
                      + Add Expertise
                    </button>

                    {/* Responsibilities */}
                    <label style={labelStyle}>Responsibilities</label>
                    {(m.responsibilities || []).map((x: string, xi: number) => (
                      <div key={xi} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input
                          value={x}
                          onChange={(e) => memberArrayChange(activeTeamIdx, mi, 'responsibilities', xi, e.target.value)}
                          style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                        />
                        <button type="button" onClick={() => memberArrayRemove(activeTeamIdx, mi, 'responsibilities', xi)} style={dangerBtn}>×</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => memberArrayAdd(activeTeamIdx, mi, 'responsibilities')} style={{ ...smallBtn, marginBottom: 14 }}>
                      + Add Responsibility
                    </button>

                    {/* Education */}
                    <label style={labelStyle}>Education & Qualifications</label>
                    {(m.education || []).map((x: string, xi: number) => (
                      <div key={xi} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input
                          value={x}
                          onChange={(e) => memberArrayChange(activeTeamIdx, mi, 'education', xi, e.target.value)}
                          style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                        />
                        <button type="button" onClick={() => memberArrayRemove(activeTeamIdx, mi, 'education', xi)} style={dangerBtn}>×</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => memberArrayAdd(activeTeamIdx, mi, 'education')} style={{ ...smallBtn, marginBottom: 14 }}>
                      + Add Education
                    </button>

                    <label style={labelStyle}>Email (optional)</label>
                    <input value={m.email || ''} onChange={(e) => memberChange(activeTeamIdx, mi, 'email', e.target.value)} style={inputStyle} />

                    <label style={labelStyle}>LinkedIn URL (optional)</label>
                    <input value={m.linkedin || ''} onChange={(e) => memberChange(activeTeamIdx, mi, 'linkedin', e.target.value)} style={inputStyle} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EMPTY STATE */}
        {activeTab === 'emptyState' && (
          <div>
            <label style={labelStyle}>Empty State Title</label>
            <input value={data.emptyState?.title || ''} onChange={(e) => update('emptyState', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Empty State Text</label>
            <textarea value={data.emptyState?.text || ''} onChange={(e) => update('emptyState', 'text', e.target.value)} rows={2} style={inputStyle} />
          </div>
        )}

        {/* MODAL LABELS */}
        {activeTab === 'modal' && (
          <div>
            <label style={labelStyle}>Close Button Label (accessibility)</label>
            <input value={data.modal?.closeLabel || ''} onChange={(e) => update('modal', 'closeLabel', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Biography Section Title</label>
            <input value={data.modal?.bioTitle || ''} onChange={(e) => update('modal', 'bioTitle', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Expertise Section Title</label>
            <input value={data.modal?.expertiseTitle || ''} onChange={(e) => update('modal', 'expertiseTitle', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Responsibilities Section Title</label>
            <input value={data.modal?.responsibilitiesTitle || ''} onChange={(e) => update('modal', 'responsibilitiesTitle', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Education Section Title</label>
            <input value={data.modal?.educationTitle || ''} onChange={(e) => update('modal', 'educationTitle', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Contact Section Title</label>
            <input value={data.modal?.contactTitle || ''} onChange={(e) => update('modal', 'contactTitle', e.target.value)} style={inputStyle} />
          </div>
        )}

        {/* CTA */}
        {activeTab === 'cta' && (
          <div>
            <label style={labelStyle}>Title</label>
            <input value={data.cta?.title || ''} onChange={(e) => update('cta', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Text</label>
            <textarea value={data.cta?.text || ''} onChange={(e) => update('cta', 'text', e.target.value)} rows={2} style={inputStyle} />

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
              <i className="fas fa-save" /> Save Team Page
            </>
          )}
        </button>
      </div>
    </div>
  );
}