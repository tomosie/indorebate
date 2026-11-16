/* Indorebate rebate rates - SINGLE source of truth for kalkulator-rebate.html and en/rebate-calculator.html.
   Edit only this file to add/change brokers, pairs and accounts.

   symbols (spec, used by spread-based accounts):
     contractSize  units per 1 lot
     pointSize     price value of 1 point as shown in the MT5 spread column (Exness gold = 0.001, so 250 points = $0.25)
     usdBaseRate   ONLY for USD-base pairs (USDJPY/USDCAD/USDCHF): approximate reference rate, converts the quote currency to USD
     example / maxPoints  sample spread for the hint / value above which the page warns about a possible typo
   accounts:
     model 'spread_pct': rebate per lot = pct% x (spread points x pointSize x contractSize [/ usdBaseRate])
     model 'fixed'     : rebate per lot = fixed[symbol].rebate (USD, already the client's rebate)
     unit 'USC' (cent accounts): same numbers, shown in cents. */
window.REBATE_RATES = {
  updated: '2026-11-16',
  brokers: {
    exness: {
      name: 'Exness',
      symbols: {
        XAUUSD: { label: 'XAUUSD (Gold)',   contractSize: 100,    pointSize: 0.001,   example: 250, maxPoints: 2000 },
        XAGUSD: { label: 'XAGUSD (Silver)', contractSize: 5000,   pointSize: 0.001,   example: 30,  maxPoints: 500 },
        EURUSD: { label: 'EURUSD',          contractSize: 100000, pointSize: 0.00001, example: 12,  maxPoints: 200 },
        GBPUSD: { label: 'GBPUSD',          contractSize: 100000, pointSize: 0.00001, example: 14,  maxPoints: 200 },
        AUDUSD: { label: 'AUDUSD',          contractSize: 100000, pointSize: 0.00001, example: 14,  maxPoints: 200 },
        NZDUSD: { label: 'NZDUSD',          contractSize: 100000, pointSize: 0.00001, example: 16,  maxPoints: 200 },
        USDJPY: { label: 'USDJPY',          contractSize: 100000, pointSize: 0.001,   example: 15,  maxPoints: 200, usdBaseRate: 158.7 },
        USDCAD: { label: 'USDCAD',          contractSize: 100000, pointSize: 0.00001, example: 15,  maxPoints: 200, usdBaseRate: 1.42 },
        USDCHF: { label: 'USDCHF',          contractSize: 100000, pointSize: 0.00001, example: 15,  maxPoints: 200, usdBaseRate: 0.826 },
        BTCUSD: { label: 'BTCUSD',          contractSize: 1,      pointSize: 0.01,    example: 640, maxPoints: 10000 }
      },
      labels: { XAUUSD247: 'XAUUSD247 (Gold 24/7)', BTCUSDT: 'BTCUSDT' },
      accounts: [
        { id: 'standard', label: 'Standard', unit: 'USD', model: 'spread_pct', pct: 32,
          pairs: ['XAUUSD','XAGUSD','EURUSD','GBPUSD','AUDUSD','NZDUSD','USDJPY','USDCAD','USDCHF','BTCUSD'] },
        { id: 'cent',     label: 'Cent',     unit: 'USC', model: 'spread_pct', pct: 32,
          pairs: ['XAUUSD','XAGUSD','EURUSD','GBPUSD','AUDUSD','NZDUSD','USDJPY','USDCAD','USDCHF','BTCUSD'] },
        { id: 'pro',      label: 'Pro',      unit: 'USD', model: 'spread_pct', pct: 20,
          pairs: ['XAUUSD','XAGUSD','EURUSD','GBPUSD','AUDUSD','NZDUSD','USDJPY','USDCAD','USDCHF','BTCUSD'] },
        { id: 'zero',     label: 'Zero',     unit: 'USD', model: 'fixed',
          fixed: { XAUUSD: 2.4, XAUUSD247: 2.4, XAGUSD: 14.8, EURUSD: 0.696, GBPUSD: 0.896, AUDUSD: 0.896, NZDUSD: 1.4,
                   USDJPY: 0.6, USDCAD: 1.0, USDCHF: 1.0, BTCUSD: 1.4, BTCUSDT: 1.4 } },
        { id: 'raw',      label: 'Raw',      unit: 'USD', model: 'fixed',
          fixed: { XAUUSD: 2.4, XAUUSD247: 2.4, XAGUSD: 14.8, EURUSD: 0.696, GBPUSD: 0.896, AUDUSD: 0.896, NZDUSD: 1.4,
                   USDJPY: 0.6, USDCAD: 1.0, USDCHF: 1.6, BTCUSD: 1.4, BTCUSDT: 1.4 } }
      ]
    }
  }
};
