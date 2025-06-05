"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../css/News.module.css";

type Article = {
    id: number;
    author: string;
    look: string;
    banner: string;
    title: string;
    content: string;
};

export default function News() {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);
    const [articles, setArticles] = useState<Article[]>([]);
    const [visibleCards, setVisibleCards] = useState(1);

    // Constants for card size & gap
    const GAP = 15;
    const CARD_MIN_WIDTH = 350;

    // Fetch articles (same)
    useEffect(() => {
        async function fetchArticles() {
            try {
                const res = await fetch("/api/articles");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setArticles(data);
                } else {
                    console.error("Format inattendu des articles:", data);
                }
            } catch (err) {
                console.error("Erreur lors du fetch des articles:", err);
            }
        }
        fetchArticles();
    }, []);

    // Calculate visible cards & reset index if needed on resize or articles change
    useEffect(() => {
        function calculateVisibleCards() {
            if (!wrapperRef.current) return;

            const wrapperWidth = wrapperRef.current.offsetWidth;
            // Compute how many cards fit at min width + gap
            let possibleCards = Math.floor((wrapperWidth + GAP) / (CARD_MIN_WIDTH + GAP));
            possibleCards = Math.max(1, possibleCards);
            setVisibleCards(possibleCards);

            // Clamp index to max possible
            if (index > articles.length - possibleCards) {
                setIndex(Math.max(articles.length - possibleCards, 0));
            }
        }

        calculateVisibleCards();
        window.addEventListener("resize", calculateVisibleCards);
        return () => window.removeEventListener("resize", calculateVisibleCards);
    }, [articles.length, index]);

    const maxIndex = Math.max(articles.length - visibleCards, 0);

    const handleScroll = (dir: "left" | "right") => {
        if (dir === "left") {
            setIndex((prev) => Math.max(prev - 1, 0));
        } else {
            setIndex((prev) => Math.min(prev + 1, maxIndex));
        }
    };

    // Compute card width dynamically based on wrapper width and visibleCards count
    const cardWidth =
        wrapperRef.current
            ? (wrapperRef.current.offsetWidth - GAP * (visibleCards - 1)) / visibleCards
            : CARD_MIN_WIDTH;

    // Click redirection
    const handleClick = () => {
        window.location.href = "/news";
    };

    return (
        <div className={styles.news}>
            <button
                aria-label="Scroll left"
                className={styles.leftArrow}
                onClick={() => handleScroll("left")}
                disabled={index <= 0}
            >
                <ChevronLeft className={styles.chevron} size={36} />
            </button>

            <div className={styles.sliderWrapper} ref={wrapperRef}>
                <div
                    className={styles.slider}
                    ref={containerRef}
                    style={{
                        gap: GAP,
                        transform: `translateX(-${index * (cardWidth + GAP)}px)`,
                        transition: "transform 0.3s ease-in-out",
                    }}
                >
                    {articles.length > 0 ? (
                        articles.map((article) => (
                            <div
                                key={article.id}
                                className={styles.new}
                                style={{
                                    backgroundImage: `url(${article.banner})`,
                                    width: cardWidth,
                                    minWidth: cardWidth,
                                    maxWidth: cardWidth,
                                }}
                                onClick={handleClick}
                            >
                                <div className={styles.overlay}></div>
                                <div className={styles.uIZhdy82}>
                                    <div className={styles.PizjN92d}>
                                        <img
                                            src={`https://imager.vicehabbo.eu/?figure=${article.look}&size=l&direction=2&head_direction=2`}
                                            alt=""
                                        />
                                    </div>
                                    <div className={styles.PaisIO23}>{article.title}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.new} style={{ width: cardWidth }}>
                            <div className={styles.overlay}></div>
                            <div className={styles.bottomNewInfo}>
                                <div className={styles.infoNew}>
                                    <div className={styles.nameN}>Aucun article</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <button
                aria-label="Scroll right"
                className={styles.rightArrow}
                onClick={() => handleScroll("right")}
                disabled={index >= maxIndex}
            >
                <ChevronRight className={styles.chevron} size={36} />
            </button>
        </div>
    );
}
