export interface User {
  id: string;
  email: string;
  name: string;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface Portfolio {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  image: string;
}
