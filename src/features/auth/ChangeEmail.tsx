import styles from "./css/changeEmail.module.css"


type ChangeEmailProps = {
    onClose:()=>void
}

export const ChangeEmail =({onClose}:ChangeEmailProps)=>{

    return(
        <div className={styles.modalContainer}>
            <div className={styles.overLay}>
              <h2 className={styles.modalTitle}>メールアドレス変更</h2>
              <label htmlFor="newEmail">新しいメールアドレス</label>
              <input className={styles.inputEmail} id="newEmail" value={email} type="text" placeholder="新しいメールアドレスを入力" />
              <div className={styles.BtnContainer}>
               <button>閉じる</button>
               <button>確認メールを送信</button>
              </div>

            </div>

        </div>
    )

}