import { getPage } from '@/lib/db';
import { resourcesDefaults } from '@/lib/defaults';
import Link from 'next/link';
import ResourceLibrary from './ResourceLibrary';

export const dynamic = 'force-dynamic';

export default async function ResourcesPage() {
  let data = { ...resourcesDefaults };

  try {
    const saved = await getPage('lnf-resources');
    if (saved) data = { ...resourcesDefaults, ...saved };
  } catch (error) {
    console.error('Failed to load Resources, using defaults:', error);
  }

  const { hero, categories, library, transparency, cta, resources = [] } = data;

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

      {/* RESOURCE CATEGORIES */}
      <section style={{ background: 'white', paddingTop: 100, paddingBottom: 40 }}>
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}
          >
            <span className="eyebrow">{categories.eyebrow}</span>
            <h2 className="section-title">{categories.title}</h2>
            <p className="section-subtitle">{categories.subtitle}</p>
          </div>

          <div className="res-cat-grid reveal">
            {categories.items.map((c: any, i: number) => (
              <div
                key={i}
                className="res-cat-card"
                style={{ ['--cat-accent' as any]: c.accent }}
              >
                <div className="res-cat-icon">
                  <i className={c.icon} />
                </div>
                <h3 className="res-cat-title">{c.title}</h3>
                <p className="res-cat-text">{c.text}</p>
                <a href="#library" className="res-cat-link">
                  View <i className="fas fa-arrow-right" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL RESOURCES / LIBRARY */}
      <section
        id="library"
        className="section-gray"
        style={{ paddingTop: 90, paddingBottom: 100 }}
      >
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 50px' }}
          >
            <span className="eyebrow">{library.eyebrow}</span>
            <h2 className="section-title">{library.title}</h2>
            <p className="section-subtitle">{library.subtitle}</p>
          </div>

          <div className="reveal">
            <ResourceLibrary
              resources={resources}
              categories={categories.items}
              library={library}
            />
          </div>
        </div>
      </section>

      {/* TRANSPARENCY */}
      <section style={{ background: 'white' }}>
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 50px' }}
          >
            <span className="eyebrow">{transparency.eyebrow}</span>
            <h2 className="section-title">{transparency.title}</h2>
            <p className="section-subtitle">{transparency.text}</p>
          </div>

          <div className="grid-3 reveal" style={{ gap: 22 }}>
            {transparency.items.map((t: any, i: number) => (
              <div
                key={i}
                className="card"
                style={{
                  textAlign: 'center',
                  padding: '34px 22px',
                  borderTop: '4px solid var(--teal)',
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: '#E0F2F1',
                    color: 'var(--teal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    margin: '0 auto 18px',
                  }}
                >
                  <i className={t.icon} />
                </div>
                <h4
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--navy-900)',
                    marginBottom: 8,
                  }}
                >
                  {t.title}
                </h4>
                <p
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {t.text}
                </p>
              </div>
            ))}
          </div>
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
          <Link
            href={cta.buttonLink}
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
            <i className="fas fa-envelope" /> {cta.buttonText}
          </Link>
        </div>
      </section>

      {/* PAGE STYLES */}
      <style>{`
        .res-cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 22px;
        }
        .res-cat-card {
          --cat-accent: var(--teal);
          background: #fff;
          border: 1px solid #EEF2F5;
          border-radius: 20px;
          padding: 34px 26px 28px;
          position: relative;
          overflow: hidden;
          transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
        }
        .res-cat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 50px rgba(10,15,31,0.10);
          border-color: color-mix(in srgb, var(--cat-accent) 30%, transparent);
        }
        .res-cat-icon {
          width: 60px; height: 60px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; margin-bottom: 20px;
          background: color-mix(in srgb, var(--cat-accent) 12%, white);
          color: var(--cat-accent);
          transition: transform .35s ease;
        }
        .res-cat-card:hover .res-cat-icon {
          transform: rotate(-4deg) scale(1.05);
        }
        .res-cat-title {
          font-family: 'Poppins', sans-serif;
          font-size: 18px; font-weight: 700;
          color: var(--navy-900); margin: 0 0 10px;
        }
        .res-cat-text {
          color: var(--gray-600);
          font-size: 14px; line-height: 1.65; margin: 0 0 18px;
        }
        .res-cat-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px; font-weight: 700;
          color: var(--cat-accent); text-decoration: none;
          letter-spacing: 0.3px;
        }
        .res-cat-link i {
          font-size: 11px; transition: transform .3s ease;
        }
        .res-cat-link:hover i { transform: translateX(4px); }

        @media (max-width: 640px) {
          .res-cat-grid { grid-template-columns: 1fr; gap: 16px; }
          .res-cat-card { padding: 26px 22px 22px; }
        }
      `}</style>
    </>
  );
}