'use client';

import { useEffect, useRef, useState } from 'react';
import AboutModal from './AboutModal';
import SecretModal from './SecretModal';
import AlertEvent from './AlertEvent';
import ViceTool from './ViceTool';

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
  const [showViceTool, setShowViceTool] = useState(false);
  const [eventData, setEventData] = useState<EventAlertData | null>(null);
  const [rank, setRank] = useState<number | null>(null); // <-- Nouveau state

  const modalPosition = useRef<{ left: number; top: number } | null>(null);
  const secretPosition = useRef<{ left: number; top: number } | null>(null);
  const passPosition = useRef<{ left: number; top: number } | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Récupérer rank au chargement
  useEffect(() => {
    const fetchUserRank = async () => {
      try {
        const res = await fetch('/api/user/getInfo', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Échec récupération infos utilisateur');
        const data = await res.json();
        setRank(data.user.rank); // <-- Assumons que rank est ici
      } catch (e) {
        console.error('Erreur fetch rank:', e);
      }
    };
    fetchUserRank();
  }, []);

  useEffect(() => {
    const ws = new WebSocket('wss://ws.vicehabbo.eu:8443');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[VICE] WebSocket connecté !');
      ws.send(JSON.stringify({ type: 'identify', sso }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.error('Message valide:', event.data);

        if (data.command === 'about') setShowAbout(true);
        if (data.command === 'secret') setShowSecret(true);
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
      {/* Afficher bouton seulement si rank >= 8 */}
      {rank !== null && rank >= 8 && (
        <div style={{ position: 'fixed', left: '20px', top: '20px', zIndex: 999 }}>
          <button
            onClick={() => setShowViceTool(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Ouvrir ViceTools
          </button>
        </div>
      )}

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

      {showViceTool && wsRef.current && (
        <ViceTool
          ws={wsRef.current}
          onClose={() => setShowViceTool(false)}
          modalPosition={passPosition}
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
