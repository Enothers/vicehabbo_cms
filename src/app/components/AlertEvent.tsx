'use client';

import { useEffect, useState } from 'react';
import styles from '@/app/css/Alertevent.module.css';

type Props = {
    roomName: string;
    roomId: number;
    look: string;
    username: string;
    ws: WebSocket;
    onClose: () => void;
};

export default function AlertEvent({ roomName, roomId, look, username, ws, onClose }: Props) {
    const [fadeOut, setFadeOut] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const res = await fetch('/api/user/getInfo', {
                    credentials: 'include', // Nécessaire si le cookie de session est utilisé
                });

                if (!res.ok) throw new Error('Échec lors de la récupération de l’utilisateur');

                const data = await res.json();
                setUserId(data.user.id);
            } catch (error) {
                console.error('Erreur fetch user ID :', error);
            }
        };

        fetchUserId();
    }, []);

    const handleClose = () => {
        onClose(); // appel direct, pas d'animation
    };
    
    const handleJoin = () => {
        if (userId && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'join_room',
                userId,
                roomId
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
                            appartement !<br /><br /><br />Pour tenter de repartir avec des lots unique !
                        </div>
                        <div className={styles.d82JDu}>
                            <div className={styles.Poz82}>
                                <img
                                    src={`https://imager.vicehabbo.eu/?figure=${look}&headonly=1&head_direction=2`}
                                    alt={`Avatar de ${username}`}
                                />
                                Par {username}
                            </div>
                            <div
                                className={styles.DA02das}
                                onClick={handleJoin}
                                style={{
                                    cursor: userId ? 'pointer' : 'not-allowed',
                                    opacity: userId ? 1 : 0.5
                                }}
                            >
                                Jouer !
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
