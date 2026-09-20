'use client';

import { useMemo, useState } from 'react';

interface Props {
  teams: any[];
  emptyState: any;
  modal: any;
}

export default function TeamGrid({ teams, emptyState, modal }: Props) {
  const [activeTeam, setActiveTeam] = useState<string>('all');
  const [selected, setSelected] = useState<any>(null);

  const visibleTeams = useMemo(() => {
    if (activeTeam === 'all') return teams;
    return teams.filter((t) => t.id === activeTeam);
  }, [teams, activeTeam]);

  return (
    <>
      {/* FILTER CHIPS */}
      <div className="tg-filter-wrap">
        <div className="tg-filters">
          <button
            type="button"
            className={`tg-chip ${activeTeam === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveTeam('all')}
          >
            All Teams
            <span className="tg-chip-count">
              {teams.reduce((sum, t) => sum + (t.members?.length || 0), 0)}
            </span>
          </button>
          {teams.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`tg-chip ${activeTeam === t.id ? 'is-active' : ''}`}
              onClick={() => setActiveTeam(t.id)}
            >
              {t.title}
              <span className="tg-chip-count">{t.members?.length || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TEAM SECTIONS */}
      <div className="tg-sections">
        {visibleTeams.map((team) => (
          <section
            key={team.id}
            id={`team-${team.id}`}
            className="tg-section"
            style={{ ['--accent' as any]: team.accent }}
          >
            <div className="tg-section-head">
              <div className="tg-section-icon">
                <i className={team.icon} />
              </div>
              <div>
                <h3 className="tg-section-title">{team.title}</h3>
                <p className="tg-section-subtitle">{team.subtitle}</p>
              </div>
            </div>

            {(!team.members || team.members.length === 0) ? (
              <div className="tg-empty">
                <div className="tg-empty-icon">
                  <i className="fas fa-users" />
                </div>
                <h4>{emptyState?.title || 'Team members coming soon'}</h4>
                <p>{emptyState?.text}</p>
              </div>
            ) : (
              <div className="tg-grid">
                {team.members.map((m: any) => (
                  <button
                    key={m.id}
                    type="button"
                    className="tg-card"
                    onClick={() => setSelected({ ...m, accent: team.accent, team: team.title })}
                  >
                    <div className="tg-card-photo">
                      {m.photo ? (
                        <img src={m.photo} alt={m.name} loading="lazy" />
                      ) : (
                        <div className="tg-card-initials">
                          {getInitials(m.name)}
                        </div>
                      )}
                      <div className="tg-card-photo-overlay" />
                    </div>
                    <div className="tg-card-body">
                      <h4 className="tg-card-name">{m.name}</h4>
                      <p className="tg-card-position">{m.position}</p>
                      {m.department && (
                        <span className="tg-card-dept">{m.department}</span>
                      )}
                      {m.shortBio && (
                        <p className="tg-card-bio">{m.shortBio}</p>
                      )}
                      <span className="tg-card-cta">
                        View Profile <i className="fas fa-arrow-right" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <div
          className="tg-modal-overlay"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="tg-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ ['--accent' as any]: selected.accent }}
          >
            <button
              type="button"
              className="tg-modal-close"
              onClick={() => setSelected(null)}
              aria-label={modal?.closeLabel || 'Close'}
            >
              <i className="fas fa-times" />
            </button>

            <div className="tg-modal-head">
              <div className="tg-modal-photo">
                {selected.photo ? (
                  <img src={selected.photo} alt={selected.name} />
                ) : (
                  <div className="tg-modal-initials">
                    {getInitials(selected.name)}
                  </div>
                )}
              </div>
              <div className="tg-modal-head-text">
                <span className="tg-modal-team">{selected.team}</span>
                <h3 className="tg-modal-name">{selected.name}</h3>
                <p className="tg-modal-position">{selected.position}</p>
                {selected.department && (
                  <span className="tg-modal-dept">
                    <i className="fas fa-briefcase" /> {selected.department}
                  </span>
                )}
                {selected.location && (
                  <span className="tg-modal-loc">
                    <i className="fas fa-map-marker-alt" /> {selected.location}
                  </span>
                )}
              </div>
            </div>

            {selected.fullBio && (
              <div className="tg-modal-block">
                <h4 className="tg-modal-block-title">
                  {modal?.bioTitle || 'Biography'}
                </h4>
                {selected.fullBio.split('\n\n').map((p: string, i: number) => (
                  <p key={i} className="tg-modal-paragraph">
                    {p}
                  </p>
                ))}
              </div>
            )}

            {selected.expertise?.length > 0 && (
              <div className="tg-modal-block">
                <h4 className="tg-modal-block-title">
                  <i className="fas fa-star" /> {modal?.expertiseTitle || 'Areas of Expertise'}
                </h4>
                <div className="tg-modal-pills">
                  {selected.expertise.map((e: string, i: number) => (
                    <span key={i} className="tg-modal-pill">{e}</span>
                  ))}
                </div>
              </div>
            )}

            {selected.responsibilities?.length > 0 && (
              <div className="tg-modal-block">
                <h4 className="tg-modal-block-title">
                  <i className="fas fa-tasks" /> {modal?.responsibilitiesTitle || 'Responsibilities'}
                </h4>
                <ul className="tg-modal-list">
                  {selected.responsibilities.map((r: string, i: number) => (
                    <li key={i}>
                      <i className="fas fa-check" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selected.education?.length > 0 && (
              <div className="tg-modal-block">
                <h4 className="tg-modal-block-title">
                  <i className="fas fa-graduation-cap" /> {modal?.educationTitle || 'Education & Qualifications'}
                </h4>
                <ul className="tg-modal-list">
                  {selected.education.map((e: string, i: number) => (
                    <li key={i}>
                      <i className="fas fa-check" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(selected.email || selected.linkedin) && (
              <div className="tg-modal-block">
                <h4 className="tg-modal-block-title">
                  <i className="fas fa-address-card" /> {modal?.contactTitle || 'Contact'}
                </h4>
                <div className="tg-modal-contact">
                  {selected.email && (
                    <a
                      href={`mailto:${selected.email}`}
                      className="tg-modal-contact-btn"
                    >
                      <i className="fas fa-envelope" /> {selected.email}
                    </a>
                  )}
                  {selected.linkedin && (
                    <a
                      href={selected.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tg-modal-contact-btn"
                    >
                      <i className="fab fa-linkedin-in" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STYLES */}
      <style>{`
        /* FILTER CHIPS */
        .tg-filter-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 50px;
        }
        .tg-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }
        .tg-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 999px;
          border: 1.5px solid #E5E7EB;
          background: #fff;
          color: var(--navy-900);
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all .25s ease;
        }
        .tg-chip:hover {
          border-color: var(--teal);
          color: var(--teal);
        }
        .tg-chip.is-active {
          background: var(--navy-900);
          color: #fff;
          border-color: var(--navy-900);
          box-shadow: 0 8px 20px rgba(10,15,31,0.20);
        }
        .tg-chip-count {
          background: rgba(0,0,0,0.08);
          border-radius: 999px;
          padding: 1px 8px;
          font-size: 11px;
          font-weight: 700;
        }
        .tg-chip.is-active .tg-chip-count {
          background: rgba(255,255,255,0.22);
        }

        /* SECTIONS */
        .tg-sections {
          display: flex;
          flex-direction: column;
          gap: 70px;
        }
        .tg-section {
          --accent: var(--teal);
        }
        .tg-section-head {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          padding-bottom: 22px;
          border-bottom: 1.5px solid #EEF2F5;
          position: relative;
        }
        .tg-section-head::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -1.5px;
          width: 90px;
          height: 3px;
          background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 40%, white));
          border-radius: 999px;
        }
        .tg-section-icon {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          background: color-mix(in srgb, var(--accent) 12%, white);
          color: var(--accent);
          border: 1.5px solid color-mix(in srgb, var(--accent) 30%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
          transition: transform .35s ease;
        }
        .tg-section:hover .tg-section-icon {
          transform: rotate(-4deg) scale(1.05);
        }
        .tg-section-title {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(20px, 2.4vw, 26px);
          font-weight: 800;
          color: var(--navy-900);
          margin: 0 0 4px;
          letter-spacing: -0.3px;
        }
        .tg-section-subtitle {
          color: var(--gray-600);
          font-size: 14.5px;
          margin: 0;
          line-height: 1.5;
        }

        /* GRID */
        .tg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 24px;
        }

        .tg-card {
          --accent: var(--teal);
          background: #fff;
          border: 1px solid #EEF2F5;
          border-radius: 20px;
          overflow: hidden;
          padding: 0;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          display: flex;
          flex-direction: column;
          transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
          box-shadow: 0 6px 22px rgba(10,15,31,0.045);
        }
        .tg-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 50px rgba(10,15,31,0.11);
          border-color: color-mix(in srgb, var(--accent) 30%, transparent);
        }

        .tg-card-photo {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 20%, #0A0F1F), #0A0F1F);
          overflow: hidden;
        }
        .tg-card-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .8s ease;
        }
        .tg-card:hover .tg-card-photo img {
          transform: scale(1.06);
        }
        .tg-card-photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(10,15,31,0.35) 100%);
          pointer-events: none;
        }
        .tg-card-initials {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 52px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .tg-card-body {
          padding: 22px 22px 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .tg-card-name {
          font-family: 'Poppins', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: var(--navy-900);
          margin: 0 0 4px;
          line-height: 1.3;
        }
        .tg-card-position {
          color: var(--accent);
          font-size: 13.5px;
          font-weight: 600;
          margin: 0 0 12px;
          line-height: 1.4;
        }
        .tg-card-dept {
          display: inline-block;
          align-self: flex-start;
          font-family: 'Poppins', sans-serif;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--accent) 12%, white);
          color: var(--accent);
          border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
          margin-bottom: 14px;
        }
        .tg-card-bio {
          color: var(--gray-600);
          font-size: 13px;
          line-height: 1.6;
          margin: 0 0 16px;
          flex: 1;
        }
        .tg-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: var(--accent);
          margin-top: auto;
        }
        .tg-card-cta i {
          font-size: 11px;
          transition: transform .3s ease;
        }
        .tg-card:hover .tg-card-cta i {
          transform: translateX(4px);
        }

        /* EMPTY */
        .tg-empty {
          background: #F8FAFC;
          border: 1.5px dashed #D1D5DB;
          border-radius: 20px;
          padding: 60px 24px;
          text-align: center;
          max-width: 560px;
          margin: 0 auto;
        }
        .tg-empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: color-mix(in srgb, var(--accent) 12%, white);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          margin: 0 auto 16px;
        }
        .tg-empty h4 {
          font-family: 'Poppins', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--navy-900);
          margin: 0 0 8px;
        }
        .tg-empty p {
          color: var(--gray-600);
          font-size: 14px;
          line-height: 1.65;
          margin: 0;
          max-width: 420px;
          margin-left: auto;
          margin-right: auto;
        }

        /* MODAL */
        .tg-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(10,15,31,0.72);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 20px;
          overflow-y: auto;
          animation: tgFade .25s ease;
        }
        @keyframes tgFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .tg-modal {
          --accent: var(--teal);
          background: #fff;
          border-radius: 24px;
          max-width: 760px;
          width: 100%;
          padding: 0;
          position: relative;
          overflow: hidden;
          animation: tgSlide .35s cubic-bezier(.22,1,.36,1);
          box-shadow: 0 30px 80px rgba(0,0,0,0.35);
          margin: auto;
        }
        @keyframes tgSlide {
          from { opacity: 0; transform: translateY(24px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .tg-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 3;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(10,15,31,0.6);
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          transition: background .25s, transform .25s;
          backdrop-filter: blur(8px);
        }
        .tg-modal-close:hover {
          background: rgba(10,15,31,0.9);
          transform: rotate(90deg);
        }

        .tg-modal-head {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 26px;
          align-items: center;
          padding: 40px 40px 28px;
          background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 8%, white) 0%, #fff 100%);
          border-bottom: 1px solid #F1F5F9;
          position: relative;
        }
        .tg-modal-head::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 5px;
          background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 55%, white));
        }
        .tg-modal-photo {
          width: 200px;
          height: 200px;
          border-radius: 24px;
          overflow: hidden;
          background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 30%, #0A0F1F), #0A0F1F);
          box-shadow: 0 14px 40px color-mix(in srgb, var(--accent) 30%, transparent);
          flex-shrink: 0;
        }
        .tg-modal-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .tg-modal-initials {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 68px;
          font-weight: 800;
          letter-spacing: 3px;
        }
        .tg-modal-head-text {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .tg-modal-team {
          display: inline-block;
          align-self: flex-start;
          font-family: 'Poppins', sans-serif;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--accent) 14%, white);
          color: var(--accent);
          border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
        }
        .tg-modal-name {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 800;
          color: var(--navy-900);
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.4px;
        }
        .tg-modal-position {
          color: var(--accent);
          font-size: 15px;
          font-weight: 600;
          margin: 0;
          line-height: 1.4;
        }
        .tg-modal-dept,
        .tg-modal-loc {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--gray-600);
          font-size: 13px;
          margin-right: 14px;
        }
        .tg-modal-dept i,
        .tg-modal-loc i { font-size: 11px; color: var(--accent); }

        .tg-modal-block {
          padding: 26px 40px;
          border-bottom: 1px solid #F1F5F9;
        }
        .tg-modal-block:last-child { border-bottom: none; padding-bottom: 40px; }
        .tg-modal-block-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: var(--navy-900);
          margin: 0 0 14px;
        }
        .tg-modal-block-title i {
          color: var(--accent);
          font-size: 13px;
        }
        .tg-modal-paragraph {
          color: var(--gray-600);
          font-size: 14.5px;
          line-height: 1.8;
          margin: 0 0 12px;
        }
        .tg-modal-paragraph:last-child { margin-bottom: 0; }

        .tg-modal-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .tg-modal-pill {
          font-family: 'Poppins', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--accent) 12%, white);
          color: var(--accent);
          border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
        }

        .tg-modal-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .tg-modal-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: var(--gray-600);
          font-size: 14px;
          line-height: 1.6;
        }
        .tg-modal-list li i {
          color: var(--accent);
          font-size: 11px;
          background: color-mix(in srgb, var(--accent) 12%, white);
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .tg-modal-contact {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .tg-modal-contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          background: var(--navy-900);
          color: #fff;
          border-radius: 999px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: transform .25s ease, box-shadow .25s ease;
          box-shadow: 0 8px 20px rgba(10,15,31,0.18);
        }
        .tg-modal-contact-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 26px rgba(10,15,31,0.28);
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .tg-grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 18px;
          }
          .tg-modal-head {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 34px 26px 24px;
          }
          .tg-modal-photo {
            width: 150px;
            height: 150px;
            margin: 0 auto;
          }
          .tg-modal-head-text {
            align-items: center;
          }
          .tg-modal-block {
            padding: 22px 26px;
          }
          .tg-modal-block:last-child {
            padding-bottom: 30px;
          }
        }
        @media (max-width: 640px) {
          .tg-grid {
            grid-template-columns: 1fr;
          }
          .tg-section-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .tg-filter-wrap {
            margin-bottom: 34px;
          }
          .tg-chip {
            font-size: 12px;
            padding: 8px 14px;
          }
          .tg-sections {
            gap: 50px;
          }
          .tg-modal-overlay {
            padding: 20px 12px;
          }
          .tg-modal {
            border-radius: 20px;
          }
          .tg-modal-photo {
            width: 130px;
            height: 130px;
          }
          .tg-modal-initials { font-size: 54px; }
          .tg-modal-name { font-size: 22px; }
        }
      `}</style>
    </>
  );
}

/* Helper */
function getInitials(name?: string) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}