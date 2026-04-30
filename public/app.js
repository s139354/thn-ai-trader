const $ = id => document.getElementById(id);
const journalKey = "thn_ai_trader_journal_v3";
const setupKey = "thn_ai_trader_setup_v3";
const langKey = "thn_ai_trader_language_v3";
let currentAnalysis = null;
let tvWidget = null;
let currentLang = localStorage.getItem(langKey) || "en";

const I18N = {
  en: {
    brandTagline: "AI-powered market intelligence",
    navDashboard: "Dashboard",
    navAnalysis: "AI Analysis",
    navChart: "TradingView",
    navRisk: "Risk Desk",
    navJournal: "Journal & Report",
    apiChecking: "Checking engine...",
    modelInitializing: "THN engine initializing",
    disclaimer: "Educational analysis only. Always verify with your broker, calendar, and risk plan.",
    topbarSub: "Professional multi-school AI trading workstation",
    options: "Options",
    language: "Language",
    toggleTheme: "Toggle Theme",
    heroEyebrow: "Professional AI trading workstation",
    heroSubtitle: "Enter one market code and the platform fetches data, analyzes the chart through multiple trading schools, builds a signal, calculates risk, and prepares an institutional-style report.",
    featTechnical: "Technical",
    featPriceAction: "Price Action",
    featSmc: "SMC",
    featQuant: "Quant",
    featRisk: "Risk",
    featReport: "Report",
    readyBilingualTitle: "Bilingual UI",
    readyBilingualText: "English and Arabic with RTL support",
    readyAiTitle: "Multi-school AI",
    readyAiText: "Consensus from technical, SMC, quant and sentiment modules",
    readyRiskTitle: "Risk-first",
    readyRiskText: "Position sizing, SL, TP and scenario planning",
    readyReportTitle: "Exportable reports",
    readyReportText: "Journal, checklist and institutional report",
    marketCode: "Market / Currency Code",
    symbolPlaceholder: "EURUSD, XAUUSD, BTCUSDT, AAPL",
    analyze: "Analyze",
    analyzing: "Analyzing...",
    advancedRisk: "Advanced risk and context",
    timeframe: "Timeframe",
    tfScalp: "Scalp",
    tfIntraday: "Intraday",
    tfSwing: "Swing",
    tfPosition: "Position",
    accountBalance: "Account Balance",
    riskPercent: "Risk %",
    rewardRisk: "Reward / Risk",
    optionalSentiment: "Optional sentiment",
    sentNeutral: "Neutral / Unknown",
    sentBullish: "Bullish Context",
    sentBearish: "Bearish Context",
    traderNotes: "Trader notes",
    notesPlaceholder: "Example: avoid CPI, wait for NY confirmation",
    readyStatus: "Ready. Enter a symbol and press Analyze.",
    forex: "Forex",
    metals: "Metals",
    crypto: "Crypto",
    indices: "Indices",
    decisionCenter: "AI decision center",
    awaitingAnalysis: "Awaiting analysis",
    signal: "Signal",
    runAnalysisNarrative: "Run the analysis to generate a professional report.",
    confidence: "confidence",
    grade: "Grade",
    symbol: "Symbol",
    asset: "Asset",
    data: "Data",
    tradeTicket: "Trade Ticket",
    entry: "Entry",
    stopLoss: "Stop Loss",
    takeProfit1: "Take Profit 1",
    takeProfit2: "Take Profit 2",
    takeProfit3: "Take Profit 3",
    riskAmount: "Risk Amount",
    saveSignal: "Save Signal to Journal",
    technicalIndicators: "Technical Indicators",
    liveCalculation: "Live calculation",
    structureSmc: "Structure & SMC",
    supportResistanceLiquidity: "Support, resistance, liquidity",
    reasons: "Reasons",
    whySignal: "Why this signal?",
    warnings: "Warnings",
    riskFilters: "Risk filters",
    noAnalysisYet: "No analysis yet.",
    noAnalysisYet2: "No analysis yet.",
    tradingViewChart: "TradingView Professional Chart",
    chartWillLoad: "Chart will load after analysis.",
    reloadChart: "Reload Chart",
    riskDesk: "Risk Desk",
    positionSizing: "Position sizing",
    executionChecklist: "Execution Checklist",
    beforeEntry: "Before entry",
    scenarioLab: "Scenario Lab",
    riskAlternatives: "Risk alternatives",
    backtestSimulator: "Backtest Stress Simulator",
    estimatedProfile: "Estimated profile",
    tradeJournal: "Trade Journal",
    browserStorage: "Browser local storage",
    clearJournal: "Clear Journal",
    exportJournal: "Export Journal",
    institutionalReport: "Institutional Report",
    copyOrExport: "Copy or export",
    noReportYet: "No report yet.",
    copyReport: "Copy Report",
    exportTxt: "Export TXT",
    localAiActive: "Local AI active",
    openaiEnhanced: "OpenAI enhanced",
    serverOffline: "Server offline",
    runNpmFirst: "Run npm start first",
    analyzingStatus: "Analyzing {symbol} across THN multi-school AI modules...",
    completedStatus: "Analysis completed for {symbol}.",
    errorPrefix: "Error",
    savedStatus: "Signal saved to journal.",
    reportCopied: "Report copied to clipboard.",
    runAnalysisFirst: "Run analysis first.",
    confirmClear: "Clear all saved journal entries?",
    noSavedSignals: "No saved signals yet.",
    noReasons: "No reasons returned.",
    noMajorWarnings: "No major warnings.",
    neutralModule: "Neutral module reading.",
    noAnalysis: "No analysis",
    runFirst: "Run analysis first.",
    score: "Score",
    lastPrice: "Last Price",
    ema20: "EMA 20",
    ema50: "EMA 50",
    ema200: "EMA 200",
    rsi14: "RSI 14",
    atr14: "ATR 14",
    macdHistogram: "MACD Histogram",
    bollingerWidth: "Bollinger Width",
    volatility: "Volatility",
    support: "Support",
    resistance: "Resistance",
    recentHigh: "Recent High",
    recentLow: "Recent Low",
    rangePosition: "Range Position",
    trendStructure: "Trend Structure",
    sellSideSweep: "Sell-side Sweep",
    buySideSweep: "Buy-side Sweep",
    possible: "Possible",
    no: "No",
    riskPerUnit: "Risk Per Unit",
    units: "Units",
    forexLots: "Forex Lots",
    exposure: "Exposure",
    exposurePercent: "Exposure %",
    breakEvenWinRate: "Break-even Win Rate",
    trades: "Trades",
    wins: "Wins",
    losses: "Losses",
    estimatedWinRate: "Estimated Win Rate",
    estimatedReturn: "Estimated Return",
    endingBalance: "Ending Balance",
    maxDrawdown: "Max Drawdown",
    profitFactor: "Profit Factor",
    risk: "Risk",
    potentialRisk: "Potential risk",
    potentialProfit: "Potential profit",
    breakEven: "Break-even",
    chartError: "TradingView library did not load. Check internet connection, then press Reload Chart.",
    chartSymbolLine: "Symbol: {symbol} | Interval: {interval}",
    analysisTitle: "{symbol} {timeframe} Analysis",
    confidenceLabel: "Confidence",
    reportFilename: "thn-ai-trader-report.txt",
    journalFilename: "thn-ai-trader-journal.csv",
    journalLine: "{date} • Confidence {confidence}% • Entry {entry} • SL {sl} • TP1 {tp1} • Risk {risk}",
    statusPass: "PASS",
    statusWarning: "WARNING",
    statusWait: "WAIT"
  },
  ar: {
    brandTagline: "ذكاء سوقي مدعوم بالذكاء الاصطناعي",
    navDashboard: "لوحة التحكم",
    navAnalysis: "تحليل الذكاء الاصطناعي",
    navChart: "شارت TradingView",
    navRisk: "إدارة المخاطر",
    navJournal: "السجل والتقرير",
    apiChecking: "جارٍ فحص المحرك...",
    modelInitializing: "جارٍ تهيئة محرك THN",
    disclaimer: "التحليل تعليمي ومساعد فقط. تحقق دائمًا من الوسيط، والأخبار، وخطة المخاطر.",
    topbarSub: "منصة تداول احترافية متعددة المدارس التحليلية",
    options: "الخيارات",
    language: "اللغة",
    toggleTheme: "تغيير المظهر",
    heroEyebrow: "منصة تداول احترافية بالذكاء الاصطناعي",
    heroSubtitle: "أدخل رمز السوق فقط، وسيقوم النظام بجلب البيانات وتحليل الشارت عبر عدة مدارس تداول، ثم بناء إشارة، وحساب المخاطر، وتجهيز تقرير احترافي.",
    featTechnical: "فني",
    featPriceAction: "برايس أكشن",
    featSmc: "سمارت موني",
    featQuant: "كمي",
    featRisk: "مخاطر",
    featReport: "تقرير",
    readyBilingualTitle: "واجهة ثنائية اللغة",
    readyBilingualText: "إنجليزية وعربية مع دعم كامل للاتجاه من اليمين لليسار",
    readyAiTitle: "ذكاء متعدد المدارس",
    readyAiText: "توافق بين الفني والسمارت موني والكمي والسياق الشعوري",
    readyRiskTitle: "المخاطر أولًا",
    readyRiskText: "حجم الصفقة والوقف والأهداف وسيناريوهات المخاطرة",
    readyReportTitle: "تقارير قابلة للتصدير",
    readyReportText: "سجل صفقات وقائمة تنفيذ وتقرير احترافي",
    marketCode: "رمز السوق / العملة",
    symbolPlaceholder: "مثال: EURUSD، XAUUSD، BTCUSDT، AAPL",
    analyze: "تحليل",
    analyzing: "جارٍ التحليل...",
    advancedRisk: "إعدادات متقدمة للمخاطر والسياق",
    timeframe: "الإطار الزمني",
    tfScalp: "سكالبينج",
    tfIntraday: "داخل اليوم",
    tfSwing: "سوينغ",
    tfPosition: "استثماري",
    accountBalance: "رصيد الحساب",
    riskPercent: "نسبة المخاطرة %",
    rewardRisk: "العائد / المخاطرة",
    optionalSentiment: "السياق الشعوري اختياري",
    sentNeutral: "محايد / غير معروف",
    sentBullish: "سياق صاعد",
    sentBearish: "سياق هابط",
    traderNotes: "ملاحظات المتداول",
    notesPlaceholder: "مثال: تجنب خبر CPI، انتظر تأكيد جلسة نيويورك",
    readyStatus: "جاهز. أدخل الرمز واضغط تحليل.",
    forex: "الفوركس",
    metals: "المعادن",
    crypto: "الكريبتو",
    indices: "المؤشرات",
    decisionCenter: "مركز قرار الذكاء الاصطناعي",
    awaitingAnalysis: "بانتظار التحليل",
    signal: "الإشارة",
    runAnalysisNarrative: "شغّل التحليل لإنشاء تقرير احترافي.",
    confidence: "الثقة",
    grade: "التقييم",
    symbol: "الرمز",
    asset: "الأصل",
    data: "البيانات",
    tradeTicket: "تذكرة الصفقة",
    entry: "الدخول",
    stopLoss: "وقف الخسارة",
    takeProfit1: "الهدف الأول",
    takeProfit2: "الهدف الثاني",
    takeProfit3: "الهدف الثالث",
    riskAmount: "مبلغ المخاطرة",
    saveSignal: "حفظ الإشارة في السجل",
    technicalIndicators: "المؤشرات الفنية",
    liveCalculation: "حساب مباشر",
    structureSmc: "الهيكل والسمارت موني",
    supportResistanceLiquidity: "دعم، مقاومة، وسيولة",
    reasons: "الأسباب",
    whySignal: "لماذا هذه الإشارة؟",
    warnings: "التحذيرات",
    riskFilters: "مرشحات المخاطر",
    noAnalysisYet: "لا يوجد تحليل بعد.",
    noAnalysisYet2: "لا يوجد تحليل بعد.",
    tradingViewChart: "شارت TradingView الاحترافي",
    chartWillLoad: "سيظهر الشارت بعد التحليل.",
    reloadChart: "إعادة تحميل الشارت",
    riskDesk: "مكتب المخاطر",
    positionSizing: "حساب حجم الصفقة",
    executionChecklist: "قائمة التنفيذ",
    beforeEntry: "قبل الدخول",
    scenarioLab: "مختبر السيناريوهات",
    riskAlternatives: "بدائل المخاطرة",
    backtestSimulator: "محاكي اختبار التحمل",
    estimatedProfile: "ملف تقديري",
    tradeJournal: "سجل التداول",
    browserStorage: "تخزين محلي في المتصفح",
    clearJournal: "مسح السجل",
    exportJournal: "تصدير السجل",
    institutionalReport: "تقرير احترافي",
    copyOrExport: "نسخ أو تصدير",
    noReportYet: "لا يوجد تقرير بعد.",
    copyReport: "نسخ التقرير",
    exportTxt: "تصدير TXT",
    localAiActive: "الذكاء المحلي نشط",
    openaiEnhanced: "محسّن بـ OpenAI",
    serverOffline: "الخادم غير متصل",
    runNpmFirst: "شغّل npm start أولًا",
    analyzingStatus: "جارٍ تحليل {symbol} عبر وحدات THN متعددة المدارس...",
    completedStatus: "اكتمل تحليل {symbol}.",
    errorPrefix: "خطأ",
    savedStatus: "تم حفظ الإشارة في السجل.",
    reportCopied: "تم نسخ التقرير إلى الحافظة.",
    runAnalysisFirst: "شغّل التحليل أولًا.",
    confirmClear: "هل تريد مسح كل إدخالات السجل؟",
    noSavedSignals: "لا توجد إشارات محفوظة بعد.",
    noReasons: "لم يتم إرجاع أسباب.",
    noMajorWarnings: "لا توجد تحذيرات رئيسية.",
    neutralModule: "قراءة الوحدة محايدة.",
    noAnalysis: "لا يوجد تحليل",
    runFirst: "شغّل التحليل أولًا.",
    score: "الدرجة",
    lastPrice: "آخر سعر",
    ema20: "EMA 20",
    ema50: "EMA 50",
    ema200: "EMA 200",
    rsi14: "RSI 14",
    atr14: "ATR 14",
    macdHistogram: "هيستوغرام MACD",
    bollingerWidth: "عرض بولنجر",
    volatility: "التذبذب",
    support: "الدعم",
    resistance: "المقاومة",
    recentHigh: "آخر قمة",
    recentLow: "آخر قاع",
    rangePosition: "موقع السعر داخل النطاق",
    trendStructure: "هيكل الاتجاه",
    sellSideSweep: "سحب سيولة القيعان",
    buySideSweep: "سحب سيولة القمم",
    possible: "محتمل",
    no: "لا",
    riskPerUnit: "المخاطرة لكل وحدة",
    units: "الوحدات",
    forexLots: "لوتات الفوركس",
    exposure: "التعرض",
    exposurePercent: "نسبة التعرض %",
    breakEvenWinRate: "نسبة التعادل",
    trades: "الصفقات",
    wins: "الرابحة",
    losses: "الخاسرة",
    estimatedWinRate: "نسبة الفوز التقديرية",
    estimatedReturn: "العائد التقديري",
    endingBalance: "الرصيد النهائي",
    maxDrawdown: "أقصى هبوط",
    profitFactor: "معامل الربح",
    risk: "المخاطرة",
    potentialRisk: "المخاطرة المحتملة",
    potentialProfit: "الربح المحتمل",
    breakEven: "التعادل",
    chartError: "لم يتم تحميل مكتبة TradingView. تحقق من الاتصال بالإنترنت ثم اضغط إعادة تحميل الشارت.",
    chartSymbolLine: "الرمز: {symbol} | الفاصل: {interval}",
    analysisTitle: "تحليل {symbol} - {timeframe}",
    confidenceLabel: "الثقة",
    reportFilename: "thn-ai-trader-report-ar.txt",
    journalFilename: "thn-ai-trader-journal.csv",
    journalLine: "{date} • الثقة {confidence}% • الدخول {entry} • الوقف {sl} • الهدف 1 {tp1} • المخاطرة {risk}",
    statusPass: "ناجح",
    statusWarning: "تحذير",
    statusWait: "انتظار"
  }
};

const schoolNameMap = {
  "Technical Analysis": { ar: "التحليل الفني" },
  "Price Action": { ar: "البرايس أكشن" },
  "Smart Money Concepts": { ar: "مفاهيم السمارت موني" },
  "Quantitative Model": { ar: "النموذج الكمي" },
  "Sentiment & Fundamental Context": { ar: "السياق الأساسي والشعوري" }
};

const valueMap = {
  BULLISH: { ar: "صاعد" },
  BEARISH: { ar: "هابط" },
  NEUTRAL: { ar: "محايد" },
  BUY: { ar: "شراء" },
  SELL: { ar: "بيع" },
  WAIT: { ar: "انتظار" },
  PASS: { ar: "ناجح" },
  WARNING: { ar: "تحذير" },
  Forex: { ar: "فوركس" },
  Commodity: { ar: "سلع" },
  Crypto: { ar: "كريبتو" },
  Index: { ar: "مؤشر" },
  Stock: { ar: "سهم" }
};

function t(key, replacements = {}) {
  const dict = I18N[currentLang] || I18N.en;
  let text = dict[key] || I18N.en[key] || key;
  for (const [name, value] of Object.entries(replacements)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}

function localizedValue(value) {
  if (currentLang !== "ar") return value;
  return valueMap[value]?.ar || value;
}

function localizedSchoolName(value) {
  if (currentLang !== "ar") return value;
  return schoolNameMap[value]?.ar || value;
}

const fmt = (value, digits = 2) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "--";
  return n.toLocaleString(currentLang === "ar" ? "ar-OM" : undefined, { maximumFractionDigits: digits });
};

const money = value => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "--";
  return n.toLocaleString(currentLang === "ar" ? "ar-OM" : undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
};

const escapeHtml = value => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

function status(text) {
  $("statusMsg").textContent = text;
}

function translateStaticDom() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", currentLang === "ar");
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder));
  });
  const languageSelect = $("languageSelect");
  if (languageSelect) languageSelect.value = currentLang;
  document.querySelectorAll("[data-language]").forEach(button => {
    const active = button.dataset.language === currentLang;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function setLanguage(lang) {
  currentLang = lang === "ar" ? "ar" : "en";
  localStorage.setItem(langKey, currentLang);
  translateStaticDom();
  renderJournal();
  if (currentAnalysis) renderAnalysis(currentAnalysis, { preserveChart: true });
  loadChart();
}

function getPayload() {
  return {
    symbol: $("symbolInput").value.trim() || "EURUSD",
    timeframe: $("timeframe").value,
    accountBalance: Number($("accountBalance").value || 10000),
    riskPct: Number($("riskPct").value || 1),
    rewardRisk: Number($("rewardRisk").value || 2),
    sentiment: $("sentiment").value,
    notes: $("notes").value.trim()
  };
}

function saveSetup() {
  localStorage.setItem(setupKey, JSON.stringify(getPayload()));
}

function restoreSetup() {
  try {
    const saved = JSON.parse(localStorage.getItem(setupKey) || "null");
    if (!saved) return;
    if (saved.symbol) $("symbolInput").value = saved.symbol;
    if (saved.timeframe) $("timeframe").value = saved.timeframe;
    if (saved.accountBalance) $("accountBalance").value = saved.accountBalance;
    if (saved.riskPct) $("riskPct").value = saved.riskPct;
    if (saved.rewardRisk) $("rewardRisk").value = saved.rewardRisk;
    if (saved.sentiment) $("sentiment").value = saved.sentiment;
    if (saved.notes) $("notes").value = saved.notes;
  } catch {
    localStorage.removeItem(setupKey);
  }
}

async function checkHealth() {
  try {
    const res = await fetch("/api/health");
    const health = await res.json();
    $("apiStatus").textContent = health.openaiEnabled ? t("openaiEnhanced") : t("localAiActive");
    $("modelStatus").textContent = `${health.app} v${health.version}`;
  } catch {
    $("apiStatus").textContent = t("serverOffline");
    $("modelStatus").textContent = t("runNpmFirst");
  }
}

async function analyze() {
  const payload = getPayload();
  saveSetup();
  status(t("analyzingStatus", { symbol: payload.symbol.toUpperCase() }));
  $("analyzeBtn").disabled = true;
  $("analyzeBtn").textContent = t("analyzing");
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.detail || data.error || "Analysis failed");
    currentAnalysis = data;
    renderAnalysis(data);
    loadChart(data.tvSymbol, data.tvInterval);
    status(t("completedStatus", { symbol: data.symbol }));
  } catch (error) {
    status(`${t("errorPrefix")}: ${error.message}`);
  } finally {
    $("analyzeBtn").disabled = false;
    $("analyzeBtn").textContent = t("analyze");
  }
}

function renderAnalysis(a, options = {}) {
  const decisionClass = String(a.decision || "WAIT").toLowerCase();
  $("decisionTitle").textContent = t("analysisTitle", { symbol: a.symbol, timeframe: String(a.timeframe || "").toUpperCase() });
  $("sourceBadge").textContent = a.source || "THN Engine";
  $("decision").textContent = localizedValue(a.decision || "WAIT");
  $("decision").className = `decision ${decisionClass}`;
  $("confidence").textContent = `${fmt(a.confidence, 0)}%`;
  document.documentElement.style.setProperty("--confidence", `${Number(a.confidence || 0)}%`);
  $("grade").textContent = a.grade || "--";
  $("symbolOut").textContent = a.symbol || "--";
  $("assetClass").textContent = localizedValue(a.assetClass || "--");
  $("marketDataSource").textContent = a.marketDataSource || "--";
  $("aiNarrative").textContent = localizedNarrative(a);
  $("marketTime").textContent = a.marketTime ? new Date(a.marketTime).toLocaleString(currentLang === "ar" ? "ar-OM" : undefined) : "--";
  $("entry").textContent = fmt(a.entry, 6);
  $("stopLoss").textContent = a.stopLoss ? fmt(a.stopLoss, 6) : "--";
  $("target1").textContent = a.targets?.[0] ? fmt(a.targets[0], 6) : "--";
  $("target2").textContent = a.targets?.[1] ? fmt(a.targets[1], 6) : "--";
  $("target3").textContent = a.targets?.[2] ? fmt(a.targets[2], 6) : "--";
  $("riskAmount").textContent = money(a.risk?.riskAmount);
  renderSchools(a.schools || []);
  renderTables(a);
  renderLists(a);
  renderReport(a);
  if (!options.preserveChart) return;
}

function localizedNarrative(a) {
  if (currentLang !== "ar") return a.aiNarrative || "No narrative available.";
  return `ملخص THN: القرار الحالي هو ${localizedValue(a.decision || "WAIT")} على ${a.symbol} بثقة ${fmt(a.confidence, 0)}%. تم بناء القرار من توافق عدة مدارس تحليلية تشمل الفني، البرايس أكشن، السمارت موني، النموذج الكمي، والسياق الشعوري. استخدم الخطة فقط بعد تأكيد ظروف السوق والأخبار وإدارة المخاطر.`;
}

function renderSchools(schools) {
  const colorFor = bias => bias === "BULLISH" ? "var(--green)" : bias === "BEARISH" ? "var(--red)" : "var(--yellow)";
  $("schoolsGrid").innerHTML = schools.map(s => {
    const reason = s.reasons?.[0] || s.warnings?.[0] || t("neutralModule");
    return `<article class="school-card" style="--school-color:${colorFor(s.bias)}">
      <h3>${escapeHtml(localizedSchoolName(s.name))}</h3>
      <div class="bias" style="color:${colorFor(s.bias)}">${escapeHtml(localizedValue(s.bias))}</div>
      <div class="score">${t("score")}: <b>${fmt(s.score, 0)}/100</b></div>
      <p>${escapeHtml(currentLang === "ar" ? summarizeReasonAr(s) : reason)}</p>
    </article>`;
  }).join("") || `<article class="school-card"><h3>${t("noAnalysis")}</h3><div class="bias">${localizedValue("WAIT")}</div><p>${t("runFirst")}</p></article>`;
}

function summarizeReasonAr(s) {
  const bias = localizedValue(s.bias);
  const name = localizedSchoolName(s.name);
  return `${name} يعطي قراءة ${bias} بدرجة ${fmt(s.score, 0)} من 100، لذلك يجب مقارنته مع باقي المدارس قبل التنفيذ.`;
}

function renderTables(a) {
  const i = a.indicators || {};
  const s = a.structure || {};
  const r = a.risk || {};
  const b = a.backtest || {};

  $("indicatorTable").innerHTML = [
    row(t("lastPrice"), fmt(i.price, 6)),
    row(t("ema20"), fmt(i.ema20, 6)),
    row(t("ema50"), fmt(i.ema50, 6)),
    row(t("ema200"), fmt(i.ema200, 6)),
    row(t("rsi14"), fmt(i.rsi14, 2)),
    row(t("atr14"), `${fmt(i.atr14, 6)} (${fmt(i.atrPct, 3)}%)`),
    row(t("macdHistogram"), fmt(i.macdHistogram, 6)),
    row(t("bollingerWidth"), `${fmt(i.bollingerWidthPct, 3)}%`),
    row(t("volatility"), i.volatilityLabel || "--")
  ].join("");

  $("structureTable").innerHTML = [
    row(t("support"), fmt(s.support, 6)),
    row(t("resistance"), fmt(s.resistance, 6)),
    row(t("recentHigh"), fmt(s.recentHigh, 6)),
    row(t("recentLow"), fmt(s.recentLow, 6)),
    row(t("rangePosition"), `${fmt(s.rangePosition, 2)}%`),
    row(t("trendStructure"), s.trendStructure || "--"),
    row(t("sellSideSweep"), s.possibleSellSideSweep ? t("possible") : t("no")),
    row(t("buySideSweep"), s.possibleBuySideSweep ? t("possible") : t("no"))
  ].join("");

  $("riskTable").innerHTML = [
    row(t("accountBalance"), money(r.accountBalance)),
    row(t("riskPercent"), `${fmt(r.riskPct, 2)}%`),
    row(t("riskAmount"), money(r.riskAmount)),
    row(t("riskPerUnit"), fmt(r.riskPerUnit, 6)),
    row(t("units"), fmt(r.units, 4)),
    row(t("forexLots"), r.forexLots ? fmt(r.forexLots, 4) : "N/A"),
    row(t("exposure"), money(r.exposure)),
    row(t("exposurePercent"), `${fmt(r.exposurePct, 2)}%`),
    row(t("rewardRisk"), `1 : ${fmt(r.rewardRisk, 2)}`),
    row(t("breakEvenWinRate"), `${fmt(r.breakEvenWinRate, 2)}%`)
  ].join("");

  $("checklist").innerHTML = (a.checklist || []).map(c => `<div class="check">
    <span>${escapeHtml(currentLang === "ar" ? checklistItemAr(c) : c.item)}</span>
    <b class="${escapeHtml(String(c.status).toLowerCase())}">${escapeHtml(localizedValue(c.status))}</b>
    <small>${escapeHtml(currentLang === "ar" ? checklistDetailAr(c) : (c.detail || ""))}</small>
  </div>`).join("");

  $("scenarioGrid").innerHTML = (a.scenarios || []).map(scn => `<div class="scenario-card">
    <h3>${escapeHtml(currentLang === "ar" ? scenarioNameAr(scn.name) : scn.name)}</h3>
    <p>${t("risk")}: <b>${fmt(scn.riskPct, 2)}%</b></p>
    <p>${t("potentialRisk")}: <b>${money(scn.riskAmount)}</b></p>
    <p>${t("rewardRisk")}: <b>1 : ${fmt(scn.rr, 2)}</b></p>
    <p>${t("potentialProfit")}: <b>${money(scn.potentialProfit)}</b></p>
    <p>${t("breakEven")}: <b>${fmt(scn.breakEvenWinRate, 2)}%</b></p>
  </div>`).join("");

  $("backtestTable").innerHTML = [
    row(t("trades"), fmt(b.trades, 0)),
    row(t("wins"), fmt(b.wins, 0)),
    row(t("losses"), fmt(b.losses, 0)),
    row(t("estimatedWinRate"), `${fmt(b.estimatedWinRate, 1)}%`),
    row(t("estimatedReturn"), `${fmt(b.estimatedReturnPct, 2)}%`),
    row(t("endingBalance"), money(b.endingBalance)),
    row(t("maxDrawdown"), `${fmt(b.maxDrawdownPct, 2)}%`),
    row(t("profitFactor"), fmt(b.profitFactor, 2))
  ].join("");
}

function checklistItemAr(c) {
  const item = String(c.item || "").toLowerCase();
  if (item.includes("news")) return "فلتر الأخبار";
  if (item.includes("spread")) return "السبريد والسيولة";
  if (item.includes("risk")) return "المخاطرة المسموحة";
  if (item.includes("confirmation")) return "تأكيد الدخول";
  if (item.includes("session")) return "جلسة التداول";
  return c.item || "بند تنفيذ";
}

function checklistDetailAr(c) {
  const status = localizedValue(c.status || "WAIT");
  return c.detail ? `${status}: تحقق من هذا البند قبل تنفيذ الصفقة.` : status;
}

function scenarioNameAr(name) {
  const n = String(name || "").toLowerCase();
  if (n.includes("conservative")) return "سيناريو محافظ";
  if (n.includes("standard")) return "سيناريو قياسي";
  if (n.includes("aggressive")) return "سيناريو هجومي";
  return name;
}

function renderLists(a) {
  $("reasonsList").innerHTML = (a.reasons || []).map((x, idx) => `<li>${escapeHtml(currentLang === "ar" ? reasonAr(a, idx) : x)}</li>`).join("") || `<li>${t("noReasons")}</li>`;
  $("warningsList").innerHTML = (a.warnings || []).map((x, idx) => `<li>${escapeHtml(currentLang === "ar" ? warningAr(a, idx) : x)}</li>`).join("") || `<li>${t("noMajorWarnings")}</li>`;
}

function reasonAr(a, idx) {
  const reasons = [
    `التوافق العام بين المدارس التحليلية يشير إلى ${localizedValue(a.decision || "WAIT")} بدرجة ثقة ${fmt(a.confidence, 0)}%.`,
    `المؤشرات الفنية وهيكل السعر تم تحويلهما إلى درجة موحدة للمقارنة بدل الاعتماد على مؤشر واحد فقط.`,
    `مستويات الدخول والوقف والأهداف مبنية على التذبذب الحالي وهيكل الدعم والمقاومة.`,
    `النظام لا يعطي أمر تنفيذ مباشر؛ بل يعطي خطة يجب تأكيدها قبل الدخول.`
  ];
  return reasons[idx % reasons.length];
}

function warningAr(a, idx) {
  const warnings = [
    "لا تدخل إذا كان هناك خبر قوي أو سبريد مرتفع أو سيولة ضعيفة.",
    "قلل المخاطرة إذا كانت الثقة أقل من 70% أو كان السعر قريبًا جدًا من مستوى مقاومة/دعم مهم.",
    "تأكد من مطابقة حجم العقد وقيمة النقطة مع وسيطك قبل التنفيذ.",
    "استخدم وقف الخسارة دائمًا ولا ترفع المخاطرة بسبب إشارة واحدة."
  ];
  return warnings[idx % warnings.length];
}

function row(key, value) {
  return `<div><span>${escapeHtml(key)}</span><b>${escapeHtml(value)}</b></div>`;
}

function renderReport(a) {
  if (currentLang === "ar") {
    renderArabicReport(a);
  } else {
    renderEnglishReport(a);
  }
}

function renderEnglishReport(a) {
  const r = a.risk || {};
  const i = a.indicators || {};
  const s = a.structure || {};
  const schoolLines = (a.schools || []).map(x => `- ${x.name}: ${x.bias} | Score ${fmt(x.score, 0)}/100 | Direction ${fmt(x.directionScore, 2)}`).join("\n");
  const actionPlan = Array.isArray(a.professionalActionPlan) ? a.professionalActionPlan.map(x => `- ${x}`).join("\n") : (a.professionalActionPlan || "Follow checklist, confirm news risk, and execute only if broker conditions match the plan.");
  $("report").textContent = `==============================\nTHN AI TRADER - INSTITUTIONAL REPORT\n==============================\n\nAPP: ${a.appName || "THN AI Trader"}\nSOURCE: ${a.source}\nMARKET DATA: ${a.marketDataSource}\nSYMBOL: ${a.symbol}\nYAHOO SYMBOL: ${a.yahooSymbol}\nTRADINGVIEW SYMBOL: ${a.tvSymbol}\nASSET CLASS: ${a.assetClass}\nTIMEFRAME: ${a.timeframe}\nEXCHANGE: ${a.exchangeName}\nMARKET TIME: ${a.marketTime ? new Date(a.marketTime).toLocaleString() : "--"}\n\n------------------------------\nAI CONSENSUS\n------------------------------\nDECISION: ${a.decision}\nCONSENSUS: ${a.consensusLabel}\nCONFIDENCE: ${fmt(a.confidence, 0)}%\nGRADE: ${a.grade}\nCONSENSUS SCORE: ${fmt(a.consensusScore, 2)}\n\n${a.aiNarrative}\n\n------------------------------\nMULTI-SCHOOL ANALYSIS\n------------------------------\n${schoolLines}\n\n------------------------------\nTRADE LEVELS\n------------------------------\nENTRY: ${fmt(a.entry, 6)}\nSTOP LOSS: ${a.stopLoss ? fmt(a.stopLoss, 6) : "--"}\nTAKE PROFIT 1: ${a.targets?.[0] ? fmt(a.targets[0], 6) : "--"}\nTAKE PROFIT 2: ${a.targets?.[1] ? fmt(a.targets[1], 6) : "--"}\nTAKE PROFIT 3: ${a.targets?.[2] ? fmt(a.targets[2], 6) : "--"}\n\n------------------------------\nRISK MANAGEMENT\n------------------------------\nACCOUNT BALANCE: ${money(r.accountBalance)}\nRISK PER TRADE: ${fmt(r.riskPct, 2)}%\nRISK AMOUNT: ${money(r.riskAmount)}\nRISK PER UNIT: ${fmt(r.riskPerUnit, 6)}\nUNITS: ${fmt(r.units, 4)}\nFOREX LOTS: ${r.forexLots ? fmt(r.forexLots, 4) : "N/A"}\nEXPOSURE: ${money(r.exposure)}\nEXPOSURE %: ${fmt(r.exposurePct, 2)}%\nREWARD/RISK: 1 : ${fmt(r.rewardRisk, 2)}\nBREAK-EVEN WIN RATE: ${fmt(r.breakEvenWinRate, 2)}%\n\n------------------------------\nINDICATORS\n------------------------------\nPRICE: ${fmt(i.price, 6)}\nEMA20: ${fmt(i.ema20, 6)}\nEMA50: ${fmt(i.ema50, 6)}\nEMA200: ${fmt(i.ema200, 6)}\nRSI14: ${fmt(i.rsi14, 2)}\nATR14: ${fmt(i.atr14, 6)} (${fmt(i.atrPct, 3)}%)\nMACD HISTOGRAM: ${fmt(i.macdHistogram, 6)}\nVOLATILITY: ${i.volatilityLabel}\n\n------------------------------\nSTRUCTURE\n------------------------------\nSUPPORT: ${fmt(s.support, 6)}\nRESISTANCE: ${fmt(s.resistance, 6)}\nRECENT HIGH: ${fmt(s.recentHigh, 6)}\nRECENT LOW: ${fmt(s.recentLow, 6)}\nTREND STRUCTURE: ${s.trendStructure}\nRANGE POSITION: ${fmt(s.rangePosition, 2)}%\nSELL-SIDE SWEEP: ${s.possibleSellSideSweep ? "Possible" : "No"}\nBUY-SIDE SWEEP: ${s.possibleBuySideSweep ? "Possible" : "No"}\n\n------------------------------\nREASONS\n------------------------------\n${(a.reasons || []).map(x => `- ${x}`).join("\n")}\n\n------------------------------\nWARNINGS\n------------------------------\n${(a.warnings || []).map(x => `- ${x}`).join("\n")}\n\n------------------------------\nACTION PLAN\n------------------------------\n${actionPlan}\n\nDISCLAIMER: THN AI Trader is an educational and analytical decision-support system. It is not financial advice, does not guarantee profit, and must be verified with independent market research, broker specifications, and professional risk management.`;
}

function renderArabicReport(a) {
  const r = a.risk || {};
  const i = a.indicators || {};
  const s = a.structure || {};
  const schoolLines = (a.schools || []).map(x => `- ${localizedSchoolName(x.name)}: ${localizedValue(x.bias)} | ${t("score")} ${fmt(x.score, 0)}/100 | اتجاه ${fmt(x.directionScore, 2)}`).join("\n");
  $("report").textContent = `==============================\nTHN AI TRADER - تقرير احترافي\n==============================\n\nالتطبيق: ${a.appName || "THN AI Trader"}\nالمصدر: ${a.source}\nبيانات السوق: ${a.marketDataSource}\nالرمز: ${a.symbol}\nرمز Yahoo: ${a.yahooSymbol}\nرمز TradingView: ${a.tvSymbol}\nنوع الأصل: ${localizedValue(a.assetClass)}\nالإطار الزمني: ${a.timeframe}\nوقت السوق: ${a.marketTime ? new Date(a.marketTime).toLocaleString("ar-OM") : "--"}\n\n------------------------------\nتوافق الذكاء الاصطناعي\n------------------------------\nالقرار: ${localizedValue(a.decision)}\nالثقة: ${fmt(a.confidence, 0)}%\nالتقييم: ${a.grade}\nدرجة التوافق: ${fmt(a.consensusScore, 2)}\n\n${localizedNarrative(a)}\n\n------------------------------\nتحليل المدارس\n------------------------------\n${schoolLines}\n\n------------------------------\nمستويات الصفقة\n------------------------------\nالدخول: ${fmt(a.entry, 6)}\nوقف الخسارة: ${a.stopLoss ? fmt(a.stopLoss, 6) : "--"}\nالهدف الأول: ${a.targets?.[0] ? fmt(a.targets[0], 6) : "--"}\nالهدف الثاني: ${a.targets?.[1] ? fmt(a.targets[1], 6) : "--"}\nالهدف الثالث: ${a.targets?.[2] ? fmt(a.targets[2], 6) : "--"}\n\n------------------------------\nإدارة المخاطر\n------------------------------\nرصيد الحساب: ${money(r.accountBalance)}\nنسبة المخاطرة: ${fmt(r.riskPct, 2)}%\nمبلغ المخاطرة: ${money(r.riskAmount)}\nالمخاطرة لكل وحدة: ${fmt(r.riskPerUnit, 6)}\nالوحدات: ${fmt(r.units, 4)}\nلوتات الفوركس: ${r.forexLots ? fmt(r.forexLots, 4) : "N/A"}\nالتعرض: ${money(r.exposure)}\nنسبة التعرض: ${fmt(r.exposurePct, 2)}%\nالعائد/المخاطرة: 1 : ${fmt(r.rewardRisk, 2)}\nنسبة التعادل: ${fmt(r.breakEvenWinRate, 2)}%\n\n------------------------------\nالمؤشرات\n------------------------------\nالسعر: ${fmt(i.price, 6)}\nEMA20: ${fmt(i.ema20, 6)}\nEMA50: ${fmt(i.ema50, 6)}\nEMA200: ${fmt(i.ema200, 6)}\nRSI14: ${fmt(i.rsi14, 2)}\nATR14: ${fmt(i.atr14, 6)} (${fmt(i.atrPct, 3)}%)\nMACD: ${fmt(i.macdHistogram, 6)}\nالتذبذب: ${i.volatilityLabel}\n\n------------------------------\nالهيكل\n------------------------------\nالدعم: ${fmt(s.support, 6)}\nالمقاومة: ${fmt(s.resistance, 6)}\nآخر قمة: ${fmt(s.recentHigh, 6)}\nآخر قاع: ${fmt(s.recentLow, 6)}\nهيكل الاتجاه: ${s.trendStructure}\nموقع النطاق: ${fmt(s.rangePosition, 2)}%\nسحب سيولة القيعان: ${s.possibleSellSideSweep ? t("possible") : t("no")}\nسحب سيولة القمم: ${s.possibleBuySideSweep ? t("possible") : t("no")}\n\n------------------------------\nخطة التنفيذ\n------------------------------\n- لا تدخل قبل تأكيد الأخبار والسبريد والسيولة.\n- التزم بنسبة المخاطرة المحددة ولا ترفع حجم الصفقة بسبب الثقة العالية.\n- استخدم الوقف والأهداف كما هي أو عدلها فقط حسب خطة واضحة.\n\nتنبيه: THN AI Trader نظام تحليلي وتعليمي مساعد، وليس نصيحة مالية ولا يضمن الربح. يجب التحقق من التحليل وإدارة المخاطر ومواصفات الوسيط قبل أي تنفيذ.`;
}

function loadChart(symbol, interval) {
  const chartSymbol = symbol || currentAnalysis?.tvSymbol || $("symbolInput").value.trim() || "FX:EURUSD";
  const chartInterval = interval || currentAnalysis?.tvInterval || "60";
  $("tvSymbolText").textContent = t("chartSymbolLine", { symbol: chartSymbol, interval: chartInterval });
  $("tvChart").innerHTML = "";
  if (typeof TradingView === "undefined") {
    $("tvChart").innerHTML = `<div class="chart-error">${t("chartError")}</div>`;
    return;
  }
  tvWidget = new TradingView.widget({
    autosize: true,
    symbol: chartSymbol,
    interval: chartInterval,
    timezone: "Etc/UTC",
    theme: document.documentElement.dataset.theme === "light" ? "light" : "dark",
    style: "1",
    locale: currentLang === "ar" ? "ar_AE" : "en",
    enable_publishing: false,
    withdateranges: true,
    hide_side_toolbar: false,
    allow_symbol_change: true,
    details: true,
    hotlist: true,
    calendar: true,
    container_id: "tvChart",
    studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies", "ATR@tv-basicstudies", "BB@tv-basicstudies"]
  });
}

function saveJournal() {
  if (!currentAnalysis) {
    alert(t("runAnalysisFirst"));
    return;
  }
  const arr = getJournal();
  arr.unshift({
    date: new Date().toISOString(),
    symbol: currentAnalysis.symbol,
    decision: currentAnalysis.decision,
    confidence: currentAnalysis.confidence,
    grade: currentAnalysis.grade,
    entry: currentAnalysis.entry,
    stopLoss: currentAnalysis.stopLoss,
    target1: currentAnalysis.targets?.[0],
    risk: currentAnalysis.risk?.riskAmount
  });
  localStorage.setItem(journalKey, JSON.stringify(arr.slice(0, 80)));
  renderJournal();
  status(t("savedStatus"));
}

function getJournal() {
  try {
    return JSON.parse(localStorage.getItem(journalKey) || "[]");
  } catch {
    localStorage.removeItem(journalKey);
    return [];
  }
}

function renderJournal() {
  const arr = getJournal();
  $("journalList").innerHTML = arr.map(item => {
    const date = new Date(item.date).toLocaleString(currentLang === "ar" ? "ar-OM" : undefined);
    return `<div class="journal-item">
      <b>${escapeHtml(item.symbol)} - ${escapeHtml(localizedValue(item.decision))} | ${escapeHtml(item.grade)}</b>
      <p>${escapeHtml(t("journalLine", {
        date,
        confidence: fmt(item.confidence, 0),
        entry: fmt(item.entry, 6),
        sl: item.stopLoss ? fmt(item.stopLoss, 6) : "--",
        tp1: item.target1 ? fmt(item.target1, 6) : "--",
        risk: money(item.risk)
      }))}</p>
    </div>`;
  }).join("") || `<p class="tiny">${t("noSavedSignals")}</p>`;
}

function download(filename, text, type = "text/plain") {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([text], { type }));
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function exportJournal() {
  const arr = getJournal();
  const csv = ["date,symbol,decision,confidence,grade,entry,stopLoss,target1,riskAmount"].concat(arr.map(x => [
    x.date,
    x.symbol,
    x.decision,
    x.confidence,
    x.grade,
    x.entry,
    x.stopLoss,
    x.target1,
    x.risk
  ].map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))).join("\n");
  download(t("journalFilename"), csv, "text/csv");
}

function initEvents() {
  $("analyzeBtn").addEventListener("click", analyze);
  $("symbolInput").addEventListener("keydown", event => {
    if (event.key === "Enter") analyze();
  });
  document.querySelectorAll(".chip").forEach(button => {
    button.addEventListener("click", () => {
      $("symbolInput").value = button.dataset.symbol;
      analyze();
    });
  });
  document.querySelectorAll(".nav").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav").forEach(x => x.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(button.dataset.jump).scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  $("languageSelect").addEventListener("change", event => setLanguage(event.target.value));
  document.querySelectorAll("[data-language]").forEach(button => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });
  $("loadChartBtn").addEventListener("click", () => loadChart());
  $("themeBtn").addEventListener("click", () => {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    localStorage.setItem("thn_ai_trader_theme_v3", document.documentElement.dataset.theme);
    loadChart();
  });
  $("saveJournalBtn").addEventListener("click", saveJournal);
  $("clearJournalBtn").addEventListener("click", () => {
    if (confirm(t("confirmClear"))) {
      localStorage.removeItem(journalKey);
      renderJournal();
    }
  });
  $("exportJournalBtn").addEventListener("click", exportJournal);
  $("copyReportBtn").addEventListener("click", async () => {
    await navigator.clipboard.writeText($("report").textContent);
    status(t("reportCopied"));
  });
  $("exportReportBtn").addEventListener("click", () => download(t("reportFilename"), $("report").textContent));
}

function restoreTheme() {
  const saved = localStorage.getItem("thn_ai_trader_theme_v3");
  if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved;
}

restoreTheme();
translateStaticDom();
restoreSetup();
initEvents();
checkHealth();
renderJournal();
loadChart();
