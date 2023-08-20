export type ModuleMenuType = 'get_in' | 'registration' | 'exit';
export type RegistrationFormDataType = {
  username: string;
  email: string;
  password: string;
};
export type UsersResponseResult = [
  {
    id: number;
    username: string;
    password: string;
    email: string;
    avatar: string;
    permission: number;
  },
];
export type FormValidationType = {
  username?: string | undefined;
  email: string | undefined;
  password: string | undefined;
  password2?: string | undefined;
};
export type ValidationType = 'registration' | 'authorization';
