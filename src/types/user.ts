export interface User {
  id: string;
  name: string;
  email: string;
  avatarDataUrl: string | null;
  bio: string;
  createdAt: string;
}

/** Safe-to-share projection of a User, used for search results and friend
 * lists so we never leak email or other private fields to other accounts. */
export interface PublicUser {
  id: string;
  name: string;
  avatarDataUrl: string | null;
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
