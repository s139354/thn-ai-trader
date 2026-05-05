const $ = id => document.getElementById(id);
const journalKey = "thn_ai_trader_journal_v3";
const setupKey = "thn_ai_trader_setup_v3";
const langKey = "thn_ai_trader_language_v3";
const watchlistKey = "thn_ai_trader_watchlist_v1";
const watchSettingsKey = "thn_ai_trader_watch_settings_v1";
const watchNotifyKey = "thn_ai_trader_watch_notifications_v1";
const mapLayerKey = "thn_ai_trader_map_layers_v6";
let mapLayerPrefs = null;
let watchScanTimer = null;
let watchScanResults = [];
let currentAnalysis = null;
let tvWidget = null;
let currentLang = localStorage.getItem(langKey) || "en";

const I18N = {
  en: {
    brandTagline: "AI-powered market intelligence",
    navDashboard: "Dashboard",
    navAnalysis: "AI Analysis",
    navWatchlist: "Watchlist",
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
    statusWait: "WAIT",
    watchlistEyebrow: "Automation center",
    favoritePairs: "Favorite Pairs Watchlist",
    localBrowserStorage: "Saved locally",
    watchlistIntro: "Add the markets you trade most. THN will scan them as a professional alert workflow instead of blindly opening live trades.",
    favoritePlaceholder: "EURUSD, GBPUSD, XAUUSD",
    addPair: "Add Pair",
    alertMode: "Alert-only automation",
    continuousScanner: "Continuous Opportunity Scanner",
    scannerStopped: "Stopped",
    scannerRunning: "Running",
    minConfidence: "Minimum confidence",
    scanEvery: "Scan every",
    oneMinute: "1 minute",
    threeMinutes: "3 minutes",
    fiveMinutes: "5 minutes",
    fifteenMinutes: "15 minutes",
    scanNow: "Scan Now",
    startScanner: "Start Scanner",
    stopScanner: "Stop Scanner",
    watchReady: "Add pairs, then scan for strong opportunities.",
    automationDisclaimer: "Professional safety: this prototype sends alerts only. Live auto-execution requires broker API integration, user authorization, audit logs, kill switches, and regulated compliance controls.",
    noPairsYet: "No favorite pairs yet.",
    analyzePair: "Analyze",
    removePair: "Remove",
    scanStarted: "Continuous scanner started.",
    scanStopped: "Scanner stopped.",
    scanningWatchlist: "Scanning {count} favorite markets...",
    scanComplete: "Scan complete: {alerts} alert(s) from {count} markets.",
    watchlistEmpty: "Add at least one favorite pair first.",
    strongAlert: "Strong alert",
    qualifiedAlert: "Qualified alert",
    reviewOnly: "Review only",
    noTrade: "No trade",
    trustScore: "Trust score",
    alertEntry: "Entry",
    alertSL: "SL",
    alertTP: "TP1",
    alertReason: "Reason",
    lastScan: "Last scan",
    alertOnly: "Alert only",
    browserNotificationTitle: "THN strong trading alert",
    browserNotificationBody: "{symbol}: {decision} with {confidence}% confidence. Review before execution."
  },
  ar: {
    brandTagline: "ذكاء سوقي مدعوم بالذكاء الاصطناعي",
    navDashboard: "لوحة التحكم",
    navAnalysis: "تحليل الذكاء الاصطناعي",
    navWatchlist: "قائمة المتابعة",
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
    statusWait: "انتظار",
    watchlistEyebrow: "مركز الأتمتة",
    favoritePairs: "قائمة أزواج العملات المفضلة",
    localBrowserStorage: "محفوظ محليًا",
    watchlistIntro: "أضف الأسواق التي تتداولها كثيرًا. سيقوم THN بفحصها كمسار تنبيهات احترافي بدل فتح صفقات حية بشكل عشوائي.",
    favoritePlaceholder: "EURUSD, GBPUSD, XAUUSD",
    addPair: "إضافة زوج",
    alertMode: "أتمتة التنبيهات فقط",
    continuousScanner: "ماسح الفرص المستمر",
    scannerStopped: "متوقف",
    scannerRunning: "يعمل",
    minConfidence: "الحد الأدنى للثقة",
    scanEvery: "الفحص كل",
    oneMinute: "دقيقة واحدة",
    threeMinutes: "3 دقائق",
    fiveMinutes: "5 دقائق",
    fifteenMinutes: "15 دقيقة",
    scanNow: "افحص الآن",
    startScanner: "تشغيل الماسح",
    stopScanner: "إيقاف الماسح",
    watchReady: "أضف الأزواج ثم افحص الفرص القوية.",
    automationDisclaimer: "سلامة احترافية: هذا النموذج يرسل تنبيهات فقط. التنفيذ الحي يحتاج ربط وسيط، تفويض المستخدم، سجلات تدقيق، مفاتيح إيقاف، وضوابط امتثال.",
    noPairsYet: "لا توجد أزواج مفضلة بعد.",
    analyzePair: "تحليل",
    removePair: "حذف",
    scanStarted: "تم تشغيل الماسح المستمر.",
    scanStopped: "تم إيقاف الماسح.",
    scanningWatchlist: "جارٍ فحص {count} سوقًا مفضلًا...",
    scanComplete: "اكتمل الفحص: {alerts} تنبيه من أصل {count} سوق.",
    watchlistEmpty: "أضف زوجًا مفضلًا واحدًا على الأقل.",
    strongAlert: "تنبيه قوي",
    qualifiedAlert: "تنبيه مؤهل",
    reviewOnly: "للمراجعة فقط",
    noTrade: "لا توجد صفقة",
    trustScore: "درجة الثقة التشغيلية",
    alertEntry: "دخول",
    alertSL: "وقف",
    alertTP: "هدف 1",
    alertReason: "السبب",
    lastScan: "آخر فحص",
    alertOnly: "تنبيه فقط",
    browserNotificationTitle: "تنبيه تداول قوي من THN",
    browserNotificationBody: "{symbol}: {decision} بثقة {confidence}%. راجع الصفقة قبل التنفيذ."
  }
};


Object.assign(I18N.en, {
  professionalMarketMap: "Professional Market Map",
  professionalMarketMapSub: "All schools, levels, patterns and trend diagnostics in one visual chart",
  exportMap: "Export Map PNG",
  confluenceMatrix: "Confluence Matrix",
  confluenceMatrixSub: "Execution readiness controls",
  marketRegime: "Market Regime",
  executionReadiness: "Execution Readiness",
  schoolAgreement: "School Agreement",
  dataQuality: "Data Quality",
  riskQuality: "Risk Quality",
  sessionQuality: "Session Quality",
  mappedPatterns: "Mapped Patterns",
  mappedLevels: "Mapped Levels",
  supportClusters: "Support Clusters",
  resistanceClusters: "Resistance Clusters",
  supplyDemandZones: "Supply / Demand Zones",
  fibonacciMap: "Fibonacci Map",
  trendChannel: "Trend Channel",
  volumeProfile: "Volume Profile",
  playbook: "Execution Playbook",
  playbookSub: "Professional action protocol",
  deskGovernance: "Desk Governance",
  deskGovernanceSub: "Trust, safety and operational filters",
  noProfessionalMap: "Run analysis to generate the professional market map.",
  mapLegendSupport: "Support",
  mapLegendResistance: "Resistance",
  mapLegendEntry: "Entry",
  mapLegendStop: "Stop",
  mapLegendTarget: "Target",
  mapLegendFib: "Fibonacci",
  mapLegendZone: "Supply/Demand",
  mapExported: "Market map exported.",
  professionalSnapshot: "Professional Snapshot",
  nearestSupport: "Nearest Support",
  nearestResistance: "Nearest Resistance",
  valueArea: "Value Area",
  volumeState: "Volume State",
  livePrice: "Live Price",
  quality: "Quality",
  notMapped: "Not mapped",
  outsideVisibleRange: "Outside visible range",
  analysisLayerBoard: "Analysis Layer Board",
  analysisLayerBoardSub: "Every school and diagnostic used by the engine",
  technicalStack: "Technical Stack",
  structureRead: "Structure Read",
  riskBox: "Risk Box",
  patternEngine: "Pattern Engine",
  noPatternConfirmation: "No pattern confirmation",
  analysisSummary: "Analysis Summary",
  direction: "Direction",
  rsi: "RSI",
  layerCandles: "Candles",
  layerEma: "EMA",
  layerLevels: "S/R",
  layerZones: "Zones",
  layerFib: "Fibonacci",
  layerRisk: "Risk",
  layerTrend: "Trend",
  layerVolume: "Volume",
  layerPatterns: "Patterns",
  institutionalChart: "Institutional chart",
  adaptiveScale: "Adaptive scale enabled",
  layerSmc: "SMC",
  technicalStoryboard: "Technical Storyboard",
  technicalStoryboardSub: "Institutional reading of the chart and execution context",
  marketStructureBoard: "Market Structure Board",
  marketStructureBoardSub: "SMC, order blocks, pivots and liquidity map",
  smcMap: "SMC Map",
  orderBlocks: "Order Blocks",
  liquidityMap: "Liquidity Map",
  momentumPane: "Momentum",
  aiAutomationStudio: "AI Automation Studio",
  aiAutomationStudioSub: "Automated copilot, smart alerts, risk governor and next-best action",
  noAutomationYet: "Awaiting analysis",
  automationScore: "Automation Score",
  nextBestAction: "Next Best Action",
  smartAlerts: "Smart Alerts",
  aiCopilot: "AI Copilot",
  riskGovernor: "Risk Governor",
  executionProtocol: "Execution Protocol",
  schoolBalance: "School Balance",
  technicalDrawingChart: "Technical Drawing Chart",
  clearInstitutionalView: "Clean institutional view",
  skAnalysisChart: "SK / SMC Analysis",
  skAnalysisSub: "Structure, liquidity, BOS/CHoCH and order blocks",
  tradeCompass: "Trade Compass"
});

Object.assign(I18N.ar, {
  professionalMarketMap: "خريطة السوق الاحترافية",
  professionalMarketMapSub: "كل المدارس والمستويات والنماذج والاتجاهات في شارت واحد",
  exportMap: "تصدير الخريطة PNG",
  confluenceMatrix: "مصفوفة التوافق",
  confluenceMatrixSub: "ضوابط جاهزية التنفيذ",
  marketRegime: "حالة السوق",
  executionReadiness: "جاهزية التنفيذ",
  schoolAgreement: "توافق المدارس",
  dataQuality: "جودة البيانات",
  riskQuality: "جودة المخاطر",
  sessionQuality: "جودة الجلسة",
  mappedPatterns: "النماذج المكتشفة",
  mappedLevels: "المستويات المرسومة",
  supportClusters: "تجمعات الدعم",
  resistanceClusters: "تجمعات المقاومة",
  supplyDemandZones: "مناطق العرض والطلب",
  fibonacciMap: "خريطة فيبوناتشي",
  trendChannel: "قناة الاتجاه",
  volumeProfile: "ملف الحجم",
  playbook: "بروتوكول التنفيذ",
  playbookSub: "خطة عمل احترافية",
  deskGovernance: "حوكمة منصة التداول",
  deskGovernanceSub: "مرشحات الثقة والسلامة والتشغيل",
  noProfessionalMap: "شغّل التحليل لإنشاء خريطة السوق الاحترافية.",
  mapLegendSupport: "دعم",
  mapLegendResistance: "مقاومة",
  mapLegendEntry: "دخول",
  mapLegendStop: "وقف",
  mapLegendTarget: "هدف",
  mapLegendFib: "فيبوناتشي",
  mapLegendZone: "عرض/طلب",
  mapExported: "تم تصدير خريطة السوق.",
  professionalSnapshot: "لقطة احترافية",
  nearestSupport: "أقرب دعم",
  nearestResistance: "أقرب مقاومة",
  valueArea: "منطقة القيمة",
  volumeState: "حالة الحجم",
  livePrice: "السعر الحالي",
  quality: "الجودة",
  notMapped: "غير مرسوم",
  outsideVisibleRange: "خارج النطاق المرئي",
  analysisLayerBoard: "لوحة طبقات التحليل",
  analysisLayerBoardSub: "كل مدرسة وتشخيص استخدمه المحرك",
  technicalStack: "الحزمة الفنية",
  structureRead: "قراءة الهيكل",
  riskBox: "صندوق المخاطر",
  patternEngine: "محرك النماذج",
  noPatternConfirmation: "لا يوجد تأكيد نموذج",
  analysisSummary: "ملخص التحليل",
  direction: "الاتجاه",
  rsi: "RSI",
  layerCandles: "الشموع",
  layerEma: "EMA",
  layerLevels: "د/م",
  layerZones: "المناطق",
  layerFib: "فيبوناتشي",
  layerRisk: "المخاطر",
  layerTrend: "الاتجاه",
  layerVolume: "الحجم",
  layerPatterns: "النماذج",
  institutionalChart: "شارت مؤسسي",
  adaptiveScale: "المقياس الذكي مفعل",
  layerSmc: "SMC",
  technicalStoryboard: "لوحة القراءة الفنية",
  technicalStoryboardSub: "قراءة مؤسسية للشارت وسياق التنفيذ",
  marketStructureBoard: "لوحة هيكل السوق",
  marketStructureBoardSub: "سمارت موني، أوردر بلوك، محاور وسيولة",
  smcMap: "خريطة SMC",
  orderBlocks: "أوردر بلوك",
  liquidityMap: "خريطة السيولة",
  momentumPane: "الزخم",
  aiAutomationStudio: "استوديو الأتمتة الذكية",
  aiAutomationStudioSub: "مساعد آلي، تنبيهات ذكية، حوكمة مخاطر وأفضل خطوة تالية",
  noAutomationYet: "بانتظار التحليل",
  automationScore: "درجة الأتمتة",
  nextBestAction: "أفضل خطوة تالية",
  smartAlerts: "تنبيهات ذكية",
  aiCopilot: "المساعد الذكي",
  riskGovernor: "حوكمة المخاطر",
  executionProtocol: "بروتوكول التنفيذ",
  schoolBalance: "توازن المدارس",
  technicalDrawingChart: "شارت الرسم الفني",
  clearInstitutionalView: "عرض مؤسسي واضح",
  skAnalysisChart: "تحليل SK / SMC",
  skAnalysisSub: "هيكل، سيولة، BOS/CHoCH وأوردر بلوك",
  tradeCompass: "بوصلة الصفقة"
});

const schoolNameMap = {
  "Technical Analysis": { ar: "التحليل الفني" },
  "Price Action": { ar: "البرايس أكشن" },
  "Smart Money Concepts": { ar: "مفاهيم السمارت موني" },
  "Quantitative Model": { ar: "النموذج الكمي" },
  "Sentiment & Fundamental Context": { ar: "السياق الأساسي والشعوري" },
  "Fundamental / Sentiment Context": { ar: "السياق الأساسي والشعوري" },
  "Pattern Recognition": { ar: "التعرف على النماذج" },
  "Volume & Volatility": { ar: "الحجم والتذبذب" },
  "Risk Governance": { ar: "حوكمة المخاطر" }
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
  renderWatchlist();
  renderAlerts();
  scannerRunning(Boolean(watchScanTimer));
  renderMapLayerButtons();
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
  renderProfessionalLayer(a);
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


function pctClass(score) {
  const n = Number(score || 0);
  return n >= 75 ? "pass" : n >= 55 ? "warning" : "wait";
}

function renderProfessionalLayer(a) {
  const p = a.professional || {};
  renderProfessionalSnapshot(a, p);
  renderAIAutomationStudio(a, p);
  renderConfluenceMatrix(p);
  renderMarketMap(a, p);
  renderPlaybook(p);
}


function renderAIAutomationStudio(a, p) {
  const automation = a.aiAutomation || {};
  const badge = $("automationBadge");
  if (badge) badge.textContent = automation.botStatus || t("noAutomationYet");
  const grid = $("aiStudioGrid");
  if (grid) {
    const balance = automation.schoolBalance || {};
    const cards = [
      [t("aiCopilot"), automation.mode || "--", automation.botStatus || "--"],
      [t("automationScore"), `${fmt(automation.automationScore, 0)}/100`, `${t("executionReadiness")} ${fmt(p.executionReadiness, 0)}%`],
      [t("nextBestAction"), automation.nextBestAction || t("runAnalysisFirst"), automation.chartBrief?.technical || "--"],
      [t("schoolBalance"), `B ${balance.bullish || 0} / S ${balance.bearish || 0} / N ${balance.neutral || 0}`, automation.chartBrief?.sk || "--"],
      [t("riskGovernor"), automation.riskGovernor?.maxRiskPct || "--", automation.riskGovernor?.exposureState || "--"],
      [t("executionProtocol"), (automation.executionProtocol || [])[0] || "--", (automation.executionProtocol || []).slice(1, 3).join(" · ") || "--"]
    ];
    grid.innerHTML = cards.map(([label, value, detail]) => `<div class="ai-studio-card"><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b><small>${escapeHtml(detail)}</small></div>`).join("");
  }
  const alerts = $("smartAlertList");
  if (alerts) {
    alerts.innerHTML = `<div class="smart-alert-title"><b>${escapeHtml(t("smartAlerts"))}</b><span>${escapeHtml(t("alertOnly"))}</span></div>` + (automation.smartAlerts || []).map(alert => `
      <div class="smart-alert-row">
        <div><b>${escapeHtml(alert.name || "--")}</b><small>${escapeHtml(alert.condition || "--")}</small></div>
        <strong>${escapeHtml(alert.priority || "--")}</strong>
        <span>${escapeHtml(alert.trigger ? fmt(alert.trigger, a.indicators?.price >= 1 ? 5 : 6) : "AUTO")}</span>
      </div>`).join("");
  }
}

function renderProfessionalSnapshot(a, p) {
  const levels = p.levels || {};
  const vp = p.volumeProfile || {};
  const nearestSupport = levels.supports?.[0]?.price ?? a.structure?.support;
  const nearestResistance = levels.resistances?.[0]?.price ?? a.structure?.resistance;
  const cards = [
    [t("executionReadiness"), `${fmt(p.executionReadiness, 0)}%`, p.marketRegime || "--"],
    [t("schoolAgreement"), `${fmt(p.schoolAgreement, 0)}%`, `${(a.schools || []).length} modules`],
    [t("nearestSupport"), fmt(nearestSupport, 6), `${levels.supports?.[0]?.touches || 1} touches`],
    [t("nearestResistance"), fmt(nearestResistance, 6), `${levels.resistances?.[0]?.touches || 1} touches`],
    [t("volumeState"), vp.volumeState || "--", `x${fmt(vp.volumeRatio, 2)}`],
    [t("sessionQuality"), `${fmt(p.session?.timingQuality, 0)}%`, p.session?.session || "--"]
  ];
  const target = $("professionalSnapshot");
  if (!target) return;
  target.innerHTML = cards.map(([label, value, detail]) => `<div class="snapshot-card ${pctClass(String(value).replace('%',''))}">
    <span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b><small>${escapeHtml(detail)}</small>
  </div>`).join("");
}

function renderConfluenceMatrix(p) {
  const target = $("confluenceMatrix");
  if (!target) return;
  target.innerHTML = (p.confluence || []).map(item => `<div class="confluence-row">
    <div><b>${escapeHtml(currentLang === "ar" ? confluenceNameAr(item.name) : item.name)}</b><small>${escapeHtml(currentLang === "ar" ? confluenceDetailAr(item) : item.detail)}</small></div>
    <div class="scorebar"><span style="width:${Math.max(0, Math.min(100, Number(item.score || 0)))}%"></span></div>
    <strong class="${escapeHtml(String(item.status || 'WAIT').toLowerCase())}">${escapeHtml(localizedValue(item.status || "WAIT"))} · ${fmt(item.score, 0)}</strong>
  </div>`).join("") || `<p class="tiny">${t("noProfessionalMap")}</p>`;
}

function confluenceNameAr(name) {
  const map = {
    "Multi-school agreement": "توافق المدارس",
    "Data quality": "جودة البيانات",
    "Risk governance": "حوكمة المخاطر",
    "Structure quality": "جودة الهيكل",
    "Timing session": "توقيت الجلسة"
  };
  return map[name] || name;
}

function confluenceDetailAr(item) {
  const n = String(item.name || "");
  if (n.includes("school")) return "نسبة المدارس المتفقة مع اتجاه القرار الحالي.";
  if (n.includes("Data")) return "تقييم صلاحية بيانات السوق المستخدمة في التحليل.";
  if (n.includes("Risk")) return "فحص المخاطرة والتعرض قبل التنفيذ.";
  if (n.includes("Structure")) return "جودة الدعم والمقاومة والاتجاه الحالي.";
  if (n.includes("Timing")) return "تقييم ملاءمة جلسة التداول الحالية.";
  return item.detail || "--";
}

function renderPlaybook(p) {
  const playbook = $("playbookList");
  const governance = $("governanceList");
  if (playbook) {
    playbook.innerHTML = (p.playbook || []).map((x, idx) => `<li>${escapeHtml(currentLang === "ar" ? playbookAr(idx) : x)}</li>`).join("") || `<li>${t("noProfessionalMap")}</li>`;
  }
  if (governance) {
    governance.innerHTML = (p.professionalChecklist || []).map(x => `<div class="governance-item">
      <b>${escapeHtml(currentLang === "ar" ? checklistItemAr(x) : x.item)}</b>
      <span class="${escapeHtml(String(x.status || 'WAIT').toLowerCase())}">${escapeHtml(localizedValue(x.status || "WAIT"))}</span>
      <small>${escapeHtml(currentLang === "ar" ? checklistDetailAr(x) : x.detail)}</small>
    </div>`).join("") || `<p class="tiny">${t("noProfessionalMap")}</p>`;
  }
}

function playbookAr(idx) {
  const lines = [
    "انتظر تأكيدًا واضحًا من الشمعة أو كسر/ارتداد من مستوى مرسوم قبل الدخول.",
    "لا تدخل مباشرة في دعم أو مقاومة قريبة دون إغلاق مؤكد وحجم مناسب.",
    "بعد الهدف الأول، قيّم نقل الوقف إلى التعادل فقط إذا تحسن الهيكل.",
    "إذا بقي القرار انتظارًا، فعّل التنبيهات بدل تنفيذ صفقة ضعيفة."
  ];
  return lines[idx % lines.length];
}

function renderMarketMap(a, p) {
  const map = p.analysisMap || {};
  const canvas = $("analysisMapCanvas");
  if (!canvas) return;
  const meta = drawAnalysisMap(canvas, a, map, p);
  renderMapHud(a, p, meta);
  renderMapDetails(a, p, meta);
  drawSkAnalysisMap($("skAnalysisCanvas"), a, map, p, meta);
  renderTradeCompass(a, p, meta);
  renderAnalysisLayerBoard(a, p, meta);
  renderTechnicalStoryboard(a, p, meta);
  renderStructureBoard(a, p, meta);
}

function renderMapHud(a, p, meta = {}) {
  const target = $("mapHud");
  if (!target) return;
  const vp = p.volumeProfile || {};
  const trend = p.trend || {};
  const decisionClass = String(a.decision || "WAIT").toLowerCase();
  target.innerHTML = `
    <div class="map-hud-card ${escapeHtml(decisionClass)}"><span>${escapeHtml(t("livePrice"))}</span><b>${escapeHtml(fmt(meta.price, meta.precision || 5))}</b><small>${escapeHtml(a.symbol || "--")}</small></div>
    <div class="map-hud-card"><span>${escapeHtml(t("trendChannel"))}</span><b>${escapeHtml(localizedValue(trend.direction || "--"))}</b><small>${escapeHtml(t("quality"))}: ${escapeHtml(fmt(trend.channelQuality, 0))}%</small></div>
    <div class="map-hud-card"><span>${escapeHtml(t("nearestSupport"))}</span><b>${escapeHtml(meta.nearestSupport ? fmt(meta.nearestSupport.price, meta.precision || 5) : "--")}</b><small>${escapeHtml(meta.nearestSupport ? `${meta.nearestSupport.touches || 1}x · ${fmt(Math.abs(meta.nearestSupport.distancePct || 0), 2)}%` : t("notMapped"))}</small></div>
    <div class="map-hud-card"><span>${escapeHtml(t("nearestResistance"))}</span><b>${escapeHtml(meta.nearestResistance ? fmt(meta.nearestResistance.price, meta.precision || 5) : "--")}</b><small>${escapeHtml(meta.nearestResistance ? `${meta.nearestResistance.touches || 1}x · ${fmt(Math.abs(meta.nearestResistance.distancePct || 0), 2)}%` : t("notMapped"))}</small></div>
    <div class="map-hud-card"><span>${escapeHtml(t("volumeProfile"))}</span><b>${escapeHtml(vp.volumeState || "--")}</b><small>x${escapeHtml(fmt(vp.volumeRatio, 2))} · ${escapeHtml(t("valueArea"))} ${escapeHtml(fmt(vp.valueAreaPosition, 0))}%</small></div>
  `;
}

function renderMapDetails(a, p, meta = {}) {
  const target = $("mapDetails");
  if (!target) return;
  const levels = p.levels || {};
  const zones = p.zones || [];
  const fib = (p.fibonacci || []).filter(x => meta.inView ? meta.inView(x.price) : true);
  const patterns = p.patterns || [];
  const precision = meta.precision || 5;
  const blocks = [
    [t("supportClusters"), (levels.supports || []).slice(0, 4).map(x => `${fmt(x.price, precision)} · ${x.touches}x · ${fmt(x.strength,0)}%`).join(" | ") || "--"],
    [t("resistanceClusters"), (levels.resistances || []).slice(0, 4).map(x => `${fmt(x.price, precision)} · ${x.touches}x · ${fmt(x.strength,0)}%`).join(" | ") || "--"],
    [t("mappedPatterns"), patterns.join(" | ") || "--"],
    [t("fibonacciMap"), fib.slice(0, 5).map(x => `${x.label} ${fmt(x.price, precision)}`).join(" | ") || t("outsideVisibleRange")],
    [t("supplyDemandZones"), zones.slice(0, 4).map(x => `${x.type} ${fmt(x.from, precision)}-${fmt(x.to, precision)} · ${fmt(x.strength,0)}%`).join(" | ") || "--"],
    [t("trendChannel"), `${p.trend?.direction || "--"} · ${fmt(p.trend?.slopePct, 5)}% · ${t("quality")} ${fmt(p.trend?.channelQuality, 0)}%`]
  ];
  target.innerHTML = blocks.map(([k, v]) => row(k, v)).join("");
}


function renderTechnicalStoryboard(a, p, meta = {}) {
  const target = $("technicalStoryboard");
  if (!target) return;
  const i = a.indicators || {};
  const s = a.structure || {};
  const trend = p.trend || {};
  const blocks = [
    [t("analysisSummary"), `${localizedValue(a.decision || "WAIT")} · ${fmt(a.confidence, 0)}% · ${a.grade || "--"}`],
    [t("technicalStack"), `${emaStackLabel(i)} · RSI ${fmt(i.rsi14, 1)} · MACD ${fmt(i.macdHistogram, 4)}`],
    [t("trendChannel"), `${localizedValue(trend.direction || "--")} · ${t("quality")} ${fmt(trend.channelQuality, 0)}%`],
    [t("mappedLevels"), `${t("nearestSupport")}: ${fmt(meta.nearestSupport?.price, meta.precision || 5)} · ${t("nearestResistance")}: ${fmt(meta.nearestResistance?.price, meta.precision || 5)}`],
    [t("riskBox"), `${t("entry")} ${fmt(a.entry, meta.precision || 5)} · ${t("stopLoss")} ${fmt(a.stopLoss, meta.precision || 5)} · RR 1:${fmt(a.risk?.rewardRisk, 2)}`],
    [t("momentumPane"), `${t("rangePosition")} ${fmt(s.rangePosition, 0)}% · ATR ${fmt(i.atrPct, 2)}% · ${i.volatilityLabel || i.volatility || "--"}`]
  ];
  target.innerHTML = `<div class="desk-panel-title"><b>${escapeHtml(t("technicalStoryboard"))}</b><span>${escapeHtml(t("technicalStoryboardSub"))}</span></div><div class="analysis-chip-grid">${blocks.map(([k,v]) => `<div class="analysis-chip"><span>${escapeHtml(k)}</span><b>${escapeHtml((v || '--').split(' · ')[0] || '--')}</b><small>${escapeHtml((v || '--').split(' · ').slice(1).join(' · ') || '--')}</small></div>`).join('')}</div>`;
}

function renderStructureBoard(a, p, meta = {}) {
  const target = $("marketStructureBoard");
  if (!target) return;
  const smc = p.smc || p.analysisMap?.smc || {};
  const sections = [
    [t("smcMap"), (smc.summary || []).join(" | ") || "--"],
    [t("mappedPatterns"), (p.patterns || []).join(" | ") || t("noPatternConfirmation")],
    [t("orderBlocks"), (smc.orderBlocks || []).map(x => `${x.type === 'BULLISH_OB' ? 'Bullish' : 'Bearish'} ${fmt(x.from, meta.precision || 5)}-${fmt(x.to, meta.precision || 5)} · ${fmt(x.strength,0)}%`).join(" | ") || "--"],
    [t("liquidityMap"), (smc.liquidityPools || []).map(x => `${x.type} ${fmt(x.price, meta.precision || 5)}`).join(" | ") || "--"],
    [t("structureRead"), (smc.pivots || []).map(x => `${x.label} ${fmt(x.price, meta.precision || 5)}`).join(" | ") || "--"]
  ];
  target.innerHTML = `<div class="desk-panel-title"><b>${escapeHtml(t("marketStructureBoard"))}</b><span>${escapeHtml(t("marketStructureBoardSub"))}</span></div><div class="desk-list">${sections.map(([k,v]) => `<div class="desk-list-row"><b>${escapeHtml(k)}</b><small>${escapeHtml(v || '--')}</small></div>`).join('')}</div>`;
}

function renderAnalysisLayerBoard(a, p, meta = {}) {
  const target = $("analysisLayerBoard");
  if (!target) return;
  const i = a.indicators || {};
  const s = a.structure || {};
  const risk = a.risk || {};
  const schools = (a.schools || []).map(school => `
    <div class="layer-card school-${escapeHtml(String(school.bias || "neutral").toLowerCase())}">
      <span>${escapeHtml(currentLang === "ar" ? localizedSchoolName(school.name) : school.name)}</span>
      <b>${escapeHtml(localizedValue(school.bias || "NEUTRAL"))}</b>
      <small>${escapeHtml(t("score"))}: ${escapeHtml(fmt(school.score, 0))}/100 · ${escapeHtml(t("direction"))}: ${escapeHtml(fmt(school.directionScore, 2))}</small>
    </div>`).join("");
  const diagnostics = [
    [t("technicalStack"), `${t("rsi")}: ${fmt(i.rsi14, 1)} · MACD ${fmt(i.macdHistogram, 5)} · EMA ${emaStackLabel(i)}`],
    [t("structureRead"), `${localizedValue(s.trendStructure || "--")} · ${t("rangePosition")} ${fmt(s.rangePosition, 1)}%`],
    [t("riskBox"), `${t("riskPercent")} ${fmt(risk.riskPct, 2)}% · RR 1:${fmt(risk.rewardRisk, 2)} · ${t("exposurePercent")} ${fmt(risk.exposurePct, 1)}%`],
    [t("patternEngine"), (p.patterns || []).join(" · ") || t("noPatternConfirmation")]
  ].map(([title, detail]) => `<div class="layer-card diagnostic"><span>${escapeHtml(title)}</span><b>${escapeHtml(detail.split(" · ")[0])}</b><small>${escapeHtml(detail.split(" · ").slice(1).join(" · ") || detail)}</small></div>`).join("");
  target.innerHTML = `<div class="layer-board-title"><b>${escapeHtml(t("analysisLayerBoard"))}</b><span>${escapeHtml(t("analysisLayerBoardSub"))}</span></div><div class="layer-board-grid">${diagnostics}${schools}</div>`;
}

function emaStackLabel(i) {
  const e20 = Number(i.ema20), e50 = Number(i.ema50), e200 = Number(i.ema200);
  if (![e20, e50, e200].every(Number.isFinite)) return "--";
  if (e20 > e50 && e50 > e200) return "Bullish stack";
  if (e20 < e50 && e50 < e200) return "Bearish stack";
  return "Mixed stack";
}

function getDefaultMapLayers() {
  return { candles: true, ema: true, levels: true, zones: false, fibonacci: false, risk: true, trend: true, volume: true, patterns: true, smc: false };
}

function getMapLayers() {
  if (mapLayerPrefs) return mapLayerPrefs;
  try {
    const saved = JSON.parse(localStorage.getItem(mapLayerKey) || "null");
    mapLayerPrefs = { ...getDefaultMapLayers(), ...(saved && typeof saved === "object" ? saved : {}) };
  } catch {
    mapLayerPrefs = getDefaultMapLayers();
  }
  return mapLayerPrefs;
}

function setMapLayer(name, value) {
  const current = getMapLayers();
  current[name] = Boolean(value);
  mapLayerPrefs = current;
  localStorage.setItem(mapLayerKey, JSON.stringify(current));
  renderMapLayerButtons();
  if (currentAnalysis) renderProfessionalLayer(currentAnalysis);
}

function renderMapLayerButtons() {
  const target = $("mapLayerControls");
  if (!target) return;
  const layers = getMapLayers();
  const defs = [
    ["candles", "layerCandles"], ["ema", "layerEma"], ["levels", "layerLevels"], ["zones", "layerZones"],
    ["fibonacci", "layerFib"], ["risk", "layerRisk"], ["trend", "layerTrend"], ["volume", "layerVolume"], ["patterns", "layerPatterns"], ["smc", "layerSmc"]
  ];
  target.innerHTML = defs.map(([key, labelKey]) => `<button type="button" class="map-layer-pill ${layers[key] ? "active" : ""}" data-map-layer="${key}" aria-pressed="${layers[key] ? "true" : "false"}">${escapeHtml(t(labelKey))}</button>`).join("");
}

function initMapControls() {
  renderMapLayerButtons();
  $("mapLayerControls")?.addEventListener("click", event => {
    const btn = event.target.closest("[data-map-layer]");
    if (!btn) return;
    const key = btn.dataset.mapLayer;
    setMapLayer(key, !getMapLayers()[key]);
  });
}


function drawAnalysisMap(canvas, a, map, p = {}) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(980, Math.floor(rect.width || 1160));
  const height = Math.max(700, Math.floor(rect.height || 760));
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const layers = getMapLayers();
  const isLight = document.documentElement.dataset.theme === "light";
  const palette = chartPalette(isLight);
  const allCandles = (map.candles || a.candles || []).filter(c => [c.open, c.high, c.low, c.close].every(Number.isFinite));
  const visible = allCandles.slice(-84);
  const last = visible.at(-1) || {};
  const price = Number(map.price || a.entry || last.close || a.indicators?.price || 0);
  const precision = pricePrecision(price);
  drawChartBackground(ctx, width, height, palette);

  const metaBase = { price, precision, inView: () => false, nearestSupport: null, nearestResistance: null };
  if (!visible.length || !Number.isFinite(price)) {
    ctx.fillStyle = palette.muted; ctx.font = "14px Inter, Arial"; ctx.fillText(t("noProfessionalMap"), 74, 96); return metaBase;
  }

  const padL = 74, padR = 112, padT = 90, padB = 140;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const momentumH = 72;
  const volumeGap = 14;
  const volumeH = layers.volume ? 54 : 0;
  const priceH = chartH - momentumH - (layers.volume ? volumeGap + volumeH : 0) - 18;
  const momentumTop = padT + priceH + 18;
  const volumeTop = momentumTop + momentumH + (layers.volume ? volumeGap : 0);
  const high = Math.max(...visible.map(c => Number(c.high)));
  const low = Math.min(...visible.map(c => Number(c.low)));
  const candleSpan = Math.max(high - low, Math.abs(price) * 0.0005, Number(map.atr || 0) * 3, 1e-9);
  const tolerance = Math.max(candleSpan * 2.2, Math.abs(price) * 0.012, Number(map.atr || 0) * 12);
  const withinFocus = v => Number.isFinite(Number(v)) && Number(v) >= low - tolerance && Number(v) <= high + tolerance;
  const nearbyOverlayValues = [
    ...(layers.levels ? [...(map.supports || []).map(x => x.price), ...(map.resistances || []).map(x => x.price)] : []),
    ...(layers.zones ? (map.zones || []).flatMap(z => [z.from, z.to]) : []),
    ...(layers.fibonacci ? (map.fibonacci || []).map(x => x.price) : []),
    ...(layers.smc ? [...((map.smc?.orderBlocks || []).flatMap(z => [z.from, z.to])), ...((map.smc?.liquidityPools || []).map(x => x.price))] : []),
    ...(layers.trend ? [map.trend?.upper, map.trend?.mid, map.trend?.lower] : []),
    ...(layers.risk ? [a.entry, a.stopLoss, ...(a.targets || [])] : []),
    ...(layers.zones ? [p.volumeProfile?.valueAreaLow, p.volumeProfile?.valueAreaHigh] : [])
  ].map(Number).filter(withinFocus);
  const yMinRaw = Math.min(low, ...nearbyOverlayValues);
  const yMaxRaw = Math.max(high, ...nearbyOverlayValues);
  const span = Math.max(yMaxRaw - yMinRaw, candleSpan, Math.abs(price) * 0.0008, 1e-9);
  const yMin = yMinRaw - span * 0.11;
  const yMax = yMaxRaw + span * 0.11;
  const xFor = i => padL + (i / Math.max(1, visible.length - 1)) * chartW;
  const yFor = value => padT + (1 - ((Number(value) - yMin) / (yMax - yMin))) * priceH;
  const inView = value => Number.isFinite(Number(value)) && Number(value) >= yMin && Number(value) <= yMax;

  const supports = (map.supports || []).filter(x => inView(x.price));
  const resistances = (map.resistances || []).filter(x => inView(x.price));
  const fibs = (map.fibonacci || []).filter(x => inView(x.price));
  const zones = (map.zones || []).filter(z => inView(z.from) || inView(z.to));
  const nearestSupport = (map.supports || []).slice().sort((a, b) => Math.abs(Number(a.price) - price) - Math.abs(Number(b.price) - price))[0] || null;
  const nearestResistance = (map.resistances || []).slice().sort((a, b) => Math.abs(Number(a.price) - price) - Math.abs(Number(b.price) - price))[0] || null;

  drawPriceGrid(ctx, { padL, padR, padT, chartW, priceH, width, yMin, yMax, yFor, precision, palette });
  drawSessionBands(ctx, { visible, padL, padT, priceH, xFor, palette });
  if (layers.zones) drawZones(ctx, zones, { padL, chartW, yFor, palette });
  if (layers.smc) drawSmcOverlay(ctx, map.smc || p.smc || {}, { padL, chartW, yFor, xFor, palette, visible, precision, inView });
  if (layers.zones && p.volumeProfile?.valueAreaLow && p.volumeProfile?.valueAreaHigh) drawValueArea(ctx, p.volumeProfile, { padL, chartW, yFor, palette, precision });
  if (layers.risk) drawRiskRewardBox(ctx, a, { padL, chartW, yFor, inView, palette, precision });
  if (layers.fibonacci) fibs.forEach(f => drawSmartLevel(ctx, yFor(f.price), padL, padL + chartW, palette.fib, `${t("mapLegendFib")} ${f.label}`, fmt(f.price, precision), true));
  if (layers.levels) supports.forEach(lvl => drawSmartLevel(ctx, yFor(lvl.price), padL, padL + chartW, palette.support, `${t("mapLegendSupport")} · ${lvl.touches}x`, fmt(lvl.price, precision), false, lvl.strength));
  if (layers.levels) resistances.forEach(lvl => drawSmartLevel(ctx, yFor(lvl.price), padL, padL + chartW, palette.resistance, `${t("mapLegendResistance")} · ${lvl.touches}x`, fmt(lvl.price, precision), false, lvl.strength));
  if (layers.trend) drawRegressionChannel(ctx, visible, { xFor, yFor, palette, priceH, padT });
  if (layers.ema) drawEmaStack(ctx, visible, { xFor, yFor, palette });
  if (layers.candles) drawProfessionalCandles(ctx, visible, { xFor, yFor, palette, chartW });
  drawMomentumPane(ctx, visible, { padL, padT: momentumTop, chartW, height: momentumH, xFor, palette });
  if (layers.volume) drawVolumePane(ctx, visible, { padL, padT: volumeTop, chartW, volumeH, xFor, palette });

  if (layers.risk) {
    if (inView(a.entry)) drawTaggedLevel(ctx, yFor(a.entry), padL, padL + chartW, palette.entry, `${t("mapLegendEntry")} ${fmt(a.entry, precision)}`, "left");
    if (inView(a.stopLoss)) drawTaggedLevel(ctx, yFor(a.stopLoss), padL, padL + chartW, palette.stop, `${t("mapLegendStop")} ${fmt(a.stopLoss, precision)}`, "right");
    (a.targets || []).slice(0, 3).forEach((tp, idx) => { if (inView(tp)) drawTaggedLevel(ctx, yFor(tp), padL, padL + chartW, palette.target, `${t("mapLegendTarget")} ${idx + 1} ${fmt(tp, precision)}`, "right"); });
  }
  drawCurrentPrice(ctx, price, { padL, chartW, yFor, inView, palette, precision });
  if (layers.patterns) drawPatternCallout(ctx, a, map, p, { width, height, padL, padR, padB, palette });
  drawChartHeader(ctx, a, p, map, { width, padL, padR, palette, precision });
  drawChartFooter(ctx, a, p, map, { width, height, padL, padR, palette, precision });
  return { price, precision, yMin, yMax, inView, nearestSupport, nearestResistance };
}



function renderTradeCompass(a, p, meta = {}) {
  const target = $("tradeCompass");
  if (!target) return;
  const automation = a.aiAutomation || {};
  const items = [
    [t("tradeCompass"), `${localizedValue(a.decision || "WAIT")} · ${fmt(a.confidence, 0)}%`],
    [t("automationScore"), `${fmt(automation.automationScore, 0)}/100`],
    [t("riskGovernor"), automation.riskGovernor?.maxRiskPct || "--"],
    [t("nextBestAction"), automation.nextBestAction || "--"]
  ];
  target.innerHTML = items.map(([k, v]) => `<div><span>${escapeHtml(k)}</span><b>${escapeHtml(v)}</b></div>`).join("");
}

function drawSkAnalysisMap(canvas, a, map, p = {}, meta = {}) {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(360, Math.floor(rect.width || 460));
  const height = Math.max(300, Math.floor(rect.height || 360));
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  const palette = chartPalette(document.documentElement.dataset.theme === "light");
  drawChartBackground(ctx, width, height, palette);
  const candles = (map.candles || a.candles || []).slice(-52);
  const smc = map.smc || p.smc || {};
  if (!candles.length) {
    ctx.fillStyle = palette.muted; ctx.font = "12px Inter, Arial"; ctx.fillText(t("noProfessionalMap"), 22, 44); return;
  }
  const padL = 38, padR = 52, padT = 54, padB = 44;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const high = Math.max(...candles.map(c => Number(c.high)), ...((smc.liquidityPools || []).map(x => Number(x.price))).filter(Number.isFinite));
  const low = Math.min(...candles.map(c => Number(c.low)), ...((smc.liquidityPools || []).map(x => Number(x.price))).filter(Number.isFinite));
  const span = Math.max(high - low, Math.abs(high) * 0.001, 1e-9);
  const yMin = low - span * 0.13;
  const yMax = high + span * 0.13;
  const xFor = i => padL + (i / Math.max(1, candles.length - 1)) * chartW;
  const yFor = value => padT + (1 - ((Number(value) - yMin) / (yMax - yMin))) * chartH;
  const inView = value => Number.isFinite(Number(value)) && Number(value) >= yMin && Number(value) <= yMax;
  ctx.save();
  ctx.strokeStyle = palette.grid; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (i / 4) * chartH;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + chartW, y); ctx.stroke();
  }
  ctx.fillStyle = palette.text; ctx.font = "900 14px Inter, Arial"; ctx.fillText(t("skAnalysisChart"), padL, 28);
  ctx.fillStyle = palette.muted; ctx.font = "10px Inter, Arial"; ctx.fillText((p.smc?.summary || []).slice(0, 2).join(" · ") || t("skAnalysisSub"), padL, 44);
  ctx.restore();

  drawMiniCandles(ctx, candles, { xFor, yFor, chartW, palette });
  (smc.orderBlocks || []).forEach(block => {
    if (!inView(block.from) && !inView(block.to)) return;
    const top = yFor(Math.max(block.from, block.to));
    const bottom = yFor(Math.min(block.from, block.to));
    ctx.save();
    ctx.fillStyle = block.type === 'BULLISH_OB' ? palette.smcAreaBull : palette.smcAreaBear;
    ctx.strokeStyle = block.type === 'BULLISH_OB' ? palette.smcBull : palette.smcBear;
    roundRect(ctx, padL + chartW * 0.45, top, chartW * 0.50, Math.max(7, bottom - top), 8, true, true);
    ctx.fillStyle = block.type === 'BULLISH_OB' ? palette.smcBull : palette.smcBear;
    ctx.font = "900 9px Inter, Arial"; ctx.fillText(block.type === 'BULLISH_OB' ? 'Bullish OB' : 'Bearish OB', padL + chartW * 0.48, top + 13);
    ctx.restore();
  });
  (smc.liquidityPools || []).forEach(pool => {
    if (!inView(pool.price)) return;
    const y = yFor(pool.price);
    ctx.save(); ctx.strokeStyle = palette.liquidity; ctx.setLineDash([3, 5]); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + chartW, y); ctx.stroke();
    ctx.setLineDash([]); ctx.fillStyle = palette.liquidity; ctx.font = "900 9px Inter, Arial"; ctx.fillText(pool.type, padL + chartW - 25, y - 5); ctx.restore();
  });
  (smc.smcEvents || []).forEach((evt, idx) => {
    if (!inView(evt.price)) return;
    const y = yFor(evt.price), x = padL + 16 + idx * 62;
    const color = evt.direction === 'BULLISH' ? palette.smcBull : palette.smcBear;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 48, y); ctx.stroke();
    ctx.fillStyle = color; ctx.font = "900 9px Inter, Arial"; ctx.fillText(evt.type, x + 4, y - 6); ctx.restore();
  });
  const pivots = (smc.pivots || []).slice(-6);
  pivots.forEach((pivot, idx) => {
    if (!inView(pivot.price)) return;
    const x = padL + 12 + (idx / Math.max(1, pivots.length - 1)) * (chartW - 24);
    const y = yFor(pivot.price);
    ctx.save(); ctx.fillStyle = pivot.kind === 'HIGH' ? palette.resistance : palette.support; ctx.font = "900 9px Inter, Arial";
    ctx.fillText(pivot.label, x, pivot.kind === 'HIGH' ? y - 7 : y + 13); ctx.restore();
  });
}

function drawMiniCandles(ctx, candles, cfg) {
  const candleW = Math.max(2.5, Math.min(7, cfg.chartW / candles.length * 0.58));
  candles.forEach((c, i) => {
    const x = cfg.xFor(i);
    const yH = cfg.yFor(c.high), yL = cfg.yFor(c.low), yO = cfg.yFor(c.open), yC = cfg.yFor(c.close);
    const up = c.close >= c.open;
    ctx.save();
    ctx.strokeStyle = up ? cfg.palette.support : cfg.palette.resistance;
    ctx.fillStyle = up ? "rgba(34,197,94,0.72)" : "rgba(239,68,68,0.72)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, yH); ctx.lineTo(x, yL); ctx.stroke();
    roundRect(ctx, x - candleW / 2, Math.min(yO, yC), candleW, Math.max(2, Math.abs(yC - yO)), 2, true, false);
    ctx.restore();
  });
}

function chartPalette(isLight) {
  return {
    bg1: isLight ? "#f8fafc" : "#071120",
    bg2: isLight ? "#eef2ff" : "#0d1730",
    panel: isLight ? "rgba(255,255,255,0.74)" : "rgba(255,255,255,0.045)",
    grid: isLight ? "rgba(15,23,42,0.10)" : "rgba(148,163,184,0.13)",
    axis: isLight ? "rgba(15,23,42,0.32)" : "rgba(148,163,184,0.28)",
    text: isLight ? "#0f172a" : "#eef7ff",
    muted: isLight ? "#64748b" : "#92a5c3",
    support: "#22c55e",
    resistance: "#ef4444",
    fib: "#fbbf24",
    entry: "#2bf5c7",
    stop: "#fb7185",
    target: "#38bdf8",
    trend: "#8b5cf6",
    ema20: "#2bf5c7",
    ema50: "#38bdf8",
    ema200: "#f59e0b",
    zoneDemand: "rgba(34,197,94,0.14)",
    zoneSupply: "rgba(239,68,68,0.14)",
    smcBull: "rgba(43,245,199,0.82)",
    smcBear: "rgba(251,113,133,0.82)",
    smcAreaBull: "rgba(43,245,199,0.12)",
    smcAreaBear: "rgba(251,113,133,0.12)",
    liquidity: "rgba(251,191,36,0.78)"
  };
}

function drawChartBackground(ctx, width, height, palette) {
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, palette.bg1);
  grad.addColorStop(1, palette.bg2);
  ctx.fillStyle = grad;
  roundRect(ctx, 0, 0, width, height, 24, true, false);
  ctx.fillStyle = "rgba(43,245,199,0.06)";
  ctx.beginPath(); ctx.arc(width * 0.14, 20, 180, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(56,189,248,0.055)";
  ctx.beginPath(); ctx.arc(width * 0.90, height * 0.15, 210, 0, Math.PI * 2); ctx.fill();
}

function drawPriceGrid(ctx, cfg) {
  const { padL, padR, padT, chartW, priceH, width, yMin, yMax, yFor, precision, palette } = cfg;
  ctx.save();
  ctx.strokeStyle = palette.grid; ctx.lineWidth = 1;
  ctx.fillStyle = palette.muted; ctx.font = "11px Inter, Arial"; ctx.textAlign = "left";
  for (let i = 0; i <= 6; i++) {
    const y = padT + (i / 6) * priceH;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(width - padR, y); ctx.stroke();
    const price = yMax - (i / 6) * (yMax - yMin);
    ctx.fillText(fmt(price, precision), width - padR + 13, y + 4);
  }
  for (let i = 0; i <= 6; i++) {
    const x = padL + (i / 6) * chartW;
    ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, padT + priceH); ctx.stroke();
  }
  ctx.strokeStyle = palette.axis;
  ctx.strokeRect(padL, padT, chartW, priceH);
  ctx.restore();
}

function drawSessionBands(ctx, cfg) {
  const { visible, padT, priceH, xFor, palette } = cfg;
  ctx.save();
  visible.forEach((c, i) => {
    const hour = new Date(c.time).getUTCHours();
    if (hour >= 7 && hour <= 16 && i % 2 === 0) {
      const x = xFor(i);
      ctx.fillStyle = "rgba(43,245,199,0.028)";
      ctx.fillRect(x - 4, padT, 8, priceH);
    }
  });
  ctx.restore();
}

function drawZones(ctx, zones, cfg) {
  const { padL, chartW, yFor, palette } = cfg;
  zones.slice(0, 5).forEach(z => {
    const top = yFor(Math.max(z.from, z.to));
    const bottom = yFor(Math.min(z.from, z.to));
    const h = Math.max(8, bottom - top);
    ctx.save();
    ctx.fillStyle = z.type === "DEMAND" ? palette.zoneDemand : palette.zoneSupply;
    roundRect(ctx, padL + 2, top, chartW - 4, h, 10, true, false);
    ctx.fillStyle = z.type === "DEMAND" ? palette.support : palette.resistance;
    ctx.font = "800 10px Inter, Arial";
    ctx.fillText(`${z.type} · ${fmt(z.strength,0)}%`, padL + 12, top + Math.min(h - 4, 15));
    ctx.restore();
  });
}

function drawValueArea(ctx, vp, cfg) {
  const { padL, chartW, yFor, palette, precision } = cfg;
  const top = yFor(Math.max(vp.valueAreaLow, vp.valueAreaHigh));
  const bottom = yFor(Math.min(vp.valueAreaLow, vp.valueAreaHigh));
  ctx.save();
  ctx.fillStyle = "rgba(139,92,246,0.08)";
  ctx.fillRect(padL, top, chartW, Math.max(6, bottom - top));
  ctx.strokeStyle = "rgba(139,92,246,0.45)"; ctx.setLineDash([7, 7]);
  ctx.strokeRect(padL, top, chartW, Math.max(6, bottom - top));
  ctx.fillStyle = palette.trend; ctx.font = "800 10px Inter, Arial";
  ctx.fillText(`${t("valueArea")} ${fmt(vp.valueAreaLow, precision)} - ${fmt(vp.valueAreaHigh, precision)}`, padL + 12, top - 5);
  ctx.restore();
}

function drawRiskRewardBox(ctx, a, cfg) {
  const { padL, chartW, yFor, inView, palette } = cfg;
  const entry = Number(a.entry), sl = Number(a.stopLoss), tp = Number((a.targets || [])[0]);
  if (!Number.isFinite(entry)) return;
  ctx.save();
  if (Number.isFinite(sl) && inView(entry) && inView(sl)) {
    const y1 = yFor(entry), y2 = yFor(sl);
    ctx.fillStyle = "rgba(251,113,133,0.09)";
    ctx.fillRect(padL, Math.min(y1, y2), chartW, Math.max(5, Math.abs(y2 - y1)));
  }
  if (Number.isFinite(tp) && inView(entry) && inView(tp)) {
    const y1 = yFor(entry), y2 = yFor(tp);
    ctx.fillStyle = "rgba(34,197,94,0.08)";
    ctx.fillRect(padL, Math.min(y1, y2), chartW, Math.max(5, Math.abs(y2 - y1)));
  }
  ctx.restore();
}

function drawRegressionChannel(ctx, candles, cfg) {
  const closes = candles.map(c => Number(c.close));
  const reg = linearRegressionLine(closes);
  const residuals = closes.map((v, i) => v - reg.valueAt(i));
  const dev = Math.max(std(residuals) * 1.45, 1e-9);
  const line = (offset, alpha, dash = []) => {
    ctx.save(); ctx.strokeStyle = `rgba(139,92,246,${alpha})`; ctx.lineWidth = offset ? 1.1 : 2; ctx.setLineDash(dash);
    ctx.beginPath();
    closes.forEach((_, i) => {
      const x = cfg.xFor(i), y = cfg.yFor(reg.valueAt(i) + offset);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke(); ctx.restore();
  };
  line(dev, 0.65, [8, 8]); line(0, 0.95, []); line(-dev, 0.65, [8, 8]);
  ctx.save(); ctx.fillStyle = cfg.palette.trend; ctx.font = "800 10px Inter, Arial";
  ctx.fillText(t("trendChannel"), cfg.xFor(1), cfg.yFor(reg.valueAt(1) + dev) - 8);
  ctx.restore();
}

function drawEmaStack(ctx, candles, cfg) {
  const closes = candles.map(c => Number(c.close));
  const lines = [[20, cfg.palette.ema20, "EMA20"], [50, cfg.palette.ema50, "EMA50"], [200, cfg.palette.ema200, "EMA200"]];
  lines.forEach(([period, color, label]) => {
    const arr = emaArray(closes, period);
    drawIndicatorLine(ctx, arr, cfg, color, label);
  });
}

function drawIndicatorLine(ctx, arr, cfg, color, label) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1.7; ctx.beginPath();
  let started = false;
  arr.forEach((v, i) => {
    if (!Number.isFinite(v)) return;
    const x = cfg.xFor(i), y = cfg.yFor(v);
    if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
  });
  ctx.stroke();
  const lastIndex = arr.findLastIndex?.(Number.isFinite) ?? arr.length - 1;
  if (lastIndex > 0) {
    ctx.fillStyle = color; ctx.font = "800 10px Inter, Arial"; ctx.fillText(label, cfg.xFor(Math.max(0, lastIndex - 6)), cfg.yFor(arr[lastIndex]) - 6);
  }
  ctx.restore();
}

function drawProfessionalCandles(ctx, candles, cfg) {
  const candleW = Math.max(3.5, Math.min(12, cfg.chartW / candles.length * 0.62));
  candles.forEach((c, i) => {
    const x = cfg.xFor(i);
    const yH = cfg.yFor(c.high), yL = cfg.yFor(c.low), yO = cfg.yFor(c.open), yC = cfg.yFor(c.close);
    const up = c.close >= c.open;
    ctx.save();
    ctx.strokeStyle = up ? cfg.palette.support : cfg.palette.resistance;
    ctx.fillStyle = up ? "rgba(34,197,94,0.92)" : "rgba(239,68,68,0.92)";
    ctx.lineWidth = i === candles.length - 1 ? 1.8 : 1;
    ctx.beginPath(); ctx.moveTo(x, yH); ctx.lineTo(x, yL); ctx.stroke();
    const bodyY = Math.min(yO, yC);
    const bodyH = Math.max(2.5, Math.abs(yC - yO));
    roundRect(ctx, x - candleW / 2, bodyY, candleW, bodyH, 3, true, false);
    if (i === candles.length - 1) {
      ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.strokeRect(x - candleW / 2 - 2, bodyY - 2, candleW + 4, bodyH + 4);
    }
    ctx.restore();
  });
}

function drawVolumePane(ctx, candles, cfg) {
  const vols = candles.map(c => Number(c.volume || 0));
  const maxVol = Math.max(...vols, 1);
  const barW = Math.max(3, Math.min(10, cfg.chartW / candles.length * 0.55));
  ctx.save();
  ctx.fillStyle = "rgba(148,163,184,0.08)";
  roundRect(ctx, cfg.padL, cfg.padT, cfg.chartW, cfg.volumeH, 12, true, false);
  candles.forEach((c, i) => {
    const h = (Number(c.volume || 0) / maxVol) * (cfg.volumeH - 8);
    ctx.fillStyle = c.close >= c.open ? "rgba(34,197,94,0.42)" : "rgba(239,68,68,0.42)";
    ctx.fillRect(cfg.xFor(i) - barW / 2, cfg.padT + cfg.volumeH - h - 4, barW, h);
  });
  ctx.fillStyle = cfg.palette.muted; ctx.font = "800 10px Inter, Arial"; ctx.fillText(t("volumeProfile"), cfg.padL + 10, cfg.padT + 15);
  ctx.restore();
}


function drawMomentumPane(ctx, candles, cfg) {
  const closes = candles.map(c => Number(c.close));
  const rsiVals = rsiArray(closes, 14);
  ctx.save();
  ctx.fillStyle = "rgba(148,163,184,0.06)";
  roundRect(ctx, cfg.padL, cfg.padT, cfg.chartW, cfg.height, 12, true, false);
  const yForRsi = v => cfg.padT + (1 - (v / 100)) * (cfg.height - 18) + 9;
  [30, 50, 70].forEach(level => {
    const y = yForRsi(level);
    ctx.strokeStyle = level === 50 ? "rgba(148,163,184,0.24)" : "rgba(148,163,184,0.16)";
    ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(cfg.padL, y); ctx.lineTo(cfg.padL + cfg.chartW, y); ctx.stroke();
    ctx.fillStyle = cfg.palette.muted; ctx.font = "10px Inter, Arial"; ctx.fillText(String(level), cfg.padL + cfg.chartW + 12, y + 4);
  });
  ctx.setLineDash([]);
  ctx.strokeStyle = cfg.palette.entry; ctx.lineWidth = 2; ctx.beginPath();
  let started = false;
  rsiVals.forEach((v, i) => {
    if (!Number.isFinite(v)) return;
    const x = cfg.xFor(i), y = yForRsi(v);
    if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = cfg.palette.text; ctx.font = "800 10px Inter, Arial"; ctx.fillText(`${t("momentumPane")} · RSI`, cfg.padL + 10, cfg.padT + 15);
  ctx.restore();
}


function drawSmcOverlay(ctx, smc, cfg) {
  ctx.save();
  (smc.orderBlocks || []).forEach(block => {
    if (!cfg.inView(block.from) && !cfg.inView(block.to)) return;
    const top = cfg.yFor(Math.max(block.from, block.to));
    const bottom = cfg.yFor(Math.min(block.from, block.to));
    const color = block.type === 'BULLISH_OB' ? cfg.palette.smcBull : cfg.palette.smcBear;
    const fill = block.type === 'BULLISH_OB' ? cfg.palette.smcAreaBull : cfg.palette.smcAreaBear;
    ctx.fillStyle = fill;
    ctx.strokeStyle = color;
    roundRect(ctx, cfg.padL + cfg.chartW * 0.62, top, cfg.chartW * 0.34, Math.max(8, bottom - top), 8, true, true);
    ctx.font = "900 10px Inter, Arial"; ctx.fillStyle = color;
    ctx.fillText(block.type === 'BULLISH_OB' ? 'Bullish OB' : 'Bearish OB', cfg.padL + cfg.chartW * 0.64, top + 14);
  });

  (smc.liquidityPools || []).forEach(pool => {
    if (!cfg.inView(pool.price)) return;
    const y = cfg.yFor(pool.price);
    ctx.strokeStyle = cfg.palette.liquidity; ctx.setLineDash([3, 5]); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(cfg.padL, y); ctx.lineTo(cfg.padL + cfg.chartW, y); ctx.stroke();
    ctx.setLineDash([]); ctx.fillStyle = cfg.palette.liquidity; ctx.font = "900 10px Inter, Arial";
    ctx.fillText(pool.type, cfg.padL + cfg.chartW - 34, y - 6);
  });

  (smc.smcEvents || []).forEach((evt, idx) => {
    if (!cfg.inView(evt.price)) return;
    const y = cfg.yFor(evt.price);
    const x = cfg.padL + cfg.chartW * (0.16 + idx * 0.12);
    const color = evt.direction === 'BULLISH' ? cfg.palette.smcBull : cfg.palette.smcBear;
    ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 84, y); ctx.stroke();
    ctx.fillStyle = color; ctx.font = "900 10px Inter, Arial"; ctx.fillText(evt.type, x + 6, y - 6);
  });

  const recentPivots = (smc.pivots || []).slice(-6);
  recentPivots.forEach((pivot, idx) => {
    if (!cfg.inView(pivot.price)) return;
    const x = cfg.padL + cfg.chartW * (0.10 + (idx / Math.max(5, recentPivots.length)) * 0.72);
    const y = cfg.yFor(pivot.price);
    ctx.fillStyle = pivot.kind === 'HIGH' ? cfg.palette.resistance : cfg.palette.support;
    ctx.font = "900 10px Inter, Arial";
    ctx.fillText(pivot.label, x, pivot.kind === 'HIGH' ? y - 8 : y + 14);
  });
  ctx.restore();
}

function rsiArray(closes, period = 14) {
  const out = new Array(closes.length).fill(null);
  for (let i = period; i < closes.length; i++) {
    let gains = 0, losses = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const diff = closes[j] - closes[j - 1];
      if (diff >= 0) gains += diff; else losses += Math.abs(diff);
    }
    out[i] = losses === 0 ? 100 : 100 - 100 / (1 + gains / losses);
  }
  return out;
}


function drawCurrentPrice(ctx, price, cfg) {
  if (!cfg.inView(price)) return;
  const y = cfg.yFor(price);
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.setLineDash([4, 6]); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cfg.padL, y); ctx.lineTo(cfg.padL + cfg.chartW, y); ctx.stroke();
  drawPricePill(ctx, cfg.padL + cfg.chartW + 8, y, fmt(price, cfg.precision), cfg.palette.text, cfg.palette.panel, cfg.palette.axis);
  ctx.restore();
}

function drawPatternCallout(ctx, a, map, p, cfg) {
  const patterns = (map.patterns || p.patterns || []).slice(0, 4);
  const schools = (a.schools || []).slice(0, 4).map(s => `${s.name}: ${s.bias}`);
  const lines = [patterns.length ? `${t("mappedPatterns")}: ${patterns.join(" · ")}` : `${t("mappedPatterns")}: ${t("noPatternConfirmation")}`, `${t("executionReadiness")}: ${fmt(p.executionReadiness,0)}% · ${t("schoolAgreement")}: ${fmt(p.schoolAgreement,0)}%`, ...schools];
  const boxW = Math.min(410, cfg.width - cfg.padL - cfg.padR - 24);
  const boxH = 86;
  const x = cfg.width - cfg.padR - boxW;
  const y = cfg.height - cfg.padB + 14;
  ctx.save();
  ctx.fillStyle = cfg.palette.panel; ctx.strokeStyle = cfg.palette.axis;
  roundRect(ctx, x, y, boxW, boxH, 16, true, true);
  ctx.fillStyle = cfg.palette.text; ctx.font = "900 11px Inter, Arial"; ctx.fillText(t("analysisSummary"), x + 14, y + 22);
  ctx.fillStyle = cfg.palette.muted; ctx.font = "10px Inter, Arial";
  lines.slice(0, 4).forEach((line, idx) => ctx.fillText(line.slice(0, 72), x + 14, y + 40 + idx * 13));
  ctx.restore();
}

function drawChartHeader(ctx, a, p, map, cfg) {
  const decision = String(a.decision || "WAIT");
  const color = decision === "BUY" ? cfg.palette.support : decision === "SELL" ? cfg.palette.resistance : cfg.palette.fib;
  ctx.save();
  ctx.fillStyle = cfg.palette.text; ctx.font = "900 18px Inter, Arial"; ctx.textAlign = "left";
  ctx.fillText(`${a.symbol || "--"} · ${localizedValue(decision)} · ${fmt(a.confidence, 0)}%`, cfg.padL, 33);
  ctx.fillStyle = cfg.palette.muted; ctx.font = "12px Inter, Arial";
  ctx.fillText(`${t("marketRegime")}: ${p.marketRegime || map.trend?.direction || "--"}`, cfg.padL, 54);
  drawHeaderBadge(ctx, cfg.width - cfg.padR - 144, 24, `${t("grade")} ${a.grade || "--"}`, color, cfg.palette);
  drawHeaderBadge(ctx, cfg.width - cfg.padR - 298, 24, `${t("executionReadiness")} ${fmt(p.executionReadiness,0)}%`, cfg.palette.entry, cfg.palette);
  ctx.restore();
}

function drawChartFooter(ctx, a, p, map, cfg) {
  const items = [`ATR ${fmt(map.atrPct, 3)}%`, `${t("rangePosition")} ${fmt(map.rangePosition, 1)}%`, `${t("sessionQuality")} ${fmt(p.session?.timingQuality, 0)}%`, `${t("dataQuality")} ${fmt(p.dataQuality, 0)}%`, `SMC ${(p.smc?.summary || []).length}`];
  ctx.save(); ctx.fillStyle = cfg.palette.muted; ctx.font = "11px Inter, Arial";
  ctx.fillText(items.join("  •  "), cfg.padL, cfg.height - 20);
  ctx.restore();
}

function drawHeaderBadge(ctx, x, y, label, color, palette) {
  ctx.save(); ctx.font = "900 10px Inter, Arial";
  const w = ctx.measureText(label).width + 20;
  ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.strokeStyle = color;
  roundRect(ctx, x, y, w, 26, 13, true, true);
  ctx.fillStyle = color; ctx.fillText(label, x + 10, y + 17);
  ctx.restore();
}

function drawSmartLevel(ctx, y, x1, x2, color, label, priceLabel, dashed, strength) {
  if (!Number.isFinite(y)) return;
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 1.35;
  if (dashed) ctx.setLineDash([8, 7]);
  ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
  ctx.setLineDash([]);
  if (strength) {
    ctx.globalAlpha = 0.11;
    ctx.fillStyle = color;
    roundRect(ctx, x1, y - 5, x2 - x1, 10, 5, true, false);
    ctx.globalAlpha = 1;
  }
  ctx.font = "900 10px Inter, Arial";
  const leftText = `${label}`;
  const w = ctx.measureText(leftText).width + 16;
  ctx.fillStyle = color;
  roundRect(ctx, x1 + 8, y - 21, w, 18, 8, true, false);
  ctx.fillStyle = "#06111f";
  ctx.fillText(leftText, x1 + 16, y - 8);
  drawPricePill(ctx, x2 + 8, y, priceLabel, color, "rgba(255,255,255,0.08)", color);
  ctx.restore();
}

function drawTaggedLevel(ctx, y, x1, x2, color, label, side = "right") {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 1.9;
  ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
  ctx.font = "900 11px Inter, Arial";
  const w = ctx.measureText(label).width + 18;
  const x = side === "left" ? x1 + 10 : x2 - w - 10;
  ctx.fillStyle = color;
  roundRect(ctx, x, y - 13, w, 25, 11, true, false);
  ctx.fillStyle = "#06111f";
  ctx.fillText(label, x + 9, y + 4);
  ctx.restore();
}

function drawPricePill(ctx, x, y, label, color, bg, border) {
  ctx.save(); ctx.font = "900 10px Inter, Arial";
  const w = ctx.measureText(label).width + 16;
  ctx.fillStyle = bg; ctx.strokeStyle = border;
  roundRect(ctx, x, y - 11, w, 22, 10, true, true);
  ctx.fillStyle = color; ctx.fillText(label, x + 8, y + 4);
  ctx.restore();
}

function linearRegressionLine(values) {
  const n = values.length;
  const xs = values.map((_, i) => i);
  const meanX = xs.reduce((a, b) => a + b, 0) / Math.max(1, n);
  const meanY = values.reduce((a, b) => a + b, 0) / Math.max(1, n);
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (xs[i] - meanX) * (values[i] - meanY); den += (xs[i] - meanX) ** 2; }
  const slope = den ? num / den : 0;
  const intercept = meanY - slope * meanX;
  return { slope, intercept, valueAt: i => intercept + slope * i };
}

function std(values) {
  const clean = values.filter(Number.isFinite);
  if (!clean.length) return 0;
  const avg = clean.reduce((a, b) => a + b, 0) / clean.length;
  return Math.sqrt(clean.reduce((acc, v) => acc + (v - avg) ** 2, 0) / clean.length);
}

function emaArray(values, period) {
  const k = 2 / (period + 1);
  const out = [];
  let prev = null;
  values.forEach((v, idx) => {
    if (!Number.isFinite(v)) { out.push(null); return; }
    prev = prev === null ? v : (v * k + prev * (1 - k));
    out.push(idx < Math.min(period, values.length) / 3 ? null : prev);
  });
  return out;
}

function pricePrecision(price) {
  const n = Math.abs(Number(price || 0));
  if (n >= 10000) return 1;
  if (n >= 100) return 2;
  if (n >= 10) return 3;
  if (n >= 1) return 5;
  return 6;
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function exportMarketMap() {
  const canvas = $("analysisMapCanvas");
  if (!canvas) return;
  const link = document.createElement("a");
  link.download = `thn-market-map-${currentAnalysis?.symbol || "analysis"}.png`;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  link.remove();
  status(t("mapExported"));
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


function normalizeSymbolInput(value) {
  return String(value || "").trim().toUpperCase().replace(/\s+/g, "");
}

function getWatchlist() {
  try {
    const parsed = JSON.parse(localStorage.getItem(watchlistKey) || "[]");
    if (Array.isArray(parsed)) return parsed.map(normalizeSymbolInput).filter(Boolean).slice(0, 25);
  } catch {
    localStorage.removeItem(watchlistKey);
  }
  return [];
}

function setWatchlist(items) {
  const clean = [...new Set((items || []).map(normalizeSymbolInput).filter(Boolean))].slice(0, 25);
  localStorage.setItem(watchlistKey, JSON.stringify(clean));
  renderWatchlist();
  return clean;
}

function getWatchSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(watchSettingsKey) || "{}");
    return {
      minConfidence: Number(saved.minConfidence || $("minConfidence")?.value || 72),
      scanEvery: Number(saved.scanEvery || $("scanEvery")?.value || 300000)
    };
  } catch {
    return { minConfidence: 72, scanEvery: 300000 };
  }
}

function saveWatchSettings() {
  const settings = {
    minConfidence: Number($("minConfidence")?.value || 72),
    scanEvery: Number($("scanEvery")?.value || 300000)
  };
  localStorage.setItem(watchSettingsKey, JSON.stringify(settings));
  return settings;
}

function restoreWatchSettings() {
  const settings = getWatchSettings();
  if ($("minConfidence")) $("minConfidence").value = settings.minConfidence;
  if ($("scanEvery")) $("scanEvery").value = String(settings.scanEvery);
}

function addFavoriteSymbol(value) {
  const symbols = String(value || "").split(/[,\s]+/).map(normalizeSymbolInput).filter(Boolean);
  if (!symbols.length) return;
  const next = setWatchlist([...getWatchlist(), ...symbols]);
  if ($("favoriteSymbolInput")) $("favoriteSymbolInput").value = "";
  status(`${symbols.join(", ")} ${currentLang === "ar" ? "أضيفت إلى قائمة المتابعة." : "added to watchlist."}`);
  return next;
}

function removeFavoriteSymbol(symbol) {
  setWatchlist(getWatchlist().filter(item => item !== symbol));
  watchScanResults = watchScanResults.filter(item => item.requestedSymbol !== symbol && item.symbol !== symbol);
  renderAlerts();
}

function renderWatchlist() {
  if (!$("watchlistList")) return;
  const pairs = getWatchlist();
  $("watchlistList").innerHTML = pairs.map(symbol => `<div class="watch-item">
    <b>${escapeHtml(symbol)}</b>
    <span>${escapeHtml(t("alertOnly"))}</span>
    <div class="watch-actions">
      <button class="ghost small" type="button" data-watch-analyze="${escapeHtml(symbol)}">${escapeHtml(t("analyzePair"))}</button>
      <button class="ghost small danger" type="button" data-watch-remove="${escapeHtml(symbol)}">${escapeHtml(t("removePair"))}</button>
    </div>
  </div>`).join("") || `<p class="tiny">${escapeHtml(t("noPairsYet"))}</p>`;
}

function watchlistPayload() {
  return {
    symbols: getWatchlist(),
    timeframe: $("timeframe").value,
    accountBalance: Number($("accountBalance").value || 10000),
    riskPct: Number($("riskPct").value || 1),
    rewardRisk: Number($("rewardRisk").value || 2),
    sentiment: $("sentiment").value,
    minConfidence: Number($("minConfidence").value || 72)
  };
}

function scannerRunning(isRunning) {
  if ($("scannerBadge")) {
    $("scannerBadge").textContent = isRunning ? t("scannerRunning") : t("scannerStopped");
    $("scannerBadge").classList.toggle("running", isRunning);
  }
}

function setWatchStatus(message) {
  if ($("watchStatus")) $("watchStatus").textContent = message;
}

async function scanWatchlist() {
  const payload = watchlistPayload();
  if (!payload.symbols.length) {
    setWatchStatus(t("watchlistEmpty"));
    status(t("watchlistEmpty"));
    return;
  }
  saveWatchSettings();
  setWatchStatus(t("scanningWatchlist", { count: payload.symbols.length }));
  try {
    const res = await fetch("/api/watchlist/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.detail || data.error || "Watchlist scan failed");
    watchScanResults = data.results || [];
    renderAlerts(data.scannedAt);
    notifyStrongAlerts(watchScanResults.filter(item => item.automation?.active));
    const msg = t("scanComplete", { alerts: data.strongAlertCount || 0, count: data.count || payload.symbols.length });
    setWatchStatus(msg);
    status(msg);
  } catch (error) {
    setWatchStatus(`${t("errorPrefix")}: ${error.message}`);
  }
}

function alertLabel(item) {
  if (item.automation?.severity === "strong-entry") return t("strongAlert");
  if (item.automation?.severity === "qualified-entry") return t("qualifiedAlert");
  if (item.decision === "BUY" || item.decision === "SELL") return t("reviewOnly");
  return t("noTrade");
}

function renderAlerts(scannedAt) {
  if (!$("alertList")) return;
  const sorted = [...watchScanResults].sort((a, b) => (b.automation?.trustScore || 0) - (a.automation?.trustScore || 0));
  $("alertList").innerHTML = sorted.map(item => {
    const auto = item.automation || {};
    const active = auto.active ? " active" : "";
    const firstReason = auto.active ? auto.summary : (auto.blockedReasons?.[0] || auto.summary || t("noMajorWarnings"));
    return `<article class="alert-card${active}">
      <div class="alert-title">
        <div><b>${escapeHtml(item.symbol || item.requestedSymbol)}</b><span>${escapeHtml(alertLabel(item))}</span></div>
        <strong class="decision ${String(item.decision || "WAIT").toLowerCase()}">${escapeHtml(localizedValue(item.decision || "WAIT"))}</strong>
      </div>
      <div class="alert-metrics">
        <span>${escapeHtml(t("confidenceLabel"))}: <b>${fmt(item.confidence, 0)}%</b></span>
        <span>${escapeHtml(t("trustScore"))}: <b>${fmt(auto.trustScore, 0)}/100</b></span>
        <span>${escapeHtml(t("grade"))}: <b>${escapeHtml(item.grade || "--")}</b></span>
      </div>
      <div class="alert-levels">
        <span>${escapeHtml(t("alertEntry"))}: <b>${fmt(item.entry, 6)}</b></span>
        <span>${escapeHtml(t("alertSL"))}: <b>${item.stopLoss ? fmt(item.stopLoss, 6) : "--"}</b></span>
        <span>${escapeHtml(t("alertTP"))}: <b>${item.targets?.[0] ? fmt(item.targets[0], 6) : "--"}</b></span>
      </div>
      <p>${escapeHtml(firstReason)}</p>
    </article>`;
  }).join("") || `<p class="tiny">${escapeHtml(t("watchReady"))}</p>`;
  if (scannedAt) {
    const date = new Date(scannedAt).toLocaleString(currentLang === "ar" ? "ar-OM" : undefined);
    setWatchStatus(`${t("lastScan")}: ${date}`);
  }
}

function getNotifyCache() {
  try {
    return JSON.parse(localStorage.getItem(watchNotifyKey) || "{}");
  } catch {
    return {};
  }
}

function notifyStrongAlerts(alerts) {
  if (!alerts.length || typeof Notification === "undefined" || Notification.permission !== "granted") return;
  const cache = getNotifyCache();
  const now = Date.now();
  for (const item of alerts) {
    const key = `${item.symbol}-${item.decision}`;
    if (cache[key] && now - cache[key] < 15 * 60 * 1000) continue;
    cache[key] = now;
    new Notification(t("browserNotificationTitle"), {
      body: t("browserNotificationBody", { symbol: item.symbol, decision: localizedValue(item.decision), confidence: fmt(item.confidence, 0) })
    });
  }
  localStorage.setItem(watchNotifyKey, JSON.stringify(cache));
}

function startScanner() {
  const pairs = getWatchlist();
  if (!pairs.length) {
    setWatchStatus(t("watchlistEmpty"));
    return;
  }
  saveWatchSettings();
  stopScanner(false);
  const interval = Math.max(60000, Number($("scanEvery").value || 300000));
  watchScanTimer = setInterval(scanWatchlist, interval);
  scannerRunning(true);
  setWatchStatus(t("scanStarted"));
  status(t("scanStarted"));
  if (typeof Notification !== "undefined" && Notification.permission === "default") Notification.requestPermission().catch(() => {});
  scanWatchlist();
}

function stopScanner(showStatus = true) {
  if (watchScanTimer) clearInterval(watchScanTimer);
  watchScanTimer = null;
  scannerRunning(false);
  if (showStatus) {
    setWatchStatus(t("scanStopped"));
    status(t("scanStopped"));
  }
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
  document.querySelectorAll(".chip[data-symbol]").forEach(button => {
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
  $("addFavoriteBtn").addEventListener("click", () => addFavoriteSymbol($("favoriteSymbolInput").value));
  $("favoriteSymbolInput").addEventListener("keydown", event => {
    if (event.key === "Enter") addFavoriteSymbol($("favoriteSymbolInput").value);
  });
  document.querySelectorAll(".favorite-chip").forEach(button => {
    button.addEventListener("click", () => addFavoriteSymbol(button.dataset.favorite));
  });
  $("watchlistList").addEventListener("click", event => {
    const analyzeSymbol = event.target.closest("[data-watch-analyze]")?.dataset.watchAnalyze;
    const removeSymbol = event.target.closest("[data-watch-remove]")?.dataset.watchRemove;
    if (analyzeSymbol) {
      $("symbolInput").value = analyzeSymbol;
      analyze();
    }
    if (removeSymbol) removeFavoriteSymbol(removeSymbol);
  });
  $("scanWatchlistBtn").addEventListener("click", scanWatchlist);
  $("startScannerBtn").addEventListener("click", startScanner);
  $("stopScannerBtn").addEventListener("click", () => stopScanner(true));
  $("minConfidence").addEventListener("change", saveWatchSettings);
  $("scanEvery").addEventListener("change", saveWatchSettings);
  $("exportMapBtn")?.addEventListener("click", exportMarketMap);
  initMapControls();
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
restoreWatchSettings();
initEvents();
checkHealth();
renderJournal();
renderWatchlist();
renderAlerts();
scannerRunning(false);
loadChart();
