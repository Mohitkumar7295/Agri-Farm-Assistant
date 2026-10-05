"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Fish,
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
  Plus,
  ArrowRight,
  Activity,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Building,
  TrendingUp,
  Droplets,
  Search,
  Trash2,
  Sparkles,
  ChevronRight,
  Info,
  Check,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import {
  FisheriesBatch,
  BatchSpeciesItem,
  EXACT_FISH_SPECIES,
  FishSpeciesName,
} from "@/types/fisheries";
import { INITIAL_FISHERIES_BATCHES } from "@/data/defaultFisheriesData";
import {
  fisheriesTranslations,
  FisheriesLanguage,
  FisheriesContent,
} from "@/i18n/fisheriesTranslations";
import { formatFarmerName } from "@/i18n/nameTransliteration";

export default function FisheriesPage() {
  const [lang, setLang] = useState<FisheriesLanguage>("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [batches, setBatches] = useState<FisheriesBatch[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Modals state
  const [isAddWizardOpen, setIsAddWizardOpen] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [selectedBatchForManage, setSelectedBatchForManage] =
    useState<FisheriesBatch | null>(null);
  const [manageActiveTab, setManageActiveTab] = useState<
    "growth" | "water" | "feed" | "health"
  >("growth");

  // Batch AI Modal state
  const [selectedBatchForAi, setSelectedBatchForAi] =
    useState<FisheriesBatch | null>(null);
  const [batchAiQuery, setBatchAiQuery] = useState<string>("");
  const [batchAiAnswer, setBatchAiAnswer] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // General Fisheries AI Assistant Modal
  const [isGeneralAiOpen, setIsGeneralAiOpen] = useState<boolean>(false);
  const [generalAiQuery, setGeneralAiQuery] = useState<string>("");
  const [generalAiResponse, setGeneralAiResponse] = useState<string>("");

  // New Batch Form State
  const [formBatchName, setFormBatchName] = useState<string>("");
  const [formStockingDate, setFormStockingDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [formLocation, setFormLocation] = useState<string>("");
  const [formPondArea, setFormPondArea] = useState<string>("1.5");
  const [formWaterDepth, setFormWaterDepth] = useState<string>("5.0");
  const [formSpeciesList, setFormSpeciesList] = useState<BatchSpeciesItem[]>([
    {
      id: "spec-init-1",
      speciesName: "Catla",
      quantity: 2000,
      initialWeightGrams: 50,
      currentWeightGrams: 50,
      targetWeightGrams: 1500,
    },
  ]);

  // Load language and batches from localStorage
  useEffect(() => {
    // 0. Strict Auth Guard: without login no entry in dashboard from anywhere
    const token = typeof window !== "undefined" ? localStorage.getItem("agrifarm_jwt") : null;
    if (!token) {
      window.location.replace("/login");
      return;
    }

    const savedLang = localStorage.getItem("agrifarm_lang") as FisheriesLanguage;
    if (savedLang === "en" || savedLang === "hi") {
      setLang(savedLang);
    }

    const savedBatches = localStorage.getItem("agrifarm_fisheries_batches");
    if (savedBatches) {
      try {
        const parsed = JSON.parse(savedBatches);
        setBatches(parsed);
      } catch (err) {
        console.error("Failed to parse saved batches, using seed data:", err);
        setBatches(INITIAL_FISHERIES_BATCHES);
      }
    } else {
      setBatches(INITIAL_FISHERIES_BATCHES);
      localStorage.setItem(
        "agrifarm_fisheries_batches",
        JSON.stringify(INITIAL_FISHERIES_BATCHES)
      );
    }
    setIsLoaded(true);
  }, []);

  const content: FisheriesContent = fisheriesTranslations[lang];

  const saveBatches = (updated: FisheriesBatch[]) => {
    setBatches(updated);
    localStorage.setItem(
      "agrifarm_fisheries_batches",
      JSON.stringify(updated)
    );
  };

  const toggleLanguage = () => {
    const nextLang: FisheriesLanguage = lang === "en" ? "hi" : "en";
    setLang(nextLang);
    localStorage.setItem("agrifarm_lang", nextLang);
  };

  // Helper calculations for any batch
  const getBatchTotalFish = (batch: FisheriesBatch) => {
    return batch.speciesList.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
  };

  const getBatchCurrentBiomassKg = (batch: FisheriesBatch) => {
    return batch.speciesList.reduce(
      (acc, curr) =>
        acc +
        ((Number(curr.quantity) || 0) * (Number(curr.currentWeightGrams) || 0)) /
          1000,
      0
    );
  };

  const getBatchInitialBiomassKg = (batch: FisheriesBatch) => {
    return batch.speciesList.reduce(
      (acc, curr) =>
        acc +
        ((Number(curr.quantity) || 0) * (Number(curr.initialWeightGrams) || 0)) /
          1000,
      0
    );
  };

  const getBatchTargetBiomassKg = (batch: FisheriesBatch) => {
    return batch.speciesList.reduce(
      (acc, curr) =>
        acc +
        ((Number(curr.quantity) || 0) * (Number(curr.targetWeightGrams) || 0)) /
          1000,
      0
    );
  };

  const getBatchAverageWeightGrams = (batch: FisheriesBatch) => {
    const totalFish = getBatchTotalFish(batch);
    if (!totalFish) return 0;
    const totalBiomassKg = getBatchCurrentBiomassKg(batch);
    return Math.round((totalBiomassKg * 1000) / totalFish);
  };

  // Form Calculations for Step 3
  const formTotalStocked = formSpeciesList.reduce(
    (acc, curr) => acc + (Number(curr.quantity) || 0),
    0
  );
  const formInitialBiomassKg = formSpeciesList.reduce(
    (acc, curr) =>
      acc +
      ((Number(curr.quantity) || 0) * (Number(curr.initialWeightGrams) || 0)) /
        1000,
    0
  );
  const formCurrentBiomassKg = formSpeciesList.reduce(
    (acc, curr) =>
      acc +
      ((Number(curr.quantity) || 0) * (Number(curr.currentWeightGrams) || 0)) /
        1000,
    0
  );
  const formTargetHarvestKg = formSpeciesList.reduce(
    (acc, curr) =>
      acc +
      ((Number(curr.quantity) || 0) * (Number(curr.targetWeightGrams) || 0)) /
        1000,
    0
  );

  // Add Species Row in Wizard
  const handleAddSpeciesRow = () => {
    setFormSpeciesList((prev) => [
      ...prev,
      {
        id: "spec-" + Date.now(),
        speciesName: "Rohu",
        quantity: 1000,
        initialWeightGrams: 40,
        currentWeightGrams: 40,
        targetWeightGrams: 1200,
      },
    ]);
  };

  // Remove Species Row
  const handleRemoveSpeciesRow = (id: string) => {
    if (formSpeciesList.length === 1) return;
    setFormSpeciesList((prev) => prev.filter((item) => item.id !== id));
  };

  // Update Species Row field
  const handleUpdateSpeciesRow = (
    id: string,
    field: keyof BatchSpeciesItem,
    val: any
  ) => {
    setFormSpeciesList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  // Finalize New Batch Submission
  const handleCreateBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBatchName.trim()) return;

    const newBatch: FisheriesBatch = {
      id: "batch-" + Date.now(),
      name: formBatchName.trim(),
      status: "Active",
      stockingDate: formStockingDate,
      location: formLocation.trim() || "Main Farm Pond",
      pondAreaAcres: Number(formPondArea) || 1.0,
      waterDepthFeet: Number(formWaterDepth) || 5.0,
      speciesList: formSpeciesList,
      waterTelemetry: {
        temperatureC: 28.0,
        pH: 7.5,
        dissolvedOxygenMgL: 6.5,
        ammoniaMgL: 0.015,
        lastUpdated: "Just now",
      },
      todayFeedKg: Math.round(formCurrentBiomassKg * 0.025 * 10) / 10,
      feedingHistory: [
        {
          id: "feed-" + Date.now(),
          date: formStockingDate,
          time: "08:00 AM",
          rationKg: Math.round(formCurrentBiomassKg * 0.025 * 10) / 10,
          feedType: "Floating Starter Pellet",
          feedRatePercent: 2.5,
          fcr: 1.25,
        },
      ],
      healthRecords: [
        {
          id: "hr-" + Date.now(),
          date: formStockingDate,
          mortalityCount: 0,
          suspectedCause: "None",
          notes: "Initial stocking completed in healthy condition.",
          status: "Optimal",
        },
      ],
      createdAt: new Date().toISOString(),
    };

    const updated = [newBatch, ...batches];
    saveBatches(updated);

    // Reset & Close
    setIsAddWizardOpen(false);
    setWizardStep(1);
    setFormBatchName("");
    setFormSpeciesList([
      {
        id: "spec-init-1",
        speciesName: "Catla",
        quantity: 2000,
        initialWeightGrams: 50,
        currentWeightGrams: 50,
        targetWeightGrams: 1500,
      },
    ]);
  };

  // Delete Batch
  const handleDeleteBatch = (id: string) => {
    const updated = batches.filter((b) => b.id !== id);
    saveBatches(updated);
    if (selectedBatchForManage?.id === id) {
      setSelectedBatchForManage(null);
    }
    if (selectedBatchForAi?.id === id) {
      setSelectedBatchForAi(null);
    }
  };

  // Handle Batch AI Query
  const handleAskBatchAi = (queryText: string) => {
    if (!selectedBatchForAi) return;
    setIsAiLoading(true);
    setBatchAiQuery(queryText);

    setTimeout(() => {
      setIsAiLoading(false);
      const totalFish = getBatchTotalFish(selectedBatchForAi);
      const biomassKg = getBatchCurrentBiomassKg(selectedBatchForAi);
      const speciesNames = selectedBatchForAi.speciesList
        .map((s) => s.speciesName === "Others" && s.customName ? s.customName : s.speciesName)
        .join(", ");

      const lower = queryText.toLowerCase();

      if (lower.includes("cloud") || lower.includes("weather") || lower.includes("बादल")) {
        setBatchAiAnswer(
          lang === "hi"
            ? `आईसीएआर-सीआईएफए प्रोटोकॉल: बादल छाए रहने पर प्रकाश संश्लेषण घट जाता है जिससे तालाब में प्राकृतिक घुलित ऑक्सीजन गिर सकती है। इस ${selectedBatchForAi.name} बैच (${speciesNames}) के लिए, आज की आहार दर को तुरंत 25% से 30% घटाएं (सामान्य ${selectedBatchForAi.todayFeedKg} किग्रा से घटाकर ${(selectedBatchForAi.todayFeedKg * 0.75).toFixed(1)} किग्रा करें)। अतिरिक्त अनखाया आहार पानी की गुणवत्ता बिगाड़ सकता है।`
            : `ICAR-CIFA Protocol: During overcast/cloudy weather, algal photosynthesis drops, reducing natural Dissolved Oxygen. For this batch (${speciesNames}), immediately reduce feeding by 25%–30% (from ${selectedBatchForAi.todayFeedKg} kg down to ${(selectedBatchForAi.todayFeedKg * 0.75).toFixed(1)} kg). Uneaten feed will quickly decompose and escalate ammonia.`
        );
      } else if (lower.includes("oxygen") || lower.includes("do") || lower.includes("ऑक्सीजन")) {
        setBatchAiAnswer(
          lang === "hi"
            ? `घुलित ऑक्सीजन विश्लेषण: वर्तमान डीओ स्तर ${selectedBatchForAi.waterTelemetry.dissolvedOxygenMgL} मिग्रा/ली है। वर्तमान कुल बायोमास ${biomassKg.toFixed(0)} किग्रा (${totalFish.toLocaleString()} मछलियाँ) के लिए यह सुरक्षित व अनुशंसित सीमा (5.0–8.5 मिग्रा/ली) के भीतर है। रात्रि 03:00 बजे से प्रातः 06:00 बजे के बीच ऑक्सीजन न्यूनतम होती है, उस समय एरेटर स्टैंडबाय पर रखें।`
            : `Dissolved Oxygen Analysis: Current DO level is ${selectedBatchForAi.waterTelemetry.dissolvedOxygenMgL} mg/L. For your standing biomass of ${biomassKg.toFixed(0)} kg (${totalFish.toLocaleString()} fish), this is within the safe ICAR-CIFA optimal threshold (5.0–8.5 mg/L). Night-time hours (03:00 AM – 06:00 AM) experience the lowest DO; ensure mechanical aerators are primed.`
        );
      } else {
        setBatchAiAnswer(
          lang === "hi"
            ? `आईसीएआर-सीआईएफए वैज्ञानिक विश्लेषण: ${selectedBatchForAi.name} में ${speciesNames} की कुल संख्या ${totalFish.toLocaleString()} है और वर्तमान बायोमास ${biomassKg.toFixed(0)} किग्रा है। वर्तमान जल तापमान ${selectedBatchForAi.waterTelemetry.temperatureC}°C और पीएच ${selectedBatchForAi.waterTelemetry.pH} आदर्श जैविक दायरे में हैं। दैनिक आहार दर बायोमास का 2.3%–2.5% बनाए रखें और प्रत्येक 15 दिन में 25-30 मछलियों का शारीरिक भार नमूना लें।`
            : `ICAR-CIFA Scientific Assessment: Batch "${selectedBatchForAi.name}" contains ${totalFish.toLocaleString()} fish (${speciesNames}) with a total biomass of ${biomassKg.toFixed(0)} kg across ${selectedBatchForAi.pondAreaAcres} acres. Water temperature (${selectedBatchForAi.waterTelemetry.temperatureC}°C) and pH (${selectedBatchForAi.waterTelemetry.pH}) are within optimal physiological boundaries. Maintain feeding at 2.3%–2.5% of body weight and schedule weight sampling every 15 days.`
        );
      }
    }, 600);
  };

  // General AI Query Handler
  const handleAskGeneralAi = (question: string) => {
    setGeneralAiQuery(question);
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      setGeneralAiResponse(
        lang === "hi"
          ? `आईसीएआर-सीआईएफए दिशानिर्देश: भारतीय प्रमुख कार्प (रोहू, कतला, मृगल) के लिए मानक संचयन घनत्व 4,000 से 5,000 फिंगरलिंग्स प्रति एकड़ है। 30-35% कतला (सतह), 35-40% रोहू (मध्य स्तंभ), और 25-30% मृगल (तलहटी) का संतुलन प्राकृतिक पारिस्थितिक उपयोग को अधिकतम करता है और एफसीआर को 1.25–1.35 के बीच रखता है।`
          : `ICAR-CIFA Freshwater Guidance: Standard stocking density for Indian Major Carps (IMC) is 4,000 to 5,000 fingerlings per acre. The recommended composite ratio is 30–35% Catla (surface), 35–40% Rohu (column), and 25–30% Mrigal (bottom). This ecological stratification maximizes natural pond productivity and maintains an efficient FCR of 1.25–1.35.`
      );
    }, 500);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-600">
          {lang === "hi" ? "सत्र एवं मत्स्य पालन डेटा लोड हो रहा है..." : "Verifying session & loading fisheries hub..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col lg:flex-row">
      {/* ========================================================================= */}
      {/* 1. FIXED VERTICAL DESKTOP SIDEBAR (GREEN + WHITE ONLY)                    */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 fixed top-0 bottom-0 left-0 z-30 bg-white border-r border-emerald-200 select-none">
        {/* Brand */}
        <div className="h-20 px-5 flex items-center gap-3 border-b border-emerald-100">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-emerald-600/40 p-1">
              <Image
                src="/picandvideo/logo.png"
                alt="AgriFarmAssistant Logo"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-[#0F5132]">
                AgriFarmAssistant
              </span>
              <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
                Farm Management
              </span>
            </div>
          </Link>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <Link
            href="/dashboard"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0F5132] hover:bg-emerald-50 transition-colors"
          >
            <Home className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{lang === "hi" ? "होम (डैशबोर्ड)" : "Home"}</span>
          </Link>

          <Link
            href="/advisory"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0F5132] hover:bg-emerald-50 transition-colors"
          >
            <Bot className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{lang === "hi" ? "एआई सहायक" : "AI Assistant"}</span>
          </Link>

          {/* ACTIVE: Fisheries */}
          <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 text-[#0F5132] border-l-4 border-[#0F5132]">
            <div className="flex items-center gap-3">
              <Fish className="w-4 h-4 text-[#0F5132] shrink-0" />
              <span>{lang === "hi" ? "मत्स्य पालन" : "Fisheries"}</span>
            </div>
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-[#0F5132]">
              {batches.length}
            </span>
          </div>

          <Link
            href="/poultry"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0F5132] hover:bg-emerald-50 transition-colors"
          >
            <Feather className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{lang === "hi" ? "कुक्कुट पालन" : "Poultry"}</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0F5132] hover:bg-emerald-50 transition-colors"
          >
            <CloudSun className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{lang === "hi" ? "मौसम" : "Weather"}</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0F5132] hover:bg-emerald-50 transition-colors"
          >
            <Bell className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{lang === "hi" ? "अलर्ट्स" : "Alerts"}</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0F5132] hover:bg-emerald-50 transition-colors"
          >
            <Receipt className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{lang === "hi" ? "खर्च" : "Expense"}</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0F5132] hover:bg-emerald-50 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{lang === "hi" ? "सहायता" : "Help & Support"}</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0F5132] hover:bg-emerald-50 transition-colors"
          >
            <Settings className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{lang === "hi" ? "सेटिंग्स" : "Settings"}</span>
          </Link>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-emerald-100 space-y-2">
          <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#0F5132]">ICAR-CIFA Core v2.4</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          </div>
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <span>← {lang === "hi" ? "डैशबोर्ड पर लौटें" : "Back to Dashboard"}</span>
          </Link>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE TOP NAVIGATION & SLIDE DRAWER                                   */}
      {/* ========================================================================= */}
      <header className="lg:hidden sticky top-0 z-40 w-full bg-white border-b border-emerald-200 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Toggle navigation"
            className="p-2 rounded-lg border border-emerald-200 text-[#0F5132] hover:bg-emerald-50"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Fish className="w-5 h-5 text-[#0F5132]" />
            <span className="text-sm font-black text-[#0F5132]">
              {content.header.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            type="button"
            className="px-2.5 py-1 text-xs font-bold rounded-lg border border-emerald-200 text-[#0F5132] bg-emerald-50"
          >
            {lang === "en" ? "हिन्दी" : "EN"}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl p-4 flex flex-col justify-between z-10 border-r border-emerald-200">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-3">
                <div className="flex items-center gap-2">
                  <Fish className="w-5 h-5 text-[#0F5132]" />
                  <span className="font-extrabold text-sm text-[#0F5132]">
                    AgriFarmAssistant
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50"
                >
                  <Home className="w-4 h-4 text-emerald-700" />
                  <span>{lang === "hi" ? "होम (डैशबोर्ड)" : "Home"}</span>
                </Link>

                <div className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-[#0F5132] border-l-4 border-[#0F5132]">
                  <div className="flex items-center gap-3">
                    <Fish className="w-4 h-4 text-[#0F5132]" />
                    <span>{content.header.title}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#0F5132]">
                    {batches.length}
                  </span>
                </div>

                <Link
                  href="/poultry"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50"
                >
                  <Feather className="w-4 h-4 text-emerald-700" />
                  <span>{lang === "hi" ? "कुक्कुट पालन" : "Poultry"}</span>
                </Link>
              </nav>
            </div>

            <div className="pt-3 border-t border-emerald-100">
              <Link
                href="/dashboard"
                className="w-full block text-center py-2 text-xs font-bold text-[#0F5132] bg-emerald-50 rounded-xl"
              >
                ← {lang === "hi" ? "डैशबोर्ड पर लौटें" : "Back to Dashboard"}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT AREA (GREEN + WHITE ONLY)                                 */}
      {/* ========================================================================= */}
      <main className="flex-1 lg:pl-64 min-w-0 flex flex-col bg-white">
        {/* Top Header Bar */}
        <div className="w-full border-b border-emerald-200 bg-white px-4 sm:px-6 lg:px-8 py-5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {/* Small label with professional fish icon */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-[#0F5132] border border-emerald-200 mb-2">
                <Fish className="w-3.5 h-3.5 text-[#0F5132]" />
                <span>{content.header.moduleLabel}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F5132] tracking-tight">
                {content.header.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                {content.header.subtitle}
              </p>
            </div>

            {/* Language switch & Quick Action */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                type="button"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 text-xs font-bold text-[#0F5132] hover:bg-emerald-50 transition-colors"
              >
                <span>{lang === "en" ? "हिन्दी" : "English"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setWizardStep(1);
                  setIsAddWizardOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#0F5132] hover:bg-[#15803d] text-white shadow-xs transition-all active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>{content.batches.addBatchBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* ========================================================================= */}
          {/* A. FISHERIES AI ASSISTANT COMPACT CARD                                    */}
          {/* ========================================================================= */}
          <section>
            <div className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-emerald-50 text-[#0F5132] border border-emerald-200 shrink-0">
                  <Bot className="w-6 h-6 text-[#0F5132]" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#0F5132]">
                    {content.aiCard.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    {content.aiCard.description}
                  </p>
                </div>
              </div>

              <Link
                href="/advisory"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#0F5132] hover:bg-[#15803d] text-white shrink-0 shadow-xs transition-all"
              >
                <span>{content.aiCard.button}</span>
              </Link>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* B. MY BATCHES SECTION                                                     */}
          {/* ========================================================================= */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-black text-[#0F5132]">
                  {content.batches.title}
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-[#0F5132]">
                  {batches.length} {content.batches.totalLabel}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setWizardStep(1);
                  setIsAddWizardOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#0F5132] border border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{content.batches.addBatchBtn}</span>
              </button>
            </div>

            {/* Empty State */}
            {batches.length === 0 ? (
              <div className="p-8 sm:p-12 rounded-2xl bg-white border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#0F5132] flex items-center justify-center mx-auto">
                  <Fish className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#0F5132]">
                  {content.emptyState.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  {content.emptyState.description}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setWizardStep(1);
                      setIsAddWizardOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#0F5132] hover:bg-[#15803d] text-white"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{content.emptyState.button}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Batches Grid: Clean white cards with subtle green borders */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {batches.map((batch) => {
                  const totalFish = getBatchTotalFish(batch);
                  const currentBiomassKg = getBatchCurrentBiomassKg(batch);
                  const avgWeightGrams = getBatchAverageWeightGrams(batch);
                  const speciesNames = batch.speciesList
                    .map((s) => (s.speciesName === "Others" && s.customName ? s.customName : s.speciesName))
                    .join(", ");

                  return (
                    <div
                      key={batch.id}
                      className="p-5 sm:p-6 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 shadow-xs transition-all flex flex-col justify-between space-y-4"
                    >
                      {/* Top Header of Card */}
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                              <h3 className="text-base font-black text-[#0F5132] leading-snug">
                                {batch.name}
                              </h3>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
                              {batch.location} • {lang === "hi" ? "संचयन:" : "Stocked:"} {batch.stockingDate}
                            </span>
                          </div>

                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#0F5132] border border-emerald-200 shrink-0">
                            {batch.status === "Active"
                              ? content.batches.activeStatus
                              : content.batches.inactiveStatus}
                          </span>
                        </div>

                        {/* Batch Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-emerald-100">
                          {/* Pond Area */}
                          <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                            <span className="text-[10px] font-bold text-slate-500 block uppercase">
                              {content.batches.pondAreaLabel}
                            </span>
                            <span className="text-xs font-black text-[#0F5132] mt-0.5 block">
                              {batch.pondAreaAcres} {lang === "hi" ? "एकड़" : "Acres"}
                            </span>
                          </div>

                          {/* Species */}
                          <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 col-span-1 sm:col-span-2">
                            <span className="text-[10px] font-bold text-slate-500 block uppercase">
                              {content.batches.speciesLabel}
                            </span>
                            <span className="text-xs font-black text-[#0F5132] mt-0.5 block truncate">
                              {speciesNames}
                            </span>
                          </div>

                          {/* Fish Quantity */}
                          <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                            <span className="text-[10px] font-bold text-slate-500 block uppercase">
                              {content.batches.quantityLabel}
                            </span>
                            <span className="text-xs font-black text-slate-900 mt-0.5 block">
                              {totalFish.toLocaleString()}
                            </span>
                          </div>

                          {/* Average Weight */}
                          <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                            <span className="text-[10px] font-bold text-slate-500 block uppercase">
                              {content.batches.avgWeightLabel}
                            </span>
                            <span className="text-xs font-black text-slate-900 mt-0.5 block">
                              {avgWeightGrams} g
                            </span>
                          </div>

                          {/* Total Biomass */}
                          <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                            <span className="text-[10px] font-bold text-slate-500 block uppercase">
                              {content.batches.biomassLabel}
                            </span>
                            <span className="text-xs font-black text-[#0F5132] mt-0.5 block">
                              {Math.round(currentBiomassKg).toLocaleString()} kg
                            </span>
                          </div>
                        </div>

                        {/* Health Status & Telemetry Strip */}
                        <div className="mt-3 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#0F5132]" />
                            <span className="text-[11px] font-bold text-[#0F5132]">
                              {content.batches.healthStatusLabel}: {lang === "hi" ? "उत्कृष्ट (98.6% उत्तरजीविता)" : "Optimal (98.6% Survival)"}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-800">
                            DO: {batch.waterTelemetry.dissolvedOxygenMgL} mg/L • pH: {batch.waterTelemetry.pH}
                          </span>
                        </div>
                      </div>

                      {/* Card Action Buttons: Batch AI & Manage Batch */}
                      <div className="pt-3 border-t border-emerald-100 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBatchForAi(batch);
                            setBatchAiAnswer("");
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-white border border-[#0F5132] text-[#0F5132] hover:bg-emerald-50 transition-colors"
                        >
                          <Bot className="w-3.5 h-3.5 text-[#0F5132]" />
                          <span>{content.batches.btnBatchAi}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBatchForManage(batch);
                            setManageActiveTab("growth");
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-[#0F5132] hover:bg-[#15803d] text-white shadow-xs transition-colors"
                        >
                          <span>{content.batches.btnManageBatch}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* ========================================================================= */}
        {/* 4. MODAL: ADD NEW FISH BATCH (3-STEP WORKFLOW)                           */}
        {/* ========================================================================= */}
        {isAddWizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl border-2 border-emerald-300 shadow-2xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto">
              {/* Wizard Header */}
              <div className="flex items-center justify-between pb-4 border-b border-emerald-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-[#0F5132] border border-emerald-200">
                    <Fish className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#0F5132]">
                      {content.wizard.title}
                    </h3>
                    <span className="text-xs font-bold text-emerald-700">
                      {wizardStep === 1
                        ? content.wizard.step1Tab
                        : wizardStep === 2
                        ? content.wizard.step2Tab
                        : content.wizard.step3Tab}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddWizardOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Steps Indicators */}
              <div className="grid grid-cols-3 gap-2 my-4">
                <div
                  className={`py-1.5 text-center text-xs font-bold rounded-lg border transition-colors ${
                    wizardStep >= 1
                      ? "bg-emerald-50 text-[#0F5132] border-emerald-300"
                      : "bg-slate-50 text-slate-400 border-slate-200"
                  }`}
                >
                  {content.wizard.step1Tab}
                </div>
                <div
                  className={`py-1.5 text-center text-xs font-bold rounded-lg border transition-colors ${
                    wizardStep >= 2
                      ? "bg-emerald-50 text-[#0F5132] border-emerald-300"
                      : "bg-slate-50 text-slate-400 border-slate-200"
                  }`}
                >
                  {content.wizard.step2Tab}
                </div>
                <div
                  className={`py-1.5 text-center text-xs font-bold rounded-lg border transition-colors ${
                    wizardStep === 3
                      ? "bg-emerald-50 text-[#0F5132] border-emerald-300"
                      : "bg-slate-50 text-slate-400 border-slate-200"
                  }`}
                >
                  {content.wizard.step3Tab}
                </div>
              </div>

              <form onSubmit={handleCreateBatchSubmit} className="space-y-5">
                {/* STEP 1: BATCH & POND INFORMATION */}
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0F5132] mb-1">
                        {content.wizard.batchNameLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formBatchName}
                        onChange={(e) => setFormBatchName(e.target.value)}
                        placeholder={content.wizard.batchNamePlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0F5132] mb-1">
                          {content.wizard.stockingDateLabel} *
                        </label>
                        <input
                          type="date"
                          required
                          value={formStockingDate}
                          onChange={(e) => setFormStockingDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0F5132] mb-1">
                          {content.wizard.locationLabel} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          placeholder={content.wizard.locationPlaceholder}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0F5132] mb-1">
                          {content.wizard.pondSizeLabel} *
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          required
                          value={formPondArea}
                          onChange={(e) => setFormPondArea(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0F5132] mb-1">
                          {content.wizard.waterDepthLabel} *
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          required
                          value={formWaterDepth}
                          onChange={(e) => setFormWaterDepth(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (formBatchName.trim()) {
                            setWizardStep(2);
                          }
                        }}
                        disabled={!formBatchName.trim()}
                        className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-bold bg-[#0F5132] text-white disabled:opacity-50"
                      >
                        <span>{content.wizard.btnNext}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: SPECIES AND STOCKING INFORMATION */}
                {wizardStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        {content.wizard.step2Heading}
                      </span>
                      <button
                        type="button"
                        onClick={handleAddSpeciesRow}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#0F5132] bg-emerald-50 border border-emerald-300"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{content.wizard.btnAddSpecies}</span>
                      </button>
                    </div>

                    {/* Species list rows */}
                    <div className="space-y-3">
                      {formSpeciesList.map((item, idx) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-[#0F5132]">
                              #{idx + 1} {item.speciesName}
                            </span>
                            {formSpeciesList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSpeciesRow(item.id)}
                                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                              >
                                {content.wizard.btnRemoveSpecies}
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* 12 EXACT SPECIES DROPDOWN */}
                            <div>
                              <label className="block text-[11px] font-bold text-[#0F5132] mb-1">
                                {content.wizard.speciesSelectLabel}
                              </label>
                              <select
                                value={item.speciesName}
                                onChange={(e) =>
                                  handleUpdateSpeciesRow(
                                    item.id,
                                    "speciesName",
                                    e.target.value as FishSpeciesName
                                  )
                                }
                                className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-medium text-slate-900"
                              >
                                {EXACT_FISH_SPECIES.map((spec) => (
                                  <option key={spec} value={spec}>
                                    {spec}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Custom name if 'Others' is selected */}
                            {item.speciesName === "Others" && (
                              <div>
                                <label className="block text-[11px] font-bold text-[#0F5132] mb-1">
                                  {content.wizard.customSpeciesLabel} *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={item.customName || ""}
                                  onChange={(e) =>
                                    handleUpdateSpeciesRow(
                                      item.id,
                                      "customName",
                                      e.target.value
                                    )
                                  }
                                  placeholder={content.wizard.customSpeciesPlaceholder}
                                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-medium text-slate-900"
                                />
                              </div>
                            )}

                            {/* Quantity */}
                            <div>
                              <label className="block text-[11px] font-bold text-[#0F5132] mb-1">
                                {content.wizard.quantityLabel} *
                              </label>
                              <input
                                type="number"
                                min="1"
                                required
                                value={item.quantity}
                                onChange={(e) =>
                                  handleUpdateSpeciesRow(
                                    item.id,
                                    "quantity",
                                    Number(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-medium text-slate-900"
                              />
                            </div>

                            {/* Initial Weight */}
                            <div>
                              <label className="block text-[11px] font-bold text-[#0F5132] mb-1">
                                {content.wizard.initialWeightLabel} *
                              </label>
                              <input
                                type="number"
                                min="1"
                                required
                                value={item.initialWeightGrams}
                                onChange={(e) =>
                                  handleUpdateSpeciesRow(
                                    item.id,
                                    "initialWeightGrams",
                                    Number(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-medium text-slate-900"
                              />
                            </div>

                            {/* Current Weight */}
                            <div>
                              <label className="block text-[11px] font-bold text-[#0F5132] mb-1">
                                {content.wizard.currentWeightLabel} *
                              </label>
                              <input
                                type="number"
                                min="1"
                                required
                                value={item.currentWeightGrams}
                                onChange={(e) =>
                                  handleUpdateSpeciesRow(
                                    item.id,
                                    "currentWeightGrams",
                                    Number(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-medium text-slate-900"
                              />
                            </div>

                            {/* Target Weight */}
                            <div>
                              <label className="block text-[11px] font-bold text-[#0F5132] mb-1">
                                {content.wizard.targetWeightLabel} *
                              </label>
                              <input
                                type="number"
                                min="1"
                                required
                                value={item.targetWeightGrams}
                                onChange={(e) =>
                                  handleUpdateSpeciesRow(
                                    item.id,
                                    "targetWeightGrams",
                                    Number(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-medium text-slate-900"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <button
                        type="button"
                        onClick={() => setWizardStep(1)}
                        className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 bg-slate-100"
                      >
                        {content.wizard.btnBack}
                      </button>
                      <button
                        type="button"
                        onClick={() => setWizardStep(3)}
                        className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-bold bg-[#0F5132] text-white"
                      >
                        <span>{content.wizard.btnNext}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: BIOMASS REVIEW AND CONFIRMATION */}
                {wizardStep === 3 && (
                  <div className="space-y-4">
                    {/* Calculated Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          {content.wizard.totalStockedReview}
                        </span>
                        <span className="text-base font-black text-slate-900 mt-0.5 block">
                          {formTotalStocked.toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          {content.wizard.initialBiomassReview}
                        </span>
                        <span className="text-base font-black text-slate-900 mt-0.5 block">
                          {formInitialBiomassKg.toFixed(1)} kg
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                        <span className="text-[10px] font-bold text-[#0F5132] block uppercase">
                          {content.wizard.currentBiomassReview}
                        </span>
                        <span className="text-base font-black text-[#0F5132] mt-0.5 block">
                          {formCurrentBiomassKg.toFixed(1)} kg
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          {content.wizard.targetHarvestReview}
                        </span>
                        <span className="text-base font-black text-emerald-800 mt-0.5 block">
                          {formTargetHarvestKg.toFixed(1)} kg
                        </span>
                      </div>
                    </div>

                    {/* Species Composition Breakdown Table */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-[#0F5132]">
                        {content.wizard.speciesCompHeading}
                      </h4>
                      <div className="border border-emerald-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-emerald-50 text-[#0F5132] font-bold border-b border-emerald-200">
                            <tr>
                              <th className="p-2.5">{content.wizard.colSpecies}</th>
                              <th className="p-2.5">{content.wizard.colQuantity}</th>
                              <th className="p-2.5">{content.wizard.colAvgWeight}</th>
                              <th className="p-2.5">{content.wizard.colBiomass}</th>
                              <th className="p-2.5">{content.wizard.colTargetWeight}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-emerald-100">
                            {formSpeciesList.map((item) => {
                              const itemBiomass =
                                (Number(item.quantity) * Number(item.currentWeightGrams)) / 1000;
                              const displayName =
                                item.speciesName === "Others" && item.customName
                                  ? item.customName
                                  : item.speciesName;

                              return (
                                <tr key={item.id} className="hover:bg-emerald-50/30">
                                  <td className="p-2.5 font-bold text-slate-900">
                                    {displayName}
                                  </td>
                                  <td className="p-2.5 text-slate-700">
                                    {item.quantity.toLocaleString()}
                                  </td>
                                  <td className="p-2.5 text-slate-700">
                                    {item.currentWeightGrams} g
                                  </td>
                                  <td className="p-2.5 font-bold text-[#0F5132]">
                                    {itemBiomass.toFixed(1)} kg
                                  </td>
                                  <td className="p-2.5 text-emerald-800 font-semibold">
                                    {item.targetWeightGrams} g
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-between pt-3">
                      <button
                        type="button"
                        onClick={() => setWizardStep(2)}
                        className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 bg-slate-100"
                      >
                        {content.wizard.btnBack}
                      </button>

                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl text-xs font-bold bg-[#0F5132] hover:bg-[#15803d] text-white shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>{content.wizard.btnConfirm}</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. MODAL: MANAGE BATCH (GROWTH, WATER QUALITY, FEED, HEALTH)             */}
        {/* ========================================================================= */}
        {selectedBatchForManage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl border-2 border-emerald-300 shadow-2xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-emerald-200">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 text-[#0F5132] border border-emerald-200">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#0F5132]">
                        {selectedBatchForManage.name}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {content.details.title}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedBatchForManage(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 4 Tabs: Growth, Water Quality, Feed, Health */}
                <div className="grid grid-cols-4 gap-2 my-4">
                  {(["growth", "water", "feed", "health"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setManageActiveTab(tab)}
                      className={`py-2 text-center text-xs font-bold rounded-xl border transition-colors ${
                        manageActiveTab === tab
                          ? "bg-[#0F5132] text-white border-[#0F5132]"
                          : "bg-white text-slate-600 border-emerald-200 hover:bg-emerald-50"
                      }`}
                    >
                      {tab === "growth"
                        ? content.details.tabGrowth
                        : tab === "water"
                        ? content.details.tabWater
                        : tab === "feed"
                        ? content.details.tabFeed
                        : content.details.tabHealth}
                    </button>
                  ))}
                </div>

                {/* TAB 1: GROWTH */}
                {manageActiveTab === "growth" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          {content.details.currentAvgWeight}
                        </span>
                        <span className="text-lg font-black text-[#0F5132] mt-0.5 block">
                          {getBatchAverageWeightGrams(selectedBatchForManage)} g
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          {content.details.currentBiomass}
                        </span>
                        <span className="text-lg font-black text-[#0F5132] mt-0.5 block">
                          {getBatchCurrentBiomassKg(selectedBatchForManage).toFixed(1)} kg
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          {content.details.targetHarvestWeight}
                        </span>
                        <span className="text-lg font-black text-emerald-800 mt-0.5 block">
                          {getBatchTargetBiomassKg(selectedBatchForManage).toFixed(1)} kg
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">
                          {content.details.dwgLabel}
                        </span>
                        <span className="font-black text-[#0F5132]">+14.2 g / day</span>
                      </div>
                      <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: "72%" }} />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Specific Growth Rate (SGR): 1.84% / day • Within ICAR-CIFA carp baseline.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: WATER QUALITY */}
                {manageActiveTab === "water" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          {content.details.waterTemp}
                        </span>
                        <span className="text-lg font-black text-[#0F5132] mt-0.5 block">
                          {selectedBatchForManage.waterTelemetry.temperatureC} °C
                        </span>
                        <span className="text-[10px] text-emerald-700">
                          {content.details.optimalRange}: 26–32°C
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          {content.details.waterPh}
                        </span>
                        <span className="text-lg font-black text-[#0F5132] mt-0.5 block">
                          {selectedBatchForManage.waterTelemetry.pH}
                        </span>
                        <span className="text-[10px] text-emerald-700">
                          {content.details.optimalRange}: 6.8–8.2
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          {content.details.dissolvedOxygen}
                        </span>
                        <span className="text-lg font-black text-[#0F5132] mt-0.5 block">
                          {selectedBatchForManage.waterTelemetry.dissolvedOxygenMgL} mg/L
                        </span>
                        <span className="text-[10px] text-emerald-700">
                          {content.details.optimalRange}: 5.0–8.5 mg/L
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          {content.details.ammonia}
                        </span>
                        <span className="text-lg font-black text-[#0F5132] mt-0.5 block">
                          {selectedBatchForManage.waterTelemetry.ammoniaMgL} mg/L
                        </span>
                        <span className="text-[10px] text-emerald-700">
                          {content.details.optimalRange}: &lt; 0.02 mg/L
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: FEED */}
                {manageActiveTab === "feed" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          {content.details.todayFeed}
                        </span>
                        <span className="text-lg font-black text-[#0F5132] mt-0.5 block">
                          {selectedBatchForManage.todayFeedKg} kg
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          {content.details.feedConsumption}
                        </span>
                        <span className="text-lg font-black text-slate-900 mt-0.5 block">
                          {(selectedBatchForManage.todayFeedKg * 42).toFixed(0)} kg
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          Cumulative FCR
                        </span>
                        <span className="text-lg font-black text-[#0F5132] mt-0.5 block">
                          1.26
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#0F5132] block">
                        {content.details.feedingHistory}
                      </span>
                      <div className="divide-y divide-emerald-100 border border-emerald-200 rounded-xl overflow-hidden">
                        {selectedBatchForManage.feedingHistory.map((log) => (
                          <div
                            key={log.id}
                            className="p-3 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-bold text-slate-900 block">
                                {log.rationKg} kg • {log.feedType}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {log.date} at {log.time}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                              FCR {log.fcr}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: HEALTH */}
                {manageActiveTab === "health" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          {content.details.mortality}
                        </span>
                        <span className="text-lg font-black text-slate-900 mt-0.5 block">
                          {selectedBatchForManage.healthRecords.reduce(
                            (acc, h) => acc + h.mortalityCount,
                            0
                          )}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          {content.details.survivalRate}
                        </span>
                        <span className="text-lg font-black text-[#0F5132] mt-0.5 block">
                          98.6 %
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          {content.details.healthStatus}
                        </span>
                        <span className="text-lg font-black text-[#0F5132] mt-0.5 block">
                          Optimal
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#0F5132] block">
                        {content.details.healthRecords}
                      </span>
                      <div className="divide-y divide-emerald-100 border border-emerald-200 rounded-xl overflow-hidden">
                        {selectedBatchForManage.healthRecords.map((rec) => (
                          <div key={rec.id} className="p-3 space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">
                                {rec.date} • {rec.mortalityCount} mortalities
                              </span>
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-[#0F5132]">
                                {rec.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600">{rec.notes}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-emerald-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteBatch(selectedBatchForManage.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{lang === "hi" ? "बैच हटाएं" : "Delete Batch"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBatchForManage(null)}
                  className="py-2 px-5 rounded-xl text-xs font-bold bg-[#0F5132] text-white"
                >
                  {content.details.btnClose}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. MODAL: BATCH AI CONSULTATION (CONTEXTUAL TO SELECTED BATCH)            */}
        {/* ========================================================================= */}
        {selectedBatchForAi && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl border-2 border-emerald-300 shadow-2xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-[#0F5132] border border-emerald-200">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#0F5132]">
                      {content.batchAi.title}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {selectedBatchForAi.name}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBatchForAi(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Evaluation summary card */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
                <h4 className="font-black text-[#0F5132]">
                  {content.batchAi.evalTitle}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">{content.batchAi.stockingDensity}:</span>
                    <strong className="text-slate-900">
                      {Math.round(getBatchTotalFish(selectedBatchForAi) / selectedBatchForAi.pondAreaAcres)} fish / acre
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{content.batchAi.waterRiskCheck}:</span>
                    <strong className="text-[#0F5132]">
                      DO {selectedBatchForAi.waterTelemetry.dissolvedOxygenMgL} mg/L (Safe)
                    </strong>
                  </div>
                </div>
              </div>

              {/* Suggested Questions */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 block uppercase">
                  {content.batchAi.suggestedHeading}
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleAskBatchAi(content.batchAi.q1)}
                    className="text-left text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-[#0F5132] hover:bg-emerald-50 transition-colors"
                  >
                    {content.batchAi.q1}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAskBatchAi(content.batchAi.q2)}
                    className="text-left text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-[#0F5132] hover:bg-emerald-50 transition-colors"
                  >
                    {content.batchAi.q2}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAskBatchAi(content.batchAi.q3)}
                    className="text-left text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-[#0F5132] hover:bg-emerald-50 transition-colors"
                  >
                    {content.batchAi.q3}
                  </button>
                </div>
              </div>

              {/* Query Response */}
              {isAiLoading ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs font-bold text-[#0F5132]">
                  Generating ICAR-CIFA guidance...
                </div>
              ) : batchAiAnswer ? (
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-800 leading-relaxed space-y-1">
                  <span className="font-bold text-[#0F5132] block">
                    AI Guidance:
                  </span>
                  <p>{batchAiAnswer}</p>
                </div>
              ) : null}

              {/* Custom Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={batchAiQuery}
                  onChange={(e) => setBatchAiQuery(e.target.value)}
                  placeholder={content.batchAi.askAiPlaceholder}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
                <button
                  type="button"
                  onClick={() => handleAskBatchAi(batchAiQuery)}
                  disabled={!batchAiQuery.trim() || isAiLoading}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold bg-[#0F5132] text-white disabled:opacity-50"
                >
                  {content.batchAi.btnAsk}
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBatchForAi(null)}
                  className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-100 text-slate-700"
                >
                  {content.batchAi.btnClose}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. MODAL: GENERAL FISHERIES AI ASSISTANT                                  */}
        {/* ========================================================================= */}
        {isGeneralAiOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white rounded-3xl border-2 border-emerald-300 shadow-2xl p-5 sm:p-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#0F5132]" />
                  <h3 className="text-base font-black text-[#0F5132]">
                    {content.aiCard.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGeneralAiOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600">
                {content.aiCard.description}
              </p>

              {/* Sample Prompts */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  {lang === "hi" ? "त्वरित विषय चुनें:" : "Quick topics:"}
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleAskGeneralAi(
                        lang === "hi"
                          ? "मिश्रित कार्प पालन (IMC) का सही अनुपात क्या है?"
                          : "What is the standard polyculture ratio for Indian Major Carps?"
                      )
                    }
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-[#0F5132] border border-emerald-200 hover:bg-emerald-100"
                  >
                    {lang === "hi" ? "कार्प संचयन अनुपात" : "IMC Polyculture Ratio"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleAskGeneralAi(
                        lang === "hi"
                          ? "तालाब में घुलित ऑक्सीजन कैसे नियंत्रित करें?"
                          : "How to manage Dissolved Oxygen drops in nursery ponds?"
                      )
                    }
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-[#0F5132] border border-emerald-200 hover:bg-emerald-100"
                  >
                    {lang === "hi" ? "ऑक्सीजन प्रबंधन" : "Oxygen Management"}
                  </button>
                </div>
              </div>

              {generalAiResponse && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-slate-800 leading-relaxed">
                  <strong className="text-[#0F5132] block mb-1">
                    ICAR-CIFA Guidance:
                  </strong>
                  {generalAiResponse}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={generalAiQuery}
                  onChange={(e) => setGeneralAiQuery(e.target.value)}
                  placeholder={lang === "hi" ? "मत्स्य पालन संबंधी कोई भी प्रश्न लिखें..." : "Ask any fisheries farming question..."}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
                <button
                  type="button"
                  onClick={() => handleAskGeneralAi(generalAiQuery)}
                  disabled={!generalAiQuery.trim()}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold bg-[#0F5132] text-white disabled:opacity-50"
                >
                  {lang === "hi" ? "पूछें" : "Consult"}
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsGeneralAiOpen(false)}
                  className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-100 text-slate-700"
                >
                  {content.details.btnClose}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
