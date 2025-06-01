'use client';

import { useState, useEffect } from 'react';
import styles from "../css/NewsPage.module.css";
import { Search } from "lucide-react";

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

  return (
    <div className={styles.grid}>
      <div className={styles.fixed}>
        <div className={styles.scrollable}>
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className={styles.article}
              style={{backgroundImage: `url(${article.banner})`,}}
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
            <div className={styles.ehhdss72} style={{backgroundImage: `url(${selectedArticle.banner})`,}}>
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
  );
}
