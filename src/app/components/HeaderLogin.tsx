'use client';

import styles from "@/app/css/Header.module.css";
import { useEffect, useState } from "react";

export default function HeaderLogin() {
    const [username, setUsername] = useState('');
    const [look, setLook] = useState('hr-3260-1427.cc-3405-73-66.hd-180-1.ha-3129-100.fa-1206-1427.lg-285-73.sh-290-92');
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (username) {
                fetch(`/api/user/getLookByUsername/${encodeURIComponent(username)}`)
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
        const clearError = setTimeout(() => setError(''), 500);
        return () => clearTimeout(clearError);
      }, 3000);

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
        window.location.href = '/me';
  }

    return (
        <>
          {error && (
                <div className={`alert error ${!showError ? 'fade-out' : ''}`}>
                <img
                    src="https://imager.vicehabbo.eu/?figure=hr-3260-1427.cc-3405-73-66.hd-180-1.ha-3129-100.fa-1206-1427.lg-285-73.sh-290-92&direction=2&head_direction=2&headonly=1"
                    alt=""
                />
                {error}
                </div>
            )}
            <div className={styles.header}>
                <div className="container">
                    {/* <div className={styles.logo}>
                        <img src="hv.png" alt="Logo" />
                    </div> */}
                    <div className={styles.loginbar}>
                        <div className={styles.logo}>
                            <img src="hv.png" alt="Logo" />
                        </div>
                        <form onSubmit={handleSubmit}>
                        <div className={styles.packedall}>
                            <div className={styles.inputs}>
                                <div className={styles.input}>
                                    <img className={styles.avatar} src={`https://imager.vicehabbo.eu/?figure=${look}&direction=2&head_direction=2&headonly=1`} alt="" />
                                    <input
                                        className={styles.inputLogin}
                                        name="username"
                                        placeholder="Nom d'utilisateur"
                                        type="text"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className={styles.input}>
                                    <img className={styles.lock} src="icon_password.png" alt="" />
                                    <input
                                        className={styles.inputLogin}
                                        name="password"
                                        placeholder="Mot de passe"
                                        type="password"
                                    />
                                </div>
                            </div>
                            <button className={styles.loginBtn} type="submit">
                                Connexion
                            </button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className={styles.gap}></div>
        </>
    );
}
