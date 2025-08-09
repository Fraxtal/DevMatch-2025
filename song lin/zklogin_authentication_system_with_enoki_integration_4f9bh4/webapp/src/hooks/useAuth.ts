import { useState, useEffect, createContext, useContext } from 'react';
import { User, AuthState, ZkLoginSession } from '../types/auth';

const AuthContext = createContext<{
  authState: AuthState;
  login: (provider: string) => Promise<void>;
  logout: () => void;
  executeTransaction: (transaction: any) => Promise<string>;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
  });

  const [zkSession, setZkSession] = useState<ZkLoginSession | null>(null);

  useEffect(() => {
    // Check for existing session on mount
    const savedSession = localStorage.getItem('zklogin_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setZkSession(session);
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: {
            id: session.suiAddress,
            suiAddress: session.suiAddress,
            provider: 'google', // Default, should be stored in session
          } as User,
        }));
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('zklogin_session');
      }
    }
  }, []);

  const login = async (provider: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate zkLogin flow
      // In a real implementation, this would:
      // 1. Redirect to OAuth provider
      // 2. Get JWT with embedded nonce
      // 3. Generate ephemeral key pair
      // 4. Get user salt from salt service
      // 5. Generate zkSNARK proof
      // 6. Derive Sui address

      // Mock implementation for demo
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockSession: ZkLoginSession = {
        jwt: 'mock_jwt_token',
        ephemeralKeyPair: 'mock_ephemeral_key',
        userSalt: 'mock_user_salt',
        zkProof: 'mock_zk_proof',
        suiAddress: '0x' + Math.random().toString(16).substring(2, 42),
      };

      const mockUser: User = {
        id: mockSession.suiAddress,
        email: 'user@example.com',
        name: 'Demo User',
        picture: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
        provider: provider as any,
        suiAddress: mockSession.suiAddress,
        zkProof: mockSession.zkProof,
      };

      setZkSession(mockSession);
      localStorage.setItem('zklogin_session', JSON.stringify(mockSession));

      setAuthState({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      }));
    }
  };

  const logout = () => {
    setZkSession(null);
    localStorage.removeItem('zklogin_session');
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    });
  };

  const executeTransaction = async (transaction: any): Promise<string> => {
    if (!zkSession) {
      throw new Error('No active session');
    }

    // Mock transaction execution
    // In real implementation, this would use the zkProof and ephemeral key
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return '0x' + Math.random().toString(16).substring(2, 64);
  };

  return {
    authState,
    login,
    logout,
    executeTransaction,
    AuthContext,
  };
};
