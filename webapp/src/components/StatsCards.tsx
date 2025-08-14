import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { CryptoData } from '../types';

interface StatsCardsProps {
  cryptoData: CryptoData[];
  isLoading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ cryptoData, isLoading }) => {
  const totalMarketCap = cryptoData.reduce((sum, coin) => sum + coin.market_cap, 0);
  const totalVolume = cryptoData.reduce((sum, coin) => sum + coin.total_volume, 0);
  const avgChange = cryptoData.reduce((sum, coin) => sum + coin.price_change_percentage_24h, 0) / cryptoData.length;
  const gainers = cryptoData.filter(coin => coin.price_change_percentage_24h > 0).length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(value);
  };

  const stats = [
    {
      title: 'Total Market Cap',
      value: isLoading ? '...' : formatCurrency(totalMarketCap),
      icon: DollarSign,
      change: '+2.4%',
      positive: true
    },
    {
      title: 'Total Volume (24h)',
      value: isLoading ? '...' : formatCurrency(totalVolume),
      icon: BarChart3,
      change: '+5.2%',
      positive: true
    },
    {
      title: 'Average Change',
      value: isLoading ? '...' : `${avgChange.toFixed(2)}%`,
      icon: avgChange >= 0 ? TrendingUp : TrendingDown,
      change: avgChange >= 0 ? 'Bullish' : 'Bearish',
      positive: avgChange >= 0
    },
    {
      title: 'Gainers',
      value: isLoading ? '...' : `${gainers}/${cryptoData.length}`,
      icon: TrendingUp,
      change: 'Coins up',
      positive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <div className="flex items-center mt-2">
                {stat.positive ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${stat.positive ? 'bg-green-100' : 'bg-red-100'}`}>
              <stat.icon className={`w-6 h-6 ${stat.positive ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
