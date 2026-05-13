import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth,db } from "./firebaseConfig";
import { setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import { AUTHENTICATION_ERROR } from "../constants";
import { useState } from "react";

import { useNavigate } from "react-router-dom";



export const GoogleLogin = () => {
    const [message,setMessage] = useState("");
    const [loding,setLoding] =useState(false)

    const navigate = useNavigate();
    const handleGoogleLogin = async () => {
        setLoding(true)
        setMessage("")
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: "select_account",
        });
        try{
        const result = await signInWithPopup(auth, provider)
        const user = result.user;

        const userRef = (doc(db,"users",user.uid))
        const userSnap = await getDoc(userRef)

        if (! userSnap.exists()){
           await setDoc(userRef,{
                name: null,
                bio: null,
                createdAt: serverTimestamp(),
            })
            navigate("/selfIntroduction");
            return
        }
        navigate("/postList");

        } catch(error: unknown) {
            if(typeof error === "object" && error !== null && "code" in error){
                const err = error as {code: string}
            if (err.code === "auth/popup-closed-by-user"){
                setMessage(AUTHENTICATION_ERROR.GOOGLE_LOGIN_CANCELLED)
                return;
            }
            if(err.code === "auth/network-request-failed") {
                setMessage(AUTHENTICATION_ERROR.NETWORK_ERROR)
                return;
            }
        }
        setMessage(AUTHENTICATION_ERROR.SERVER_ERROR)
      }finally {
        setLoding(false)
    }

    } 
    return (
        <>
        <button onClick={handleGoogleLogin} disabled={loding}>
        {loding ? "ログイン中..." : "Googleアカウントでログイン"}
        </button>
        {message && <p>{message}</p>}
        

        </>
    )
  };
  