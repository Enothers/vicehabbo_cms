"use client";

import { useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import styles from "../css/Friends.module.css";

export default function Friends() {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const SCROLL_AMOUNT = 75 + 15 / 2; // 82.5px

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY > 0 ? SCROLL_AMOUNT : -SCROLL_AMOUNT;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className={styles.friends}>
      <div className={styles.addFriend}>
        <Plus size={36} color="#CACACA" />
      </div>
      <div className={styles.friendsList} ref={listRef}>
        <div className={styles.friend}>
          <img
            src="https://imager.vicehabbo.eu/?figure=hr-3260-91.hd-209-1391.ch-180950-92-1322.lg-180359-4020.sh-180733-92-1322&head_direction=3"
            alt="Friend"
          />
        </div>
      </div>
    </div>
  );
}
