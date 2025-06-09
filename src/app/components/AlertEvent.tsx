'use client';

import { useState } from 'react';
import styles from '@/app/css/Alertevent.module.css';

type Props = {
  roomName: string;
  roomId: number;
  look: string;
  username: string;
  sso: string;
  ws: WebSocket;
  onClose: () => void;
};

export default function AlertEvent({ roomName, roomId, look, username, sso, ws, onClose }: Props) {
  const [fadeOut, setFadeOut] = useState(false);

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(() => onClose(), 500);
  };

  const handleJoin = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'join_room',
        sso,
        roomId,
      }));
      handleClose();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.event} ${fadeOut ? styles['fade-out'] : ''}`}>
        <div className={styles.left}></div>
        <div className={styles.right}>
          <div className={styles.header}>
            <div className={styles.cold}>
              <img src="icon_gamer.png" alt="" />
              Animation en cours
            </div>
            <div className={styles.close} onClick={handleClose} style={{ cursor: 'pointer' }}>
              <img src="close_24.png" alt="Fermer" />
            </div>
          </div>
          <div className={styles.inf829}>
            <div className={styles.Duh82}>
              [APPART] {roomName}
              <br /><br /><br />
              Viens participer à l'événement exceptionnel organisé par {username} dans son
              appartement !<br /><br /><br />Pour tenter de repartir avec 3 lots !
            </div>
            <div className={styles.d82JDu}>
              <div className={styles.Poz82}>
                <img
                  src={`https://avatar.habbocity.me/?figure=${look}&headonly=1&head_direction=2`}
                  alt={`Avatar de ${username}`}
                />
                Par {username}
              </div>
              <div className={styles.DA02das} onClick={handleJoin} style={{ cursor: 'pointer' }}>
                Jouer !
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
