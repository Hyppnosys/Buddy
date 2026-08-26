export interface User {
  id: string;
  name: string;
  email: string;
  avatarDataUrl: string | null;
  bio: string;
  createdAt: string;
}

/** Stored alongside the user record. Mock-only: plain text, local device only. */
export interface StoredCredential {
  userId: string;
  email: string;
  password: string;
}

export interface AuthFormValues {
  name?: string;
  email: string;
  password: string;
}
