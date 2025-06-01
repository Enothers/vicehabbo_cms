'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import News from '../components/News';
import Link from 'next/link';
import styles from "../css/Login.module.css";
import { RefreshCcw } from "lucide-react";
import LastCreate from '../components/LastCreate';
import Discord from '../components/Discord';

function generateCaptcha(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // éviter O, 0, I, 1 pour lisibilité
  let result = '';
  for(let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function Register() {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dessine le captcha dans le canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fond
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texte captcha
    ctx.font = '30px Arial';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Ajout léger de rotation et décalage pour chaque lettre
    for (let i = 0; i < captchaCode.length; i++) {
      const char = captchaCode[i];
      const x = 20 + i * 30;
      const y = canvas.height / 2;
      const angle = (Math.random() - 0.5) * 0.4; // rotation entre -0.2 et +0.2 radians

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = `rgb(${50 + Math.random() * 100}, ${50 + Math.random() * 100}, ${50 + Math.random() * 100})`;
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }

    // Ajout de "bruit"
    for (let i = 0; i < 30; i++) {
      ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.2})`;
      ctx.beginPath();
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const length = Math.random() * 20;
      const angle = Math.random() * Math.PI * 2;
      ctx.moveTo(x, y);
      ctx.lineTo(x + length * Math.cos(angle), y + length * Math.sin(angle));
      ctx.stroke();
    }
  }, [captchaCode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation captcha côté client
    if (captchaInput.toUpperCase() !== captchaCode) {
      setError('Captcha incorrect, réessaie.');
      setShowError(true);
      setCaptchaCode(generateCaptcha()); // regen captcha si erreur
      setCaptchaInput('');
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setSuccess('Compte créé, connecte-toi !');
      setShowSuccess(true);
      setTimeout(() => router.push('/login'), 1500);
    } else {
      setError(data.error || 'Erreur inconnue');
      setShowError(true);
    }
  }

  // gestion animation pour erreur
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

  // gestion animation pour succès
  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const hideTimeout = setTimeout(() => {
        setShowSuccess(false);
        const clearSuccess = setTimeout(() => setSuccess(''), 500);
        return () => clearTimeout(clearSuccess);
      }, 3000);
      return () => clearTimeout(hideTimeout);
    }
  }, [success]);

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

      {success && (
        <div className={`success ${!showSuccess ? 'fade-out' : ''}`}>
          <img
            src="https://imager.vicehabbo.eu/?figure=hr-3260-1427.cc-3405-73-66.hd-180-1.ha-3129-100.fa-1206-1427.lg-285-73.sh-290-92&direction=2&head_direction=2&headonly=1"
            alt=""
          />
          {success}
        </div>
      )}

      <div className={styles.contentLogin}>
        <div className={styles.colLogin}>
          <form onSubmit={handleSubmit}>
            <div className={styles.cardLogin}>
              <div className={styles.titleLogin}>M'inscrire sur ViceHabbo</div>
              <div className={styles.paramLogin}>
                Indique ton pseudonyme et ton mot de passe pour accéder au jeu gratuitement.
              </div>
              <div className={styles.separator}></div>
              <div className={styles.packInput}>
                <img
                  className={styles.avatarImg}
                  src={`https://imager.vicehabbo.eu/?figure=hr-3260-1427.cc-3405-73-66.hd-180-1.ha-3129-100.fa-1206-1427.lg-285-73.sh-290-92&direction=2&head_direction=2&headonly=1`}
                  alt="avatar"
                />
                <input
                  className={styles.inputLogin}
                  name="username"
                  placeholder="Nom d'utilisateur"
                  onChange={e => setusername(e.target.value)}
                  required
                />
              </div>

              <div className={styles.packInput}>
                <img className={styles.password} src="icon_password.png" alt="" />
                <input
                  className={styles.inputLogin}
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* CAPTCHA */}
              <div>
               <div className={styles.packedre}>
                  <canvas
                    ref={canvasRef}
                    width={200}
                    height={50}
                    style={{ border: '1px solid #ccc', borderRadius: '4px', display: 'block', marginBottom: '8px', userSelect: 'none' }}
                    title="Cliquez pour générer un nouveau captcha"
                  />
                
                  <div className={styles.refresh} onClick={() => setCaptchaCode(generateCaptcha())}>
                    <RefreshCcw size={28} />
                  </div>
               </div>
          
          
                <input
                  className={styles.inputCaptcha}
                  placeholder="Saisis le captcha"
                  value={captchaInput}
                  onChange={e => setCaptchaInput(e.target.value.toUpperCase())}
                  maxLength={6}
                  required
                />
              </div>

              <button className={styles.btnLogin} type="submit">Inscription</button>
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
