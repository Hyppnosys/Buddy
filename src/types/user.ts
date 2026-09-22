export interface User {
  id: string;
  name: string;
  email: string;
  avatarDataUrl: string | null;
  bio: string;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  name: string;
  avatarDataUrl: string | null;
}

export interface AuthFormValues {
  name?: string;
  email: string;
  password: string;
}
