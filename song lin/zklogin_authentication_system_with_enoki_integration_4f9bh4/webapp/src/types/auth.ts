export interface User {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
  provider: 'google' | 'apple' | 'twitch' | 'facebook';
  suiAddress: string;
  zkProof?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface ZkLoginSession {
  jwt: string;
  ephemeralKeyPair: any;
  userSalt: string;
  zkProof: string;
  suiAddress: string;
}
