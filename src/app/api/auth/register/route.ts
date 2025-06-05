import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
        if (!username || !password)
            return (NextResponse.json({ error: 'Merci de remplir tous les champs.' }, { status: 400 }));
        const pool = getPool();
        const [existingUsers] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        if ((existingUsers as any).length > 0)
            return (NextResponse.json({ error: 'Le nom d\'utilisateur est déja pris.' }, { status: 409 }));
        const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;
        if (!usernameRegex.test(username)) {
            return (NextResponse.json({ error: 'Nom d\'utilisateur invalide. Utilise uniquement des lettres, chiffres, _ ou . (3-20 caractères).' }, { status: 400 }));
        }
        const passwordRegex = /^.{8,100}$/;
        if (!passwordRegex.test(password)) {
            return (NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' }, { status: 400 }));
        }
        const password_hash = await hashPassword(password);
        const nowTimestamp = Math.floor(Date.now() / 1000);
        const forwardedFor = request.headers.get("x-forwarded-for");
        const ip = forwardedFor?.split(',')[0]?.trim() || "0.0.0.0";
        const defaultUserValues = {
            real_name: username,
            mail_verified: '0',
            account_created: nowTimestamp,
            account_day_of_birth: 0,
            last_login: 0,
            last_online: 0,
            motto: 'Je suis nouveau sur Vice !',
            look: 'hr-115-42.hd-195-19.ch-3030-82.lg-275-1408.fa-1201.ca-1804-64',
            gender: 'M',
            rank: 1,
            credits: 2500,
            pixels: 500,
            points: 10,
            online: '0',
            auth_ticket: '',
            ip_register: ip,
            ip_current: ip,
            home_room: 0,
            is_hidden: 0,
        };
        const query = `
            INSERT INTO users (
                username, real_name, password, mail_verified, account_created, account_day_of_birth, last_login, last_online,
                motto, look, gender, rank, credits, pixels, points, online, auth_ticket, ip_register, ip_current, home_room, is_hidden
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
        await pool.query(query, [
            username,
            defaultUserValues.real_name,
            password_hash,
            defaultUserValues.mail_verified,
            defaultUserValues.account_created,
            defaultUserValues.account_day_of_birth,
            defaultUserValues.last_login,
            defaultUserValues.last_online,
            defaultUserValues.motto,
            defaultUserValues.look,
            defaultUserValues.gender,
            defaultUserValues.rank,
            defaultUserValues.credits,
            defaultUserValues.pixels,
            defaultUserValues.points,
            defaultUserValues.online,
            defaultUserValues.auth_ticket,
            defaultUserValues.ip_register,
            defaultUserValues.ip_current,
            defaultUserValues.home_room,
            defaultUserValues.is_hidden,
        ]);
        return (NextResponse.json({ message: 'Le compte a été créé' }, { status: 201 }));
    }
    catch (error) {
        return (NextResponse.json({ error: 'Internal server error' }, { status: 500 }));
    }
}