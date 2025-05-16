// pages/api/solPrice.js
export default async function handler(req, res) {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd', {
        headers: { 'accept': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching SOL price:', error);
      res.status(500).json({ error: 'Failed to fetch SOL price', lastPrice: 200 });
    }
  }