"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  Bot,
  Waves,
  Feather,
  CloudSun,
  Bell,
  Receipt,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Moon,
  Languages,
  ShieldCheck,
  Building,
  Check,
  Calendar,
  Sparkles,
  ArrowUpRight,
  CheckSquare,
} from "lucide-react";
import {
  dashboardTranslations,
  DashboardLanguage,
  DashboardContent,
} from "@/i18n/dashboardTranslations";
import { formatFarmerName } from "@/i18n/nameTransliteration";

type SidebarNavKey =
  | "home"
  | "aiAssistant"
  | "fisheries"
  | "poultry"
  | "tasks"
  | "weather"
  | "alerts"
  | "expense"
  | "helpSupport"
  | "settings";

interface UserProfile {
  fullName?: string;
  fullNameHindi?: string;
  email?: string;
  mobileNumber?: string;
  villageCity?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  farmLocation?: {
    latitude?: number;
    longitude?: number;
  };
}

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [lang, setLang] = useState<DashboardLanguage>("en");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<SidebarNavKey>("home");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Strict Auth Guard and Initializer
  useEffect(() => {
    // 0. Strict Auth Guard: without login no entry in dashboard from anywhere
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

  // Dynamic time-based greeting strictly matching the selected language
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return content.header.greetingMorning;
    if (hour < 17) return content.header.greetingAfternoon;
    return content.header.greetingEvening;
  };

  // Strictly localized farmer profile name without mixing languages
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

  const handleNavClick = (key: SidebarNavKey) => {
    setActiveNav(key);
    setMobileMenuOpen(false);
    if (key === "fisheries") {
      window.location.href = "/fisheries";
    } else if (key === "aiAssistant") {
      window.location.href = "/advisory";
    } else if (key === "poultry") {
      window.location.href = "/poultry";
    } else if (key === "tasks") {
      window.location.href = "/tasks";
    } else if (key === "weather") {
      window.location.href = "/weather";
    } else if (key === "alerts") {
      window.location.href = "/alerts";
    } else if (key === "expense") {
      window.location.href = "/expense";
    } else if (key === "helpSupport") {
      window.location.href = "/help";
    } else if (key === "settings") {
      window.location.href = "/settings";
    }
  };

  const navItems = [
    { key: "home" as SidebarNavKey, label: content.nav.home, icon: Home },
    { key: "aiAssistant" as SidebarNavKey, label: content.nav.aiAssistant, icon: Bot },
    { key: "fisheries" as SidebarNavKey, label: content.nav.fisheries, icon: Waves },
    { key: "poultry" as SidebarNavKey, label: content.nav.poultry, icon: Feather },
    { key: "tasks" as SidebarNavKey, label: content.nav.tasks || (lang === "hi" ? "दैनिक कार्य (Tasks)" : "Daily Tasks"), icon: CheckSquare },
    { key: "weather" as SidebarNavKey, label: content.nav.weather, icon: CloudSun },
    { key: "alerts" as SidebarNavKey, label: content.nav.alerts, icon: Bell, badge: "3" },
    { key: "expense" as SidebarNavKey, label: content.nav.expense, icon: Receipt },
    { key: "helpSupport" as SidebarNavKey, label: content.nav.helpSupport, icon: HelpCircle },
    { key: "settings" as SidebarNavKey, label: content.nav.settings, icon: Settings },
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
            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNavClick(item.key)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shadow-2xs border-l-3 border-[#0F5132] dark:border-emerald-500"
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
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: System Status & User Profile / Logout */}
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

        {/* Quick Controls on Mobile Header */}
        <div className="flex items-center gap-2">
          {/* Language Switch */}
          <button
            onClick={toggleLanguage}
            type="button"
            aria-label={content.header.langToggleLabel}
            className="px-2 py-1 text-[11px] font-semibold rounded-lg border border-slate-200 dark:border-emerald-900/60 text-slate-700 dark:text-slate-200"
          >
            {lang === "en" ? "हिन्दी" : "EN"}
          </button>

          {/* Theme Switch */}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label={content.header.themeToggleLabel}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-emerald-900/60 text-slate-700 dark:text-slate-200"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-700" />}
          </button>

          {/* User Initial Avatar */}
          <div className="w-8 h-8 rounded-lg bg-[#0F5132] text-white flex items-center justify-center text-xs font-bold">
            {farmerInitials}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop & Slide-out Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85vw] bg-white dark:bg-[#07130e] h-full shadow-2xl flex flex-col justify-between z-10 p-4 border-r border-slate-200 dark:border-emerald-950/60">
            <div>
              {/* Drawer Header */}
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

              {/* Navigation Items */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleNavClick(item.key)}
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
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-emerald-950/40 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0F5132] text-white flex items-center justify-center text-xs font-bold">
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
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{content.nav.logout}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN DASHBOARD CONTENT (TO THE RIGHT OF THE SIDEBAR)                   */}
      {/* ========================================================================= */}
      <main className="flex-1 lg:pl-64 min-w-0 flex flex-col">
        {/* Top Header Bar on Desktop */}
        <div className="w-full border-b border-slate-200/80 dark:border-emerald-950/50 bg-white/70 dark:bg-[#07130e]/70 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Farmer Greeting */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {getGreeting()}, {farmerName}
                </h1>
                <div className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {content.header.liveFarmBadge}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                {content.header.overviewSubtitle}
              </p>
            </div>

            {/* Right: Weather, Notifications & Controls */}
            <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
              {/* Weather Widget */}
              <Link
                href="/weather"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-emerald-900/50 bg-white dark:bg-[#0c241a]/60 shadow-2xs text-xs cursor-pointer hover:border-emerald-500/60 transition-colors"
                title={lang === "hi" ? "मौसम केंद्र पर जाएं" : "Go to Farm Weather"}
              >
                <CloudSun className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {lang === "hi" ? "मौसम केंद्र" : "Weather"}
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                    • {userProfile?.villageCity || content.header.weatherCity}
                  </span>
                </div>
              </Link>

              {/* Notification Bell */}
              <Link
                href="/alerts"
                title={content.header.notificationsTooltip}
                className="relative p-2 rounded-xl border border-slate-200 dark:border-emerald-900/50 bg-white dark:bg-[#0c241a]/60 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors shadow-2xs"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
              </Link>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                type="button"
                aria-label={content.header.langToggleLabel}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-emerald-900/50 bg-white dark:bg-[#0c241a]/60 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors shadow-2xs"
              >
                <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === "en" ? "हिन्दी" : "English"}</span>
              </button>

              {/* Theme Switcher */}
              <button
                onClick={toggleTheme}
                type="button"
                aria-label={content.header.themeToggleLabel}
                className="hidden sm:inline-flex p-2 rounded-xl border border-slate-200 dark:border-emerald-900/50 bg-white dark:bg-[#0c241a]/60 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors shadow-2xs"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-emerald-700" />
                )}
              </button>

              {/* Profile Avatar Pill */}
              <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-emerald-950/60">
                <div className="w-8 h-8 rounded-xl bg-[#0F5132] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                  {farmerInitials}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {farmerName}
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                    {content.header.verifiedFarmer}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Body Container */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* ========================================================================= */}
          {/* SECTION A: QUICK OVERVIEW (4 COMPACT CARDS)                               */}
          {/* ========================================================================= */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Card 1: Active Farms */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0c241a]/60 border border-slate-200/90 dark:border-emerald-800/40 shadow-xs hover:border-emerald-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {content.quickOverview.activeFarmsTitle}
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0F5132] dark:text-emerald-400">
                    <Building className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {content.quickOverview.activeFarmsValue}
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 font-medium">
                    {content.quickOverview.activeFarmsSub}
                  </p>
                </div>
              </div>

              {/* Card 2: Total Fish */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0c241a]/60 border border-slate-200/90 dark:border-emerald-800/40 shadow-xs hover:border-emerald-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {content.quickOverview.totalFishTitle}
                  </span>
                  <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400">
                    <Waves className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {content.quickOverview.totalFishValue}
                  </p>
                  <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5 font-medium">
                    {content.quickOverview.totalFishSub}
                  </p>
                </div>
              </div>

              {/* Card 3: Poultry Birds */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0c241a]/60 border border-slate-200/90 dark:border-emerald-800/40 shadow-xs hover:border-emerald-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {content.quickOverview.poultryBirdsTitle}
                  </span>
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                    <Feather className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {content.quickOverview.poultryBirdsValue}
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 font-medium">
                    {content.quickOverview.poultryBirdsSub}
                  </p>
                </div>
              </div>

              {/* Card 4: Today's Expense */}
              <Link
                href="/expense"
                className="p-4 rounded-2xl bg-white dark:bg-[#0c241a]/60 border border-slate-200/90 dark:border-emerald-800/40 shadow-xs hover:border-emerald-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {content.quickOverview.todayExpenseTitle}
                  </span>
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
                    <Receipt className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {content.quickOverview.todayExpenseValue}
                  </p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5 font-medium">
                    {content.quickOverview.todayExpenseSub}
                  </p>
                </div>
              </Link>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION B: FARM OVERVIEW (FISHERIES & POULTRY HUBS)                       */}
          {/* ========================================================================= */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{content.farmOverview.title}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* 1. Fisheries Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c241a]/60 border border-slate-200/90 dark:border-emerald-800/40 shadow-xs">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-emerald-950/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300">
                      <Waves className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {content.farmOverview.fisheriesTitle}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {content.farmOverview.fisheriesActivePonds}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                    {content.farmOverview.fisheriesStatusTag}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3.5 my-4">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#081a13] border border-slate-100 dark:border-emerald-950/40">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                      {content.farmOverview.activeBatchesLabel}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                      {content.farmOverview.fisheriesActiveBatches}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#081a13] border border-slate-100 dark:border-emerald-950/40">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                      {content.farmOverview.totalFishStockLabel}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                      {content.farmOverview.fisheriesTotalFish}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#081a13] border border-slate-100 dark:border-emerald-950/40">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                      {content.farmOverview.avgBodyWeightLabel}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                      {content.farmOverview.fisheriesAvgWeight}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#081a13] border border-slate-100 dark:border-emerald-950/40">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                      {content.farmOverview.survivalHealthLabel}
                    </span>
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 block mt-0.5">
                      {content.farmOverview.fisheriesHealthStatus}
                    </span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {content.farmOverview.waterTelemetryPill}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = "/fisheries";
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-200 transition-colors"
                  >
                    <span>{content.farmOverview.btnViewDetails}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 2. Poultry Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c241a]/60 border border-slate-200/90 dark:border-emerald-800/40 shadow-xs">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-emerald-950/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                      <Feather className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {content.farmOverview.poultryTitle}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {content.farmOverview.poultryActiveSheds}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                    {content.farmOverview.poultryStatusTag}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3.5 my-4">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#081a13] border border-slate-100 dark:border-emerald-950/40">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                      {content.farmOverview.activeFlocksLabel}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                      {content.farmOverview.poultryActiveBatches}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#081a13] border border-slate-100 dark:border-emerald-950/40">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                      {content.farmOverview.totalBirdsCountLabel}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                      {content.farmOverview.poultryTotalBirds}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#081a13] border border-slate-100 dark:border-emerald-950/40">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                      {content.farmOverview.avgWeightLabel}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                      {content.farmOverview.poultryAvgWeight}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#081a13] border border-slate-100 dark:border-emerald-950/40">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                      {content.farmOverview.healthMortalityLabel}
                    </span>
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 block mt-0.5">
                      {content.farmOverview.poultryHealthStatus}
                    </span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {content.farmOverview.shedTelemetryPill}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = "/poultry";
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-200 transition-colors"
                  >
                    <span>{content.farmOverview.btnViewDetails}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION C: FARM MONITORING & PERFORMANCE                                  */}
          {/* ========================================================================= */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c241a]/60 border border-slate-200/90 dark:border-emerald-800/40 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-emerald-950/40 gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0F5132] dark:text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {content.monitoring.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {content.monitoring.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl">
                    {content.monitoring.liveTelemetryBadge}
                  </span>
                  <Link
                    href="/alerts"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors shadow-2xs"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{content.alerts.title}</span>
                  </Link>
                </div>
              </div>

              {/* 3 Monitoring Blocks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                {/* Fish Growth DWG */}
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#081a13] border border-slate-100 dark:border-emerald-950/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {content.monitoring.fishGrowthTitle}
                    </span>
                    <span className="text-xs font-extrabold text-[#0F5132] dark:text-emerald-400">
                      {content.monitoring.fishGrowthValue}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {content.monitoring.fishGrowthSub}
                  </p>
                  <div className="mt-3 h-2 w-full bg-slate-200 dark:bg-emerald-950/80 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: "78%" }} />
                  </div>
                </div>

                {/* Feed Intake & FCR */}
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#081a13] border border-slate-100 dark:border-emerald-950/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {content.monitoring.feedConsumptionTitle}
                    </span>
                    <span className="text-xs font-extrabold text-teal-700 dark:text-teal-400">
                      {content.monitoring.feedConsumptionValue}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {content.monitoring.feedConsumptionSub}
                  </p>
                  <div className="mt-3 h-2 w-full bg-slate-200 dark:bg-emerald-950/80 rounded-full overflow-hidden flex">
                    <div className="h-full bg-teal-600 rounded-full" style={{ width: "88%" }} />
                  </div>
                </div>

                {/* Poultry Growth */}
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#081a13] border border-slate-100 dark:border-emerald-950/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {content.monitoring.poultryGrowthTitle}
                    </span>
                    <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400">
                      {content.monitoring.poultryGrowthValue}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {content.monitoring.poultryGrowthSub}
                  </p>
                  <div className="mt-3 h-2 w-full bg-slate-200 dark:bg-emerald-950/80 rounded-full overflow-hidden flex">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "84%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Notice */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-emerald-950/40 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>{content.monitoring.icarBenchmarkNotice}</span>
              <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                {content.monitoring.telemetryUpdatedNotice}
              </span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
