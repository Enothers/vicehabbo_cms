"use client";

import Link from "next/link";
import styles from "../css/Navbar.module.css";
import HotelIframe from "./HotelIframe";
import { useAuth } from "../context/authContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Accueil", icon: "asdas_4.png", path: "/me" },
  { name: "Equipe", icon: "2.gif", path: "/staffs" },
  { name: "Articles", icon: "3.gif", path: "/news" },
  { name: "Boutique", icon: "shopic.png", path: "/shop" },
  { name: "Forum", icon: "5.gif", path: "/forum" },
  { name: "Info", icon: "6.gif", path: "/info" },
];

export default function Navbar() {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();

  const [showIframe, setShowIframe] = useState(false);

  // Quand le composant monte ou pathname change, on synchronise showIframe avec l'URL
  useEffect(() => {
    if (isLoggedIn && pathname === "/hotel") {
      setShowIframe(true);
      document.body.style.overflow = "hidden";
    } else {
      setShowIframe(false);
      document.body.style.overflow = "auto";
    }
  }, [pathname, isLoggedIn]);

  const enterHotel = () => {
    setShowIframe(true);
    document.body.style.overflow = "hidden";
    // On change l'URL sans recharger la page
    window.history.pushState(null, "", "/hotel");
  };

  const leaveHotel = () => {
    setShowIframe(false);
    document.body.style.overflow = "auto";
    // On remet l'URL d'origine (ici /me)
    window.history.pushState(null, "", "/me");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <img src="logo.png" alt="Logo" />
        </div>
        <div className={styles.nav}>
          {navItems.map((item) => (
            <Link href={item.path} key={item.path}>
              <div className={styles.item} data-label={item.name}>
                <img src={`/${item.icon}`} alt={item.name} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        {isLoggedIn && (
          <>
            {!showIframe && (
              <button className={styles.btnHotel} onClick={enterHotel}>Entrer dans l'hôtel</button>
            )}

            <div
              style={{
                display: showIframe ? "block" : "none",
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 10000,
                backgroundColor: "rgba(0,0,0,0.8)",
              }}
            >
              <HotelIframe />

              <button
                onClick={leaveHotel}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  zIndex: 10001,
                  padding: "10px",
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Quitter l'hôtel
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
