import { useState } from "react";
import {useUserContext} from "../../shared/context/UserContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../shared/firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

import styles from "../../css/createPost.module.css";


type PostContentValueType = {
  text: string;
}
type PostContentErrorType = {
  text?: string;
}

const postContentValue: PostContentValueType = {
  text: "",
}


export const CreatePost = () => {
  const { user, profile} = useUserContext();
  const navigate = useNavigate();

  const [postContent, setPostContent] = useState<PostContentValueType>(postContentValue)
  const [postContentErrors, setPostContentErrors] = useState<PostContentErrorType>({});


  const validates = (values: PostContentValueType) => {
    const errors: PostContentErrorType = {};
    if (!values.text) {
      errors.text = "悩みなどを書いてください";
    }
    return errors;
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostContent((prev)=>({...prev, [name]: value}));
    setPostContentErrors({});
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validates(postContent);
    if (Object.keys(validationErrors).length > 0) {
      setPostContentErrors(validationErrors)
      return;
    }
    try {
      const ref = collection(db,"posts")
      await addDoc(ref,{
        authId: user?.id,
        icon: profile?.icon,
        name: profile?.name,
        text: postContent.text,
        commentCount:0,
        empathyCount:0,
        createdAt:serverTimestamp()
      })
      setPostContent(postContentValue)
      setPostContentErrors({})
      navigate("/postList")
   } catch(error) {
    console.log(error)


   }
  }



  return(
    <div className={styles.container}>
      <h1 className={styles.createPostTitle}>悩みなどを書いて投稿しよう！</h1>
      <form onSubmit={handleSubmit}>
        <textarea  onChange={handleChange} name="text" value={postContent.text} className={styles.textarea} placeholder="悩みなどを書いてください" />
        {postContentErrors.text && <p>{postContentErrors.text}</p>}
        <br />
        <div className={styles.postButtonContainer}>
        <button type="submit" className={styles.postButton} >投稿</button>
        </div>
      </form>
    </div>
  )

};
