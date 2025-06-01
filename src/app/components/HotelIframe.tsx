'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HotelIframe() {
  const [ticket, setTicket] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchAndSetTicket() {
      try {
        const resUser = await fetch('/api/users/getUser', { credentials: 'include' });
        if (resUser.status === 401) {
          router.replace('/login');
          return;
        }

        const dataUser = await resUser.json();
        if (!dataUser.user) return;
        const randomTicket = `SSO-${Math.random().toString(36).substring(2, 18)}`;

        const resUpdate = await fetch('/api/users/updateAuthTicket', {
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

  if (!ticket) return <p>Chargement du client hôtel...</p>;

  return (
    <iframe
      src={`/dist/index.html?sso=${ticket}`}
      width="100%"
      height="100%"
      style={{ border: 'none' }}
    />
  );
}
