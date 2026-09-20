'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const FALLBACK_HEADER = {
  logo: '/images/limlogo.jpg',
  brandName: 'Lim Nguen Foundation',
  tagline: 'Uplifting Lives',
  ctaText: 'Donate',
  ctaLink: '/donate',
  navLinks: [
    { label: 'Home', href: '/' },
    {
      label: 'About',
      href: '/about',
      children: [
        { label: 'Mission & Vision', href: '/about#mission' },
        { label: 'Our Story', href: '/about#story' },
        { label: 'Governance', href: '/about#governance' },
        { label: 'Board of Directors', href: '/board-of-directors' },
      ],
    },
    {
      label: 'Programs',
      href: '/programs',
      children: [
        { label: 'Education in Emergencies', href: '/programs#eie' },
        { label: 'WASH', href: '/programs#wash' },
        { label: 'Protection & GBV', href: '/programs#protection' },
        { label: 'Food Security', href: '/programs#foodsecurity' },
        { label: 'Livelihoods', href: '/programs#livelihoods' },
        { label: 'Climate Change', href: '/programs#climate' },
        { label: 'Youth Leadership', href: '/programs#youth' },
        { label: 'Digital Inclusion', href: '/programs#digital' },
      ],
    },
    { label: 'Where We Work', href: '/where-we-work' },
    { label: 'Impact', href: '/impact' },
    { label: 'Partners', href: '/partners' },
    { label: 'News', href: '/news' },
    { label: 'Resources', href: '/resources' },
    {
      label: 'Get Involved',
      href: '/get-involved',
      children: [
        { label: 'Volunteer', href: '/get-involved#volunteer' },
        { label: 'Donate', href: '/donate' },
        { label: 'Partner', href: '/partners' },
      ],
    },
    { label: 'Contact', href: '/contact' },
  ],
};

const FALLBACK_SITE = {
  phone: '+211 927 960 466',
  contactEmail: 'info@limnguenfoundation.org',
  address: 'Juba, South Sudan',
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [header, setHeader] = useState<any>(FALLBACK_HEADER);
  const [site, setSite] = useState<any>(FALLBACK_SITE);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((json) => {
        if (json?.header) {
          setHeader({
            ...FALLBACK_HEADER,
            ...json.header,
            navLinks:
              Array.isArray(json.header.navLinks) && json.header.navLinks.length > 0
                ? json.header.navLinks
                : FALLBACK_HEADER.navLinks,
          });
        }
        if (json?.site) setSite({ ...FALLBACK_SITE, ...json.site });
      })
      .catch(() => {});
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  const navLinks: any[] = header.navLinks || FALLBACK_HEADER.navLinks;
  const ctaHref = header.ctaLink || '/donate';

  const isCtaLink = (link: any) =>
    !link.children &&
    (link.href === ctaHref || (link.label || '').toLowerCase() === 'donate');

  const regularLinks = navLinks.filter((l) => !isCtaLink(l));
  const phoneHref = `tel:${(site.phone || '').replace(/[^0-9+]/g, '')}`;

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="left">
          {site.phone && (
            <a href={phoneHref}>
              <i className="fas fa-phone"></i> {site.phone}
            </a>
          )}
          {site.contactEmail && (
            <>
              <span>|</span>
              <a href={`mailto:${site.contactEmail}`}>
                <i className="fas fa-envelope"></i> {site.contactEmail}
              </a>
            </>
          )}
        </div>
        <div className="right">{site.address && <span>{site.address}</span>}</div>
      </div>

      {/* Navbar */}
      <nav className="navbar" id="navbar">
        <Link href="/" className="logo">
          <img src={header.logo || '/images/limlogo.jpg'} alt={header.brandName || 'LNF'} />
          <span>{header.brandName || 'Lim Nguen Foundation'}</span>
        </Link>

        <ul className="nav-links">
          {regularLinks.map((link: any, i: number) => (
            <li key={i} className={link.children?.length ? 'dropdown' : ''}>
              <Link href={link.href}>
                {link.label}
                {link.children?.length ? <i className="fas fa-chevron-down" /> : null}
              </Link>
              {link.children?.length ? (
                <div className="dropdown-menu">
                  {link.children.map((c: any, ci: number) => (
                    <Link key={ci} href={c.href}>
                      {c.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
          {header.ctaText && (
            <li>
              <Link href={ctaHref} className="nav-cta">
                {header.ctaText}
              </Link>
            </li>
          )}
        </ul>

        <button
          className="mobile-toggle"
          id="mobileToggle"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'active' : ''}`} id="mobileMenu">
        {regularLinks.map((link: any, i: number) =>
          link.children?.length ? (
            <div key={i}>
              <button
                className="mobile-dropdown-btn"
                aria-expanded={openDropdown === link.label}
                onClick={() =>
                  setOpenDropdown(openDropdown === link.label ? null : link.label)
                }
              >
                {link.label} <i className="fas fa-chevron-down" />
              </button>
              <div
                className={`mobile-submenu ${
                  openDropdown === link.label ? 'open' : ''
                }`}
              >
                {link.children.map((c: any, ci: number) => (
                  <Link key={ci} href={c.href} onClick={closeMenu}>
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link key={i} href={link.href} onClick={closeMenu}>
              {link.label}
            </Link>
          )
        )}
        {header.ctaText && (
          <Link
            href={ctaHref}
            onClick={closeMenu}
            style={{ color: 'var(--gold)', fontWeight: 700 }}
          >
            {header.ctaText}
          </Link>
        )}
      </div>
    </>
  );
}