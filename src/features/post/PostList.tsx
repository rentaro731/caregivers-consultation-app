import { useEffect, useState } from "react";
import styles from "../../css/postList.module.css";

import { collection,  onSnapshot, orderBy, query,  } from "firebase/firestore";
import { db } from "../../shared/firebase/firebaseConfig";

import { FaComment,FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { Post } from "../../../types";



export const PostList = () => {

  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([])

  useEffect(()=>{
    const postsQuery =  query(collection(db,"posts"),orderBy("createdAt","desc"))
    const unsubscribe = onSnapshot(postsQuery,(snaps)=>{
      const postData = snaps.docs.map((doc)=>({
        postId:doc.id,
        ...doc.data()
      }))as Post[];
      setPosts(postData)
    })
    return unsubscribe
  },[])

  const commentSection = (postId:string)=>{
    navigate(`/postList/comments/${postId}`)
  }

  return (
  <main className={styles.container}>
    <div className={styles.header}>
      <p className={styles.title}>
        投稿一覧
      </p>
      <input type="text" placeholder="投稿を検索"  className={styles.searchInput}/>
      <button className={styles.searchButton}>検索</button>
    </div>
    <div className={styles.postListScrollArea}>
    <ul className={styles.postList}>
    {posts.map((post)=>(
      <li key={post.postId}className={styles.postItem}>
        <div className={styles.postHeader}>
          <p className={styles.icon}>{post.icon}</p>
          <p>{post.name}</p>
        </div>
        <div className={styles.postText}>
          <p>{post.text}</p>
        </div>
         <div className={styles.postFooter}>
         <button onClick={()=>commentSection(post.postId)} className={styles.commentIcon}><FaComment/>{post.commentCount}</button>
         <button className={styles.empathyIcon}><FaHeart />{post.empathyCount}</button>
         </div>
        
      </li>
    ))}
      
    </ul>
    </div>

  </main>
)};
