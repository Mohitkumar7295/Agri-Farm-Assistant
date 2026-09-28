"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Waves,
  Feather,
  Cpu,
  Droplets,
  ArrowRight,
  Languages,
  Sun,
  Moon,
  Lock,
  X,
  Activity,
  CheckCircle2,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Thermometer,
  Wind,
  CloudRain,
  TrendingUp,
  DollarSign,
  Calendar,
  AlertCircle,
  Check,
  Layers,
  Smartphone,
  Sparkles,
  Clock,
  HelpCircle,
  BarChart3,
  Bot,
  Bell,
  Fish,
} from "lucide-react";
import {
  landingTranslations,
  SupportedLanguage,
  LandingContent,
} from "@/i18n/landingTranslations";

export default function LandingPage() {
  const [lang, setLang] = useState<SupportedLanguage>("en");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [gatedFeatureName, setGatedFeatureName] = useState<string>("");

  // Video play & mute states
  const [isAquaVideoPlaying, setIsAquaVideoPlaying] = useState<boolean>(true);
  const [isAquaVideoMuted, setIsAquaVideoMuted] = useState<boolean>(true);
  const aquaVideoRef = useRef<HTMLVideoElement | null>(null);

  const [isPoultryVideoPlaying, setIsPoultryVideoPlaying] = useState<boolean>(true);
  const [isPoultryVideoMuted, setIsPoultryVideoMuted] = useState<boolean>(true);
  const poultryVideoRef = useRef<HTMLVideoElement | null>(null);

  // Hero console states
  const [heroActiveTab, setHeroActiveTab] = useState<"fisheries" | "poultry">("fisheries");
  const [isHeroVideoPlaying, setIsHeroVideoPlaying] = useState<boolean>(true);
  const [isHeroVideoMuted, setIsHeroVideoMuted] = useState<boolean>(true);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  const toggleHeroVideoPlay = () => {
    if (!heroVideoRef.current) return;
    if (heroVideoRef.current.paused) {
      heroVideoRef.current.play();
      setIsHeroVideoPlaying(true);
    } else {
      heroVideoRef.current.pause();
      setIsHeroVideoPlaying(false);
    }
  };

  const toggleHeroVideoMute = () => {
    if (!heroVideoRef.current) return;
    heroVideoRef.current.muted = !heroVideoRef.current.muted;
    setIsHeroVideoMuted(heroVideoRef.current.muted);
  };

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

  const toggleLanguage = () => {
    const nextLang: SupportedLanguage = lang === "en" ? "hi" : "en";
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

  const handleProtectedAction = (featureLabel: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("agrifarm_jwt") : null;
    if (token) {
      window.location.href = "/dashboard";
    } else {
      setGatedFeatureName(featureLabel);
      setAuthModalOpen(true);
    }
  };

  const toggleAquaVideoPlay = () => {
    if (!aquaVideoRef.current) return;
    if (aquaVideoRef.current.paused) {
      aquaVideoRef.current.play();
      setIsAquaVideoPlaying(true);
    } else {
      aquaVideoRef.current.pause();
      setIsAquaVideoPlaying(false);
    }
  };

  const toggleAquaVideoMute = () => {
    if (!aquaVideoRef.current) return;
    aquaVideoRef.current.muted = !aquaVideoRef.current.muted;
    setIsAquaVideoMuted(aquaVideoRef.current.muted);
  };

  const togglePoultryVideoPlay = () => {
    if (!poultryVideoRef.current) return;
    if (poultryVideoRef.current.paused) {
      poultryVideoRef.current.play();
      setIsPoultryVideoPlaying(true);
    } else {
      poultryVideoRef.current.pause();
      setIsPoultryVideoPlaying(false);
    }
  };

  const togglePoultryVideoMute = () => {
    if (!poultryVideoRef.current) return;
    poultryVideoRef.current.muted = !poultryVideoRef.current.muted;
    setIsPoultryVideoMuted(poultryVideoRef.current.muted);
  };

  const content: LandingContent = landingTranslations[lang];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#07130e] dark:text-slate-100 transition-colors duration-300 relative overflow-x-hidden">
      {/* SUBTLE BACKGROUND ACCENTS */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[450px] w-[450px] rounded-full bg-emerald-600/10 blur-[120px] dark:bg-emerald-500/10" />
        <div className="absolute top-1/3 -right-32 h-[500px] w-[500px] rounded-full bg-emerald-700/10 blur-[130px] dark:bg-emerald-400/10" />
        <div className="absolute bottom-1/4 left-1/4 h-[450px] w-[450px] rounded-full bg-teal-600/10 blur-[120px] dark:bg-teal-500/10" />
      </div>

      {/* ========================================================================= */}
      {/* 1. STICKY NAVBAR (PRESERVED EXACTLY AS REQUIRED)                           */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full border-b border-emerald-950/10 dark:border-emerald-500/20 bg-white/80 dark:bg-[#07130e]/85 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-emerald-600/20 shadow-sm shadow-emerald-950/5 group-hover:border-emerald-600/50 transition-colors">
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
              <span className="text-xl font-bold tracking-tight text-emerald-900 dark:text-emerald-400">
                {content.nav.brandTitle}
              </span>
              <span className="text-xs font-medium text-emerald-700/80 dark:text-emerald-500/80 tracking-wide uppercase">
                {content.nav.brandSubtitle}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <a
              href="#fisheries"
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Waves className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {content.nav.navAquaculture}
            </a>
            <a
              href="#poultry"
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Feather className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {content.nav.navPoultry}
            </a>
            <a
              href="#ai-assistant"
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {content.nav.navAiCore}
            </a>
            <a
              href="#weather"
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Droplets className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {content.nav.navWeather}
            </a>
            <a
              href="#features"
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {content.nav.navProtocols}
            </a>
          </nav>

          {/* Controls: Language, Theme, & Action Gateway */}
          <div className="flex items-center gap-3">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              type="button"
              aria-label="Toggle language"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-950/40 text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all shadow-xs"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === "en" ? "हिन्दी" : "English"}</span>
            </button>

            {/* Dark / Light Mode Switch */}
            <button
              onClick={toggleTheme}
              type="button"
              aria-label="Toggle visual theme"
              className="p-2 rounded-lg border border-slate-300 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-300 transition-all shadow-xs"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-800" />}
            </button>

            {/* Sign In CTA */}
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white px-3 py-2 transition-colors"
            >
              {content.nav.signIn}
            </Link>

            {/* Dashboard / Launch Portal Button */}
            <button
              onClick={() => handleProtectedAction(content.nav.launchPortal)}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#0F5132] hover:bg-[#15803d] text-white shadow-md shadow-emerald-950/20 active:scale-[0.98] transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-200" />
              <span>{content.nav.launchPortal}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-600/25 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-5 tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{content.hero.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            <span>{content.hero.headingLine1}</span>
            <br />
            <span className="text-emerald-700 dark:text-emerald-400">
              {content.hero.headingLine2}
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
            {content.hero.subtext}
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleProtectedAction(content.hero.btnGetStarted)}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-[#0F5132] hover:bg-[#15803d] text-white shadow-sm active:scale-[0.98] transition-all"
            >
              <span>{content.hero.btnGetStarted}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#intro"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-slate-300 dark:border-emerald-800/80 bg-white dark:bg-[#0c241a] text-slate-800 dark:text-slate-200 hover:border-emerald-600 transition-all"
            >
              <span>{content.hero.btnExplore}</span>
            </a>
          </div>

          <p className="mt-4 text-xs font-semibold tracking-wider uppercase text-emerald-800/80 dark:text-emerald-400/80">
            {content.hero.tagline}
          </p>
        </div>

        {/* Hero Visual Operations Console */}
        <div className="mt-10 max-w-5xl mx-auto rounded-3xl overflow-hidden border border-slate-300 dark:border-emerald-800/60 shadow-2xl bg-slate-950 relative">
          {/* Top Console Bar */}
          <div className="px-4 py-3 bg-slate-900/95 dark:bg-[#071911]/95 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
            {/* Left: Status & Domain Switcher */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-bold text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{content.hero.showcase.liveStatus}</span>
              </div>

              {/* Domain Tabs */}
              <div className="flex items-center p-1 rounded-xl bg-slate-800/70 border border-white/10 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setHeroActiveTab("fisheries")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                    heroActiveTab === "fisheries"
                      ? "bg-teal-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Waves className="w-3.5 h-3.5" />
                  <span>{content.hero.showcase.tabFisheries}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHeroActiveTab("poultry")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                    heroActiveTab === "poultry"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Feather className="w-3.5 h-3.5" />
                  <span>{content.hero.showcase.tabPoultry}</span>
                </button>
              </div>
            </div>

            {/* Right: Telemetry & Player Controls */}
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                {heroActiveTab === "fisheries" ? (
                  <>
                    <span className="text-teal-400 font-bold">{content.hero.showcase.waterMetric}</span>
                    <span>•</span>
                    <span>{content.hero.showcase.biomassMetric}</span>
                  </>
                ) : (
                  <>
                    <span className="text-amber-400 font-bold">{content.hero.showcase.birdsMetric}</span>
                    <span>•</span>
                    <span>{content.hero.showcase.tempMetric}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleHeroVideoPlay}
                  aria-label="Play/Pause hero showcase"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  {isHeroVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={toggleHeroVideoMute}
                  aria-label="Mute/Unmute hero showcase"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  {isHeroVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Main Visual Display with Active Video */}
          <div className="relative w-full h-[360px] sm:h-[460px] bg-slate-900 overflow-hidden">
            <video
              ref={heroVideoRef}
              key={heroActiveTab}
              src={heroActiveTab === "fisheries" ? "/AquaCultureVideo.mp4" : "/PolutryFarmVideo.mp4"}
              poster={heroActiveTab === "fisheries" ? "/AquaculturePic.png" : "/PolutryFarmPic.png"}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/35 pointer-events-none" />

            {/* Floating HUD Pill: Top Left */}
            <div className="absolute top-4 left-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white shadow-lg">
              {heroActiveTab === "fisheries" ? (
                <>
                  <Waves className="w-4 h-4 text-teal-400" />
                  <span className="font-semibold">Water Quality:</span>
                  <span className="font-bold text-teal-300">Optimal (DO 6.4 mg/L • pH 7.6 • 28.5°C)</span>
                </>
              ) : (
                <>
                  <Feather className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold">Shed Climate:</span>
                  <span className="font-bold text-amber-300">Optimal (28.5°C • RH 72% • THI Normal)</span>
                </>
              )}
            </div>

            {/* Floating HUD Pill: Top Right */}
            <div className="absolute top-4 right-4 z-10 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/75 backdrop-blur-md border border-emerald-500/30 text-xs text-emerald-200 shadow-lg">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>
                {heroActiveTab === "fisheries"
                  ? content.hero.showcase.aiTipFish
                  : content.hero.showcase.aiTipPoultry}
              </span>
            </div>

            {/* Bottom HUD Bar */}
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 z-10">
              <div className="text-white text-left">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-600/80 text-white">
                  {heroActiveTab === "fisheries" ? "AQUACULTURE POND 01" : "POULTRY FLOCK SHED A"}
                </span>
                <h3 className="text-lg sm:text-2xl font-bold text-white mt-1">
                  {heroActiveTab === "fisheries"
                    ? content.hero.showcase.fisheriesTitle
                    : content.hero.showcase.poultryTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  {heroActiveTab === "fisheries"
                    ? content.hero.showcase.fisheriesSub
                    : content.hero.showcase.poultrySub}
                </p>

                {/* 3 Quick Metrics Badges */}
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {heroActiveTab === "fisheries" ? (
                    <>
                      <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-xs border border-white/10 font-medium">
                        Biomass: <strong className="text-teal-300">{content.hero.showcase.biomassMetric}</strong>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-xs border border-white/10 font-medium">
                        Water: <strong className="text-emerald-300">{content.hero.showcase.waterMetric}</strong>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-xs border border-white/10 font-medium">
                        Feed: <strong className="text-slate-200">{content.hero.showcase.feedMetric}</strong>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-xs border border-white/10 font-medium">
                        Flock: <strong className="text-amber-300">{content.hero.showcase.birdsMetric}</strong>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-xs border border-white/10 font-medium">
                        Temp: <strong className="text-emerald-300">{content.hero.showcase.tempMetric}</strong>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-xs border border-white/10 font-medium">
                        Mortality: <strong className="text-slate-200">{content.hero.showcase.mortalityMetric}</strong>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() =>
                  handleProtectedAction(
                    heroActiveTab === "fisheries"
                      ? "Pond 01 Fisheries Console"
                      : "Shed A Poultry Console"
                  )
                }
                type="button"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#0F5132] font-bold text-xs shadow-md transition-all shrink-0 active:scale-[0.98]"
              >
                {content.hero.showcase.viewDashboardBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. INTRODUCTION SECTION                                                   */}
      {/* ========================================================================= */}
      <section id="intro" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {content.intro.heading}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            {content.intro.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* CARD 1: Fisheries */}
          <div className="rounded-2xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 overflow-hidden shadow-sm flex flex-col justify-between hover:border-emerald-600/40 transition-all">
            <div className="relative w-full h-52 bg-slate-100 dark:bg-slate-800">
              <Image
                src="/AquaculturePic.png"
                alt="Fisheries"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                <Waves className="w-5 h-5 text-teal-300" />
                <h3 className="text-xl font-bold">{content.intro.card1Title}</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {content.intro.card1Desc}
              </p>
              <button
                onClick={() => handleProtectedAction(content.intro.card1Title)}
                type="button"
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300"
              >
                <span>{content.intro.card1Btn}</span>
              </button>
            </div>
          </div>

          {/* CARD 2: Poultry */}
          <div className="rounded-2xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 overflow-hidden shadow-sm flex flex-col justify-between hover:border-emerald-600/40 transition-all">
            <div className="relative w-full h-52 bg-slate-100 dark:bg-slate-800">
              <Image
                src="/PolutryFarmPic.png"
                alt="Poultry"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                <Feather className="w-5 h-5 text-amber-300" />
                <h3 className="text-xl font-bold">{content.intro.card2Title}</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {content.intro.card2Desc}
              </p>
              <button
                onClick={() => handleProtectedAction(content.intro.card2Title)}
                type="button"
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300"
              >
                <span>{content.intro.card2Btn}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FISHERIES SECTION                                                      */}
      {/* ========================================================================= */}
      <section id="fisheries" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT: Image */}
          <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-emerald-800/40 shadow-md relative h-80 sm:h-96">
            <Image
              src="/AquaculturePic.png"
              alt="Fisheries Management"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* RIGHT: Feature list */}
          <div className="lg:col-span-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {content.fisheries.heading}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {content.fisheries.description}
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-emerald-800/30 bg-white dark:bg-[#0c241a]/40">
                <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                  {content.fisheries.f1Title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {content.fisheries.f1Desc}
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-emerald-800/30 bg-white dark:bg-[#0c241a]/40">
                <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                  {content.fisheries.f2Title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {content.fisheries.f2Desc}
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-emerald-800/30 bg-white dark:bg-[#0c241a]/40">
                <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                  {content.fisheries.f3Title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {content.fisheries.f3Desc}
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-emerald-800/30 bg-white dark:bg-[#0c241a]/40">
                <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                  {content.fisheries.f4Title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {content.fisheries.f4Desc}
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-emerald-800/30 bg-white dark:bg-[#0c241a]/40">
                <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                  {content.fisheries.f5Title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {content.fisheries.f5Desc}
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-emerald-800/30 bg-white dark:bg-[#0c241a]/40">
                <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                  {content.fisheries.f6Title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {content.fisheries.f6Desc}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => handleProtectedAction(content.fisheries.btn)}
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0F5132] hover:bg-[#15803d] text-white transition-all shadow-xs"
              >
                <span>{content.fisheries.btn}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FISHERIES VIDEO SECTION                                                */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-emerald-800/40 shadow-lg bg-black">
          <video
            ref={aquaVideoRef}
            src="/AquaCultureVideo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-72 sm:h-96 lg:h-[420px] object-cover"
          />
          {/* Subtle dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent flex items-center p-6 sm:p-10">
            <div className="max-w-md text-white">
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                {content.fisheriesVideo.headingLine1}
                <br />
                <span className="text-teal-300">{content.fisheriesVideo.headingLine2}</span>
              </h3>
              <p className="mt-2 text-sm text-slate-200">
                {content.fisheriesVideo.subtext}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => handleProtectedAction(content.fisheriesVideo.btn)}
                  type="button"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
                >
                  {content.fisheriesVideo.btn}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleAquaVideoPlay}
                    type="button"
                    aria-label="Play/Pause fisheries video"
                    className="p-2 rounded bg-white/20 hover:bg-white/30 text-white"
                  >
                    {isAquaVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={toggleAquaVideoMute}
                    type="button"
                    aria-label="Mute/Unmute fisheries video"
                    className="p-2 rounded bg-white/20 hover:bg-white/30 text-white"
                  >
                    {isAquaVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FISH SPECIES SECTION                                                   */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {content.species.heading}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {content.species.description}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
          {content.species.items.map((sp, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 text-center shadow-2xs hover:border-emerald-500/50 transition-colors"
            >
              <Fish className="w-4 h-4 mx-auto mb-1.5 text-teal-600 dark:text-teal-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {sp}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FISH FARM DASHBOARD SECTION                                            */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded bg-slate-200 dark:bg-emerald-950/60 text-[11px] font-semibold text-slate-700 dark:text-emerald-300 mb-2">
              {content.fishDashboard.badgeDemo}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {content.fishDashboard.heading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              {content.fishDashboard.description}
            </p>
          </div>
          <button
            onClick={() => handleProtectedAction(content.fishDashboard.btn)}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950"
          >
            <span>{content.fishDashboard.btn}</span>
          </button>
        </div>

        {/* 6 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {content.fishDashboard.m1Label}
            </span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {content.fishDashboard.m1Value}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {content.fishDashboard.m2Label}
            </span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {content.fishDashboard.m2Value}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {content.fishDashboard.m3Label}
            </span>
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-1">
              {content.fishDashboard.m3Value}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {content.fishDashboard.m4Label}
            </span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {content.fishDashboard.m4Value}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {content.fishDashboard.m5Label}
            </span>
            <p className="text-sm font-bold text-teal-700 dark:text-teal-400 mt-1">
              {content.fishDashboard.m5Value}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {content.fishDashboard.m6Label}
            </span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {content.fishDashboard.m6Value}
            </p>
          </div>
        </div>

        {/* Dashboard Visual Graph Simulation */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/40">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {content.fishDashboard.growthChartTitle}
            </span>
            <div className="mt-3 h-24 flex items-end gap-2 border-b border-slate-200 dark:border-emerald-800/40 pb-2">
              <div className="w-1/6 bg-emerald-300/80 rounded-t h-[25%]" title="Month 1" />
              <div className="w-1/6 bg-emerald-400/80 rounded-t h-[40%]" title="Month 2" />
              <div className="w-1/6 bg-emerald-500/80 rounded-t h-[55%]" title="Month 3" />
              <div className="w-1/6 bg-emerald-600/80 rounded-t h-[70%]" title="Month 4" />
              <div className="w-1/6 bg-emerald-700/80 rounded-t h-[85%]" title="Month 5" />
              <div className="w-1/6 bg-emerald-800/80 rounded-t h-[100%]" title="Harvest Target" />
            </div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/40">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {content.fishDashboard.feedTrendTitle}
            </span>
            <div className="mt-3 h-24 flex items-end gap-2 border-b border-slate-200 dark:border-emerald-800/40 pb-2">
              <div className="w-1/5 bg-teal-400/80 rounded-t h-[30%]" />
              <div className="w-1/5 bg-teal-500/80 rounded-t h-[50%]" />
              <div className="w-1/5 bg-teal-600/80 rounded-t h-[65%]" />
              <div className="w-1/5 bg-teal-700/80 rounded-t h-[80%]" />
              <div className="w-1/5 bg-teal-800/80 rounded-t h-[95%]" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. WATER QUALITY SECTION                                                  */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {content.waterQuality.heading}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {content.waterQuality.description}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {content.waterQuality.p1Label}
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {content.waterQuality.p1Value}
            </p>
            <span className="inline-block mt-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              {content.waterQuality.p1Status}
            </span>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {content.waterQuality.p2Label}
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {content.waterQuality.p2Value}
            </p>
            <span className="inline-block mt-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              {content.waterQuality.p2Status}
            </span>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {content.waterQuality.p3Label}
            </span>
            <p className="text-2xl font-black text-teal-700 dark:text-teal-400 mt-1">
              {content.waterQuality.p3Value}
            </p>
            <span className="inline-block mt-2 text-[11px] font-semibold text-teal-600 dark:text-teal-300">
              {content.waterQuality.p3Status}
            </span>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {content.waterQuality.p4Label}
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {content.waterQuality.p4Value}
            </p>
            <span className="inline-block mt-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              {content.waterQuality.p4Status}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => handleProtectedAction(content.waterQuality.btn)}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950"
          >
            <span>{content.waterQuality.btn}</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. AI ASSISTANT SECTION                                                   */}
      {/* ========================================================================= */}
      <section id="ai-assistant" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {content.aiAssistant.heading}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            {content.aiAssistant.description}
          </p>
        </div>

        {/* 3 AI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-8">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3">
              <Waves className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {content.aiAssistant.card1Title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {content.aiAssistant.card1Desc}
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-3">
              <Feather className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {content.aiAssistant.card2Title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {content.aiAssistant.card2Desc}
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3">
              <Bot className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {content.aiAssistant.card3Title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {content.aiAssistant.card3Desc}
            </p>
          </div>
        </div>

        {/* Example Chat Interface Visual */}
        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-200 dark:border-emerald-800/50 bg-white dark:bg-[#0c241a] p-5 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-emerald-900/40 text-xs font-bold text-slate-600 dark:text-slate-300">
            <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Farm AI Conversation Preview</span>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            {/* Farmer query */}
            <div className="flex justify-end">
              <div className="max-w-md bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/50 p-3 rounded-xl rounded-tr-none text-slate-800 dark:text-slate-200">
                <span className="block font-bold text-emerald-800 dark:text-emerald-400 mb-0.5">
                  {content.aiAssistant.chatFarmerLabel}
                </span>
                <p>{content.aiAssistant.chatFarmerText}</p>
              </div>
            </div>

            {/* AI response */}
            <div className="flex justify-start">
              <div className="max-w-md bg-slate-100 dark:bg-[#081b13] border border-slate-200 dark:border-emerald-900/50 p-3 rounded-xl rounded-tl-none text-slate-800 dark:text-slate-200">
                <span className="block font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                  {content.aiAssistant.chatAiLabel}
                </span>
                <p>{content.aiAssistant.chatAiText}</p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-500 dark:text-slate-400 italic">
            {content.aiAssistant.disclaimer}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-emerald-900/40 text-center">
            <button
              onClick={() => handleProtectedAction(content.aiAssistant.btn)}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0F5132] hover:bg-[#15803d] text-white shadow-2xs"
            >
              <span>{content.aiAssistant.btn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. POULTRY SECTION                                                        */}
      {/* ========================================================================= */}
      <section id="poultry" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT: Features */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {content.poultry.heading}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {content.poultry.description}
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-emerald-800/30 bg-white dark:bg-[#0c241a]/40">
                <h3 className="text-xs font-bold text-amber-800 dark:text-amber-400">
                  {content.poultry.f1Title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {content.poultry.f1Desc}
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-emerald-800/30 bg-white dark:bg-[#0c241a]/40">
                <h3 className="text-xs font-bold text-amber-800 dark:text-amber-400">
                  {content.poultry.f2Title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {content.poultry.f2Desc}
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-emerald-800/30 bg-white dark:bg-[#0c241a]/40">
                <h3 className="text-xs font-bold text-amber-800 dark:text-amber-400">
                  {content.poultry.f3Title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {content.poultry.f3Desc}
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-emerald-800/30 bg-white dark:bg-[#0c241a]/40">
                <h3 className="text-xs font-bold text-amber-800 dark:text-amber-400">
                  {content.poultry.f4Title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {content.poultry.f4Desc}
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-emerald-800/30 bg-white dark:bg-[#0c241a]/40">
                <h3 className="text-xs font-bold text-amber-800 dark:text-amber-400">
                  {content.poultry.f5Title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {content.poultry.f5Desc}
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-emerald-800/30 bg-white dark:bg-[#0c241a]/40">
                <h3 className="text-xs font-bold text-amber-800 dark:text-amber-400">
                  {content.poultry.f6Title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {content.poultry.f6Desc}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => handleProtectedAction(content.poultry.btn)}
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0F5132] hover:bg-[#15803d] text-white transition-all shadow-xs"
              >
                <span>{content.poultry.btn}</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Image */}
          <div className="lg:col-span-6 order-1 lg:order-2 rounded-2xl overflow-hidden border border-slate-200 dark:border-emerald-800/40 shadow-md relative h-80 sm:h-96">
            <Image
              src="/PolutryFarmPic.png"
              alt="Poultry Farm Management"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. POULTRY VIDEO SECTION                                                 */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-emerald-800/40 shadow-lg bg-black">
          <video
            ref={poultryVideoRef}
            src="/PolutryFarmVideo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-72 sm:h-96 lg:h-[420px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent flex items-center p-6 sm:p-10">
            <div className="max-w-md text-white">
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                {content.poultryVideo.heading}
              </h3>
              <p className="mt-2 text-sm text-slate-200">
                {content.poultryVideo.subtext}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => handleProtectedAction(content.poultryVideo.btn)}
                  type="button"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-all"
                >
                  {content.poultryVideo.btn}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePoultryVideoPlay}
                    type="button"
                    aria-label="Play/Pause poultry video"
                    className="p-2 rounded bg-white/20 hover:bg-white/30 text-white"
                  >
                    {isPoultryVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={togglePoultryVideoMute}
                    type="button"
                    aria-label="Mute/Unmute poultry video"
                    className="p-2 rounded bg-white/20 hover:bg-white/30 text-white"
                  >
                    {isPoultryVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. POULTRY DASHBOARD SECTION                                             */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded bg-slate-200 dark:bg-emerald-950/60 text-[11px] font-semibold text-slate-700 dark:text-emerald-300 mb-2">
              {content.poultryDashboard.badgeDemo}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {content.poultryDashboard.heading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              {content.poultryDashboard.description}
            </p>
          </div>
          <button
            onClick={() => handleProtectedAction(content.poultryDashboard.btn)}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950"
          >
            <span>{content.poultryDashboard.btn}</span>
          </button>
        </div>

        {/* 6 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {content.poultryDashboard.m1Label}
            </span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {content.poultryDashboard.m1Value}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {content.poultryDashboard.m2Label}
            </span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {content.poultryDashboard.m2Value}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {content.poultryDashboard.m3Label}
            </span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {content.poultryDashboard.m3Value}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {content.poultryDashboard.m4Label}
            </span>
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-1">
              {content.poultryDashboard.m4Value}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {content.poultryDashboard.m5Label}
            </span>
            <p className="text-lg font-bold text-amber-700 dark:text-amber-400 mt-1">
              {content.poultryDashboard.m5Value}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {content.poultryDashboard.m6Label}
            </span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {content.poultryDashboard.m6Value}
            </p>
          </div>
        </div>

        {/* Visual Graph Representation */}
        <div className="mt-5 p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/40 max-w-2xl">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {content.poultryDashboard.chartTitle}
          </span>
          <div className="mt-3 h-20 flex items-end gap-3 border-b border-slate-200 dark:border-emerald-800/40 pb-2">
            <div className="flex-1 bg-amber-200/80 rounded-t h-[20%]" title="Week 1" />
            <div className="flex-1 bg-amber-300/80 rounded-t h-[35%]" title="Week 2" />
            <div className="flex-1 bg-amber-400/80 rounded-t h-[55%]" title="Week 3" />
            <div className="flex-1 bg-amber-500/80 rounded-t h-[75%]" title="Week 4" />
            <div className="flex-1 bg-amber-600/80 rounded-t h-[92%]" title="Week 5" />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. WEATHER SECTION                                                       */}
      {/* ========================================================================= */}
      <section id="weather" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {content.weather.heading}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {content.weather.description}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs">{content.weather.tempLabel}</span>
              <Thermometer className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{content.weather.tempValue}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs">{content.weather.humidityLabel}</span>
              <Droplets className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{content.weather.humidityValue}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs">{content.weather.rainLabel}</span>
              <CloudRain className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{content.weather.rainValue}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs">{content.weather.windLabel}</span>
              <Wind className="w-4 h-4 text-slate-600" />
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{content.weather.windValue}</p>
          </div>
        </div>

        {/* 3-day strip */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/40 max-w-xl">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2.5">
            {content.weather.forecastLabel}
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {content.weather.forecastDays.map((f, i) => (
              <div key={i} className="p-2 rounded bg-slate-50 dark:bg-[#081b13]">
                <p className="font-bold text-slate-800 dark:text-slate-200">{f.day}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{f.condition}</p>
                <p className="font-semibold text-emerald-700 dark:text-emerald-400 mt-1">{f.temp}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={() => handleProtectedAction(content.weather.btn)}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950"
          >
            <span>{content.weather.btn}</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. WEATHER + FARM INSIGHTS                                               */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {content.weatherInsights.heading}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {content.weatherInsights.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <CloudRain className="w-5 h-5 text-blue-600 mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {content.weatherInsights.c1Title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {content.weatherInsights.c1Desc}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <Thermometer className="w-5 h-5 text-amber-600 mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {content.weatherInsights.c2Title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {content.weatherInsights.c2Desc}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <Wind className="w-5 h-5 text-slate-600 mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {content.weatherInsights.c3Title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {content.weatherInsights.c3Desc}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <Sun className="w-5 h-5 text-orange-500 mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {content.weatherInsights.c4Title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {content.weatherInsights.c4Desc}
            </p>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
          {content.weatherInsights.guidanceNote}
        </p>
      </section>

      {/* ========================================================================= */}
      {/* 14. ALERTS SECTION                                                        */}
      {/* ========================================================================= */}
      <section id="alerts" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {content.alerts.heading}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {content.alerts.description}
          </p>
        </div>

        <div className="space-y-2.5 max-w-3xl">
          {[content.alerts.item1, content.alerts.item2, content.alerts.item3, content.alerts.item4, content.alerts.item5].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 flex items-center justify-between shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-emerald-950/50 text-slate-600 dark:text-emerald-300">
                {item.type}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <button
            onClick={() => handleProtectedAction(content.alerts.btn)}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950"
          >
            <span>{content.alerts.btn}</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 15. EXPENSE SECTION                                                       */}
      {/* ========================================================================= */}
      <section id="expenses" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {content.expenses.heading}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {content.expenses.description}
          </p>
        </div>

        {/* Category chips */}
        <div className="mb-6">
          <span className="text-xs font-semibold text-slate-500 block mb-2">
            {content.expenses.categoriesTitle}
          </span>
          <div className="flex flex-wrap gap-2">
            {content.expenses.categories.map((cat, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-[#0c241a] border border-slate-200 dark:border-emerald-800/40 text-slate-700 dark:text-slate-300"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* 4 Expense Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500">{content.expenses.m1Label}</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{content.expenses.m1Value}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500">{content.expenses.m2Label}</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{content.expenses.m2Value}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500">{content.expenses.m3Label}</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{content.expenses.m3Value}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500">{content.expenses.m4Label}</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{content.expenses.m4Value}</p>
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={() => handleProtectedAction(content.expenses.btn)}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950"
          >
            <span>{content.expenses.btn}</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 16. ANALYTICS SECTION                                                     */}
      {/* ========================================================================= */}
      <section id="analytics" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {content.analytics.heading}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {content.analytics.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Fisheries Analytics */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <div className="flex items-center gap-2 mb-3">
              <Waves className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {content.analytics.fishTitle}
              </h3>
            </div>
            <ul className="space-y-2 text-xs">
              {content.analytics.fishItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Poultry Analytics */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <div className="flex items-center gap-2 mb-3">
              <Feather className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {content.analytics.poultryTitle}
              </h3>
            </div>
            <ul className="space-y-2 text-xs">
              {content.analytics.poultryItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => handleProtectedAction(content.analytics.btn)}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950"
          >
            <span>{content.analytics.btn}</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 17. FARM AND BATCH MANAGEMENT                                             */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {content.farmBatchMgmt.heading}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {content.farmBatchMgmt.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Hierarchy 1: Fisheries */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-xs font-bold text-teal-800 dark:text-teal-400 block mb-3">
              {content.farmBatchMgmt.tree1Title}
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-emerald-950/40">
                {content.farmBatchMgmt.tree1Step1}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-emerald-950/40">
                {content.farmBatchMgmt.tree1Step2}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="px-2.5 py-1 rounded bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300">
                {content.farmBatchMgmt.tree1Step3}
              </span>
            </div>
          </div>

          {/* Hierarchy 2: Poultry */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400 block mb-3">
              {content.farmBatchMgmt.tree2Title}
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-emerald-950/40">
                {content.farmBatchMgmt.tree2Step1}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-emerald-950/40">
                {content.farmBatchMgmt.tree2Step2}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                {content.farmBatchMgmt.tree2Step3}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 18. DAILY FARM BRIEF                                                      */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {content.dailyBrief.heading}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {content.dailyBrief.description}
          </p>
        </div>

        {/* Daily brief card mockup */}
        <div className="max-w-xl rounded-2xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-emerald-900/40 text-xs">
            <span className="font-bold text-emerald-800 dark:text-emerald-400">
              {content.dailyBrief.greeting}
            </span>
            <span className="text-slate-500">{content.dailyBrief.cardTitle}</span>
          </div>

          <div className="mt-3.5 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-emerald-950/30">
              <span className="text-slate-500">{content.dailyBrief.i1Label}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{content.dailyBrief.i1Value}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-emerald-950/30">
              <span className="text-slate-500">{content.dailyBrief.i2Label}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{content.dailyBrief.i2Value}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-emerald-950/30">
              <span className="text-slate-500">{content.dailyBrief.i3Label}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{content.dailyBrief.i3Value}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-emerald-950/30">
              <span className="text-slate-500">{content.dailyBrief.i4Label}</span>
              <span className="font-semibold text-teal-700 dark:text-teal-400">{content.dailyBrief.i4Value}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">{content.dailyBrief.i5Label}</span>
              <span className="font-semibold text-amber-700 dark:text-amber-400">{content.dailyBrief.i5Value}</span>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-500 dark:text-slate-400 italic">
            {content.dailyBrief.emailNote}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-emerald-900/40">
            <button
              onClick={() => handleProtectedAction(content.dailyBrief.btn)}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950"
            >
              <span>{content.dailyBrief.btn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 19. LANGUAGE SUPPORT                                                      */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {content.languageSec.heading}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {content.languageSec.description}
          </p>
          <div className="mt-5">
            <button
              onClick={toggleLanguage}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-emerald-600 text-xs font-bold bg-white dark:bg-[#0c241a] text-emerald-800 dark:text-emerald-300 shadow-2xs hover:bg-emerald-50"
            >
              <Languages className="w-4 h-4 text-emerald-600" />
              <span>{content.languageSec.toggleLabel}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 20. MOBILE FARM MANAGEMENT                                                */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-4xl mx-auto">
          <div className="md:col-span-5 flex justify-center">
            {/* Phone mockup */}
            <div className="w-64 rounded-3xl border-4 border-slate-800 dark:border-emerald-900 bg-slate-900 p-3 shadow-xl">
              <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto mb-2" />
              <div className="bg-slate-50 dark:bg-[#07130e] rounded-2xl p-3 text-left">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400">
                  AgriFarmAssistant Mobile
                </span>
                <div className="mt-2 space-y-1.5 text-[10px] text-slate-700 dark:text-slate-300">
                  <div className="p-1.5 bg-white dark:bg-[#0c241a] rounded border border-slate-200 dark:border-emerald-800/40">
                    Pond 1 • DO 6.4 mg/L
                  </div>
                  <div className="p-1.5 bg-white dark:bg-[#0c241a] rounded border border-slate-200 dark:border-emerald-800/40">
                    Shed A • Temp 29°C
                  </div>
                  <div className="p-1.5 bg-white dark:bg-[#0c241a] rounded border border-slate-200 dark:border-emerald-800/40">
                    Today Feed • 185 kg
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {content.mobileMgmt.heading}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {content.mobileMgmt.description}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{content.mobileMgmt.b1}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{content.mobileMgmt.b2}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{content.mobileMgmt.b3}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{content.mobileMgmt.b4}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{content.mobileMgmt.b5}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{content.mobileMgmt.b6}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 21. HOW IT WORKS                                                          */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {content.howItWorks.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 block mb-1">
              {content.howItWorks.s1Num}
            </span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              {content.howItWorks.s1Title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {content.howItWorks.s1Desc}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 block mb-1">
              {content.howItWorks.s2Num}
            </span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              {content.howItWorks.s2Title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {content.howItWorks.s2Desc}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 block mb-1">
              {content.howItWorks.s3Num}
            </span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              {content.howItWorks.s3Title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {content.howItWorks.s3Desc}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs">
            <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 block mb-1">
              {content.howItWorks.s4Num}
            </span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              {content.howItWorks.s4Title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {content.howItWorks.s4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 22. FEATURE SUMMARY                                                       */}
      {/* ========================================================================= */}
      <section id="features" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {content.featureSummary.heading}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
          {content.featureSummary.items.map((feat, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/60 shadow-2xs"
            >
              <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                {feat.title}
              </h3>
              <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 23. ABOUT SECTION                                                         */}
      {/* ========================================================================= */}
      <section id="about" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/40">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {content.about.heading}
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {content.about.description}
          </p>

          <div className="mt-6 p-4 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a]/40 inline-block text-left max-w-md">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 block">
              {content.about.goalTitle}
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {content.about.goalDesc}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 24. FINAL CTA                                                             */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-br from-[#0F5132] via-[#15803d] to-emerald-900 p-8 sm:p-12 text-white text-center shadow-lg">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold">
              {content.finalCta.heading}
            </h2>
            <p className="mt-3 text-sm text-emerald-100">
              {content.finalCta.description}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white text-[#0F5132] hover:bg-slate-100 transition-all shadow-xs"
              >
                {content.finalCta.btnGetStarted}
              </Link>
              <button
                onClick={() => handleProtectedAction(content.finalCta.btnOpenDashboard)}
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-950/50 hover:bg-emerald-950/70 text-white border border-white/20 transition-all"
              >
                {content.finalCta.btnOpenDashboard}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 25. FOOTER                                                                */}
      {/* ========================================================================= */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-emerald-950/60 bg-white dark:bg-[#07130e] pt-10 pb-8 px-4 sm:px-6 lg:px-8 text-slate-600 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {content.footer.brandTitle}
            </span>
            <p className="text-xs text-slate-500 mt-0.5">{content.footer.tagline}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs">
            {content.footer.links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-100 dark:border-emerald-950/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>{content.footer.copyright}</p>
          <div className="flex items-center gap-3">
            {content.footer.otherLinks.map((item, idx) => (
              <a key={idx} href={item.href} className="hover:underline">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* AUTHENTICATION GATEWAY MODAL                                              */}
      {/* ========================================================================= */}
      {authModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-emerald-800/60 bg-white dark:bg-[#0c241a] p-6 shadow-xl text-slate-900 dark:text-white">
            <button
              onClick={() => setAuthModalOpen(false)}
              type="button"
              aria-label="Close modal"
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                  {content.authModal.subtitle}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {content.authModal.title}
                </h3>
              </div>
            </div>

            {gatedFeatureName && (
              <div className="my-2.5 p-2 rounded bg-slate-50 dark:bg-[#081b13] border border-slate-200 dark:border-emerald-800/40 text-xs">
                <span className="text-slate-500">{content.authModal.featurePrompt} </span>
                <span className="font-bold text-emerald-800 dark:text-emerald-400">
                  {gatedFeatureName}
                </span>
              </div>
            )}

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {content.authModal.description}
            </p>

            <div className="mt-5 flex items-center gap-2">
              <Link
                href="/login"
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#0F5132] hover:bg-[#15803d] text-white text-center shadow-xs"
              >
                {content.authModal.proceedButton}
              </Link>
              <button
                onClick={() => setAuthModalOpen(false)}
                type="button"
                className="py-2.5 px-4 rounded-xl text-xs font-semibold border border-slate-300 dark:border-emerald-800/60 text-slate-600 dark:text-slate-300"
              >
                {content.authModal.cancelButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
