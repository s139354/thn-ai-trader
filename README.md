# THN AI Trader v2.2

A professional bilingual AI-assisted trading workstation prototype upgraded into a complete web app package.

## What is included

- Premium **THN AI Trader** identity and SVG logo.
- Professional responsive dashboard with dark/light themes.
- **English / Arabic language switch** in the Options menu.
- RTL Arabic layout support and Arabic report output.
- Symbol-only workflow: enter `EURUSD`, `XAUUSD`, `BTCUSDT`, `US30`, `AAPL`, and similar codes.
- Multi-school analysis engine:
  - Technical analysis
  - Price action
  - Smart Money Concepts
  - Quantitative model
  - Sentiment / fundamental context
- Consensus signal: BUY, SELL, or WAIT.
- Confidence score, grade, explanation, warnings, and action plan.
- Risk desk with position sizing, stop loss, take-profit levels, forex lots, exposure, and break-even win rate.
- TradingView chart widget with major studies.
- Scenario lab, execution checklist, backtest stress simulator, journal, CSV export, and institutional TXT report export.
- Optional OpenAI enhancement through `.env`.

## Run

```bash
cd THN_AI_Trader_Professional
npm start
```

Open:

```text
http://localhost:3000
```

## Optional OpenAI enhancement

Copy `.env.example` to `.env` and add your key:

```bash
OPENAI_API_KEY=your_key_here
```

Without an API key, the app still works using the built-in local THN analytical engine.

## Important note

THN AI Trader is an educational and analytical decision-support system. It is not financial advice, does not guarantee profit, and every trade must still be checked against news, broker conditions, spreads, liquidity, and risk-management rules.

## Version 2.2 polish

This version specifically improves professionalism through:

- Clickable Arabic/English language buttons in Options.
- Persistent language preference using browser storage.
- Arabic RTL layout and Arabic dynamic report generation.
- Stronger THN wordmark styling, font sizing, and brand hierarchy.
- Readiness cards explaining the platform coverage directly on the dashboard.
- Syntax checks for the server and client JavaScript.
