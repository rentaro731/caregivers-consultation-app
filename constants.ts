import type { SignUpFormValues } from "./types";
export const SIGNUP_INITIAL_VALUES: SignUpFormValues = {
  name: "",
  email: "",
  password: "",
  bio: "",
};

export const ERROR_MESSAGES = {
  NAME_REQUIRED: "ニックネームを入力してください",
  EMAIL_REQUIRED: "メールアドレスを入力してください",
  PASSWORD_REQUIRED: "パスワードを入力してください",
  BIO_REQUIRED: "自己紹介文を入力してください",
  INVALID_EMAIL: "メールアドレスの形式が正しくありません",
  PASSWORD_NUMBER_LIMIT: "パスワードは6文字以上16文字以下で入力してください",
};
export const EMAIL_REGEX =
  /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

export const AUTHENTICATION_ERROR = {
  EMAIL_MESSAGE_SERVER_ERROR: "登録に失敗しました。再度お試しください。",
  EMAIL_MESSAGE_ALREADY_IN_USE:
    "メールアドレスまたはパスワードが間違っています。",
  EMAIL_MESSAGE_NETWORK_ERROR:
    "通信エラーが発生しました。インターネット接続を確認してください。",
};
