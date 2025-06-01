'use client';

import { useAuth } from "../context/authContext";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogoutPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (res.ok) {
          window.dispatchEvent(new Event("user-logout"));
          await checkAuth(); // met à jour l’état global
        } else {
          console.error('Erreur lors de la déconnexion');
        }
      } catch (err) {
        console.error('Erreur réseau lors de la déconnexion');
      } finally {
        router.replace('/login');
      }
    };

    handleLogout();
  }, [checkAuth, router]);

  return null; // pas besoin d'afficher quoi que ce soit
}
