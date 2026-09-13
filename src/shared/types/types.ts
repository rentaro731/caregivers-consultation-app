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
  careRecipientId?:string,
  conditionCategory?:number[],
  icon:string,
  name:string,
  text:string,
  careRecipientAge?:string,
  careRecipientGender?:number|null
}

export type CareRecipientInfoType={
    id:string,
    authId:string,
    age:string,
    gender: number|null,
    conditionCategory:number[],
    status: string;
  }
