import { getPage } from '@/lib/db';
import { aboutDefaults } from '@/lib/defaults';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  let data = { ...aboutDefaults };

  try {
    const saved = await getPage('lnf-about');
    if (saved) data = { ...aboutDefaults, ...saved };
  } catch (error) {
    console.error('Failed to load about page, using defaults:', error);
  }

  const {
    hero, whoWeAre, missionVision, coreValues,
    howWeWork, presence, whyLNF, cta,
  } = data;

  return (
    <>
      {/* HERO */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${hero.backgroundImage})`,
          minHeight: '60vh',
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
            style={{
              color: '#5EEAD4',
              display: 'inline-block',
              marginBottom: 14,
            }}
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
              color: 'rgba(255,255,255,0.85)',
              fontSize: 'clamp(15px, 1.5vw, 19px)',
              maxWidth: 700,
              margin: '24px auto 0',
              lineHeight: 1.7,
            }}
          >
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="section-gray">
        <div className="container">
          <div className="grid-2 reveal">
            <div>
              <span className="eyebrow">{whoWeAre.eyebrow}</span>
              <h2 className="section-title">{whoWeAre.title}</h2>
              <p style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 18 }}>
                {whoWeAre.paragraph1}
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--gray-600)' }}>
                {whoWeAre.paragraph2}
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
                src={whoWeAre.image}
                alt="LNF team and community"
                style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 380 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section style={{ background: 'white' }}>
        <div className="container">
          <div className="grid-2 reveal" style={{ gap: 30 }}>
            <div className="card" style={{ borderLeft: '5px solid var(--teal)' }}>
              <div className="card-icon"><i className={missionVision.mission.icon} /></div>
              <h3 style={{ marginBottom: 12 }}>{missionVision.mission.title}</h3>
              <p style={{ lineHeight: 1.75, color: 'var(--gray-600)' }}>
                {missionVision.mission.text}
              </p>
            </div>
            <div className="card" style={{ borderLeft: '5px solid var(--gold)' }}>
              <div className="card-icon" style={{ background: '#FEF3C7', color: 'var(--gold)' }}>
                <i className={missionVision.vision.icon} />
              </div>
              <h3 style={{ marginBottom: 12 }}>{missionVision.vision.title}</h3>
              <p style={{ lineHeight: 1.75, color: 'var(--gray-600)' }}>
                {missionVision.vision.text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="section-gray">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">{coreValues.eyebrow}</span>
            <h2 className="section-title">{coreValues.title}</h2>
          </div>
          <div className="grid-4 reveal" style={{ gap: 24 }}>
            {coreValues.items.map((v: any, i: number) => (
              <div className="card" key={i} style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div
                  className="card-icon"
                  style={{ margin: '0 auto 16px', display: 'flex' }}
                >
                  <i className={v.icon} />
                </div>
                <h4 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 18, marginBottom: 8 }}>
                  {v.title}
                </h4>
                <p style={{ color: 'var(--gray-600)', fontSize: 14, lineHeight: 1.6 }}>
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section style={{ background: 'white' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">{howWeWork.eyebrow}</span>
            <h2 className="section-title">{howWeWork.title}</h2>
          </div>
          <div className="grid-4 reveal" style={{ gap: 24 }}>
            {howWeWork.items.map((s: any, i: number) => (
              <div
                key={i}
                className="card"
                style={{
                  position: 'relative',
                  paddingTop: 40,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: -20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F5D67B, #D4A12A)',
                    color: '#0A0F1F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 18,
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 10px 25px rgba(212,161,42,0.35)',
                    border: '3px solid #fff',
                  }}
                >
                  {s.number}
                </div>
                <h4 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 20, marginBottom: 10 }}>
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

      {/* OUR PRESENCE */}
      <section className="section-gray">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 40px' }}>
            <span className="eyebrow">{presence.eyebrow}</span>
            <h2 className="section-title">{presence.title}</h2>
            <p className="section-subtitle">{presence.subtitle}</p>
          </div>

          <div className="grid-3 reveal" style={{ gap: 20, marginBottom: 40 }}>
            {presence.states.map((s: any, i: number) => (
              <div
                key={i}
                className="card"
                style={{ padding: '24px 22px', textAlign: 'left' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: '#E0F2F1',
                      color: 'var(--teal)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <i className="fas fa-map-marker-alt" />
                  </div>
                  <h4 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 17, color: 'var(--navy-900)' }}>
                    {s.name}
                  </h4>
                </div>
                <p style={{ color: 'var(--gray-600)', fontSize: 14, lineHeight: 1.6 }}>
                  {s.areas}
                </p>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center' }}>
            <Link
              href={presence.ctaLink}
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
              <i className="fas fa-map-marked-alt" /> {presence.ctaText}
            </Link>
          </div>
        </div>
      </section>

      {/* WHY LNF */}
      <section style={{ background: 'white' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">{whyLNF.eyebrow}</span>
            <h2 className="section-title">{whyLNF.title}</h2>
          </div>
          <div className="grid-3 reveal" style={{ gap: 24 }}>
            {whyLNF.items.map((item: any, i: number) => (
              <div className="card" key={i}>
                <div className="card-icon"><i className={item.icon} /></div>
                <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 18, marginBottom: 8 }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--gray-600)', fontSize: 14, lineHeight: 1.6 }}>
                  {item.text}
                </p>
              </div>
            ))}
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