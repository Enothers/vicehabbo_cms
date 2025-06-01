"use client";

import styles from "../css/Profil.module.css";
import { Pencil } from 'lucide-react';

type User = {
    username: string;
    look: string;
    banner: string;
    pdp: string;
    richess: number;
    respects: number;
    date: string;
    hearth: string;
    happy: string;
    dead: string;
    diamonds: number;
    points: number;
    stars: number;
    play: number;
    badges: string[];
};

export default function Profil({ user }: { user: User }) {
    return (
        <div className={styles.profil}>
            <div className={styles.banner} style={{ backgroundImage: `url(${user.banner})` }}>
                <div className={styles.avatar} style={{ backgroundImage: `url(${user.pdp})` }}>
                    <img
                        src={`https://imager.vicehabbo.eu/?figure=${user.look}&direction=2&head_direction=2`}
                        alt="avatar"
                    />
                </div>
                <div className={styles.name}>{user.username}</div>
                <div className={styles.btnUpdate}><Pencil size={12} /> Modifier</div>
            </div>
            <div className={styles.status}>
                <div className={styles.preciseStatus}></div>
                Offline
            </div>
            <div className={styles.beforeStatus}></div>
            <div className={styles.beforeBanStatus}></div>
            <div className={styles.splitTwo}>
                <div className={styles.colProfil}>
                    <div className={styles.widget}><img src="7.png" alt="" /> {user.richess} de richesses</div>
                    <div className={styles.widget}><img src="8.png" alt="" /> {user.respects} respects</div>
                    <div className={styles.widget}><img src="9.png" alt="" /> {user.date}</div>
                </div>
                <div className={styles.colProfil}>
                    <div className={styles.widget}><img src="10.png" alt="" /> {user.hearth}</div>
                    <div className={styles.widget}><img src="11.png" alt="" /> {user.happy}</div>
                    <div className={styles.widget}><img src="12.png" alt="" /> {user.dead}</div>
                </div>
            </div>
            <div className={styles.splitTwo}>
                <div className={styles.colProfilCurrency}>
                    <div className={styles.widgetCurrency}><img src="diam.gif" alt="" /> {user.diamonds}</div>
                    <div className={styles.widgetCurrency}><img src="14.png" alt="" /> {user.stars}</div>
                </div>
                <div className={styles.colProfilCurrency}>
                    <div className={styles.widgetCurrency}><img src="15.png" alt="" /> {user.points}</div>
                    <div className={styles.widgetCurrency}><img src="500.png" alt="" /> {user.play}</div>
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
            <div className={styles.bottomBtnAdapter}></div>
            <div className={styles.bottomBtnVip}><img src="vip.gif" alt="" />Adhérer au VicePass</div>
        </div>
    );
}
