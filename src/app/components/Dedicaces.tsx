import styles from "@/app/css/Dedicaces.module.css";

export default function Dedicaces() {
    const messages = [
        "Hello les gars petites dedicaces",
        "Bisous à toute la team",
        "Big up Jonathan !",
        "Vicehabbo en force",
        "Force a tous les reufs !",
        "Keep pushing le code !"
    ];

    const avatars = messages.map((msg, i) => (
        <div key={i} className={styles.dedi}>
            <div className={styles.avat}>
                <img
                    src="https://imager.vicehabbo.eu/?figure=hd-3103-28.hr-181343-380014-4002.he-3070-92.ch-180654-92-110.lg-180268-110.sh-181111-110.cc-874624573-62.ca-6141523-62&direction=2&head_direction=2"
                    alt=""
                />
            </div>
            <div className={styles.dd92jd}>
                <span>Jonathan:</span> {msg}
            </div>
        </div>
    ));

    return (
        <div className={styles.dedicaces}>
            <div className={styles.track}>
                <div className={styles.wrapper}>
                    {avatars}
                    {avatars}
                </div>
            </div>
        </div>
    );
}
