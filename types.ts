export type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
  bio: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

// signupで使用するエラーの型
export type FormErrorType = {
  name?: string;
  email?: string;
  password?: string;
  bio?: string;
};

// loginで使用するエラーの型
export type LoginFormErrorType = {
  email?: string;
  password?: string;
};
