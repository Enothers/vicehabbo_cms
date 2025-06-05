"use client";

import styles from "../css/Profil.module.css";
import { Pencil } from 'lucide-react';

type User = {
    username: string;
    look: string;
    banner: string;
    pdp: string;
    coins: number;
    diamonds: number;
    vicecoins: number;
    badges: string[];
};

export default function Profil({ user }: { user: User }) {
    return (
        <div className={styles.profil}>
            <div className={styles.banner}>
                <div className={styles.pdp}>
                    <img src={`https://imager.vicehabbo.eu/?figure=${user.look}&size=l&direction=2&head_direction=2`} alt="" />
                </div>
                <div className={styles.name}>{user.username}</div>
            </div>
            <div className={styles.currencys}>
                <div className={styles.currency}>
                    <img src="coins.png" alt="" />
                    {user.coins}
                </div>
                <div className={styles.currency}>
                    <img src="vicecoins.png" alt="" />
                    {user.vicecoins}
                </div>
                <div className={styles.currency}>
                    <img src="diamonds.png" alt="" />
                    {user.diamonds}
                </div>
            </div>
            <div className={styles.badges}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <div className={styles.badge} key={index}>
                        {user?.badges?.[index] && (
                            <img src={user.badges[index]} alt={`Badge ${index + 1}`} />
                        )}
                    </div>
                ))}
            </div>
            <div className={styles.referral}>
                <div className={styles.min}>Partagez ce lien pour gagner des cadeaux !</div>
                <div className={styles.url}>https://vicehabbo.eu/referral/{user.username}</div>
            </div>
        </div>
    );
}