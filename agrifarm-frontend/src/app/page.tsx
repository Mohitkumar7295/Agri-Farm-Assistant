"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Languages,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
  CheckCircle2,
  Users,
  Star,
  ShieldCheck,
  Layers,
  Bot,
  CloudRain,
  AlertCircle,
  TrendingUp,
  Receipt,
  Play,
  Pause,
  Check,
  Sparkles,
  CreditCard,
  Clock,
  Quote,
  Lock,
  Bell,
  Home,
  LayoutGrid,
  User,
} from "lucide-react";
import {
  landingTranslations,
  SupportedLanguage,
  LandingContent,
} from "@/i18n/landingTranslations";

export default function LandingPage() {
  const [lang, setLang] = useState<SupportedLanguage>("en");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<"features" | "solutions" | "learnSupport" | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<"features" | "solutions" | "learnSupport" | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("agrifarm_lang") as SupportedLanguage;
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
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDropdown(null);
        setMobileNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleLanguage = () => {
    const newLang: SupportedLanguage = lang === "en" ? "hi" : "en";
    setLang(newLang);
    localStorage.setItem("agrifarm_lang", newLang);
  };

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    localStorage.setItem("agrifarm_theme", nextDark ? "dark" : "light");
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleVideoPlayback = () => {
    if (!videoPlayerRef.current) return;
    if (videoPlayerRef.current.paused) {
      videoPlayerRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoPlayerRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const content: LandingContent = landingTranslations[lang];

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#07130e] dark:text-slate-100 transition-colors duration-200 relative overflow-x-hidden font-sans">
      {/* ========================================================================= */}
      {/* 1. NAVBAR                                                                 */}
      {/* ========================================================================= */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-emerald-950/40 bg-white/95 dark:bg-[#07130e]/95 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left: Brand Logo & Subtitle */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-emerald-600/20 bg-white shadow-xs">
              <Image
                src="/picandvideo/logo.png"
                alt="AgriFarmAssistant Logo"
                fill
                sizes="44px"
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-emerald-950 dark:text-emerald-300">
                {content.nav.brandTitle}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700/90 dark:text-emerald-500 tracking-wider uppercase">
                {content.nav.brandSubtitle}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-700 dark:text-slate-300">
            {/* Features Dropdown */}
            <button
              type="button"
              onClick={() => setActiveDropdown((prev) => (prev === "features" ? null : "features"))}
              className={`inline-flex items-center gap-1.5 py-2 transition-colors ${
                activeDropdown === "features"
                  ? "text-emerald-700 dark:text-emerald-400 font-bold"
                  : "hover:text-emerald-700 dark:hover:text-emerald-400"
              }`}
              aria-expanded={activeDropdown === "features"}
            >
              <span>{content.nav.navFeatures}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === "features" ? "rotate-180 text-emerald-600" : "text-slate-400"
                }`}
              />
            </button>

            {/* Solutions Dropdown */}
            <button
              type="button"
              onClick={() => setActiveDropdown((prev) => (prev === "solutions" ? null : "solutions"))}
              className={`inline-flex items-center gap-1.5 py-2 transition-colors ${
                activeDropdown === "solutions"
                  ? "text-emerald-700 dark:text-emerald-400 font-bold"
                  : "hover:text-emerald-700 dark:hover:text-emerald-400"
              }`}
              aria-expanded={activeDropdown === "solutions"}
            >
              <span>{content.nav.navSolutions}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === "solutions" ? "rotate-180 text-emerald-600" : "text-slate-400"
                }`}
              />
            </button>

            {/* Learn & Support Dropdown */}
            <button
              type="button"
              onClick={() => setActiveDropdown((prev) => (prev === "learnSupport" ? null : "learnSupport"))}
              className={`inline-flex items-center gap-1.5 py-2 transition-colors ${
                activeDropdown === "learnSupport"
                  ? "text-emerald-700 dark:text-emerald-400 font-bold"
                  : "hover:text-emerald-700 dark:hover:text-emerald-400"
              }`}
              aria-expanded={activeDropdown === "learnSupport"}
            >
              <span>{content.nav.navLearnSupport}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === "learnSupport" ? "rotate-180 text-emerald-600" : "text-slate-400"
                }`}
              />
            </button>
          </nav>

          {/* Right Controls: Language, Theme, Login, Dashboard */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-300 dark:border-emerald-800 bg-slate-50 dark:bg-emerald-950/40 text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 transition-all shadow-2xs"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === "en" ? "हिन्दी" : "English"}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              type="button"
              aria-label="Toggle theme"
              className="p-2 rounded-full border border-slate-300 dark:border-emerald-800 bg-slate-50 dark:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition-all shadow-2xs"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-800" />}
            </button>

            {/* Login Button */}
            <Link
              href="/login?tab=login"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border border-slate-300 dark:border-emerald-800 bg-white dark:bg-emerald-950/40 text-slate-800 dark:text-slate-100 hover:border-emerald-500 hover:text-[#0F5132] dark:hover:text-emerald-300 transition-all shadow-2xs active:scale-[0.98]"
            >
              <span>{content.nav.signIn}</span>
            </Link>

            {/* Register Button */}
            <Link
              href="/login?tab=register"
              className="inline-flex items-center justify-center px-5 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#0F5132] hover:bg-[#15803d] text-white shadow-xs transition-all active:scale-[0.98]"
            >
              <span>{content.nav.register}</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 rounded-lg border border-slate-300 dark:border-emerald-800 bg-white dark:bg-emerald-950/40 text-slate-700 dark:text-slate-200 shadow-xs"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* DESKTOP MEGA-MENUS */}
        {activeDropdown && (
          <div className="hidden lg:block absolute top-full left-0 right-0 w-full bg-white dark:bg-[#07130e] border-b border-slate-200 dark:border-emerald-900/40 shadow-xl z-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
              {activeDropdown === "features" && (
                <div className="grid grid-cols-2 gap-10">
                  <div>
                    <div className="border-b border-slate-200 dark:border-emerald-900/50 pb-2 mb-4">
                      <span className="text-xs font-bold tracking-wider uppercase text-emerald-800 dark:text-emerald-400">
                        {content.megaMenu.features.farmManagementTitle}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {content.megaMenu.features.farmManagementItems.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href || "#"}
                          onClick={() => setActiveDropdown(null)}
                          className="block p-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all group"
                        >
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 flex items-center justify-between">
                            <span>{item.title}</span>
                            <ArrowRight className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {item.desc}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="border-b border-slate-200 dark:border-emerald-900/50 pb-2 mb-4">
                      <span className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                        {content.megaMenu.features.intelligentSystemsTitle}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-2">
                      {content.megaMenu.features.intelligentSystemsItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg border border-slate-100 dark:border-emerald-950/40 bg-slate-50/50 dark:bg-emerald-950/20"
                        >
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            {item.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeDropdown === "solutions" && (
                <div className="grid grid-cols-2 gap-10">
                  <div>
                    <div className="border-b border-slate-200 dark:border-emerald-900/50 pb-2 mb-4">
                      <span className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                        {content.megaMenu.solutions.organizationsTitle}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {content.megaMenu.solutions.organizationsItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg border border-slate-100 dark:border-emerald-950/40 bg-slate-50/50 dark:bg-emerald-950/20 text-xs font-semibold text-slate-800 dark:text-slate-200"
                        >
                          {item.title}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="border-b border-slate-200 dark:border-emerald-900/50 pb-2 mb-4">
                      <span className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                        {content.megaMenu.solutions.farmTypesTitle}
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {content.megaMenu.solutions.farmTypesItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-950/30 text-xs font-bold text-slate-900 dark:text-slate-100"
                        >
                          {item.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeDropdown === "learnSupport" && (
                <div className="grid grid-cols-2 gap-10">
                  <div>
                    <div className="border-b border-slate-200 dark:border-emerald-900/50 pb-2 mb-4">
                      <span className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                        {content.megaMenu.learnSupport.knowledgeTitle}
                      </span>
                    </div>
                    <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-2">
                      {content.megaMenu.learnSupport.knowledgeItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg border border-slate-100 dark:border-emerald-950/40 bg-slate-50/50 dark:bg-emerald-950/20"
                        >
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            {item.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="border-b border-slate-200 dark:border-emerald-900/50 pb-2 mb-4">
                      <span className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                        {content.megaMenu.learnSupport.supportTitle}
                      </span>
                    </div>
                    <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-2">
                      {content.megaMenu.learnSupport.supportItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg border border-slate-100 dark:border-emerald-950/40 bg-slate-50/50 dark:bg-emerald-950/20"
                        >
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            {item.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MOBILE DRAWER */}
        {mobileNavOpen && (
          <div className="lg:hidden border-b border-slate-200 dark:border-emerald-900/50 bg-white dark:bg-[#07130e] px-4 pt-3 pb-6 space-y-3 max-h-[80vh] overflow-y-auto">
            <div>
              <button
                type="button"
                onClick={() => setMobileExpandedSection((prev) => (prev === "features" ? null : "features"))}
                className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-emerald-950"
              >
                <span>{content.nav.navFeatures}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedSection === "features" ? "rotate-180" : ""}`} />
              </button>
              {mobileExpandedSection === "features" && (
                <div className="py-2 pl-3 space-y-2">
                  <Link
                    href="/fisheries"
                    onClick={() => setMobileNavOpen(false)}
                    className="block text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                  >
                    Fisheries & Pond Batches →
                  </Link>
                  <Link
                    href="/poultry"
                    onClick={() => setMobileNavOpen(false)}
                    className="block text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                  >
                    Poultry Batches →
                  </Link>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setMobileExpandedSection((prev) => (prev === "solutions" ? null : "solutions"))}
                className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-emerald-950"
              >
                <span>{content.nav.navSolutions}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedSection === "solutions" ? "rotate-180" : ""}`} />
              </button>
              {mobileExpandedSection === "solutions" && (
                <div className="py-2 pl-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div>Fisheries</div>
                  <div>Chicken and Poultry</div>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setMobileExpandedSection((prev) => (prev === "learnSupport" ? null : "learnSupport"))}
                className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-emerald-950"
              >
                <span>{content.nav.navLearnSupport}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedSection === "learnSupport" ? "rotate-180" : ""}`} />
              </button>
              {mobileExpandedSection === "learnSupport" && (
                <div className="py-2 pl-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div>Farming Guides</div>
                  <div>ICAR Scientific Protocols</div>
                  <div>Help Center</div>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login?tab=login"
                onClick={() => setMobileNavOpen(false)}
                className="w-full py-2.5 text-center text-sm font-bold rounded-full border border-slate-300 dark:border-emerald-800 text-slate-800 dark:text-slate-200"
              >
                {content.nav.signIn}
              </Link>
              <Link
                href="/login?tab=register"
                onClick={() => setMobileNavOpen(false)}
                className="w-full py-2.5 text-center text-sm font-bold rounded-full bg-[#0F5132] text-white"
              >
                {content.nav.register}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (Using home2.jpg / fishery.mp4 with left content)         */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[88vh] flex items-center overflow-hidden bg-[#032319]">
        {/* Real High-Resolution Fisheries Net Cage Image & Video */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/home2.jpg"
            alt="Real fisheries net cage farm aerial view"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Background Video playback for motion */}
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/home2.jpg"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/fishery.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Readability Overlay: Dark green gradient on left, preserving clear view of the farm */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#032319]/92 via-[#032d1e]/80 to-[#032319]/30 pointer-events-none" />

        {/* Hero Content on Left */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
          <div className="max-w-2xl">
            {/* Small Label Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 mb-6 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {content.hero.badge}
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] mb-5">
              <span>{content.hero.headingLine1}</span>
              <br />
              <span className="text-[#22c55e]">{content.hero.headingLine2}</span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-200 text-base sm:text-lg max-w-xl font-normal leading-relaxed mb-8">
              {content.hero.subtext}
            </p>

            {/* Get Started Button (Pill button with arrow) */}
            <div className="mb-8">
              <Link
                href="/login"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-base font-bold bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-xl shadow-emerald-950/40 transition-all active:scale-[0.98]"
              >
                <span>{content.hero.btnGetStarted}</span>
              </Link>
            </div>

            {/* Tagline */}
            <div className="text-xs sm:text-sm font-bold tracking-widest text-emerald-300/80 uppercase">
              {content.hero.tagline}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SOCIAL PROOF & CORE PLATFORM FEATURES                                 */}
      {/* ========================================================================= */}
      {/* 3A: White Statistics Bar */}
      <section className="bg-white dark:bg-[#07130e] py-12 lg:py-14 border-b border-slate-200/80 dark:border-emerald-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {content.socialProof.stat1Value}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                  {content.socialProof.stat1Label}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-emerald-950/60 md:pl-8">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {content.socialProof.stat2Value}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                  {content.socialProof.stat2Label}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-emerald-950/60 md:pl-8">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {content.socialProof.stat3Value}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                  {content.socialProof.stat3Label}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE PLATFORM FEATURES (Built to support modern farming) */}
      <section id="features" className="py-20 lg:py-24 bg-slate-50/60 dark:bg-[#05100c] border-b border-slate-200/80 dark:border-emerald-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-2">
                {content.coreFeatures.heading}
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400">
                {content.coreFeatures.subheading}
              </p>
            </div>
            <Link
              href="/fisheries"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 shrink-0"
            >
              <span>{content.coreFeatures.seeAll}</span>
            </Link>
          </div>

          {/* 3-Column Grid of 6 Subtle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.coreFeatures.items.map((feature, idx) => {
              const icons = [
                <Layers key="0" className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />,
                <Bot key="1" className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />,
                <CloudRain key="2" className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />,
                <AlertCircle key="3" className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />,
                <TrendingUp key="4" className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />,
                <Receipt key="5" className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />,
              ];

              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#07130e] p-6 rounded-2xl border border-slate-200/80 dark:border-emerald-900/40 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all"
                >
                  <div className="mb-4">
                    {icons[idx]}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FISHERIES MANAGEMENT SECTION                                           */}
      {/* ========================================================================= */}
      <section id="fisheries" className="py-20 lg:py-24 bg-white dark:bg-[#07130e] border-b border-slate-200/80 dark:border-emerald-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text & Benefits */}
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 mb-4">
                {content.fisheries.badge}
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-4">
                {content.fisheries.heading}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {content.fisheries.description}
              </p>

              {/* 4 Bullet Points */}
              <div className="space-y-3 mb-8">
                {content.fisheries.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Explore Link */}
              <Link
                href="/fisheries"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 group"
              >
                <span>{content.fisheries.linkText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right: Farmer Feeding Pond Photo with Overlaid Growth Trend Card */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-emerald-900/50 shadow-xl aspect-[4/3] bg-slate-100">
                <Image
                  src="/fisheries_farm.jpg"
                  alt="Real fish pond farmer feeding with bucket"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Overlaid Realistic Growth Trend Card Matching Design Board */}
              <div className="absolute -bottom-8 -right-2 sm:right-4 max-w-sm sm:max-w-md w-full bg-white dark:bg-[#07130e] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-emerald-800/60 shadow-2xl">
                {/* Header & Legend */}
                <div className="flex items-center justify-between pb-2 mb-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    {content.fisheries.cardGrowth}
                  </span>
                  <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      {content.fisheries.cardGrowthLegend1}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-xs bg-emerald-700" />
                      {content.fisheries.cardGrowthLegend2}
                    </span>
                  </div>
                </div>

                {/* Bar + Line Chart */}
                <div className="pt-2 pb-3">
                  <svg className="w-full h-24 overflow-visible" viewBox="0 0 320 100">
                    {/* Horizontal grid lines */}
                    <line x1="0" y1="20" x2="320" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="0" y1="50" x2="320" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="320" y2="80" stroke="#cbd5e1" strokeWidth="1" />

                    {/* Bars (Total Biomass kg) */}
                    <rect x="25" y="65" width="16" height="15" fill="#047857" rx="2" />
                    <rect x="85" y="58" width="16" height="22" fill="#047857" rx="2" />
                    <rect x="145" y="45" width="16" height="35" fill="#047857" rx="2" />
                    <rect x="205" y="32" width="16" height="48" fill="#047857" rx="2" />
                    <rect x="265" y="15" width="16" height="65" fill="#047857" rx="2" />

                    {/* Line (Average Weight g) */}
                    <path
                      d="M 33 60 L 93 50 L 153 38 L 213 28 L 273 20"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                    <circle cx="33" cy="60" r="3" fill="#10b981" />
                    <circle cx="93" cy="50" r="3" fill="#10b981" />
                    <circle cx="153" cy="38" r="3" fill="#10b981" />
                    <circle cx="213" cy="28" r="3" fill="#10b981" />
                    <circle cx="273" cy="20" r="3" fill="#10b981" />

                    {/* Week Labels */}
                    <text x="33" y="94" fontSize="9" textAnchor="middle" fill="#64748b">Week 1</text>
                    <text x="93" y="94" fontSize="9" textAnchor="middle" fill="#64748b">Week 2</text>
                    <text x="153" y="94" fontSize="9" textAnchor="middle" fill="#64748b">Week 3</text>
                    <text x="213" y="94" fontSize="9" textAnchor="middle" fill="#64748b">Week 4</text>
                    <text x="273" y="94" fontSize="9" textAnchor="middle" fill="#64748b">Week 5</text>
                  </svg>
                </div>

                {/* 3 Metric Pills */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100 dark:border-emerald-950">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-emerald-950/40">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {content.fisheries.cardTotalFish}
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {content.fisheries.cardTotalFishVal}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-emerald-950/40">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {content.fisheries.cardAvgWeight}
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {content.fisheries.cardAvgWeightVal}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-emerald-950/40">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {content.fisheries.cardTotalFeed}
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {content.fisheries.cardTotalFeedVal}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. POULTRY MANAGEMENT SECTION                                             */}
      {/* ========================================================================= */}
      <section id="poultry" className="py-20 lg:py-24 bg-slate-50/60 dark:bg-[#05100c] border-b border-slate-200/80 dark:border-emerald-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text & Benefits */}
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 mb-4">
                {content.poultry.badge}
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-4">
                {content.poultry.heading}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {content.poultry.description}
              </p>

              {/* 4 Bullet Points */}
              <div className="space-y-3 mb-8">
                {content.poultry.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Explore Link */}
              <Link
                href="/poultry"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 group"
              >
                <span>{content.poultry.linkText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right: High-Res Broiler Poultry Image (home3.jpg) with Overlaid Poultry Performance Card */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-emerald-900/50 shadow-xl aspect-[4/3] bg-slate-100">
                <Image
                  src="/home3.jpg"
                  alt="Real poultry broiler farm with white chickens and red feeders"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>

              {/* Overlaid Realistic Poultry Performance Card Matching Design Board */}
              <div className="absolute -bottom-8 -left-2 sm:left-4 max-w-sm sm:max-w-md w-full bg-white dark:bg-[#07130e] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-emerald-800/60 shadow-2xl">
                {/* Header & Filter Dropdown */}
                <div className="flex items-center justify-between pb-2 mb-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    {content.poultry.cardTitle}
                  </span>
                  <div className="px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-emerald-900 text-[10px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <span>{content.poultry.cardStatus}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </div>

                {/* 3 Metric Boxes */}
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-emerald-950/40">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {content.poultry.cardLiveBirds}
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {content.poultry.cardLiveBirdsVal}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-emerald-950/40">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {content.poultry.cardAvgWeight}
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {content.poultry.cardAvgWeightVal}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-emerald-950/40">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {content.poultry.cardMortality}
                    </div>
                    <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                      {content.poultry.cardMortalityVal}
                    </div>
                  </div>
                </div>

                {/* Chart Legend */}
                <div className="flex items-center justify-center gap-4 text-[10px] font-semibold text-slate-500 pb-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    {content.poultry.legendWeight}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    {content.poultry.legendMortality}
                  </span>
                </div>

                {/* Curved SVG Line Chart with Gradient Fill */}
                <div className="pt-1">
                  <svg className="w-full h-20 overflow-visible" viewBox="0 0 280 60">
                    <defs>
                      <linearGradient id="poultryGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Area under curve */}
                    <path
                      d="M 15 50 Q 80 44, 140 28 T 265 10 L 265 55 L 15 55 Z"
                      fill="url(#poultryGrowthGrad)"
                    />

                    {/* Growth line */}
                    <path
                      d="M 15 50 Q 80 44, 140 28 T 265 10"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                    />

                    {/* Dots */}
                    <circle cx="15" cy="50" r="3" fill="#10b981" />
                    <circle cx="98" cy="40" r="3" fill="#10b981" />
                    <circle cx="180" cy="22" r="3" fill="#10b981" />
                    <circle cx="265" cy="10" r="3.5" fill="#047857" />

                    {/* Week labels */}
                    <text x="15" y="60" fontSize="8" fill="#94a3b8">Week 1</text>
                    <text x="98" y="60" fontSize="8" textAnchor="middle" fill="#94a3b8">Week 2</text>
                    <text x="180" y="60" fontSize="8" textAnchor="middle" fill="#94a3b8">Week 3</text>
                    <text x="265" y="60" fontSize="8" textAnchor="end" fill="#94a3b8">Week 4</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FARM MANAGEMENT ANYWHERE + VIDEO + TESTIMONIALS                        */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-24 bg-white dark:bg-[#07130e] border-b border-slate-200/80 dark:border-emerald-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left: Pixel-Perfect Realistic Smartphone Mockup (4 Cols) */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-[240px] sm:w-[260px] rounded-[44px] border-[7px] border-slate-900 dark:border-slate-700 bg-slate-900 p-2.5 shadow-2xl relative">
                {/* Screen Container */}
                <div className="rounded-[34px] overflow-hidden bg-white dark:bg-[#07130e] flex flex-col justify-between h-[450px] border border-slate-200 dark:border-emerald-950">
                  {/* Top Bar: Speaker & Status */}
                  <div className="pt-2 px-4 pb-1 bg-[#0F5132] text-white">
                    <div className="w-18 h-3.5 bg-slate-900 rounded-full mx-auto mb-2" />
                    <div className="flex items-center justify-between text-[11px] font-bold pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">‹</span>
                        <span className="tracking-tight text-white font-extrabold text-[12px]">AgriFarmAssistant</span>
                      </div>
                      <div className="w-4 h-4 rounded-full bg-emerald-800 flex items-center justify-center">
                        <Bell className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* 6 App Module Tiles (2x3 Grid matching design board) */}
                  <div className="p-3 grid grid-cols-2 gap-2.5 flex-1 content-center bg-slate-50/50 dark:bg-emerald-950/20">
                    {/* Tile 1: Fisheries */}
                    <Link
                      href="/fisheries"
                      className="p-2.5 rounded-2xl bg-white dark:bg-[#07130e] border border-slate-200/70 dark:border-emerald-900/50 flex flex-col items-center justify-center text-center shadow-2xs hover:border-emerald-500 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 mb-1.5">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/>
                          <path d="M18 12c-.5 1.5-1.79 3-4 3s-3.5-1.5-4-3 1.79-3 4-3 3.5 1.5 4 3Z"/>
                        </svg>
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Fisheries</span>
                    </Link>

                    {/* Tile 2: Poultry */}
                    <Link
                      href="/poultry"
                      className="p-2.5 rounded-2xl bg-white dark:bg-[#07130e] border border-slate-200/70 dark:border-emerald-900/50 flex flex-col items-center justify-center text-center shadow-2xs hover:border-emerald-500 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 mb-1.5">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"/>
                          <circle cx="18" cy="8" r="3"/>
                          <path d="M18 11v6"/>
                        </svg>
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Poultry</span>
                    </Link>

                    {/* Tile 3: Weather */}
                    <div className="p-2.5 rounded-2xl bg-white dark:bg-[#07130e] border border-slate-200/70 dark:border-emerald-900/50 flex flex-col items-center justify-center text-center shadow-2xs">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 mb-1.5">
                        <CloudRain className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Weather</span>
                    </div>

                    {/* Tile 4: AI Assistant */}
                    <Link
                      href="/ai-assistant"
                      className="p-2.5 rounded-2xl bg-white dark:bg-[#07130e] border border-slate-200/70 dark:border-emerald-900/50 flex flex-col items-center justify-center text-center shadow-2xs hover:border-emerald-500 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 mb-1.5">
                        <Bot className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">AI Assistant</span>
                    </Link>

                    {/* Tile 5: Expense */}
                    <div className="p-2.5 rounded-2xl bg-white dark:bg-[#07130e] border border-slate-200/70 dark:border-emerald-900/50 flex flex-col items-center justify-center text-center shadow-2xs">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 mb-1.5">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Expense</span>
                    </div>

                    {/* Tile 6: Tasks */}
                    <div className="p-2.5 rounded-2xl bg-white dark:bg-[#07130e] border border-slate-200/70 dark:border-emerald-900/50 flex flex-col items-center justify-center text-center shadow-2xs">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 mb-1.5">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Tasks</span>
                    </div>
                  </div>

                  {/* Bottom Navigation Bar inside phone */}
                  <div className="py-2 px-6 border-t border-slate-100 dark:border-emerald-950 bg-white dark:bg-[#07130e] flex items-center justify-between text-[9px] font-bold">
                    <div className="flex flex-col items-center text-emerald-600">
                      <Home className="w-3.5 h-3.5 mb-0.5" />
                      <span>Home</span>
                    </div>
                    <div className="flex flex-col items-center text-slate-400">
                      <LayoutGrid className="w-3.5 h-3.5 mb-0.5" />
                      <span>Farm</span>
                    </div>
                    <div className="flex flex-col items-center text-slate-400">
                      <User className="w-3.5 h-3.5 mb-0.5" />
                      <span>Profile</span>
                    </div>
                  </div>

                  {/* Home Bar indicator */}
                  <div className="pb-1.5 bg-white dark:bg-[#07130e]">
                    <div className="w-20 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle: Video Player & Benefits (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-1.5">
                  {content.anywhere.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {content.anywhere.description}
                </p>
              </div>

              {/* 3 Clean Pill Badges */}
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-900/50 text-[11px] font-semibold text-emerald-900 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>{content.anywhere.benefit1}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-900/50 text-[11px] font-semibold text-emerald-900 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>{content.anywhere.benefit2}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-900/50 text-[11px] font-semibold text-emerald-900 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>{content.anywhere.benefit3}</span>
                </div>
              </div>

              {/* High-Definition Real Video Player */}
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-emerald-900/50 aspect-video bg-black group">
                <video
                  ref={videoPlayerRef}
                  controls={isVideoPlaying}
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                >
                  <source src="/fishery.mp4" type="video/mp4" />
                </video>

                {/* Big Center Play Button Overlay */}
                {!isVideoPlaying && (
                  <button
                    onClick={toggleVideoPlayback}
                    type="button"
                    aria-label="Play video"
                    className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/15 transition-colors cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-full bg-white text-slate-900 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-slate-900 ml-1 text-slate-900" />
                    </div>
                    {/* Clean Duration Badge */}
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold">
                      0:50
                    </div>
                  </button>
                )}
              </div>

              {/* Clean Caption with Icon */}
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 shrink-0" />
                <span>{content.anywhere.videoCaption}</span>
              </div>
            </div>

            {/* Right: What Farmers Say (Testimonials) (4 Cols) */}
            <div className="lg:col-span-4 space-y-3.5">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {content.testimonials.heading}
              </h3>

              <div className="space-y-3.5">
                {content.testimonials.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-[#07130e] border border-slate-200/90 dark:border-emerald-900/40 shadow-xs hover:border-emerald-500/40 transition-all"
                  >
                    <Quote className="w-4 h-4 text-emerald-600/40 mb-2" />
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic mb-3 font-normal">
                      {item.quote}
                    </p>
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-emerald-950">
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-950 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-800 dark:text-emerald-200 text-xs shadow-2xs">
                          <span>{item.name.charAt(0)}</span>
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-600 rounded-full border border-white" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                            <span>{item.name}</span>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {item.role}
                          </div>
                        </div>
                      </div>
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider Dots */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FINAL CTA (Start Your Smart Farming Journey)                           */}
      {/* ========================================================================= */}
      <section id="pricing" className="relative w-full py-24 lg:py-28 overflow-hidden bg-[#032319]">
        {/* Real Circular Sea Cages Image (home1.jpg) */}
        <div className="absolute inset-0">
          <Image
            src="/home1.jpg"
            alt="Scenic circular sea fish cages with mountain fjord landscape"
            fill
            sizes="100vw"
            className="object-cover"
          />
          {/* Subtle Dark Green Overlay */}
          <div className="absolute inset-0 bg-[#032319]/85 backdrop-blur-2xs" />
        </div>

        {/* Content Centered */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {content.finalCta.heading}
          </h2>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            {content.finalCta.description}
          </p>

          {/* Single Vibrant Green Pill Button */}
          <div className="mb-8">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full text-base font-bold bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-xl shadow-emerald-950/50 transition-all active:scale-[0.98]"
            >
              <span>{content.finalCta.btnGetStarted}</span>
            </Link>
          </div>

          {/* 3 Reassurance Badges in a Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-white/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{content.finalCta.badge1}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>{content.finalCta.badge2}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{content.finalCta.badge3}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-emerald-500/30 bg-white">
                  <Image
                    src="/picandvideo/logo.png"
                    alt="AgriFarmAssistant Logo"
                    fill
                    sizes="36px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white tracking-tight">
                    {content.footer.brandTitle}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 tracking-wider uppercase">
                    {content.footer.brandSubtitle}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Modern farm management platform built for forward-thinking fisheries and poultry producers.
              </p>
            </div>

            {/* Platform Links */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                {content.footer.colPlatform}
              </div>
              <ul className="space-y-2.5 text-xs text-slate-400">
                {content.footer.platformLinks.map((link, idx) => (
                  <li key={idx}>
                    {link.href ? (
                      <Link href={link.href} className="hover:text-emerald-400 transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <span className="text-slate-400">{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                {content.footer.colCompany}
              </div>
              <ul className="space-y-2.5 text-xs text-slate-400">
                {content.footer.companyLinks.map((link, idx) => (
                  <li key={idx}>
                    {link.href ? (
                      <Link href={link.href} className="hover:text-emerald-400 transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <span className="text-slate-400">{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                {content.footer.colResources}
              </div>
              <ul className="space-y-2.5 text-xs text-slate-400">
                {content.footer.resourceLinks.map((link, idx) => (
                  <li key={idx}>
                    {link.href ? (
                      <Link href={link.href} className="hover:text-emerald-400 transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <span className="text-slate-400">{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>{content.footer.copyright}</div>
            <div className="flex items-center gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
