import { getPage } from '@/lib/db';
import { homepageDefaults } from '@/lib/defaults';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let data = { ...homepageDefaults };

  try {
    const saved = await getPage('lnf-homepage');
    if (saved) data = { ...homepageDefaults, ...saved };
  } catch (error) {
    console.error('PostgreSQL connection failed, using default content:', error);
  }

  const {
    hero, about, mission, programs, where,
    impact, whyPartner, partners, news, resources,
    governance, involved, contact,
  } = data;

  return (
    <>
      {/* HERO */}
      <section className="hero" id="hero">
        {hero.slides.map((img: string, i: number) => (
          <div
            key={i}
            className={`hero-slide ${i === 0 ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">
            Uplifting <span className="accent">Lives</span>
          </h1>
          <div className="hero-rule" />
        </div>
        <a href="#about" className="hero-scroll" aria-label="Scroll to content" />
      </section>

      {/* ABOUT */}
      <section id="about" className="section-gray">
        <div className="grid-2 reveal">
          <div>
            <span className="eyebrow">{about.eyebrow}</span>
            <h2 className="section-title">{about.title}</h2>
            <p style={{ fontSize: 18, marginBottom: 20 }}>{about.paragraph1}</p>
            <p>{about.paragraph2}</p>
            <Link href="/about" className="cta-link">
              Our Mission &amp; Vision <i className="fas fa-arrow-right" />
            </Link>
          </div>
          <div className="card-img" style={{ borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <img src={about.image} alt="Community members in South Sudan" />
          </div>
        </div>
      </section>

      {/* MISSION / VISION / VALUES */}
      <section id="mission" style={{ background: 'white' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">{mission.eyebrow}</span>
            <h2 className="section-title">
              Mission, Vision & <span style={{ color: 'var(--teal)' }}>Core Values</span>
            </h2>
          </div>
          <div className="grid-2 reveal" style={{ marginBottom: 50 }}>
            <div className="card">
              <div className="card-icon"><i className={mission.mission.icon} /></div>
              <h3>{mission.mission.title}</h3>
              <p>{mission.mission.text}</p>
            </div>
            <div className="card">
              <div className="card-icon"><i className={mission.vision.icon} /></div>
              <h3>{mission.vision.title}</h3>
              <p>{mission.vision.text}</p>
            </div>
          </div>
          <div className="grid-2 reveal">
            <div className="card" style={{ background: 'var(--cream)' }}>
              <h3 style={{ marginBottom: 15 }}>Core Values</h3>
              <div className="values-grid">
                {mission.values.map((v: any, i: number) => (
                  <div className="value-item" key={i}>
                    <i className={v.icon} style={{ color: 'var(--teal)' }} /> {v.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: 15 }}>How We Work</h3>
              <div className="approach-steps">
                {mission.steps.map((s: any, i: number) => (
                  <div className="step" key={i}>
                    <span className="step-number">{s.number}</span>
                    <p><strong>{s.title}</strong> – {s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className="section-gray">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">{programs.eyebrow}</span>
            <h2 className="section-title">Our <span style={{ color: 'var(--teal)' }}>Programs</span></h2>
            <p className="section-subtitle">{programs.subtitle}</p>
          </div>
          <div className="programs-grid reveal">
            {programs.items.map((p: any, i: number) => (
              <div className="program-card" key={i}>
                <div className="program-icon"><i className={p.icon} /></div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <ul className="program-list">
                  {p.list.map((item: string, j: number) => (
                    <li key={j}><i className="fas fa-check" /> {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHERE WE WORK */}
      <section
        id="where"
        className="where-we-work"
        style={{ backgroundImage: `url(${where.backgroundImage})` }}
      >
        <div className="where-overlay" />
        <div className="where-content">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>{where.eyebrow}</span>
            <h2 className="section-title" style={{ color: 'white' }}>
              Where <span style={{ color: 'var(--gold-light)' }}>We Work</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)' }}>{where.subtitle}</p>
          </div>
          <div className="where-grid reveal">
            {where.states.map((s: any, i: number) => (
              <div className="where-card" key={i}>
                <div className="where-icon"><i className="fas fa-map-marker-alt" /></div>
                <h3>{s.name}</h3>
                <p>{s.areas}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section id="impact" className="impact-section">
        <div className="impact-container">
          <div className="impact-heading reveal">
            <span className="eyebrow" style={{ color: '#5EEAD4', letterSpacing: 3 }}>{impact.eyebrow}</span>
            <h2 className="section-title" style={{ color: '#FFFFFF' }}>
              Our <span style={{ color: '#F5D67B' }}>Impact</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
              {impact.subtitle}
            </p>
          </div>
          <div className="impact-stats reveal">
            {impact.stats.map((s: any, i: number) => (
              <div className="impact-stat" key={i}>
                <div className="stat-icon"><i className={s.icon} /></div>
                <div className="stat-number" data-count={s.number}>0+</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ textAlign: 'center', marginTop: 50 }}>
            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: '#F5D67B',
                color: '#0A0F1F',
                padding: '16px 32px',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 16,
                transition: 'all 0.3s',
                boxShadow: '0 15px 35px rgba(212,161,42,0.3)',
              }}
            >
              Partner With Us to Expand Our Impact <i className="fas fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY PARTNER */}
      <section id="why-partner" style={{ background: 'white' }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">{whyPartner.eyebrow}</span>
            <h2 className="section-title">The <span style={{ color: 'var(--teal)' }}>LNF Advantage</span></h2>
          </div>
          <div className="grid-2 reveal">
            {whyPartner.items.map((item: any, i: number) => (
              <div className="card" key={i}>
                <div className="card-icon"><i className={item.icon} /></div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS MARQUEE */}
      <section id="partners" className="partners-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span className="eyebrow">{partners.eyebrow}</span>
            <h2 className="section-title">Partners & <span style={{ color: 'var(--teal)' }}>Networks</span></h2>
          </div>
        </div>
        <div className="partner-marquee reveal">
          <div className="partner-track">
            {[...partners.items, ...partners.items].map((name: string, i: number) => (
              <div className="partner-item" key={i}>
                <i className="fas fa-handshake" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section id="news" className="news-section">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">{news.eyebrow}</span>
            <h2 className="section-title">News &amp; <span style={{ color: 'var(--teal)' }}>Announcements</span></h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>{news.subtitle}</p>
          </div>

          <div className="news-grid reveal">
            {news.items.map((item: any, i: number) => (
              <article className="news-card" key={i}>
                <div className="news-image">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <span className={`news-badge ${item.badgeClass || ''}`}>{item.badge}</span>
                </div>
                <div className="news-body">
                  <div className="news-meta">
                    <span><i className="far fa-calendar" />{item.date}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="news-excerpt">{item.excerpt}</p>
                  <div className="news-tags">
                    {item.tags.map((t: string, j: number) => <span key={j}>{t}</span>)}
                  </div>
                  <Link href={item.link} className="news-readmore">
                    Read Full Story <i className="fas fa-arrow-right" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <Link href="/news" className="news-cta reveal">
            <div className="news-cta-grid">
              <div>
                <span className="news-cta-eyebrow"><i className="fas fa-bolt" /> Stay Updated</span>
                <h3>See every story from <span className="accent">the field.</span></h3>
                <p>Milestones, field reports and voices from the communities we serve — all in one place. Visit our newsroom for the full picture.</p>
              </div>
            </div>
            <span className="news-cta-btn">
              Visit Newsroom <i className="fas fa-arrow-right" />
            </span>
          </Link>
        </div>
      </section>

      {/* RESOURCES */}
<section id="resources" style={{ background: 'linear-gradient(135deg, #0A0F1F 0%, #102A43 50%, #1B3A5C 100%)' }}>
  <div className="container">
    <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
      <span className="eyebrow" style={{ color: '#5EEAD4' }}>{resources.eyebrow}</span>
      <h2 className="section-title" style={{ color: '#FFFFFF' }}>
        Resources & <span style={{ color: '#F5D67B' }}>Publications</span>
      </h2>
    </div>

    <div className="resources-grid reveal">
      {resources.items.map((r: any, i: number) => (
        <div
          className="resource-card"
          key={i}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <div className="resource-icon" style={{ background: r.iconBg }}>
            <i className={r.icon} />
          </div>
          <h3 style={{ color: '#FFFFFF' }}>{r.title}</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>{r.text}</p>
        </div>
      ))}
    </div>

    {/* Call to Action */}
    <div className="reveal" style={{ textAlign: 'center', marginTop: 50 }}>
      <Link
        href="/resources"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          background: 'linear-gradient(135deg, #F5D67B, #D4A12A)',
          color: '#0A0F1F',
          padding: '16px 40px',
          borderRadius: 999,
          fontWeight: 700,
          fontSize: 16,
          transition: 'all 0.3s',
          boxShadow: '0 15px 35px rgba(212,161,42,0.35)',
        }}
      >
        <i className="fas fa-folder-open" /> View Resources
      </Link>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 14 }}>
        Browse and download our annual reports, policies, assessments, and public statements.
      </p>
    </div>
  </div>
</section>

      {/* GOVERNANCE */}
      <section id="governance" style={{ background: 'white' }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow">{governance.eyebrow}</span>
            <h2 className="section-title">Governance & <span style={{ color: 'var(--teal)' }}>Accountability</span></h2>
            <p className="section-subtitle">{governance.subtitle}</p>
          </div>
          <div className="grid-2 reveal">
            {governance.items.map((item: any, i: number) => (
              <div className="card" key={i}>
                <div className="card-icon"><i className={item.icon} /></div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GET INVOLVED */}
      <section id="get-involved" style={{ background: 'linear-gradient(135deg, #0A0F1F 0%, #102A43 50%, #1B3A5C 100%)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span className="eyebrow" style={{ color: '#5EEAD4' }}>{involved.eyebrow}</span>
            <h2 className="section-title" style={{ color: '#FFFFFF' }}>
              Get <span style={{ color: '#F5D67B' }}>Involved</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>{involved.subtitle}</p>
          </div>
          <div className="involve-grid reveal">
            {involved.items.map((item: any, i: number) => (
              <div
                className="involve-card"
                key={i}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <div className="involve-icon" style={{ background: item.iconBg }}>
                  <i className={item.icon} />
                </div>
                <h3 style={{ color: '#FFFFFF' }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>{item.text}</p>
                <ul className="involve-list">
                  {item.list.map((li: string, j: number) => (
                    <li key={j} style={{ color: 'rgba(255,255,255,0.85)' }}>
                      <i className="fas fa-check-circle" style={{ color: item.accent }} /> {li}
                    </li>
                  ))}
                </ul>
                <Link href={item.link} style={{ color: item.accent, fontWeight: 700 }}>
                  {item.linkText} <i className="fas fa-arrow-right" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
<section id="contact" className="contact-section">
  <div className="container">
    <div className="reveal" style={{ textAlign: 'center', marginBottom: '50px' }}>
      <span className="eyebrow">{contact.eyebrow}</span>
      <h2 className="section-title">
        Contact <span style={{ color: 'var(--teal)' }}>Us</span>
      </h2>
      <p style={{ color: 'var(--gray-600)', fontSize: '18px', maxWidth: 600, margin: '0 auto' }}>
        Get in touch with our team — we'd love to hear from you.
      </p>
    </div>

    <div className="reveal contact-info" style={{ maxWidth: '1100px', margin: '0 auto', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
      <div className="info-card">
        <div className="info-icon"><i className="fas fa-map-marker-alt" /></div>
        <h4>Visit Us</h4>
        <p>{contact.address}</p>
      </div>
      <div className="info-card">
        <div className="info-icon"><i className="fas fa-phone" /></div>
        <h4>Call Us</h4>
        <p>
          <a href={`tel:${contact.phone?.replace(/\s/g, '')}`} style={{ color: 'inherit' }}>
            {contact.phone}
          </a>
        </p>
      </div>
      <div className="info-card">
        <div className="info-icon"><i className="fas fa-envelope" /></div>
        <h4>Email</h4>
        <p>
          <a href={`mailto:${contact.email}`} style={{ color: 'inherit' }}>
            {contact.email}
          </a>
        </p>
      </div>
      <div className="info-card">
        <div className="info-icon"><i className="fas fa-globe" /></div>
        <h4>Website</h4>
        <p>
          <a href={`https://${contact.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
            {contact.website}
          </a>
        </p>
      </div>
    </div>

    {/* Call to Action */}
    <div className="reveal" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h3
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '1.6rem',
          color: 'var(--navy-900)',
          marginBottom: '16px',
        }}
      >
        Ready to work with us?
      </h3>
      <p
        style={{
          color: 'var(--gray-600)',
          fontSize: '16px',
          maxWidth: 560,
          margin: '0 auto 28px',
          lineHeight: 1.7,
        }}
      >
        Whether you want to partner, donate, volunteer, or simply learn more about our work — reach out and our team will respond promptly.
      </p>
      <Link
        href="/contact"
        className="btn-primary"
        style={{
          padding: '16px 40px',
          fontSize: '16px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        Get in Touch <i className="fas fa-arrow-right" />
      </Link>
    </div>
  </div>
</section>
    </>
  );
}