'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '../components/Loader';
import Profil from '../components/Profil';
import styles from "../css/Me.module.css";
import Friends from '../components/Friends';
import News from '../components/News';
import LastCreate from '../components/LastCreate';
import Discord from '../components/Discord';

export default function MePage() {
  const [user, setUser] = useState<any>(null);
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserAndBadges() {
      try {
        const resUser = await fetch('/api/users/getUser', {
          credentials: 'include',
        });
        if (resUser.status === 401) {
          router.replace('/login');
          return;
        }

        const dataUser = await resUser.json();
        if (dataUser.user) {
          setUser(dataUser.user);
          const resBadges = await fetch(`/api/users/getBadgesId/${dataUser.user.id}`, {
            credentials: 'include',
          });
          if (resBadges.ok) {
            const dataBadges = await resBadges.json();
            const badgeUrls = dataBadges.badgeRows?.map((b: any) =>
              `https://cdn.vicehabbo.eu/swf/c_images/album1584/${b.badge_code}.gif`
            ) || [];
            setBadges(badgeUrls);
          }
        }
      } catch (err) {
        console.error('Erreur de chargement', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserAndBadges();
  }, [router]);

  if (loading) return <Loader />;

  if (!user) return <p>Aucun utilisateur connecté</p>;

  return (
    <div>
      <div className={styles.contentMe}>
        <div className={styles.colMe}>
          <Profil user={{
            username: user.username,
            look: user.look,
            banner: user.banner,
            pdp: user.pdp,
            richess: 25,
            respects: 10,
            date: "29/05/2025",
            hearth: "Aucune relation",
            happy: "Aucune relation",
            dead: "Aucune relation",
            diamonds: 0,
            points: 0,
            stars: 0,
            play: 0,
            badges: badges
          }} />
        </div>
        <div className={styles.colMe}>
          <Friends />
          <News />
          <div className="splitLogin">
            <div style={{ width: '100%' }}>a voir</div>
            <Discord />
          </div>
        </div>
      </div>
    </div>
  );
}
