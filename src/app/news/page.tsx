'use client';

import { useState, useEffect } from 'react';
import styles from "@/app/css/NewsPage.module.css";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from '@/app/components/Header';
import Loader from '@/app/components/Loader';
import Footer from '@/app/components/Footer';

type Article = {
    id: number;
    author: string;
    look: string;
    banner: string;
    title: string;
    content: string;
};

export default function NewsPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [user, setUser] = useState<any>(null);
    const [badges, setBadges] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchArticles() {
            try {
                const res = await fetch('/api/articles');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setArticles(data);
                    setSelectedArticle(data[0] || null);
                } else {
                    console.error("Format inattendu:", data);
                }
            } catch (err) {
                console.error("Erreur lors du fetch des articles :", err);
            }
        }

        fetchArticles();
    }, []);

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <Header look={user.look} />
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.fixed}>
                        <div className={styles.scrollable}>
                            {filteredArticles.map((article) => (
                                <div
                                    key={article.id}
                                    className={styles.article}
                                    style={{ backgroundImage: `url(${article.banner})`, }}
                                    onClick={() => setSelectedArticle(article)}
                                >
                                    <div className={styles.overlay}></div>
                                    <div className={styles.title}>{article.title}</div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.search}>
                            <Search className={styles.ico} size={36} color="#CACACA" />
                            <input
                                className={styles.searchInput}
                                placeholder="Rechercher un article ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.nofixed}>
                        {selectedArticle && (
                            <div className={styles.atre872}>
                                <div className={styles.ehhdss72} style={{ backgroundImage: `url(${selectedArticle.banner})`, }}>
                                    <h2 className={styles.ttte}>{selectedArticle.title}</h2>
                                    <div className={styles.overlaydaz}></div>
                                    <div className={styles.creator}>
                                        <img src={`https://imager.vicehabbo.eu/?figure=${selectedArticle.look}&direction=2&head_direction=2&headonly=1`} alt="" />
                                        <div className={styles.author}>Par {selectedArticle.author}</div>
                                    </div>
                                </div>
                                <div
                                    className={styles.content}
                                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.footerMe}><Footer /></div>
            </div>
        </>
    );
}