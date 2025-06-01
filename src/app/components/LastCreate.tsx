"use client";

import { useEffect, useState } from "react";
import styles from "../css/Lastcreate.module.css";

interface User {
  username: string;
  motto: string;
  look: string;
}

export default function LastCreate() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchLastUsers() {
      const res = await fetch("/api/users/last");
      const data = await res.json();
      setUsers(data);
    }

    fetchLastUsers();
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <div className={styles.lastCreate}>
        <div className={styles.titleL}>
          <img src="history.png" alt="" />
          Derniers inscrits
        </div>

       <div className={styles.cos_card}>
         {users.map((user, index) => (
          <div
            key={index}
            className={styles.last}
          >
            <img
              src={`https://imager.vicehabbo.eu/?figure=${user.look}&direction=2&head_direction=2&headonly=1`}
              alt=""
            />
            <div className={styles.psd90}>
              <div className={styles.psd892}>{user.username}</div>
              <div className={styles.psddate}>{user.motto}</div>
            </div>
            <div className={styles.online}></div>
          </div>
        ))}
       </div>
      </div>
    </div>
  );
}
