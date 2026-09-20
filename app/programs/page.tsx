import { getPage } from '@/lib/db';
import { programsDefaults } from '@/lib/defaults';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProgramsPage() {
  let data = { ...programsDefaults };

  try {
    const saved = await getPage('lnf-programs');
    if (saved) data = { ...programsDefaults, ...saved };
  } catch (error) {
    console.error('Failed to load programs, using defaults:', error);
  }

  const { hero, programs, integrated, whoWeServe, where, cta } = data;

  return (
    <>
      {/* HERO */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${hero.backgroundImage})`,
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
          <span className="eyebrow" style={{ color: '#5EEAD4', display: 'inline-block', marginBottom: 14 }}>
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
              maxWidth: 760,
              margin: '18px auto 0',
              lineHeight: 1.7,
            }}
          >
            {hero.description}
          </p>
        </div>
      </section>

      {/* NINE PROGRAMS */}
      <section className="section-gray">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">{programs.eyebrow}</span>
            <h2 className="section-title">{programs.title}</h2>
            <p className="section-subtitle">{programs.subtitle}</p>
          </div>

          <div className="grid-3 reveal" style={{ gap: 28 }}>
            {programs.items.map((p: any, i: number) => (
              <div
                key={i}
                className="card program-card"
                style={{
                  position: 'relative',
                  paddingTop: 44,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Number badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 18,
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 800,
                    fontSize: 22,
                    color: 'rgba(13,148,136,0.15)',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {p.number}
                </div>

                <div className="program-icon" style={{ marginBottom: 20 }}>
                  <i className={p.icon} />
                </div>

                <h3
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 19,
                    lineHeight: 1.35,
                    marginBottom: 12,
                    color: 'var(--navy-900)',
                  }}
                >
                  {p.title}
                </h3>

                <p
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: 14.5,
                    lineHeight: 1.65,
                    flex: 1,
                    marginBottom: 16,
                  }}
                >
                  {p.text}
                </p>

                <div
                  style={{
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                    paddingTop: 14,
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      color: 'var(--teal)',
                      marginBottom: 8,
                    }}
                  >
                    Focus Areas
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {p.list.map((item: string, j: number) => (
                      <li
                        key={j}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: 13.5,
                          padding: '3px 0',
                          color: 'var(--navy-800)',
                        }}
                      >
                        <i className="fas fa-check" style={{ color: 'var(--teal)', fontSize: 11 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATED APPROACH */}
      <section style={{ background: 'white' }}>
        <div className="container">
          <div className="grid-2 reveal" style={{ alignItems: 'center', gap: 50 }}>
            <div>
              <span className="eyebrow">{integrated.eyebrow}</span>
              <h2 className="section-title">{integrated.title}</h2>
              <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--gray-600)' }}>
                {integrated.text}
              </p>
            </div>
            <div
              style={{
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <img
                src={integrated.image}
                alt="Integrated programs"
                style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 340 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="section-gray">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">{whoWeServe.eyebrow}</span>
            <h2 className="section-title">{whoWeServe.title}</h2>
            <p className="section-subtitle">{whoWeServe.subtitle}</p>
          </div>

          <div className="grid-5 reveal" style={{ gap: 20 }}>
            {whoWeServe.items.map((item: any, i: number) => (
              <div
                key={i}
                className="card"
                style={{
                  textAlign: 'center',
                  padding: '28px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: '#E0F2F1',
                    color: 'var(--teal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    marginBottom: 14,
                  }}
                >
                  <i className={item.icon} />
                </div>
                <h4
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 15,
                    fontWeight: 700,
                    marginBottom: 6,
                    color: 'var(--navy-900)',
                  }}
                >
                  {item.title}
                </h4>
                <p style={{ color: 'var(--gray-600)', fontSize: 12.5, lineHeight: 1.5 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHERE WE WORK */}
      <section style={{ background: 'white' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 40px' }}>
            <span className="eyebrow">{where.eyebrow}</span>
            <h2 className="section-title">{where.title}</h2>
            <p className="section-subtitle">{where.text}</p>
          </div>

          <div
            className="reveal"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 12,
              marginBottom: 36,
            }}
          >
            {where.states.map((s: string, i: number) => (
              <span
                key={i}
                style={{
                  padding: '12px 26px',
                  background: 'linear-gradient(135deg, #F5D67B, #D4A12A)',
                  color: '#0A0F1F',
                  borderRadius: 999,
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: 14,
                  boxShadow: '0 8px 20px rgba(212,161,42,0.25)',
                }}
              >
                <i className="fas fa-map-marker-alt" style={{ marginRight: 8 }} />
                {s}
              </span>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center' }}>
            <Link
              href={where.ctaLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 32px',
                background: 'var(--navy-900)',
                color: '#fff',
                borderRadius: 999,
                fontWeight: 700,
                fontFamily: 'Poppins, sans-serif',
                fontSize: 15,
                transition: 'all 0.3s',
                boxShadow: '0 12px 30px rgba(10,15,31,0.25)',
              }}
            >
              <i className="fas fa-map-marked-alt" /> {where.ctaText}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0A0F1F 0%, #102A43 50%, #1B3A5C 100%)',
          textAlign: 'center',
          padding: '100px 20px',
        }}
      >
        <div className="container reveal" style={{ maxWidth: 700 }}>
          <h2
            className="section-title"
            style={{ color: '#fff', marginBottom: 16 }}
          >
            {cta.title}
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: 17,
              lineHeight: 1.7,
              marginBottom: 32,
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
                transition: 'all 0.3s',
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
                transition: 'all 0.3s',
              }}
            >
              <i className="fas fa-heart" /> {cta.button2Text}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}