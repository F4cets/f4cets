// lib/getSolPrice.js
let cachedPrice = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 1000; // 15 seconds

export const fetchSolPrice = async () => {
  const now = Date.now();
  if (cachedPrice && now - lastFetchTime < CACHE_DURATION) {
    return cachedPrice;
  }

  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd', {
      headers: { 'accept': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    cachedPrice = data.solana.usd;
    lastFetchTime = now;
    return cachedPrice;
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    return cachedPrice || 200; // Fallback to last price or $200
  }
};