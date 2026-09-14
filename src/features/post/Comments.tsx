import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../shared/firebase/firebaseConfig";

import type { Post } from "../../shared/types/types";
import styles from "../../css/comments.module.css"
import { FaComment, FaHeart } from "react-icons/fa";

import { CommentsItem } from "./CommentsItem";
import { CommentForm } from "./CommentForm";


export const Comments = () => {
  const [post,setPost]=useState<Post| null>(null)

  const {postId} = useParams();
  const navigate = useNavigate();

  /* 投稿の詳細を取得 (commentの取得は CommentsItemコンポーネント)*/
  useEffect(()=>{
    if(!postId)return;

    const unsub = onSnapshot(doc(db,"posts",postId),async(postSnap)=>{

      if(!postSnap.exists()) return
      const postSnapData= postSnap.data()

      const userSnap =  await getDoc(doc(db,"users",postSnapData.authId));

      const userData = userSnap.data();

      if(postSnap.exists()){
        setPost({
          postId: postSnap.id,
          ...postSnapData,
          icon:userData?.icon,
          name:userData?.name
        }as Post)
      }}) 

      return()=>unsub()

  },[postId])
  return (
    <div className={styles.container}>
      <div className={styles.header}>
      <button onClick={()=>navigate(-1)} className={styles.backBtn} >←</button>
      <h1 className={styles.title}>投稿の詳細</h1>
      </div>
      
        {post && (
          <div className={styles.postItem}>
          <div className={styles.postHeader}>
          <p className={styles.icon}>{post.icon}</p>
          <p>{post.name}</p>
        </div>
        <div className={styles.postText}>
          <p>{post.text}</p>
        </div>
         <div className={styles.postFooter}>
         <button  className={styles.commentIcon}><FaComment/>{post.commentCount}</button>
         <button className={styles.empathyIcon}><FaHeart />{post.empathyCount}</button>
         </div>
         </div>
        )}
      <h4 className={styles.secondTitle}>-コメント一覧-</h4>  
      <div className={styles.commentsArea}>
      {postId && <CommentsItem postId={postId}/>}
      </div>
      {postId && <CommentForm postId={postId}/>}

    </div>
  );
};
