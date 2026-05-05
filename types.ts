export type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
  bio: string;
};

export type FormErrorType = {
  name?: string;
  email?: string;
  password?: string;
  bio?: string;
};
