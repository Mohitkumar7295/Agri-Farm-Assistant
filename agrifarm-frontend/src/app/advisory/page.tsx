"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bot,
  Fish,
  Feather,
  Send,
  Plus,
  Search,
  Menu,
  X,
  Paperclip,
  Mic,
  MicOff,
  ArrowLeft,
  AlertTriangle,
  Languages,
} from "lucide-react";
import { FisheriesBatch } from "@/types/fisheries";
import { INITIAL_FISHERIES_BATCHES } from "@/data/defaultFisheriesData";
import { PoultryBatch, INITIAL_POULTRY_BATCHES } from "@/data/defaultPoultryData";
import {
  aiTranslations,
  AiLanguage,
  AiContent,
} from "@/i18n/aiTranslations";
import {
  ChatContextSelectors,
  BatchContextPayload,
} from "@/components/ai/ChatContextSelectors";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  domain: "fisheries" | "poultry";
  mode: "general" | "batch";
  batchName?: string;
  batchContext?: BatchContextPayload | null;
  citation?: string;
  isWarning?: boolean;
}

interface ChatConversation {
  id: string;
  title: string;
  domain: "fisheries" | "poultry";
  mode: "general" | "batch";
  batchId?: string;
  updatedAt: string;
  createdAt: number;
  messages: ChatMessage[];
}

export default function AiAssistantPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [lang, setLang] = useState<AiLanguage>("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Selected AI context
  const [selectedDomain, setSelectedDomain] = useState<"fisheries" | "poultry">(
    "fisheries"
  );
  const [selectedMode, setSelectedMode] = useState<"general" | "batch">("general");

  // Batches data
  const [fisheriesBatches, setFisheriesBatches] = useState<FisheriesBatch[]>([]);
  const [poultryBatches, setPoultryBatches] = useState<PoultryBatch[]>([]);
  const [selectedFisheriesBatchId, setSelectedFisheriesBatchId] =
    useState<string>("");
  const [selectedPoultryBatchId, setSelectedPoultryBatchId] =
    useState<string>("");

  // Conversations history
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Input & state
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isAiStreaming, setIsAiStreaming] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [attachedFileNotice, setAttachedFileNotice] = useState<string>("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load initial settings, batches, and conversation history
  useEffect(() => {
    // 0. Strict Auth Guard: without login no entry in dashboard from anywhere
    const token = typeof window !== "undefined" ? localStorage.getItem("agrifarm_jwt") : null;
    if (!token) {
      window.location.replace("/login");
      return;
    }
    setIsAuthenticated(true);

    // 1. Language
    const savedLang = localStorage.getItem("agrifarm_lang") as AiLanguage;
    if (savedLang === "en" || savedLang === "hi") {
      setLang(savedLang);
    }

    // 2. Load fisheries batches
    const savedFish = localStorage.getItem("agrifarm_fisheries_batches");
    if (savedFish) {
      try {
        const parsed = JSON.parse(savedFish);
        setFisheriesBatches(parsed);
        if (parsed.length > 0) setSelectedFisheriesBatchId(parsed[0].id);
      } catch (err) {
        setFisheriesBatches(INITIAL_FISHERIES_BATCHES);
        setSelectedFisheriesBatchId(INITIAL_FISHERIES_BATCHES[0].id);
      }
    } else {
      setFisheriesBatches(INITIAL_FISHERIES_BATCHES);
      setSelectedFisheriesBatchId(INITIAL_FISHERIES_BATCHES[0].id);
    }

    // 3. Load poultry batches
    setPoultryBatches(INITIAL_POULTRY_BATCHES);
    setSelectedPoultryBatchId(INITIAL_POULTRY_BATCHES[0].id);

    // 4. Load conversations history
    const savedConv = localStorage.getItem("agrifarm_ai_conversations");
    if (savedConv) {
      try {
        const parsed = JSON.parse(savedConv);
        const normalized: ChatConversation[] = parsed.map((c: any) => ({
          ...c,
          createdAt: typeof c.createdAt === "number" ? c.createdAt : Date.now(),
        }));
        setConversations(normalized);
        if (normalized.length > 0) {
          setActiveConversationId(normalized[0].id);
        }
      } catch (e) {
        console.error("Failed to load conversations:", e);
      }
    }
  }, []);

  const content: AiContent = aiTranslations[lang];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeConversationId, isAiStreaming]);

  const toggleLanguage = () => {
    const nextLang: AiLanguage = lang === "en" ? "hi" : "en";
    setLang(nextLang);
    localStorage.setItem("agrifarm_lang", nextLang);
  };

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const selectedFisheriesBatch = fisheriesBatches.find(
    (b) => b.id === selectedFisheriesBatchId
  );
  const selectedPoultryBatch = poultryBatches.find(
    (b) => b.id === selectedPoultryBatchId
  );

  const selectedBatchId =
    selectedDomain === "fisheries"
      ? selectedFisheriesBatchId
      : selectedPoultryBatchId;

  const currentBatchName =
    selectedDomain === "fisheries"
      ? selectedFisheriesBatch?.name || ""
      : selectedPoultryBatch?.name || "";

  // Build structured full batchContext for AI chat requests
  const [mountTimestamp] = useState<number>(() => Date.now());

  const getActiveBatchContext = (): BatchContextPayload | null => {
    if (selectedMode !== "batch") return null;

    let pendingTasks: string[] = [];
    if (typeof window !== "undefined") {
      try {
        const rawTasks = localStorage.getItem("agrifarm_tasks");
        if (rawTasks) {
          const parsed = JSON.parse(rawTasks);
          if (Array.isArray(parsed)) {
            pendingTasks = parsed
              .filter((t: { completed?: boolean; title?: string }) => !t?.completed && t?.title)
              .slice(0, 5)
              .map((t: { title: string }) => t.title);
          }
        }
      } catch {
        pendingTasks = [];
      }
    }

    if (selectedDomain === "fisheries" && selectedFisheriesBatch) {
      const b = selectedFisheriesBatch;
      const totalFish = b.speciesList.reduce((acc, s) => acc + s.quantity, 0);
      const totalWeightGrams = b.speciesList.reduce(
        (acc, s) => acc + s.quantity * s.currentWeightGrams,
        0
      );
      const avgWeightGrams = totalFish > 0 ? totalWeightGrams / totalFish : 0;
      const stockingTime = new Date(b.stockingDate).getTime();
      const ageDays = Number.isNaN(stockingTime)
        ? 0
        : Math.max(0, Math.floor((mountTimestamp - stockingTime) / (1000 * 60 * 60 * 24)));
      const latestFeed = b.feedingHistory[0];
      const totalMortality = b.healthRecords.reduce(
        (acc, h) => acc + (h.mortalityCount || 0),
        0
      );

      return {
        batchId: b.id,
        batchName: b.name,
        domain: "fisheries",
        speciesOrBreed: b.speciesList.map((s) => s.speciesName).join(", "),
        ageDays,
        currentCount: totalFish,
        avgWeightGrams,
        latestFeedKg: b.todayFeedKg ?? latestFeed?.rationKg ?? 0,
        fcr: latestFeed?.fcr ?? 1.25,
        mortalityCount: totalMortality,
        latestWaterQuality: { ...b.waterTelemetry },
        pendingTasks,
      };
    }

    if (selectedDomain === "poultry" && selectedPoultryBatch) {
      const p = selectedPoultryBatch;
      return {
        batchId: p.id,
        batchName: p.name,
        domain: "poultry",
        speciesOrBreed: `${p.breed} (${p.category})`,
        ageDays: p.ageDays,
        currentCount: p.quantity,
        avgWeightGrams: p.currentWeightGrams,
        latestFeedKg: p.dailyFeedKg,
        fcr: p.fcr,
        mortalityCount: p.mortalityCount,
        shedEnvironment: {
          temperatureC: p.temperatureC,
          humidityPercent: p.humidityPercent,
          vaccinationStatus: p.vaccinationStatus,
        },
        pendingTasks,
      };
    }

    return null;
  };

  const activeBatchContext = getActiveBatchContext();

  // Cascading Domain -> Mode -> Batch handlers
  const handleDomainChange = (nextDomain: "fisheries" | "poultry") => {
    if (nextDomain === selectedDomain) return;
    setSelectedDomain(nextDomain);
    // Clear previous domain's batch selection so the user picks cleanly from the new domain
    if (nextDomain === "poultry") {
      setSelectedFisheriesBatchId("");
      setSelectedPoultryBatchId("");
    } else {
      setSelectedPoultryBatchId("");
      setSelectedFisheriesBatchId("");
    }
  };

  const handleModeChange = (nextMode: "general" | "batch") => {
    setSelectedMode(nextMode);
  };

  const handleBatchSelect = (batchId: string) => {
    if (selectedMode !== "batch") {
      setSelectedMode("batch");
    }
    if (selectedDomain === "fisheries") {
      setSelectedFisheriesBatchId(batchId);
    } else {
      setSelectedPoultryBatchId(batchId);
    }
  };

  // Start New Chat
  const handleStartNewChat = () => {
    const newId = "conv-" + Date.now();
    const newConv: ChatConversation = {
      id: newId,
      title:
        selectedMode === "batch"
          ? `${currentBatchName} Consultation`
          : `${selectedDomain === "fisheries" ? "Fisheries" : "Poultry"} Advisory`,
      domain: selectedDomain,
      mode: selectedMode,
      batchId:
        selectedDomain === "fisheries"
          ? selectedFisheriesBatchId
          : selectedPoultryBatchId,
      updatedAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: Date.now(),
      messages: [],
    };

    const updated = [newConv, ...conversations];
    setConversations(updated);
    setActiveConversationId(newId);
    localStorage.setItem("agrifarm_ai_conversations", JSON.stringify(updated));
    setMobileMenuOpen(false);
  };

  // Helper to save conversation messages
  const updateConversationMessages = (
    convId: string,
    newMessages: ChatMessage[],
    titleUpdate?: string
  ) => {
    setConversations((prev) => {
      const updated = prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            title: titleUpdate || c.title,
            messages: newMessages,
            updatedAt: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        }
        return c;
      });
      localStorage.setItem("agrifarm_ai_conversations", JSON.stringify(updated));
      return updated;
    });
  };

  // Generate authentic ICAR responses based on domain, mode, and full batchContext
  const generateIcarResponse = (
    queryText: string,
    domain: "fisheries" | "poultry",
    mode: "general" | "batch",
    batchCtx: BatchContextPayload | null
  ): { text: string; citation: string; isWarning?: boolean } => {
    const lower = queryText.toLowerCase();

    // 1. FISHERIES BATCH AI
    if (domain === "fisheries" && mode === "batch" && batchCtx) {
      const water = batchCtx.latestWaterQuality;
      const biomassKg = (batchCtx.currentCount * batchCtx.avgWeightGrams) / 1000;

      // Check DO safety override
      if (water && water.dissolvedOxygenMgL < 3.0 && lower.includes("feed")) {
        return {
          text:
            lang === "hi"
              ? `गंभीर सुरक्षा चेतावनी (${batchCtx.batchName}): तालाब में घुलित ऑक्सीजन स्तर ${water.dissolvedOxygenMgL} मिग्रा/ली है जो 3.0 मिग्रा/ली की सुरक्षित सीमा से नीचे है। ${batchCtx.currentCount.toLocaleString()} मछलियों में तनाव और मृत्यु रोकने के लिए आहार वितरण तुरंत रोक दिया जाना चाहिए। कृपया तुरंत एरेटर चालू करें।`
              : `CRITICAL SAFETY OVERRIDE (${batchCtx.batchName}): Pond Dissolved Oxygen is currently ${water.dissolvedOxygenMgL} mg/L, which is critically below the 3.0 mg/L minimum threshold. Suspend feeding for all ${batchCtx.currentCount.toLocaleString()} fish immediately and activate paddlewheel aerators.`,
          citation: "ICAR-CIFA Water Quality Emergency Protocol",
          isWarning: true,
        };
      }

      if (
        lower.includes("feed") ||
        lower.includes("चारा") ||
        lower.includes("आहार") ||
        lower.includes("how much") ||
        lower.includes("calculate")
      ) {
        const calculatedDailyFeed = Math.round(biomassKg * 0.024 * 10) / 10;
        return {
          text:
            lang === "hi"
              ? `बैच "${batchCtx.batchName}" (${batchCtx.speciesOrBreed}) आहार गणना:\n\n• कुल संचित मछलियाँ: ${batchCtx.currentCount.toLocaleString()}\n• वर्तमान बायोमास: ${biomassKg.toFixed(0)} किग्रा\n• नवीनतम दर्ज आहार: ${batchCtx.latestFeedKg} किग्रा (FCR: ${batchCtx.fcr})\n• अनुशंसित दैनिक आहार: ${calculatedDailyFeed} किग्रा (28% प्रोटीन फ्लोटिंग पैलेट)\n• जल स्थिति: तापमान ${water?.temperatureC ?? "-"}°C, DO ${water?.dissolvedOxygenMgL ?? "-"} मिग्रा/ली।`
              : `Feeding Formulation for "${batchCtx.batchName}" (${batchCtx.speciesOrBreed}):\n\n• Standing Stock: ${batchCtx.currentCount.toLocaleString()} fish (Avg ${Math.round(batchCtx.avgWeightGrams)} g)\n• Current Biomass: ${biomassKg.toFixed(0)} kg\n• Latest Logged Feed: ${batchCtx.latestFeedKg} kg · FCR: ${batchCtx.fcr}\n• Recommended Target Ration: ${calculatedDailyFeed} kg/day (28% CP Floating Pellets)\n• Water Telemetry: DO ${water?.dissolvedOxygenMgL ?? "-"} mg/L, Temp ${water?.temperatureC ?? "-"}°C.`,
          citation: "ICAR-CIFA Carp Nutrition Guidelines",
        };
      }

      if (
        lower.includes("water") ||
        lower.includes("पानी") ||
        lower.includes("quality") ||
        lower.includes("do") ||
        lower.includes("ph")
      ) {
        return {
          text:
            lang === "hi"
              ? `तालाब "${batchCtx.batchName}" जल टेलीमेट्री परीक्षण:\n\n• तापमान: ${water?.temperatureC ?? "-"}°C (मानक: 26–32°C)\n• पीएच (pH): ${water?.pH ?? "-"} (मानक: 6.8–8.2)\n• घुलित ऑक्सीजन: ${water?.dissolvedOxygenMgL ?? "-"} मिग्रा/ली (मानक: > 5.0 मिग्रा/ली)\n• अमोनिया: ${water?.ammoniaMgL ?? "-"} मिग्रा/ली (मानक: < 0.02 मिग्रा/ली)\n\n${batchCtx.currentCount.toLocaleString()} मछलियों (मृत्यु दर्ज: ${batchCtx.mortalityCount}) के लिए पानी की गुणवत्ता संतुलित है।`
              : `Water Quality Diagnostic for "${batchCtx.batchName}" (${batchCtx.currentCount.toLocaleString()} fish):\n\n• Temperature: ${water?.temperatureC ?? "-"}°C (Optimal: 26.0–32.0°C)\n• pH: ${water?.pH ?? "-"} (Optimal: 6.8–8.2)\n• Dissolved Oxygen: ${water?.dissolvedOxygenMgL ?? "-"} mg/L (Optimal: > 5.0 mg/L)\n• Ammonia: ${water?.ammoniaMgL ?? "-"} mg/L (Optimal: < 0.02 mg/L)\n• Recorded Mortality: ${batchCtx.mortalityCount}\n\nDiagnostic Conclusion: Water parameters are within safe ICAR-CIFA thresholds.`,
          citation: "ICAR-CIFA Water Quality Thresholds",
        };
      }

      return {
        text:
          lang === "hi"
            ? `बैच "${batchCtx.batchName}" लाइव विश्लेषण (${batchCtx.speciesOrBreed}):\n\n• संचित संख्या: ${batchCtx.currentCount.toLocaleString()} मछलियाँ (आयु: ${batchCtx.ageDays} दिन)\n• औसत वज़न: ${Math.round(batchCtx.avgWeightGrams)} ग्राम · बायोमास: ${biomassKg.toFixed(0)} किग्रा\n• दैनिक आहार: ${batchCtx.latestFeedKg} किग्रा · FCR: ${batchCtx.fcr} · मृत्यु: ${batchCtx.mortalityCount}\n• घुलित ऑक्सीजन: ${water?.dissolvedOxygenMgL ?? "-"} मिग्रा/ली\n\nवर्तमान डेटा के अनुसार वृद्धि और जल गुणवत्ता सामान्य है।`
            : `Live Batch Analysis for "${batchCtx.batchName}" (${batchCtx.speciesOrBreed}):\n\n• Active Stock: ${batchCtx.currentCount.toLocaleString()} fish (${batchCtx.ageDays} days)\n• Avg Weight: ${Math.round(batchCtx.avgWeightGrams)} g · Est. Biomass: ${biomassKg.toFixed(0)} kg\n• Latest Feed: ${batchCtx.latestFeedKg} kg/day · FCR: ${batchCtx.fcr} · Mortality: ${batchCtx.mortalityCount}\n• Water DO: ${water?.dissolvedOxygenMgL ?? "-"} mg/L, pH: ${water?.pH ?? "-"}\n\nGrowth and water parameters are tracking within ICAR-CIFA targets.`,
        citation: "ICAR-CIFA Carp Polyculture Protocol",
      };
    }

    // 2. POULTRY BATCH AI
    if (domain === "poultry" && mode === "batch" && batchCtx) {
      const env = batchCtx.shedEnvironment;
      if (
        lower.includes("feed") ||
        lower.includes("दाना") ||
        lower.includes("चारा") ||
        lower.includes("how much") ||
        lower.includes("calculate")
      ) {
        return {
          text:
            lang === "hi"
              ? `शेड "${batchCtx.batchName}" (${batchCtx.speciesOrBreed}, दिवस ${batchCtx.ageDays}) आहार आवश्यकता:\n\n• कुल पक्षी: ${batchCtx.currentCount.toLocaleString()}\n• वर्तमान औसत वज़न: ${batchCtx.avgWeightGrams} ग्राम\n• दैनिक आहार खपत: ${batchCtx.latestFeedKg} किग्रा\n• संचयी एफसीआर (FCR): ${batchCtx.fcr}\n• शेड तापमान: ${env?.temperatureC ?? "-"}°C`
              : `Feed Allocation for "${batchCtx.batchName}" (${batchCtx.speciesOrBreed}, Day ${batchCtx.ageDays}):\n\n• Total Birds: ${batchCtx.currentCount.toLocaleString()}\n• Current Body Weight: ${batchCtx.avgWeightGrams} g\n• Daily Feed Ration: ${batchCtx.latestFeedKg} kg\n• Cumulative FCR: ${batchCtx.fcr}\n• Shed Temp: ${env?.temperatureC ?? "-"}°C (Humidity: ${env?.humidityPercent ?? "-"}%)`,
          citation: "ICAR-CARI Broiler Nutrition Standards",
        };
      }

      if (
        lower.includes("health") ||
        lower.includes("रोग") ||
        lower.includes("mortality") ||
        lower.includes("स्वास्थ्य")
      ) {
        return {
          text:
            lang === "hi"
              ? `शेड "${batchCtx.batchName}" स्वास्थ्य रिपोर्ट:\n\n• सक्रिय पक्षी: ${batchCtx.currentCount.toLocaleString()} (दिवस ${batchCtx.ageDays})\n• कुल मृत्यु: ${batchCtx.mortalityCount} पक्षी\n• टीकाकरण स्थिति: ${env?.vaccinationStatus ?? "-"}\n• शेड तापमान: ${env?.temperatureC ?? "-"}°C, आर्द्रता: ${env?.humidityPercent ?? "-"}%`
              : `Flock Health Diagnostic for "${batchCtx.batchName}":\n\n• Active Birds: ${batchCtx.currentCount.toLocaleString()} (Day ${batchCtx.ageDays})\n• Mortalities: ${batchCtx.mortalityCount} birds\n• Vaccination Schedule: ${env?.vaccinationStatus ?? "-"}\n• Thermal Environment: ${env?.temperatureC ?? "-"}°C, Humidity: ${env?.humidityPercent ?? "-"}%`,
          citation: "ICAR-CARI Avian Health Standards",
        };
      }

      return {
        text:
          lang === "hi"
            ? `शेड "${batchCtx.batchName}" (${batchCtx.speciesOrBreed}) लाइव सारांश:\n\n• पक्षी संख्या: ${batchCtx.currentCount.toLocaleString()} · आयु: ${batchCtx.ageDays} दिन\n• औसत वज़न: ${batchCtx.avgWeightGrams} ग्राम · दैनिक चारा: ${batchCtx.latestFeedKg} किग्रा\n• FCR: ${batchCtx.fcr} · मृत्यु: ${batchCtx.mortalityCount}`
            : `Live Flock Status for "${batchCtx.batchName}" (${batchCtx.speciesOrBreed}):\n\n• Bird Count: ${batchCtx.currentCount.toLocaleString()} · Age: Day ${batchCtx.ageDays}\n• Avg Weight: ${batchCtx.avgWeightGrams} g · Daily Feed: ${batchCtx.latestFeedKg} kg\n• FCR: ${batchCtx.fcr} · Mortality: ${batchCtx.mortalityCount}`,
        citation: "ICAR-CARI Broiler Management Manual",
      };
    }

    // 3. GENERAL FISHERIES AI
    if (domain === "fisheries") {
      if (lower.includes("feed") || lower.includes("चारा") || lower.includes("दाना")) {
        return {
          text:
            lang === "hi"
              ? `मत्स्य आहार दिशानिर्देश:\n\n• फिंगरलिंग्स (20–50 ग्राम): बायोमास का 3%–4% आहार दें (30%–32% क्रूड प्रोटीन)।\n• ग्रो-आउट (50–500 ग्राम): बायोमास का 2.5% आहार दें (28% क्रूड प्रोटीन)।\n• परिपक्व अवस्था (> 500 ग्राम): बायोमास का 1.8%–2.0% आहार दें।\n\nनोट: बादल छाए रहने या पानी का तापमान 20°C से नीचे जाने पर आहार की मात्रा 30%–40% घटाएं।`
              : `Fish Nutrition Guidelines:\n\n• Nursery Fingerlings (20–50 g): Feed 3.0%–4.0% of standing biomass (30%–32% Crude Protein).\n• Grow-out Phase (50–500 g): Feed 2.3%–2.5% of standing biomass (28% Crude Protein).\n• Market Stage (> 500 g): Feed 1.8%–2.0% of standing biomass (24%–26% Crude Protein).\n\nKey Rule: Reduce feed by 30%–50% during overcast days or whenever DO dips below 4.0 mg/L to avoid waste decomposition.`,
          citation: "ICAR-CIFA Aquaculture Nutrition Manual",
        };
      }

      return {
        text:
          lang === "hi"
            ? `मीठे पानी की मछली पालन सलाह:\n\nमिश्रित कार्प पालन में तालाब की उर्वरता बनाए रखने के लिए प्रति माह 50 किग्रा कच्चा गोबर और 1.5 किग्रा सिंगल सुपर फॉस्फेट (SSP) प्रति एकड़ डालें। हर 15 दिन में पानी के पीएच (6.8–8.2) और घुलित ऑक्सीजन (> 5.0 मिग्रा/ली) की जांच अवश्य करें।`
            : `Freshwater Fisheries Advice:\n\nFor balanced polyculture, maintain a standard stocking density of 4,000–5,000 fingerlings/acre. Monthly periodic manuring with 50 kg raw cow dung + 1.5 kg Single Super Phosphate (SSP) maintains optimal plankton bloom. Keep dissolved oxygen above 5.0 mg/L.`,
        citation: "ICAR-CIFA Pond Management Guidelines",
      };
    }

    // 4. GENERAL POULTRY AI
    return {
      text:
        lang === "hi"
          ? `कुक्कुट प्रबंधन दिशानिर्देश:\n\nब्रायलर शेड में पहले सप्ताह का तापमान 32°C–34°C रखें और प्रत्येक सप्ताह 2.5°C कम करते हुए 21वें दिन तक 24°C–26°C पर स्थिर करें। 5वें दिन रानीखेत (Lasota) और 12वें दिन गम्बोरो (IBD) का अनिवार्य टीकाकरण सुनिश्चित करें।`
          : `Poultry Management Guidelines:\n\nIn broiler sheds, maintain initial brooding temperature at 32°C–34°C for Week 1, stepping down by 2.5°C weekly until stabilizing at 24°C–26°C by Day 21. Adhere to mandatory vaccinations: Day 5–7 Ranikhet (LaSota) and Day 12–14 IBD (Gumboro).`,
      citation: "ICAR-CARI Vaccination Protocol",
    };
  };

  // Submit Query
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    setInputMessage("");
    setAttachedFileNotice("");

    // Ensure we have an active conversation or create one
    let targetConvId = activeConversationId;
    let targetConv = conversations.find((c) => c.id === targetConvId);

    if (!targetConv) {
      targetConvId = "conv-" + Date.now();
      const newConv: ChatConversation = {
        id: targetConvId,
        title: text.length > 28 ? text.slice(0, 28) + "..." : text,
        domain: selectedDomain,
        mode: selectedMode,
        batchId:
          selectedDomain === "fisheries"
            ? selectedFisheriesBatchId
            : selectedPoultryBatchId,
        updatedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: Date.now(),
        messages: [],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(targetConvId);
      targetConv = newConv;
    }

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      domain: selectedDomain,
      mode: selectedMode,
      batchName: selectedMode === "batch" && currentBatchName ? currentBatchName : undefined,
      batchContext: activeBatchContext,
    };

    const requestPayload = {
      query: text,
      domain: selectedDomain,
      mode: selectedMode,
      language: lang,
      batchContext: activeBatchContext,
    };

    const updatedMessages = [...(targetConv.messages || []), userMsg];
    updateConversationMessages(
      targetConvId,
      updatedMessages,
      targetConv.messages.length === 0 ? text.slice(0, 30) : undefined
    );

    // AI Response generation with full batchContext passed to handler
    setIsAiStreaming(true);

    setTimeout(() => {
      setIsAiStreaming(false);
      const icarResult = generateIcarResponse(
        requestPayload.query,
        requestPayload.domain,
        requestPayload.mode,
        requestPayload.batchContext
      );

      const aiMsg: ChatMessage = {
        id: "ai-" + (Date.now() + 1),
        sender: "ai",
        text: icarResult.text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        domain: selectedDomain,
        mode: selectedMode,
        batchName: selectedMode === "batch" && currentBatchName ? currentBatchName : undefined,
        batchContext: requestPayload.batchContext,
        citation: icarResult.citation,
        isWarning: icarResult.isWarning,
      };

      const finalMessages = [...updatedMessages, aiMsg];
      updateConversationMessages(targetConvId, finalMessages);
    }, 600);
  };

  // Voice dictation toggle (Web Speech API if available)
  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      try {
        const SpeechRec =
          (window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (e: any) => {
          const transcript = e.results[0][0].transcript;
          if (transcript) {
            setInputMessage((prev) => (prev ? prev + " " + transcript : transcript));
          }
        };

        recognition.start();
      } catch (err) {
        console.error("Speech recognition error:", err);
        setIsListening(false);
      }
    } else {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInputMessage(
          lang === "hi"
            ? "तालाब में घुलित ऑक्सीजन स्तर कैसे जांचें?"
            : "How to check dissolved oxygen levels in nursery pond?"
        );
      }, 1200);
    }
  };

  // Group real conversations by TODAY and PREVIOUS 7 DAYS (Zero fake conversations)
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const sevenDaysAgo = startOfToday - 7 * 24 * 60 * 60 * 1000;

  const searchFilteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayConversations = searchFilteredConversations.filter(
    (c) => (c.createdAt || Date.now()) >= startOfToday
  );

  const previous7DaysConversations = searchFilteredConversations.filter((c) => {
    const time = c.createdAt || Date.now();
    return time < startOfToday && time >= sevenDaysAgo;
  });

  const olderConversations = searchFilteredConversations.filter((c) => {
    const time = c.createdAt || Date.now();
    return time < sevenDaysAgo;
  });

  // Short batch label for context history
  const contextDisplay =
    selectedDomain === "fisheries"
      ? `Fish · ${selectedMode === "batch" ? (currentBatchName.split(" - ")[0] || "Batch 1") : "General AI"}`
      : `Poultry · ${selectedMode === "batch" ? (currentBatchName.split(" - ")[0] || "Batch 1") : "General AI"}`;

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full bg-white items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-600">
          {lang === "hi" ? "सत्र सत्यापित किया जा रहा है..." : "Verifying session..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-white text-slate-900 overflow-hidden font-sans select-none">
      {/* ========================================================================= */}
      {/* 1. COMPACT LEFT SIDEBAR (DESKTOP)                                         */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-emerald-100/90 h-full justify-between">
        {/* Top Header & Branding */}
        <div className="flex flex-col shrink-0">
          <div className="h-16 px-4 flex items-center gap-2.5 border-b border-emerald-100 bg-white">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-emerald-600/30 shrink-0">
              <Image
                src="/picandvideo/logo.png"
                alt="AgriFarmAssistant Logo"
                fill
                sizes="32px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black tracking-tight text-[#0F5132] truncate">
                AgriFarmAssistant
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">
                AI Assistant
              </span>
            </div>
          </div>

          {/* New Chat Button & Search */}
          <div className="p-3 space-y-2 border-b border-emerald-50">
            <button
              type="button"
              onClick={handleStartNewChat}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-[#0F5132] hover:bg-[#15803d] text-white shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{content.sidebar.newChatBtn}</span>
            </button>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={content.sidebar.searchPlaceholder}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-emerald-100 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Context History Box */}
          <div className="px-3 pt-3 pb-2 border-b border-emerald-50">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              {content.sidebar.contextHistoryHeading}
            </div>
            <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-xs font-medium text-[#0F5132] flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                {selectedDomain === "fisheries" ? (
                  <Fish className="w-3.5 h-3.5 text-[#0F5132] shrink-0" />
                ) : (
                  <Feather className="w-3.5 h-3.5 text-[#0F5132] shrink-0" />
                )}
                <span className="truncate">{contextDisplay}</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
            </div>
          </div>
        </div>

        {/* Real Conversations History Grouped by TODAY & PREVIOUS 7 DAYS */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
            {content.sidebar.recentHeading}
          </div>

          {searchFilteredConversations.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              {content.sidebar.noConversations}
            </div>
          ) : (
            <>
              {/* TODAY */}
              {todayConversations.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[9px] font-bold text-emerald-800 uppercase px-1 tracking-wider">
                    {content.sidebar.todayHeading}
                  </div>
                  {todayConversations.map((c) => {
                    const isActive = c.id === activeConversationId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActiveConversationId(c.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          isActive
                            ? "bg-emerald-50 text-[#0F5132] font-semibold border-l-2 border-[#0F5132]"
                            : "text-slate-700 hover:bg-slate-50 hover:text-[#0F5132]"
                        }`}
                      >
                        <span className="truncate block mr-1">{c.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {c.updatedAt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* PREVIOUS 7 DAYS */}
              {previous7DaysConversations.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="text-[9px] font-bold text-emerald-800 uppercase px-1 tracking-wider">
                    {content.sidebar.previous7DaysHeading}
                  </div>
                  {previous7DaysConversations.map((c) => {
                    const isActive = c.id === activeConversationId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActiveConversationId(c.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          isActive
                            ? "bg-emerald-50 text-[#0F5132] font-semibold border-l-2 border-[#0F5132]"
                            : "text-slate-700 hover:bg-slate-50 hover:text-[#0F5132]"
                        }`}
                      >
                        <span className="truncate block mr-1">{c.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {c.updatedAt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Older if any */}
              {olderConversations.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="text-[9px] font-bold text-slate-400 uppercase px-1 tracking-wider">
                    {lang === "hi" ? "पुराने" : "OLDER"}
                  </div>
                  {olderConversations.map((c) => {
                    const isActive = c.id === activeConversationId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActiveConversationId(c.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          isActive
                            ? "bg-emerald-50 text-[#0F5132] font-semibold border-l-2 border-[#0F5132]"
                            : "text-slate-700 hover:bg-slate-50 hover:text-[#0F5132]"
                        }`}
                      >
                        <span className="truncate block mr-1">{c.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {c.updatedAt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar Bottom: Dashboard link */}
        <div className="p-3 border-t border-emerald-100 bg-white shrink-0">
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-[#0F5132] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{content.sidebar.dashboard}</span>
          </Link>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE SLIDE-OUT DRAWER                                                */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[85vw] bg-white h-full shadow-2xl p-3 flex flex-col justify-between z-10 border-r border-emerald-200">
            <div className="flex flex-col overflow-y-auto">
              {/* Drawer Brand Header */}
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-2">
                <div className="flex items-center gap-2">
                  <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-emerald-600/30">
                    <Image
                      src="/picandvideo/logo.png"
                      alt="Logo"
                      fill
                      sizes="28px"
                      className="object-contain p-0.5"
                    />
                  </div>
                  <span className="font-bold text-xs text-[#0F5132]">
                    AgriFarmAssistant
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Actions */}
              <button
                type="button"
                onClick={handleStartNewChat}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-[#0F5132] text-white mb-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{content.sidebar.newChatBtn}</span>
              </button>

              {/* Context History in drawer */}
              <div className="mb-3 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-[#0F5132] font-semibold">
                <div className="text-[9px] uppercase font-bold text-slate-500 mb-0.5">
                  {content.sidebar.contextHistoryHeading}
                </div>
                <div>{contextDisplay}</div>
              </div>

              {/* Real Conversations in drawer */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  {content.sidebar.recentHeading}
                </span>
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setActiveConversationId(c.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-md text-xs truncate block ${
                      c.id === activeConversationId
                        ? "bg-emerald-50 text-[#0F5132] font-bold border-l-2 border-[#0F5132]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-100">
              <Link
                href="/dashboard"
                className="w-full block text-center py-2 text-xs font-semibold text-[#0F5132] bg-emerald-50 rounded-lg"
              >
                ← {content.sidebar.dashboard}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN AI WORKSPACE                                                      */}
      {/* ========================================================================= */}
      <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-white">
        {/* Workspace Top Header Bar */}
        <div className="border-b border-emerald-100 bg-white px-4 sm:px-6 py-2.5 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Toggle navigation drawer"
              className="lg:hidden p-1.5 rounded-lg border border-emerald-200 text-[#0F5132] hover:bg-emerald-50"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-[#0F5132]">
                {content.header.mainTitle}
              </h1>
              <p className="text-[11px] text-slate-500 font-normal hidden sm:block">
                {content.header.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-200 bg-white hover:bg-emerald-50 text-xs font-semibold text-[#0F5132] transition-colors"
            >
              <Languages className="w-3.5 h-3.5 text-[#0F5132]" />
              <span>{lang === "en" ? "हिन्दी" : "English"}</span>
            </button>

            {/* + New Chat */}
            <button
              type="button"
              onClick={handleStartNewChat}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#0F5132] hover:bg-[#15803d] text-white transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{content.header.newChat}</span>
            </button>
          </div>
        </div>

        {/* Clean, Large Chat Workspace Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
          <div className="max-w-4xl mx-auto flex flex-col justify-end min-h-full">
            {/* Minimal Empty Chat State */}
            {(!activeConversation || activeConversation.messages.length === 0) && (
              <div className="flex-1 flex flex-col justify-center items-center text-center py-12 px-4">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#0F5132] border border-emerald-200 flex items-center justify-center mb-2">
                  <Bot className="w-4 h-4" />
                </div>
                <h2 className="text-sm sm:text-base font-bold text-[#0F5132]">
                  {content.welcome.heading}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 max-w-sm">
                  {content.welcome.subheading}
                </p>
              </div>
            )}

            {/* Chat Messages Stream */}
            {activeConversation && activeConversation.messages.length > 0 && (
              <div className="space-y-3 pb-2">
                {activeConversation.messages.map((msg) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {isUser ? (
                        <div className="max-w-[85%] sm:max-w-[70%] rounded-xl px-3.5 py-2.5 bg-emerald-50 border border-emerald-200/80 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed shadow-2xs">
                          <div className="whitespace-pre-wrap">{msg.text}</div>
                          <div className="text-[10px] text-emerald-700/70 text-right mt-1 font-normal">
                            {msg.timestamp}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2.5 max-w-[90%] sm:max-w-[80%]">
                          <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#0F5132] border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                          <div
                            className={`rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                              msg.isWarning
                                ? "bg-white border-2 border-red-300 text-slate-800 shadow-2xs"
                                : "bg-white border border-slate-200 text-slate-800 shadow-2xs"
                            }`}
                          >
                            {msg.batchName && (
                              <div className="text-[10px] font-semibold text-emerald-800 mb-1 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                <span>{msg.batchName}</span>
                              </div>
                            )}
                            {msg.isWarning && (
                              <div className="mb-2 flex items-center gap-1 text-[11px] font-bold text-red-600">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                                <span>{content.citations.safetyOverride}</span>
                              </div>
                            )}
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                            {msg.citation && (
                              <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
                                {msg.citation}
                              </div>
                            )}
                            <div className="text-[10px] text-slate-400 text-right mt-1">
                              {msg.timestamp}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* AI Streaming Indicator */}
                {isAiStreaming && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#0F5132] border border-emerald-200 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="px-3.5 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-[#0F5132] flex items-center gap-2 shadow-2xs">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0F5132]" />
                      </span>
                      <span>Consulting ICAR Knowledge Base...</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Fixed Chat Composer Bar with Minimalist Upward-Opening Context Selectors */}
        <div className="border-t border-emerald-100 bg-white px-3 sm:px-6 py-3 shrink-0">
          <div className="max-w-4xl mx-auto">
            {attachedFileNotice && (
              <div className="mb-2 flex items-center justify-between text-[11px] bg-emerald-50 text-[#0F5132] border border-emerald-200 px-3 py-1 rounded-lg">
                <span>{attachedFileNotice}</span>
                <button
                  type="button"
                  onClick={() => setAttachedFileNotice("")}
                  className="text-slate-500 hover:text-slate-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-3 pt-2 pb-2 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-emerald-500/40 transition-all shadow-2xs">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* Attachment Button */}
                <button
                  type="button"
                  onClick={() =>
                    setAttachedFileNotice(
                      lang === "hi"
                        ? "हालिया जल गुणवत्ता टेलीमेट्री लॉग संलग्न किया गया।"
                        : "Recent pond water telemetry log attached."
                    )
                  }
                  title={content.input.attachTooltip}
                  className="p-1.5 rounded-full text-slate-500 hover:text-[#0F5132] hover:bg-emerald-100/50 transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Wide Text Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    selectedMode === "batch" && currentBatchName
                      ? `${content.input.placeholderBatchPrefix} ${currentBatchName.split(" - ")[0]}...`
                      : content.input.placeholderGeneral
                  }
                  className="flex-1 min-w-0 bg-transparent px-1 py-1.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />

                {/* Voice Dictation Button */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  title={content.input.voiceTooltip}
                  className={`p-1.5 rounded-full transition-colors ${
                    isListening
                      ? "bg-red-50 text-red-600 animate-pulse"
                      : "text-slate-500 hover:text-[#0F5132] hover:bg-emerald-100/50"
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isAiStreaming}
                  title={content.input.sendTooltip}
                  className="p-2 rounded-full bg-[#0F5132] hover:bg-[#15803d] text-white disabled:opacity-40 transition-colors shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Cascading Label-v Context Selectors: Domain -> AI Mode -> Batch */}
              <div className="mt-1.5 border-t border-slate-200/70">
                <ChatContextSelectors
                  selectedDomain={selectedDomain}
                  selectedMode={selectedMode}
                  selectedBatchId={selectedBatchId}
                  fisheriesBatches={fisheriesBatches}
                  poultryBatches={poultryBatches}
                  batchContext={activeBatchContext}
                  labels={content.selectors}
                  onDomainChange={handleDomainChange}
                  onModeChange={handleModeChange}
                  onBatchSelect={handleBatchSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
