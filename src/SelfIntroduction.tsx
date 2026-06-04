import { useState } from "react";
import { ERROR_MESSAGES, FIREBASE_ERROR } from "../constants";
import { useUserContext } from "./UserContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";

type IntroductionValues = {
  name: string;
  bio: string;
};

export type IntroductionErrorType = {
  name?: string;
  bio?: string;
};

const INTRODUCTION_VALUES: IntroductionValues = {
  name: "",
  bio: "",
};

export const SelfIntroduction = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const [introductionValues, setIntroductionValues] =
    useState(INTRODUCTION_VALUES);
  const [introductionErrors, setIntroductionErrors] =
    useState<IntroductionErrorType>({});
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const validates = (values: IntroductionValues) => {
    const errors: IntroductionErrorType = {};

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
    setIntroductionValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setIntroductionErrors({});
    setMessage("");
  };

  const onIntroductionSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const validationErrors = validates(introductionValues);
    if (Object.keys(validationErrors).length > 0) {
      setIntroductionErrors(validationErrors);
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
          name: introductionValues.name,
          bio: introductionValues.bio,
        },
        { merge: true },
      );
      setIntroductionValues(INTRODUCTION_VALUES);
      setIntroductionErrors({});
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
      <form onSubmit={onIntroductionSubmit}>
        <label htmlFor="name">ニックネーム</label>
        <input
          type="name"
          placeholder="ニックネームを入力"
          value={introductionValues.name}
          name="name"
          id="name"
          onChange={handleChange}
        />
        {introductionErrors.name && <p>{introductionErrors.name}</p>}
        <br />
        <label htmlFor="bio">ひとこと</label>
        <input
          type="text"
          placeholder="ひとこと"
          value={introductionValues.bio}
          name="bio"
          id="bio"
          onChange={handleChange}
        />
        {introductionErrors.bio && <p>{introductionErrors.bio}</p>}
        <br />
        <button type="submit" disabled={sending}>
          登録
        </button>
      </form>
      {message && <p>{message}</p>}
    </>
  );
};
