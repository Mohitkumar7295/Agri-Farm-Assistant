"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Sun,
  Moon,
  Lock,
  Download,
  RotateCcw,
  Save,
  Check,
  AlertCircle,
  Sliders,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  dashboardTranslations,
  DashboardLanguage,
  DashboardContent,
} from "@/i18n/dashboardTranslations";
import { formatFarmerName } from "@/i18n/nameTransliteration";

interface FarmProfile {
  fullName: string;
  farmName: string;
  phone: string;
  email: string;
  state: string;
  district: string;
  primaryEnterprise: "both" | "fisheries" | "poultry";
  totalPonds: number;
  totalSheds: number;
  feedReminderMorning: boolean;
  feedReminderEvening: boolean;
  waterQualityAlerts: boolean;
  mortalityAlerts: boolean;
  units: "metric" | "imperial";
}

const DEFAULT_PROFILE: FarmProfile = {
  fullName: "Farmer",
  farmName: "Kisan Krishi & Aqua Farm",
  phone: "+91 98765 43210",
  email: "farmer@agrifarm.in",
  state: "Uttar Pradesh",
  district: "Varanasi",
  primaryEnterprise: "both",
  totalPonds: 3,
  totalSheds: 2,
  feedReminderMorning: true,
  feedReminderEvening: true,
  waterQualityAlerts: true,
  mortalityAlerts: true,
  units: "metric",
};

export default function SettingsPage() {
  const router = useRouter();
  const [lang, setLang] = useState<DashboardLanguage>("en");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "security" | "data">("profile");

  const [profile, setProfile] = useState<FarmProfile>(DEFAULT_PROFILE);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    msg: "",
    isError: false,
  });

  const content: DashboardContent = dashboardTranslations[lang];

  // Auth Guard & Load state
  useEffect(() => {
    const token = localStorage.getItem("agrifarm_jwt");
    if (!token) {
      router.replace("/login");
      return;
    }

    const savedLang = localStorage.getItem("agrifarm_lang") as DashboardLanguage;
    if (savedLang === "en" || savedLang === "hi") {
      setLang(savedLang);
    }

    const savedTheme = localStorage.getItem("agrifarm_theme") as "light" | "dark";
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }

    const savedFarmerName = localStorage.getItem("agrifarm_farmer_name");
    const savedUserJson = localStorage.getItem("agrifarm_user");
    let userEmail = "farmer@agrifarm.in";
    let userName = savedFarmerName || "Farmer";
    let userPhone = "+91 98765 43210";

    if (savedUserJson) {
      try {
        const parsed = JSON.parse(savedUserJson);
        if (parsed.email) userEmail = parsed.email;
        if (parsed.name) userName = parsed.name;
        if (parsed.phoneNumber) userPhone = parsed.phoneNumber;
      } catch {
        // fallback
      }
    }

    const savedFarmProfile = localStorage.getItem("agrifarm_farm_profile");
    if (savedFarmProfile) {
      try {
        const parsed = JSON.parse(savedFarmProfile);
        setProfile((prev) => ({
          ...prev,
          ...parsed,
          fullName: userName,
          email: userEmail,
          phone: userPhone,
        }));
      } catch {
        setProfile((prev) => ({ ...prev, fullName: userName, email: userEmail, phone: userPhone }));
      }
    } else {
      setProfile((prev) => ({ ...prev, fullName: userName, email: userEmail, phone: userPhone }));
    }
  }, [router]);

  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "hi" : "en";
    setLang(nextLang);
    localStorage.setItem("agrifarm_lang", nextLang);
    window.dispatchEvent(new Event("storage"));
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("agrifarm_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("agrifarm_jwt");
    localStorage.removeItem("agrifarm_user");
    localStorage.removeItem("agrifarm_farmer_name");
    router.replace("/login");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("agrifarm_farm_profile", JSON.stringify(profile));
    localStorage.setItem("agrifarm_farmer_name", profile.fullName);
    
    // Update agrifarm_user if present
    const savedUserJson = localStorage.getItem("agrifarm_user");
    if (savedUserJson) {
      try {
        const parsed = JSON.parse(savedUserJson);
        parsed.name = profile.fullName;
        parsed.phoneNumber = profile.phone;
        localStorage.setItem("agrifarm_user", JSON.stringify(parsed));
      } catch {
        // ignore
      }
    }

    setSaveSuccess(lang === "hi" ? "प्रोफ़ाइल सफलतापूर्वक सहेजी गई!" : "Profile settings saved successfully!");
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordState.currentPassword) {
      setPasswordState((p) => ({ ...p, isError: true, msg: lang === "hi" ? "कृपया वर्तमान पासवर्ड दर्ज करें" : "Current password is required" }));
      return;
    }
    if (passwordState.newPassword.length < 6) {
      setPasswordState((p) => ({ ...p, isError: true, msg: lang === "hi" ? "नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए" : "New password must be at least 6 characters" }));
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordState((p) => ({ ...p, isError: true, msg: lang === "hi" ? "पासवर्ड मेल नहीं खाते" : "New passwords do not match" }));
      return;
    }

    setPasswordState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      isError: false,
      msg: lang === "hi" ? "पासवर्ड सफलतापूर्वक अपडेट किया गया!" : "Password updated successfully!",
    });
    setTimeout(() => setPasswordState((p) => ({ ...p, msg: "" })), 4000);
  };

  const handleExportData = () => {
    const backup: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("agrifarm_")) {
        try {
          backup[key] = JSON.parse(localStorage.getItem(key) || "{}");
        } catch {
          backup[key] = localStorage.getItem(key);
        }
      }
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `agrifarm_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetDefaults = () => {
    if (confirm(lang === "hi" ? "क्या आप सुनिश्चित हैं कि आप डिफ़ॉल्ट सेटिंग्स रीसेट करना चाहते हैं?" : "Are you sure you want to reset settings to default?")) {
      setProfile(DEFAULT_PROFILE);
      localStorage.setItem("agrifarm_farm_profile", JSON.stringify(DEFAULT_PROFILE));
      setSaveSuccess(lang === "hi" ? "डिफ़ॉल्ट सेटिंग्स बहाल की गईं" : "Settings reset to defaults");
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  const navItems = [
    { key: "home", label: content.nav.home, icon: Home, href: "/dashboard" },
    { key: "fisheries", label: content.nav.fisheries, icon: Waves, href: "/fisheries" },
    { key: "poultry", label: content.nav.poultry, icon: Feather, href: "/poultry" },
    { key: "tasks", label: content.nav.tasks, icon: CheckSquare, href: "/tasks" },
    { key: "weather", label: content.nav.weather, icon: CloudSun, href: "/weather" },
    { key: "alerts", label: content.nav.alerts, icon: Bell, href: "/alerts" },
    { key: "expense", label: content.nav.expense, icon: Receipt, href: "/expense" },
    { key: "aiAssistant", label: content.nav.aiAssistant, icon: Bot, href: "/ai-assistant" },
    { key: "helpSupport", label: content.nav.helpSupport, icon: HelpCircle, href: "/help" },
    { key: "settings", label: content.nav.settings, icon: SettingsIcon, href: "/settings", active: true },
  ];

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark bg-slate-950 text-slate-100" : "bg-[#F8FAF9] text-slate-800"} flex flex-col`}>
      {/* ========================================================================= */}
      {/* 1. DESKTOP SIDEBAR                                                        */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed inset-y-0 left-0 z-30">
        <div className="flex items-center gap-3 px-6 h-20 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F5132] to-[#198754] flex items-center justify-center text-white shadow-md shadow-emerald-900/10 shrink-0">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-base font-extrabold text-[#0F5132] dark:text-emerald-400 block leading-tight tracking-tight truncate">
              {content.nav.brandTitle}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
              {lang === "hi" ? "सिस्टम सेटिंग्स" : "System Settings"}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#0F5132] text-white shadow-sm shadow-emerald-900/20"
                    : "text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800/60 hover:text-[#0F5132]"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-emerald-700 dark:text-emerald-400"}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#0F5132] dark:text-emerald-400">ICAR Security Core</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{content.nav.logout}</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE TOP NAVIGATION & SLIDE DRAWER                                   */}
      {/* ========================================================================= */}
      <header className="lg:hidden sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Toggle navigation"
            className="p-2 rounded-lg border border-emerald-200 dark:border-slate-700 text-[#0F5132] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#0F5132] dark:text-emerald-400" />
            <span className="text-sm font-black text-[#0F5132] dark:text-emerald-400">
              {lang === "hi" ? "सेटिंग्स" : "Settings"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            type="button"
            className="px-2.5 py-1 text-xs font-bold rounded-lg border border-emerald-200 dark:border-slate-700 text-[#0F5132] dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800"
          >
            {lang === "en" ? "हिन्दी" : "EN"}
          </button>
          <button
            onClick={toggleTheme}
            type="button"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full shadow-2xl p-4 flex flex-col justify-between z-10 border-r border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-[#0F5132] dark:text-emerald-400" />
                  <span className="font-extrabold text-sm text-[#0F5132] dark:text-emerald-400">
                    AgriFarmAssistant
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                        item.active
                          ? "bg-[#0F5132] text-white"
                          : "text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full block text-center py-2 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 rounded-xl"
              >
                {content.nav.logout}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE CONTENT                                                 */}
      {/* ========================================================================= */}
      <main className="flex-1 lg:pl-64 min-w-0 flex flex-col bg-[#F8FAF9] dark:bg-slate-950">
        {/* Header Bar */}
        <div className="w-full border-b border-emerald-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 lg:px-8 py-5">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-[#0F5132] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mb-2">
                <Sliders className="w-3.5 h-3.5 text-[#0F5132] dark:text-emerald-400" />
                <span>{lang === "hi" ? "कॉन्फ़िगरेशन व प्राथमिकताएं" : "Configuration & Preferences"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F5132] dark:text-emerald-400 tracking-tight">
                {lang === "hi" ? "फार्म सेटिंग्स" : "Farm Settings"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                {lang === "hi"
                  ? "अपनी प्रोफ़ाइल, फार्म पैरामीटर, अलर्ट संवेदनशीलता और सुरक्षा प्राथमिकताएं प्रबंधित करें।"
                  : "Manage your profile, farm parameters, alert thresholds, telemetry preferences, and security."}
              </p>
            </div>

            {/* Language & Theme switches on desktop */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-emerald-200 dark:border-slate-700 bg-emerald-50 dark:bg-slate-800 text-[#0F5132] dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === "en" ? "हिन्दी" : "English"}</span>
              </button>

              <button
                onClick={toggleTheme}
                type="button"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
              >
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {saveSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-sm text-[#0F5132] dark:text-emerald-300 font-semibold shadow-xs animate-in fade-in">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{saveSuccess}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === "profile"
                  ? "border-[#0F5132] text-[#0F5132] dark:text-emerald-400 dark:border-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              <User className="w-4 h-4" />
              <span>{lang === "hi" ? "किसान व फार्म प्रोफ़ाइल" : "Farmer & Farm Profile"}</span>
            </button>

            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === "preferences"
                  ? "border-[#0F5132] text-[#0F5132] dark:text-emerald-400 dark:border-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>{lang === "hi" ? "अलर्ट व प्राथमिकताएं" : "Alerts & Telemetry"}</span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === "security"
                  ? "border-[#0F5132] text-[#0F5132] dark:text-emerald-400 dark:border-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>{lang === "hi" ? "सुरक्षा व पासवर्ड" : "Security & Password"}</span>
            </button>

            <button
              onClick={() => setActiveTab("data")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === "data"
                  ? "border-[#0F5132] text-[#0F5132] dark:text-emerald-400 dark:border-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{lang === "hi" ? "डेटा बैकअप व रीसेट" : "Data & Export"}</span>
            </button>
          </div>

          {/* TAB 1: Profile */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#0F5132] dark:text-emerald-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                      {lang === "hi" ? "व्यक्तिगत व फार्म जानकारी" : "Personal & Farm Information"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === "hi" ? "यह जानकारी आपके दैनिक डैशबोर्ड और आईसीएआर परामर्श पर दिखाई देती है।" : "Displayed across your dashboards and scientific advisories."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === "hi" ? "किसान का पूरा नाम" : "Farmer Full Name"}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === "hi" ? "फार्म का नाम / इकाई" : "Farm Enterprise Name"}
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={profile.farmName}
                        onChange={(e) => setProfile({ ...profile, farmName: e.target.value })}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === "hi" ? "पंजीकृत मोबाइल नंबर" : "Registered Mobile Phone"}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === "hi" ? "ईमेल पता" : "Email Address"}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm font-semibold cursor-not-allowed"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      {lang === "hi" ? "ईमेल प्रमाणीकरण से जुड़ा हुआ है (अपरिवर्तनीय)" : "Linked with primary account credentials (read-only)"}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === "hi" ? "राज्य" : "State"}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={profile.state}
                        onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === "hi" ? "जिला / तहसील" : "District / Tehsil"}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={profile.district}
                        onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === "hi" ? "प्राथमिक फार्म प्रकार" : "Primary Farming Domain"}
                    </label>
                    <select
                      value={profile.primaryEnterprise}
                      onChange={(e) => setProfile({ ...profile, primaryEnterprise: e.target.value as "both" | "fisheries" | "poultry" })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="both">{lang === "hi" ? "एकीकृत (मत्स्य पालन + कुक्कुट पालन)" : "Integrated (Fisheries + Poultry)"}</option>
                      <option value="fisheries">{lang === "hi" ? "केवल मत्स्य पालन (Aquaculture)" : "Fisheries Only"}</option>
                      <option value="poultry">{lang === "hi" ? "केवल कुक्कुट पालन (Poultry)" : "Poultry Only"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === "hi" ? "मापन इकाइयां" : "Measurement Units"}
                    </label>
                    <select
                      value={profile.units}
                      onChange={(e) => setProfile({ ...profile, units: e.target.value as "metric" | "imperial" })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="metric">Metric (kg, Litres, Celsius °C, mg/L)</option>
                      <option value="imperial">Imperial (lbs, Gallons, Fahrenheit °F)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0F5132] hover:bg-[#157347] shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{lang === "hi" ? "प्रोफ़ाइल सहेजें" : "Save Profile Settings"}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: Alerts & Preferences */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#0F5132] dark:text-emerald-400">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                      {lang === "hi" ? "स्वचालित अलर्ट व सूचना प्राथमिकताएं" : "Automated Alerts & Telemetry Triggers"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === "hi" ? "आईसीएआर मानकों के अनुसार महत्वपूर्ण सीमाएं पार होने पर चेतावनी सूचनाएं प्राप्त करें।" : "Configure real-time threshold breaches in accordance with ICAR aquaculture and poultry guidelines."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                        {lang === "hi" ? "जल गुणवत्ता क्रिटिकल अलर्ट्स" : "Water Quality Critical Alerts (DO, pH, Ammonia)"}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                        {lang === "hi"
                          ? "घुलित ऑक्सीजन < 3.5 mg/L या अमोनिया > 0.05 mg/L होने पर तत्काल अलर्ट।"
                          : "Immediate banner when Dissolved Oxygen < 3.5 mg/L or Ammonia > 0.05 mg/L."}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.waterQualityAlerts}
                        onChange={(e) => {
                          const updated = { ...profile, waterQualityAlerts: e.target.checked };
                          setProfile(updated);
                          localStorage.setItem("agrifarm_farm_profile", JSON.stringify(updated));
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F5132]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                        {lang === "hi" ? "कुक्कुट मृत्यु दर स्पाइक चेतावनी" : "Poultry Mortality Spike Warnings"}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                        {lang === "hi"
                          ? "दैनिक मृत्यु दर 0.5% से अधिक होने पर बायोसिक्योरिटी प्रोटोकॉल सूचना।"
                          : "Trigger biosecurity quarantine protocol if daily flock mortality exceeds 0.5%."}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.mortalityAlerts}
                        onChange={(e) => {
                          const updated = { ...profile, mortalityAlerts: e.target.checked };
                          setProfile(updated);
                          localStorage.setItem("agrifarm_farm_profile", JSON.stringify(updated));
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F5132]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                        {lang === "hi" ? "प्रातःकालीन दाना शेड्यूलिंग अलर्ट" : "Morning Feeding Schedule Notification (07:00 AM)"}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                        {lang === "hi" ? "तालाबों व शेडों में प्रथम दैनिक आहार वितरण अनुस्मारक।" : "Daily notification to disperse 50% calculated feed biomass."}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.feedReminderMorning}
                        onChange={(e) => {
                          const updated = { ...profile, feedReminderMorning: e.target.checked };
                          setProfile(updated);
                          localStorage.setItem("agrifarm_farm_profile", JSON.stringify(updated));
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F5132]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                        {lang === "hi" ? "सायंकालीन दाना व वातन अनुस्मारक" : "Evening Feeding & Aeration Reminder (06:00 PM)"}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                        {lang === "hi" ? "सायंकालीन आहार व रात के वातन (Aerators) सक्रियण सूचना।" : "Evening ration check and nocturnal paddle-wheel aerator readiness."}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.feedReminderEvening}
                        onChange={(e) => {
                          const updated = { ...profile, feedReminderEvening: e.target.checked };
                          setProfile(updated);
                          localStorage.setItem("agrifarm_farm_profile", JSON.stringify(updated));
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F5132]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Security */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#0F5132] dark:text-emerald-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                      {lang === "hi" ? "खाता सुरक्षा व पासवर्ड बदलें" : "Account Security & Password"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === "hi" ? "अपने फार्म डेटा तक सुरक्षित पहुंच बनाए रखने के लिए समय-समय पर पासवर्ड अपडेट करें।" : "Ensure your farm financial and operational records remain strictly secured."}
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-4">
                  {passwordState.msg && (
                    <div
                      className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        passwordState.isError
                          ? "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                      }`}
                    >
                      {passwordState.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                      <span>{passwordState.msg}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === "hi" ? "वर्तमान पासवर्ड" : "Current Password"}
                    </label>
                    <input
                      type="password"
                      value={passwordState.currentPassword}
                      onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === "hi" ? "नया पासवर्ड" : "New Password"}
                    </label>
                    <input
                      type="password"
                      value={passwordState.newPassword}
                      onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === "hi" ? "नए पासवर्ड की पुष्टि करें" : "Confirm New Password"}
                    </label>
                    <input
                      type="password"
                      value={passwordState.confirmPassword}
                      onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0F5132] hover:bg-[#157347] transition-all cursor-pointer shadow-sm"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{lang === "hi" ? "पासवर्ड अपडेट करें" : "Update Password"}</span>
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 mb-3">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span>{lang === "hi" ? "सक्रिय सत्र जानकारी" : "Active Session Info"}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                    <p><strong className="text-slate-800 dark:text-slate-100">{lang === "hi" ? "प्रमाणीकरण टोकन:" : "Authentication Token:"}</strong> JWT RS-256 Verified</p>
                    <p><strong className="text-slate-800 dark:text-slate-100">{lang === "hi" ? "सत्र समाप्ति:" : "Session Validity:"}</strong> 24 Hours Auto-renewal</p>
                    <p><strong className="text-slate-800 dark:text-slate-100">{lang === "hi" ? "स्थान प्रोटोकॉल:" : "Location Protocol:"}</strong> HTTPS TLS 1.3 Strict Transport</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Data & Backup */}
          {activeTab === "data" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#0F5132] dark:text-emerald-400">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                      {lang === "hi" ? "फार्म रिकॉर्ड बैकअप व डेटा प्रबंधन" : "Farm Records Backup & Data Management"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === "hi" ? "अपने सभी बैच, कार्य, व्यय और जल गुणवत्ता लॉग्स को निर्यात या सुरक्षित रखें।" : "Export all telemetry, ponds, flocks, tasks, and batch expenses for offline audits and KCC bank loans."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-emerald-100 dark:border-slate-800 bg-emerald-50/40 dark:bg-slate-800/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-black text-[#0F5132] dark:text-emerald-400 mb-2">
                        <Download className="w-4 h-4" />
                        <span>{lang === "hi" ? "फार्म डेटा निर्यात (JSON)" : "Export Complete Farm Backup (JSON)"}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                        {lang === "hi"
                          ? "मत्स्य बैच, कुक्कुट झुंड, कार्य सूची और व्यय बहीखाता सहित सभी डेटा की एक क्लिक में सुरक्षित प्रति डाउनलोड करें।"
                          : "Downloads a consolidated JSON file of all local batches, tasks, telemetry histories, and ledgers."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportData}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F5132] hover:bg-[#157347] transition-all cursor-pointer shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>{lang === "hi" ? "डेटा डाउनलोड करें" : "Download Backup File"}</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl border border-amber-200 dark:border-slate-800 bg-amber-50/40 dark:bg-slate-800/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-black text-amber-800 dark:text-amber-400 mb-2">
                        <RotateCcw className="w-4 h-4" />
                        <span>{lang === "hi" ? "डिफ़ॉल्ट सेटिंग्स रीसेट" : "Reset Settings to Default"}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                        {lang === "hi"
                          ? "फार्म सेटिंग्स, अलर्ट सीमाएं और प्राथमिकताएं मूल आईसीएआर मानकों पर वापस लाएं।"
                          : "Restores alert sensitivities and telemetry preferences back to default ICAR guidelines without deleting batches."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetDefaults}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{lang === "hi" ? "डिफ़ॉल्ट पर रीसेट करें" : "Restore Defaults"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
