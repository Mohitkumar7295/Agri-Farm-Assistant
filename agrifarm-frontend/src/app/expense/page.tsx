"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Sparkles,
  Plus,
  Trash2,
  Filter,
  Search,
  TrendingDown,
  DollarSign,
  PieChart,
  Calendar,
  Layers,
  ArrowRight,
  Check,
  CreditCard,
  Building,
  Tag,
  AlertCircle,
} from "lucide-react";
import {
  dashboardTranslations,
  DashboardLanguage,
  DashboardContent,
} from "@/i18n/dashboardTranslations";
import { formatFarmerName } from "@/i18n/nameTransliteration";
import { FisheriesBatch } from "@/types/fisheries";
import { INITIAL_FISHERIES_BATCHES } from "@/data/defaultFisheriesData";
import { PoultryFlock } from "@/types/poultry";
import { INITIAL_POULTRY_FLOCKS } from "@/data/defaultPoultryFlocks";

export type ExpenseDomain = "fisheries" | "poultry";
export type ExpenseCategory =
  | "feed"
  | "seed_chicks"
  | "medicine_health"
  | "energy_electricity"
  | "labor_management"
  | "equipment_supplies"
  | "maintenance";

export interface BatchExpenseItem {
  id: string;
  domain: ExpenseDomain;
  batchId: string;
  batchName: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paymentMode: "UPI" | "Cash" | "Bank Transfer" | "Credit";
  vendor: string;
  receiptNumber?: string;
  notes?: string;
}

// Initial realistic ICAR baseline expense ledger
const INITIAL_EXPENSES: BatchExpenseItem[] = [
  // Fisheries - Pond 1
  {
    id: "exp-f1-1",
    domain: "fisheries",
    batchId: "batch-1",
    batchName: "Pond 1 - IMC Poly-culture (Rohu/Catla)",
    category: "feed",
    amount: 14200,
    date: "2026-10-06",
    paymentMode: "UPI",
    vendor: "Kisan Aqua Feeds Ltd.",
    receiptNumber: "INV-8841",
    notes: "28% CP floating starter pellets (20 bags)",
  },
  {
    id: "exp-f1-2",
    domain: "fisheries",
    batchId: "batch-1",
    batchName: "Pond 1 - IMC Poly-culture (Rohu/Catla)",
    category: "seed_chicks",
    amount: 8500,
    date: "2026-09-15",
    paymentMode: "Bank Transfer",
    vendor: "CIFA Certified Hatchery",
    receiptNumber: "HAT-402",
    notes: "12,000 Rohu/Catla fingerlings (3 inch)",
  },
  {
    id: "exp-f1-3",
    domain: "fisheries",
    batchId: "batch-1",
    batchName: "Pond 1 - IMC Poly-culture (Rohu/Catla)",
    category: "medicine_health",
    amount: 2400,
    date: "2026-09-28",
    paymentMode: "Cash",
    vendor: "AquaMedics Store",
    notes: "Probiotics & Agricultural Quicklime (4 bags)",
  },
  {
    id: "exp-f1-4",
    domain: "fisheries",
    batchId: "batch-1",
    batchName: "Pond 1 - IMC Poly-culture (Rohu/Catla)",
    category: "energy_electricity",
    amount: 3200,
    date: "2026-10-02",
    paymentMode: "UPI",
    vendor: "State Electricity Board",
    notes: "Aerator motor running tariff (Sept bill)",
  },

  // Fisheries - Pond 2
  {
    id: "exp-f2-1",
    domain: "fisheries",
    batchId: "batch-2",
    batchName: "Pond 2 - Pangasius Monoculture",
    category: "feed",
    amount: 22800,
    date: "2026-10-05",
    paymentMode: "Bank Transfer",
    vendor: "National Feed Mills",
    receiptNumber: "NFM-992",
    notes: "High density commercial sinking feed (35 bags)",
  },
  {
    id: "exp-f2-2",
    domain: "fisheries",
    batchId: "batch-2",
    batchName: "Pond 2 - Pangasius Monoculture",
    category: "labor_management",
    amount: 2500,
    date: "2026-10-04",
    paymentMode: "Cash",
    vendor: "Local Labor Crew",
    notes: "Dyke clearance and netting sampling",
  },

  // Poultry - Flock A
  {
    id: "exp-p1-1",
    domain: "poultry",
    batchId: "flock-1",
    batchName: "Flock A - Cobb 500 Broilers (Shed 1)",
    category: "feed",
    amount: 38500,
    date: "2026-10-05",
    paymentMode: "Bank Transfer",
    vendor: "Supreme Broiler Nutrition",
    receiptNumber: "SBN-104",
    notes: "Broiler finisher crumbles (50 bags)",
  },
  {
    id: "exp-p1-2",
    domain: "poultry",
    batchId: "flock-1",
    batchName: "Flock A - Cobb 500 Broilers (Shed 1)",
    category: "seed_chicks",
    amount: 19600,
    date: "2026-09-12",
    paymentMode: "Bank Transfer",
    vendor: "Venkateshwara Hatcheries",
    receiptNumber: "VH-7718",
    notes: "2,800 Day-Old Chicks (DOC)",
  },
  {
    id: "exp-p1-3",
    domain: "poultry",
    batchId: "flock-1",
    batchName: "Flock A - Cobb 500 Broilers (Shed 1)",
    category: "medicine_health",
    amount: 3200,
    date: "2026-09-22",
    paymentMode: "UPI",
    vendor: "VetCare Pharmaceuticals",
    notes: "Lasota & IBD booster vaccines + Vitamin AD3E",
  },
  {
    id: "exp-p1-4",
    domain: "poultry",
    batchId: "flock-1",
    batchName: "Flock A - Cobb 500 Broilers (Shed 1)",
    category: "energy_electricity",
    amount: 4500,
    date: "2026-10-01",
    paymentMode: "UPI",
    vendor: "LPG Gas Agency",
    notes: "Brooding LPG cylinders (2 units) + electricity",
  },

  // Poultry - Flock B
  {
    id: "exp-p2-1",
    domain: "poultry",
    batchId: "flock-2",
    batchName: "Flock B - Kadaknath Heritage (Shed 2)",
    category: "feed",
    amount: 16400,
    date: "2026-10-03",
    paymentMode: "Cash",
    vendor: "Desi Bird Feeds",
    notes: "Organic grain & mineral mix (20 bags)",
  },
  {
    id: "exp-p2-2",
    domain: "poultry",
    batchId: "flock-2",
    batchName: "Flock B - Kadaknath Heritage (Shed 2)",
    category: "equipment_supplies",
    amount: 1800,
    date: "2026-09-25",
    paymentMode: "Cash",
    vendor: "Agro Hardware Depot",
    notes: "Pine rice husk bedding (2 trolley loads)",
  },
];

export default function ExpensePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [lang, setLang] = useState<DashboardLanguage>("en");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<{ fullName?: string; fullNameHindi?: string; email?: string } | null>(null);

  // Domain & Batch Filters
  const [activeDomain, setActiveDomain] = useState<ExpenseDomain>("fisheries");
  const [selectedBatchId, setSelectedBatchId] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Batches
  const [fisheriesBatches, setFisheriesBatches] = useState<FisheriesBatch[]>([]);
  const [poultryFlocks, setPoultryFlocks] = useState<PoultryFlock[]>([]);

  // Expenses State
  const [expenses, setExpenses] = useState<BatchExpenseItem[]>([]);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [formDomain, setFormDomain] = useState<ExpenseDomain>("fisheries");
  const [formBatchId, setFormBatchId] = useState<string>("");
  const [formCategory, setFormCategory] = useState<ExpenseCategory>("feed");
  const [formAmount, setFormAmount] = useState<string>("");
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [formPaymentMode, setFormPaymentMode] = useState<"UPI" | "Cash" | "Bank Transfer" | "Credit">("UPI");
  const [formVendor, setFormVendor] = useState<string>("");
  const [formReceipt, setFormReceipt] = useState<string>("");
  const [formNotes, setFormNotes] = useState<string>("");

  // Initialization & Auth Guard
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

    // Load Fisheries Batches
    try {
      const storedBatches = localStorage.getItem("agrifarm_fisheries_batches");
      setFisheriesBatches(storedBatches ? JSON.parse(storedBatches) : INITIAL_FISHERIES_BATCHES);
    } catch {
      setFisheriesBatches(INITIAL_FISHERIES_BATCHES);
    }

    // Load Poultry Flocks
    try {
      const storedFlocks = localStorage.getItem("agrifarm_poultry_flocks");
      setPoultryFlocks(storedFlocks ? JSON.parse(storedFlocks) : INITIAL_POULTRY_FLOCKS);
    } catch {
      setPoultryFlocks(INITIAL_POULTRY_FLOCKS);
    }

    // Load Expenses
    try {
      const storedExpenses = localStorage.getItem("agrifarm_batchwise_expenses");
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      } else {
        setExpenses(INITIAL_EXPENSES);
        localStorage.setItem("agrifarm_batchwise_expenses", JSON.stringify(INITIAL_EXPENSES));
      }
    } catch {
      setExpenses(INITIAL_EXPENSES);
    }
  }, []);

  const saveExpenses = (updated: BatchExpenseItem[]) => {
    setExpenses(updated);
    try {
      localStorage.setItem("agrifarm_batchwise_expenses", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    saveExpenses(updated);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(formAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    let batchName = "General Farm";
    if (formDomain === "fisheries") {
      const b = fisheriesBatches.find((x) => x.id === formBatchId);
      if (b) batchName = b.name;
    } else {
      const f = poultryFlocks.find((x) => x.id === formBatchId);
      if (f) batchName = f.name;
    }

    const newItem: BatchExpenseItem = {
      id: "exp-" + Date.now(),
      domain: formDomain,
      batchId: formBatchId || (formDomain === "fisheries" ? "batch-1" : "flock-1"),
      batchName,
      category: formCategory,
      amount: parsedAmount,
      date: formDate,
      paymentMode: formPaymentMode,
      vendor: formVendor.trim() || (lang === "hi" ? "स्थानीय विक्रेता" : "Local Supplier"),
      receiptNumber: formReceipt.trim() || undefined,
      notes: formNotes.trim() || undefined,
    };

    saveExpenses([newItem, ...expenses]);
    setIsAddModalOpen(false);
    setFormAmount("");
    setFormVendor("");
    setFormReceipt("");
    setFormNotes("");
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
    { key: "alerts", label: content.nav.alerts, icon: Bell, href: "/alerts", badge: "3" },
    { key: "expense", label: content.nav.expense, icon: Receipt, href: "/expense", isActive: true },
    { key: "helpSupport", label: content.nav.helpSupport, icon: HelpCircle, href: "/help" },
    { key: "settings", label: content.nav.settings, icon: Settings, href: "/settings" },
  ];

  // Active batches list for current domain
  const currentDomainBatches = activeDomain === "fisheries" ? fisheriesBatches : poultryFlocks;

  // Filtered expenses based on domain, batch, category, search
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      // 1. Domain
      if (e.domain !== activeDomain) return false;

      // 2. Batch
      if (selectedBatchId !== "all" && e.batchId !== selectedBatchId) return false;

      // 3. Category
      if (categoryFilter !== "all" && e.category !== categoryFilter) return false;

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesVendor = e.vendor?.toLowerCase().includes(q);
        const matchesNotes = e.notes?.toLowerCase().includes(q);
        const matchesReceipt = e.receiptNumber?.toLowerCase().includes(q);
        const matchesBatch = e.batchName?.toLowerCase().includes(q);
        if (!matchesVendor && !matchesNotes && !matchesReceipt && !matchesBatch) {
          return false;
        }
      }

      return true;
    });
  }, [expenses, activeDomain, selectedBatchId, categoryFilter, searchQuery]);

  // Aggregate Financial Analytics
  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const feedAmount = useMemo(() => {
    return filteredExpenses.filter((e) => e.category === "feed").reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const seedChicksAmount = useMemo(() => {
    return filteredExpenses.filter((e) => e.category === "seed_chicks").reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const healthAmount = useMemo(() => {
    return filteredExpenses.filter((e) => e.category === "medicine_health").reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const energyAmount = useMemo(() => {
    return filteredExpenses.filter((e) => e.category === "energy_electricity").reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const laborAmount = useMemo(() => {
    return filteredExpenses.filter((e) => e.category === "labor_management").reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const feedPercent = totalAmount > 0 ? Math.round((feedAmount / totalAmount) * 100) : 0;

  // Estimated Unit Production Cost
  // For fisheries: approx biomass in kg; for poultry: approx living birds
  const unitCostDisplay = useMemo(() => {
    if (activeDomain === "fisheries") {
      // Estimate biomass: 4,000 kg baseline
      const approxBiomassKg = selectedBatchId === "all" ? 5200 : 2500;
      const costPerKg = (totalAmount / approxBiomassKg).toFixed(1);
      return {
        value: `₹${costPerKg} / kg`,
        labelEn: "Cost of Fish Production (ICAR Benchmark: ₹75–95/kg)",
        labelHi: "उत्पादन लागत प्रति किग्रा (ICAR मानक: ₹75–95/किग्रा)",
      };
    } else {
      // Poultry birds
      const approxBirds = selectedBatchId === "all" ? 4800 : 2800;
      const costPerBird = (totalAmount / approxBirds).toFixed(1);
      return {
        value: `₹${costPerBird} / bird`,
        labelEn: "Cost per Live Broiler (ICAR Benchmark: ₹135–155/bird)",
        labelHi: "लागत प्रति जीवित पक्षी (ICAR मानक: ₹135–155/पक्षी)",
      };
    }
  }, [activeDomain, selectedBatchId, totalAmount]);

  const getCategoryLabel = (cat: ExpenseCategory) => {
    switch (cat) {
      case "feed":
        return lang === "hi" ? "आहार (Feed)" : "Feed";
      case "seed_chicks":
        return activeDomain === "fisheries"
          ? lang === "hi" ? "मछली बीज (Fingerlings)" : "Fish Seed"
          : lang === "hi" ? "चूजे (DOC Chicks)" : "DOC Chicks";
      case "medicine_health":
        return lang === "hi" ? "स्वास्थ्य व दवा (Medicine)" : "Health & Medicine";
      case "energy_electricity":
        return lang === "hi" ? "बिजली/ईंधन (Energy)" : "Energy & Fuel";
      case "labor_management":
        return lang === "hi" ? "मजदूरी (Labor)" : "Labor";
      case "equipment_supplies":
        return lang === "hi" ? "उपकरण व बिछावन" : "Supplies & Bedding";
      case "maintenance":
        return lang === "hi" ? "रखरखाव (Maintenance)" : "Maintenance";
      default:
        return cat;
    }
  };

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
                      isActive ? "text-[#0F5132] dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

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
      {/* 2. MOBILE HEADER & DRAWER                                                 */}
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
      {/* 3. MAIN EXPENSE WORKSPACE CONTENT                                         */}
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
              <Receipt className="w-3.5 h-3.5" />
              <span>{lang === "hi" ? "बैच-वार फार्म खर्च प्रबंधन" : "Batch-wise Farm Expense Ledger"}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setFormDomain(activeDomain);
                setFormBatchId(selectedBatchId !== "all" ? selectedBatchId : currentDomainBatches[0]?.id || "");
                setIsAddModalOpen(true);
              }}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#0F5132] hover:bg-[#15803d] text-white shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === "hi" ? "खर्च दर्ज करें" : "Record Expense"}</span>
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

        {/* Page Body Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header Hero Banner */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-900 via-[#0a3722] to-emerald-950 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-white to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-emerald-200 border border-white/15 backdrop-blur-xs mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{lang === "hi" ? "आईसीएआर लागत विश्लेषण एवं बहीखाता" : "ICAR Farm Unit Economics & Ledger"}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === "hi" ? "बैच-वार वित्तीय एवं व्यय केंद्र" : "Batch-wise Financial & Expense Hub"}
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
                  {lang === "hi"
                    ? "मत्स्य पालन तालाबों और कुक्कुट शेडों के लिए आहार, बीज/चूजे, दवा, ऊर्जा और मजदूरी लागत का बैच-वार पारदर्शी वित्तीय नियंत्रण।"
                    : "Granular cost tracking and production economics per pond batch and poultry flock across feed, fingerlings, vaccines, energy, and labor."}
                </p>
              </div>

              {/* Domain Switch Buttons */}
              <div className="flex items-center p-1.5 rounded-2xl bg-black/20 border border-white/15 backdrop-blur-md self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setActiveDomain("fisheries");
                    setSelectedBatchId("all");
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeDomain === "fisheries"
                      ? "bg-white text-emerald-950 shadow-sm"
                      : "text-emerald-100 hover:text-white"
                  }`}
                >
                  <Waves className="w-4 h-4 text-teal-600" />
                  <span>{lang === "hi" ? "मत्स्य पालन (Ponds)" : "Fisheries"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveDomain("poultry");
                    setSelectedBatchId("all");
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeDomain === "poultry"
                      ? "bg-white text-emerald-950 shadow-sm"
                      : "text-emerald-100 hover:text-white"
                  }`}
                >
                  <Feather className="w-4 h-4 text-amber-600" />
                  <span>{lang === "hi" ? "कुक्कुट पालन (Sheds)" : "Poultry"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Batch Selector Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c241a]/60 border border-slate-200/90 dark:border-emerald-800/40 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0F5132] dark:text-emerald-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {lang === "hi" ? "सक्रिय बैच चुनें:" : "Select Active Batch:"}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {activeDomain === "fisheries"
                    ? lang === "hi" ? "तालाब-वार लागत ऑडिट" : "Pond-wise expenditure audit"
                    : lang === "hi" ? "शेड-वार झुंड लागत ऑडिट" : "Flock-wise flock expenditure audit"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedBatchId("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedBatchId === "all"
                    ? "bg-[#0F5132] text-white shadow-xs"
                    : "bg-slate-100 dark:bg-[#071911] text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {lang === "hi" ? "समस्त बैच (Combined)" : "All Batches Combined"}
              </button>

              {currentDomainBatches.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBatchId(b.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedBatchId === b.id
                      ? "bg-[#0F5132] text-white shadow-xs"
                      : "bg-slate-100 dark:bg-[#071911] text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Financial KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Total Spend */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c241a]/60 border border-slate-200/90 dark:border-emerald-800/40 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                {lang === "hi" ? "कुल संचयी व्यय" : "Total Cumulative Outflow"}
              </span>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                ₹{totalAmount.toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                {filteredExpenses.length} {lang === "hi" ? "लेनदेन दर्ज" : "logged ledger entries"}
              </p>
            </div>

            {/* 2. Feed Share */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c241a]/60 border border-slate-200/90 dark:border-emerald-800/40 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                {lang === "hi" ? "आहार व्यय (Feed Share)" : "Feed Expenditure"}
              </span>
              <p className="text-3xl font-black text-emerald-800 dark:text-emerald-400 mt-1">
                ₹{feedAmount.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                {feedPercent}% {lang === "hi" ? "कुल व्यय का (मानक: 60-70%)" : "of total cost (Target: 60–70%)"}
              </p>
            </div>

            {/* 3. Unit Production Cost */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c241a]/60 border border-slate-200/90 dark:border-emerald-800/40 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                {lang === "hi" ? "अनुमानित इकाई लागत" : "Unit Production Cost"}
              </span>
              <p className="text-3xl font-black text-blue-700 dark:text-blue-400 mt-1">
                {unitCostDisplay.value}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1 truncate" title={unitCostDisplay.labelEn}>
                {lang === "hi" ? unitCostDisplay.labelHi : unitCostDisplay.labelEn}
              </p>
            </div>

            {/* 4. Seed / DOC Chicks Cost */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c241a]/60 border border-slate-200/90 dark:border-emerald-800/40 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                {activeDomain === "fisheries"
                  ? lang === "hi" ? "मछली बीज निवेश" : "Seed Fingerlings Cost"
                  : lang === "hi" ? "चूजे (DOC) खरीद" : "Chicks (DOC) Procurement"}
              </span>
              <p className="text-3xl font-black text-amber-700 dark:text-amber-400 mt-1">
                ₹{seedChicksAmount.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                {totalAmount > 0 ? `${Math.round((seedChicksAmount / totalAmount) * 100)}%` : "0%"} {lang === "hi" ? "प्रारंभिक स्टॉक पूंजी" : "initial stocking investment"}
              </p>
            </div>
          </div>

          {/* Cost Allocation Visual Bar */}
          {totalAmount > 0 && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c241a]/60 border border-slate-200/90 dark:border-emerald-800/40 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                <span>{lang === "hi" ? "लागत वितरण संरचना" : "Cost Distribution Structure"}</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">100% Allocated</span>
              </div>

              {/* Progress Distribution Bar */}
              <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
                <div style={{ width: `${(feedAmount / totalAmount) * 100}%` }} className="bg-emerald-600 h-full" title={`Feed: ₹${feedAmount}`} />
                <div style={{ width: `${(seedChicksAmount / totalAmount) * 100}%` }} className="bg-amber-500 h-full" title={`Seed/DOC: ₹${seedChicksAmount}`} />
                <div style={{ width: `${(healthAmount / totalAmount) * 100}%` }} className="bg-red-500 h-full" title={`Health: ₹${healthAmount}`} />
                <div style={{ width: `${(energyAmount / totalAmount) * 100}%` }} className="bg-blue-500 h-full" title={`Energy: ₹${energyAmount}`} />
                <div style={{ width: `${(laborAmount / totalAmount) * 100}%` }} className="bg-purple-500 h-full" title={`Labor: ₹${laborAmount}`} />
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] pt-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                  <span>{lang === "hi" ? "आहार (Feed)" : "Feed"}: ₹{feedAmount.toLocaleString()} ({Math.round((feedAmount / totalAmount) * 100)}%)</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span>{activeDomain === "fisheries" ? "बीज (Seed)" : "चूजे (DOC)"}: ₹{seedChicksAmount.toLocaleString()} ({Math.round((seedChicksAmount / totalAmount) * 100)}%)</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <span>{lang === "hi" ? "दवा व स्वास्थ्य" : "Health"}: ₹{healthAmount.toLocaleString()} ({Math.round((healthAmount / totalAmount) * 100)}%)</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span>{lang === "hi" ? "बिजली/डीजल" : "Energy"}: ₹{energyAmount.toLocaleString()} ({Math.round((energyAmount / totalAmount) * 100)}%)</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                  <span>{lang === "hi" ? "मजदूरी" : "Labor"}: ₹{laborAmount.toLocaleString()} ({Math.round((laborAmount / totalAmount) * 100)}%)</span>
                </div>
              </div>
            </div>
          )}

          {/* Ledger Table & Search/Filter Controls */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c241a]/60 border border-slate-200/90 dark:border-emerald-800/40 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-emerald-950/40">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#0F5132] dark:text-emerald-400" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {lang === "hi" ? "खर्च बहीखाता प्रविष्टियां" : "Expense Ledger Entries"}
                </h3>
              </div>

              {/* Search & Category Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === "hi" ? "विक्रेता, रसीद खोजें..." : "Search vendor, bill..."}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white w-44 sm:w-56"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white"
                >
                  <option value="all">{lang === "hi" ? "सभी श्रेणियां" : "All Categories"}</option>
                  <option value="feed">{lang === "hi" ? "आहार (Feed)" : "Feed"}</option>
                  <option value="seed_chicks">{activeDomain === "fisheries" ? "मछली बीज" : "चूजे (DOC)"}</option>
                  <option value="medicine_health">{lang === "hi" ? "स्वास्थ्य व दवा" : "Health & Meds"}</option>
                  <option value="energy_electricity">{lang === "hi" ? "बिजली व ईंधन" : "Energy & Fuel"}</option>
                  <option value="labor_management">{lang === "hi" ? "मजदूरी" : "Labor"}</option>
                  <option value="equipment_supplies">{lang === "hi" ? "उपकरण/बिछावन" : "Supplies"}</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-emerald-950/60 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="pb-3 pl-1">{lang === "hi" ? "दिनांक" : "Date"}</th>
                    <th className="pb-3">{lang === "hi" ? "बैच का नाम" : "Batch"}</th>
                    <th className="pb-3">{lang === "hi" ? "श्रेणी" : "Category"}</th>
                    <th className="pb-3">{lang === "hi" ? "विक्रेता / विवरण" : "Vendor / Notes"}</th>
                    <th className="pb-3">{lang === "hi" ? "भुगतान" : "Payment"}</th>
                    <th className="pb-3 text-right">{lang === "hi" ? "रकम (₹)" : "Amount (₹)"}</th>
                    <th className="pb-3 text-right pr-1">{lang === "hi" ? "कार्रवाई" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-emerald-950/40">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        {lang === "hi" ? "कोई खर्च रिकॉर्ड नहीं मिला।" : "No expense records found."}
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/60 dark:hover:bg-[#071911]/40 transition-colors">
                        <td className="py-3 pl-1 font-mono text-slate-600 dark:text-slate-300">
                          {exp.date}
                        </td>
                        <td className="py-3 font-semibold text-slate-900 dark:text-white">
                          {exp.batchName}
                        </td>
                        <td className="py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                            {getCategoryLabel(exp.category)}
                          </span>
                        </td>
                        <td className="py-3 text-slate-700 dark:text-slate-300">
                          <span className="font-semibold block">{exp.vendor}</span>
                          {exp.notes && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                              {exp.notes}
                            </span>
                          )}
                          {exp.receiptNumber && (
                            <span className="text-[10px] font-mono text-slate-400 block">
                              Bill: {exp.receiptNumber}
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-400">
                          {exp.paymentMode}
                        </td>
                        <td className="py-3 text-right font-black text-slate-900 dark:text-white text-sm">
                          ₹{exp.amount.toLocaleString()}
                        </td>
                        <td className="py-3 text-right pr-1">
                          <button
                            type="button"
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0c241a] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-emerald-800/60">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-emerald-950/60 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === "hi" ? "नया फार्म खर्च दर्ज करें" : "Record Farm Expense"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "hi" ? "डोमेन (क्षेत्र) *" : "Domain *"}
                  </label>
                  <select
                    value={formDomain}
                    onChange={(e) => {
                      const d = e.target.value as ExpenseDomain;
                      setFormDomain(d);
                      const list = d === "fisheries" ? fisheriesBatches : poultryFlocks;
                      setFormBatchId(list[0]?.id || "");
                    }}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white"
                  >
                    <option value="fisheries">{lang === "hi" ? "मत्स्य पालन (Ponds)" : "Fisheries"}</option>
                    <option value="poultry">{lang === "hi" ? "कुक्कुट पालन (Sheds)" : "Poultry"}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "hi" ? "बैच चुनें *" : "Select Batch *"}
                  </label>
                  <select
                    value={formBatchId}
                    onChange={(e) => setFormBatchId(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white"
                  >
                    {(formDomain === "fisheries" ? fisheriesBatches : poultryFlocks).map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "hi" ? "व्यय श्रेणी *" : "Expense Category *"}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white"
                  >
                    <option value="feed">{lang === "hi" ? "आहार (Feed)" : "Feed"}</option>
                    <option value="seed_chicks">{formDomain === "fisheries" ? "मछली बीज (Fingerlings)" : "चूजे (DOC Chicks)"}</option>
                    <option value="medicine_health">{lang === "hi" ? "दवा व स्वास्थ्य (Medicine)" : "Medicine & Health"}</option>
                    <option value="energy_electricity">{lang === "hi" ? "बिजली/डीजल (Energy)" : "Energy & Fuel"}</option>
                    <option value="labor_management">{lang === "hi" ? "मजदूरी (Labor)" : "Labor"}</option>
                    <option value="equipment_supplies">{lang === "hi" ? "उपकरण व बिछावन" : "Supplies & Bedding"}</option>
                    <option value="maintenance">{lang === "hi" ? "रखरखाव (Maintenance)" : "Maintenance"}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "hi" ? "रकम (₹) *" : "Amount (₹) *"}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="any"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "hi" ? "दिनांक *" : "Date *"}
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "hi" ? "भुगतान माध्यम" : "Payment Mode"}
                  </label>
                  <select
                    value={formPaymentMode}
                    onChange={(e) => setFormPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white"
                  >
                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Cash">{lang === "hi" ? "नकद (Cash)" : "Cash"}</option>
                    <option value="Bank Transfer">{lang === "hi" ? "बैंक ट्रांसफर (NEFT/RTGS)" : "Bank Transfer"}</option>
                    <option value="Credit">{lang === "hi" ? "उधार / क्रेडिट (Credit)" : "Credit"}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "hi" ? "विक्रेता / दुकान का नाम" : "Vendor / Supplier"}
                  </label>
                  <input
                    type="text"
                    value={formVendor}
                    onChange={(e) => setFormVendor(e.target.value)}
                    placeholder="e.g. Kisan Feed Depot"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "hi" ? "बिल / रसीद नंबर" : "Bill / Receipt No."}
                  </label>
                  <input
                    type="text"
                    value={formReceipt}
                    onChange={(e) => setFormReceipt(e.target.value)}
                    placeholder="e.g. INV-1029"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === "hi" ? "अतिरिक्त विवरण / टिप्पणी" : "Notes / Details"}
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder={lang === "hi" ? "उदा: 25 बोरी 28% प्रोटीन दाना" : "e.g. 25 bags 28% CP feed"}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/60"
                >
                  {lang === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-[#0F5132] hover:bg-[#15803d] text-white shadow-xs"
                >
                  {lang === "hi" ? "खर्च सुरक्षित करें" : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
