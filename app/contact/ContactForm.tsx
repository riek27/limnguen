'use client';

import { useState } from 'react';

export default function ContactForm({ form, departments }: { form: any; departments: any[] }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [values, setValues] = useState({
    name: '',
    email: '',
    subject: '',
    department: departments?.[0]?.title || 'General Information',
    message: '',
  });

  const accessKey =
    form?.web3formsKey || '9a712bec-315b-42dd-92e5-bad4c88633c5';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessKey || accessKey.includes('YOUR_WEB3FORMS')) {
      setErrorMsg(
        'Form is not configured. Please email us at info@limnguenfoundation.org.'
      );
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('access_key', accessKey);
      formData.append('subject', `[LNF Contact] ${values.subject}`);
      formData.append('from_name', 'LNF Website Contact Form');
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('department', values.department);
      formData.append('message', values.message);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('sent');
        setValues({
          name: '',
          email: '',
          subject: '',
          department: departments?.[0]?.title || 'General Information',
          message: '',
        });
      } else {
        setErrorMsg(
          data.message || form?.errorMessage || 'Something went wrong. Please try again.'
        );
        setStatus('error');
      }
    } catch {
      setErrorMsg(
        form?.errorMessage || 'Something went wrong. Please try again.'
      );
      setStatus('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: '1.5px solid #E5E7EB',
    fontSize: '0.95rem',
    fontFamily: 'Poppins, sans-serif',
    outline: 'none',
    background: '#fff',
    color: '#0A0F1F',
    transition: 'border-color .25s, box-shadow .25s',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 6,
    fontWeight: 600,
    fontSize: '0.85rem',
    color: '#0A0F1F',
    fontFamily: 'Poppins, sans-serif',
  };

  /* ---------- SUCCESS STATE ---------- */
  if (status === 'sent') {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
          border: '1.5px solid #A7F3D0',
          borderRadius: 20,
          padding: '50px 30px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            margin: '0 auto 18px',
            boxShadow: '0 12px 30px rgba(16,185,129,0.35)',
          }}
        >
          <i className="fas fa-check" />
        </div>
        <h3
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 22,
            fontWeight: 700,
            color: '#065F46',
            margin: '0 0 10px',
          }}
        >
          {form?.successTitle || 'Message Sent!'}
        </h3>
        <p style={{ color: '#047857', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
          {form?.successMessage || 'Thank you. Our team will respond soon.'}
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          style={{
            marginTop: 24,
            padding: '12px 26px',
            background: '#0A0F1F',
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            fontFamily: 'Poppins, sans-serif',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  /* ---------- FORM ---------- */
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: '#fff',
        borderRadius: 20,
        padding: '38px 32px',
        border: '1px solid #EEF2F5',
        boxShadow: '0 12px 40px rgba(10,15,31,0.06)',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>{form?.fields?.nameLabel || 'Full Name'} *</label>
          <input
            required
            type="text"
            name="name"
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            placeholder={form?.fields?.namePlaceholder || 'Enter your name'}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>{form?.fields?.emailLabel || 'Email Address'} *</label>
          <input
            required
            type="email"
            name="email"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            placeholder={form?.fields?.emailPlaceholder || 'Enter your email'}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>{form?.fields?.subjectLabel || 'Subject'} *</label>
          <input
            required
            type="text"
            name="subject"
            value={values.subject}
            onChange={(e) => setValues({ ...values, subject: e.target.value })}
            placeholder={form?.fields?.subjectPlaceholder || 'What is your message about?'}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>{form?.fields?.departmentLabel || 'Department'} *</label>
          <select
            name="department"
            value={values.department}
            onChange={(e) => setValues({ ...values, department: e.target.value })}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {departments.map((d: any) => (
              <option key={d.id} value={d.title}>
                {d.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>{form?.fields?.messageLabel || 'Message'} *</label>
        <textarea
          required
          rows={6}
          name="message"
          value={values.message}
          onChange={(e) => setValues({ ...values, message: e.target.value })}
          placeholder={form?.fields?.messagePlaceholder || 'Write your message here…'}
          style={{ ...inputStyle, resize: 'vertical', minHeight: 140 }}
        />
      </div>

      {status === 'error' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '14px 18px',
            background: '#FEF2F2',
            border: '1.5px solid #FECACA',
            borderRadius: 12,
            marginBottom: 18,
            color: '#991B1B',
            fontSize: 13.5,
            lineHeight: 1.5,
          }}
        >
          <i
            className="fas fa-exclamation-circle"
            style={{ color: '#DC2626', fontSize: 16, marginTop: 1 }}
          />
          <div>
            <strong style={{ display: 'block', marginBottom: 2 }}>
              {form?.errorTitle || 'Something went wrong'}
            </strong>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          width: '100%',
          padding: '16px 24px',
          background:
            status === 'sending'
              ? 'rgba(212,161,42,0.6)'
              : 'linear-gradient(135deg, #F5D67B, #D4A12A)',
          color: '#0A0F1F',
          border: 'none',
          borderRadius: 999,
          fontSize: 15,
          fontWeight: 700,
          fontFamily: 'Poppins, sans-serif',
          cursor: status === 'sending' ? 'wait' : 'pointer',
          boxShadow: '0 12px 30px rgba(212,161,42,0.35)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          letterSpacing: '0.3px',
        }}
      >
        {status === 'sending' ? (
          <>
            <i className="fas fa-circle-notch fa-spin" /> Sending…
          </>
        ) : (
          <>
            <i className="fas fa-paper-plane" /> {form?.submitText || 'Send Message'}
          </>
        )}
      </button>

      <style>{`
        @media (max-width: 640px) {
          form > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  );
}