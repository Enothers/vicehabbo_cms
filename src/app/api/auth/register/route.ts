import { NextResponse } from 'next/server';
import { getPool } from '../../../../lib/db';
import { hashPassword } from '../../../../lib/auth';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const pool = getPool();

  // Vérifie si username existe déjà
  const [rows] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
  if ((rows as any).length > 0) {
    return NextResponse.json({ error: 'username already exists' }, { status: 409 });
  }

  const password_hash = await hashPassword(password);

  const nowTimestamp = Math.floor(Date.now() / 1000);

  // Valeurs par défaut pour les colonnes NOT NULL sans default
  const account_day_of_birth = 0;
  const last_login = 0;
  const last_online = 0;
  const mail_verified = '0';
  const gender = 'M';
  const rank = 1;
  const credits = 2500;
  const pixels = 500;
  const points = 10;
  const online = '0';
  const is_hidden = 0;

  // Champs obligatoires supplémentaires sans valeur par défaut dans ta table
  const ip_register = '0.0.0.0'; // tu peux remplacer par l'IP réelle si tu la récupères
  const ip_current = '0.0.0.0';
  const real_name = username; // exemple, à adapter
  const motto = '';
  const look = 'hr-115-42.hd-195-19.ch-3030-82.lg-275-1408.fa-1201.ca-1804-64'; // valeur par défaut dans ta table
  const auth_ticket = '';
  const home_room = 0;

  await pool.query(
    `INSERT INTO users 
    (username, real_name, password, mail_verified, account_created, account_day_of_birth, last_login, last_online, 
     motto, look, gender, rank, credits, pixels, points, online, auth_ticket, ip_register, ip_current, home_room, is_hidden)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      username,
      real_name,
      password_hash,
      mail_verified,
      nowTimestamp,
      account_day_of_birth,
      last_login,
      last_online,
      motto,
      look,
      gender,
      rank,
      credits,
      pixels,
      points,
      online,
      auth_ticket,
      ip_register,
      ip_current,
      home_room,
      is_hidden,
    ]
  );

  return NextResponse.json({ message: 'User created' });
}
