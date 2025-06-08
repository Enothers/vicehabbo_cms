'use client';

import React, { useEffect, useRef } from "react";

type Friend = {
  id: string;
  name: string;
  avatar: string;
};

type ModalProfilProps = {
  friend: Friend;
  onClose: () => void;
  modalPosition: React.MutableRefObject<{ left: number; top: number } | null>;
};

export default function ModalProfil({ friend, onClose, modalPosition }: ModalProfilProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const dragData = useRef<{ offsetX: number; offsetY: number; dragging: boolean }>({
    offsetX: 0,
    offsetY: 0,
    dragging: false,
  });

  // Gestion drag & drop modal
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalRef.current) return;

    const modal = modalRef.current;
    const rect = modal.getBoundingClientRect();

    if (modal.style.transform) {
      modal.style.left = `${rect.left}px`;
      modal.style.top = `${rect.top}px`;
      modal.style.transform = "";
      modal.style.position = "fixed";
    }

    dragData.current.dragging = true;
    dragData.current.offsetX = e.clientX - rect.left;
    dragData.current.offsetY = e.clientY - rect.top;
  };

  const onMouseMove = (e: MouseEvent) => {
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

  const onMouseUp = () => {
    dragData.current.dragging = false;
  };

  useEffect(() => {
    if (!modalRef.current) return;

    if (modalPosition.current) {
      modalRef.current.style.left = modalPosition.current.left + "px";
      modalRef.current.style.top = modalPosition.current.top + "px";
      modalRef.current.style.transform = "";
      modalRef.current.style.position = "fixed";
    } else {
      modalRef.current.style.left = "50%";
      modalRef.current.style.top = "50%";
      modalRef.current.style.transform = "translate(-50%, -50%)";
      modalRef.current.style.position = "fixed";
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [modalPosition]);

  return (
    <div
      ref={modalRef}
      style={{
        position: "fixed",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        padding: "20px",
        zIndex: 1000,
        width: "300px",
        userSelect: "none",
      }}
    >
      <div
        style={{
          cursor: "move",
          marginBottom: "10px",
          fontWeight: "bold",
          borderBottom: "1px solid #eee",
          paddingBottom: "5px",
        }}
        onMouseDown={onMouseDown}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.preventDefault()}
      >
        Info Ami - Déplacer la fenêtre
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Nom :</strong> {friend.name}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>ID :</strong> {friend.id}
      </div>
      <button
        onClick={onClose}
        style={{
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        type="button"
      >
        Fermer
      </button>
    </div>
  );
}
