import { conditionCategory, genders } from "../../shared/constants/constants";
import type { CareRecipientInfoType } from "../../shared/types/types";

import styles from "../../css/careRecipientDetail.module.css"


type props = {
    careRecipient:CareRecipientInfoType
    variant?:"normal" | "large"
}


export const CareRecipientDetail = ({careRecipient,variant="normal"}:props)=>{
    
    return(
        <div className={`${styles.detail} ${variant === "large" ? styles.large : ""}`}>
            <p>年齢: {careRecipient.age}</p>
            <p>性別: {careRecipient.gender !== null
            ? genders[careRecipient.gender]
            : "未設定"}</p>
            <p className={`${styles.conditionText}${variant === "large" ? styles.conditionTextlarge : ""}`}>
                症状: {careRecipient.conditionCategory.map((conditions)=>conditionCategory[conditions]).join("、")}
            </p>
        </div>
    )
}