'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '919068576896'; // ✅ Replace with your number (country code + number, no +)
const WHATSAPP_MESSAGE = 'Hello! I have a question about your products.';

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          transition: 'transform 0.2s ease',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
        }}
        aria-label="Chat on WhatsApp"
      >
        {/* Tooltip label */}
        <span
          style={{
            background: '#fff',
            color: '#128C7E',
            fontFamily: "'Segoe UI', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            padding: '6px 12px',
            borderRadius: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            whiteSpace: 'nowrap',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateX(0)' : 'translateX(10px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            pointerEvents: 'none',
          }}
        >
          Chat with us
        </span>

        {/* Button */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.5)',
            position: 'relative',
          }}
        >
          {/* Pulse ring */}
          <span
            style={{
              position: 'absolute',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(37, 211, 102, 0.4)',
              animation: 'whatsapp-pulse 2s ease-out infinite',
            }}
          />

          {/* Lucide Icon */}
          <MessageCircle
            size={28}
            color="white"
            fill="white"
            style={{ position: 'relative', zIndex: 1 }}
          />
        </div>
      </a>

      <style>{`
        @keyframes whatsapp-pulse {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </>
  );
}