import React, { useEffect, useState } from 'react';
import { 
  User, 
  LogOut, 
  Wallet, 
  Send, 
  History, 
  Shield, 
  Copy, 
  Check,
  Zap,
  Globe,
  Lock,
  CreditCard,
  ArrowRightLeft,
  Plus,
  DollarSign,
  Clock,
  Banknote
} from 'lucide-react';
import { GlassCard } from './GlassCard';

interface Transaction {
  id: string;
  type: 'convert_to_pred' | 'sell_pred';
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  timestamp: Date;
  status: 'completed' | 'pending';
}

export const Dashboard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isTransacting, setIsTransacting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [predBalance, setPredBalance] = useState(0);
  const [bankBalance, setBankBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Amount choices
  const conversionAmounts = [0.1, 0.2, 0.5, 1.0]; // ETH amounts
  const sellAmounts = [10, 20, 50, 100]; // PRED amounts

  // Demo user data
  const demoUser = {
    name: 'Demo User',
    provider: 'google',
    picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    ethAddress: '0x14c444bf954e98d7c6f7c8a5b2e1f3a4d5c6b7a8e9f0a1b2c3d4e5f6a7b8c9d0'
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(demoUser.ethAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      status: 'completed'
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleTransaction = async () => {
    setIsTransacting(true);
    // Simulate transaction
    setTimeout(() => {
      setTxHash('0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b');
      setIsTransacting(false);
    }, 2000);
  };

  const handleConvertToToken = async (ethAmount: number) => {
    //window.location.href = 'https://stackbackend-nf32n8yiv-soojianlin-gmailcoms-projects.vercel.app/';
    setIsConverting(true);
    // Simulate conversion: ETH to PRED (1 ETH = 100 PRED) - unlimited conversion
    const predAmount = ethAmount * 100;
    setTimeout(() => {
      setPredBalance(prev => prev + predAmount);
      addTransaction({
        type: 'convert_to_pred',
        amount: ethAmount,
        fromCurrency: 'ETH',
        toCurrency: 'PRED'
      });
      setIsConverting(false);
      // Notify parent window (if embedded) about top-up
      try {
        const target = (window.opener || window.parent) as Window | null;
        if (target && target !== window) {
          console.log('Sending PRED_TOPUP message with delta:', predAmount);
          target.postMessage({ type: 'PRED_TOPUP', delta: predAmount }, '*');
        } else {
          console.log('No valid target window found for PRED_TOPUP message');
        }
      } catch (e) {
        console.error('Error sending PRED_TOPUP message:', e);
      }
    }, 2000);
    window.open('https://stackbackend-nf32n8yiv-soojianlin-gmailcoms-projects.vercel.app/', '_blank', 'noopener,noreferrer');
  };

  const handleSellPred = async (predAmount: number) => {
    if (predBalance < predAmount) {
      alert(`Insufficient PRED balance. You need at least ${predAmount} PRED to sell.`);
      return;
    }
    
    setIsSelling(true);
    // Simulate selling: PRED to USD (assuming 1 PRED = $2.5 USD)
    const usdAmount = predAmount * 2.5;
    setTimeout(() => {
      setPredBalance(prev => prev - predAmount);
      setBankBalance(prev => prev + usdAmount);
      addTransaction({
        type: 'sell_pred',
        amount: predAmount,
        fromCurrency: 'PRED',
        toCurrency: 'USD'
      });
      setIsSelling(false);
      // Notify parent window (if embedded) about deduction
      try {
        const target = (window.opener || window.parent) as Window | null;
        if (target && target !== window) {
          console.log('Sending PRED_SELL message with delta:', -predAmount);
          target.postMessage({ type: 'PRED_SELL', delta: -predAmount }, '*');
        } else {
          console.log('No valid target window found for PRED_SELL message');
        }
      } catch (e) {
        console.error('Error sending PRED_SELL message:', e);
      }
    }, 2000);
  };

  // Two-way balance sync with opener/parent
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!event || !event.data || typeof event.data !== 'object') return;
      const { type, balance } = event.data as { type?: string; balance?: number };
      if (type === 'PRED_BALANCE' && typeof balance === 'number' && !Number.isNaN(balance)) {
        console.log('Received balance update from main app:', balance);
        setPredBalance(balance);
      }
    };
    window.addEventListener('message', onMessage);
    
    // Ask parent/opener for current balance when page loads
    const requestBalance = () => {
      try {
        const target = (window.opener || window.parent) as Window | null;
        if (target && target !== window) {
          console.log('Requesting balance from main app');
          target.postMessage({ type: 'REQUEST_PRED_BALANCE' }, '*');
        }
      } catch (e) {
        console.warn('Could not request balance:', e);
      }
    };
    
    // Request balance immediately and also after a short delay
    requestBalance();
    const timer = setTimeout(requestBalance, 1000);
    
    return () => {
      window.removeEventListener('message', onMessage);
      clearTimeout(timer);
    };
  }, []);

  const handleBackToHome = () => {
    // Navigate to main app (port 5174) or configured URL
    const url = (import.meta as any).env?.VITE_MAIN_APP_URL || 'http://localhost:5174';
    try {
      window.location.href = url;
    } catch {
      // Fallback: if opened via window.open, try to close this tab
      if (window.opener) {
        try {
          window.close();
          return;
        } catch {}
      }
      // Last resort: try browser back
      window.history.back();
    }
  };

  const handleLogout = () => {
    // Demo logout - just refresh the page or show a message
    alert('Demo logout - page would redirect to login in a real app');
  };

  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'convert_to_pred': return 'Convert to PRED';
      case 'sell_pred': return 'Sell PRED';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen p-4">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100" />
      
      {/* Floating elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-teal-200/20 to-blue-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <GlassCard className="p-6 mb-6" blur="lg" opacity={0.15}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={demoUser.picture}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-white/50"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Welcome, {demoUser.name}
                </h1>
                <p className="text-gray-600 capitalize">
                  Authenticated via {demoUser.provider}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                title="Back to home page"
              >
                <ArrowRightLeft className="w-4 h-4" />
                Back to Home Page
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wallet Info */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6 mb-6" blur="lg" opacity={0.15}>
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Wallet</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">ETH Address</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-3 bg-gray-100/50 rounded-lg text-sm font-mono text-gray-800 backdrop-blur-sm">
                      {demoUser.ethAddress}
                    </code>
                    <button
                      onClick={copyAddress}
                      className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <GlassCard className="p-4" opacity={0.05}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{predBalance}</div>
                      <div className="text-sm text-gray-600">PRED Tokens</div>
                    </div>
                  </GlassCard>
                  <GlassCard className="p-4" opacity={0.05}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">${bankBalance.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Bank Balance</div>
                    </div>
                  </GlassCard>
                </div>

                {/* Token Conversion Section */}
                <div className="pt-4 border-t border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Convert ETH to PRED Tokens</h3>
                  <div className="p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl backdrop-blur-sm">
                    <div className="mb-3">
                      <div className="text-sm text-gray-600">Convert ETH to PRED tokens</div>
                      <div className="text-xs text-gray-500">
                        Unlimited ETH available | Rate: 1 ETH = 1000 PRED
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {conversionAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => handleConvertToToken(amount)}
                          disabled={isConverting}
                          className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                        >
                          {isConverting ? (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <ArrowRightLeft className="w-3 h-3" />
                          )}
                          {amount} ETH
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sell PRED Section */}
                <div className="pt-4 border-t border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Sell PRED Tokens</h3>
                  <div className="p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl backdrop-blur-sm">
                    <div className="mb-3">
                      <div className="text-sm text-gray-600">Sell PRED tokens for USD</div>
                      <div className="text-xs text-gray-500">
                        Available: {predBalance} PRED | Rate: 1 PRED = $2.5 USD
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {sellAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => handleSellPred(amount)}
                          disabled={isSelling || predBalance < amount}
                          className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                        >
                          {isSelling ? (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <DollarSign className="w-3 h-3" />
                          )}
                          {amount} PRED
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Transaction Demo */}
            <GlassCard className="p-6" blur="lg" opacity={0.15}>
              <div className="flex items-center gap-3 mb-4">
                <Send className="w-6 h-6 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-800">Demo Transaction</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                Execute a demo transaction using your zkLogin credentials
              </p>
              
              <button
                onClick={handleTransaction}
                disabled={isTransacting}
                className="w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isTransacting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Zap className="w-5 h-5" />
                )}
                {isTransacting ? 'Processing...' : 'Execute Demo Transaction'}
              </button>

              {txHash && (
                <GlassCard className="mt-4 p-4 bg-green-50/50 border-green-200/50" opacity={0.1}>
                  <p className="text-green-700 text-sm">
                    <strong>Transaction successful!</strong>
                  </p>
                  <code className="text-xs text-green-600 break-all">
                    {txHash}
                  </code>
                </GlassCard>
              )}
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* zkLogin Info */}
            <GlassCard className="p-6" blur="lg" opacity={0.15}>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-800">zkLogin Status</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Zero-Knowledge Proof Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">OAuth Identity Linked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">ETH Address Generated</span>
                </div>
              </div>
            </GlassCard>

            {/* Transaction History */}
            <GlassCard className="p-6" blur="lg" opacity={0.15}>
              <div className="flex items-center gap-3 mb-4">
                <History className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
              </div>
              
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <History className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="p-3 bg-white/30 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-800">
                          {formatTransactionType(tx.type)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {tx.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {tx.amount} {tx.fromCurrency} → {tx.toCurrency}
                        {tx.type === 'sell_pred' && (
                          <span className="text-green-600 font-medium">
                            {' '}(${(tx.amount * 2.5).toFixed(2)} USD)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 capitalize">{tx.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            {/* Features */}
            <GlassCard className="p-6" blur="lg" opacity={0.15}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-800">Privacy First</div>
                    <div className="text-xs text-gray-600">Your identity stays private</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-800">Web2 Login</div>
                    <div className="text-xs text-gray-600">Use familiar OAuth providers</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="font-medium text-gray-800">Fast Transactions</div>
                    <div className="text-xs text-gray-600">Powered by Ethereum blockchain</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};
