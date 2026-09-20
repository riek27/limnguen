import { getPage } from '@/lib/db';
import { impactDefaults } from '@/lib/defaults';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ImpactPage() {
  let data = { ...impactDefaults };

  try {
    const saved = await getPage('lnf-impact');
    if (saved) data = { ...impactDefaults, ...saved };
  } catch (error) {
    console.error('Failed to load Impact, using defaults:', error);
  }

  const {
    hero, stats, meaning, acrossSouthSudan,
    throughPrograms, stories, howWeCreate, accountability, cta,
  } = data;

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
          <span className="eyebrow" style={{ color: '#5EEAD4', display: 'inline-block', marginBottom: 14 }}>
            {hero.eyebrow}
          </span>
          <h1 className="hero-title" style={{ fontSize: 'clamp(32px, 6vw, 68px)', lineHeight: 1.15 }}>
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

      {/* STATS AT A GLANCE */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0A0F1F 0%, #102A43 50%, #1B3A5C 100%)',
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
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(13,148,136,0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 60px' }}>
            <span className="eyebrow" style={{ color: '#5EEAD4' }}>{stats.eyebrow}</span>
            <h2 className="section-title" style={{ color: '#fff' }}>{stats.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 17 }}>{stats.subtitle}</p>
          </div>

          <div className="grid-3 reveal" style={{ gap: 28 }}>
            {stats.items.map((s: any, i: number) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 20,
                  padding: '40px 24px',
                  textAlign: 'center',
                  backdropFilter: 'blur(6px)',
                  transition: 'all 0.4s',
                }}
              >
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 20,
                    background: 'rgba(212,161,42,0.2)',
                    color: '#F5D67B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    margin: '0 auto 20px',
                  }}
                >
                  <i className={s.icon} />
                </div>
                <div
                  className="stat-number"
                  data-count={s.number}
                  data-suffix={s.suffix || '+'}
                  style={{
                    fontSize: 'clamp(40px, 5vw, 58px)',
                    fontWeight: 800,
                    color: '#fff',
                    fontFamily: 'Poppins, sans-serif',
                    lineHeight: 1,
                    marginBottom: 12,
                  }}
                >
                  0{s.suffix || '+'}
                </div>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    lineHeight: 1.5,
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT THESE NUMBERS MEAN */}
      <section style={{ background: 'white' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">{meaning.eyebrow}</span>
            <h2 className="section-title">{meaning.title}</h2>
            <p className="section-subtitle">{meaning.subtitle}</p>
          </div>

          <div className="grid-3 reveal" style={{ gap: 24 }}>
            {meaning.items.map((m: any, i: number) => (
              <div
                key={i}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '28px 24px',
                  borderTop: '4px solid var(--teal)',
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
                    fontSize: 24,
                    marginBottom: 16,
                  }}
                >
                  <i className={m.icon} />
                </div>

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'var(--teal)',
                    marginBottom: 8,
                  }}
                >
                  {m.category}
                </span>

                <h3
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 18,
                    fontWeight: 700,
                    color: 'var(--navy-900)',
                    marginBottom: 12,
                  }}
                >
                  {m.number}
                </h3>

                <p
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: 14,
                    lineHeight: 1.65,
                    flex: 1,
                  }}
                >
                  {m.text}
                </p>

                {m.linkText && m.link && (
                  <Link
                    href={m.link}
                    style={{
                      color: 'var(--teal)',
                      fontWeight: 700,
                      fontSize: 14,
                      marginTop: 16,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {m.linkText} <i className="fas fa-arrow-right" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACROSS SOUTH SUDAN */}
      <section className="section-gray">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">{acrossSouthSudan.eyebrow}</span>
            <h2 className="section-title">{acrossSouthSudan.title}</h2>
            <p className="section-subtitle">{acrossSouthSudan.subtitle}</p>
          </div>

          <div className="grid-3 reveal" style={{ gap: 20, marginBottom: 40 }}>
            {acrossSouthSudan.states.map((s: any, i: number) => (
              <div
                key={i}
                className="card"
                style={{ padding: '26px 22px', borderLeft: '4px solid var(--teal)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #5EEAD4, #0D9488)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <i className="fas fa-map-marker-alt" />
                  </div>
                  <h4
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'var(--navy-900)',
                    }}
                  >
                    {s.name}
                  </h4>
                </div>
                <p style={{ color: 'var(--gray-600)', fontSize: 13.5, lineHeight: 1.6 }}>
                  {s.areas}
                </p>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center' }}>
            <Link
              href={acrossSouthSudan.ctaLink}
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
                boxShadow: '0 12px 30px rgba(10,15,31,0.25)',
              }}
            >
              <i className="fas fa-map-marked-alt" /> {acrossSouthSudan.ctaText}
            </Link>
          </div>
        </div>
      </section>

      {/* THROUGH PROGRAMS */}
      <section style={{ background: 'white' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">{throughPrograms.eyebrow}</span>
            <h2 className="section-title">{throughPrograms.title}</h2>
            <p className="section-subtitle">{throughPrograms.subtitle}</p>
          </div>

          <div className="grid-3 reveal" style={{ gap: 20, marginBottom: 40 }}>
            {throughPrograms.items.map((p: any, i: number) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: '24px 20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  borderLeft: '4px solid var(--gold)',
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #F5D67B, #D4A12A)',
                    color: '#0A0F1F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  <i className={p.icon} />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: 15,
                      fontWeight: 700,
                      color: 'var(--navy-900)',
                      marginBottom: 4,
                    }}
                  >
                    {p.title}
                  </h4>
                  <p style={{ color: 'var(--gray-600)', fontSize: 13, lineHeight: 1.5 }}>
                    {p.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center' }}>
            <Link
              href={throughPrograms.ctaLink}
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
                boxShadow: '0 12px 30px rgba(10,15,31,0.25)',
              }}
            >
              <i className="fas fa-arrow-right" /> {throughPrograms.ctaText}
            </Link>
          </div>
        </div>
      </section>

      {/* STORIES FROM THE FIELD */}
      <section className="section-gray">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">{stories.eyebrow}</span>
            <h2 className="section-title">{stories.title}</h2>
            <p className="section-subtitle">{stories.subtitle}</p>
          </div>

          <div className="reveal" style={{ maxWidth: 900, margin: '0 auto' }}>
            <article
              className="card"
              style={{
                overflow: 'hidden',
                padding: 0,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                minHeight: 380,
              }}
            >
              <div style={{ position: 'relative', overflow: 'hidden', minHeight: 280 }}>
                <img
                  src={stories.featured.image}
                  alt={stories.featured.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {stories.featured.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      background: 'rgba(10,15,31,0.85)',
                      color: '#fff',
                      padding: '6px 14px',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    {stories.featured.badge}
                  </span>
                )}
              </div>
              <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span
                  style={{
                    fontSize: 12.5,
                    color: 'var(--gray-600)',
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <i className="far fa-calendar" style={{ color: 'var(--teal)' }} />
                  {stories.featured.date}
                </span>
                <h3
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 24,
                    fontWeight: 700,
                    color: 'var(--navy-900)',
                    lineHeight: 1.3,
                    marginBottom: 14,
                  }}
                >
                  {stories.featured.title}
                </h3>
                <p
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: 15,
                    lineHeight: 1.7,
                    marginBottom: 20,
                  }}
                >
                  {stories.featured.excerpt}
                </p>
                <Link
                  href={stories.featured.link}
                  style={{
                    color: 'var(--teal)',
                    fontWeight: 700,
                    fontSize: 15,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    alignSelf: 'flex-start',
                  }}
                >
                  Read Full Story <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* HOW WE CREATE IMPACT */}
      <section style={{ background: 'white' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">{howWeCreate.eyebrow}</span>
            <h2 className="section-title">{howWeCreate.title}</h2>
            <p className="section-subtitle">{howWeCreate.subtitle}</p>
          </div>

          <div className="grid-4 reveal" style={{ gap: 24 }}>
            {howWeCreate.steps.map((s: any, i: number) => (
              <div
                key={i}
                className="card"
                style={{
                  textAlign: 'center',
                  padding: '40px 20px 28px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: -22,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F5D67B, #D4A12A)',
                    color: '#0A0F1F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 16,
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 10px 25px rgba(212,161,42,0.35)',
                    border: '3px solid #fff',
                  }}
                >
                  {s.number}
                </div>

                <div
                  style={{
                    fontSize: 34,
                    color: 'var(--teal)',
                    marginBottom: 14,
                    marginTop: 6,
                  }}
                >
                  <i className={s.icon} />
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
                  {s.title}
                </h4>
                <p style={{ color: 'var(--gray-600)', fontSize: 14, lineHeight: 1.6 }}>
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCOUNTABILITY */}
      <section className="section-gray">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">{accountability.eyebrow}</span>
            <h2 className="section-title">{accountability.title}</h2>
            <p className="section-subtitle">{accountability.subtitle}</p>
          </div>

          <div className="grid-4 reveal" style={{ gap: 20, marginBottom: 40 }}>
            {accountability.items.map((a: any, i: number) => (
              <div key={i} className="card" style={{ padding: '28px 22px', textAlign: 'center' }}>
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
                    fontSize: 24,
                    margin: '0 auto 16px',
                  }}
                >
                  <i className={a.icon} />
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
                  {a.title}
                </h4>
                <p style={{ color: 'var(--gray-600)', fontSize: 13.5, lineHeight: 1.6 }}>
                  {a.text}
                </p>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center' }}>
            <Link
              href={accountability.ctaLink}
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
                boxShadow: '0 12px 30px rgba(10,15,31,0.25)',
              }}
            >
              <i className="fas fa-file-alt" /> {accountability.ctaText}
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0A0F1F 0%, #102A43 50%, #1B3A5C 100%)',
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
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
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
              <i className="fas fa-heart" /> {cta.button2Text}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}