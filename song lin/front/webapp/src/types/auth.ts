export interface User {
  id: string;
  address: string;
  provider: 'metamask';
  email?: string;
  name?: string;
  picture?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isInitializing: boolean;
}
