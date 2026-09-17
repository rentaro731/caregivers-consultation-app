import {  collection, doc, increment, serverTimestamp,writeBatch } from "firebase/firestore"
import { useState } from "react"
import { db } from "../../shared/firebase/firebaseConfig"
import { useUserContext } from "../../shared/context/UserContext"
import styles from "../../css/commentForm.module.css"



export const CommentForm =({postId}:{postId:string})=>{

    const {user,profile} = useUserContext();

    const [comment,setComment] = useState<string>("")
    const [formError,setFormError] =useState<string>("")

    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setComment(e.target.value)
        setFormError("")
    }

    const validate = (value:string)=>{
        if(!value){
           return "コメントを入力してください"
        }
        return ""
    }

    const sendComment = async (e: React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const error = validate(comment)
        if (error) {
            setFormError(error)
            return;
        }

        if(!user?.id)return

        const batch = writeBatch(db)

        const commentRef = doc(collection(db,"posts",postId,"comments"))

        const countRef =  doc(db,"posts",postId)

        batch.set(commentRef,{
            authId:user.id,
            comment:comment,
            icon:profile?.icon,
            name:profile?.name,
            createdAt:serverTimestamp(),})
           
        batch.update(countRef,{
            commentCount:increment(1)
        })    

        await batch.commit()
    


        setComment("")
        setFormError("")


    }




    return(
        <>
        {formError && <p className={styles.errorComment}>{formError}</p>}
        <form onSubmit={sendComment}className={styles.form}>
            <input type="text" value={comment} onChange={handleChange} placeholder="コメントを入力" className={styles.commentInput}/>
            <button type="submit" className={styles.submitBtn}>送信</button>
        </form>
        </>
    )
}