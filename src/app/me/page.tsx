'use client';

import styles from "@/app/css/Me.module.css"
import Header from "@/app/components/Header";
import News from "@/app/components/News";
import Profil from "@/app/components/Profil";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import VicePass from "@/app/components/Vicepass";
import Footer from "@/app/components/Footer";
import Appart from "@/app/components/Appart";
import Discord from "@/app/components/Discord";

export default function Me() {
    const [user, setUser] = useState<any>(null);
    const [badges, setBadges] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserAndBadges = async () => {
            try {
                const resUser = await fetch('/api/user/getInfo', { credentials: 'include' });

                if (resUser.status === 401) {
                    router.replace('/login');
                    return;
                }

                const dataUser = await resUser.json();
                if (!dataUser.user) return;

                setUser(dataUser.user);

                const resBadges = await fetch(`/api/user/getBadges/${dataUser.user.id}`, { credentials: 'include' });
                if (!resBadges.ok) return;

                const dataBadges = await resBadges.json();
                const badgeUrls = (dataBadges.badgeRows || []).map(
                    (b: any) => `https://cdn.vicehabbo.eu/swf/c_images/album1584/${b.badge_code}.gif`
                );

                setBadges(badgeUrls);
            } catch (err) {
                console.error('Erreur de chargement', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndBadges();
    }, [router]);

    if (loading || !user) return <Loader />;

    return (
        <>
            <Header />
            <div className="container">
                <div className={styles.gridSp}>
                    <div className={styles.col}>
                        <div className={styles.row}>
                            <Profil user={{
                                username: user.username,
                                look: user.look,
                                pdp: "",
                                banner: "",
                                coins: 0,
                                vicecoins: 0,
                                diamonds: 0,
                                badges: badges
                            }} />
                            <VicePass />
                        </div>
                    </div>
                    <div className={styles.col}>
                        <div className={styles.row}>
                            <News />
                            <div className={styles.gridPo}>
                                <div className={styles.col}>
                                    <Appart />
                                </div>
                                <div className={styles.col}>
                                    <Discord />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.footerMe}><Footer /></div>
            </div>
        </>
    );
}