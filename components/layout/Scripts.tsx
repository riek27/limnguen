'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Scripts() {
  const pathname = usePathname();

  useEffect(() => {
    // ---------- NAVBAR SCROLL + BACK TO TOP ----------
    const navbar = document.getElementById('navbar') as HTMLElement | null;

    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    const handleScroll = () => {
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
      backToTop.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    backToTop.addEventListener('click', handleBackToTop);

    // ---------- HERO SLIDER ----------
    const slides = document.querySelectorAll('.hero-slide');
    let slideInterval: ReturnType<typeof setInterval> | null = null;

    if (slides.length > 0) {
      let current = 0;
      slideInterval = setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
      }, 5000);
    }

    // ---------- REVEAL ON SCROLL ----------
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealElements.forEach((el) => revealObserver.observe(el));

    // Fallback: force-reveal after 1.5s
    const fallbackTimer = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
        el.classList.add('visible');
      });
    }, 1500);

    // ---------- ANIMATED COUNTERS ----------
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const rawValue = el.getAttribute('data-count');
            const target = parseInt(rawValue || '0', 10);
            const targetNumber = isNaN(target) ? 0 : target;
            const duration = 2000;
            const start = performance.now();

            function updateCount(now: number) {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const currentVal = Math.floor(eased * targetNumber);
              el.textContent = currentVal + '+';
              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                el.textContent = targetNumber + '+';
              }
            }
            requestAnimationFrame(updateCount);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((counter) => counterObserver.observe(counter));

    // ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
    const handleSmoothScroll = (e: Event) => {
      const anchor = e.currentTarget as HTMLAnchorElement;
      const href = anchor.getAttribute('href');

      // Must be a non-empty hash link
      if (!href || !href.startsWith('#')) return;

      // ← FIX 1: '#' alone, '#!', or any hash < 2 chars is NOT a valid selector
      if (href === '#' || href === '#!' || href.length < 2) return;

      // ← FIX 2: wrap in try/catch so ANY invalid selector fails silently
      //          (e.g. '#123abc' or other malformed hashes) instead of crashing the app
      let target: HTMLElement | null = null;
      try {
        target = document.querySelector(href) as HTMLElement | null;
      } catch {
        return;
      }

      if (target) {
        e.preventDefault();
        const navbarEl = document.getElementById('navbar') as HTMLElement | null;
        const offset = (navbarEl?.offsetHeight || 80) + 16;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', handleSmoothScroll);
    });

    // ---------- CONTACT FORM (Web3Forms) ----------
    const contactForm = document.getElementById('contactForm') as HTMLFormElement | null;
    let contactSubmit: ((e: Event) => void) | null = null;

    if (contactForm) {
      contactSubmit = async (e: Event) => {
        e.preventDefault();
        const form = contactForm;
        const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
        if (!btn) return;

        const formData = new FormData(form);
        formData.append('access_key', 'YOUR_WEB3FORMS_KEY_HERE');

        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        try {
          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData,
          });

          if (res.ok) {
            btn.textContent = '✓ Message Sent!';
            form.reset();
            setTimeout(() => {
              btn.textContent = originalText;
              btn.disabled = false;
            }, 3000);
          } else {
            btn.textContent = '✕ Failed – Try Again';
            setTimeout(() => {
              btn.textContent = originalText;
              btn.disabled = false;
            }, 3000);
          }
        } catch {
          btn.textContent = '✕ Network Error';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
          }, 3000);
        }
      };
      contactForm.addEventListener('submit', contactSubmit);
    }

    // ---------- CLEANUP ----------
    return () => {
      window.removeEventListener('scroll', handleScroll);
      backToTop.removeEventListener('click', handleBackToTop);
      if (backToTop.parentNode) backToTop.parentNode.removeChild(backToTop);
      if (slideInterval) clearInterval(slideInterval);
      if (fallbackTimer) clearTimeout(fallbackTimer);
      revealObserver.disconnect();
      counterObserver.disconnect();
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener('click', handleSmoothScroll);
      });
      if (contactForm && contactSubmit) {
        contactForm.removeEventListener('submit', contactSubmit);
      }
    };
  }, [pathname]);

  return null;
}