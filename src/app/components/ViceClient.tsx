'use client';

import { useEffect, useRef, useState } from 'react';
import AboutModal from './AboutModal';
import SecretModal from './SecretModal';
import AlertEvent from './AlertEvent';

type Props = {
  sso: string;
};

type EventAlertData = {
  roomName: string;
  roomId: number;
  look: string;
  username: string;
};

export default function ViceClient({ sso }: Props) {
  const [showAbout, setShowAbout] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [eventData, setEventData] = useState<EventAlertData | null>(null);

  const modalPosition = useRef<{ left: number; top: number } | null>(null);
  const secretPosition = useRef<{ left: number; top: number } | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('wss://ws.vicehabbo.eu:8443');
    wsRef.current = ws;

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

        if (data.command === 'eventalert') {
          const { roomName, roomId, look, username } = data;
          setEventData({ roomName, roomId, look, username });
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
      {showAbout && (
        <AboutModal
          onClose={() => setShowAbout(false)}
          modalPosition={modalPosition}
        />
      )}

      {showSecret && (
        <SecretModal
          onClose={() => setShowSecret(false)}
          modalPosition={secretPosition}
        />
      )}

      {eventData && wsRef.current && (
        <AlertEvent
          roomId={eventData.roomId}
          roomName={eventData.roomName}
          look={eventData.look}
          username={eventData.username}
          ws={wsRef.current}
          onClose={() => setEventData(null)}
        />
      )}
    </>
  );
}
