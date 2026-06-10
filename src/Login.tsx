import { useState } from "react";
import { auth, db } from "./firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import type { FormValues, FormErrorType } from "../types";
import {
  ERROR_MESSAGES,
  EMAIL_REGEX,
  FIREBASE_ERROR,
  INITIAL_VALUES,
} from "../constants";
import { doc, getDoc } from "firebase/firestore";

export const Login = () => {
  const [inputValues, setInputValues] = useState<FormValues>(INITIAL_VALUES);
  const [inputErrors, setInputErrors] = useState<FormErrorType>({});
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
    setInputErrors({});
    setMessage("");
  };

  const validationCheck = (values: FormValues) => {
    const errors: FormErrorType = {};
    if (!values.email) {
      errors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
    }
    if (!values.password) {
      errors.password = ERROR_MESSAGES.PASSWORD_REQUIRED;
    }
    if (values.email && !EMAIL_REGEX.test(values.email)) {
      errors.email = ERROR_MESSAGES.INVALID_EMAIL;
    }
    if (
      values.password &&
      (values.password.length < 6 || values.password.length > 16)
    ) {
      errors.password = ERROR_MESSAGES.PASSWORD_NUMBER_LIMIT;
    }
    return errors;
  };

  const onLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validationCheck(inputValues);
    if (Object.keys(validationErrors).length > 0) {
      setInputErrors(validationErrors);
      setMessage("");
      return;
    }
    setSending(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        inputValues.email,
        inputValues.password,
      );
      const user = userCredential.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      if (userData?.name === null || userData?.bio === null) {
        navigate("/postList/profile/editProfile");
        return;
      }
      setInputValues(INITIAL_VALUES);
      setInputErrors({});
      setMessage("ログインに成功しました");
      navigate("/postList");
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const err = error as { code: string };
        if (err.code === "auth/user-not-found") {
          setMessage(FIREBASE_ERROR.EMAIL_MESSAGE_WRONG_PASSWORD_OR_EMAIL);
          return;
        }
        if (err.code === "auth/wrong-password") {
          setMessage(FIREBASE_ERROR.EMAIL_MESSAGE_WRONG_PASSWORD_OR_EMAIL);
          return;
        }
        if (err.code === "auth/network-request-failed") {
          setMessage(FIREBASE_ERROR.NETWORK_ERROR);
          return;
        }
        if (err.code === "auth/invalid-credential") {
          setMessage(FIREBASE_ERROR.EMAIL_MESSAGE_WRONG_PASSWORD_OR_EMAIL);
          return;
        }
      }
      setMessage(FIREBASE_ERROR.SERVER_ERROR);
    } finally {
      setSending(false);
    }
  };

  const togglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <h1>ログイン</h1>
      <form onSubmit={onLogin} noValidate>
        <label htmlFor="email">メールアドレス</label>
        <input
          type="email"
          id="email"
          placeholder="メールアドレス"
          name="email"
          value={inputValues.email}
          onChange={handleChange}
        />
        {inputErrors.email && <p>{inputErrors.email}</p>}
        <br />
        <label htmlFor="password">パスワード</label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder="パスワード"
          name="password"
          value={inputValues.password}
          onChange={handleChange}
        />
        <button type="button" onClick={togglePassword}>
          {showPassword ? "非表示" : "表示"}
        </button>
        {inputErrors.password && <p>{inputErrors.password}</p>}
        <br />
        <button type="submit" disabled={sending}>
          ログイン
        </button>
      </form>
      {message && <p>{message}</p>}
      <br />
      <button onClick={() => navigate("/googleLogin")}>
        Googleアカウントでログイン
      </button>
    </>
  );
};
