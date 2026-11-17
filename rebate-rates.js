/* Indorebate rebate rates - SINGLE source of truth for kalkulator-rebate.html and en/rebate-calculator.html.
   Edit only this file to add/change brokers, pairs and accounts.

   symbols (spec, used by spread-based accounts):
     contractSize  units per 1 lot
     pointSize     price value of 1 point as shown in the MT5 spread column (Exness gold = 0.001 -> 250 points = $0.25; Headway gold = 0.01 -> 25 points = $0.25)
     usdBaseRate   ONLY for USD-base pairs (USDJPY/USDCAD/USDCHF): approximate reference rate, converts the quote currency to USD
     example / maxPoints  sample spread for the hint / value above which the page warns about a possible typo
   accounts:
     model 'spread_pct': rebate per lot = pct% x (spread points x pointSize x contractSize [/ usdBaseRate])
     model 'fixed'     : rebate per lot = fixed[symbol] (USD, already the client's rebate)
     unit 'USC' (cent accounts): same numbers, shown in cents.
     centMin (cent accounts only):
        { mode: 'threshold', usc: 1 }  minimum lots so the daily rebate is at least 1 cent (computed from the rebate per lot)
        { mode: 'lots', lots: 0.2 }    fixed minimum accumulated lots stated by the broker rule
   ui (per language): rules shown under the calculator, signup link, info page. */
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
        { id: 'cent',     label: 'Cent',     unit: 'USC', model: 'spread_pct', pct: 32, centMin: { mode: 'threshold', usc: 1 },
          pairs: ['XAUUSD','XAGUSD','EURUSD','GBPUSD','AUDUSD','NZDUSD','USDJPY','USDCAD','USDCHF','BTCUSD'] },
        { id: 'pro',      label: 'Pro',      unit: 'USD', model: 'spread_pct', pct: 20,
          pairs: ['XAUUSD','XAGUSD','EURUSD','GBPUSD','AUDUSD','NZDUSD','USDJPY','USDCAD','USDCHF','BTCUSD'] },
        { id: 'zero',     label: 'Zero',     unit: 'USD', model: 'fixed',
          fixed: { XAUUSD: 2.4, XAUUSD247: 2.4, XAGUSD: 14.8, EURUSD: 0.696, GBPUSD: 0.896, AUDUSD: 0.896, NZDUSD: 1.4,
                   USDJPY: 0.6, USDCAD: 1.0, USDCHF: 1.0, BTCUSD: 1.4, BTCUSDT: 1.4 } },
        { id: 'raw',      label: 'Raw',      unit: 'USD', model: 'fixed',
          fixed: { XAUUSD: 2.4, XAUUSD247: 2.4, XAGUSD: 14.8, EURUSD: 0.696, GBPUSD: 0.896, AUDUSD: 0.896, NZDUSD: 1.4,
                   USDJPY: 0.6, USDCAD: 1.0, USDCHF: 1.6, BTCUSD: 1.4, BTCUSDT: 1.4 } }
      ],
      ui: {
        id: { openUrl: 'https://one.toexness.com/boarding/sign-up/a/indorbt80?lng=id', infoUrl: '/rebate-exness.html',
              rules: ['Untuk akun Cent, akumulasi lot minimal 0.2 untuk mendapatkan rebate.',
                      'Trade dengan jumlah lot yang terlalu kecil pada akun Cent tidak mendapatkan rebate karena rebate di bawah $0.01.',
                      'Trading dengan margin bonus tidak mendapatkan rebate.',
                      'Rebate hanya diberikan ke akun trading di bawah jaringan INDOREBATE.'] },
        en: { openUrl: 'https://one.toexness.com/boarding/sign-up/a/indorbt80', infoUrl: '/en/rebate-exness.html',
              rules: ['For cent accounts, a minimum accumulated volume of 0.2 lots is required to earn rebates.',
                      'Trades with a lot size that is too small on Cent accounts earn no rebate because the rebate falls below $0.01.',
                      'Trading with margin bonus does not earn rebates.',
                      'Rebates only apply to trading accounts registered under the INDOREBATE network.'] }
      }
    },
    headway: {
      name: 'Headway',
      symbols: {
        XAUUSD: { label: 'XAUUSD (Gold)',   contractSize: 100,    pointSize: 0.01,    example: 25,  maxPoints: 500 },
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
      accounts: [
        { id: 'standard', label: 'Standard', unit: 'USD', model: 'spread_pct', pct: 33.6, pairs: ['XAUUSD','XAGUSD','EURUSD','GBPUSD','AUDUSD','NZDUSD','USDJPY','USDCAD','USDCHF','BTCUSD'] },
        { id: 'cent',     label: 'Cent',     unit: 'USC', model: 'spread_pct', pct: 33.6, centMin: { mode: 'threshold', usc: 1 }, pairs: ['XAUUSD','XAGUSD','EURUSD','GBPUSD','AUDUSD','NZDUSD','USDJPY','USDCAD','USDCHF','BTCUSD'] }
      ],
      ui: {
        id: { openUrl: 'https://headway.partners/user/signup?hwp=fee8fe', infoUrl: '/rebate-headway.html',
              rules: ['Trading dengan margin bonus tidak mendapatkan rebate.',
                      'Rebate hanya diberikan ke akun trading di bawah jaringan INDOREBATE.',
                      'Untuk akun Cent, akumulasi lot minimal 0.2 untuk mendapatkan rebate.'] },
        en: { openUrl: 'https://headway.partners/user/signup?hwp=fee8fe', infoUrl: '/en/rebate-headway.html',
              rules: ['Trading with margin bonus does not earn rebates.',
                      'Rebates are only paid to trading accounts under the INDOREBATE network.',
                      'For Cent accounts, a minimum accumulated volume of 0.2 lots is required to earn rebates.'] }
      }
    },
    tmgm: {
      name: 'TMGM',
      labels: { XAUUSD: 'XAUUSD (Gold)', EURUSD: 'EURUSD', GBPUSD: 'GBPUSD', AUDUSD: 'AUDUSD', NZDUSD: 'NZDUSD', USDJPY: 'USDJPY', USDCAD: 'USDCAD', USDCHF: 'USDCHF', BTCUSD: 'BTCUSD (Crypto)' },
      accounts: [
        { id: 'standard', label: 'Standard', unit: 'USD', model: 'fixed',
          fixed: { XAUUSD: 14.4, EURUSD: 6.4, GBPUSD: 6.4, AUDUSD: 6.4, NZDUSD: 6.4, USDJPY: 6.4, USDCAD: 6.4, USDCHF: 6.4, BTCUSD: 1.2 } },
        { id: 'classic', label: 'Classic', unit: 'USD', model: 'fixed',
          fixed: { XAUUSD: 3.2, EURUSD: 3.2, GBPUSD: 3.2, AUDUSD: 3.2, NZDUSD: 3.2, USDJPY: 3.2, USDCAD: 3.2, USDCHF: 3.2, BTCUSD: 1.2 } },
        { id: 'edge', label: 'Edge', unit: 'USD', model: 'fixed',
          fixed: { XAUUSD: 1.6, EURUSD: 1.6, GBPUSD: 1.6, AUDUSD: 1.6, NZDUSD: 1.6, USDJPY: 1.6, USDCAD: 1.6, USDCHF: 1.6, BTCUSD: 1.2 } },
        { id: 'standard-cent', label: 'Standard Cent', unit: 'USC', model: 'fixed', centMin: { mode: 'threshold', usc: 1 },
          fixed: { XAUUSD: 14.4, EURUSD: 6.4, GBPUSD: 6.4, AUDUSD: 6.4, NZDUSD: 6.4, USDJPY: 6.4, USDCAD: 6.4, USDCHF: 6.4, BTCUSD: 1.2 } },
        { id: 'classic-cent', label: 'Classic Cent', unit: 'USC', model: 'fixed', centMin: { mode: 'threshold', usc: 1 },
          fixed: { XAUUSD: 3.2, EURUSD: 3.2, GBPUSD: 3.2, AUDUSD: 3.2, NZDUSD: 3.2, USDJPY: 3.2, USDCAD: 3.2, USDCHF: 3.2, BTCUSD: 1.2 } },
        { id: 'edge-cent', label: 'Edge Cent', unit: 'USC', model: 'fixed', centMin: { mode: 'threshold', usc: 1 },
          fixed: { XAUUSD: 1.6, EURUSD: 1.6, GBPUSD: 1.6, AUDUSD: 1.6, NZDUSD: 1.6, USDJPY: 1.6, USDCAD: 1.6, USDCHF: 1.6, BTCUSD: 1.2 } }
      ],
      ui: {
        id: { openUrl: '/pindah-ib-tmgm.html', infoUrl: '/rebate-tmgm.html',
              rules: ['Untuk akun Cent, akumulasi lot minimal 0.2 untuk mendapatkan rebate.',
                      'Trading dengan akun bonus atau margin bonus tidak mendapatkan rebate.',
                      'Rebate hanya diberikan ke akun trading di bawah jaringan INDOREBATE.'] },
        en: { openUrl: '/en/switch-partner-tmgm.html', infoUrl: '/en/rebate-tmgm.html',
              rules: ['For cent accounts, a minimum accumulated volume of 0.2 lots is required to earn rebates.',
                      'Trading with a bonus account or margin bonus does not earn rebates.',
                      'Rebates are only paid to trading accounts under the INDOREBATE network.'] }
      }
    }
  }
};
