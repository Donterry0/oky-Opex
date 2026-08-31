export type MarketAsset = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  total_volume: number;
  market_cap: number;
};

const ASSET_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  BNB: 'binancecoin',
  XRP: 'ripple',
  DOGE: 'dogecoin',
  ADA: 'cardano',
  AVAX: 'avalanche-2',
};

export async function getMarketData(): Promise<MarketAsset[] | null> {
  const ids = Object.values(ASSET_IDS).join(',');

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h&sparkline=false`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as Array<{
      id: string;
      symbol: string;
      name: string;
      current_price: number;
      price_change_percentage_24h: number;
      high_24h: number;
      low_24h: number;
      total_volume: number;
      market_cap: number;
    }>;

    return data.map((item) => ({
      id: item.id,
      symbol: item.symbol.toUpperCase(),
      name: item.name,
      current_price: Number(item.current_price ?? 0),
      price_change_percentage_24h: Number(item.price_change_percentage_24h ?? 0),
      high_24h: Number(item.high_24h ?? 0),
      low_24h: Number(item.low_24h ?? 0),
      total_volume: Number(item.total_volume ?? 0),
      market_cap: Number(item.market_cap ?? 0),
    }));
  } catch {
    return null;
  }
}

export async function getAssetBySymbol(symbol: string): Promise<MarketAsset | null> {
  const data = await getMarketData();
  if (!data) return null;
  return data.find((item) => item.symbol === symbol.toUpperCase()) ?? null;
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}
