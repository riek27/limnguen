import { getPage } from '@/lib/db';
import { contactDefaults } from '@/lib/defaults';
import Link from 'next/link';
import ContactForm from './ContactForm';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  let data = { ...contactDefaults };

  try {
    const saved = await getPage('lnf-contact');
    if (saved) data = { ...contactDefaults, ...saved };
  } catch (error) {
    console.error('Failed to load Contact, using defaults:', error);
  }

  const { hero, mainInfo, departments, form, map, quickHelp, social, cta } = data;

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

      {/* MAIN INFO CARDS */}
      <section style={{ background: 'white', paddingTop: 100, paddingBottom: 60 }}>
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}
          >
            <span className="eyebrow">{mainInfo.eyebrow}</span>
            <h2 className="section-title">{mainInfo.title}</h2>
            <p className="section-subtitle">{mainInfo.subtitle}</p>
          </div>

          <div className="ct-main-grid reveal">
            {mainInfo.cards.map((c: any, i: number) => (
              <div
                key={i}
                className="ct-main-card"
                style={{ ['--accent' as any]: c.accent }}
              >
                <div className="ct-main-icon">
                  <i className={c.icon} />
                </div>
                <h3 className="ct-main-title">{c.title}</h3>
                <div className="ct-main-lines">
                  {c.lines?.map((line: string, li: number) => (
                    <p key={li} className="ct-main-line">
                      {line}
                    </p>
                  ))}
                </div>

                {c.buttons?.length > 0 && (
                  <div className="ct-main-buttons">
                    {c.buttons.map((b: any, bi: number) => {
                      const isWhatsApp = b.style === 'whatsapp';
                      return (
                        <a
                          key={bi}
                          href={b.url}
                          target={b.url.startsWith('http') ? '_blank' : undefined}
                          rel={b.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className={`ct-main-btn ${isWhatsApp ? 'ct-main-btn--whatsapp' : ''}`}
                        >
                          <i className={b.icon} />
                          <span>{b.text}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section className="section-gray" style={{ paddingTop: 90, paddingBottom: 100 }}>
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 60px' }}
          >
            <span className="eyebrow">{departments.eyebrow}</span>
            <h2 className="section-title">{departments.title}</h2>
            <p className="section-subtitle">{departments.subtitle}</p>
          </div>

          <div className="ct-dept-grid reveal">
            {departments.items.map((d: any, i: number) => (
              <div
                key={i}
                className="ct-dept-card"
                style={{ ['--accent' as any]: d.accent }}
              >
                <div className="ct-dept-head">
                  <div className="ct-dept-icon">
                    <i className={d.icon} />
                  </div>
                </div>
                <h3 className="ct-dept-title">{d.title}</h3>
                {d.text && <p className="ct-dept-text">{d.text}</p>}
                <a href={`mailto:${d.email}`} className="ct-dept-email">
                  <i className="fas fa-envelope" />
                  <span>{d.email}</span>
                </a>
                <a href={`mailto:${d.email}`} className="ct-dept-btn">
                  Email Team <i className="fas fa-arrow-right" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM + SIDE INFO */}
      <section style={{ background: 'white', paddingTop: 100, paddingBottom: 100 }}>
        <div className="container">
          <div className="ct-form-layout reveal">
            <div className="ct-form-side">
              <span className="eyebrow">{form.eyebrow}</span>
              <h2
                className="section-title"
                style={{ textAlign: 'left', marginBottom: 14 }}
              >
                {form.title}
              </h2>
              <p
                style={{
                  color: 'var(--gray-600)',
                  fontSize: 15.5,
                  lineHeight: 1.75,
                  marginBottom: 32,
                }}
              >
                {form.subtitle}
              </p>

              <div className="ct-side-list">
                {mainInfo.cards.slice(0, 2).map((c: any, i: number) => (
                  <div key={i} className="ct-side-item">
                    <div
                      className="ct-side-icon"
                      style={{
                        background: `linear-gradient(135deg, ${c.accent}22, ${c.accent}0A)`,
                        color: c.accent,
                        borderColor: `${c.accent}33`,
                      }}
                    >
                      <i className={c.icon} />
                    </div>
                    <div>
                      <p className="ct-side-title">{c.title}</p>
                      {c.lines?.map((line: string, li: number) => (
                        <p key={li} className="ct-side-line">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ct-form-main">
              <ContactForm form={form} departments={departments.items} />
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="section-gray" style={{ paddingTop: 90, paddingBottom: 100 }}>
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 50px' }}
          >
            <span className="eyebrow">{map.eyebrow}</span>
            <h2 className="section-title">{map.title}</h2>
            <p className="section-subtitle">{map.address}</p>
          </div>

          <div className="ct-map-wrap reveal">
            <iframe
              src={map.embedUrl}
              title="LNF Office Location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
              allowFullScreen
            />
            <div className="ct-map-footer">
              <div className="ct-map-address">
                <i className="fas fa-map-marker-alt" />
                <span>{map.address}</span>
              </div>
              <a
                href={map.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ct-map-btn"
              >
                <i className="fas fa-directions" /> {map.directionsText}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK HELP */}
      <section style={{ background: 'white', paddingTop: 90, paddingBottom: 100 }}>
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 50px' }}
          >
            <span className="eyebrow">{quickHelp.eyebrow}</span>
            <h2 className="section-title">{quickHelp.title}</h2>
          </div>

          <div className="ct-help-grid reveal">
            {quickHelp.items.map((h: any, i: number) => (
              <div
                key={i}
                className="ct-help-card"
                style={{ ['--accent' as any]: h.accent }}
              >
                <div className="ct-help-icon">
                  <i className={h.icon} />
                </div>
                <h3 className="ct-help-title">{h.title}</h3>
                <p className="ct-help-text">{h.text}</p>
                <a href={h.buttonLink} className="ct-help-btn">
                  {h.buttonText} <i className="fas fa-arrow-right" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL */}
      <section className="section-gray" style={{ paddingTop: 90, paddingBottom: 100 }}>
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 50px' }}
          >
            <span className="eyebrow">{social.eyebrow}</span>
            <h2 className="section-title">{social.title}</h2>
            <p className="section-subtitle">{social.subtitle}</p>
          </div>

          <div className="ct-social-row reveal">
            {social.links.map((s: any, i: number) => {
              const hasUrl = s.url && s.url.trim() && s.url !== '#';
              if (!hasUrl) {
                return (
                  <span
                    key={i}
                    className="ct-social-btn ct-social-btn--disabled"
                    aria-label={s.label}
                  >
                    <i className={s.icon} />
                    <span>{s.label}</span>
                  </span>
                );
              }
              return (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ct-social-btn"
                  aria-label={s.label}
                >
                  <i className={s.icon} />
                  <span>{s.label}</span>
                </a>
              );
            })}
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
            style={{
              display: 'flex',
              gap: 14,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <a
              href={cta.phoneLink}
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
              <i className="fas fa-phone" /> {cta.phone}
            </a>
            <a
              href={cta.emailLink}
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
              <i className="fas fa-envelope" /> {cta.email}
            </a>
          </div>
        </div>
      </section>

      {/* PAGE STYLES */}
      <style>{`
        /* MAIN INFO CARDS */
        .ct-main-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 22px;
        }
        .ct-main-card {
          --accent: var(--teal);
          background: #fff;
          border-radius: 22px;
          padding: 34px 28px 30px;
          border: 1px solid #EEF2F5;
          box-shadow: 0 6px 22px rgba(10,15,31,0.05);
          transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .ct-main-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 5px;
          background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 55%, white));
        }
        .ct-main-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 50px rgba(10,15,31,0.10);
          border-color: color-mix(in srgb, var(--accent) 30%, transparent);
        }
        .ct-main-icon {
          width: 62px;
          height: 62px;
          border-radius: 16px;
          background: color-mix(in srgb, var(--accent) 12%, white);
          color: var(--accent);
          border: 1.5px solid color-mix(in srgb, var(--accent) 30%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 20px;
          transition: transform .35s ease;
        }
        .ct-main-card:hover .ct-main-icon {
          transform: rotate(-4deg) scale(1.06);
        }
        .ct-main-title {
          font-family: 'Poppins', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--navy-900);
          margin: 0 0 14px;
          letter-spacing: .3px;
        }
        .ct-main-lines {
          display: flex;
          flex-direction: column;
          gap: 3px;
          margin-bottom: 20px;
          flex: 1;
        }
        .ct-main-line {
          color: var(--gray-600);
          font-size: 14px;
          line-height: 1.55;
          margin: 0;
          word-break: break-word;
        }
        .ct-main-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ct-main-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 18px;
          border-radius: 999px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          background: var(--accent);
          color: #fff;
          box-shadow: 0 8px 20px color-mix(in srgb, var(--accent) 30%, transparent);
          transition: transform .3s ease, box-shadow .3s ease;
          border: none;
        }
        .ct-main-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px color-mix(in srgb, var(--accent) 45%, transparent);
        }
        .ct-main-btn--whatsapp {
          background: #25D366;
          box-shadow: 0 8px 20px rgba(37,211,102,0.35);
        }
        .ct-main-btn--whatsapp:hover {
          box-shadow: 0 12px 28px rgba(37,211,102,0.5);
        }

        /* DEPARTMENTS */
        .ct-dept-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 22px;
        }
        .ct-dept-card {
          --accent: var(--teal);
          background: #fff;
          border-radius: 20px;
          padding: 30px 26px 26px;
          border: 1px solid #EEF2F5;
          box-shadow: 0 6px 22px rgba(10,15,31,0.045);
          transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
          display: flex;
          flex-direction: column;
        }
        .ct-dept-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 50px rgba(10,15,31,0.10);
          border-color: color-mix(in srgb, var(--accent) 30%, transparent);
        }
        .ct-dept-head {
          margin-bottom: 18px;
        }
        .ct-dept-icon {
          width: 56px;
          height: 56px;
          border-radius: 15px;
          background: color-mix(in srgb, var(--accent) 12%, white);
          color: var(--accent);
          border: 1.5px solid color-mix(in srgb, var(--accent) 30%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          transition: transform .35s ease;
        }
        .ct-dept-card:hover .ct-dept-icon {
          transform: rotate(-4deg) scale(1.06);
        }
        .ct-dept-title {
          font-family: 'Poppins', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: var(--navy-900);
          margin: 0 0 8px;
        }
        .ct-dept-text {
          color: var(--gray-600);
          font-size: 13.5px;
          line-height: 1.6;
          margin: 0 0 18px;
          flex: 1;
        }
        .ct-dept-email {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: color-mix(in srgb, var(--accent) 8%, white);
          border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
          border-radius: 10px;
          color: var(--accent);
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          word-break: break-all;
          margin-bottom: 14px;
          transition: background .3s ease;
        }
        .ct-dept-email:hover {
          background: color-mix(in srgb, var(--accent) 15%, white);
        }
        .ct-dept-email i {
          flex-shrink: 0;
          font-size: 12px;
        }
        .ct-dept-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          align-self: flex-start;
          padding: 10px 20px;
          background: var(--accent);
          color: #fff;
          border-radius: 999px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 8px 20px color-mix(in srgb, var(--accent) 30%, transparent);
          transition: transform .3s ease, box-shadow .3s ease;
        }
        .ct-dept-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 26px color-mix(in srgb, var(--accent) 45%, transparent);
        }
        .ct-dept-btn i {
          font-size: 11px;
          transition: transform .3s ease;
        }
        .ct-dept-btn:hover i {
          transform: translateX(4px);
        }

        /* FORM LAYOUT */
        .ct-form-layout {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 50px;
          align-items: start;
        }
        .ct-form-side {
          padding-top: 20px;
        }
        .ct-side-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .ct-side-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .ct-side-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          border: 1.5px solid;
        }
        .ct-side-title {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: var(--navy-900);
          margin: 0 0 2px;
          letter-spacing: .3px;
        }
        .ct-side-line {
          color: var(--gray-600);
          font-size: 13.5px;
          margin: 0;
          line-height: 1.5;
          word-break: break-word;
        }

        /* MAP */
        .ct-map-wrap {
          border-radius: 20px;
          overflow: hidden;
          background: #fff;
          border: 1px solid #EEF2F5;
          box-shadow: 0 12px 40px rgba(10,15,31,0.07);
          max-width: 1100px;
          margin: 0 auto;
        }
        .ct-map-wrap iframe {
          width: 100%;
          height: 440px;
          display: block;
        }
        .ct-map-footer {
          padding: 20px 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          background: #fff;
          border-top: 1px solid #EEF2F5;
        }
        .ct-map-address {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--navy-900);
          font-size: 14.5px;
          font-weight: 500;
          max-width: 640px;
          line-height: 1.5;
        }
        .ct-map-address i {
          color: var(--teal);
          font-size: 16px;
          flex-shrink: 0;
        }
        .ct-map-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: var(--navy-900);
          color: #fff;
          border-radius: 999px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 10px 24px rgba(10,15,31,0.18);
          transition: transform .3s ease, box-shadow .3s ease;
          white-space: nowrap;
        }
        .ct-map-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(10,15,31,0.25);
        }

        /* QUICK HELP */
        .ct-help-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 22px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .ct-help-card {
          --accent: var(--teal);
          background: #fff;
          border-radius: 20px;
          padding: 32px 26px 28px;
          border: 1px solid #EEF2F5;
          box-shadow: 0 6px 22px rgba(10,15,31,0.045);
          transition: transform .35s ease, box-shadow .35s ease;
          display: flex;
          flex-direction: column;
        }
        .ct-help-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 50px rgba(10,15,31,0.10);
        }
        .ct-help-icon {
          width: 56px;
          height: 56px;
          border-radius: 15px;
          background: color-mix(in srgb, var(--accent) 12%, white);
          color: var(--accent);
          border: 1.5px solid color-mix(in srgb, var(--accent) 30%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin-bottom: 18px;
        }
        .ct-help-title {
          font-family: 'Poppins', sans-serif;
          font-size: 16.5px;
          font-weight: 700;
          color: var(--navy-900);
          margin: 0 0 8px;
        }
        .ct-help-text {
          color: var(--gray-600);
          font-size: 13.5px;
          line-height: 1.6;
          margin: 0 0 18px;
          flex: 1;
        }
        .ct-help-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          align-self: flex-start;
          padding: 10px 20px;
          background: transparent;
          color: var(--accent);
          border: 1.5px solid var(--accent);
          border-radius: 999px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: all .3s ease;
        }
        .ct-help-btn:hover {
          background: var(--accent);
          color: #fff;
        }
        .ct-help-btn i {
          font-size: 11px;
          transition: transform .3s ease;
        }
        .ct-help-btn:hover i {
          transform: translateX(4px);
        }

        /* SOCIAL */
        .ct-social-row {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .ct-social-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 26px;
          background: #fff;
          border: 1.5px solid #E5E7EB;
          color: var(--navy-900);
          border-radius: 999px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: all .3s ease;
        }
        .ct-social-btn i {
          font-size: 16px;
          color: var(--teal);
          transition: color .3s ease;
        }
        .ct-social-btn:hover {
          background: var(--navy-900);
          color: #fff;
          border-color: var(--navy-900);
          transform: translateY(-3px);
          box-shadow: 0 14px 30px rgba(10,15,31,0.18);
        }
        .ct-social-btn:hover i {
          color: #F5D67B;
        }
        .ct-social-btn--disabled {
          opacity: 0.45;
          cursor: not-allowed;
          pointer-events: none;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .ct-form-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .ct-form-side {
            padding-top: 0;
          }
          .ct-map-wrap iframe {
            height: 360px;
          }
        }
        @media (max-width: 640px) {
          .ct-main-grid { grid-template-columns: 1fr; gap: 16px; }
          .ct-main-card { padding: 28px 22px 24px; }
          .ct-dept-grid { grid-template-columns: 1fr; gap: 16px; }
          .ct-dept-card { padding: 26px 22px 22px; }
          .ct-help-grid { grid-template-columns: 1fr; gap: 16px; }
          .ct-map-wrap iframe { height: 300px; }
          .ct-map-footer { padding: 16px 20px; }
          .ct-map-btn { width: 100%; justify-content: center; }
          .ct-social-btn {
            padding: 12px 20px;
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
}