"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  Bot,
  Waves,
  Feather,
  CheckSquare,
  CloudSun,
  Bell,
  Receipt,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ArrowLeft,
  Sun,
  Moon,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  Sparkles,
  Plus,
  RefreshCw,
  Check,
  RotateCcw,
  Info,
} from "lucide-react";
import {
  dashboardTranslations,
  DashboardLanguage,
  DashboardContent,
} from "@/i18n/dashboardTranslations";
import { formatFarmerName } from "@/i18n/nameTransliteration";

export type AlertSeverity = "critical" | "warning" | "routine";
export type AlertDomain = "all" | "fisheries" | "poultry" | "weather";
export type AlertStatus = "active" | "acknowledged" | "resolved";

export interface FarmAlertItem {
  id: string;
  domain: "fisheries" | "poultry" | "weather";
  severity: AlertSeverity;
  status: AlertStatus;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  recommendedActionEn: string;
  recommendedActionHi: string;
  timestamp: string;
  location: string;
}

const INITIAL_ALERTS: FarmAlertItem[] = [
  {
    id: "alert-1",
    domain: "fisheries",
    severity: "critical",
    status: "active",
    titleEn: "Pond 2 Dissolved Oxygen Critical Drop (5.2 mg/L)",
    titleHi: "तालाब 2 में घुलित ऑक्सीजन स्तर में भारी गिरावट (5.2 मिग्रा/ली)",
    descriptionEn: "Dissolved oxygen measured below the ICAR safe threshold of 6.0 mg/L. Fish surfacing behavior detected.",
    descriptionHi: "घुलित ऑक्सीजन ICAR सुरक्षित सीमा 6.0 मिग्रा/ली से नीचे दर्ज की गई। मछलियों के सतह पर आने की संभावना।",
    recommendedActionEn: "Activate 2HP paddlewheel aerator immediately for 3 hours. Suspend morning floating feed ration.",
    recommendedActionHi: "तुरंत 2HP पैडल-व्हील एरेटर 3 घंटे के लिए चालू करें। प्रातःकालीन तैरता आहार स्थगित रखें।",
    timestamp: "25 mins ago",
    location: "Pond 2 - Pangasius Monoculture",
  },
  {
    id: "alert-2",
    domain: "poultry",
    severity: "warning",
    status: "active",
    titleEn: "Shed 2 Relative Humidity Alert (78% RH)",
    titleHi: "शेड 2 में सापेक्ष आर्द्रता चेतावनी (78% RH)",
    descriptionEn: "Relative humidity exceeded 70% standard ceiling. Damp litter poses risk of coccidiosis & ammonia spikes.",
    descriptionHi: "सापेक्ष आर्द्रता 70% मानक सीमा से अधिक हो गई है। गीले लीटर से अमोनिया गैस और संक्रमण का खतरा है।",
    recommendedActionEn: "Increase tunnel exhaust fan cycle to 80%. Rake litter bed and apply dry hydrated lime along water lines.",
    recommendedActionHi: "टनल एग्जॉस्ट पंखे 80% पर चलाएं। लीटर की रैकिंग करें और ड्रिंकर लाइन के नीचे सूखा चूना बुरकें।",
    timestamp: "1 hour ago",
    location: "Shed 2 - Cobb 500 Broilers",
  },
  {
    id: "alert-3",
    domain: "weather",
    severity: "warning",
    status: "active",
    titleEn: "Wind Velocity Surge (> 18 km/h) - Suspend Chemical Spray",
    titleHi: "तेज़ पवन गति चेतावनी (> 18 किमी/घंटा) - छिड़काव स्थगित करें",
    descriptionEn: "High ambient wind speed causes significant pesticide/sanitizer spray drift outside target zones.",
    descriptionHi: "तेज़ हवा के कारण कीटनाशक या सैनिटाइज़र स्प्रे लक्ष्य क्षेत्र से बाहर उड़ने का जोखिम है।",
    recommendedActionEn: "Delay scheduled orchard or pond dyke spray operations until wind subsides below 12 km/h.",
    recommendedActionHi: "हवा 12 किमी/घंटा से कम होने तक निर्धारित छिड़काव कार्य रोक कर रखें।",
    timestamp: "2 hours ago",
    location: "Farm Perimeter & Dykes",
  },
  {
    id: "alert-4",
    domain: "poultry",
    severity: "routine",
    status: "active",
    titleEn: "Broiler Starter Feed Reserve Depleting (3 Days Remaining)",
    titleHi: "ब्रायलर स्टार्टर दाना भंडार सीमित (केवल 3 दिन का स्टॉक)",
    descriptionEn: "Current consumption indicates starter mash supply will reach minimum reserve threshold in 72 hours.",
    descriptionHi: "वर्तमान दैनिक खपत अनुसार स्टार्टर दाने का स्टॉक 72 घंटे में न्यूनतम स्तर पर पहुँच जाएगा।",
    recommendedActionEn: "Place purchase order for 25 bags (50kg each) of pre-starter/starter feed with approved supplier.",
    recommendedActionHi: "स्वीकृत आपूर्तिकर्ता को 25 बोरी (50 किग्रा प्रत्येक) स्टार्टर दाने का क्रय आदेश तुरंत भेजें।",
    timestamp: "3 hours ago",
    location: "Feed Godown / Shed 1",
  },
  {
    id: "alert-5",
    domain: "fisheries",
    severity: "warning",
    status: "active",
    titleEn: "Pond 1 Afternoon pH Spike (8.8 pH)",
    titleHi: "तालाब 1 में दोपहर का pH मान उच्च (8.8 pH)",
    descriptionEn: "Intense algal bloom photosynthesis in full sun pushed water pH above optimal 7.5–8.5 range.",
    descriptionHi: "तीव्र धूप में प्लवक प्रकाश संश्लेषण से पानी का pH मान सुरक्षित सीमा 7.5–8.5 से ऊपर चला गया।",
    recommendedActionEn: "Broadcast agricultural gypsum at 50 kg/acre or apply fresh borewell flush to buffer alkalinity.",
    recommendedActionHi: "50 किग्रा/एकड़ की दर से जिप्सम डालें या ताज़ा बोरवेल जल प्रवाहित कर क्षारीयता संतुलित करें।",
    timestamp: "5 hours ago",
    location: "Pond 1 - IMC Poly-culture",
  },
  {
    id: "alert-6",
    domain: "poultry",
    severity: "routine",
    status: "active",
    titleEn: "Day 21 IBD (Gumboro) Booster Vaccination Scheduled",
    titleHi: "दिवस 21 गम्बोरो (IBD) बूस्टर टीकाकरण अनुसूची",
    descriptionEn: "Flock A reaches Day 21 tomorrow morning. Intermediate strain vaccination via drinking water required.",
    descriptionHi: "झुंड A कल सुबह 21वें दिन में प्रवेश करेगा। पीने के पानी के माध्यम से बूस्टर खुराक आवश्यक है।",
    recommendedActionEn: "Deprive birds of water for 2 hours prior to mixing vaccine with skim milk powder stabilizer.",
    recommendedActionHi: "टीकाकरण से 2 घंटे पहले पानी रोकें और स्किम मिल्क पाउडर के साथ टीका मिलाकर पिलाएं।",
    timestamp: "6 hours ago",
    location: "Shed 1 - Flock A",
  },
];

export default function AlertsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [lang, setLang] = useState<DashboardLanguage>("en");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<{ fullName?: string; fullNameHindi?: string; email?: string } | null>(null);

  // Alerts Management States
  const [alerts, setAlerts] = useState<FarmAlertItem[]>([]);
  const [severityFilter, setSeverityFilter] = useState<"all" | AlertSeverity | "resolved">("all");
  const [domainFilter, setDomainFilter] = useState<AlertDomain>("all");

  // New Alert Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDomain, setNewDomain] = useState<"fisheries" | "poultry" | "weather">("fisheries");
  const [newSeverity, setNewSeverity] = useState<AlertSeverity>("warning");
  const [newLocation, setNewLocation] = useState("");

  // Initialize Auth & Alerts Storage
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("agrifarm_jwt") : null;
    if (!token) {
      window.location.replace("/login");
      return;
    }
    setIsAuthenticated(true);

    const savedLang = localStorage.getItem("agrifarm_lang") as DashboardLanguage;
    if (savedLang && (savedLang === "en" || savedLang === "hi")) {
      setLang(savedLang);
    }

    const savedTheme = localStorage.getItem("agrifarm_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const savedUser = localStorage.getItem("agrifarm_user");
    if (savedUser) {
      try {
        setUserProfile(JSON.parse(savedUser));
      } catch {
        // ignore
      }
    }

    // Load persisted alerts
    try {
      const stored = localStorage.getItem("agrifarm_alerts");
      if (stored) {
        setAlerts(JSON.parse(stored));
      } else {
        setAlerts(INITIAL_ALERTS);
        localStorage.setItem("agrifarm_alerts", JSON.stringify(INITIAL_ALERTS));
      }
    } catch {
      setAlerts(INITIAL_ALERTS);
    }
  }, []);

  const saveAlerts = (updated: FarmAlertItem[]) => {
    setAlerts(updated);
    try {
      localStorage.setItem("agrifarm_alerts", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleResolveAlert = (id: string) => {
    const updated = alerts.map((a) => (a.id === id ? { ...a, status: "resolved" as AlertStatus } : a));
    saveAlerts(updated);
  };

  const handleAcknowledgeAlert = (id: string) => {
    const updated = alerts.map((a) => (a.id === id ? { ...a, status: "acknowledged" as AlertStatus } : a));
    saveAlerts(updated);
  };

  const handleReopenAlert = (id: string) => {
    const updated = alerts.map((a) => (a.id === id ? { ...a, status: "active" as AlertStatus } : a));
    saveAlerts(updated);
  };

  const handleResolveAll = () => {
    const updated = alerts.map((a) => ({ ...a, status: "resolved" as AlertStatus }));
    saveAlerts(updated);
  };

  const handleAddCustomAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: FarmAlertItem = {
      id: "alert-" + Date.now(),
      domain: newDomain,
      severity: newSeverity,
      status: "active",
      titleEn: newTitle.trim(),
      titleHi: newTitle.trim(),
      descriptionEn: newDesc.trim() || "Manual operational trigger logged by farm manager.",
      descriptionHi: newDesc.trim() || "फार्म प्रबंधक द्वारा दर्ज की गई मैन्युअल परिचालन चेतावनी।",
      recommendedActionEn: "Review farm protocol with on-site supervisor.",
      recommendedActionHi: "साइट पर्यवेक्षक के साथ फार्म प्रोटोकॉल की समीक्षा करें।",
      timestamp: "Just now",
      location: newLocation.trim() || (newDomain === "fisheries" ? "Main Pond" : "Poultry Shed"),
    };

    saveAlerts([item, ...alerts]);
    setIsModalOpen(false);
    setNewTitle("");
    setNewDesc("");
    setNewLocation("");
  };

  const toggleLanguage = () => {
    const nextLang: DashboardLanguage = lang === "en" ? "hi" : "en";
    setLang(nextLang);
    localStorage.setItem("agrifarm_lang", nextLang);
  };

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("agrifarm_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("agrifarm_theme", "light");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("agrifarm_jwt");
    localStorage.removeItem("agrifarm_user");
    window.location.href = "/login";
  };

  const content: DashboardContent = dashboardTranslations[lang];

  const rawFarmerName =
    lang === "hi" && userProfile?.fullNameHindi
      ? userProfile.fullNameHindi
      : userProfile?.fullName?.trim() || "";
  const farmerName = formatFarmerName(rawFarmerName, lang);

  const farmerInitials =
    farmerName
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || (lang === "hi" ? "कि" : "FA");

  const navItems = [
    { key: "home", label: content.nav.home, icon: Home, href: "/dashboard" },
    { key: "aiAssistant", label: content.nav.aiAssistant, icon: Bot, href: "/advisory" },
    { key: "fisheries", label: content.nav.fisheries, icon: Waves, href: "/fisheries" },
    { key: "poultry", label: content.nav.poultry, icon: Feather, href: "/poultry" },
    { key: "tasks", label: content.nav.tasks || (lang === "hi" ? "दैनिक कार्य (Tasks)" : "Daily Tasks"), icon: CheckSquare, href: "/tasks" },
    { key: "weather", label: content.nav.weather, icon: CloudSun, href: "/weather" },
    { key: "alerts", label: content.nav.alerts, icon: Bell, href: "/alerts", isActive: true },
    { key: "expense", label: content.nav.expense, icon: Receipt, href: "/expense" },
    { key: "helpSupport", label: content.nav.helpSupport, icon: HelpCircle, href: "/help" },
    { key: "settings", label: content.nav.settings, icon: Settings, href: "/settings" },
  ];

  const activeAlerts = alerts.filter((a) => a.status !== "resolved");
  const criticalCount = activeAlerts.filter((a) => a.severity === "critical").length;
  const warningCount = activeAlerts.filter((a) => a.severity === "warning").length;
  const routineCount = activeAlerts.filter((a) => a.severity === "routine").length;

  // Filtered Alert List
  const filteredAlerts = alerts.filter((a) => {
    // 1. Domain
    if (domainFilter !== "all" && a.domain !== domainFilter) return false;

    // 2. Severity / Resolved
    if (severityFilter === "resolved") return a.status === "resolved";
    if (severityFilter === "all") return a.status !== "resolved";
    return a.status !== "resolved" && a.severity === severityFilter;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07130e] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          {lang === "hi" ? "सुरक्षित किसान सत्र सत्यापित किया जा रहा है..." : "Verifying secure farmer session..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07130e] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row transition-colors duration-300">
      {/* ========================================================================= */}
      {/* 1. DESKTOP FIXED SIDEBAR                                                   */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 fixed top-0 bottom-0 left-0 z-30 bg-white dark:bg-[#07130e] border-r border-slate-200/80 dark:border-emerald-950/60 select-none">
        {/* Brand Header */}
        <div className="h-20 px-5 flex items-center gap-3 border-b border-slate-100 dark:border-emerald-950/40">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-emerald-600/30 group-hover:border-emerald-600 transition-colors shadow-xs">
              <Image
                src="/picandvideo/logo.png"
                alt="AgriFarmAssistant Logo"
                fill
                sizes="40px"
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-emerald-900 dark:text-emerald-400">
                {content.nav.brandTitle}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700/80 dark:text-emerald-500/80 tracking-wider uppercase">
                {content.nav.brandSubtitle}
              </span>
            </div>
          </Link>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = !!item.isActive;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shadow-2xs border-l-3 border-[#0F5132] dark:border-emerald-500 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-emerald-950/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? "text-[#0F5132] dark:text-emerald-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.key === "alerts" && activeAlerts.length > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300">
                    {activeAlerts.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-emerald-950/40 space-y-2">
          <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0c241a]/50 border border-slate-200/60 dark:border-emerald-900/30 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span className="font-medium text-slate-600 dark:text-slate-400">
                {content.nav.systemStatus}
              </span>
            </div>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#0F5132] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {farmerInitials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {farmerName}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {userProfile?.email || "farmer@agrifarm.org"}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              type="button"
              title={content.nav.logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE TOP NAVIGATION & DRAWER                                         */}
      {/* ========================================================================= */}
      <header className="lg:hidden sticky top-0 z-40 w-full bg-white/90 dark:bg-[#07130e]/90 backdrop-blur-md border-b border-slate-200 dark:border-emerald-950/60 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label={content.header.openMenuLabel}
            className="p-2 rounded-lg border border-slate-200 dark:border-emerald-900/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-emerald-950/40 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-emerald-600/30">
              <Image
                src="/picandvideo/logo.png"
                alt="AgriFarmAssistant Logo"
                fill
                sizes="32px"
                className="object-contain p-0.5"
              />
            </div>
            <span className="text-sm font-extrabold text-emerald-900 dark:text-emerald-400">
              {content.nav.brandTitle}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            type="button"
            className="px-2 py-1 text-[11px] font-semibold rounded-lg border border-slate-200 dark:border-emerald-900/60 text-slate-700 dark:text-slate-200"
          >
            {lang === "en" ? "हिन्दी" : "EN"}
          </button>
          <button
            onClick={toggleTheme}
            type="button"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-emerald-900/60 text-slate-700 dark:text-slate-200"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
          <button
            onClick={handleLogout}
            type="button"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-emerald-900/60 text-slate-600 dark:text-slate-400 hover:text-red-600"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white dark:bg-[#07130e] h-full shadow-2xl flex flex-col justify-between z-10 p-4 border-r border-slate-200 dark:border-emerald-950/60">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-emerald-950/40 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-emerald-600/30">
                    <Image
                      src="/picandvideo/logo.png"
                      alt="AgriFarmAssistant Logo"
                      fill
                      sizes="32px"
                      className="object-contain p-0.5"
                    />
                  </div>
                  <span className="text-sm font-bold text-emerald-900 dark:text-emerald-400">
                    {content.nav.brandTitle}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = !!item.isActive;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border-l-3 border-[#0F5132] dark:border-emerald-500"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
                        <span>{item.label}</span>
                      </div>
                      {item.key === "alerts" && activeAlerts.length > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300">
                          {activeAlerts.length}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-emerald-950/40">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center py-2 text-xs font-bold text-[#0F5132] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl"
              >
                ← {lang === "hi" ? "डैशबोर्ड पर लौटें" : "Back to Dashboard"}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE CONTENT                                                 */}
      {/* ========================================================================= */}
      <main className="flex-1 lg:pl-64 min-w-0 flex flex-col">
        {/* Top Desktop Bar */}
        <div className="hidden lg:flex items-center justify-between px-6 lg:px-8 py-4 border-b border-slate-200/80 dark:border-emerald-950/60 bg-white/80 dark:bg-[#07130e]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-emerald-900/40 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === "hi" ? "डैशबोर्ड" : "Dashboard"}</span>
            </Link>
            <span className="text-slate-300 dark:text-emerald-900">/</span>
            <span className="text-xs font-bold text-[#0F5132] dark:text-emerald-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === "hi" ? "फार्म अलर्ट एवं घटना प्रबंधन" : "Farm Alerts & Incidents"}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0F5132] hover:bg-[#15803d] text-white shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === "hi" ? "नया अलर्ट दर्ज करें" : "Log Incident"}</span>
            </button>

            <button
              onClick={toggleLanguage}
              type="button"
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-emerald-900/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-emerald-950/40 transition-colors"
            >
              {lang === "en" ? "हिन्दी" : "English"}
            </button>

            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 rounded-xl border border-slate-200 dark:border-emerald-900/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-emerald-950/40 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Page Body */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header Hero Banner */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-red-950 via-emerald-950 to-[#071d13] text-white shadow-xl relative overflow-hidden border border-red-900/30">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-white to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-red-200 border border-white/15 backdrop-blur-xs mb-3">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === "hi" ? "सक्रिय फार्म सुरक्षा निगरानी" : "Active Farm Biosecurity Telemetry"}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === "hi" ? "फार्म अलर्ट एवं घटना प्रतिक्रिया केंद्र" : "Farm Alerts & Incident Center"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {lang === "hi"
                    ? "मत्स्य पालन तालाबों और कुक्कुट शेडों में आईसीएआर वैज्ञानिक सीमाओं से बाहर जाने वाले पैरामीटर्स (ऑक्सीजन, आर्द्रता, तापमान, रोग लक्षण) की तत्काल चेतावनी।"
                    : "Real-time automated incident triggers across Fisheries ponds and Poultry sheds when telemetry deviates from ICAR safety thresholds."}
                </p>
              </div>

              {/* Status Counters */}
              <div className="flex items-center gap-3">
                <div className="px-3.5 py-2.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs text-center min-w-[70px]">
                  <span className="text-xl font-black text-red-400 block">{criticalCount}</span>
                  <span className="text-[10px] text-slate-300 font-medium uppercase">{lang === "hi" ? "गंभीर" : "Critical"}</span>
                </div>
                <div className="px-3.5 py-2.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs text-center min-w-[70px]">
                  <span className="text-xl font-black text-amber-400 block">{warningCount}</span>
                  <span className="text-[10px] text-slate-300 font-medium uppercase">{lang === "hi" ? "चेतावनी" : "Warning"}</span>
                </div>
                <div className="px-3.5 py-2.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs text-center min-w-[70px]">
                  <span className="text-xl font-black text-emerald-400 block">{routineCount}</span>
                  <span className="text-[10px] text-slate-300 font-medium uppercase">{lang === "hi" ? "सामान्य" : "Routine"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Bar & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0c241a]/60 border border-slate-200/90 dark:border-emerald-800/40 shadow-xs">
            {/* Domain Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                type="button"
                onClick={() => setDomainFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  domainFilter === "all"
                    ? "bg-[#0F5132] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40"
                }`}
              >
                {lang === "hi" ? "सभी क्षेत्र" : "All Domains"}
              </button>
              <button
                type="button"
                onClick={() => setDomainFilter("fisheries")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  domainFilter === "fisheries"
                    ? "bg-teal-700 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40"
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                <span>{lang === "hi" ? "मत्स्य पालन" : "Fisheries"}</span>
              </button>
              <button
                type="button"
                onClick={() => setDomainFilter("poultry")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  domainFilter === "poultry"
                    ? "bg-amber-700 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40"
                }`}
              >
                <Feather className="w-3.5 h-3.5" />
                <span>{lang === "hi" ? "कुक्कुट पालन" : "Poultry"}</span>
              </button>
              <button
                type="button"
                onClick={() => setDomainFilter("weather")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  domainFilter === "weather"
                    ? "bg-blue-700 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40"
                }`}
              >
                <CloudSun className="w-3.5 h-3.5" />
                <span>{lang === "hi" ? "मौसम" : "Weather"}</span>
              </button>
            </div>

            {/* Severity Filter Pills & Bulk Action */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#071911]">
                <button
                  type="button"
                  onClick={() => setSeverityFilter("all")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    severityFilter === "all"
                      ? "bg-white dark:bg-emerald-900 text-slate-900 dark:text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {lang === "hi" ? "सक्रिय" : "Active"} ({activeAlerts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSeverityFilter("critical")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    severityFilter === "critical"
                      ? "bg-red-600 text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {lang === "hi" ? "गंभीर" : "Critical"}
                </button>
                <button
                  type="button"
                  onClick={() => setSeverityFilter("warning")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    severityFilter === "warning"
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {lang === "hi" ? "चेतावनी" : "Warning"}
                </button>
                <button
                  type="button"
                  onClick={() => setSeverityFilter("resolved")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    severityFilter === "resolved"
                      ? "bg-emerald-700 text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {lang === "hi" ? "हल किए गए" : "Resolved"}
                </button>
              </div>

              {activeAlerts.length > 0 && severityFilter !== "resolved" && (
                <button
                  type="button"
                  onClick={handleResolveAll}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-emerald-900/60 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors whitespace-nowrap"
                >
                  {lang === "hi" ? "सभी हल करें" : "Resolve All"}
                </button>
              )}
            </div>
          </div>

          {/* Alerts Card List */}
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0c241a]/60 border border-slate-200/90 dark:border-emerald-800/40">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {lang === "hi" ? "सभी फार्म पैरामीटर्स सामान्य एवं सुरक्षित हैं" : "All Farm Biological Telemetry In Safe Limits"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  {lang === "hi"
                    ? "वर्तमान में चयनित फ़िल्टर अनुसार कोई सक्रिय अलर्ट नहीं है। नियमित निगरानी जारी रखें।"
                    : "No active triggers found matching current filter. Continuous automated sensor synchronization is running."}
                </p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isCritical = alert.severity === "critical";
                const isWarning = alert.severity === "warning";
                const isResolved = alert.status === "resolved";

                return (
                  <div
                    key={alert.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isResolved
                        ? "bg-slate-50/70 dark:bg-[#071911]/60 border-slate-200/60 dark:border-emerald-950/50 opacity-75"
                        : isCritical
                        ? "bg-red-50/40 dark:bg-red-950/15 border-red-200 dark:border-red-900/50 shadow-xs"
                        : isWarning
                        ? "bg-amber-50/40 dark:bg-amber-950/15 border-amber-200 dark:border-amber-900/50 shadow-xs"
                        : "bg-white dark:bg-[#0c241a]/60 border-slate-200/90 dark:border-emerald-800/40 shadow-xs"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      {/* Left: Indicator & Content */}
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                            isResolved
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-500"
                              : isCritical
                              ? "bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-400"
                              : isWarning
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-400"
                          }`}
                        >
                          {isResolved ? (
                            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          ) : isCritical ? (
                            <AlertCircle className="w-5 h-5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider ${
                                isCritical
                                  ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                                  : isWarning
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                              }`}
                            >
                              {alert.severity}
                            </span>

                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              • {alert.location}
                            </span>

                            <span className="text-[11px] text-slate-400">
                              • {alert.timestamp}
                            </span>
                          </div>

                          <h3
                            className={`text-sm sm:text-base font-bold mt-1.5 ${
                              isResolved
                                ? "line-through text-slate-500 dark:text-slate-400"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {lang === "hi" ? alert.titleHi : alert.titleEn}
                          </h3>

                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {lang === "hi" ? alert.descriptionHi : alert.descriptionEn}
                          </p>

                          {/* ICAR Recommended Protocol Box */}
                          <div className="mt-3 p-3 rounded-xl bg-white/80 dark:bg-[#071911] border border-slate-200/80 dark:border-emerald-950/60">
                            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 block mb-0.5">
                              {lang === "hi" ? "अनुशंसित सुधारात्मक कार्रवाई:" : "Recommended ICAR Protocol:"}
                            </span>
                            <p className="text-xs text-slate-700 dark:text-slate-300">
                              {lang === "hi" ? alert.recommendedActionHi : alert.recommendedActionEn}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-end gap-2 shrink-0 pt-2 sm:pt-0">
                        {!isResolved ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleResolveAlert(alert.id)}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#0F5132] hover:bg-[#15803d] text-white shadow-2xs transition-colors"
                            >
                              {lang === "hi" ? "हल करें (Resolve)" : "Resolve"}
                            </button>
                            {alert.status === "active" && (
                              <button
                                type="button"
                                onClick={() => handleAcknowledgeAlert(alert.id)}
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-emerald-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40 transition-colors"
                              >
                                {lang === "hi" ? "स्वीकार करें" : "Acknowledge"}
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleReopenAlert(alert.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-emerald-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-emerald-950/40 transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{lang === "hi" ? "पुनः खोलें" : "Reopen"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Manual Incident Logging Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0c241a] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-emerald-800/60">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-emerald-950/60 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === "hi" ? "नया फार्म अलर्ट / घटना दर्ज करें" : "Log Farm Incident or Alert"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomAlert} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === "hi" ? "अलर्ट शीर्षक *" : "Incident Title *"}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={lang === "hi" ? "उदा: तालाब में झाग / शेड पंखा खराबी" : "e.g. Foam on pond surface / fan failure"}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "hi" ? "डोमेन (क्षेत्र)" : "Domain"}
                  </label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white"
                  >
                    <option value="fisheries">{lang === "hi" ? "मत्स्य पालन" : "Fisheries"}</option>
                    <option value="poultry">{lang === "hi" ? "कुक्कुट पालन" : "Poultry"}</option>
                    <option value="weather">{lang === "hi" ? "मौसम" : "Weather"}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "hi" ? "गंभीरता स्तर" : "Severity"}
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white"
                  >
                    <option value="critical">{lang === "hi" ? "गंभीर (Critical)" : "Critical"}</option>
                    <option value="warning">{lang === "hi" ? "चेतावनी (Warning)" : "Warning"}</option>
                    <option value="routine">{lang === "hi" ? "सामान्य (Routine)" : "Routine"}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === "hi" ? "स्थान / तालाब / शेड" : "Location"}
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder={lang === "hi" ? "तालाब 1 / शेड A" : "Pond 1 / Shed A"}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === "hi" ? "विवरण" : "Observation / Details"}
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder={lang === "hi" ? "विस्तृत विवरण लिखें..." : "Add observation details..."}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/60"
                >
                  {lang === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-[#0F5132] hover:bg-[#15803d] text-white shadow-xs"
                >
                  {lang === "hi" ? "अलर्ट सुरक्षित करें" : "Save Incident"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
