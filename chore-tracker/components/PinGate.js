'use client';

import { useState, useEffect } from 'react';

export default function PinGate({ children }) {
  const [authed, setAuthed] = useState(null); // null = checking, false = needs pin, true = unlocked
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/auth')
      .then(r => r.json())
      .then(d => setAuthed(!!d.authenticated))
      .catch(() => setAuthed(false));
  }, []);

  const submit = async () => {
    if (pin.length < 4) {
      setError('Enter your 4-digit PIN');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        setAuthed(true);
      } else {
        setError('Wrong PIN. Try again.');
        setPin('');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authed === null) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#FFD43A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'cursive',
        fontSize: '24px',
      }}>
        loading...
      </div>
    );
  }

  if (authed) return children;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat+Brush&family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap');
        * { box-sizing: border-box; }
      `}</style>
      <div style={{
        minHeight: '100vh',
        background: '#FFD43A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: "'Patrick Hand', cursive",
      }}>
        <div style={{
          background: '#fff',
          border: '2.5px solid #1a1a1a',
          borderRadius: '28px',
          padding: '40px 32px',
          maxWidth: '360px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '4px 4px 0 #1a1a1a',
        }}>
          <h1 style={{
            fontFamily: "'Caveat Brush', cursive",
            fontSize: '44px',
            margin: '0 0 8px',
            lineHeight: 1,
          }}>
            Chore Chart
          </h1>
          <p style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '20px',
            margin: '0 0 28px',
            opacity: 0.7,
          }}>
            enter your family PIN
          </p>
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={8}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            autoFocus
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '32px',
              fontFamily: "'Caveat Brush', cursive",
              textAlign: 'center',
              letterSpacing: '0.5em',
              border: '2.5px solid #1a1a1a',
              borderRadius: '14px',
              background: '#FFF0B3',
              outline: 'none',
            }}
          />
          {error && (
            <div style={{
              color: '#c0392b',
              fontFamily: "'Caveat', cursive",
              fontSize: '18px',
              marginTop: '12px',
            }}>
              {error}
            </div>
          )}
          <button
            onClick={submit}
            disabled={submitting}
            style={{
              marginTop: '20px',
              width: '100%',
              padding: '14px',
              background: '#1a1a1a',
              color: '#FFD43A',
              border: '2.5px solid #1a1a1a',
              borderRadius: '14px',
              fontFamily: "'Caveat Brush', cursive",
              fontSize: '24px',
              cursor: 'pointer',
              boxShadow: '3px 3px 0 #F2C300',
            }}
          >
            {submitting ? '...' : 'Unlock'}
          </button>
        </div>
      </div>
    </>
  );
}
