'use client';

import styles from "@/app/css/Shop.module.css"
import Header from "@/app/components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import Footer from "@/app/components/Footer";
import Navshop from "@/app/components/Navshop";

export default function Me() {
    const [user, setUser] = useState<any>(null);
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
            <Header look={user.look} />
            <div className="container">
                <div className={styles.gridSp}>
                    <div className={styles.col}>
                        <Navshop />
                    </div>
                    <div className={styles.col}>
                        <div className={styles.home}>
                        
                        </div>
                    </div>
                </div>
                <div className={styles.footerMe}><Footer /></div>
            </div>
        </>
    );
}