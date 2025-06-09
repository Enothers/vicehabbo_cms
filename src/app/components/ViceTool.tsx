'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from '@/app/css/ViceTool.module.css';

type Props = {
  ws: WebSocket;
  onClose: () => void;
  modalPosition: { current: { left: number; top: number } | null };
};

export default function ViceTool({ onClose, modalPosition, ws }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const dragData = useRef({ offsetX: 0, offsetY: 0, dragging: false });
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
    
    const sendAlert = () => {
        if (userId && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'alert_toom',
                userId,
            }));
        }
    };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();

    if (modalRef.current.style.transform) {
      modalRef.current.style.left = `${rect.left}px`;
      modalRef.current.style.top = `${rect.top}px`;
      modalRef.current.style.transform = '';
      modalRef.current.style.position = 'fixed';
    }

    dragData.current.dragging = true;
    dragData.current.offsetX = e.clientX - rect.left;
    dragData.current.offsetY = e.clientY - rect.top;
    e.currentTarget.setPointerCapture(e.pointerId);
    document.body.style.userSelect = 'none';
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragData.current.dragging || !modalRef.current) return;

    let left = e.clientX - dragData.current.offsetX;
    let top = e.clientY - dragData.current.offsetY;

    const modalWidth = modalRef.current.offsetWidth;
    const modalHeight = modalRef.current.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (left < 0) left = 0;
    if (top < 0) top = 0;
    if (left + modalWidth > windowWidth) left = windowWidth - modalWidth;
    if (top + modalHeight > windowHeight) top = windowHeight - modalHeight;

    modalRef.current.style.left = `${left}px`;
    modalRef.current.style.top = `${top}px`;
    modalPosition.current = { left, top };
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragData.current.dragging = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (!modalRef.current) return;
    if (modalPosition.current) {
      modalRef.current.style.left = modalPosition.current.left + 'px';
      modalRef.current.style.top = modalPosition.current.top + 'px';
      modalRef.current.style.transform = '';
      modalRef.current.style.position = 'fixed';
    } else {
      modalRef.current.style.left = '20px';
      modalRef.current.style.top = '20px';
      modalRef.current.style.position = 'fixed';
    }
  }, [modalPosition]);

  return (
    <div ref={modalRef} className={styles.modal}>
      <div
        className={styles.modalHeader}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className={styles.Ojfj8}>
            <img src="settings.png" alt="" />
            ViceTool
        </div>
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Fermer"
          onPointerDown={e => e.stopPropagation()}
        >
            <img src="close_24.png" alt="" />
        </button>
      </div>
      <div className={styles.modalContent}>
        <div className={styles.packed}>
             <div className={styles.name}>Animations</div>
             <div onClick={sendAlert} className={styles.btnSendAnim}>Lancer une animation</div>
        </div>
      </div>
    </div>
  );
}
