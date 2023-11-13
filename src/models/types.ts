export type FormValidationType = {
  username?: string | undefined;
  email: string | undefined;
  password: string | undefined;
  password2?: string | undefined;
};
export type ValidationType = 'registration' | 'authorization';
export type AuthResponse = {
  email: string;
  username: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
};
