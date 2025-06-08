'use client';

import { useEffect, useRef, useState } from 'react';
import AboutModal from './AboutModal';
import SecretModal from './SecretModal';

type Props = {
  sso: string;
};

export default function ViceClient({ sso }: Props) {
  const [showAbout, setShowAbout] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const modalPosition = useRef<{ left: number; top: number } | null>(null);
  const secretPosition = useRef<{ left: number; top: number } | null>(null);

  useEffect(() => {
    const ws = new WebSocket('wss://ws.vicehabbo.eu:8443');

    ws.onopen = () => {
      console.log('[VICE] WebSocket connecté !');
      ws.send(JSON.stringify({ type: 'identify', sso }));
    };

    ws.onmessage = (event) => {
      console.log('Message reçu:', event.data);
      try {
        const data = JSON.parse(event.data);

        if (data.command === 'about') {
          setShowAbout(true);
        }

         if (data.command === 'secret') {
          setShowSecret(true);
        }

      } catch (e) {
        console.error('Message invalide:', event.data);
      }
    };


    ws.onclose = () => console.log('WebSocket fermé');
    ws.onerror = (err) => console.error('Erreur WebSocket :', err);

    return () => {
      ws.close();
    };
  }, [sso]);

  return (
    <>
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} modalPosition={modalPosition} />}
      {showSecret && <SecretModal onClose={() => setShowSecret(false)} modalPosition={secretPosition} />}
    </>
  );
}
