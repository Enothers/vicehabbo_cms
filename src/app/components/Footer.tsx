import styles from "../css/Footer.module.css";

export default function Footer()
{
    return (
        <div className={styles.footer}>
            <img className={styles.logo} src="footer.ico" alt="Logo footer" />
             © ViceHabbo 2025. Tous droits réservés.<br/>ViceHabbo est une communauté indépendante à but non lucratif.<br />ViceHabbo V.2 by Sple & Enothers & Jonathan
            <img className={styles.sple} src="https://imager.vicehabbo.eu/?figure=hr-181343-92-153638.hd-200-19.ch-255-75.lg-285-89.fa-6047508-62.ha-990002274-62.he-990002784-62-62.ea-990000822-62.sh-290-62&size=l&direction=2&head_direction=2" alt="Enothers" />
            <img className={styles.enothers} src="https://imager.vicehabbo.eu/?figure=hd-3102-1370.ch-215-1432.lg-275-1427.sh-290-92.hr-4268-153638-90&size=l&gesture=sml&direction=3&action=std" alt="Enothers" />
            <img className={styles.jonathan} src="https://imager.vicehabbo.eu/?figure=hd-3103-28.hr-181343-380014-4002.he-3070-92.ch-180654-92-110.lg-180268-110.sh-181111-110.cc-874624573-62.ca-6141523-62&size=l&direction=4&action=std" alt="Enothers" />
        </div>
    );
}