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
