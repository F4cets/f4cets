// lib/getSolPrice.js
import { useState, useEffect } from 'react';

let cachedPrice = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 1000; // 15 seconds in milliseconds

export const fetchSolPrice = async () => {
  const now = Date.now();
  if (cachedPrice && now - lastFetchTime < CACHE_DURATION) {
    return cachedPrice;
  }

  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd', {
      headers: {
        'accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch SOL price');
    }
    const data = await response.json();
    cachedPrice = data.solana.usd;
    lastFetchTime = now;
    return cachedPrice;
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    return cachedPrice || 200; // Fallback to last known price or $200
  }
};

export const useSolPrice = () => {
  const [solPrice, setSolPrice] = useState(cachedPrice || 200);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const updatePrice = async () => {
      const price = await fetchSolPrice();
      setSolPrice(price);
      setFlash(true);
      setTimeout(() => setFlash(false), 500); // Flash for 0.5s
    };

    updatePrice(); // Initial fetch
    const interval = setInterval(updatePrice, CACHE_DURATION);

    return () => clearInterval(interval);
  }, []);

  return { solPrice, flash };
};