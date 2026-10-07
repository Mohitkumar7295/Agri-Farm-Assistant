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
  Sparkles,
  Calendar,
} from "lucide-react";
import {
  dashboardTranslations,
  DashboardLanguage,
  DashboardContent,
} from "@/i18n/dashboardTranslations";
import { formatFarmerName } from "@/i18n/nameTransliteration";
import BatchTasksManager from "@/components/BatchTasksManager";

interface UserProfile {
  fullName?: string;
  fullNameHindi?: string;
  email?: string;
  mobileNumber?: string;
  villageCity?: string;
  state?: string;
  country?: string;
}

export default function TasksPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [lang, setLang] = useState<DashboardLanguage>("en");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Strict Auth Guard and Initializer
  useEffect(() => {
    // 0. Strict Auth Guard: without login no entry
    const token = typeof window !== "undefined" ? localStorage.getItem("agrifarm_jwt") : null;
    if (!token) {
      window.location.replace("/login");
      return;
    }
    setIsAuthenticated(true);

    // 1. Language
    const savedLang = localStorage.getItem("agrifarm_lang") as DashboardLanguage;
    if (savedLang && (savedLang === "en" || savedLang === "hi")) {
      setLang(savedLang);
    }

    // 2. Theme
    const savedTheme = localStorage.getItem("agrifarm_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // 3. User profile from localStorage
    const savedUser = localStorage.getItem("agrifarm_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUserProfile(parsed);
      } catch (err) {
        console.error("Failed to parse user profile:", err);
      }
    }
  }, []);

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
    { key: "tasks", label: content.nav.tasks || (lang === "hi" ? "दैनिक कार्य (Tasks)" : "Daily Tasks"), icon: CheckSquare, href: "/tasks", isActive: true },
    { key: "weather", label: content.nav.weather, icon: CloudSun, href: "/weather" },
    { key: "alerts", label: content.nav.alerts, icon: Bell, href: "/alerts", badge: "3" },
    { key: "expense", label: content.nav.expense, icon: Receipt, href: "/expense" },
    { key: "helpSupport", label: content.nav.helpSupport, icon: HelpCircle, href: "/help" },
    { key: "settings", label: content.nav.settings, icon: Settings, href: "/settings" },
  ];

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
        {/* Sidebar Brand Header */}
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
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-400">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-emerald-950/40 space-y-2">
          {/* Status Indicator */}
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

          {/* User Profile Info & Logout */}
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
      {/* 2. MOBILE TOP NAVIGATION & SLIDE-OUT DRAWER                               */}
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
            aria-label={content.header.langToggleLabel}
            className="px-2 py-1 text-[11px] font-semibold rounded-lg border border-slate-200 dark:border-emerald-900/60 text-slate-700 dark:text-slate-200"
          >
            {lang === "en" ? "हिन्दी" : "EN"}
          </button>

          <button
            onClick={toggleTheme}
            type="button"
            aria-label={content.header.themeToggleLabel}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-emerald-900/60 text-slate-700 dark:text-slate-200"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <button
            onClick={handleLogout}
            type="button"
            title={content.nav.logout}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-emerald-900/60 text-slate-600 dark:text-slate-400 hover:text-red-600"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer */}
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
                  aria-label={content.header.closeMenuLabel}
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
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{lang === "hi" ? "दैनिक कार्य प्रबंधन" : "Daily Tasks"}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
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
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-950 text-white shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-white to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-emerald-200 border border-white/15 backdrop-blur-xs mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>{lang === "hi" ? "भाकृअनुप मानक दैनिक फार्म संचालन" : "ICAR Standard Farm Operations"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {lang === "hi" ? "दैनिक कार्य प्रबंधन केंद्र" : "Daily Tasks Management Hub"}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 leading-relaxed">
                {lang === "hi"
                  ? "मत्स्य पालन (तालाब-वार) एवं कुक्कुट पालन (शेड-वार) बैचों के लिए निर्धारित वैज्ञानिक कार्य, आहार चार्ट, बायो-सुरक्षा और स्वास्थ्य जांच एक ही स्थान पर प्रबंधित करें।"
                  : "Batch-wise scheduled daily operations, feeding curves, biosecurity & health protocols for all Fisheries ponds and Poultry sheds in one unified workstation."}
              </p>
            </div>
          </div>

          {/* Full-Feature Batch Tasks Manager */}
          <BatchTasksManager
            lang={lang}
            onBatchNavigate={(domain, batchId) => {
              if (domain === "fisheries") {
                window.location.href = `/fisheries?batchId=${batchId}`;
              } else {
                window.location.href = `/poultry?flockId=${batchId}`;
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}
