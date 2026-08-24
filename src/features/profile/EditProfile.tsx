import { useEffect, useState } from "react";
import { ERROR_MESSAGES, FIREBASE_ERROR } from "../../shared/constants/constants";
import { useUserContext } from "../../shared/context/UserContext";
import { collection, doc, getDoc, getDocs, query, setDoc, where, writeBatch } from "firebase/firestore";
import { db } from "../../shared/firebase/firebaseConfig";
import { useLocation, useNavigate } from "react-router-dom";


type ProfileFormValues = {
  name: string;
  bio: string;
  icon: string,
};

export type ProfileFormErrorType = {
  name?: string;
  bio?: string;
  icon?: string
};


const PROFILE_INITIAL_VALUES: ProfileFormValues = {
  name: "",
  bio: "",
  icon:"",
};



export const EditProfile = () => {
  const { user, loading,refreshProfile} = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  const icons = ["😈","🤡","👻","😸","👨","👩","🐶","🐰","🦊","🐒"]
  

  const [profileValues, setProfileValues] = useState(PROFILE_INITIAL_VALUES);
  const [profileErrors, setProfileErrors] = useState<ProfileFormErrorType>({});
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);


  useEffect(()=>{
    const getProfile= async ()=>{
      if (loading) return;
      if(!user?.id) return

    const userRef = doc(db,"users",user?.id)
    const userSnap = await getDoc(userRef)
    if(userSnap.exists()){
      const data = userSnap.data();
      setProfileValues({
        name: data?.name ?? "",
        bio: data?.bio ?? "",
        icon: data?.icon ?? "",

      });
    }
  };
  getProfile();
    },[user?.id,loading])

    

  const validates = (values: ProfileFormValues) => {
    const errors: ProfileFormErrorType = {};

    if (!values.name) {
      errors.name = ERROR_MESSAGES.NAME_REQUIRED;
    }

    if (!values.bio) {
      errors.bio = ERROR_MESSAGES.BIO_REQUIRED;
    }
    if(!values.icon){
      errors.icon= ERROR_MESSAGES.ICON_REQUIRED
    }

    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setProfileErrors({});
    setMessage("");
  };

  const handleSelectIcon = (selectIcon:string)=>{
    setProfileValues((prev) => ({
      ...prev,
      icon:selectIcon})
    )
  }


  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validates(profileValues);
    if (Object.keys(validationErrors).length > 0) {
      setProfileErrors(validationErrors);
      setMessage("");
      return;
    }
    setSending(true);
    if (!user?.id) {
      setMessage("ログインして下さい");
      navigate("/login");
      return;
    }

    if (!navigator.onLine) {
      setMessage(FIREBASE_ERROR.NETWORK_ERROR);
      return;
    }
    setSending(true);

    try {
      //ユーザープロフィールの更新
      await setDoc(
        doc(db, "users", user?.id),
        {
          name: profileValues.name,
          bio: profileValues.bio,
          icon:profileValues.icon
        },
        { merge: true },
      );
      await  updateUserPostsProfile(user.id,profileValues.name,profileValues.icon)

      await refreshProfile();
      setProfileValues(PROFILE_INITIAL_VALUES);
      setProfileErrors({});
      setMessage("プロフィールを登録しました");
      if(location.state?.from === "profile"){
        navigate("/postList/profile");
      } else{
        navigate("/postList");
      }
    
    } catch (error) {
      setMessage(FIREBASE_ERROR.SERVER_ERROR);
    } finally {
      setSending(false);
    }
  };

  const updateUserPostsProfile = async (userId:string, name:string, icon:string)=>{
    const postsQuery = query(collection(db,"posts"),where("authId","==",userId));
    const postsSnapshot = await getDocs(postsQuery)
    const batch = writeBatch(db)
    postsSnapshot.docs.forEach((postDoc)=>{
      batch.update(postDoc.ref,{
        name,
        icon,
      });
    });
    await batch.commit();
  }

  return (
    <>
      <h1>プロフィール</h1>
      <form onSubmit={handleSubmit}>
      <label htmlFor="icon">アイコン</label>
      {icons.map((icon)=>(
        <button key={icon} type="button" onClick={()=>handleSelectIcon(icon)}>{icon}</button>
      ))}
      <p>選択中：{profileValues.icon}</p>
      {profileErrors.icon && <p>{profileErrors.icon}</p>}
        
        <label htmlFor="name">ニックネーム</label>
        <input
          type="text"
          placeholder="ニックネームを入力"
          value={profileValues.name}
          name="name"
          id="name"
          onChange={handleChange}
        />
        {profileErrors.name && <p>{profileErrors.name}</p>}
        <br />
        <label htmlFor="bio">ひとこと</label>
        <input
          type="text"
          placeholder="ひとこと"
          value={profileValues.bio}
          name="bio"
          id="bio"
          onChange={handleChange}
        />
        {profileErrors.bio && <p>{profileErrors.bio}</p>}
        <br />
        <button type="submit" disabled={sending}>
          登録
        </button>
      </form>
      {message && <p>{message}</p>}
    </>
  );
};
