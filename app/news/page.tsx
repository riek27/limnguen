import { getPage } from '@/lib/db';
import { newsDefaults } from '@/lib/defaults';
import Link from 'next/link';
import NewsArticle from './NewsArticle';

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  let data = { ...newsDefaults };

  try {
    const saved = await getPage('lnf-news');
    if (saved) data = { ...newsDefaults, ...saved };
  } catch (error) {
    console.error('Failed to load News, using defaults:', error);
  }

  const { hero, latest, all, cta, articles = [] } = data;

  const featured = articles.find((a: any) => a.featured) || articles[0];
  const rest = articles.filter((a: any) => a.id !== featured?.id);

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

      {/* FEATURED */}
      {featured && (
        <section style={{ background: 'white', paddingTop: 90, paddingBottom: 40 }}>
          <div className="container">
            <div className="reveal" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 44px' }}>
              <span className="eyebrow">{latest.eyebrow}</span>
              <h2 className="section-title">{latest.title}</h2>
            </div>
            <div className="reveal" style={{ maxWidth: 960, margin: '0 auto' }}>
              <NewsArticle article={featured} variant="featured" />
            </div>
          </div>
        </section>
      )}

      {/* ALL NEWS */}
      <section className="section-gray" style={{ paddingTop: 80, paddingBottom: 100 }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 50px' }}>
            <span className="eyebrow">{all.eyebrow}</span>
            <h2 className="section-title">{all.title}</h2>
            <p className="section-subtitle">{all.subtitle}</p>
          </div>

          {rest.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--gray-600)' }}>
              More updates coming soon.
            </p>
          ) : (
            <div className="news-grid reveal">
              {rest.map((article: any) => (
                <NewsArticle key={article.id} article={article} variant="card" />
              ))}
            </div>
          )}
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
        <div className="container reveal" style={{ maxWidth: 750 }}>
          <h2 className="section-title" style={{ color: '#fff', marginBottom: 18 }}>
            {cta.title}
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 18,
              lineHeight: 1.7,
              marginBottom: 10,
              fontWeight: 500,
            }}
          >
            {cta.text}
          </p>
          <p
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 15,
              lineHeight: 1.75,
              marginBottom: 34,
            }}
          >
            {cta.subtitle}
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
            <i className="fas fa-arrow-right" /> {cta.buttonText}
          </Link>
        </div>
      </section>

      <style>{`
        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 26px;
        }
        @media (max-width: 640px) {
          .news-grid { grid-template-columns: 1fr; gap: 20px; }
        }
      `}</style>
    </>
  );
}