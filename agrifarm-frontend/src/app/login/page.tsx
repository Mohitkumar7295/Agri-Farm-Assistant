"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  KeyRound,
  User,
  MapPin,
  Building,
  Globe,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Languages,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Lock,
  Loader2,
  Check,
} from "lucide-react";
import {
  authTranslations,
  AuthLanguage,
  AuthContent,
} from "@/i18n/authTranslations";

type AuthTab = "register" | "login";

export default function LoginPage() {
  const [lang, setLang] = useState<AuthLanguage>("en");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AuthTab>("register");

  // Registration Form State
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regCountry, setRegCountry] = useState("India");
  const [regState, setRegState] = useState("");
  const [regDistrict, setRegDistrict] = useState("");
  const [regVillageCity, setRegVillageCity] = useState("");
  const [regTermsAgreed, setRegTermsAgreed] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");

  // OTP Verification States
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [activeOtpEmail, setActiveOtpEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Status & Feedback States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load language & theme preferences
  useEffect(() => {
    const savedLang = localStorage.getItem("agrifarm_lang") as AuthLanguage;
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

  // OTP Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpStep && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOtpStep, resendTimer]);

  const toggleLanguage = () => {
    const nextLang: AuthLanguage = lang === "en" ? "hi" : "en";
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

  const content: AuthContent = authTranslations[lang];

  // Email format validator
  const isValidEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  // Switch between Tabs
  const handleTabSwitch = (tab: AuthTab) => {
    setActiveTab(tab);
    setIsOtpStep(false);
    setErrorMessage("");
    setSuccessMessage("");
    setOtpDigits(["", "", "", "", "", ""]);
  };

  // 1. Submit Registration Form
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!regFullName.trim()) {
      setErrorMessage(content.errors.requiredField);
      return;
    }
    const cleanMobile = regMobile.replace(/[^0-9]/g, "");
    if (!regMobile.trim() || cleanMobile.length < 10) {
      setErrorMessage(content.errors.invalidMobile);
      return;
    }
    if (!isValidEmail(regEmail)) {
      setErrorMessage(content.errors.invalidEmail);
      return;
    }
    if (!regAddress.trim()) {
      setErrorMessage(content.errors.requiredField);
      return;
    }
    if (
      !regCountry.trim() ||
      !regState.trim() ||
      !regDistrict.trim() ||
      !regVillageCity.trim()
    ) {
      setErrorMessage(content.errors.allGeoRequired);
      return;
    }
    if (!regTermsAgreed) {
      setErrorMessage(content.errors.termsRequired);
      return;
    }

    setIsLoading(true);

    // Simulate OTP dispatch via backend
    setTimeout(() => {
      setIsLoading(false);
      setActiveOtpEmail(regEmail);
      setIsOtpStep(true);
      setResendTimer(60);
      setCanResend(false);
      setSuccessMessage(
        lang === "hi"
          ? "सत्यापन कोड आपके ईमेल पर प्रेषित कर दिया गया है।"
          : "6-digit verification code has been dispatched to your email."
      );
    }, 1000);
  };

  // 2. Submit Login Email Form
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isValidEmail(loginEmail)) {
      setErrorMessage(content.errors.invalidEmail);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setActiveOtpEmail(loginEmail);
      setIsOtpStep(true);
      setResendTimer(60);
      setCanResend(false);
      setSuccessMessage(
        lang === "hi"
          ? "सत्यापन कोड आपके ईमेल पर प्रेषित कर दिया गया है।"
          : "6-digit verification code has been dispatched to your email."
      );
    }, 1000);
  };

  // 3. Handle 6-Digit OTP Input
  const handleOtpDigitChange = (index: number, value: string) => {
    const cleanChar = value.replace(/[^0-9]/g, "").slice(-1);
    const updated = [...otpDigits];
    updated[index] = cleanChar;
    setOtpDigits(updated);

    // Auto advance focus to next box
    if (cleanChar && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pastedData) return;

    const updated = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      if (pastedData[i]) {
        updated[i] = pastedData[i];
      }
    }
    setOtpDigits(updated);
    const lastFilled = Math.min(pastedData.length, 5);
    otpInputRefs.current[lastFilled]?.focus();
  };

  // 4. Resend OTP
  const handleResendOtp = () => {
    if (!canResend) return;
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setResendTimer(60);
      setCanResend(false);
      setSuccessMessage(
        lang === "hi"
          ? "नया सत्यापन कोड पुनः प्रेषित किया गया।"
          : "New 6-digit verification code re-sent."
      );
    }, 800);
  };

  // 5. Verify OTP & Finalize Session
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const fullCode = otpDigits.join("");
    if (fullCode.length < 6) {
      setErrorMessage(content.errors.invalidOtp);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Save 30-day session in localStorage
      const sessionToken = "jwt_live_session_" + Date.now();
      localStorage.setItem("agrifarm_jwt", sessionToken);

      const userProfile = {
        fullName:
          activeTab === "register"
            ? regFullName.replace(/[()[\]{}]/g, "").trim()
            : "Ramu Kisan",
        email: activeOtpEmail,
        mobileNumber: activeTab === "register" ? regMobile : "",
        country: activeTab === "register" ? regCountry : "India",
        state: activeTab === "register" ? regState : "Active State",
        district: activeTab === "register" ? regDistrict : "Active District",
        villageCity: activeTab === "register" ? regVillageCity : "Active City",
        registeredAt: new Date().toISOString(),
      };
      localStorage.setItem("agrifarm_user", JSON.stringify(userProfile));

      // Redirect to home dashboard immediately after login
      window.location.href = "/dashboard";
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07130e] text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col justify-between">
      {/* 1. TOP ACCESS BAR */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-emerald-950/40 bg-white/80 dark:bg-[#07130e]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{content.nav.backHome}</span>
            </Link>

            <div className="h-4 w-px bg-slate-200 dark:bg-emerald-900/60 hidden sm:block" />

            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-emerald-600/30">
                <Image
                  src="/picandvideo/logo.png"
                  alt="AgriFarmAssistant Logo"
                  fill
                  sizes="36px"
                  className="object-contain p-0.5"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-emerald-900 dark:text-emerald-400 leading-tight">
                  {content.nav.brandTitle}
                </span>
                <span className="text-[10px] font-medium text-emerald-700/80 dark:text-emerald-500/80 uppercase tracking-wider">
                  {content.nav.brandSubtitle}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-950/40 text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition-all shadow-2xs"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === "en" ? "हिन्दी" : "English"}</span>
            </button>

            {/* Dark/Light Switch */}
            <button
              onClick={toggleTheme}
              type="button"
              aria-label="Toggle theme"
              className="p-1.5 rounded-lg border border-slate-300 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition-all shadow-2xs"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-800" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CENTERED AUTHENTICATION INTERFACE */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        <div className="rounded-3xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c241a] p-6 sm:p-10 shadow-xl">
          {/* DUAL-TAB SWITCHER */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800/40 mb-6">
                <button
                  type="button"
                  onClick={() => handleTabSwitch("register")}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                    activeTab === "register"
                      ? "bg-white dark:bg-emerald-600 text-emerald-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  }`}
                >
                  {content.tabs.register}
                </button>
                <button
                  type="button"
                  onClick={() => handleTabSwitch("login")}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                    activeTab === "login"
                      ? "bg-white dark:bg-emerald-600 text-emerald-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  }`}
                >
                  {content.tabs.login}
                </button>
              </div>

              {/* Subtitle Header */}
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {activeTab === "register"
                    ? content.tabs.register
                    : content.tabs.login}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {activeTab === "register"
                    ? content.tabs.registerSubtitle
                    : content.tabs.loginSubtitle}
                </p>
              </div>

              {/* Error and Success Banners */}
              {errorMessage && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/40 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* VIEW A: STEP 2 OTP VERIFICATION */}
              {isOtpStep ? (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071911] border border-slate-200 dark:border-emerald-800/40">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
                      {content.otpStep.instruction}
                    </span>
                    <span className="text-sm font-bold text-emerald-800 dark:text-emerald-400 block mt-0.5">
                      {activeOtpEmail}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsOtpStep(false)}
                      className="mt-2 text-xs font-semibold text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-300 underline"
                    >
                      {content.otpStep.changeEmail}
                    </button>
                  </div>

                  {/* 6 Individual Digit Inputs */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 text-center">
                      {content.otpStep.title}
                    </label>
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            otpInputRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={index === 0 ? handleOtpPaste : undefined}
                          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border border-slate-300 dark:border-emerald-800/60 bg-white dark:bg-[#081b13] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Resend Countdown */}
                  <div className="text-center text-xs">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{content.otpStep.resendLink}</span>
                      </button>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">
                        {content.otpStep.resendIn}{" "}
                        <strong className="text-slate-800 dark:text-slate-200">
                          {resendTimer}
                          {content.otpStep.seconds}
                        </strong>
                      </span>
                    )}
                  </div>

                  {/* Submit Verify Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm bg-[#0F5132] hover:bg-[#15803d] text-white shadow-sm active:scale-[0.98] transition-all disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{content.otpStep.verifying}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>{content.otpStep.btnVerify}</span>
                      </>
                    )}
                  </button>
                </form>
              ) : activeTab === "register" ? (
                /* VIEW B: TAB A — REGISTRATION FLOW */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Full Name & Mobile Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {content.registerForm.fullNameLabel} *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder={content.registerForm.fullNamePlaceholder}
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-emerald-800/60 bg-white dark:bg-[#081b13] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {content.registerForm.mobileLabel} *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          value={regMobile}
                          onChange={(e) => setRegMobile(e.target.value)}
                          placeholder={content.registerForm.mobilePlaceholder}
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-emerald-800/60 bg-white dark:bg-[#081b13] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {content.registerForm.emailLabel} *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder={content.registerForm.emailPlaceholder}
                        required
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-emerald-800/60 bg-white dark:bg-[#081b13] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {content.registerForm.addressLabel} *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        placeholder={content.registerForm.addressPlaceholder}
                        required
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-emerald-800/60 bg-white dark:bg-[#081b13] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Country & State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {content.registerForm.countryLabel} *
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={regCountry}
                          onChange={(e) => setRegCountry(e.target.value)}
                          placeholder={content.registerForm.countryPlaceholder}
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-emerald-800/60 bg-white dark:bg-[#081b13] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {content.registerForm.stateLabel} *
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={regState}
                          onChange={(e) => setRegState(e.target.value)}
                          placeholder={content.registerForm.statePlaceholder}
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-emerald-800/60 bg-white dark:bg-[#081b13] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* District & Village/City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {content.registerForm.districtLabel} *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={regDistrict}
                          onChange={(e) => setRegDistrict(e.target.value)}
                          placeholder={content.registerForm.districtPlaceholder}
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-emerald-800/60 bg-white dark:bg-[#081b13] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {content.registerForm.villageCityLabel} *
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={regVillageCity}
                          onChange={(e) => setRegVillageCity(e.target.value)}
                          placeholder={content.registerForm.villageCityPlaceholder}
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-emerald-800/60 bg-white dark:bg-[#081b13] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={regTermsAgreed}
                        onChange={(e) => setRegTermsAgreed(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                      />
                      <span>{content.registerForm.termsAgreement}</span>
                    </label>
                  </div>

                  {/* Action Button: Register */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm bg-[#0F5132] hover:bg-[#15803d] text-white shadow-sm active:scale-[0.98] transition-all disabled:opacity-60"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{content.registerForm.processing}</span>
                        </>
                      ) : (
                        <>
                          <span>{content.registerForm.btnRegister}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => handleTabSwitch("login")}
                      className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline"
                    >
                      {content.registerForm.alreadyAccount}
                    </button>
                  </div>
                </form>
              ) : (
                /* VIEW C: TAB B — RETURNING USER OTP LOGIN */
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      {content.loginForm.emailLabel} *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder={content.loginForm.emailPlaceholder}
                        required
                        className="w-full pl-9 pr-3 py-3 text-sm rounded-xl border border-slate-300 dark:border-emerald-800/60 bg-white dark:bg-[#081b13] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Action Button: Send Login Code */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm bg-[#0F5132] hover:bg-[#15803d] text-white shadow-sm active:scale-[0.98] transition-all disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{content.loginForm.sending}</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>{content.loginForm.btnSendCode}</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => handleTabSwitch("register")}
                      className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline"
                    >
                      {content.loginForm.noAccount}
                    </button>
                  </div>
                </form>
              )}
            </div>
      </main>

      {/* 3. MINIMAL FOOTNOTE */}
      <footer className="w-full border-t border-slate-200/80 dark:border-emerald-950/40 py-4 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <span>© 2026 AgriFarmAssistant • {content.ambientCard.footnote}</span>
      </footer>
    </div>
  );
}
