'use client';

import styles from "@/app/css/HeaderMe.module.css"
import Link from "next/link";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Header() {
    const navItems = [
        { name: "Accueil", icon: "1.gif", path: "/me" },
        { name: "Equipe", icon: "2.gif", path: "/staffs" },
        { name: "Articles", icon: "3.gif", path: "/news" },
        { name: "Boutique", icon: "4.gif", path: "/shop" },
        { name: "Forum", icon: "5.gif", path: "/forum" },
    ];

    const [showFriends, setShowFriends] = useState(false);
    const [animateClose, setAnimateClose] = useState(false);
    const [radius, setRadius] = useState(false);

    const friendsList = [
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },
        { name: "Jonathan", avatar: "https://avatar.habbocity.me/?figure=lg-281-92.fa-1206-1410.ha-1002-1410.hd-180-1.hr-839-110.ch-267-1410.sh-290-1410.ea-1401-1410&size=l&direction=2&head_direction=2" },

    ];

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

    const friendsWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = friendsWrapperRef.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            el.scrollLeft += e.deltaY;
        };

        el.addEventListener("wheel", onWheel, { passive: false });

        return () => {
            el.removeEventListener("wheel", onWheel);
        };
    }, []);

    return (
        <div className={`${styles.header} ${showFriends ? styles.headerMarginBottom : ''}`}>
            <div className="container">
                <div className={styles.line}>
                    <div className={styles.logo}>
                        <img src="hv.png" alt="Logo" />
                    </div>
                    <div className={styles.buttons}>buttons</div>
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
                    <div className={styles.topFriends} onClick={toggleFriends}>
                        Mes amies
                        {showFriends ? (
                            <ChevronUp className={styles.chevron} size={36} color="#7A7A7A" />
                        ) : (
                            <ChevronDown className={styles.chevron} size={36} color="#7A7A7A" />
                        )}
                    </div>
                </div>

                <div
                    ref={friendsWrapperRef} className={`${styles.friendsWrapper} ${animateClose ? styles.friendsWrapperOut : showFriends ? styles.friendsWrapperIn : ''
                        }`}
                >
                    {showFriends && (
                        <div className={styles.friendsContent}>
                            {friendsList.map((friend, index) => (
                                <div className={styles.friendCard} key={index}>
                                    <img src={friend.avatar} alt={friend.name} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
