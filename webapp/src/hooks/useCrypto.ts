import { useState, useEffect } from 'react';
import { CryptoData } from '../types';

// Mock crypto data - in a real app, this would come from an API like CoinGecko
const mockCryptoData: CryptoData[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    current_price: 43250.50,
    price_change_percentage_24h: 2.45,
    market_cap: 847500000000,
    total_volume: 15200000000,
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=32&h=32&fit=crop&crop=center',
    sparkline_in_7d: {
      price: [42000, 41800, 42200, 43000, 42800, 43100, 43250]
    }
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    current_price: 2650.75,
    price_change_percentage_24h: -1.23,
    market_cap: 318500000000,
    total_volume: 8900000000,
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=32&h=32&fit=crop&crop=center',
    sparkline_in_7d: {
      price: [2700, 2680, 2620, 2590, 2630, 2670, 2650]
    }
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    current_price: 0.485,
    price_change_percentage_24h: 5.67,
    market_cap: 17200000000,
    total_volume: 420000000,
    image: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=32&h=32&fit=crop&crop=center',
    sparkline_in_7d: {
      price: [0.45, 0.46, 0.47, 0.48, 0.47, 0.48, 0.485]
    }
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    current_price: 98.45,
    price_change_percentage_24h: 3.21,
    market_cap: 42800000000,
    total_volume: 1200000000,
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=32&h=32&fit=crop&crop=center',
    sparkline_in_7d: {
      price: [95, 96, 97, 99, 98, 97, 98.45]
    }
  },
  {
    id: 'polkadot',
    symbol: 'DOT',
    name: 'Polkadot',
    current_price: 7.23,
    price_change_percentage_24h: -2.15,
    market_cap: 9100000000,
    total_volume: 180000000,
    image: 'https://images.unsplash.com/photo-1640826844110-c7c2b5e3e8b4?w=32&h=32&fit=crop&crop=center',
    sparkline_in_7d: {
      price: [7.5, 7.4, 7.3, 7.1, 7.2, 7.3, 7.23]
    }
  }
];

export const useCrypto = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCryptoData(mockCryptoData);
      setIsLoading(false);
    };

    fetchData();
    
    // Update data every 30 seconds
    const interval = setInterval(() => {
      setCryptoData(prev => prev.map(coin => ({
        ...coin,
        current_price: coin.current_price * (1 + (Math.random() - 0.5) * 0.02),
        price_change_percentage_24h: coin.price_change_percentage_24h + (Math.random() - 0.5) * 0.5
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return { cryptoData, isLoading };
};
