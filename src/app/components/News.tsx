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
  const [totalCards, setTotalCards] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);

  const CARD_WIDTH = 300;
  const GAP = 15;
  const STEP = CARD_WIDTH + GAP;

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

  useEffect(() => {
    if (containerRef.current && wrapperRef.current) {
      const count = articles.length;
      setTotalCards(count);

      const totalContentWidth = count * STEP - GAP; // total width - dernier gap
      const visibleWidth = wrapperRef.current.offsetWidth;

      setCanScroll(totalContentWidth > visibleWidth);
      // Reset index si plus de cards que visible pour éviter overflow
      if (index > count - 1) setIndex(count - 1);
    }
  }, [articles, index]);

  const handleScroll = (dir: "left" | "right") => {
    if (!canScroll) return;

    const newIndex =
      dir === "right"
        ? Math.min(index + 1, totalCards - 1)
        : Math.max(index - 1, 0);
    setIndex(newIndex);
  };

  // Au clic, redirige vers /news
  const handleClick = () => {
    window.location.href = "/news";
  };

  return (
    <div className={styles.news}>
      <div className={styles.leftArrow} onClick={() => handleScroll("left")}>
        <ChevronLeft className={styles.chevron} size={36} />
      </div>
      <div className={styles.sliderWrapper} ref={wrapperRef}>
        <div
          className={styles.slider}
          ref={containerRef}
          style={{ transform: `translateX(-${index * STEP}px)` }}
        >
          {articles.map((article) => (
            <div
              key={article.id}
              className={styles.new}
              style={{ backgroundImage: `url(${article.banner})` }}
              onClick={handleClick}
            >
              <div className={styles.overlay}></div>
              <div
                className={styles.bottomNewInfo}
              >
                <div className={styles.avatarNew}>
                  <img
                    src={`https://imager.vicehabbo.eu/?figure=${article.look || "undefined"}&direction=2&head_direction=2&headonly=1`}
                    alt={article.author}
                  />
                </div>
                <div className={styles.infoNew}>
                  <div className={styles.nameN}>{article.author}</div>
                  <div className={styles.descN}>{article.title}</div>
                </div>
              </div>
            </div>
          ))}
          {articles.length === 0 && (
            <div className={styles.new} style={{ width: CARD_WIDTH }}>
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
      <div className={styles.rightArrow} onClick={() => handleScroll("right")}>
        <ChevronRight className={styles.chevron} size={36} />
      </div>
    </div>
  );
}
