'use client';

import { useEffect, useRef, useState } from 'react';
import AboutModal from './AboutModal';
import WiredSoundModal from './WiredSoundModal';
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

type SoundWiredData = {
  wiredId: string;
};

export default function ViceClient({ sso }: Props) {
  const [showAbout, setShowAbout] = useState(false);
  const [showWiredSound, setshowWiredSound] = useState<SoundWiredData | null>(null);
  const [showViceTool, setShowViceTool] = useState(false);
  const [eventData, setEventData] = useState<EventAlertData | null>(null);
  const [rank, setRank] = useState<number | null>(null);

  const modalPosition = useRef<{ left: number; top: number } | null>(null);
  const wiredSoundPosition = useRef<{ left: number; top: number } | null>(null);
  const passPosition = useRef<{ left: number; top: number } | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Référence audio
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchUserRank = async () => {
      try {
        const res = await fetch('/api/user/getInfo', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Échec récupération infos utilisateur');
        const data = await res.json();
        setRank(data.user.rank);
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
        console.log('Message reçu:', event.data);

        if (data.command === 'about') setShowAbout(true);
        if (data.command === 'eventalert') {
          const { roomName, roomId, look, username } = data;
          setEventData({ roomName, roomId, look, username });
        }
        if (data.command === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
        }

        if (data.command === 'sound_play') {
          const { filename } = data;

          const audioUrl = `/api/uploads/${filename}`;
          const audio = audioRef.current;

          if (audio) {
            try {
              audio.pause(); // stoppe l'ancien son
              audio.currentTime = 0; // remet au début
              audio.src = audioUrl;

              // Optionnel : attendre que la nouvelle source soit prête
              audio.oncanplaythrough = () => {
                audio.play().catch((err) => {
                  console.warn('[VICE] Lecture fichier échouée:', err);
                });
              };
            } catch (err) {
              console.warn('[VICE] Erreur manipulation audio:', err);
            }
          }
        }

        if (data.command === 'openModalWiredSound') {
          const { wiredId } = data;
          setshowWiredSound({ wiredId });
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
      <audio ref={audioRef} src="" preload="auto" />

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

      {showWiredSound && wsRef.current && (
        <WiredSoundModal
          ws={wsRef.current}
          wiredId={showWiredSound.wiredId}
          onClose={() => setshowWiredSound(null)}
          modalPosition={wiredSoundPosition}
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
