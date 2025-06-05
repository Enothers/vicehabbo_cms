'use client';

import { useEffect } from 'react';

export default function Logout() {
  useEffect(() => {
    const logout = async () => {
      try {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (res.ok) {
          window.dispatchEvent(new Event('user-logout'));
        } else {
          console.error('Erreur lors de la déconnexion');
        }
      } catch (error) {
        console.error('Erreur réseau lors de la déconnexion');
      } finally {
        window.location.replace('/login');
      }
    };

    logout();
  }, []);

  return null;
}
