'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const FALLBACK_FOOTER = {
  aboutText:
    'Lim Nguen Foundation (LNF) is a locally led National Non-Governmental Organization established in South Sudan in 2019. Founded and led by young South Sudanese with lived experiences of displacement, LNF brings community perspectives and local knowledge to humanitarian, development and resilience-building action.',
  columns: [
    {
      title: 'Organization',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Programs', href: '/programs' },
        { label: 'Where We Work', href: '/where-we-work' },
        { label: 'Impact', href: '/impact' },
        { label: 'People & Leadership', href: '/board-of-directors' },
      ],
    },
    {
      title: 'Get Involved',
      links: [
        { label: 'Volunteer', href: '/get-involved' },
        { label: 'Donate', href: '/donate' },
        { label: 'Partner With Us', href: '/partners' },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'News', href: '/news' },
        { label: 'Publications', href: '/resources' },
        { label: 'Reports', href: '/resources' },
        { label: 'Policies', href: '/resources' },
      ],
    },
    {
      title: 'Get in Touch',
      links: [
        {
          icon: 'fas fa-map-marker-alt',
          label: 'Tambura Road, Juba, South Sudan',
          href: 'https://maps.google.com/?q=Tambura+Road,+Juba,+South+Sudan',
        },
        { icon: 'fas fa-phone', label: '+211 927 960 466', href: 'tel:+211927960466' },
        {
          icon: 'fab fa-whatsapp',
          label: 'WhatsApp: +211 927 960 466',
          href: 'https://wa.me/211927960466',
        },
        {
          icon: 'fas fa-envelope',
          label: 'info@limnguenfoundation.org',
          href: 'mailto:info@limnguenfoundation.org',
        },
        {
          icon: 'fas fa-globe',
          label: 'limnguenfoundation.org',
          href: 'https://www.limnguenfoundation.org',
        },
      ],
    },
  ],
  socialLinks: [
    {
      icon: 'fab fa-facebook-f',
      label: 'Facebook',
      url: 'https://www.facebook.com/LimN.Foundation',
      className: 'facebook',
    },
    {
      icon: 'fab fa-linkedin-in',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/lim-nguen-foundation-87326a278/',
      className: 'linkedin',
    },
    {
      icon: 'fab fa-whatsapp',
      label: 'WhatsApp',
      url: 'https://wa.me/211927960466',
      className: 'whatsapp',
    },
  ],
  copyrightText: 'Lim Nguen Foundation (LNF). All rights reserved.',
  creditText: 'Uplifting Lives Through Locally Led Humanitarian Action',
};

const FALLBACK_SITE = {
  name: 'Lim Nguen Foundation',
  tagline: 'Uplifting Lives',
  logo: '/images/limlogo.jpg',
};

export default function Footer() {
  const [footer, setFooter] = useState<any>(FALLBACK_FOOTER);
  const [site, setSite] = useState<any>(FALLBACK_SITE);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((json) => {
        if (json?.footer) {
          setFooter({
            ...FALLBACK_FOOTER,
            ...json.footer,
            columns:
              Array.isArray(json.footer.columns) && json.footer.columns.length > 0
                ? json.footer.columns
                : FALLBACK_FOOTER.columns,
            socialLinks:
              Array.isArray(json.footer.socialLinks) && json.footer.socialLinks.length > 0
                ? json.footer.socialLinks
                : FALLBACK_FOOTER.socialLinks,
          });
        }
        if (json?.site) setSite({ ...FALLBACK_SITE, ...json.site });
      })
      .catch(() => {});
  }, []);

  const columns: any[] = footer.columns || [];
  const socialLinks: any[] = footer.socialLinks || [];

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand + About */}
        <div className="footer-col footer-about">
          <Link href="/" className="footer-brand">
            <img src={site.logo || '/images/limlogo.jpg'} alt={site.name || 'LNF'} />
            <span className="footer-brand-text">
              <strong>{site.name || 'Lim Nguen Foundation'}</strong>
              <span>{site.tagline || 'Uplifting Lives'}</span>
            </span>
          </Link>
          <p>{footer.aboutText}</p>

          <div className="footer-socials">
            {socialLinks.map((s: any, i: number) => (
              <a
                key={i}
                href={s.url}
                className={s.className || ''}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
              >
                <i className={s.icon} />
              </a>
            ))}
          </div>
        </div>

        {/* Dynamic Columns */}
        {columns.map((col: any, ci: number) => (
          <div className="footer-col" key={ci}>
            <h4>{col.title}</h4>
            <ul className="footer-links">
              {(col.links || []).map((link: any, li: number) => (
                <li key={li}>
                  {link.icon ? (
                    <a
                      className="footer-contact"
                      href={link.href}
                      target={link.href?.startsWith('http') ? '_blank' : undefined}
                      rel={link.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      <i className={link.icon} />
                      <span>{link.label}</span>
                    </a>
                  ) : link.href?.startsWith('http') ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href || '/'}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} {footer.copyrightText || 'Lim Nguen Foundation. All rights reserved.'}
          {footer.creditText && (
            <>
              <span style={{ opacity: 0.5, margin: '0 8px' }}>|</span>
              <Link href="/about">{footer.creditText}</Link>
            </>
          )}
        </p>
      </div>
    </footer>
  );
}