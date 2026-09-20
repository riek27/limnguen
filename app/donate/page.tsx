import { getPage } from '@/lib/db';
import { donateDefaults } from '@/lib/defaults';
import Link from 'next/link';
import BankDetails from './BankDetails';

export const dynamic = 'force-dynamic';

export default async function DonatePage() {
  let data = { ...donateDefaults };

  try {
    const saved = await getPage('lnf-donate');
    if (saved) data = { ...donateDefaults, ...saved };
  } catch (error) {
    console.error('Failed to load Donate, using defaults:', error);
  }

  const { hero, why, bank, steps, advance, impact, transparency, contact } = data;

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
          minHeight: '60vh',
          height: 'auto',
          padding: '150px 20px 110px',
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
              color: 'rgba(255,255,255,0.78)',
              fontSize: 'clamp(14px, 1.4vw, 17px)',
              maxWidth: 780,
              margin: '18px auto 0',
              lineHeight: 1.7,
            }}
          >
            {hero.description}
          </p>

          <a
            href={hero.buttonLink || '#bank-transfer'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 32,
              padding: '16px 38px',
              background: 'linear-gradient(135deg, #F5D67B, #D4A12A)',
              color: '#0A0F1F',
              borderRadius: 999,
              fontWeight: 700,
              fontFamily: 'Poppins, sans-serif',
              fontSize: 15.5,
              letterSpacing: '0.3px',
              boxShadow: '0 16px 40px rgba(212,161,42,0.4)',
              textDecoration: 'none',
              transition: 'transform .3s ease, box-shadow .3s ease',
            }}
          >
            <i className="fas fa-heart" /> {hero.buttonText}
          </a>
        </div>
      </section>

      {/* WHY YOUR SUPPORT MATTERS */}
      <section style={{ background: 'white', paddingTop: 100, paddingBottom: 40 }}>
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}
          >
            <span className="eyebrow">{why.eyebrow}</span>
            <h2 className="section-title">{why.title}</h2>
            <p className="section-subtitle">{why.subtitle}</p>
          </div>

          <div className="donate-why-grid reveal">
            {why.items.map((w: any, i: number) => (
              <div
                key={i}
                className="donate-why-card"
                style={{ ['--accent' as any]: w.accent }}
              >
                <div className="donate-why-icon">
                  <i className={w.icon} />
                </div>
                <h3 className="donate-why-title">{w.title}</h3>
                <p className="donate-why-text">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANK TRANSFER — CENTERPIECE */}
      <section
        id="bank-transfer"
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
            right: '-10%',
            width: 520,
            height: 520,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(94,234,212,0.16) 0%, transparent 70%)',
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
              'radial-gradient(circle, rgba(212,161,42,0.16) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          className="container"
          style={{ position: 'relative', zIndex: 1, maxWidth: 900 }}
        >
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}
          >
            <span className="eyebrow" style={{ color: '#5EEAD4' }}>
              {bank.eyebrow}
            </span>
            <h2 className="section-title" style={{ color: '#fff' }}>
              {bank.title}
            </h2>
          </div>

          <div className="reveal">
            <BankDetails bank={bank} />
          </div>
        </div>
      </section>

      {/* HOW TO DONATE — STEPS */}
      <section style={{ background: 'white', paddingTop: 100, paddingBottom: 100 }}>
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}
          >
            <span className="eyebrow">{steps.eyebrow}</span>
            <h2 className="section-title">{steps.title}</h2>
            <p className="section-subtitle">{steps.subtitle}</p>
          </div>

          <div className="donate-steps reveal">
            {steps.items.map((s: any, i: number) => (
              <div key={i} className="donate-step">
                <div className="donate-step-badge">{s.number}</div>
                <div className="donate-step-icon">
                  <i className={s.icon} />
                </div>
                <h3 className="donate-step-title">{s.title}</h3>
                <p className="donate-step-text">{s.text}</p>
                {i < steps.items.length - 1 && (
                  <div className="donate-step-arrow" aria-hidden="true">
                    <i className="fas fa-arrow-right" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT SUPPORT ADVANCES */}
      <section className="section-gray" style={{ paddingTop: 100, paddingBottom: 100 }}>
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}
          >
            <span className="eyebrow">{advance.eyebrow}</span>
            <h2 className="section-title">{advance.title}</h2>
            <p className="section-subtitle">{advance.subtitle}</p>
          </div>

          <div className="donate-advance-grid reveal">
            {advance.items.map((a: any, i: number) => (
              <div key={i} className="donate-advance-card">
                <div className="donate-advance-icon">
                  <i className={a.icon} />
                </div>
                <h3 className="donate-advance-title">{a.title}</h3>
                <p className="donate-advance-text">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
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
            width: 500,
            height: 500,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(13,148,136,0.22) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}
          >
            <span className="eyebrow" style={{ color: '#5EEAD4' }}>
              {impact.eyebrow}
            </span>
            <h2 className="section-title" style={{ color: '#fff' }}>
              {impact.title}
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 16,
                marginTop: 8,
              }}
            >
              {impact.subtitle}
            </p>
          </div>

          <div className="donate-impact-grid reveal">
            {impact.items.map((s: any, i: number) => (
              <div key={i} className="donate-impact-card">
                <div className="donate-impact-icon">
                  <i className={s.icon} />
                </div>
                <div
                  className="stat-number"
                  data-count={s.number}
                  data-suffix={s.suffix || '+'}
                  style={{
                    fontSize: 'clamp(34px, 4vw, 46px)',
                    fontWeight: 800,
                    color: '#fff',
                    fontFamily: 'Poppins, sans-serif',
                    lineHeight: 1,
                    marginBottom: 10,
                  }}
                >
                  0{s.suffix || '+'}
                </div>
                <p className="donate-impact-label">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginTop: 50 }}>
            <Link
              href={impact.buttonLink}
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
              <i className="fas fa-chart-line" /> {impact.buttonText}
            </Link>
          </div>
        </div>
      </section>

      {/* TRANSPARENCY */}
      <section style={{ background: 'white', paddingTop: 100, paddingBottom: 100 }}>
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 50px' }}
          >
            <span className="eyebrow">{transparency.eyebrow}</span>
            <h2 className="section-title">{transparency.title}</h2>
            <p className="section-subtitle">{transparency.text}</p>
          </div>

          <div className="donate-trans-pills reveal">
            {transparency.items.map((t: any, i: number) => (
              <div key={i} className="donate-trans-pill">
                <div className="donate-trans-pill-icon">
                  <i className={t.icon} />
                </div>
                <span>{t.title}</span>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginTop: 46 }}>
            <Link
              href={transparency.buttonLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '15px 34px',
                background: 'var(--navy-900)',
                color: '#fff',
                borderRadius: 999,
                fontWeight: 700,
                fontFamily: 'Poppins, sans-serif',
                fontSize: 15,
                boxShadow: '0 12px 30px rgba(10,15,31,0.25)',
              }}
            >
              <i className="fas fa-file-alt" /> {transparency.buttonText}
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT FOR DONATION QUESTIONS */}
      <section
        className="section-gray"
        style={{ paddingTop: 100, paddingBottom: 100, textAlign: 'center' }}
      >
        <div className="container reveal" style={{ maxWidth: 720 }}>
          <span className="eyebrow">{contact.eyebrow}</span>
          <h2 className="section-title">{contact.title}</h2>
          <p className="section-subtitle">{contact.text}</p>

          <div className="donate-contact-row">
            <a href={contact.emailLink} className="donate-contact-item">
              <i className="fas fa-envelope" />
              <span>{contact.email}</span>
            </a>
            <a href={contact.phoneLink} className="donate-contact-item">
              <i className="fas fa-phone-alt" />
              <span>{contact.phone}</span>
            </a>
          </div>

          <Link
            href={contact.buttonLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 34,
              padding: '15px 34px',
              background: 'var(--navy-900)',
              color: '#fff',
              borderRadius: 999,
              fontWeight: 700,
              fontFamily: 'Poppins, sans-serif',
              fontSize: 15,
              boxShadow: '0 12px 30px rgba(10,15,31,0.25)',
            }}
          >
            <i className="fas fa-paper-plane" /> {contact.buttonText}
          </Link>
        </div>
      </section>

      {/* PAGE STYLES */}
      <style>{`
        /* WHY GRID */
        .donate-why-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 22px;
        }
        .donate-why-card {
          --accent: var(--teal);
          background: #fff;
          border: 1px solid #EEF2F5;
          border-radius: 20px;
          padding: 32px 26px 28px;
          transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
          position: relative;
          overflow: hidden;
        }
        .donate-why-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 55%, white));
        }
        .donate-why-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 50px rgba(10,15,31,0.10);
          border-color: color-mix(in srgb, var(--accent) 30%, transparent);
        }
        .donate-why-icon {
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
          margin-bottom: 18px;
          transition: transform .35s ease;
        }
        .donate-why-card:hover .donate-why-icon {
          transform: rotate(-4deg) scale(1.06);
        }
        .donate-why-title {
          font-family: 'Poppins', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: var(--navy-900);
          margin: 0 0 8px;
          letter-spacing: .2px;
        }
        .donate-why-text {
          color: var(--gray-600);
          font-size: 13.5px;
          line-height: 1.6;
          margin: 0;
        }

        /* STEPS */
        .donate-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
        }
        .donate-step {
          background: #fff;
          border: 1px solid #EEF2F5;
          border-radius: 22px;
          padding: 44px 28px 32px;
          position: relative;
          text-align: center;
          box-shadow: 0 6px 22px rgba(10,15,31,0.045);
          transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
        }
        .donate-step:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 50px rgba(10,15,31,0.10);
          border-color: rgba(13,148,136,0.22);
        }
        .donate-step-badge {
          position: absolute;
          top: -22px;
          left: 50%;
          transform: translateX(-50%);
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F5D67B, #D4A12A);
          color: #0A0F1F;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Poppins', sans-serif;
          font-weight: 800;
          font-size: 16px;
          box-shadow: 0 12px 26px rgba(212,161,42,0.4);
          border: 3px solid #fff;
          z-index: 2;
        }
        .donate-step-icon {
          font-size: 32px;
          color: var(--teal);
          margin: 8px 0 16px;
        }
        .donate-step-title {
          font-family: 'Poppins', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: var(--navy-900);
          margin: 0 0 10px;
          line-height: 1.35;
        }
        .donate-step-text {
          color: var(--gray-600);
          font-size: 13.5px;
          line-height: 1.65;
          margin: 0;
        }
        .donate-step-arrow {
          position: absolute;
          right: -30px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(13,148,136,0.5);
          font-size: 18px;
        }

        /* ADVANCE GRID */
        .donate-advance-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 22px;
        }
        .donate-advance-card {
          background: #fff;
          border: 1px solid #EEF2F5;
          border-radius: 20px;
          padding: 30px 26px 26px;
          display: flex;
          flex-direction: column;
          transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
          box-shadow: 0 6px 22px rgba(10,15,31,0.045);
        }
        .donate-advance-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 50px rgba(10,15,31,0.10);
          border-color: rgba(212,161,42,0.30);
        }
        .donate-advance-icon {
          width: 56px;
          height: 56px;
          border-radius: 15px;
          background: linear-gradient(135deg, #FEF3C7, #FDE68A);
          color: #92400E;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin-bottom: 18px;
          transition: transform .35s ease;
        }
        .donate-advance-card:hover .donate-advance-icon {
          transform: rotate(-4deg) scale(1.06);
        }
        .donate-advance-title {
          font-family: 'Poppins', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: var(--navy-900);
          margin: 0 0 8px;
        }
        .donate-advance-text {
          color: var(--gray-600);
          font-size: 13.5px;
          line-height: 1.6;
          margin: 0;
        }

        /* IMPACT */
        .donate-impact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 22px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .donate-impact-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 34px 20px 28px;
          text-align: center;
          backdrop-filter: blur(6px);
          transition: transform .35s ease, background .35s ease, border-color .35s ease;
        }
        .donate-impact-card:hover {
          transform: translateY(-6px);
          background: rgba(255,255,255,0.09);
          border-color: rgba(94,234,212,0.35);
        }
        .donate-impact-icon {
          width: 62px;
          height: 62px;
          border-radius: 18px;
          background: rgba(212,161,42,0.2);
          color: #F5D67B;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          margin: 0 auto 18px;
        }
        .donate-impact-label {
          color: rgba(255,255,255,0.75);
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          line-height: 1.5;
          margin: 0;
        }

        /* TRANSPARENCY PILLS */
        .donate-trans-pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          max-width: 900px;
          margin: 0 auto;
        }
        .donate-trans-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 22px;
          background: #fff;
          border: 1.5px solid #E5E7EB;
          border-radius: 999px;
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          color: var(--navy-900);
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease, background .3s ease;
        }
        .donate-trans-pill:hover {
          transform: translateY(-3px);
          background: var(--navy-900);
          color: #fff;
          border-color: var(--navy-900);
          box-shadow: 0 14px 30px rgba(10,15,31,0.18);
        }
        .donate-trans-pill-icon {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #E0F2F1;
          color: var(--teal);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: background .3s ease, color .3s ease;
        }
        .donate-trans-pill:hover .donate-trans-pill-icon {
          background: rgba(245,214,123,0.22);
          color: #F5D67B;
        }

        /* CONTACT */
        .donate-contact-row {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 30px;
        }
        .donate-contact-item {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 28px;
          background: #fff;
          border: 1.5px solid #E5E7EB;
          border-radius: 999px;
          font-family: 'Poppins', sans-serif;
          font-size: 14.5px;
          font-weight: 700;
          color: var(--navy-900);
          text-decoration: none;
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
        }
        .donate-contact-item i {
          color: var(--teal);
          font-size: 16px;
        }
        .donate-contact-item:hover {
          transform: translateY(-3px);
          border-color: var(--teal);
          box-shadow: 0 14px 30px rgba(13,148,136,0.18);
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .donate-steps {
            grid-template-columns: 1fr;
            gap: 60px;
            max-width: 420px;
          }
          .donate-step-arrow {
            right: 50%;
            bottom: -30px;
            top: auto;
            transform: translateX(50%) rotate(90deg);
          }
        }
        @media (max-width: 640px) {
          .donate-why-grid { grid-template-columns: 1fr; gap: 16px; }
          .donate-why-card { padding: 26px 22px 22px; }
          .donate-advance-grid { grid-template-columns: 1fr; gap: 16px; }
          .donate-advance-card { padding: 26px 22px 22px; }
          .donate-impact-grid { grid-template-columns: 1fr; gap: 14px; }
          .donate-impact-card { padding: 26px 20px 22px; }
          .donate-trans-pill { font-size: 12.5px; padding: 10px 16px; }
          .donate-trans-pill-icon { width: 26px; height: 26px; font-size: 11px; }
          .donate-contact-item {
            width: 100%;
            justify-content: center;
            font-size: 13.5px;
            padding: 14px 22px;
          }
        }
      `}</style>
    </>
  );
}