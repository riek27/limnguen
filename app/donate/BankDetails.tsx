'use client';

import { useState } from 'react';

interface Props {
  bank: any;
}

export default function BankDetails({ bank }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const lines = (bank?.details || [])
      .map((d: any) => `${d.label}: ${d.value}`)
      .join('\n');
    const text = `${bank?.title || 'Bank Details'}\n\n${lines}`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Silent fail — user can still select manually
    }
  };

  return (
    <div className="bank-card">
      {/* Header */}
      <div className="bank-head">
        <div className="bank-head-icon">
          <i className="fas fa-university" />
        </div>
        <div>
          <span className="bank-eyebrow">{bank?.eyebrow}</span>
          <h3 className="bank-title">{bank?.title}</h3>
        </div>
      </div>

      <p className="bank-subtitle">{bank?.subtitle}</p>

      {/* Details rows */}
      <div className="bank-details">
        {(bank?.details || []).map((d: any, i: number) => (
          <div key={i} className="bank-row">
            <span className="bank-row-label">{d.label}</span>
            <span className="bank-row-value">{d.value}</span>
          </div>
        ))}
      </div>

      {/* Copy button */}
      <button
        type="button"
        onClick={handleCopy}
        className={`bank-copy-btn ${copied ? 'is-copied' : ''}`}
        aria-live="polite"
      >
        {copied ? (
          <>
            <i className="fas fa-check" />
            <span>{bank?.copiedText || 'Copied to Clipboard!'}</span>
          </>
        ) : (
          <>
            <i className="fas fa-copy" />
            <span>{bank?.copyButtonText || 'Copy Bank Details'}</span>
          </>
        )}
      </button>

      {/* Safety note */}
      <div className="bank-note">
        <div className="bank-note-icon">
          <i className="fas fa-shield-alt" />
        </div>
        <div>
          <p className="bank-note-title">{bank?.noteTitle}</p>
          <p className="bank-note-text">{bank?.noteText}</p>
        </div>
      </div>

      <style>{`
        .bank-card {
          background: linear-gradient(160deg, #ffffff 0%, #F8FAFC 100%);
          border-radius: 26px;
          padding: 44px 44px 36px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 20px 60px rgba(10,15,31,0.10);
          max-width: 780px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }
        .bank-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 6px;
          background: linear-gradient(90deg, #0D9488, #F5D67B, #D4A12A);
        }

        .bank-head {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 20px;
        }
        .bank-head-icon {
          width: 68px;
          height: 68px;
          border-radius: 20px;
          background: linear-gradient(135deg, #0A0F1F, #1B3A5C);
          color: #F5D67B;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 10px 24px rgba(10,15,31,0.28);
          flex-shrink: 0;
        }
        .bank-eyebrow {
          display: block;
          font-family: 'Poppins', sans-serif;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 4px;
        }
        .bank-title {
          font-family: 'Poppins', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: var(--navy-900);
          margin: 0;
          line-height: 1.2;
        }
        .bank-subtitle {
          color: var(--gray-600);
          font-size: 14.5px;
          line-height: 1.7;
          margin: 0 0 28px;
        }

        .bank-details {
          background: #fff;
          border: 1.5px dashed #D1D5DB;
          border-radius: 18px;
          padding: 8px 8px;
          margin-bottom: 24px;
        }
        .bank-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 14px 20px;
          border-bottom: 1px solid #F1F5F9;
        }
        .bank-row:last-child { border-bottom: none; }
        .bank-row-label {
          font-family: 'Poppins', sans-serif;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--gray-600);
          flex-shrink: 0;
        }
        .bank-row-value {
          font-family: 'Poppins', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: var(--navy-900);
          text-align: right;
          word-break: break-word;
          letter-spacing: 0.3px;
        }

        .bank-copy-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 18px 24px;
          background: linear-gradient(135deg, #F5D67B, #D4A12A);
          color: #0A0F1F;
          border: none;
          border-radius: 999px;
          font-family: 'Poppins', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.4px;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(212,161,42,0.35);
          transition: transform .25s ease, box-shadow .25s ease, background .3s ease;
        }
        .bank-copy-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 38px rgba(212,161,42,0.45);
        }
        .bank-copy-btn.is-copied {
          background: linear-gradient(135deg, #34D399, #059669);
          color: #fff;
          box-shadow: 0 12px 30px rgba(16,185,129,0.35);
        }
        .bank-copy-btn i { font-size: 15px; }

        .bank-note {
          display: flex;
          gap: 14px;
          margin-top: 24px;
          padding: 18px 20px;
          background: #FEF3C7;
          border: 1.5px solid #FDE68A;
          border-radius: 14px;
        }
        .bank-note-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #fff;
          color: #D97706;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        .bank-note-title {
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px;
          font-weight: 800;
          color: #92400E;
          margin: 0 0 4px;
          letter-spacing: 0.3px;
        }
        .bank-note-text {
          color: #78350F;
          font-size: 13px;
          line-height: 1.65;
          margin: 0;
        }

        @media (max-width: 640px) {
          .bank-card {
            padding: 30px 22px 26px;
            border-radius: 20px;
          }
          .bank-head {
            gap: 14px;
          }
          .bank-head-icon {
            width: 56px;
            height: 56px;
            font-size: 22px;
            border-radius: 16px;
          }
          .bank-title { font-size: 20px; }
          .bank-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            padding: 12px 16px;
          }
          .bank-row-value {
            text-align: left;
            font-size: 14.5px;
          }
          .bank-note {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}