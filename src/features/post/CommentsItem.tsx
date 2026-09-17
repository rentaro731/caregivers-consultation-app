import { collection, onSnapshot, orderBy, query, type Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../shared/firebase/firebaseConfig";
import styles from "../../css/commentsItem.module.css";

type CommentsItemType = {
    id:string,
    authId:string,
    comment:string,
    icon:string,
    name:string,
    createdAt:Timestamp | null,
}
export const CommentsItem =({postId}:{postId:string})=>{
    const [comment, setComment] = useState<CommentsItemType[]>([]);

    useEffect(()=>{
            if(!postId)return;
            const commentsQuery = query(collection(db,"posts",postId,"comments"),orderBy("createdAt","desc"))
            const unsubscribe = onSnapshot(commentsQuery,(snap)=>{
                const comment = snap.docs.map((doc)=>
                    ({
                        id:doc.id,
                        ...doc.data(),
                    } as CommentsItemType)
                )
                setComment(comment);
            })
            return () => unsubscribe();
    },[postId])
    
    return (
        <div>
            <ul className={styles.commentListArea}>
                {comment.map((commentItem)=>(
                    <li key={commentItem.id} className={styles.commntList}>
                        <div className={styles.commentHeader}>
                            <p className={styles.icon}>{commentItem.icon}</p>
                            <p className={styles.name}>{commentItem.name}</p>
                            <p className={styles.time}>{commentItem.createdAt?.toDate().toLocaleString()}</p>
                        </div>
                        <div className={styles.commentsTextArea}>
                            <p className={styles.commentText}>{commentItem.comment}</p>
                        </div>
                    </li>

                ))}
            </ul>
        </div>
    )
}