import { useState } from "react";
import { ERROR_MESSAGES, FIREBASE_ERROR } from "../../../constants";
import { useUserContext } from "../../shared/context/UserContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../shared/firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

type ProfileFormValues = {
  name: string;
  bio: string;
};

export type ProfileFormErrorType = {
  name?: string;
  bio?: string;
};

const PROFILE_INITIAL_VALUES: ProfileFormValues = {
  name: "",
  bio: "",
};

export const EditProfile = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const [profileValues, setProfileValues] = useState(PROFILE_INITIAL_VALUES);
  const [profileErrors, setProfileErrors] = useState<ProfileFormErrorType>({});
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const validates = (values: ProfileFormValues) => {
    const errors: ProfileFormErrorType = {};

    if (!values.name) {
      errors.name = ERROR_MESSAGES.NAME_REQUIRED;
    }

    if (!values.bio) {
      errors.bio = ERROR_MESSAGES.BIO_REQUIRED;
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
      setSending(false);
      return;
    }

    if (!navigator.onLine) {
      setMessage(FIREBASE_ERROR.NETWORK_ERROR);
      setSending(false);
      return;
    }

    try {
      //ユーザープロフィールの更新
      await setDoc(
        doc(db, "users", user?.id),
        {
          name: profileValues.name,
          bio: profileValues.bio,
        },
        { merge: true },
      );
      setProfileValues(PROFILE_INITIAL_VALUES);
      setProfileErrors({});
      setMessage("プロフィールを登録しました");
      navigate("/postList");
    } catch (error) {
      setMessage(FIREBASE_ERROR.SERVER_ERROR);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <h1>ニックネーム ひとこと</h1>
      <form onSubmit={handleSubmit}>
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
