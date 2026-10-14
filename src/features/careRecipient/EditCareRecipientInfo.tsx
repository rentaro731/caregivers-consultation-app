import { useEffect, useState } from "react"
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../shared/firebase/firebaseConfig"
import { useUserContext } from "../../shared/context/UserContext"

import styles from "./css/EditCareRecipientInfo.module.css"

import type { CareRecipientInfoType } from "../../shared/types/types"
import { conditionCategory, FIREBASE_ERROR, genders } from "../../shared/constants/constants"
import { useNavigate, useParams } from "react-router-dom"


const CARE_RECIPIENT_INITIAL_VALUE: Omit <CareRecipientInfoType,"id"|"authId"|"status" >={
    age:"",
    gender:null,
    conditionCategory:[],
  } 

  
  type CareRecipientErrorType= {
    age?:string,
    gender?: string,
    conditionCategory?:string,
}




export const EditCareRecipientInfo=()=>{

    const { user } = useUserContext();
    const navigate = useNavigate();
    const {id} = useParams();

    const [careRecipientFormValue, setCareRecipientFormValue] = useState(CARE_RECIPIENT_INITIAL_VALUE)
    const [careRecipientFormErrors, setCareRecipientFormErrors] = useState<CareRecipientErrorType>({})
    const [messsage, setMessage] = useState("")
    const [sending, setSending] = useState(false)

    useEffect(()=>{
        if(!id) return
        const getCareRecipient =async ()=>{
            try{
            const snap = await getDoc(doc(db,"careRecipients",id))
            if (!snap.exists()) return;
            const data = snap.data();
            setCareRecipientFormValue({
                age:data.age,
                gender: data.gender ,
                conditionCategory:data.conditionCategory,
            })
        } catch(error) {
            setMessage("プロフィール取得に失敗しました");
        }
        }
        getCareRecipient();
    },[id])


    const handleSelectGender = (e:React.ChangeEvent<HTMLSelectElement>)=>{
        const genderValue = Number(e.target.value)
        setCareRecipientFormValue((prev)=>({
            ...prev,
            gender: e.target.value === ""
            ? null
            : genderValue,
        }))
        setCareRecipientFormErrors({})
    }
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const { name,value } = e.target;
        setCareRecipientFormValue(((prev)=>({...prev,[name]:value})))
        setCareRecipientFormErrors({})

    }

    const handleCheck =(e:React.ChangeEvent<HTMLInputElement>)=>{
        const checkValue = Number(e.target.value)
        const checked = e.target.checked
        setCareRecipientFormValue((prev)=>({
            ...prev,
            conditionCategory: checked 
            ? [...prev.conditionCategory,checkValue]
            : prev.conditionCategory.filter((condition)=>(condition !==  checkValue))
        }))
        setCareRecipientFormErrors({})
    }

    const validates = (value:Omit <CareRecipientInfoType,"id"|"authId"|"status" >)=>{
        const errors:CareRecipientErrorType = {}

        if (!value.age){
            errors.age = "年齢を入力してください"
        }

        if (value.gender === null){
            errors.gender = "性別を選択してください"
        }

        if (value.conditionCategory.length ===0){
            errors.conditionCategory = "症状を選択してください"
        }

        return errors

    }

    const handleSubmit =async(e:React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if (!user?.id) {
            setMessage("ログインしてください");
            return;
        }
        const validationErrors = validates(careRecipientFormValue);
        if(Object.keys(validationErrors).length > 0){
            setCareRecipientFormErrors(validationErrors)
            setMessage("")
            return;
        }
        setSending(true);
        try{
            if(id){
                await updateDoc(doc(db, "careRecipients", id),{
                    age: careRecipientFormValue.age,
                    gender: careRecipientFormValue.gender,
                    conditionCategory: careRecipientFormValue.conditionCategory,
                })
            }else{
                await addDoc(collection(db,"careRecipients"),{
                    authId: user.id,
                    age: careRecipientFormValue.age,
                    gender: careRecipientFormValue.gender,
                    conditionCategory: careRecipientFormValue.conditionCategory,
                    status: "progress"
                })
            }
            navigate("/postList/profile")
        } catch (error) {
            setMessage(FIREBASE_ERROR.SERVER_ERROR);
        } finally {
            setSending(false);
        }
    }



    return(
        <div className={styles.container}>
            

            <form onSubmit={handleSubmit} className={styles.editForm}> 
            <h2 className={styles.title}>{id? "被介護者情報の編集":"被介護者情報の登録"}</h2>
                <label htmlFor="age" className={styles.ageLabel}>年齢</label>
                <input type="text" name="age" value={careRecipientFormValue.age} placeholder="年齢を入力" onChange={handleChange} className={styles.inputAge}/>

                {careRecipientFormErrors.age && <p>{careRecipientFormErrors.age}</p>}
                <br />

                <label htmlFor="gender" className={styles.genderLabel}>性別を選択</label>
                <select name="gender" id="gender" value={careRecipientFormValue.gender??""} onChange={handleSelectGender} className={styles.genderSelect}>
                <option value="">選択してください</option>
                    {genders.map((gender,index)=>(
                        <option value={index} key={index}>{gender}</option>
                    ))}
                </select>
                {careRecipientFormErrors.gender && <p>{careRecipientFormErrors.gender}</p>}
                <br />
                <label htmlFor="conditionCategory" className={styles.conditionCategoryLabel}>症状を選択</label>
                <div className={styles.conditionContainer}>
                {conditionCategory.map((condition,index)=>(
                    <label key={index} className={styles.conditionItem}> 
                    <input type="checkbox" value={index} checked={careRecipientFormValue.conditionCategory.includes(index)} onChange={handleCheck}/>
                    {condition}
                    </label>
                ))}
                </div>
                {careRecipientFormErrors.conditionCategory && <p>{careRecipientFormErrors.conditionCategory}</p>}
                <br />

                <button type="submit" disabled={sending} className={styles.submitBtn}>{sending ? "保存中..." : id ? "変更を保存" : "登録"}</button>
            </form>
            {messsage && <p>{messsage}</p>}
        </div>

    )
}