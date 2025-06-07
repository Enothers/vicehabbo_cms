'use client';

import styles from "@/app/css/Appart.module.css";
import { useEffect, useState } from "react";

interface Room {
  id: number;
  name: string;
  users: number;
}

export default function Appart() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error("Erreur lors du fetch des rooms :", err));
  }, []);

  const getColor = (users: number): string => {
    if (users > 10) return 'rgb(193, 50, 43)';
    if (users > 5) return 'rgb(255, 176, 26)';
    return '#62b061';
  };

  return (
    <div className={styles.appart}>
      <div className={styles.title}>
        <img src="appart.png" alt="Appart" />
        Top 10 appartements
      </div>
      {rooms.map((room) => (
        <div key={room.id} className={styles.appartItem}>
          <div
            className={styles.count}
            style={{ backgroundColor: getColor(room.users) }}
          >
            <img src="rooms.png" alt="" />
            {room.users}
          </div>
          {room.name}
        </div>
      ))}
    </div>
  );
}
