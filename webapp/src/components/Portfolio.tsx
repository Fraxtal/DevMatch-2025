import React from 'react';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { Portfolio as PortfolioType } from '../types';

const mockPortfolio: PortfolioType[] = [
  {
    id: '1',
    symbol: 'BTC',
    name: 'Bitcoin',
    amount: 0.5,
    avgPrice: 40000,
    currentPrice: 43250.50,
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=32&h=32&fit=crop&crop=center'
  },
  {
    id: '2',
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 2.5,
    avgPrice: 2800,
    currentPrice: 2650.75,
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=32&h=32&fit=crop&crop=center'
  },
  {
    id: '3',
    symbol: 'ADA',
    name: 'Cardano',
    amount: 1000,
    avgPrice: 0.45,
    currentPrice: 0.485,
    image: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=32&h=32&fit=crop&crop=center'
  }
];

export const Portfolio: React.FC = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 4 : 2
    }).format(value);
  };

  const calculatePnL = (item: PortfolioType) => {
    const currentValue = item.amount * item.currentPrice;
    const initialValue = item.amount * item.avgPrice;
    const pnl = currentValue - initialValue;
    const pnlPercentage = (pnl / initialValue) * 100;
    return { pnl, pnlPercentage };
  };

  const totalValue = mockPortfolio.reduce((sum, item) => sum + (item.amount * item.currentPrice), 0);
  const totalCost = mockPortfolio.reduce((sum, item) => sum + (item.amount * item.avgPrice), 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPercentage = (totalPnL / totalCost) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Portfolio</h2>
          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Asset</span>
          </button>
        </div>
        
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
            <div className="text-right">
              <div className={`flex items-center ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalPnL >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {formatCurrency(Math.abs(totalPnL))} ({Math.abs(totalPnLPercentage).toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {mockPortfolio.map((item) => {
            const { pnl, pnlPercentage } = calculatePnL(item);
            const currentValue = item.amount * item.currentPrice;

            return (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.amount} {item.symbol}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(currentValue)}</p>
                  <div className={`flex items-center text-sm ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {pnl >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(pnlPercentage).toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
