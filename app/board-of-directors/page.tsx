import { getPage } from '@/lib/db';
import { teamDefaults } from '@/lib/defaults';
import Link from 'next/link';
import TeamGrid from './TeamGrid';

export const dynamic = 'force-dynamic';

export default async function BoardOfDirectorsPage() {
  let data = { ...teamDefaults };

  try {
    const saved = await getPage('lnf-team');
    if (saved) data = { ...teamDefaults, ...saved };
  } catch (error) {
    console.error('Failed to load Team, using defaults:', error);
  }

  const { hero, tree, teams = [], emptyState, modal, cta } = data;

  return (
    <>
      {/* HERO */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${hero.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll',
          minHeight: '55vh',
          height: 'auto',
          padding: '140px 20px 100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div className="hero-overlay" />
        <div
          className="hero-content"
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 900,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <span
            className="eyebrow"
            style={{ color: '#5EEAD4', display: 'inline-block', marginBottom: 14 }}
          >
            {hero.eyebrow}
          </span>
          <h1
            className="hero-title"
            style={{ fontSize: 'clamp(32px, 6vw, 68px)', lineHeight: 1.15 }}
          >
            {hero.title}
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 'clamp(16px, 1.8vw, 22px)',
              maxWidth: 720,
              margin: '20px auto 0',
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            {hero.subtitle}
          </p>
          <p
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: 'clamp(14px, 1.4vw, 17px)',
              maxWidth: 780,
              margin: '18px auto 0',
              lineHeight: 1.7,
            }}
          >
            {hero.description}
          </p>
        </div>
      </section>

      {/* ORG TREE */}
      <section style={{ background: 'white', paddingTop: 100, paddingBottom: 60 }}>
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}
          >
            <span className="eyebrow">{tree.eyebrow}</span>
            <h2 className="section-title">{tree.title}</h2>
            <p className="section-subtitle">{tree.subtitle}</p>
          </div>

          <div className="org-tree reveal">
            {/* Root */}
            <div className="org-root">
              <div className="org-root-icon">
                <i className={tree.root?.icon || 'fas fa-sitemap'} />
              </div>
              <span className="org-root-label">{tree.root?.label || 'LNF'}</span>
            </div>

            {/* Vertical connector */}
            <div className="org-line" />

            {/* Layers */}
            <div className="org-layers">
              {tree.layers?.map((layer: any, i: number) => (
                <div key={i} className="org-layer-wrap">
                  <div
                    className="org-layer-card"
                    style={{ ['--accent' as any]: layer.accent }}
                  >
                    <div className="org-layer-icon">
                      <i className={layer.icon} />
                    </div>
                    <div>
                      <h4 className="org-layer-title">{layer.label}</h4>
                      <p className="org-layer-sub">{layer.sub}</p>
                    </div>
                  </div>
                  {i < (tree.layers?.length || 0) - 1 && (
                    <div className="org-line org-line--small" />
                  )}
                </div>
              ))}
            </div>

            {/* Branches */}
            {tree.branches?.length > 0 && (
              <>
                <div className="org-line" />
                <div className="org-branches">
                  {tree.branches.map((b: any, i: number) => (
                    <div
                      key={i}
                      className="org-branch"
                      style={{ ['--accent' as any]: b.accent }}
                    >
                      <div className="org-branch-icon">
                        <i className={b.icon} />
                      </div>
                      <span className="org-branch-label">{b.label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* TEAM SECTIONS + MODAL (client) */}
      <section className="section-gray" style={{ paddingTop: 80, paddingBottom: 100 }}>
        <div className="container">
          <TeamGrid teams={teams} emptyState={emptyState} modal={modal} />
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background:
            'linear-gradient(135deg, #0A0F1F 0%, #102A43 50%, #1B3A5C 100%)',
          textAlign: 'center',
          padding: '100px 20px',
        }}
      >
        <div className="container reveal" style={{ maxWidth: 750 }}>
          <h2 className="section-title" style={{ color: '#fff', marginBottom: 18 }}>
            {cta.title}
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.78)',
              fontSize: 17,
              lineHeight: 1.75,
              marginBottom: 34,
            }}
          >
            {cta.text}
          </p>
          <div
            style={{
              display: 'flex',
              gap: 14,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href={cta.button1Link}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '15px 34px',
                background: 'linear-gradient(135deg, #F5D67B, #D4A12A)',
                color: '#0A0F1F',
                borderRadius: 999,
                fontWeight: 700,
                fontFamily: 'Poppins, sans-serif',
                fontSize: 15,
                boxShadow: '0 12px 30px rgba(212,161,42,0.35)',
              }}
            >
              <i className="fas fa-hands-helping" /> {cta.button1Text}
            </Link>
            <Link
              href={cta.button2Link}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '15px 34px',
                background: 'transparent',
                color: '#fff',
                border: '2px solid rgba(255,255,255,0.5)',
                borderRadius: 999,
                fontWeight: 700,
                fontFamily: 'Poppins, sans-serif',
                fontSize: 15,
              }}
            >
              <i className="fas fa-envelope" /> {cta.button2Text}
            </Link>
          </div>
        </div>
      </section>

      {/* PAGE STYLES FOR TREE */}
      <style>{`
        .org-tree {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .org-root {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 28px;
          background: linear-gradient(135deg, #0A0F1F, #1B3A5C);
          color: #fff;
          border-radius: 999px;
          box-shadow: 0 14px 34px rgba(10,15,31,0.25);
          position: relative;
        }
        .org-root::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 999px;
          background: linear-gradient(90deg, #F5D67B, #D4A12A);
          z-index: -1;
          opacity: 0.55;
          filter: blur(10px);
        }
        .org-root-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(245,214,123,0.18);
          color: #F5D67B;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .org-root-label {
          font-family: 'Poppins', sans-serif;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }

        .org-line {
          width: 2px;
          height: 44px;
          background: linear-gradient(180deg, #0A0F1F, #94A3B8);
          border-radius: 2px;
        }
        .org-line--small {
          height: 26px;
          background: linear-gradient(180deg, #94A3B8, #CBD5E1);
        }

        .org-layers {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 480px;
        }
        .org-layer-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .org-layer-card {
          --accent: var(--teal);
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 26px;
          background: #fff;
          border-radius: 18px;
          border: 1.5px solid #EEF2F5;
          box-shadow: 0 8px 22px rgba(10,15,31,0.05);
          width: 100%;
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
        }
        .org-layer-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 38px rgba(10,15,31,0.10);
          border-color: color-mix(in srgb, var(--accent) 35%, transparent);
        }
        .org-layer-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: color-mix(in srgb, var(--accent) 12%, white);
          color: var(--accent);
          border: 1.5px solid color-mix(in srgb, var(--accent) 30%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .org-layer-title {
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: var(--navy-900);
          margin: 0 0 2px;
        }
        .org-layer-sub {
          color: var(--gray-600);
          font-size: 12.5px;
          margin: 0;
        }

        .org-branches {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          position: relative;
        }
        .org-branches::before {
          content: '';
          position: absolute;
          top: -22px;
          left: 20%;
          right: 20%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #CBD5E1, transparent);
          border-radius: 2px;
        }
        .org-branch {
          --accent: var(--teal);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 18px 20px;
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid #EEF2F5;
          box-shadow: 0 6px 18px rgba(10,15,31,0.045);
          min-width: 150px;
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
        }
        .org-branch:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 34px rgba(10,15,31,0.10);
          border-color: color-mix(in srgb, var(--accent) 35%, transparent);
        }
        .org-branch-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: color-mix(in srgb, var(--accent) 12%, white);
          color: var(--accent);
          border: 1.5px solid color-mix(in srgb, var(--accent) 30%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .org-branch-label {
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: var(--navy-900);
          text-align: center;
          letter-spacing: 0.3px;
        }

        @media (max-width: 640px) {
          .org-root {
            padding: 14px 22px;
          }
          .org-root-label { font-size: 13px; }
          .org-layer-card {
            padding: 14px 18px;
            gap: 12px;
          }
          .org-layer-icon {
            width: 44px;
            height: 44px;
            font-size: 18px;
          }
          .org-layer-title { font-size: 14.5px; }
          .org-layer-sub { font-size: 11.5px; }
          .org-branches { gap: 12px; }
          .org-branch {
            min-width: 130px;
            padding: 14px 16px;
          }
        }
      `}</style>
    </>
  );
}