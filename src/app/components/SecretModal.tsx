'use client';

import React, { useEffect, useRef } from 'react';

type Props = {
  onClose: () => void;
  modalPosition: { current: { left: number; top: number } | null };
};

export default function SecretModal({ onClose, modalPosition }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  const dragData = useRef({
    offsetX: 0,
    offsetY: 0,
    dragging: false,
  });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!modalRef.current) return;

    const modal = modalRef.current;
    const rect = modal.getBoundingClientRect();

    if (modal.style.transform) {
      modal.style.left = `${rect.left}px`;
      modal.style.top = `${rect.top}px`;
      modal.style.transform = '';
      modal.style.position = 'fixed';
    }

    dragData.current.dragging = true;
    dragData.current.offsetX = e.clientX - rect.left;
    dragData.current.offsetY = e.clientY - rect.top;

    // Capture pointer pour recevoir tous les événements même si la souris sort de la modale
    e.currentTarget.setPointerCapture(e.pointerId);

    // Empêche la sélection du texte pendant le drag
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
    if (!dragData.current.dragging) return;

    dragData.current.dragging = false;

    // Relâche la capture du pointeur
    e.currentTarget.releasePointerCapture(e.pointerId);

    // Restaure la sélection du texte
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
      modalRef.current.style.left = '50%';
      modalRef.current.style.top = '50%';
      modalRef.current.style.transform = 'translate(-50%, -50%)';
      modalRef.current.style.position = 'fixed';
    }
  }, [modalPosition]);

  return (
    <div
      ref={modalRef}
      style={{
        position: 'fixed',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        zIndex: 1000,
        width: '300px',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          cursor: 'move',
          padding: '10px 20px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        // Optionnel : empêcher que le drag soit interrompu par d'autres événements
        onPointerCancel={onPointerUp}
      >
        À propos
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '22px',
            lineHeight: 1,
            cursor: 'pointer',
            padding: '0 5px',
          }}
          aria-label="Fermer"
          onPointerDown={e => e.stopPropagation()} // éviter de déclencher drag quand on clique sur le bouton
        >
          &times;
        </button>
      </div>
      <div style={{ padding: '20px', width: '100%', maxWidth: '600px' }}>
        <img
          src="https://myteenwebcam.com/fapp/gifs/11e7a846974a00df7e8fdc1d9219682a.gif"
          alt=""
          style={{ width: '100%', height: 'auto', maxHeight: '400px', borderRadius: '8px' }}
        />
      </div>

    </div>
  );
}
