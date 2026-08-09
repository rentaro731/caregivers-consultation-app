import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../shared/firebase/firebaseConfig";

import type { Post } from "../../../types";
import styles from "../../css/comments.module.css"
import { FaComment, FaHeart } from "react-icons/fa";

import { CommentsItem } from "./CommentsItem";


export const Comments = () => {
  const [post,setPost]=useState<Post| null>(null)

  const {postId} = useParams();

  /* 投稿の詳細を取得 (commentの取得は別コンポーネント)*/
  useEffect(()=>{
    const getPost = async()=>{
      if(!postId)return;
      const docRef = doc(db,"posts",postId)
      const postSnap = await getDoc(docRef)
      if(postSnap.exists()){
        setPost({
          postId: postSnap.id,
          ...postSnap.data(),
        }as Post)
      }
    }
    getPost();
  },[postId])
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>投稿の詳細</h1>
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

      {postId && <CommentsItem postId={postId}/>}

    </div>
  );
};

