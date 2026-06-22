import { Link } from "react-router-dom";
import Styles from "./css/landing.module.css";

export const LandingPage = () => {
  return (
    <div className={Styles.hero}>
      <div className={Styles.appInfo}>
        <h1 className={Styles.appTitle}>Talk With Caregivers</h1>
        <p className={Styles.appDescription}>
          介護で疲れているあなたへ
          <br />
          気軽に相談できる場所 思っていることを吐き出し、
          <br />
          日々の出来事を共有できるアプリです
          <br />
          悩みを抱えているのはあなただけではありません
          <br />
          同じような経験をしている人たちとつながり、 お互いに支え合いましょう。
        </p>
        <div className={Styles.links}>
          <Link to="/signUp" className={Styles.signupLink}>
            アカウント作成
          </Link>
          <br />
          <Link to="/login" className={Styles.loginLink}>
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
};
