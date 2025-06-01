"use client";

import { useEffect, useState } from "react";
import styles from "../css/Discord.module.css";
import Link from "next/link";

type Member = {
  username: string;
  avatar_url: string;
  status: "online" | "idle" | "dnd" | "offline";
};

export default function Discord() {
  const [serverName, setServerName] = useState("Chargement..");
  const [onlineCount, setOnlineCount] = useState(0);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const serverId = "1376270333388132373";
    const widgetUrl = `https://discord.com/api/guilds/${serverId}/widget.json`;

    fetch(widgetUrl)
      .then((res) => res.json())
      .then((data) => {
        setServerName(data.name);
        setOnlineCount(data.presence_count);
        setMembers(data.members);
      })
      .catch((err) => {
        console.error("Erreur API Discord:", err);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#43b581";
      case "idle":
        return "#faa61a";
      case "dnd":
        return "#f04747";
      default:
        return "#747f8d";
    }
  };

  return (
    <div style={{ width: '100%' }}>
         <div className={styles.discord}>
        <div className={styles.header_widget}>
            <div className={styles.name}>{serverName}</div>
            <div className={styles.cos}>
            <div className={styles.colog}></div>
            <div className={styles.valcos}>{onlineCount}</div>
            </div>
        </div>
        <div className={styles.cos_card}>
            {members.map((member, index) => (
            <div className={styles.cote} key={index}>
                <img src={member.avatar_url} alt={member.username} />
                <div
                className={styles.cotestat}
                style={{ backgroundColor: getStatusColor(member.status) }}
                ></div>
                <div className={styles.cotepseudo}>{member.username}</div>
            </div>
            ))}
        </div>
        <Link href="https://discord.gg/vicehabbo">
            <div className={styles.btn_discord}>Rejoindre Discord</div>
        </Link>
        </div>
    </div>
  );
}
