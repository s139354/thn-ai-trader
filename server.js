import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!process.env[key]) process.env[key] = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
  }
}

loadEnvFile();
const PORT = Number(process.env.PORT || 3000);
const openaiEnabled = Boolean(process.env.OPENAI_API_KEY);

const TIMEFRAME_CONFIG = {
  scalp: { range: "5d", interval: "15m", tvInterval: "15", label: "Scalp" },
  intraday: { range: "1mo", interval: "1h", tvInterval: "60", label: "Intraday" },
  swing: { range: "6mo", interval: "1d", tvInterval: "D", label: "Swing" },
  position: { range: "2y", interval: "1d", tvInterval: "D", label: "Position" }
};

const SYMBOL_ALIASES = new Map([
  ["GOLD", { yahoo: "GC=F", tv: "OANDA:XAUUSD", display: "XAUUSD", assetClass: "Commodity" }],
  ["XAU", { yahoo: "GC=F", tv: "OANDA:XAUUSD", display: "XAUUSD", assetClass: "Commodity" }],
  ["XAUUSD", { yahoo: "GC=F", tv: "OANDA:XAUUSD", display: "XAUUSD", assetClass: "Commodity" }],
  ["SILVER", { yahoo: "SI=F", tv: "OANDA:XAGUSD", display: "XAGUSD", assetClass: "Commodity" }],
  ["XAGUSD", { yahoo: "SI=F", tv: "OANDA:XAGUSD", display: "XAGUSD", assetClass: "Commodity" }],
  ["USOIL", { yahoo: "CL=F", tv: "TVC:USOIL", display: "USOIL", assetClass: "Commodity" }],
  ["WTI", { yahoo: "CL=F", tv: "TVC:USOIL", display: "USOIL", assetClass: "Commodity" }],
  ["BRENT", { yahoo: "BZ=F", tv: "TVC:UKOIL", display: "BRENT", assetClass: "Commodity" }],
  ["BTC", { yahoo: "BTC-USD", tv: "BINANCE:BTCUSDT", display: "BTCUSD", assetClass: "Crypto" }],
  ["BTCUSD", { yahoo: "BTC-USD", tv: "BINANCE:BTCUSDT", display: "BTCUSD", assetClass: "Crypto" }],
  ["BTCUSDT", { yahoo: "BTC-USD", tv: "BINANCE:BTCUSDT", display: "BTCUSDT", assetClass: "Crypto" }],
  ["ETH", { yahoo: "ETH-USD", tv: "BINANCE:ETHUSDT", display: "ETHUSD", assetClass: "Crypto" }],
  ["ETHUSD", { yahoo: "ETH-USD", tv: "BINANCE:ETHUSDT", display: "ETHUSD", assetClass: "Crypto" }],
  ["ETHUSDT", { yahoo: "ETH-USD", tv: "BINANCE:ETHUSDT", display: "ETHUSDT", assetClass: "Crypto" }],
  ["SPX", { yahoo: "^GSPC", tv: "SP:SPX", display: "SPX", assetClass: "Index" }],
  ["NAS100", { yahoo: "^IXIC", tv: "OANDA:NAS100USD", display: "NAS100", assetClass: "Index" }],
  ["US30", { yahoo: "^DJI", tv: "OANDA:US30USD", display: "US30", assetClass: "Index" }]
]);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number.isFinite(Number(value)) ? Number(value) : min));
}

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round(value, digits = 2) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}

function normalizeSymbol(rawSymbol = "EURUSD") {
  let raw = String(rawSymbol || "EURUSD").trim().toUpperCase();
  raw = raw.replace(/\s+/g, "");
  let tvPrefix = "";
  if (raw.includes(":")) {
    const parts = raw.split(":");
    tvPrefix = parts[0];
    raw = parts[1] || raw;
  }

  if (SYMBOL_ALIASES.has(raw)) return SYMBOL_ALIASES.get(raw);
  if (raw.endsWith("=X")) {
    const pair = raw.replace("=X", "");
    return { yahoo: raw, tv: `FX:${pair}`, display: pair, assetClass: "Forex" };
  }
  if (/^[A-Z]{6}$/.test(raw)) {
    const base = raw.slice(0, 3);
    const quote = raw.slice(3, 6);
    const cryptoBases = new Set(["BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "DOG", "LTC"]);
    if (cryptoBases.has(base) && ["USD", "USDT"].includes(quote)) {
      return { yahoo: `${base}-USD`, tv: `BINANCE:${base}USDT`, display: raw, assetClass: "Crypto" };
    }
    return { yahoo: `${base}${quote}=X`, tv: tvPrefix ? `${tvPrefix}:${raw}` : `FX:${raw}`, display: raw, assetClass: "Forex" };
  }
  if (/^[A-Z]{3,5}USDT$/.test(raw)) {
    const base = raw.replace("USDT", "");
    return { yahoo: `${base}-USD`, tv: `BINANCE:${raw}`, display: raw, assetClass: "Crypto" };
  }
  return { yahoo: raw, tv: raw, display: raw, assetClass: "Stock" };
}

async function fetchYahooCandles(symbolInfo, timeframe = "intraday") {
  const cfg = TIMEFRAME_CONFIG[String(timeframe || "intraday").toLowerCase()] || TIMEFRAME_CONFIG.intraday;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbolInfo.yahoo)}?range=${cfg.range}&interval=${cfg.interval}&includePrePost=false&events=div%2Csplits`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8500);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "THN-AI-Trader/2.0"
      }
    });
    if (!response.ok) throw new Error(`Yahoo returned HTTP ${response.status}`);
    const data = await response.json();
    const result = data?.chart?.result?.[0];
    const quote = result?.indicators?.quote?.[0];
    const timestamps = result?.timestamp || [];
    if (!quote || timestamps.length < 40) throw new Error("Not enough candle data returned.");
    const candles = timestamps.map((t, i) => ({
      time: t * 1000,
      open: quote.open?.[i],
      high: quote.high?.[i],
      low: quote.low?.[i],
      close: quote.close?.[i],
      volume: quote.volume?.[i] || 0
    })).filter(c => [c.open, c.high, c.low, c.close].every(v => Number.isFinite(Number(v))));
    if (candles.length < 40) throw new Error("Not enough clean candles returned.");
    return {
      candles,
      source: "Yahoo Finance market data",
      currency: result?.meta?.currency || "USD",
      exchangeName: result?.meta?.exchangeName || "Market",
      marketTime: result?.meta?.regularMarketTime ? result.meta.regularMarketTime * 1000 : Date.now(),
      interval: cfg.interval,
      range: cfg.range,
      tvInterval: cfg.tvInterval
    };
  } finally {
    clearTimeout(timeout);
  }
}

function syntheticCandles(symbolInfo, timeframe = "intraday") {
  const now = Date.now();
  const cfg = TIMEFRAME_CONFIG[String(timeframe || "intraday").toLowerCase()] || TIMEFRAME_CONFIG.intraday;
  const count = cfg.interval.includes("m") ? 160 : 220;
  const step = cfg.interval.includes("m") ? 15 * 60 * 1000 : cfg.interval.includes("h") ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const baseMap = { Forex: 1.08, Crypto: 68000, Commodity: symbolInfo.display.includes("XAU") ? 2340 : 80, Index: 5200, Stock: 180 };
  let price = baseMap[symbolInfo.assetClass] || 100;
  const candles = [];
  for (let i = 0; i < count; i++) {
    const wave = Math.sin(i / 9) * price * 0.002;
    const drift = i * price * 0.000012;
    const noise = Math.sin(i * 12.9898) * price * 0.0012;
    const open = price + wave + noise + drift;
    const close = open + Math.sin((i + 3) / 7) * price * 0.0015;
    const high = Math.max(open, close) + price * (0.001 + Math.abs(Math.sin(i)) * 0.0012);
    const low = Math.min(open, close) - price * (0.001 + Math.abs(Math.cos(i)) * 0.0012);
    candles.push({ time: now - (count - i) * step, open, high, low, close, volume: Math.round(100000 + Math.abs(Math.sin(i)) * 500000) });
    price = close;
  }
  return { candles, source: "Demo synthetic market data fallback", currency: "USD", exchangeName: "Demo", marketTime: now, interval: cfg.interval, range: cfg.range, tvInterval: cfg.tvInterval };
}

async function getMarketData(rawSymbol, timeframe) {
  const symbolInfo = normalizeSymbol(rawSymbol);
  try {
    const data = await fetchYahooCandles(symbolInfo, timeframe);
    return { symbolInfo, ...data, warning: null };
  } catch (error) {
    const data = syntheticCandles(symbolInfo, timeframe);
    return { symbolInfo, ...data, warning: `Live market data could not be loaded (${error.message}). Demo data was used so the app remains usable.` };
  }
}

function values(candles, key) {
  return candles.map(c => Number(c[key])).filter(Number.isFinite);
}

function sma(arr, period) {
  if (arr.length < period) return null;
  return arr.slice(-period).reduce((a, b) => a + b, 0) / period;
}

function emaSeries(arr, period) {
  if (arr.length < period) return [];
  const k = 2 / (period + 1);
  const out = [];
  let prev = arr.slice(0, period).reduce((a, b) => a + b, 0) / period;
  out.push(prev);
  for (let i = period; i < arr.length; i++) {
    prev = arr[i] * k + prev * (1 - k);
    out.push(prev);
  }
  return out;
}

function ema(arr, period) {
  const s = emaSeries(arr, period);
  return s.length ? s[s.length - 1] : null;
}

function standardDeviation(arr) {
  if (!arr.length) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((sum, x) => sum + (x - mean) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

function rsi(closes, period = 14) {
  if (closes.length < period + 1) return null;
  let gains = 0;
  let losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }
  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - 100 / (1 + rs);
}

function atr(candles, period = 14) {
  if (candles.length < period + 1) return null;
  const trs = [];
  for (let i = candles.length - period; i < candles.length; i++) {
    const current = candles[i];
    const prev = candles[i - 1];
    trs.push(Math.max(
      current.high - current.low,
      Math.abs(current.high - prev.close),
      Math.abs(current.low - prev.close)
    ));
  }
  return trs.reduce((a, b) => a + b, 0) / trs.length;
}

function macd(closes) {
  if (closes.length < 35) return { macd: null, signal: null, histogram: null };
  const ema12 = emaSeries(closes, 12);
  const ema26 = emaSeries(closes, 26);
  const offset = ema12.length - ema26.length;
  const line = ema26.map((v, i) => ema12[i + offset] - v);
  const signalSeries = emaSeries(line, 9);
  const macdValue = line[line.length - 1];
  const signal = signalSeries[signalSeries.length - 1];
  return { macd: macdValue, signal, histogram: macdValue - signal };
}

function bollinger(closes, period = 20, mult = 2) {
  if (closes.length < period) return { upper: null, middle: null, lower: null, widthPct: null };
  const slice = closes.slice(-period);
  const middle = sma(closes, period);
  const sd = standardDeviation(slice);
  return { upper: middle + sd * mult, middle, lower: middle - sd * mult, widthPct: middle ? (sd * mult * 2 / middle) * 100 : null };
}

function linearRegressionSlope(arr) {
  const n = arr.length;
  if (n < 2) return 0;
  const xMean = (n - 1) / 2;
  const yMean = arr.reduce((a, b) => a + b, 0) / n;
  let nume = 0;
  let deno = 0;
  arr.forEach((y, x) => {
    nume += (x - xMean) * (y - yMean);
    deno += (x - xMean) ** 2;
  });
  return deno ? nume / deno : 0;
}

function detectStructure(candles) {
  const highs = values(candles, "high");
  const lows = values(candles, "low");
  const closes = values(candles, "close");
  const lastClose = closes[closes.length - 1];
  const recentHighs = [];
  const recentLows = [];
  for (let i = Math.max(2, candles.length - 90); i < candles.length - 2; i++) {
    if (candles[i].high > candles[i - 1].high && candles[i].high > candles[i + 1].high) recentHighs.push(candles[i].high);
    if (candles[i].low < candles[i - 1].low && candles[i].low < candles[i + 1].low) recentLows.push(candles[i].low);
  }
  const lowerSupports = recentLows.filter(v => v < lastClose).sort((a, b) => b - a);
  const higherRes = recentHighs.filter(v => v > lastClose).sort((a, b) => a - b);
  const support = lowerSupports[0] || Math.min(...lows.slice(-60));
  const resistance = higherRes[0] || Math.max(...highs.slice(-60));
  const last = candles[candles.length - 1];
  const previousLows = lows.slice(-25, -2);
  const previousHighs = highs.slice(-25, -2);
  const sweepDown = last.low < Math.min(...previousLows) && last.close > support;
  const sweepUp = last.high > Math.max(...previousHighs) && last.close < resistance;
  const last10 = candles.slice(-10);
  const higherHighs = last10.filter((c, i, arr) => i > 0 && c.high > arr[i - 1].high).length;
  const higherLows = last10.filter((c, i, arr) => i > 0 && c.low > arr[i - 1].low).length;
  const lowerHighs = last10.filter((c, i, arr) => i > 0 && c.high < arr[i - 1].high).length;
  const lowerLows = last10.filter((c, i, arr) => i > 0 && c.low < arr[i - 1].low).length;
  const trendStructure = higherHighs + higherLows > lowerHighs + lowerLows ? "Bullish structure" : lowerHighs + lowerLows > higherHighs + higherLows ? "Bearish structure" : "Range structure";
  return { support, resistance, sweepDown, sweepUp, trendStructure, recentHigh: Math.max(...highs.slice(-60)), recentLow: Math.min(...lows.slice(-60)) };
}

function addScore(item, amount, reason) {
  item.directionScore += amount;
  if (reason) item.reasons.push(reason);
}

function schoolTemplate(name) {
  return { name, bias: "NEUTRAL", score: 50, directionScore: 0, reasons: [], warnings: [] };
}

function finalizeSchool(item) {
  item.score = clamp(50 + Math.abs(item.directionScore) * 0.55, 35, 96);
  item.bias = item.directionScore > 10 ? "BULLISH" : item.directionScore < -10 ? "BEARISH" : "NEUTRAL";
  item.score = round(item.score, 0);
  item.directionScore = round(item.directionScore, 2);
  return item;
}

function buildAnalysis(market, request = {}) {
  const candles = market.candles;
  const closes = values(candles, "close");
  const highs = values(candles, "high");
  const lows = values(candles, "low");
  const last = candles[candles.length - 1];
  const price = last.close;
  const symbol = market.symbolInfo.display;
  const timeframe = String(request.timeframe || "intraday").toLowerCase();
  const accountBalance = Math.max(1, num(request.accountBalance, 10000));
  const riskPct = clamp(num(request.riskPct, 1), 0.05, 10);
  const desiredRR = clamp(num(request.rewardRisk, 2), 1, 5);
  const atr14 = atr(candles, 14) || Math.max(price * 0.005, 0.0001);
  const atrPct = (atr14 / price) * 100;
  const ema20 = ema(closes, 20);
  const ema50 = ema(closes, 50);
  const ema200 = ema(closes, Math.min(200, Math.max(50, closes.length - 1)));
  const sma20 = sma(closes, 20);
  const rsi14 = rsi(closes, 14);
  const macdData = macd(closes);
  const bb = bollinger(closes);
  const structure = detectStructure(candles);
  const returns = [];
  for (let i = 1; i < closes.length; i++) returns.push((closes[i] - closes[i - 1]) / closes[i - 1]);
  const retMean = returns.slice(-60).reduce((a, b) => a + b, 0) / Math.max(1, returns.slice(-60).length);
  const retStd = standardDeviation(returns.slice(-60));
  const zScore = retStd ? (returns[returns.length - 1] - retMean) / retStd : 0;
  const slope50 = linearRegressionSlope(closes.slice(-50));
  const slopePct = (slope50 / price) * 100;
  const volatilityLabel = atrPct > 3 ? "Extreme" : atrPct > 1.4 ? "High" : atrPct > 0.45 ? "Normal" : "Low";

  const technical = schoolTemplate("Technical Analysis");
  if (ema20 && ema50 && ema20 > ema50) addScore(technical, 24, "EMA 20 is above EMA 50, confirming bullish trend alignment.");
  if (ema20 && ema50 && ema20 < ema50) addScore(technical, -24, "EMA 20 is below EMA 50, confirming bearish trend alignment.");
  if (ema200 && price > ema200) addScore(technical, 10, "Price is above the long-term EMA filter.");
  if (ema200 && price < ema200) addScore(technical, -10, "Price is below the long-term EMA filter.");
  if (macdData.histogram > 0) addScore(technical, 14, "MACD histogram is positive.");
  if (macdData.histogram < 0) addScore(technical, -14, "MACD histogram is negative.");
  if (rsi14 >= 52 && rsi14 <= 68) addScore(technical, 12, "RSI supports bullish momentum without being extremely overbought.");
  if (rsi14 <= 48 && rsi14 >= 32) addScore(technical, -12, "RSI supports bearish momentum without being extremely oversold.");
  if (rsi14 > 72) technical.warnings.push("RSI is overbought; avoid late buying without confirmation.");
  if (rsi14 < 28) technical.warnings.push("RSI is oversold; avoid late selling without confirmation.");
  finalizeSchool(technical);

  const priceAction = schoolTemplate("Price Action");
  const range = Math.max(structure.resistance - structure.support, atr14);
  const rangePosition = clamp((price - structure.support) / range, 0, 1);
  if (price > structure.resistance) addScore(priceAction, 24, "Price is breaking above the active resistance area.");
  else if (price < structure.support) addScore(priceAction, -24, "Price is breaking below the active support area.");
  else if (rangePosition < 0.28) addScore(priceAction, 10, "Price is close to support, which can favor bullish reaction setups.");
  else if (rangePosition > 0.72) addScore(priceAction, -10, "Price is close to resistance, which can favor bearish rejection setups.");
  if (structure.trendStructure === "Bullish structure") addScore(priceAction, 14, "Recent candles show higher-high/higher-low pressure.");
  if (structure.trendStructure === "Bearish structure") addScore(priceAction, -14, "Recent candles show lower-high/lower-low pressure.");
  if (last.close > last.open && (last.close - last.open) > atr14 * 0.25) addScore(priceAction, 7, "Latest candle closed with bullish body strength.");
  if (last.close < last.open && (last.open - last.close) > atr14 * 0.25) addScore(priceAction, -7, "Latest candle closed with bearish body strength.");
  finalizeSchool(priceAction);

  const smartMoney = schoolTemplate("Smart Money Concepts");
  if (structure.sweepDown) addScore(smartMoney, 22, "Possible sell-side liquidity sweep followed by close back above support.");
  if (structure.sweepUp) addScore(smartMoney, -22, "Possible buy-side liquidity sweep followed by close back below resistance.");
  if (price > structure.support && price < structure.resistance) smartMoney.reasons.push("Price is inside the dealing range; wait for premium/discount confirmation.");
  if (rangePosition < 0.5) addScore(smartMoney, 7, "Price is in the lower half of the recent range, closer to discount.");
  if (rangePosition > 0.5) addScore(smartMoney, -7, "Price is in the upper half of the recent range, closer to premium.");
  finalizeSchool(smartMoney);

  const quant = schoolTemplate("Quantitative Model");
  if (slopePct > 0.01) addScore(quant, 18, "Regression slope is positive over the recent sample.");
  if (slopePct < -0.01) addScore(quant, -18, "Regression slope is negative over the recent sample.");
  if (zScore > 1.5) { addScore(quant, -10, "Latest return is statistically stretched upward."); quant.warnings.push("Upside move is statistically extended; pullback risk is higher."); }
  if (zScore < -1.5) { addScore(quant, 10, "Latest return is statistically stretched downward."); quant.warnings.push("Downside move is statistically extended; bounce risk is higher."); }
  if (bb.upper && price > bb.upper) quant.warnings.push("Price is above the upper Bollinger band; breakout or mean reversion must be confirmed.");
  if (bb.lower && price < bb.lower) quant.warnings.push("Price is below the lower Bollinger band; breakdown or mean reversion must be confirmed.");
  if (volatilityLabel === "High" || volatilityLabel === "Extreme") quant.warnings.push(`${volatilityLabel} volatility regime detected from ATR.`);
  finalizeSchool(quant);

  const macro = schoolTemplate("Fundamental / Sentiment Context");
  macro.reasons.push("No paid institutional news feed is connected, so this module stays conservative and uses market-data context only.");
  if (market.symbolInfo.assetClass === "Forex") macro.reasons.push("For forex pairs, confirm central-bank calendar, CPI, NFP, PMI, and rate expectations before execution.");
  if (market.symbolInfo.assetClass === "Commodity") macro.reasons.push("For commodities, confirm USD strength, real yields, inventory data, and geopolitical risk.");
  if (market.symbolInfo.assetClass === "Crypto") macro.reasons.push("For crypto, confirm BTC dominance, funding, ETF flows, and broad risk sentiment.");
  if (request.sentiment === "bullish") addScore(macro, 12, "User-provided sentiment context is bullish.");
  if (request.sentiment === "bearish") addScore(macro, -12, "User-provided sentiment context is bearish.");
  finalizeSchool(macro);

  const weights = {
    "Technical Analysis": 0.28,
    "Price Action": 0.24,
    "Smart Money Concepts": 0.18,
    "Quantitative Model": 0.20,
    "Fundamental / Sentiment Context": 0.10
  };
  const schools = [technical, priceAction, smartMoney, quant, macro];
  const consensusScore = schools.reduce((sum, s) => sum + s.directionScore * weights[s.name], 0);
  const absConsensus = Math.abs(consensusScore);
  let decision = "WAIT";
  if (consensusScore >= 14) decision = "BUY";
  if (consensusScore <= -14) decision = "SELL";

  const stopMultiplier = timeframe === "scalp" ? 1.1 : timeframe === "intraday" ? 1.35 : timeframe === "swing" ? 1.6 : 1.9;
  const minimumStop = price * (market.symbolInfo.assetClass === "Forex" ? 0.0012 : market.symbolInfo.assetClass === "Crypto" ? 0.008 : 0.0035);
  const stopDistance = Math.max(atr14 * stopMultiplier, minimumStop);
  let entry = price;
  let stopLoss = null;
  let targets = [];
  if (decision === "BUY") {
    stopLoss = Math.min(entry - stopDistance, structure.support - atr14 * 0.12);
    const riskPerUnit = Math.abs(entry - stopLoss);
    targets = [entry + riskPerUnit * desiredRR, entry + riskPerUnit * desiredRR * 1.5, entry + riskPerUnit * desiredRR * 2.2];
  } else if (decision === "SELL") {
    stopLoss = Math.max(entry + stopDistance, structure.resistance + atr14 * 0.12);
    const riskPerUnit = Math.abs(entry - stopLoss);
    targets = [entry - riskPerUnit * desiredRR, entry - riskPerUnit * desiredRR * 1.5, entry - riskPerUnit * desiredRR * 2.2];
  }
  const riskPerUnit = stopLoss ? Math.abs(entry - stopLoss) : null;
  const riskAmount = accountBalance * (riskPct / 100);
  const units = riskPerUnit ? riskAmount / riskPerUnit : 0;
  const forexLots = market.symbolInfo.assetClass === "Forex" ? units / 100000 : null;
  const exposure = units * entry;
  const exposurePct = (exposure / accountBalance) * 100;
  const breakEvenWinRate = 100 / (1 + desiredRR);
  const riskWarnings = [];
  if (riskPct > 2) riskWarnings.push("Risk per trade is above 2%; professional risk plans usually keep single-trade risk lower.");
  if (volatilityLabel === "Extreme") riskWarnings.push("ATR is extreme; reduce size or wait for volatility to normalize.");
  if (decision === "WAIT") riskWarnings.push("Consensus is not strong enough for a directional signal; waiting is the professional decision.");
  if (exposurePct > 500) riskWarnings.push("Nominal exposure is high relative to account size. Confirm broker contract value and margin before trading.");
  if (market.warning) riskWarnings.unshift(market.warning);

  const confidence = round(clamp(46 + absConsensus * 1.28 + (schools.filter(s => s.bias !== "NEUTRAL").length * 2.5) - (riskWarnings.length * 3.2), 18, 94), 0);
  const grade = confidence >= 82 ? "A+" : confidence >= 74 ? "A" : confidence >= 66 ? "B" : confidence >= 56 ? "C" : "D";
  const consensusLabel = consensusScore > 14 ? "BULLISH" : consensusScore < -14 ? "BEARISH" : "NEUTRAL";

  const scenarios = [
    { name: "Conservative", riskPct: Math.max(0.25, riskPct * 0.5), rr: Math.max(1.2, desiredRR * 0.75) },
    { name: "Balanced", riskPct, rr: desiredRR },
    { name: "Aggressive", riskPct: Math.min(5, riskPct * 1.5), rr: Math.min(5, desiredRR * 1.35) }
  ].map(s => ({
    ...s,
    riskAmount: round(accountBalance * (s.riskPct / 100), 2),
    potentialProfit: round(accountBalance * (s.riskPct / 100) * s.rr, 2),
    breakEvenWinRate: round(100 / (1 + s.rr), 2)
  }));

  const backtest = simulateBacktest({ confidence, rr: desiredRR, riskPct, accountBalance, consensusScore });
  const allReasons = schools.flatMap(s => s.reasons.slice(0, 2));
  const allWarnings = [...riskWarnings, ...schools.flatMap(s => s.warnings)].filter(Boolean);

  return {
    appName: "THN AI Trader",
    source: openaiEnabled ? "THN Local AI Engine + OpenAI narrative enhancement available" : "THN Local AI Engine",
    marketDataSource: market.source,
    symbol,
    yahooSymbol: market.symbolInfo.yahoo,
    tvSymbol: market.symbolInfo.tv,
    assetClass: market.symbolInfo.assetClass,
    timeframe,
    interval: market.interval,
    range: market.range,
    tvInterval: market.tvInterval,
    exchangeName: market.exchangeName,
    currency: market.currency,
    marketTime: market.marketTime,
    decision,
    consensusLabel,
    consensusScore: round(consensusScore, 2),
    confidence,
    grade,
    entry: round(entry, 6),
    stopLoss: stopLoss ? round(stopLoss, 6) : null,
    targets: targets.map(t => round(t, 6)),
    risk: {
      accountBalance: round(accountBalance, 2),
      riskPct: round(riskPct, 2),
      riskAmount: round(riskAmount, 2),
      riskPerUnit: riskPerUnit ? round(riskPerUnit, 6) : null,
      units: round(units, 4),
      forexLots: forexLots ? round(forexLots, 4) : null,
      exposure: round(exposure, 2),
      exposurePct: round(exposurePct, 2),
      rewardRisk: round(desiredRR, 2),
      breakEvenWinRate: round(breakEvenWinRate, 2)
    },
    indicators: {
      price: round(price, 6),
      open: round(last.open, 6),
      high: round(last.high, 6),
      low: round(last.low, 6),
      ema20: round(ema20, 6),
      ema50: round(ema50, 6),
      ema200: round(ema200, 6),
      sma20: round(sma20, 6),
      rsi14: round(rsi14, 2),
      atr14: round(atr14, 6),
      atrPct: round(atrPct, 3),
      macd: round(macdData.macd, 6),
      macdSignal: round(macdData.signal, 6),
      macdHistogram: round(macdData.histogram, 6),
      bollingerUpper: round(bb.upper, 6),
      bollingerMiddle: round(bb.middle, 6),
      bollingerLower: round(bb.lower, 6),
      bollingerWidthPct: round(bb.widthPct, 3),
      returnZScore: round(zScore, 2),
      slopePct: round(slopePct, 5),
      volatilityLabel
    },
    structure: {
      support: round(structure.support, 6),
      resistance: round(structure.resistance, 6),
      recentHigh: round(structure.recentHigh, 6),
      recentLow: round(structure.recentLow, 6),
      trendStructure: structure.trendStructure,
      possibleSellSideSweep: structure.sweepDown,
      possibleBuySideSweep: structure.sweepUp,
      rangePosition: round(rangePosition * 100, 2)
    },
    schools,
    reasons: allReasons.slice(0, 9),
    warnings: allWarnings.length ? allWarnings.slice(0, 10) : ["No critical warning from the supplied data, but execution must still follow risk rules."],
    checklist: buildChecklist({ decision, riskPct, volatilityLabel, confidence, market, rsi14, stopLoss }),
    scenarios,
    backtest,
    candles: candles.slice(-160).map(c => ({ time: c.time, open: round(c.open, 6), high: round(c.high, 6), low: round(c.low, 6), close: round(c.close, 6), volume: c.volume })),
    aiNarrative: buildNarrative({ symbol, decision, confidence, grade, consensusLabel, schools, allWarnings, timeframe, market })
  };
}

function buildChecklist({ decision, riskPct, volatilityLabel, confidence, market, rsi14, stopLoss }) {
  return [
    { item: "Directional consensus", status: decision === "WAIT" ? "WAIT" : "PASS", detail: decision === "WAIT" ? "No trade until stronger confluence." : "Signal has directional consensus." },
    { item: "Risk per trade", status: riskPct <= 2 ? "PASS" : "WARNING", detail: `${riskPct}% risk selected.` },
    { item: "Volatility regime", status: volatilityLabel === "Extreme" ? "WARNING" : "PASS", detail: `${volatilityLabel} ATR regime.` },
    { item: "RSI safety", status: rsi14 > 25 && rsi14 < 75 ? "PASS" : "WARNING", detail: `RSI ${round(rsi14, 2)}.` },
    { item: "Stop-loss present", status: stopLoss ? "PASS" : "WAIT", detail: stopLoss ? "SL calculated from ATR and structure." : "No SL because no trade signal." },
    { item: "Market data", status: market.warning ? "WARNING" : "PASS", detail: market.source }
  ];
}

function simulateBacktest({ confidence, rr, riskPct, accountBalance, consensusScore }) {
  const trades = 60;
  const expectedWinRate = clamp(38 + confidence * 0.38 + Math.abs(consensusScore) * 0.12, 38, 76);
  let balance = accountBalance;
  let peak = accountBalance;
  let maxDrawdown = 0;
  let wins = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  for (let i = 0; i < trades; i++) {
    const pseudo = Math.abs(Math.sin((i + 1) * 19.131 + confidence * 0.071 + consensusScore) * 10000) % 1;
    const risk = balance * (riskPct / 100);
    if (pseudo * 100 < expectedWinRate) {
      const profit = risk * rr * (0.65 + pseudo * 0.58);
      balance += profit;
      grossProfit += profit;
      wins++;
    } else {
      const loss = risk * (0.78 + pseudo * 0.42);
      balance -= loss;
      grossLoss += loss;
    }
    peak = Math.max(peak, balance);
    maxDrawdown = Math.max(maxDrawdown, ((peak - balance) / peak) * 100);
  }
  return {
    trades,
    wins,
    losses: trades - wins,
    estimatedWinRate: round((wins / trades) * 100, 1),
    estimatedReturnPct: round(((balance - accountBalance) / accountBalance) * 100, 2),
    endingBalance: round(balance, 2),
    maxDrawdownPct: round(maxDrawdown, 2),
    profitFactor: round(grossProfit / Math.max(1, grossLoss), 2),
    note: "Deterministic stress simulator based on the current signal profile; not a guarantee of future performance."
  };
}

function buildNarrative({ symbol, decision, confidence, grade, consensusLabel, schools, allWarnings, timeframe, market }) {
  const leaders = schools
    .filter(s => s.bias !== "NEUTRAL")
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => `${s.name}: ${s.bias} (${s.score}/100)`)
    .join("; ");
  const caution = allWarnings.length ? allWarnings[0] : "No major internal warning was detected.";
  return `THN AI Trader classifies ${symbol} as ${decision} on the ${timeframe} profile with ${confidence}% confidence and grade ${grade}. The multi-school consensus is ${consensusLabel}. Strongest modules: ${leaders || "no directional module dominance"}. Data source: ${market.source}. Main caution: ${caution} This output is an analytical decision-support report, not financial advice.`;
}

function extractJson(text) {
  if (!text) return null;
  const match = String(text).match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

async function enhanceWithOpenAI(analysis) {
  if (!openaiEnabled) return analysis;
  try {
    const prompt = `You are the senior analyst layer inside THN AI Trader. Improve only the executive narrative, action plan, and risk warnings. Do not change numeric trading levels or promise profit. Return compact valid JSON with keys: aiNarrative, professionalActionPlan, extraWarnings. Baseline analysis: ${JSON.stringify({ symbol: analysis.symbol, decision: analysis.decision, confidence: analysis.confidence, grade: analysis.grade, schools: analysis.schools, indicators: analysis.indicators, structure: analysis.structure, risk: analysis.risk, warnings: analysis.warnings })}`;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        temperature: 0.25,
        messages: [
          { role: "system", content: "Return valid JSON only. Be practical, cautious, and professional. This is educational analysis, not financial advice." },
          { role: "user", content: prompt }
        ]
      })
    });
    if (!response.ok) throw new Error(`OpenAI HTTP ${response.status}`);
    const completion = await response.json();
    const parsed = extractJson(completion.choices?.[0]?.message?.content);
    if (!parsed) return analysis;
    return {
      ...analysis,
      source: "THN Local AI Engine + OpenAI narrative enhancement",
      aiNarrative: parsed.aiNarrative || analysis.aiNarrative,
      professionalActionPlan: parsed.professionalActionPlan || null,
      warnings: [...analysis.warnings, ...(Array.isArray(parsed.extraWarnings) ? parsed.extraWarnings : [])].slice(0, 12)
    };
  } catch (error) {
    return {
      ...analysis,
      warnings: [`OpenAI enhancement failed (${error.message}); local THN AI engine report is shown.`, ...analysis.warnings].slice(0, 12)
    };
  }
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function setBaseHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
}

function sendJson(res, statusCode, data) {
  setBaseHeaders(res);
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function safeStaticPath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const cleanPath = decoded === "/" ? "/index.html" : decoded;
  const target = path.normalize(path.join(__dirname, "public", cleanPath));
  const publicRoot = path.join(__dirname, "public");
  if (!target.startsWith(publicRoot)) return null;
  return target;
}

function serveFile(res, filePath) {
  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    filePath = path.join(__dirname, "public", "index.html");
  }
  const ext = path.extname(filePath).toLowerCase();
  setBaseHeaders(res);
  res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  setBaseHeaders(res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  try {
    if (req.method === "GET" && url.pathname === "/api/health") {
      return sendJson(res, 200, { ok: true, app: "THN AI Trader", version: "2.0.0", openaiEnabled, serverTime: new Date().toISOString() });
    }

    if (req.method === "GET" && url.pathname.startsWith("/api/market/")) {
      const symbol = decodeURIComponent(url.pathname.replace("/api/market/", ""));
      const timeframe = url.searchParams.get("timeframe") || "intraday";
      const market = await getMarketData(symbol, timeframe);
      return sendJson(res, 200, {
        symbolInfo: market.symbolInfo,
        source: market.source,
        warning: market.warning,
        currency: market.currency,
        exchangeName: market.exchangeName,
        marketTime: market.marketTime,
        interval: market.interval,
        range: market.range,
        tvInterval: market.tvInterval,
        last: market.candles.at(-1),
        candles: market.candles.slice(-160)
      });
    }

    if (req.method === "POST" && url.pathname === "/api/analyze") {
      const body = await readBody(req);
      const market = await getMarketData(body.symbol || "EURUSD", body.timeframe || "intraday");
      const analysis = buildAnalysis(market, body);
      const enhanced = await enhanceWithOpenAI(analysis);
      return sendJson(res, 200, enhanced);
    }

    if (req.method === "GET") {
      return serveFile(res, safeStaticPath(url.pathname));
    }

    return sendJson(res, 405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    return sendJson(res, 500, { ok: false, error: "Server error", detail: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`THN AI Trader running on http://localhost:${PORT}`);
  console.log(`OpenAI enabled: ${openaiEnabled ? "yes" : "no"}`);
});
