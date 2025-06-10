'use client';

import React, { useRef, useEffect, useState } from 'react';

type Props = {
  ws: WebSocket;
  wiredId: String;
  onClose: () => void;
  modalPosition: { current: { left: number; top: number } | null };
};

export default function WiredSoundModal({ ws, wiredId, onClose, modalPosition }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragData = useRef({ offsetX: 0, offsetY: 0, dragging: false });
  const [files, setFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();

    if (modalRef.current.style.transform) {
      modalRef.current.style.left = `${rect.left}px`;
      modalRef.current.style.top = `${rect.top}px`;
      modalRef.current.style.transform = '';
    }

    dragData.current = {
      dragging: true,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
    document.body.style.userSelect = 'none';
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragData.current.dragging || !modalRef.current) return;

    let left = e.clientX - dragData.current.offsetX;
    let top = e.clientY - dragData.current.offsetY;

    const modal = modalRef.current;
    const w = window.innerWidth - modal.offsetWidth;
    const h = window.innerHeight - modal.offsetHeight;

    left = Math.max(0, Math.min(w, left));
    top = Math.max(0, Math.min(h, top));

    modal.style.left = `${left}px`;
    modal.style.top = `${top}px`;
    modalPosition.current = { left, top };
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragData.current.dragging = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    document.body.style.userSelect = '';
  };

  const fetchFiles = async () => {
    const res = await fetch('/api/sounds');
    const data = await res.json();
    setFiles(data);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      await fetchFiles();
      e.target.value = '';
    }

    setUploading(false);
  };

  const handleSelect = (filename: string) => {
    console.log('Fichier sélectionné :', filename);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'update_url_sound',
        wiredId,
        filename
      }));
    }
    onClose();
  };

  useEffect(() => {
    if (modalRef.current && modalPosition.current) {
      const { left, top } = modalPosition.current;
      modalRef.current.style.left = `${left}px`;
      modalRef.current.style.top = `${top}px`;
      modalRef.current.style.transform = '';
    } else if (modalRef.current) {
      modalRef.current.style.left = '50%';
      modalRef.current.style.top = '50%';
      modalRef.current.style.transform = 'translate(-50%, -50%)';
    }

    fetchFiles();
  }, []);

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
        width: '350px',
        userSelect: 'none',
      }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          cursor: 'move',
          padding: '10px 20px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
        }}
      >
        🎵 Sons
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
          onPointerDown={(e) => e.stopPropagation()}
        >
          &times;
        </button>
      </div>

      <div style={{ padding: '16px' }}>
        <input
          type="file"
          accept=".mp3"
          ref={fileInputRef}
          onChange={handleUpload}
          style={{ marginBottom: '10px' }}
        />

        {uploading && <p>Upload en cours...</p>}

        <ul style={{ listStyle: 'none', padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
          {files.map((file) => (
            <li key={file}>
              <button
                onClick={() => handleSelect(file)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '6px 10px',
                  background: '#f5f5f5',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginBottom: '6px',
                  cursor: 'pointer',
                }}
              >
                {file}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
