import { getPage } from '@/lib/db';
import { getInvolvedDefaults } from '@/lib/defaults';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function GetInvolvedPage() {
  let data = { ...getInvolvedDefaults };

  try {
    const saved = await getPage('lnf-get-involved');
    if (saved) data = { ...getInvolvedDefaults, ...saved };
  } catch (error) {
    console.error('Failed to load Get Involved, using defaults:', error);
  }

  const { hero, ways, why, support, cta } = data;

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

      {/* THREE WAYS */}
      <section style={{ background: 'white', paddingTop: 100, paddingBottom: 60 }}>
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}
          >
            <span className="eyebrow">{ways.eyebrow}</span>
            <h2 className="section-title">{ways.title}</h2>
            <p className="section-subtitle">{ways.subtitle}</p>
          </div>

          <div className="gi-ways-grid reveal">
            {ways.items.map((w: any, i: number) => (
              <div
                key={i}
                className="gi-way-card"
                style={{ ['--accent' as any]: w.accent }}
              >
                <div className="gi-way-head">
                  <div className="gi-way-icon">
                    <i className={w.icon} />
                  </div>
                </div>

                <h3 className="gi-way-title">{w.title}</h3>
                <p className="gi-way-text">{w.text}</p>

                {w.features?.length > 0 && (
                  <ul className="gi-way-features">
                    {w.features.map((f: string, fi: number) => (
                      <li key={fi}>
                        <i className="fas fa-check" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <Link href={w.buttonLink} className="gi-way-btn">
                  {w.buttonText} <i className="fas fa-arrow-right" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY GET INVOLVED */}
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
            top: '-25%',
            right: '-15%',
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
            left: '-10%',
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
            style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto' }}
          >
            <span className="eyebrow" style={{ color: '#5EEAD4' }}>
              {why.eyebrow}
            </span>
            <h2 className="section-title" style={{ color: '#fff' }}>
              {why.title}
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.78)',
                fontSize: 17,
                lineHeight: 1.75,
                marginTop: 14,
                maxWidth: 720,
                margin: '14px auto 0',
              }}
            >
              {why.text}
            </p>

            {why.keywords?.length > 0 && (
              <div className="gi-keywords">
                {why.keywords.map((k: string, i: number) => (
                  <span key={i} className="gi-keyword">
                    {k}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW YOU CAN SUPPORT */}
      <section className="section-gray" style={{ paddingTop: 90, paddingBottom: 100 }}>
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}
          >
            <span className="eyebrow">{support.eyebrow}</span>
            <h2 className="section-title">{support.title}</h2>
            <p className="section-subtitle">{support.subtitle}</p>
          </div>

          <div className="gi-support-grid reveal">
            {support.items.map((s: any, i: number) => (
              <div key={i} className="gi-support-card">
                <div
                  className="gi-support-icon"
                  style={{
                    background: `linear-gradient(135deg, ${s.accent}22, ${s.accent}0A)`,
                    color: s.accent,
                    borderColor: `${s.accent}33`,
                  }}
                >
                  <i className={s.icon} />
                </div>

                <h3
                  className="gi-support-title"
                  style={{ color: s.accent }}
                >
                  {s.title}
                </h3>

                <div className="gi-support-flow">
                  <i
                    className="fas fa-arrow-down gi-support-arrow"
                    style={{ color: `${s.accent}88` }}
                  />
                  <ul className="gi-support-features">
                    {s.features?.map((f: string, fi: number) => (
                      <li key={fi}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        style={{
          background:
            'linear-gradient(135deg, #0A0F1F 0%, #102A43 50%, #1B3A5C 100%)',
          textAlign: 'center',
          padding: '100px 20px',
        }}
      >
        <div className="container reveal" style={{ maxWidth: 800 }}>
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
            className="gi-cta-buttons"
            style={{
              display: 'flex',
              gap: 14,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {cta.buttons?.map((b: any, i: number) => {
              const isGold = b.style === 'gold';
              return (
                <Link
                  key={i}
                  href={b.link}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '15px 34px',
                    background: isGold
                      ? 'linear-gradient(135deg, #F5D67B, #D4A12A)'
                      : 'transparent',
                    color: isGold ? '#0A0F1F' : '#fff',
                    border: isGold ? 'none' : '2px solid rgba(255,255,255,0.5)',
                    borderRadius: 999,
                    fontWeight: 700,
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 15,
                    boxShadow: isGold
                      ? '0 12px 30px rgba(212,161,42,0.35)'
                      : 'none',
                  }}
                >
                  {b.icon && <i className={b.icon} />} {b.text}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* PAGE STYLES */}
      <style>{`
        /* WAYS GRID */
        .gi-ways-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .gi-way-card {
          --accent: var(--teal);
          background: #fff;
          border: 1px solid #EEF2F5;
          border-radius: 22px;
          padding: 36px 30px 32px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
        }
        .gi-way-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 60%, white));
        }
        .gi-way-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 55px rgba(10,15,31,0.10);
          border-color: color-mix(in srgb, var(--accent) 30%, transparent);
        }

        .gi-way-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .gi-way-icon {
          width: 66px;
          height: 66px;
          border-radius: 18px;
          background: color-mix(in srgb, var(--accent) 12%, white);
          color: var(--accent);
          border: 1.5px solid color-mix(in srgb, var(--accent) 30%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          transition: transform .35s ease;
        }
        .gi-way-card:hover .gi-way-icon {
          transform: rotate(-4deg) scale(1.06);
        }

        .gi-way-title {
          font-family: 'Poppins', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--navy-900);
          margin: 0 0 12px;
        }
        .gi-way-text {
          color: var(--gray-600);
          font-size: 14.5px;
          line-height: 1.7;
          margin: 0 0 22px;
        }

        .gi-way-features {
          list-style: none;
          padding: 0;
          margin: 0 0 26px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .gi-way-features li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--navy-900);
          font-weight: 500;
        }
        .gi-way-features li i {
          color: var(--accent);
          font-size: 12px;
          background: color-mix(in srgb, var(--accent) 12%, white);
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .gi-way-btn {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          align-self: flex-start;
          padding: 12px 24px;
          background: var(--accent);
          color: #fff;
          border-radius: 999px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 10px 24px color-mix(in srgb, var(--accent) 35%, transparent);
          transition: transform .3s ease, box-shadow .3s ease;
        }
        .gi-way-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px color-mix(in srgb, var(--accent) 45%, transparent);
        }
        .gi-way-btn i {
          font-size: 11px;
          transition: transform .3s ease;
        }
        .gi-way-btn:hover i {
          transform: translateX(4px);
        }

        /* KEYWORDS */
        .gi-keywords {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 34px;
        }
        .gi-keyword {
          display: inline-block;
          padding: 10px 24px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.16);
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          border-radius: 999px;
          backdrop-filter: blur(8px);
          transition: transform .3s ease, background .3s ease;
        }
        .gi-keyword:hover {
          transform: translateY(-3px);
          background: rgba(94,234,212,0.14);
          border-color: rgba(94,234,212,0.35);
        }

        /* SUPPORT GRID */
        .gi-support-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 22px;
          max-width: 900px;
          margin: 0 auto;
        }

        .gi-support-card {
          background: #fff;
          border-radius: 20px;
          padding: 34px 26px 28px;
          text-align: center;
          border: 1px solid #EEF2F5;
          box-shadow: 0 6px 22px rgba(10,15,31,0.045);
          transition: transform .35s ease, box-shadow .35s ease;
        }
        .gi-support-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 45px rgba(10,15,31,0.10);
        }

        .gi-support-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          border: 1.5px solid;
          margin: 0 auto 18px;
          transition: transform .35s ease;
        }
        .gi-support-card:hover .gi-support-icon {
          transform: scale(1.06);
        }

        .gi-support-title {
          font-family: 'Poppins', sans-serif;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin: 0 0 18px;
        }

        .gi-support-flow {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .gi-support-arrow {
          font-size: 16px;
        }
        .gi-support-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .gi-support-features li {
          font-size: 14px;
          color: var(--gray-600);
          font-weight: 500;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .gi-ways-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .gi-way-card {
            padding: 30px 24px 26px;
          }
        }
        @media (max-width: 640px) {
          .gi-way-icon {
            width: 56px;
            height: 56px;
            font-size: 22px;
          }
          .gi-way-title {
            font-size: 19px;
          }
          .gi-way-btn {
            align-self: stretch;
            justify-content: center;
          }
          .gi-keyword {
            padding: 8px 18px;
            font-size: 12px;
            letter-spacing: 1px;
          }
          .gi-support-grid {
            grid-template-columns: 1fr;
          }
          .gi-cta-buttons a {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}