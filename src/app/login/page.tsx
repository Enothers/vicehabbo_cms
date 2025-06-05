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
                register content
                <Footer />
            </div>
        </div>
      </>
    );
}