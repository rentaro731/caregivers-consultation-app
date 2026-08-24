import { useUserContext } from "../../shared/context/UserContext";
import styles from "../../css/profile.module.css"
import { useNavigate } from "react-router-dom";
import { CareRecipientInfo } from "../careRecipient/CareRecipientInfo";

export const Profile = () => {
  const {user,profile } = useUserContext()

  const navigate = useNavigate();


  const navEditProfile =()=>{
    navigate("/profile/editProfile",{
      state:{from: "profile"},
    })
  }
  return(
    <div className={styles.container}>
      <h1 className={styles.title}>プロフィール</h1>
      <div className={styles.card}>
        <div className={styles.userInfo}>
           <p className={styles.icon}>{profile?.icon}</p>
        <div className={styles.userText}>
          <h2 className={styles.userName}>{profile?.name}</h2>
          <p className={styles.bio}>{profile?.bio}</p>
       </div>
       <button className={styles.editBtn} onClick={navEditProfile}>プロフィール編集</button>
      </div>
      <hr className={styles.line} />
      <div className={styles.authInfo}>
        <div className={styles.authRow}>
        <div className={styles.authContent}>
          <p className={styles.authTitle}>メールアドレス</p>
          <p className={styles.authValue}>{user?.email}</p>
          </div>
          <button className={styles.ChangeBtn}>変更</button>
        </div>
        <div className={styles.authRow}>
        <div className={styles.authContent}>
          <p className={styles.authTitle}>パスワード</p>
          <p  className={styles.authValue}>＊＊＊＊＊＊＊＊</p>
        </div>
        <button className={styles.ChangeBtn}>変更</button>
        </div>
      </div>
      <CareRecipientInfo/>
      </div>

    </div>

  )

};
