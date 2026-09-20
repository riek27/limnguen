import { getPage } from '@/lib/db';
import { partnersDefaults } from '@/lib/defaults';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PartnersPage() {
  let data = { ...partnersDefaults };

  try {
    const saved = await getPage('lnf-partners');
    if (saved) data = { ...partnersDefaults, ...saved };
  } catch (error) {
    console.error('Failed to load Partners, using defaults:', error);
  }

  const { hero, partners, collaboration, advantage, cta } = data;

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

      {/* PARTNER LOGO GRID */}
      <section style={{ background: 'white', paddingTop: 100, paddingBottom: 100 }}>
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}
          >
            <span className="eyebrow">{partners.eyebrow}</span>
            <h2 className="section-title">{partners.title}</h2>
            <p className="section-subtitle">{partners.subtitle}</p>
          </div>

          <div className="partners-grid reveal">
            {partners.items.map((p: any, i: number) => (
              <div key={i} className="partner-card">
                <div className="partner-logo-wrap">
                  {p.logo ? (
                    <img src={p.logo} alt={p.name} className="partner-logo-img" />
                  ) : (
                    <div
                      className="partner-monogram"
                      style={{
                        background: `linear-gradient(135deg, ${p.accent || '#0D9488'}22, ${p.accent || '#0D9488'}0A)`,
                        color: p.accent || '#0D9488',
                        borderColor: `${p.accent || '#0D9488'}33`,
                      }}
                    >
                      {p.monogram || p.name?.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="partner-name">{p.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLABORATION */}
      <section
        style={{
          background:
            'linear-gradient(135deg, #0A0F1F 0%, #102A43 50%, #1B3A5C 100%)',
          padding: '100px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: 520,
            height: 520,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(94,234,212,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: 520,
            height: 520,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(212,161,42,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 60px' }}
          >
            <span className="eyebrow" style={{ color: '#5EEAD4' }}>
              {collaboration.eyebrow}
            </span>
            <h2 className="section-title" style={{ color: '#fff' }}>
              {collaboration.title}
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.78)',
                fontSize: 17,
                lineHeight: 1.75,
                marginTop: 14,
              }}
            >
              {collaboration.text}
            </p>
          </div>

          {/* Collaboration flow */}
          <div className="collab-flow reveal">
            {collaboration.steps.map((s: any, i: number) => (
              <div key={i} className="collab-step">
                <div className="collab-step-icon">
                  <i className={s.icon} />
                </div>
                <span className="collab-step-label">{s.title}</span>
                {i < collaboration.steps.length - 1 && (
                  <span className="collab-arrow" aria-hidden="true">
                    <i className="fas fa-arrow-right" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE LNF ADVANTAGE */}
      <section className="section-gray">
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}
          >
            <span className="eyebrow">{advantage.eyebrow}</span>
            <h2 className="section-title">{advantage.title}</h2>
            <p className="section-subtitle">{advantage.subtitle}</p>
          </div>

          <div className="advantage-grid reveal">
            {advantage.items.map((a: any, i: number) => (
              <div key={i} className="advantage-card">
                <div className="advantage-icon">
                  <i className={a.icon} />
                </div>
                <h3 className="advantage-title">{a.title}</h3>
                <p className="advantage-text">{a.text}</p>
                <div className="advantage-bar" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNER CTA */}
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
              color: 'rgba(255,255,255,0.75)',
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
              <i className="fas fa-handshake" /> {cta.button1Text}
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

      {/* PAGE-SCOPED STYLES */}
      <style>{`
        .partners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 22px;
        }

        .partner-card {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 28px 18px 22px;
          text-align: center;
          transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-height: 170px;
          position: relative;
          overflow: hidden;
        }

        .partner-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(13,148,136,0.03), transparent 60%);
          opacity: 0;
          transition: opacity .35s ease;
          pointer-events: none;
        }

        .partner-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 40px rgba(10,15,31,0.10);
          border-color: rgba(13,148,136,0.30);
        }

        .partner-card:hover::before { opacity: 1; }

        .partner-logo-wrap {
          height: 66px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .partner-logo-img {
          max-width: 100%;
          max-height: 66px;
          object-fit: contain;
          filter: grayscale(0.1);
          transition: transform .35s ease;
        }

        .partner-card:hover .partner-logo-img {
          transform: scale(1.05);
        }

        .partner-monogram {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Poppins', sans-serif;
          font-weight: 800;
          font-size: 18px;
          letter-spacing: 0.5px;
          border: 1.5px solid;
          transition: transform .35s ease;
        }

        .partner-card:hover .partner-monogram {
          transform: scale(1.06);
        }

        .partner-name {
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--navy-900);
          line-height: 1.4;
          margin: 0;
        }

        /* Collaboration flow */
        .collab-flow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 10px;
        }

        .collab-step {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }

        .collab-step-icon {
          width: 62px;
          height: 62px;
          border-radius: 18px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.14);
          color: #5EEAD4;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          backdrop-filter: blur(8px);
          transition: transform .3s ease, background .3s ease;
        }

        .collab-step:hover .collab-step-icon {
          transform: translateY(-4px);
          background: rgba(94,234,212,0.14);
        }

        .collab-step-label {
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .collab-arrow {
          color: rgba(94,234,212,0.55);
          font-size: 15px;
          margin: 0 12px;
        }

        /* Advantage */
        .advantage-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 22px;
        }

        .advantage-card {
          background: #fff;
          border-radius: 18px;
          padding: 34px 26px 28px;
          border: 1px solid #EEF2F5;
          box-shadow: 0 6px 22px rgba(10,15,31,0.045);
          position: relative;
          overflow: hidden;
          transition: transform .35s ease, box-shadow .35s ease;
        }

        .advantage-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 45px rgba(10,15,31,0.10);
        }

        .advantage-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: linear-gradient(135deg, #E0F2F1, #CCFBF1);
          color: var(--teal);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 20px;
          transition: transform .35s ease;
        }

        .advantage-card:hover .advantage-icon {
          transform: rotate(-4deg) scale(1.05);
        }

        .advantage-title {
          font-family: 'Poppins', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: var(--navy-900);
          margin-bottom: 10px;
          line-height: 1.35;
        }

        .advantage-text {
          color: var(--gray-600);
          font-size: 14px;
          line-height: 1.65;
          margin: 0;
        }

        .advantage-bar {
          position: absolute;
          left: 0;
          bottom: 0;
          height: 4px;
          width: 0;
          background: linear-gradient(90deg, #5EEAD4, #0D9488);
          transition: width .45s ease;
        }

        .advantage-card:hover .advantage-bar {
          width: 100%;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .collab-flow { gap: 4px; }
          .collab-step-icon { width: 54px; height: 54px; font-size: 19px; border-radius: 15px; }
          .collab-step-label { font-size: 11.5px; letter-spacing: 0.8px; }
          .collab-arrow { margin: 0 6px; font-size: 13px; }
        }

        @media (max-width: 640px) {
          .partners-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
          .partner-card { padding: 22px 12px 18px; min-height: 150px; border-radius: 14px; }
          .partner-monogram { width: 54px; height: 54px; border-radius: 14px; font-size: 15px; }
          .partner-logo-wrap { height: 56px; margin-bottom: 10px; }
          .partner-logo-img { max-height: 56px; }
          .partner-name { font-size: 12px; }

          .collab-flow { flex-direction: column; gap: 12px; }
          .collab-step { flex-direction: column; text-align: center; gap: 8px; }
          .collab-arrow { transform: rotate(90deg); margin: 4px 0; }
          .collab-step-icon { width: 58px; height: 58px; }
        }
      `}</style>
    </>
  );
}