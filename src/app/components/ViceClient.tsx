'use client';

import { useEffect, useState } from 'react';
import AboutModal from './AboutModal';

type Props = {
  sso: string;
};

export default function ViceClient({ sso }: Props) {
  const [showAbout, setShowAbout] = useState(false);

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

        if (data.command === ':about') {
          setShowAbout(true);
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
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </>
  );
}
