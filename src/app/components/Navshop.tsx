'use client';

import styles from '@/app/css/Navshop.module.css';
import { Plus } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: "Accueil", href: "/shop", icon: "88.png" },
    { label: "ViceCash", href: "/shop/vicecoins", icon: "vicecoins.png" },
    { label: "VicePass", href: "/shop/vicepass", icon: "vicepass.gif" },
    { label: "Valeurs", href: "/shop/valeurs", icon: "999.png" },
    { label: "Coffres", href: "/shop/coffres", icon: "8273.png" },
    { label: "Badges", href: "/shop/badges", icon: "783.png" },
];

export default function Navshop() {
    const pathname = usePathname();

    return (
        <div className={styles.navbarShop}>
            <div className={styles.currencys}>
                <div className={styles.currency}>
                    <img src="vicecoins.png" alt="" />
                    100
                    <div className={styles.add} style={{ backgroundColor: '#961EC4' }}>
                        <Plus className={styles.ico} size={16} color='white' />
                    </div>
                </div>
                <div className={styles.currency}>
                    <img src="diamonds.png" alt="" />
                    100
                    <div className={styles.add} style={{ backgroundColor: '#82D6DB' }}>
                        <Plus className={styles.ico} size={16} color='white' />
                    </div>
                </div>
            </div>

            <div className={styles.nav}>
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className={`${styles.item} ${pathname === item.href ? styles.active : ''}`}
                    >
                        <img src={item.icon} alt={item.label} />
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
