import type { Timestamp } from "firebase/firestore";

export type FormValues = {
  email: string;
  password: string;
};


export type FormErrorType = {
  email?: string;
  password?: string;
};
export type Post = {
  postId:string
  authId:string,
  commentCount:number,
  createdAt:Timestamp,
  empathyCount:number,
  icon:string
  name:string,
  text:string
}

export type CareRecipientInfoType={
  id:string,
  authId:string,
  age:string,
  gender: number|null,
  conditionCategory:number[],
  status: string;
}
