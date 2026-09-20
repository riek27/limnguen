'use client';

import { useMemo, useState } from 'react';

interface Props {
  resources: any[];
  categories: any[];
  library: any;
}

export default function ResourceLibrary({ resources, categories, library }: Props) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (resources || []).filter((r: any) => {
      const matchCat = activeCat === 'all' || r.category === activeCat;
      const matchSearch =
        !q ||
        (r.title || '').toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [resources, query, activeCat]);

  const hasResources = (resources || []).length > 0;

  return (
    <div className="rl-wrap">
      {/* SEARCH + FILTERS */}
      <div className="rl-controls">
        <div className="rl-search">
          <i className="fas fa-search" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={library?.searchPlaceholder || 'Search resources...'}
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="rl-clear" aria-label="Clear search">
              <i className="fas fa-times" />
            </button>
          )}
        </div>

        <div className="rl-filters">
          <button
            type="button"
            className={`rl-chip ${activeCat === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveCat('all')}
          >
            {library?.allLabel || 'All'}
            <span className="rl-chip-count">{(resources || []).length}</span>
          </button>
          {categories.map((c: any) => {
            const count = (resources || []).filter((r: any) => r.category === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                className={`rl-chip ${activeCat === c.id ? 'is-active' : ''}`}
                onClick={() => setActiveCat(c.id)}
              >
                {c.title}
                <span className="rl-chip-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RESULTS */}
      {!hasResources ? (
        <div className="rl-empty">
          <div className="rl-empty-icon">
            <i className="fas fa-folder-open" />
          </div>
          <h3>{library?.emptyTitle || 'Resources coming soon'}</h3>
          <p>{library?.emptyText}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rl-empty">
          <div className="rl-empty-icon">
            <i className="fas fa-search" />
          </div>
          <h3>No results found</h3>
          <p>Try a different search term or filter.</p>
        </div>
      ) : (
        <div className="rl-grid">
          {filtered.map((r: any) => {
            const cat = categories.find((c: any) => c.id === r.category);
            const accent = cat?.accent || '#0D9488';
            return (
              <article key={r.id} className="rl-card">
                <div className="rl-card-top">
                  <div
                    className="rl-card-icon"
                    style={{
                      background: `linear-gradient(135deg, ${accent}22, ${accent}0A)`,
                      color: accent,
                      borderColor: `${accent}33`,
                    }}
                  >
                    <i className={cat?.icon || 'fas fa-file'} />
                  </div>
                  <div className="rl-card-meta">
                    <span
                      className="rl-cat-tag"
                      style={{
                        background: `${accent}15`,
                        color: accent,
                        borderColor: `${accent}33`,
                      }}
                    >
                      {cat?.title || 'Document'}
                    </span>
                    <div className="rl-card-sub">
                      {r.fileType && <span className="rl-type">{r.fileType}</span>}
                      {r.fileSize && <span>· {r.fileSize}</span>}
                      {r.date && <span>· {r.date}</span>}
                    </div>
                  </div>
                </div>

                <h3 className="rl-card-title">{r.title}</h3>
                {r.description && <p className="rl-card-desc">{r.description}</p>}

                <div className="rl-card-actions">
                  {r.fileUrl ? (
                    <>
                      <a
                        href={r.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rl-btn rl-btn-view"
                      >
                        <i className="fas fa-eye" /> View
                      </a>
                      <a
                        href={r.fileUrl}
                        download
                        className="rl-btn rl-btn-download"
                      >
                        <i className="fas fa-download" /> Download
                      </a>
                    </>
                  ) : (
                    <span className="rl-unavailable">Not yet available</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <style>{`
        .rl-wrap { display: flex; flex-direction: column; gap: 32px; }

        /* CONTROLS */
        .rl-controls {
          display: flex; flex-direction: column; gap: 18px;
          max-width: 1000px; margin: 0 auto; width: 100%;
        }
        .rl-search {
          position: relative;
          display: flex; align-items: center;
          background: #fff; border: 1.5px solid #E5E7EB;
          border-radius: 14px; padding: 0 18px;
          box-shadow: 0 4px 14px rgba(10,15,31,0.04);
          transition: border-color .25s, box-shadow .25s;
        }
        .rl-search:focus-within {
          border-color: var(--teal);
          box-shadow: 0 8px 24px rgba(13,148,136,0.14);
        }
        .rl-search > i {
          color: var(--gray-600); font-size: 15px; margin-right: 12px;
        }
        .rl-search input {
          flex: 1; border: none; outline: none;
          padding: 16px 0; font-size: 15px;
          font-family: 'Poppins', sans-serif;
          color: var(--navy-900); background: transparent;
        }
        .rl-clear {
          background: #F3F4F6; border: none; color: #6B7280;
          width: 26px; height: 26px; border-radius: 50%;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; font-size: 11px;
        }
        .rl-clear:hover { background: #E5E7EB; color: #111; }

        .rl-filters {
          display: flex; flex-wrap: wrap; gap: 8px;
          justify-content: center;
        }
        .rl-chip {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 16px; border-radius: 999px;
          border: 1.5px solid #E5E7EB; background: #fff;
          color: var(--navy-900); font-family: 'Poppins', sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all .25s ease;
        }
        .rl-chip:hover {
          border-color: var(--teal); color: var(--teal);
        }
        .rl-chip.is-active {
          background: var(--navy-900); color: #fff;
          border-color: var(--navy-900);
          box-shadow: 0 8px 20px rgba(10,15,31,0.20);
        }
        .rl-chip-count {
          background: rgba(0,0,0,0.08);
          border-radius: 999px; padding: 1px 8px;
          font-size: 11px; font-weight: 700;
        }
        .rl-chip.is-active .rl-chip-count {
          background: rgba(255,255,255,0.22);
        }

        /* GRID */
        .rl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 22px;
        }

        .rl-card {
          background: #fff;
          border: 1px solid #EEF2F5;
          border-radius: 18px;
          padding: 26px 24px 22px;
          display: flex; flex-direction: column;
          transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
          position: relative; overflow: hidden;
        }
        .rl-card::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, var(--teal), var(--gold));
          transform: scaleY(0); transform-origin: top;
          transition: transform .4s ease;
        }
        .rl-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 45px rgba(10,15,31,0.10);
          border-color: rgba(13,148,136,0.22);
        }
        .rl-card:hover::before { transform: scaleY(1); }

        .rl-card-top {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 18px;
        }
        .rl-card-icon {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; border: 1.5px solid; flex-shrink: 0;
          transition: transform .35s ease;
        }
        .rl-card:hover .rl-card-icon { transform: scale(1.06); }

        .rl-card-meta {
          display: flex; flex-direction: column; gap: 4px; min-width: 0;
        }
        .rl-cat-tag {
          display: inline-block; align-self: flex-start;
          font-family: 'Poppins', sans-serif;
          font-size: 10.5px; font-weight: 800;
          letter-spacing: 1.4px; text-transform: uppercase;
          padding: 4px 10px; border-radius: 999px; border: 1px solid;
        }
        .rl-card-sub {
          font-size: 11.5px; color: var(--gray-600);
          display: flex; gap: 5px; align-items: center;
        }
        .rl-type {
          font-weight: 700; color: var(--navy-900);
          letter-spacing: 0.4px;
        }

        .rl-card-title {
          font-family: 'Poppins', sans-serif;
          font-size: 17px; font-weight: 700;
          color: var(--navy-900);
          line-height: 1.35; margin: 0 0 10px;
        }
        .rl-card-desc {
          color: var(--gray-600);
          font-size: 13.5px; line-height: 1.6;
          margin: 0 0 20px; flex: 1;
        }

        .rl-card-actions {
          display: flex; gap: 8px; flex-wrap: wrap;
          padding-top: 4px;
        }
        .rl-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 999px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px; font-weight: 700;
          text-decoration: none; cursor: pointer;
          transition: all .25s ease;
          border: 1.5px solid transparent;
        }
        .rl-btn i { font-size: 11px; }

        .rl-btn-view {
          background: transparent;
          color: var(--navy-900);
          border-color: #E5E7EB;
        }
        .rl-btn-view:hover {
          border-color: var(--navy-900);
          background: var(--navy-900); color: #fff;
        }

        .rl-btn-download {
          background: linear-gradient(135deg, #F5D67B, #D4A12A);
          color: #0A0F1F;
          box-shadow: 0 8px 18px rgba(212,161,42,0.25);
        }
        .rl-btn-download:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 26px rgba(212,161,42,0.35);
        }

        .rl-unavailable {
          font-size: 12.5px; color: var(--gray-600);
          font-style: italic; padding: 10px 0;
        }

        /* EMPTY */
        .rl-empty {
          text-align: center; padding: 70px 20px;
          background: #fff;
          border: 1px dashed #D1D5DB;
          border-radius: 20px;
          max-width: 640px; margin: 0 auto; width: 100%;
        }
        .rl-empty-icon {
          width: 72px; height: 72px; border-radius: 22px;
          background: linear-gradient(135deg, #E0F2F1, #CCFBF1);
          color: var(--teal);
          display: flex; align-items: center; justify-content: center;
          font-size: 30px; margin: 0 auto 18px;
        }
        .rl-empty h3 {
          font-family: 'Poppins', sans-serif;
          font-size: 20px; font-weight: 700;
          color: var(--navy-900); margin: 0 0 8px;
        }
        .rl-empty p {
          color: var(--gray-600);
          font-size: 14.5px; line-height: 1.7; margin: 0;
          max-width: 460px; margin: 0 auto;
        }

        @media (max-width: 640px) {
          .rl-grid { grid-template-columns: 1fr; gap: 16px; }
          .rl-card { padding: 22px 20px 20px; }
          .rl-chip { font-size: 12px; padding: 8px 13px; }
          .rl-filters { justify-content: flex-start; }
          .rl-empty { padding: 50px 20px; }
        }
      `}</style>
    </div>
  );
}