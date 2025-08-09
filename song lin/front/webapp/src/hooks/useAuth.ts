import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { User, AuthState } from '../types/auth';

// MetaMask types
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, handler: (params: any) => void) => void;
      removeListener: (eventName: string, handler: (params: any) => void) => void;
    };
  }
}

const AuthContext = createContext<{
  authState: AuthState;
  login: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
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
    isInitializing: true,
  });

  // Use ref to track current authentication state for event listeners
  const authStateRef = useRef(authState);
  authStateRef.current = authState;

  useEffect(() => {
    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        // Simulate initialization delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check if user explicitly logged out (prevent auto-restore)
        const explicitLogout = sessionStorage.getItem('explicit_logout');
        if (explicitLogout) {
          console.log('User explicitly logged out, skipping session restoration');
          sessionStorage.removeItem('explicit_logout');
          localStorage.removeItem('metamask_session');
          setAuthState(prev => ({
            ...prev,
            isInitializing: false,
          }));
          return;
        }
        
        const savedSession = localStorage.getItem('metamask_session');
        if (savedSession) {
          const session = JSON.parse(savedSession);
          console.log('Found saved session:', session);
          
          // Check if the session is recent (not older than 24 hours)
          const sessionTime = session.timestamp ? new Date(session.timestamp) : new Date(0);
          const now = new Date();
          const hoursSinceSession = (now.getTime() - sessionTime.getTime()) / (1000 * 60 * 60);
          
          if (hoursSinceSession > 24) {
            console.log('Session expired (older than 24 hours), clearing');
            localStorage.removeItem('metamask_session');
            setAuthState(prev => ({
              ...prev,
              isInitializing: false,
            }));
            return;
          }
          
          // Check if MetaMask is connected and the saved address matches
          if (window.ethereum && window.ethereum.isMetaMask) {
            try {
              const accounts = await window.ethereum.request({ method: 'eth_accounts' });
              console.log('Current MetaMask accounts:', accounts);
              if (accounts.length > 0 && accounts[0].toLowerCase() === session.address.toLowerCase()) {
                console.log('Session restored successfully');
                setAuthState(prev => ({
                  ...prev,
                  isAuthenticated: true,
                  isInitializing: false,
                  user: {
                    id: session.address,
                    address: session.address,
                    provider: 'metamask',
                    name: session.name || 'MetaMask User',
                    picture: session.picture,
                  } as User,
                }));
                return;
              } else {
                console.log('Account mismatch, clearing session');
                localStorage.removeItem('metamask_session');
              }
            } catch (error) {
              console.error('Failed to check MetaMask connection:', error);
              localStorage.removeItem('metamask_session');
            }
          }
        } else {
          console.log('No saved session found');
        }
        
        setAuthState(prev => ({
          ...prev,
          isInitializing: false,
        }));
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('metamask_session');
        setAuthState(prev => ({
          ...prev,
          isInitializing: false,
          error: 'Failed to restore previous session',
        }));
      }
    };

    initializeAuth();

    // Set up MetaMask event listeners
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log('Accounts changed:', accounts);
        // Only handle account changes if user is currently authenticated
        const currentState = authStateRef.current;
        if (!currentState.isAuthenticated) {
          console.log('User not authenticated, ignoring account change');
          return; // Don't interfere if user is not logged in
        }

        if (accounts.length === 0) {
          // User disconnected their wallet
          console.log('User disconnected wallet');
          sessionStorage.setItem('explicit_logout', 'true');
          localStorage.removeItem('metamask_session');
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
            isInitializing: false,
          });
        } else {
          // User switched accounts
          const newAddress = accounts[0];
          const savedSession = localStorage.getItem('metamask_session');
          if (savedSession) {
            const session = JSON.parse(savedSession);
            if (newAddress.toLowerCase() !== session.address.toLowerCase()) {
              // Different account, need to re-authenticate
              console.log('User switched accounts, logging out');
              sessionStorage.setItem('explicit_logout', 'true');
              localStorage.removeItem('metamask_session');
              setAuthState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
                error: null,
                isInitializing: false,
              });
            }
          }
        }
      };

      const handleChainChanged = () => {
        // Reload the page when network changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Cleanup listeners on unmount
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []); // Remove dependency since we're using ref

  const login = async () => {
    setAuthState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null 
    }));

    try {
      console.log('Starting MetaMask login process...');
      
      // Enhanced MetaMask detection
      if (typeof window === 'undefined') {
        throw new Error('Window object is not available. Please refresh the page.');
      }

      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask browser extension and reload the page.');
      }

      if (!window.ethereum.isMetaMask) {
        throw new Error('MetaMask not detected. Please make sure MetaMask is enabled and reload the page.');
      }

      console.log('MetaMask detected, requesting permissions & account access...');

      // Always request permissions first so the user can pick a different account
      try {
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        });
      } catch (permError: any) {
        // If user cancels or wallet doesn't support, we'll still try eth_requestAccounts below
        if (permError && permError.code !== 4001) {
          console.warn('wallet_requestPermissions failed or not supported:', permError);
        }
      }

      // Request account access with better error handling
      let accounts;
      try {
        accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
      } catch (requestError: any) {
        console.error('Account request failed:', requestError);
        
        // Handle specific MetaMask errors
        if (requestError.code === 4001) {
          throw new Error('Connection request was rejected. Please try again and approve the connection in MetaMask.');
        } else if (requestError.code === -32002) {
          throw new Error('A connection request is already pending. Please check MetaMask and try again.');
        } else if (requestError.code === -32603) {
          throw new Error('MetaMask internal error. Please unlock your MetaMask wallet and try again.');
        } else {
          throw new Error(`MetaMask connection failed: ${requestError.message || 'Unknown error'}`);
        }
      }

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please make sure your MetaMask wallet is unlocked and has at least one account.');
      }

      const address = accounts[0];
      console.log('MetaMask connected with address:', address);
      
      // Validate the address format
      if (!address || typeof address !== 'string' || !address.startsWith('0x')) {
        throw new Error('Invalid wallet address received from MetaMask. Please try reconnecting.');
      }

      try {
        // Get account details (optional, don't fail if this doesn't work)
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
        console.log('Wallet balance retrieved:', balance);
      } catch (balanceError) {
        console.warn('Could not retrieve balance:', balanceError);
        // Don't fail the authentication for balance issues
      }

      // Create user object
      const user: User = {
        id: address,
        address: address,
        provider: 'metamask',
        name: `Wallet ${address.slice(0, 6)}...${address.slice(-4)}`,
        picture: `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`,
      };

      // Save session to localStorage
      const session = {
        address: user.address,
        name: user.name,
        picture: user.picture,
        provider: 'metamask',
        timestamp: new Date().toISOString(),
      };

      try {
        localStorage.setItem('metamask_session', JSON.stringify(session));
        console.log('Session saved to localStorage');
      } catch (storageError) {
        console.warn('Could not save session to localStorage:', storageError);
        // Don't fail authentication for storage issues
      }

      console.log('Authentication successful!');
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
        isInitializing: false,
      });

    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Failed to connect MetaMask';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }

  };

  const logout = () => {
    console.log('Logging out user');
    
    // Set explicit logout flag to prevent automatic session restoration
    sessionStorage.setItem('explicit_logout', 'true');
    
    // Clear saved session
    localStorage.removeItem('metamask_session');
    
    // Reset auth state
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
      isInitializing: false,
    });

    // Best-effort: revoke account permissions so next login prompts account selection
    try {
      if (window.ethereum) {
        // Fire and forget; do not await to keep logout synchronous for callers
        window.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }]
        }).catch((e: any) => {
          // Ignore errors; some wallets may not support this method
          console.warn('wallet_revokePermissions failed or not supported:', e);
        });
      }
    } catch (e) {
      // No-op
    }

    console.log('Logout completed - session will not auto-restore on next visit');
  };

  const clearError = () => {
    setAuthState(prev => ({
      ...prev,
      error: null,
    }));
  };

  const executeTransaction = async (transaction: any): Promise<string> => {
    if (!authState.user) {
      throw new Error('No active session');
    }

    if (!window.ethereum) {
      throw new Error('MetaMask is not available');
    }

    try {
      // Send transaction through MetaMask
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transaction]
      });
      
      return txHash;
    } catch (error) {
      throw new Error('Transaction failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return {
    authState,
    login,
    logout,
    clearError,
    executeTransaction,
    AuthContext,
  };
};
