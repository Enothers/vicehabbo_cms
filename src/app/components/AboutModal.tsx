'use client';

import React, { useEffect, useRef } from 'react';

type Props = {
  onClose: () => void;
  // Ajout de la prop pour mémoriser la position, comme dans le second exemple
  modalPosition: React.MutableRefObject<{ left: number; top: number } | null>;
};

export default function AboutModal({ onClose, modalPosition }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Utilisation de useRef pour le glisser-déposer afin d'éviter les re-renders inutiles
  const dragData = useRef<{
    offsetX: number;
    offsetY: number;
    dragging: boolean;
  }>({
    offsetX: 0,
    offsetY: 0,
    dragging: false,
  });

  // Gère le début du glissement (uniquement sur la barre de titre)
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalRef.current) return;

    const modal = modalRef.current;
    const rect = modal.getBoundingClientRect();

    // Si la modale est centrée avec transform, on la positionne avec left/top avant de glisser
    if (modal.style.transform) {
      modal.style.left = `${rect.left}px`;
      modal.style.top = `${rect.top}px`;
      modal.style.transform = '';
      modal.style.position = 'fixed';
    }

    dragData.current.dragging = true;
    dragData.current.offsetX = e.clientX - rect.left;
    dragData.current.offsetY = e.clientY - rect.top;
  };

  // Gère le mouvement de la souris sur toute la fenêtre
  const onMouseMove = (e: MouseEvent) => {
    if (!dragData.current.dragging || !modalRef.current) return;

    let left = e.clientX - dragData.current.offsetX;
    let top = e.clientY - dragData.current.offsetY;

    // Contraintes pour garder la modale à l'intérieur de la fenêtre
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

    // Mémorise la dernière position
    modalPosition.current = { left, top };
  };

  // Gère la fin du glissement
  const onMouseUp = () => {
    dragData.current.dragging = false;
  };

  // Effet pour initialiser la position et ajouter les écouteurs d'événements
  useEffect(() => {
    if (!modalRef.current) return;

    // Si une position précédente existe, on l'applique
    if (modalPosition.current) {
      modalRef.current.style.left = modalPosition.current.left + 'px';
      modalRef.current.style.top = modalPosition.current.top + 'px';
      modalRef.current.style.transform = '';
      modalRef.current.style.position = 'fixed';
    } else {
      // Sinon, on centre la modale à l'écran
      modalRef.current.style.left = '50%';
      modalRef.current.style.top = '50%';
      modalRef.current.style.transform = 'translate(-50%, -50%)';
      modalRef.current.style.position = 'fixed';
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Nettoyage des écouteurs lors du démontage du composant
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [modalPosition]); // Le tableau de dépendances reste le même

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
        userSelect: 'none', // Empêche la sélection du texte pendant le glissement
      }}
    >
      {/* Barre de titre pour le glisser-déposer */}
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
        onMouseDown={onMouseDown}
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
        >
          &times;
        </button>
      </div>

      {/* Contenu de la modale */}
      <div style={{ padding: '20px' }}>
        <p>Ce client est connecté à ViceHabbo.</p>
        {/* Le bouton "Fermer" est maintenant dans la barre de titre, 
            mais vous pourriez en garder un ici si vous le souhaitez. */}
      </div>
    </div>
  );
}
