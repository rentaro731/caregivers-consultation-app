import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../shared/firebase/firebaseConfig";

import { useUserContext } from "../../shared/context/UserContext";
import type { CareRecipientInfoType } from "../../shared/types/types";

import styles from "../../css/selectCareRecipients.module.css"

import { CareRecipientDetail } from "./CareRecipientDetail";


export const SelectCareRecipients=()=>{
        const {user} = useUserContext();
        const navigate = useNavigate();
    
        const [careRecipients,setCareRecipients] = useState<CareRecipientInfoType[]>([])
        
        useEffect(()=>{
            if(!user?.id)return
    
            const getCareRecipient = async()=>{
                const q = query(collection(db, "careRecipients"), where("authId","==",user?.id ));
                const snap = await getDocs(q)
                const careRecipientsData = snap.docs.map((doc)=>({
                    id:doc.id,
                    ...doc.data()
                })) as CareRecipientInfoType[]
                setCareRecipients(careRecipientsData)
            }
            getCareRecipient();
        },[user?.id])

        const handleSelect=(careRecipient:CareRecipientInfoType,index:number)=>{
            navigate("/postList/createPost",{state:{careRecipient,careRecipientNumber:index + 1}})
        }
        return(
            <div className={styles.container}>
                <div className={styles.header}>
                <h1>被介護者を選択</h1>
                </div>
                <div className={styles.careRecipientList}>
                {careRecipients.map((careRecipient,index)=>(
                    <div  className={styles.card} key={careRecipient.id}>
                        <div className={styles.cardTitle}>
                            <h5>被介護者{index + 1}</h5>
                        </div>
                        <CareRecipientDetail careRecipient={careRecipient} />
                        <button type="button" className={styles.selectBtn} onClick={()=>handleSelect(careRecipient,index)}>選択</button>

                    </div>
                ))}
                </div>
    
            </div>
        )
    }
