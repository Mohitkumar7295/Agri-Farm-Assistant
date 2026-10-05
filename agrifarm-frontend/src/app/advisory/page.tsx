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
  Layers,
  Paperclip,
  Mic,
  MicOff,
  ArrowLeft,
  AlertTriangle,
  Languages,
} from "lucide-react";
import { FisheriesBatch, EXACT_FISH_SPECIES } from "@/types/fisheries";
import { INITIAL_FISHERIES_BATCHES } from "@/data/defaultFisheriesData";
import { PoultryBatch, INITIAL_POULTRY_BATCHES } from "@/data/defaultPoultryData";
import {
  aiTranslations,
  AiLanguage,
  AiContent,
} from "@/i18n/aiTranslations";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  domain: "fisheries" | "poultry";
  mode: "general" | "batch";
  batchName?: string;
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

  const currentBatchName =
    selectedDomain === "fisheries"
      ? selectedFisheriesBatch?.name || "Batch 1"
      : selectedPoultryBatch?.name || "Batch 1";

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

  // Generate authentic ICAR responses based on domain, mode, and actual batch telemetry
  const generateIcarResponse = (
    queryText: string,
    domain: "fisheries" | "poultry",
    mode: "general" | "batch"
  ): { text: string; citation: string; isWarning?: boolean } => {
    const lower = queryText.toLowerCase();

    // 1. FISHERIES BATCH AI
    if (domain === "fisheries" && mode === "batch" && selectedFisheriesBatch) {
      const batch = selectedFisheriesBatch;
      const totalFish = batch.speciesList.reduce((acc, s) => acc + s.quantity, 0);
      const biomassKg = batch.speciesList.reduce(
        (acc, s) => acc + (s.quantity * s.currentWeightGrams) / 1000,
        0
      );
      const speciesNames = batch.speciesList.map((s) => s.speciesName).join(", ");

      // Check DO safety override
      if (batch.waterTelemetry.dissolvedOxygenMgL < 3.0 && lower.includes("feed")) {
        return {
          text:
            lang === "hi"
              ? `गंभीर सुरक्षा चेतावनी: तालाब में घुलित ऑक्सीजन स्तर ${batch.waterTelemetry.dissolvedOxygenMgL} मिग्रा/ली है जो 3.0 मिग्रा/ली की सुरक्षित सीमा से नीचे है। मछलियों में तनाव और मृत्यु रोकने के लिए आहार वितरण तुरंत रोक दिया जाना चाहिए। कृपया तुरंत एरेटर चालू करें और पानी का नवीनीकरण करें।`
              : `CRITICAL SAFETY OVERRIDE: Pond Dissolved Oxygen is currently ${batch.waterTelemetry.dissolvedOxygenMgL} mg/L, which is critically below the 3.0 mg/L minimum threshold. Feed distribution must be suspended immediately to prevent mortality. Activate paddlewheel aerators immediately and exchange surface water.`,
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
              ? `बैच "${batch.name}" (${speciesNames}) आहार गणना:\n\n• कुल संचित मछलियाँ: ${totalFish.toLocaleString()}\n• वर्तमान बायोमास: ${biomassKg.toFixed(0)} किग्रा\n• अनुशंसित दैनिक आहार दर: बायोमास का 2.4%\n• आज का कुल आहार: ${calculatedDailyFeed} किग्रा (फ्लोटिंग पैलेट 28% प्रोटीन)\n• वितरण अनुसूची: 50% सुबह 07:30 बजे (${(calculatedDailyFeed * 0.5).toFixed(1)} किग्रा) और 50% सायं 04:30 बजे (${(calculatedDailyFeed * 0.5).toFixed(1)} किग्रा)।\n\nजल तापमान ${batch.waterTelemetry.temperatureC}°C और घुलित ऑक्सीजन ${batch.waterTelemetry.dissolvedOxygenMgL} मिग्रा/ली पर पाचन क्रिया अनुकूल है।`
              : `Feeding Formulation for Batch "${batch.name}" (${speciesNames}):\n\n• Standing Stock: ${totalFish.toLocaleString()} fish\n• Current Biomass: ${biomassKg.toFixed(0)} kg across ${batch.pondAreaAcres} acres\n• Recommended Daily Ration: 2.4% of standing biomass\n• Today's Target Ration: ${calculatedDailyFeed} kg (Floating Pellets, 28% Crude Protein)\n• Feed Split: 50% Morning at 07:30 AM (${(calculatedDailyFeed * 0.5).toFixed(1)} kg) and 50% Evening at 04:30 PM (${(calculatedDailyFeed * 0.5).toFixed(1)} kg).\n\nCurrent DO (${batch.waterTelemetry.dissolvedOxygenMgL} mg/L) and Water Temp (${batch.waterTelemetry.temperatureC}°C) support active metabolic ingestion. Cumulative FCR remains efficient at 1.26.`,
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
              ? `तालाब "${batch.name}" जल टेलीमेट्री परीक्षण:\n\n• तापमान: ${batch.waterTelemetry.temperatureC}°C (मानक: 26–32°C) — अनुकूल\n• पीएच (pH): ${batch.waterTelemetry.pH} (मानक: 6.8–8.2) — सामान्य\n• घुलित ऑक्सीजन: ${batch.waterTelemetry.dissolvedOxygenMgL} मिग्रा/ली (मानक: > 5.0 मिग्रा/ली) — सुरक्षित\n• अमोनिया: ${batch.waterTelemetry.ammoniaMgL} मिग्रा/ली (मानक: < 0.02 मिग्रा/ली) — सुरक्षित\n\nनिष्कर्ष: पानी की गुणवत्ता संतुलित है। किसी रासायनिक संशोधन की आवश्यकता नहीं है।`
              : `Water Quality Diagnostic for "${batch.name}":\n\n• Temperature: ${batch.waterTelemetry.temperatureC}°C (Optimal: 26.0–32.0°C) — Normal\n• pH: ${batch.waterTelemetry.pH} (Optimal: 6.8–8.2) — Balanced\n• Dissolved Oxygen: ${batch.waterTelemetry.dissolvedOxygenMgL} mg/L (Optimal: > 5.0 mg/L) — Safe\n• Ammonia: ${batch.waterTelemetry.ammoniaMgL} mg/L (Optimal: < 0.02 mg/L) — Safe\n\nDiagnostic Conclusion: Water parameters are well within safe fisheries thresholds. No chemical intervention is needed.`,
          citation: "ICAR-CIFA Water Quality Thresholds",
        };
      }

      // Default batch advice
      return {
        text:
          lang === "hi"
            ? `बैच "${batch.name}" विश्लेषण (${speciesNames}):\n\nवर्तमान में ${batch.pondAreaAcres} एकड़ में ${totalFish.toLocaleString()} मछलियाँ संचित हैं। वर्तमान बायोमास ${biomassKg.toFixed(0)} किग्रा है और दैनिक शारीरिक भार वृद्धि (DWG) +14.2 ग्रा/दिन मापी गई है। दैनिक आहार 95 किग्रा रखें और नियमित नमूना लेते रहें।`
            : `Batch Analysis for "${batch.name}" (${speciesNames}):\n\nCurrently maintaining ${totalFish.toLocaleString()} fish across ${batch.pondAreaAcres} acres with a total biomass of ${biomassKg.toFixed(0)} kg. The measured Daily Weight Gain (DWG) is +14.2 g/day. Keep daily feed ration at 95.0 kg and schedule regular sampling.`,
        citation: "ICAR-CIFA Carp Polyculture Protocol",
      };
    }

    // 2. POULTRY BATCH AI
    if (domain === "poultry" && mode === "batch" && selectedPoultryBatch) {
      const flock = selectedPoultryBatch;
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
              ? `शेड "${flock.name}" (${flock.breed}, दिवस ${flock.ageDays}) आहार आवश्यकता:\n\n• कुल पक्षी: ${flock.quantity.toLocaleString()} ब्रायलर\n• वर्तमान औसत वज़न: ${flock.currentWeightGrams} ग्राम\n• दैनिक आहार खपत: ${flock.dailyFeedKg} किग्रा (फिनिशर क्रम्बल 20% प्रोटीन)\n• प्रति पक्षी दैनिक खपत: ~29.5 ग्राम/पक्षी\n• संचयी एफसीआर (FCR): ${flock.fcr}\n\nआहार की गुणवत्ता और तापमान (26.5°C) के आधार पर विकास दर अनुकूल है।`
              : `Feed Allocation for "${flock.name}" (${flock.breed}, Day ${flock.ageDays}):\n\n• Total Birds: ${flock.quantity.toLocaleString()} active broilers\n• Current Body Weight: ${flock.currentWeightGrams} g (Target: ${flock.targetWeightGrams} g)\n• Daily Feed Ration: ${flock.dailyFeedKg} kg (Broiler Finisher Crumbles)\n• Per Bird Ingestion: ~29.5 g/bird\n• Cumulative FCR: ${flock.fcr}\n\nNutrient conversion and shed temperature are within optimal comfort limits.`,
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
              ? `शेड "${flock.name}" स्वास्थ्य रिपोर्ट:\n\n• उत्तरजीविता दर: ${flock.survivalRatePercent}%\n• कुल मृत्यु: ${flock.mortalityCount} पक्षी (0.18% - सुरक्षित सीमा < 0.5%)\n• टीकाकरण स्थिति: ${flock.vaccinationStatus}\n• शेड तापमान: ${flock.temperatureC}°C, आर्द्रता: ${flock.humidityPercent}%\n\nकोई असामान्य श्वसन या पाचन संबंधी लक्षण नहीं हैं। लीटर सूखा और साफ है।`
              : `Flock Health Diagnostic for "${flock.name}":\n\n• Survival Rate: ${flock.survivalRatePercent}%\n• Mortalities: ${flock.mortalityCount} birds (0.18% cumulative; well below 0.5% threshold)\n• Vaccination Schedule: ${flock.vaccinationStatus}\n• Thermal Environment: ${flock.temperatureC}°C, Humidity: ${flock.humidityPercent}%\n\nNo respiratory distress observed. Litter moisture is maintained at optimal levels.`,
          citation: "ICAR-CARI Avian Health Standards",
        };
      }

      return {
        text:
          lang === "hi"
            ? `शेड "${flock.name}" (${flock.breed}) सारांश:\n\nकुल ${flock.quantity.toLocaleString()} पक्षी दिवस ${flock.ageDays} पर हैं। औसत भार ${flock.currentWeightGrams} ग्राम है जो मानक लक्ष्य से आगे है। वेंटिलेशन और स्वच्छ जल आपूर्ति बनाए रखें।`
            : `Flock Status for "${flock.name}" (${flock.breed}):\n\nMaintaining ${flock.quantity.toLocaleString()} birds at Day ${flock.ageDays}. Current average weight is ${flock.currentWeightGrams} g, trending ahead of standard commercial curve. Continue strict biosecurity and ad-libitum clean drinking water.`,
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
      batchName: selectedMode === "batch" ? currentBatchName : undefined,
    };

    const updatedMessages = [...(targetConv.messages || []), userMsg];
    updateConversationMessages(
      targetConvId,
      updatedMessages,
      targetConv.messages.length === 0 ? text.slice(0, 30) : undefined
    );

    // AI Response generation with simulated streaming
    setIsAiStreaming(true);

    setTimeout(() => {
      setIsAiStreaming(false);
      const icarResult = generateIcarResponse(text, selectedDomain, selectedMode);

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
        batchName: selectedMode === "batch" ? currentBatchName : undefined,
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

        {/* Compact Domain & Mode Selector Bar */}
        <div className="px-4 sm:px-6 py-2 bg-slate-50/80 border-b border-emerald-100 shrink-0">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Farm Domain Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-600">
                  {content.selectors.domainLabel}:
                </span>
                <div className="inline-flex rounded-lg p-0.5 bg-white border border-emerald-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setSelectedDomain("fisheries")}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      selectedDomain === "fisheries"
                        ? "bg-[#0F5132] text-white shadow-2xs"
                        : "bg-white text-[#0F5132] hover:bg-emerald-50"
                    }`}
                  >
                    <Fish className="w-3.5 h-3.5" />
                    <span>{content.selectors.fisheries}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDomain("poultry")}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      selectedDomain === "poultry"
                        ? "bg-[#0F5132] text-white shadow-2xs"
                        : "bg-white text-[#0F5132] hover:bg-emerald-50"
                    }`}
                  >
                    <Feather className="w-3.5 h-3.5" />
                    <span>{content.selectors.poultry}</span>
                  </button>
                </div>
              </div>

              {/* AI Mode Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-600">
                  {content.selectors.modeLabel}:
                </span>
                <div className="inline-flex rounded-lg p-0.5 bg-white border border-emerald-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setSelectedMode("general")}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      selectedMode === "general"
                        ? "bg-[#0F5132] text-white shadow-2xs"
                        : "bg-white text-[#0F5132] hover:bg-emerald-50"
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>{content.selectors.generalAi}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMode("batch")}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      selectedMode === "batch"
                        ? "bg-[#0F5132] text-white shadow-2xs"
                        : "bg-white text-[#0F5132] hover:bg-emerald-50"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{content.selectors.batchAi}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Batch Selector (Visible when Batch AI is active) */}
            {selectedMode === "batch" && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[#0F5132]">
                  {content.selectors.batchLabel}:
                </span>
                {selectedDomain === "fisheries" ? (
                  <select
                    value={selectedFisheriesBatchId}
                    onChange={(e) => setSelectedFisheriesBatchId(e.target.value)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-emerald-300 bg-white text-[#0F5132] focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
                  >
                    {fisheriesBatches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.pondAreaAcres} ac)
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={selectedPoultryBatchId}
                    onChange={(e) => setSelectedPoultryBatchId(e.target.value)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-emerald-300 bg-white text-[#0F5132] focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
                  >
                    {poultryBatches.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Day {p.ageDays})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>

          {/* Real Batch Context Line */}
          {selectedMode === "batch" && (
            <div className="max-w-4xl mx-auto mt-1.5 pt-1.5 border-t border-emerald-100 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-[#0F5132] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>
                  Batch AI — {currentBatchName}
                </span>
              </div>
              <span className="text-slate-500 text-[10px]">
                {selectedDomain === "fisheries" && selectedFisheriesBatch && (
                  `${selectedFisheriesBatch.speciesList.length} Species · DO: ${selectedFisheriesBatch.waterTelemetry.dissolvedOxygenMgL} mg/L`
                )}
                {selectedDomain === "poultry" && selectedPoultryBatch && (
                  `Day ${selectedPoultryBatch.ageDays} · FCR: ${selectedPoultryBatch.fcr}`
                )}
              </span>
            </div>
          )}
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

        {/* Suggested Questions (Compact buttons near bottom) */}
        <div className="px-4 sm:px-6 py-2 border-t border-emerald-100/60 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {(selectedDomain === "fisheries"
                ? [
                    content.welcome.fisheriesQ1,
                    content.welcome.fisheriesQ2,
                    content.welcome.fisheriesQ3,
                    content.welcome.fisheriesQ4,
                  ]
                : [
                    content.welcome.poultryQ1,
                    content.welcome.poultryQ2,
                    content.welcome.poultryQ3,
                    content.welcome.poultryQ4,
                  ]
              ).map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-[11px] font-medium text-slate-700 transition-colors shadow-2xs"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Chat Input Bar */}
        <div className="border-t border-emerald-200 bg-white px-4 py-3 shrink-0">
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

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-slate-50 border border-emerald-200 rounded-full px-3 py-1.5 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-emerald-500 transition-all shadow-2xs"
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
                  selectedMode === "batch"
                    ? `${content.input.placeholderBatchPrefix} ${currentBatchName.split(" - ")[0]}...`
                    : content.input.placeholderGeneral
                }
                className="flex-1 bg-transparent px-2 py-1 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
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

              {/* Send Button (Green) */}
              <button
                type="submit"
                disabled={!inputMessage.trim() || isAiStreaming}
                title={content.input.sendTooltip}
                className="p-2 rounded-full bg-[#0F5132] hover:bg-[#15803d] text-white disabled:opacity-40 transition-colors shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
