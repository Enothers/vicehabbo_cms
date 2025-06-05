'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/app/components/Loader';

export default function Hotel() {
  const [ticket, setTicket] = useState<string | null>(null);
  const router = useRouter();

  // Effet pour appliquer style fullscreen uniquement sur cette page
  useEffect(() => {
    // Sauvegarder styles originaux pour restore à la sortie
    const originalHtmlHeight = document.documentElement.style.height;
    const originalBodyHeight = document.body.style.height;
    const originalBodyMargin = document.body.style.margin;
    const originalBodyOverflow = document.body.style.overflow;

    // Appliquer styles fullscreen
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden'; // pas de scroll global

    return () => {
      // Restaurer styles au démontage du composant
      document.documentElement.style.height = originalHtmlHeight;
      document.body.style.height = originalBodyHeight;
      document.body.style.margin = originalBodyMargin;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, []);

  useEffect(() => {
    async function fetchAndSetTicket() {
      try {
        const resUser = await fetch('/api/user/getInfo', { credentials: 'include' });
        if (resUser.status === 401) {
          router.replace('/login');
          return;
        }

        const dataUser = await resUser.json();
        if (!dataUser.user) return;
        const randomTicket = `SSO-${Math.random().toString(36).substring(2, 18)}`;

        const resUpdate = await fetch('/api/user/updateAuthTicket', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ auth_ticket: randomTicket }),
        });

        if (resUpdate.ok) {
          setTicket(randomTicket);
        }
      } catch (err) {
        console.error('Erreur lors de la génération du ticket', err);
      }
    }

    fetchAndSetTicket();
  }, [router]);

  if (!ticket) return <Loader />;

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <iframe
        src={`https://nitro.vicehabbo.eu/?sso=${ticket}`}
        width="100%"
        height="100%"
        style={{ border: 'none', display: 'block' }}
      />
    </div>
  );
}
