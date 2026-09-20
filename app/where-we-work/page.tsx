import { getPage } from '@/lib/db';
import { whereDefaults } from '@/lib/defaults';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function WhereWeWorkPage() {
  let data = { ...whereDefaults };

  try {
    const saved = await getPage('lnf-where-we-work');
    if (saved) data = { ...whereDefaults, ...saved };
  } catch (error) {
    console.error('Failed to load Where We Work, using defaults:', error);
  }

  const { hero, presence, reaching, howWeWork, programsConnection } = data;

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

      {/* MAP + STATE LIST */}
      <section style={{ background: 'white' }}>
        <div className="container">
          <div className="grid-2 reveal" style={{ alignItems: 'center', gap: 50 }}>
            {/* Map visual */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0A0F1F 0%, #102A43 50%, #1B3A5C 100%)',
                borderRadius: 24,
                padding: '60px 40px',
                boxShadow: 'var(--shadow-lg)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-20%',
                  right: '-15%',
                  width: 320,
                  height: 320,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(13,148,136,0.35) 0%, transparent 70%)',
                }}
              />
              <i
                className="fas fa-map-marked-alt"
                style={{
                  fontSize: 100,
                  color: '#F5D67B',
                  marginBottom: 20,
                  position: 'relative',
                  zIndex: 1,
                }}
              />
              <h3
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 22,
                  color: '#fff',
                  marginBottom: 8,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                South Sudan
              </h3>
              <p
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 14,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                5 states · Multiple counties · Nationwide impact
              </p>
            </div>

            {/* State chips list */}
            <div>
              <span className="eyebrow">{presence.eyebrow}</span>
              <h2 className="section-title">{presence.title}</h2>
              <p style={{ color: 'var(--gray-600)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
                {presence.subtitle}
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {presence.states.map((s: any, i: number) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '14px 18px',
                      marginBottom: 10,
                      background: '#FAF8F4',
                      borderRadius: 14,
                      borderLeft: '4px solid var(--teal)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: '#E0F2F1',
                        color: 'var(--teal)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <i className={s.icon || 'fas fa-map-marker-alt'} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 700,
                          fontSize: 16,
                          color: 'var(--navy-900)',
                        }}
                      >
                        {s.name}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--gray-600)', marginTop: 2 }}>
                        {s.locations.length} {s.locations.length === 1 ? 'location' : 'locations'}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION CARDS */}
      <section className="section-gray">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">Locations</span>
            <h2 className="section-title">Our Presence by State</h2>
            <p className="section-subtitle">
              Detailed locations where LNF implements its programs.
            </p>
          </div>

          <div className="grid-3 reveal" style={{ gap: 24 }}>
            {presence.states.map((s: any, i: number) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: '28px 24px',
                  borderTop: '4px solid var(--teal)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #5EEAD4, #0D9488)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      boxShadow: '0 8px 20px rgba(13,148,136,0.25)',
                    }}
                  >
                    <i className={s.icon || 'fas fa-map-marker-alt'} />
                  </div>
                  <h3
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--navy-900)',
                      lineHeight: 1.25,
                    }}
                  >
                    {s.name}
                  </h3>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
                  {s.locations.map((loc: string, j: number) => (
                    <li
                      key={j}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 14,
                        padding: '5px 0',
                        color: 'var(--navy-800)',
                      }}
                    >
                      <i
                        className="fas fa-circle"
                        style={{ color: 'var(--teal)', fontSize: 6 }}
                      />
                      {loc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REACHING UNDERSERVED COMMUNITIES */}
      <section style={{ background: 'white' }}>
        <div className="container">
          <div
            className="reveal"
            style={{
              maxWidth: 850,
              margin: '0 auto',
              textAlign: 'center',
              padding: '40px 30px',
              background: 'linear-gradient(135deg, #FAF8F4, #FFFFFF)',
              borderRadius: 24,
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span className="eyebrow">{reaching.eyebrow}</span>
            <h2
              className="section-title"
              style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 16 }}
            >
              {reaching.title}
            </h2>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.8,
                color: 'var(--gray-600)',
                maxWidth: 700,
                margin: '0 auto',
              }}
            >
              {reaching.text}
            </p>
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="section-gray">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">{howWeWork.eyebrow}</span>
            <h2 className="section-title">{howWeWork.title}</h2>
            <p className="section-subtitle">{howWeWork.subtitle}</p>
          </div>

          <div className="grid-4 reveal" style={{ gap: 24 }}>
            {howWeWork.steps.map((step: any, i: number) => (
              <div
                key={i}
                className="card"
                style={{
                  textAlign: 'center',
                  padding: '36px 20px 28px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: -20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F5D67B, #D4A12A)',
                    color: '#0A0F1F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 15,
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 10px 25px rgba(212,161,42,0.35)',
                    border: '3px solid #fff',
                  }}
                >
                  {step.number}
                </div>

                <div
                  style={{
                    fontSize: 32,
                    color: 'var(--teal)',
                    marginBottom: 14,
                    marginTop: 6,
                  }}
                >
                  <i className={step.icon} />
                </div>

                <h4
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 18,
                    fontWeight: 700,
                    color: 'var(--navy-900)',
                    marginBottom: 8,
                  }}
                >
                  {step.title}
                </h4>
                <p style={{ color: 'var(--gray-600)', fontSize: 14, lineHeight: 1.6 }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMS CONNECTION */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0A0F1F 0%, #102A43 50%, #1B3A5C 100%)',
          textAlign: 'center',
          padding: '100px 20px',
        }}
      >
        <div className="container reveal" style={{ maxWidth: 750 }}>
          <h2
            className="section-title"
            style={{ color: '#fff', marginBottom: 18 }}
          >
            {programsConnection.title}
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: 17,
              lineHeight: 1.75,
              marginBottom: 34,
            }}
          >
            {programsConnection.text}
          </p>
          <Link
            href={programsConnection.ctaLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #F5D67B, #D4A12A)',
              color: '#0A0F1F',
              borderRadius: 999,
              fontWeight: 700,
              fontFamily: 'Poppins, sans-serif',
              fontSize: 16,
              transition: 'all 0.3s',
              boxShadow: '0 12px 30px rgba(212,161,42,0.4)',
            }}
          >
            <i className="fas fa-arrow-right" /> {programsConnection.ctaText}
          </Link>
        </div>
      </section>
    </>
  );
}