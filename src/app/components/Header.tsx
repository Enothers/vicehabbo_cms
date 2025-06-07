'use client';

import styles from "@/app/css/HeaderMe.module.css";
import Link from "next/link";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type HeaderProps = {
  look: string;
};

type Friend = {
  id: string; // id unique
  name: string;
  avatar: string;
};

export default function Header({ look }: HeaderProps) {
  const navItems = [
    { name: "Accueil", icon: "1.gif", path: "/me" },
    { name: "Articles", icon: "3.gif", path: "/news" },
    { name: "Equipe", icon: "2.gif", path: "/staffs" },
    { name: "Boutique", icon: "4.gif", path: "/shop" },
    { name: "Forum", icon: "5.gif", path: "/forum" },
  ];

  const [showFriends, setShowFriends] = useState(false);
  const [animateClose, setAnimateClose] = useState(false);
  const [radius, setRadius] = useState(false);
  const [friendsList, setFriendsList] = useState<Friend[]>([]);

  // Modal
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const dragData = useRef<{ offsetX: number; offsetY: number; dragging: boolean }>({
    offsetX: 0,
    offsetY: 0,
    dragging: false,
  });

  // Stocke la position actuelle de la modal
  const modalPosition = useRef<{ left: number; top: number } | null>(null);

  const friendsWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchFriends() {
      try {
        const res = await fetch("/api/friends");
        if (!res.ok) throw new Error("Erreur réseau");
        const data: Friend[] = await res.json();
        setFriendsList(data);
      } catch (error) {
        console.error("Erreur lors du chargement des amis :", error);
      }
    }
    fetchFriends();
  }, []);

  useEffect(() => {
    const el = friendsWrapperRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const toggleFriends = () => {
    if (showFriends) {
      setRadius(false);
      setAnimateClose(true);
      setTimeout(() => {
        setShowFriends(false);
        setAnimateClose(false);
      }, 300);
    } else {
      setRadius(true);
      setShowFriends(true);
    }
  };

  // Ouvre la modal avec l'ami sélectionné
  const openModal = (friend: Friend) => {
    setSelectedFriend(friend);

    if (modalRef.current) {
      if (modalPosition.current) {
        // Si on a déjà une position, on l'applique
        modalRef.current.style.left = modalPosition.current.left + "px";
        modalRef.current.style.top = modalPosition.current.top + "px";
        modalRef.current.style.transform = ""; // On enlève le translate centré
        modalRef.current.style.position = "fixed";
      } else {
        // Sinon on centre la modal la première fois
        modalRef.current.style.left = "50%";
        modalRef.current.style.top = "50%";
        modalRef.current.style.transform = "translate(-50%, -50%)";
        modalRef.current.style.position = "fixed";
      }
    }
  };

  // Ferme la modal
  const closeModal = () => {
    setSelectedFriend(null);
  };

  // Gestion drag & drop modal
const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!modalRef.current) return;

  const modal = modalRef.current;
  const rect = modal.getBoundingClientRect();

  // Si la modal utilise transform (centrée), on calcule et applique la position fixe sans transform
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

    // Limites fenêtre
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

    // On mémorise la position
    modalPosition.current = { left, top };
  };

  const onMouseUp = () => {
    dragData.current.dragging = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className={`${styles.header} ${showFriends ? styles.headerMarginBottom : ""}`}>
      <div className="container">
        <div className={styles.line}>
          <div className={styles.logo}>
            <img src="hv.png" alt="Logo" />
          </div>
          <div className={styles.buttons}>
            <div className={styles.Ozui877}>
              <img
                src={`https://imager.vicehabbo.eu/?figure=${look}&direction=2&head_direction=2`}
                alt="User"
              />
            </div>
            <div className={styles.OZji8232}>
              <img src="settings.png" alt="Settings" />
            </div>
            <div className={styles.OZji872}>
              <img src="info.png" alt="Information" />
            </div>
          </div>
        </div>

        <div className={styles.navbar}>
          <div className={styles.items}>
            {navItems.map((item) => (
              <Link href={item.path} key={item.path}>
                <div className={styles.item} data-label={item.name}>
                  <img src={`/${item.icon}`} alt={item.name} />
                </div>
              </Link>
            ))}
          </div>

          <div className={styles.rUo8ehjd9}>
            <div className={styles.Ie98dE2}>
              <Search className={styles.search} size={36} color="#BCBCBC" />
              <input
                className={styles.inputSearch}
                name="username"
                placeholder="Rechercher.."
                type="text"
              />
            </div>
            <a href="/hotel" target="_blank" rel="noopener noreferrer">
              <div className={styles.hotelBtn}>
                <img src="hotel.png" alt="Hotel" />
                Rejoindre l'hôtel
              </div>
            </a>
          </div>
        </div>

        <div className={styles.gap}></div>

        <div className={`${styles.friends} ${radius ? styles.noRadius : ""}`}>
          <div
            className={styles.topFriends}
            onClick={toggleFriends}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter") toggleFriends();
            }}
          >
            Mes amis
            {showFriends ? (
              <ChevronUp className={styles.chevron} size={36} color="#7A7A7A" />
            ) : (
              <ChevronDown className={styles.chevron} size={36} color="#7A7A7A" />
            )}
          </div>
        </div>

        <div
          ref={friendsWrapperRef}
          className={`${styles.friendsWrapper} ${
            animateClose ? styles.friendsWrapperOut : showFriends ? styles.friendsWrapperIn : ""
          }`}
        >
          {showFriends && (
            <div className={styles.friendsContent}>
              {friendsList.length === 0 && <div className={styles.friendCard}></div>}
              {friendsList.map((friend) => (
                <div
                  className={styles.friendCard}
                  key={friend.id}
                  title={friend.name}
                  onClick={() => openModal(friend)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={friend.avatar} alt={friend.name} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedFriend && (
          <div
            ref={modalRef}
            className={styles.modal}
            style={{
              position: "fixed",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
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
              <strong>Nom :</strong> {selectedFriend.name}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <strong>ID :</strong> {selectedFriend.id}
            </div>
            <button
              onClick={closeModal}
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
        )}
      </div>
    </div>
  );
}
