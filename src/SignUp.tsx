import { useState } from "react";
import { auth, db } from "./firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import type { SignUpFormValues, FormErrorType } from "../types";
import {
  ERROR_MESSAGES,
  EMAIL_REGEX,
  AUTHENTICATION_ERROR,
} from "../constants";

const SIGNUP_INITIAL_VALUES: SignUpFormValues = {
  name: "",
  email: "",
  password: "",
  bio: "",
};

export const SignUp = () => {
  const [formValues, setFormValues] = useState<SignUpFormValues>(
    SIGNUP_INITIAL_VALUES,
  );
  const [sending, setSending] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrorType>({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  //バリデーションチェック
  const validates = (values: SignUpFormValues) => {
    const errors: FormErrorType = {};
    if (!values.name) {
      errors.name = ERROR_MESSAGES.NAME_REQUIRED;
    }
    if (!values.email) {
      errors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
    }
    if (values.email && !EMAIL_REGEX.test(values.email)) {
      errors.email = ERROR_MESSAGES.INVALID_EMAIL;
    }
    if (!values.password) {
      errors.password = ERROR_MESSAGES.PASSWORD_REQUIRED;
    }
    if (values.password && (values.password.length < 6 || values.password.length > 16)) {
      errors.password = ERROR_MESSAGES.PASSWORD_NUMBER_LIMIT;
    }
    if (!values.bio) {
      errors.bio = ERROR_MESSAGES.BIO_REQUIRED;
    }
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({...prev, [name]: value}))
    setFormErrors({});
    setMessage("");
  };
  //ユーザー登録
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validates(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setMessage("");
      return;
    }
    setSending(true);
    try {
      //authにユーザー登録
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password,
      );
      // firestoreにユーザーデータ保存
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        name: formValues.name,
        email: formValues.email,
        bio: formValues.bio,
      });
      setFormValues(SIGNUP_INITIAL_VALUES);
      setMessage("ユーザー登録が完了しました。");
      navigate("/login");
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const err = error as { code: string };
        if (err.code === "auth/email-already-in-use") {
          setMessage(
            AUTHENTICATION_ERROR.EMAIL_MESSAGE_WRONG_PASSWORD_OR_EMAIL,
          );
        }
        if (err.code === "auth/network-request-failed") {
          setMessage(AUTHENTICATION_ERROR.EMAIL_MESSAGE_NETWORK_ERROR);
        }
        return;
      }
      setMessage(AUTHENTICATION_ERROR.EMAIL_MESSAGE_SERVER_ERROR);
    } finally {
      setSending(false);
    }
  };

  const togglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <h1>新規登録</h1>
        <label htmlFor="name">お名前</label>
        <input
          type="text"
          placeholder="ニックネーム"
          value={formValues.name}
          name="name"
          id="name"
          onChange={handleChange}
        />
        {formErrors.name && <p>{formErrors.name}</p>}
        <br />

        <label htmlFor="email">メールアドレス</label>
        <input
          type="email"
          placeholder="メールアドレス"
          value={formValues.email}
          name="email"
          id="email"
          onChange={handleChange}
        />
        {formErrors.email && <p>{formErrors.email}</p>}
        <br />
        <label htmlFor="password">パスワード</label>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="パスワード"
          value={formValues.password}
          name="password"
          id="password"
          onChange={handleChange}
        />
        <button type="button" onClick={togglePassword}>
          {showPassword ? "非表示" : "表示"}
        </button>
        {formErrors.password && <p>{formErrors.password}</p>}
        <br />

        <label htmlFor="bio">簡単な自己紹介</label>
        <input
          type="text"
          placeholder="母を介護していますなど"
          value={formValues.bio}
          name="bio"
          id="bio"
          onChange={handleChange}
        />
        {formErrors.bio && <p>{formErrors.bio}</p>}
        <br />
        <button type="submit" disabled={sending}>
          登録
        </button>
      </form>
      {message && <p>{message}</p>}
    </>
  );
};
