import {  doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../shared/firebase/firebaseConfig";


import type { CareRecipientInfoType } from "../../shared/types/types";
import styles from "../../css/postCareRecipientDetail.module.css"
import { CareRecipientDetail } from "./CareRecipientDetail";


export const PostCareRecipientDetail=()=>{
        const navigate = useNavigate();
        const {careRecipientId} = useParams();
    
        const [careRecipient,setCareRecipient] = useState<CareRecipientInfoType|null>(null)
        
        useEffect(()=>{
            if(!careRecipientId)return
            
    
            const getCareRecipient = async()=>{
                const ref = doc(db, "careRecipients",careRecipientId)
                const snap = await getDoc(ref)
                if(snap.exists()){
                    const careRecipientData={
                        id:snap.id,
                        ...snap.data()
                    } as CareRecipientInfoType
                    setCareRecipient(careRecipientData)
                }
            }
            getCareRecipient();
        },[careRecipientId])
        return(
            <div className={styles.container}>
                <div className={styles.header}>
                <h1>詳細</h1>
                </div>
                
                <div className={styles.careRecipientList}>
                    <div  className={styles.card}>
                        <div className={styles.cardTitle}>
                            <h5>被介護者</h5>
                        </div>
                        {careRecipient && 
                        <CareRecipientDetail careRecipient={careRecipient} variant="large"/>
                        }
                    </div>
                    <button className={styles.closeBtn} onClick={()=>navigate(-1)}>閉じる</button>
                </div>
            </div>
        )
    }
