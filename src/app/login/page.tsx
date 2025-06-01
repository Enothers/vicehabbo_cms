'use client';

import { useAuth } from "../context/authContext";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import News from "../components/News";
import styles from "../css/Login.module.css";
import Link from "next/link";
import LastCreate from "../components/LastCreate";
import Discord from "../components/Discord";

export default function LoginPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [username, setUsername] = useState('');
  const [look, setLook] = useState('hr-3260-1427.cc-3405-73-66.hd-180-1.ha-3129-100.fa-1206-1427.lg-285-73.sh-290-92');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (username) {
        fetch(`/api/users/getLookByUsername/${encodeURIComponent(username)}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data?.look) setLook(data.look);
          })
          .catch(() => { });
      } else {
        setLook('hr-3260-1427.cc-3405-73-66.hd-180-1.ha-3129-100.fa-1206-1427.lg-285-73.sh-290-92');
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [username]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const hideTimeout = setTimeout(() => {
        setShowError(false);
        const clearError = setTimeout(() => setError(''), 500); // laisser le temps à l’anim
        return () => clearTimeout(clearError);
      }, 3000); // erreur visible 3 secondes

      return () => clearTimeout(hideTimeout);
    }
  }, [error]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const username = formData.get('username')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Erreur inconnue');
      return;
    }

    await checkAuth();
    window.location.href = '/me';
  }

  return (
    <div>
      {error && (
        <div className={`errorAlert ${!showError ? 'fade-out' : ''}`}>
          <img
            src="https://imager.vicehabbo.eu/?figure=hr-3260-1427.cc-3405-73-66.hd-180-1.ha-3129-100.fa-1206-1427.lg-285-73.sh-290-92&direction=2&head_direction=2&headonly=1"
            alt=""
          />
          {error}
        </div>
      )}

      <div className={styles.contentLogin}>
        <div className={styles.colLogin}>
          <form onSubmit={handleSubmit}>
            <div className={styles.cardLogin}>
              <div className={styles.titleLogin}>Bienvenue sur ViceHabbo !</div>
              <div className={styles.paramLogin}>
                Fais-toi plein d'amis et deviens célèbre en séjournant gratuitement dans un hôtel de qualité aux multiples fonctionnalités !
              </div>
              <Link href="/register">
                <div className={styles.btnRegister}>
                  Inscription
                </div>
              </Link>
              <div className={styles.separator}></div>
              <div className={styles.titleLogin}>J'ai déja un compte</div>
              <div className={styles.packInput}>
                <img
                  className={styles.avatarImg}
                  src={`https://imager.vicehabbo.eu/?figure=${look}&direction=2&head_direction=2&headonly=1`}
                  alt="avatar"
                />
                <input
                  className={styles.inputLogin}
                  name="username"
                  placeholder="Nom d'utilisateur"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
              <div className={styles.packInput}>
                <img className={styles.password} src="icon_password.png" alt="" />
                <input
                  className={styles.inputLogin}
                  name="password"
                  type="password"
                  placeholder="Password"
                />
              </div>
              <div className={styles.passUpdate}>
                Mot de passe oublié ?
              </div>
              <button className={styles.btnLogin} type="submit">Connexion</button>
            </div>
          </form>
        </div>
        <div className={styles.colLogin}>
          <News />
          <div className="splitLogin">
            <LastCreate />
            <Discord />
          </div>
        </div>
      </div>
    </div>
  );
}
