import HeaderLogin from "@/app/components/HeaderLogin";
import styles from "@/app/css/LoginPage.module.css";
import News from "@/app/components/News";
import Footer from "@/app/components/Footer";

export default function Login() {
    return (
      <>
        <HeaderLogin />
        <div className="container">
            <div className={styles.contentNews}>
                <News />
            </div>
            <div className={styles.contentRegister}>
                <div className={styles.registerContent}>
                    <h2>Crée ton <span style={{ color: '#5B3176' }}>avatar</span>, <span style={{ color: '#5B3176' }}>explore</span>, crée ton<br /><span style={{ color: '#5B3176' }}>appart</span> et interagis avec les autres<br />joueurs.</h2>
                     <div className={styles.cardContent}>
                        <div className={styles.card}>
                          dd
                        </div>
                     </div>
                </div>
                <Footer />
            </div>
        </div>
      </>
    );
}