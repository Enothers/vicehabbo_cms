'use client';

import { useEffect, useState } from 'react';

type Props = {
  onClose: () => void;
};

export default function AboutModal({ onClose }: Props) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState<{ x: number; y: number } | false>(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragging.x;
    const dy = e.clientY - dragging.y;
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setDragging({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        width: 300,
        padding: 20,
        background: 'white',
        border: '1px solid #ccc',
        zIndex: 9999,
        cursor: 'move',
      }}
      onMouseDown={handleMouseDown}
    >
      <h3>À propos</h3>
      <p>Ce client est connecté à ViceHabbo</p>
      <button onClick={onClose}>Fermer</button>
    </div>
  );
}
