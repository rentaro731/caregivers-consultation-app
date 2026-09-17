import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../shared/firebase/firebaseConfig";

import { useUserContext } from "../../shared/context/UserContext";
import type { CareRecipientInfoType } from "../../shared/types/types";

import styles from "../../css/careRecipientInfo.module.css"
import { CareRecipientDetail } from "./CareRecipientDetail";



export const CareRecipientInfo = ()=>{
    const {user} = useUserContext();
    const navigate = useNavigate();

    const [careRecipients,setCareRecipients] = useState<CareRecipientInfoType[]>([])
    
    useEffect(()=>{
        if(!user?.id)return

        const getCareRecipient = async()=>{
            const q = query(collection(db, "careRecipients"), where("authId","==",user?.id, ));
            const snap = await getDocs(q)
            const careRecipientsData = snap.docs.map((doc)=>({
                id:doc.id,
                ...doc.data()
            })) as CareRecipientInfoType[]
            setCareRecipients(careRecipientsData)
        }
        getCareRecipient();
    },[user?.id])

    const handleAdd =()=>{
        navigate("/profile/editCareRecipientInfo")
    }
    const handleEdit =(id:string)=>{
        navigate(`/profile/editCareRecipientInfo/${id}`)
    }
    



    return(
        <div className={styles.careRecipientSection}>
            <div className={styles.header}>
            <h4>被介護者情報</h4>
            <button className={styles.addBtn} onClick={handleAdd}>追加＋</button>
            </div>
            <div className={styles.careRecipientList}>
            {careRecipients.map((careRecipient,index)=>(
                <div className={styles.careRecipientCard} key={careRecipient.id}>
                    <div className={styles.cardHeader}>
                        <h5>被介護者{index + 1}</h5>
                        <button className={styles.editBtn} onClick={()=>handleEdit(careRecipient.id)}>編集</button>
                    </div>
                    <CareRecipientDetail careRecipient={careRecipient} />

                </div>
            ))}
            </div>

        </div>
    )
}