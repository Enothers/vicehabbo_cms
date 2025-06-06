'use client';

import styles from "@/app/css/Staffs.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

interface User {
    id: number;
    username: string;
    look: string;
    rank: number;
    online: boolean;
}

const gradesMap: Record<number, { label: string, color: string, badge: string }> = {
    13: { label: "Fondation", color: "#FEB163", badge: "FONDA.gif" },
    12: { label: "Développement", color: "#5EA4A8", badge: "DEV.gif" },
    11: { label: "Administration", color: "#5B3176", badge: "ADMIN.gif" },
    9:  { label: "Modération", color: "#9b9b9b", badge: "MOD.gif" },
    8:  { label: "Animation", color: "#68A85E", badge: "ANIM.gif" },
};

export default function Staffs() {
    const [user, setUser] = useState<any>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resUser = await fetch('/api/user/getInfo', { credentials: 'include' });
                if (resUser.status === 401) {
                    router.replace('/login');
                    return;
                }
                const dataUser = await resUser.json();
                if (!dataUser.user) return;
                setUser(dataUser.user);

                const resAll = await fetch('/api/user/getAll', { credentials: 'include' });
                const dataAll = await resAll.json();
                setUsers(dataAll.users || []);
            } catch (err) {
                console.error("Erreur:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router]);

    if (loading || !user) return <Loader />;

    return (
        <>
            <Header look={user.look} />
            <div className="container">
                <div className={styles.staffs}>
                    {Object.entries(gradesMap)
                        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
                        .map(([gradeId, { label, color, badge }]) => {

                            const gradeUsers = users.filter(u => u.rank === parseInt(gradeId));
                            if (gradeUsers.length === 0) return null;

                            return (
                                <div className={styles.cat} key={gradeId}>
                                    <div className={styles.title} style={{ backgroundColor: color }}>
                                        {label}
                                    </div>
                                    <div className={styles.cardContainer}>
                                        {gradeUsers.map((staff) => (
                                            <div className={styles.card} key={staff.id}>
                                                <div className={styles.avat}>
                                                    <img
                                                        src={`https://imager.vicehabbo.eu/?figure=${staff.look}&size=l&direction=2&head_direction=2`}
                                                        alt={staff.username}
                                                    />
                                                </div>
                                                <div className={styles.name}>{staff.username}</div>
                                                <img className={styles.bdg} src={badge} alt={label} />
                                                <img className={styles.status} src={staff.online ? "online.gif" : "offline.png"} alt="" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <div className={styles.footerMe}><Footer /></div>
            </div>
        </>
    );
}
