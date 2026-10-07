"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Filter,
  Sparkles,
  Waves,
  Feather,
  Calendar,
  ChevronDown,
  AlertTriangle,
  Check,
  RotateCcw,
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
  Activity,
  Droplets,
  Thermometer,
} from "lucide-react";
import { FisheriesBatch } from "@/types/fisheries";
import { INITIAL_FISHERIES_BATCHES } from "@/data/defaultFisheriesData";
import { PoultryFlock } from "@/types/poultry";
import { INITIAL_POULTRY_FLOCKS } from "@/data/defaultPoultryFlocks";

export type TaskDomain = "fisheries" | "poultry";
export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "critical" | "high" | "routine";

export interface BatchTaskItem {
  id: string;
  batchId: string;
  domain: TaskDomain;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  time: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: string;
  isCustom?: boolean;
}

interface BatchTasksManagerProps {
  lang: "en" | "hi";
  onBatchNavigate?: (domain: TaskDomain, batchId: string) => void;
}

// Scientific default daily tasks template for Fisheries batches
const DEFAULT_FISHERIES_TASKS_TEMPLATE: Omit<BatchTaskItem, "id" | "batchId" | "domain">[] = [
  {
    titleEn: "Dawn Dissolved Oxygen (DO) & Temperature Test",
    titleHi: "प्रातःकालीन घुलित ऑक्सीजन (DO) एवं तापमान परीक्षण",
    descriptionEn: "Test pre-sunrise DO at 0.5m depth using digital probe. Target > 5.0 mg/L; activate emergency aerators if < 3.5 mg/L.",
    descriptionHi: "डिजिटल प्रोब से सूर्योदय पूर्व 0.5 मीटर गहराई पर DO नापें। लक्ष्य > 5.0 mg/L; यदि 3.5 से कम हो तो तुरंत एरेटर चालू करें।",
    time: "06:00 AM",
    priority: "critical",
    status: "completed",
    category: "Water Quality",
  },
  {
    titleEn: "Morning Feed Dispersal & Feeding Tray Audit",
    titleHi: "सुबह का आहार वितरण एवं फीडिंग ट्रे निरीक्षण",
    descriptionEn: "Disperse floating pellets (28-32% CP) across feeding zones. Check tray for uneaten feed after 90 minutes to adjust rations.",
    descriptionHi: "28-32% प्रोटीन युक्त फ्लोटिंग पेलेट्स तालाब में समान रूप से डालें। 90 मिनट बाद ट्रे चेक कर अवशेष आहार की जांच करें।",
    time: "07:30 AM",
    priority: "high",
    status: "completed",
    category: "Feeding",
  },
  {
    titleEn: "Water Chemical Profiling (pH & Ammonia NH3/NH4+)",
    titleHi: "जल रासायनिक प्रोफाइलिंग (pH एवं अमोनिया परीक्षण)",
    descriptionEn: "Collect water sample from center. Maintain pH between 7.5 - 8.2 and Toxic Ammonia < 0.05 mg/L to prevent gill irritation.",
    descriptionHi: "तालाब के केंद्र से पानी का नमूना लें। गलफड़ों की सुरक्षा हेतु pH 7.5 - 8.2 तथा अमोनिया < 0.05 mg/L सुनिश्चित करें।",
    time: "11:30 AM",
    priority: "high",
    status: "in_progress",
    category: "Chemical Telemetry",
  },
  {
    titleEn: "Paddle-Wheel Aerator Mechanical & Solar Check",
    titleHi: "पैडल-व्हील एरेटर यांत्रिक एवं सोलर जाँच",
    descriptionEn: "Inspect gearboxes, electrical connections, and solar inverter voltage for the 1.5 kW paddle-wheel units.",
    descriptionHi: "1.5 kW पैडल-व्हील यूनिट्स के गियरबॉक्स, विद्युत केबल तथा सोलर इन्वर्टर वोल्टेज की जांच करें।",
    time: "02:30 PM",
    priority: "routine",
    status: "pending",
    category: "Equipment",
  },
  {
    titleEn: "Evening Feed Ration with Probiotic Dosing",
    titleHi: "सायंकालीन आहार वितरण एवं प्रोबायोटिक मिश्रण",
    descriptionEn: "Broadcast remaining 40% daily feed mixed with Bacillus subtilis blend to strengthen gut immunity and break down sludge.",
    descriptionHi: "दैनिक आहार का शेष 40% भाग आंत प्रतिरक्षा हेतु बेसिलस सबटिलिस प्रोबायोटिक के साथ तालाब में डालें।",
    time: "05:00 PM",
    priority: "high",
    status: "pending",
    category: "Feeding & Health",
  },
  {
    titleEn: "Night Aeration Timer & Secchi Disk Check",
    titleHi: "रात्रि एरेटर टाइमर सेट एवं सेकी डिस्क दृश्यता जाँच",
    descriptionEn: "Measure Secchi transparency (target 30-40 cm). Program automated aerator timer for midnight oxygen support (11 PM - 5 AM).",
    descriptionHi: "सेकी डिस्क से पानी का हरापन नापें (लक्ष्य 30-40 सेमी)। रात 11 बजे से सुबह 5 बजे तक स्वचालित एरेटर टाइमर सेट करें।",
    time: "07:30 PM",
    priority: "routine",
    status: "pending",
    category: "Night Safety",
  },
];

// Scientific default daily tasks template for Poultry flocks
const DEFAULT_POULTRY_TASKS_TEMPLATE: Omit<BatchTaskItem, "id" | "batchId" | "domain">[] = [
  {
    titleEn: "Morning Lighting & Drinker Line Chlorination Flush",
    titleHi: "प्रातः प्रकाश व्यवस्था एवं ड्रिंकर लाइन क्लोरीन फ्लशिंग",
    descriptionEn: "Switch on shed lighting cycle. Flush nipple drinker lines; verify free residual chlorine at 2-3 ppm to prevent biofilm.",
    descriptionHi: "शेड की लाइटिंग चालू करें। निप्पल ड्रिंकर लाइनों को फ्लश करें तथा बायोफिल्म रोकने हेतु क्लोरीन 2-3 ppm जांचें।",
    time: "06:00 AM",
    priority: "high",
    status: "completed",
    category: "Water & Light",
  },
  {
    titleEn: "Feeder Filling & Feed Consumption Inspection",
    titleHi: "फीडर भराव एवं दैनिक दाना खपत निगरानी",
    descriptionEn: "Fill automated pans with balanced mash/crumbles. Calculate yesterday's consumption vs standard growth curve.",
    descriptionHi: "फीडर पैन में संतुलित दाना भरें। मानक विकास तालिका के अनुसार कल की वास्तविक खपत की गणना करें।",
    time: "07:15 AM",
    priority: "high",
    status: "completed",
    category: "Nutrition",
  },
  {
    titleEn: "Shed Temperature & Relative Humidity Audit",
    titleHi: "शेड तापमान एवं सापेक्ष आर्द्रता (RH) ऑडिट",
    descriptionEn: "Verify temperature sensors across zones. Target: 24°C - 26°C with 60% RH. Adjust evaporative cooling pads if heat stress rises.",
    descriptionHi: "विभिन्न कोनों के तापमान सेंसर जांचें। लक्ष्य: 24°C - 26°C, आर्द्रता 60%। हीट स्ट्रेस से बचाव हेतु कूलिंग पैड समायोजित करें।",
    time: "10:30 AM",
    priority: "critical",
    status: "in_progress",
    category: "Climate Control",
  },
  {
    titleEn: "Biosecurity Inspection & Mortality Quarantine Log",
    titleHi: "बायोसुरक्षा वॉक एवं दैनिक मृत्यु दर (मोर्टेलिटी) रिकॉर्ड",
    descriptionEn: "Conduct slow inverted-V inspection walk. Remove any mortalities immediately to quarantine disposal. Target < 0.05% daily.",
    descriptionHi: "शेड में सावधानीपूर्वक निरीक्षण करें। मृत पक्षियों को तुरंत हटाकर सुरक्षित निस्तारण करें। दैनिक लक्ष्य < 0.05%।",
    time: "01:00 PM",
    priority: "critical",
    status: "pending",
    category: "Biosecurity",
  },
  {
    titleEn: "Litter Moisture Raking & Tunnel Ventilation Check",
    titleHi: "लीटर नमी रेकिंग एवं टनल वेंटिलेशन पंखा जाँच",
    descriptionEn: "Rake wet cake litter near drinker lines (keep moisture < 25%). Inspect belt tension and louvers on tunnel exhaust fans.",
    descriptionHi: "ड्रिंकर लाइनों के नीचे जमी गीली खाद (लीटर) को खुरपें। टनल एग्जॉस्ट पंखों के बेल्ट तनाव और शटर की जांच करें।",
    time: "03:30 PM",
    priority: "routine",
    status: "pending",
    category: "Litter & Air",
  },
  {
    titleEn: "Evening Electrolyte Water Dosing & Egg Collection",
    titleHi: "सायंकालीन इलेक्ट्रोलाइट जल खुराक एवं अंडा संकलन",
    descriptionEn: "Add water-soluble vitamins/electrolytes to overhead header tank. Collect, sanitize, and grade evening egg trays (if layers).",
    descriptionHi: "ओवरहेड टैंक में पानी में घुलनशील विटामिन/इलेक्ट्रोलाइट्स मिलाएं। शाम के अंडों का सुरक्षित संकलन व ग्रेडिंग करें।",
    time: "06:00 PM",
    priority: "high",
    status: "pending",
    category: "Care & Harvest",
  },
];

export default function BatchTasksManager({ lang, onBatchNavigate }: BatchTasksManagerProps) {
  const [activeDomain, setActiveDomain] = useState<TaskDomain>("fisheries");

  // Batches state loaded from user storage
  const [fisheriesBatches, setFisheriesBatches] = useState<FisheriesBatch[]>([]);
  const [poultryFlocks, setPoultryFlocks] = useState<PoultryFlock[]>([]);

  // Selected Batch ID per domain
  const [selectedFishBatchId, setSelectedFishBatchId] = useState<string>("");
  const [selectedPoultryFlockId, setSelectedPoultryFlockId] = useState<string>("");

  // All Tasks mapped by batchId
  const [tasksMap, setTasksMap] = useState<Record<string, BatchTaskItem[]>>({});

  // Filters & Modal
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("09:00 AM");
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>("high");
  const [newTaskCategory, setNewTaskCategory] = useState("Routine");

  // 1. Load Batches from localStorage
  useEffect(() => {
    // Fisheries
    try {
      const savedFish = localStorage.getItem("agrifarm_fisheries_batches");
      if (savedFish) {
        const parsed: FisheriesBatch[] = JSON.parse(savedFish);
        setFisheriesBatches(parsed);
        if (parsed.length > 0) {
          setSelectedFishBatchId(parsed[0].id);
        }
      } else {
        setFisheriesBatches(INITIAL_FISHERIES_BATCHES);
        if (INITIAL_FISHERIES_BATCHES.length > 0) {
          setSelectedFishBatchId(INITIAL_FISHERIES_BATCHES[0].id);
        }
      }
    } catch {
      setFisheriesBatches(INITIAL_FISHERIES_BATCHES);
      setSelectedFishBatchId(INITIAL_FISHERIES_BATCHES[0]?.id || "");
    }

    // Poultry
    try {
      const savedPoultry = localStorage.getItem("agrifarm_poultry_flocks");
      if (savedPoultry) {
        const parsed: PoultryFlock[] = JSON.parse(savedPoultry);
        setPoultryFlocks(parsed);
        if (parsed.length > 0) {
          setSelectedPoultryFlockId(parsed[0].id);
        }
      } else {
        setPoultryFlocks(INITIAL_POULTRY_FLOCKS);
        if (INITIAL_POULTRY_FLOCKS.length > 0) {
          setSelectedPoultryFlockId(INITIAL_POULTRY_FLOCKS[0].id);
        }
      }
    } catch {
      setPoultryFlocks(INITIAL_POULTRY_FLOCKS);
      setSelectedPoultryFlockId(INITIAL_POULTRY_FLOCKS[0]?.id || "");
    }

    // Load saved tasks
    try {
      const savedTasks = localStorage.getItem("agrifarm_batchwise_tasks");
      if (savedTasks) {
        setTasksMap(JSON.parse(savedTasks));
      }
    } catch (e) {
      console.warn("Could not load tasks map:", e);
    }
  }, []);

  // Current active batch identifier
  const currentBatchId = activeDomain === "fisheries" ? selectedFishBatchId : selectedPoultryFlockId;

  // Active batch object
  const currentFishBatch = useMemo(
    () => fisheriesBatches.find((b) => b.id === selectedFishBatchId) || fisheriesBatches[0],
    [fisheriesBatches, selectedFishBatchId]
  );

  const currentPoultryFlock = useMemo(
    () => poultryFlocks.find((f) => f.id === selectedPoultryFlockId) || poultryFlocks[0],
    [poultryFlocks, selectedPoultryFlockId]
  );

  // Initialize tasks for a batch if not yet present
  useEffect(() => {
    if (!currentBatchId) return;

    setTasksMap((prev) => {
      if (prev[currentBatchId] && prev[currentBatchId].length > 0) {
        return prev;
      }

      // Generate initial standard template for this batch
      const template =
        activeDomain === "fisheries"
          ? DEFAULT_FISHERIES_TASKS_TEMPLATE
          : DEFAULT_POULTRY_TASKS_TEMPLATE;

      const generated: BatchTaskItem[] = template.map((item, idx) => ({
        ...item,
        id: `task_${currentBatchId}_${idx + 1}`,
        batchId: currentBatchId,
        domain: activeDomain,
      }));

      const updated = { ...prev, [currentBatchId]: generated };
      try {
        localStorage.setItem("agrifarm_batchwise_tasks", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [currentBatchId, activeDomain]);

  // Current list of tasks for the active batch
  const currentTasks = useMemo(() => {
    return tasksMap[currentBatchId] || [];
  }, [tasksMap, currentBatchId]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    if (statusFilter === "all") return currentTasks;
    if (statusFilter === "completed") return currentTasks.filter((t) => t.status === "completed");
    return currentTasks.filter((t) => t.status !== "completed");
  }, [currentTasks, statusFilter]);

  // Progress stats
  const completedCount = useMemo(
    () => currentTasks.filter((t) => t.status === "completed").length,
    [currentTasks]
  );
  const totalCount = currentTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Toggle task status: pending -> in_progress -> completed -> pending
  const handleToggleTaskStatus = (taskId: string) => {
    setTasksMap((prev) => {
      const batchTasks = prev[currentBatchId] || [];
      const updated = batchTasks.map((t) => {
        if (t.id === taskId) {
          const nextStatus: TaskStatus =
            t.status === "completed"
              ? "pending"
              : t.status === "in_progress"
              ? "completed"
              : "in_progress";
          return { ...t, status: nextStatus };
        }
        return t;
      });

      const nextMap = { ...prev, [currentBatchId]: updated };
      try {
        localStorage.setItem("agrifarm_batchwise_tasks", JSON.stringify(nextMap));
      } catch {}
      return nextMap;
    });
  };

  // 1-Click Checkbox completion
  const handleDirectComplete = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasksMap((prev) => {
      const batchTasks = prev[currentBatchId] || [];
      const updated = batchTasks.map((t) => {
        if (t.id === taskId) {
          return { ...t, status: t.status === "completed" ? "pending" : "completed" } as BatchTaskItem;
        }
        return t;
      });

      const nextMap = { ...prev, [currentBatchId]: updated };
      try {
        localStorage.setItem("agrifarm_batchwise_tasks", JSON.stringify(nextMap));
      } catch {}
      return nextMap;
    });
  };

  // Reset all tasks for current batch
  const handleResetTasks = () => {
    if (!window.confirm(lang === "hi" ? "क्या आप आज के सभी कार्य रीसेट करना चाहते हैं?" : "Reset all of today's tasks for this batch?")) {
      return;
    }
    const template =
      activeDomain === "fisheries"
        ? DEFAULT_FISHERIES_TASKS_TEMPLATE
        : DEFAULT_POULTRY_TASKS_TEMPLATE;

    const regenerated: BatchTaskItem[] = template.map((item, idx) => ({
      ...item,
      id: `task_${currentBatchId}_${idx + 1}`,
      batchId: currentBatchId,
      domain: activeDomain,
      status: "pending",
    }));

    setTasksMap((prev) => {
      const nextMap = { ...prev, [currentBatchId]: regenerated };
      try {
        localStorage.setItem("agrifarm_batchwise_tasks", JSON.stringify(nextMap));
      } catch {}
      return nextMap;
    });
  };

  // Add custom task
  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: BatchTaskItem = {
      id: `custom_${currentBatchId}_${Date.now()}`,
      batchId: currentBatchId,
      domain: activeDomain,
      titleEn: newTaskTitle.trim(),
      titleHi: newTaskTitle.trim(),
      descriptionEn: "Custom daily task assigned to active batch schedule.",
      descriptionHi: "सक्रिय बैच कार्यसूची में जोड़ा गया व्यक्तिगत दैनिक कार्य।",
      time: newTaskTime || "12:00 PM",
      priority: newTaskPriority,
      status: "pending",
      category: newTaskCategory || "General",
      isCustom: true,
    };

    setTasksMap((prev) => {
      const batchTasks = prev[currentBatchId] || [];
      const updated = [...batchTasks, newTask];
      const nextMap = { ...prev, [currentBatchId]: updated };
      try {
        localStorage.setItem("agrifarm_batchwise_tasks", JSON.stringify(nextMap));
      } catch {}
      return nextMap;
    });

    setNewTaskTitle("");
    setIsAddModalOpen(false);
  };

  // Delete custom task
  const handleDeleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasksMap((prev) => {
      const batchTasks = prev[currentBatchId] || [];
      const updated = batchTasks.filter((t) => t.id !== taskId);
      const nextMap = { ...prev, [currentBatchId]: updated };
      try {
        localStorage.setItem("agrifarm_batchwise_tasks", JSON.stringify(nextMap));
      } catch {}
      return nextMap;
    });
  };

  return (
    <section id="batch-tasks-section" className="space-y-6 scroll-mt-24">
      {/* 1. TOP HEADER & DOMAIN SELECTOR */}
      <div className="rounded-3xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#071911] p-5 sm:p-7 shadow-sm transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-emerald-950/40">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#0F5132]/10 dark:bg-emerald-500/20 text-[#0F5132] dark:text-emerald-400">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {lang === "hi" ? "बैच-वार दैनिक कार्य एवं प्रोटोकॉल" : "Batch-wise Daily Tasks & Protocols"}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {lang === "hi" ? "आज का कार्य" : "Today's Work"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === "hi"
                  ? "मत्स्य पालन तालाब और कुक्कुट शेड के सक्रिय बैच चुनें और आज के वैज्ञानिक कार्य देखें व पूरा करें।"
                  : "Select Fisheries ponds or Poultry flocks batch-wise to monitor and track today's scheduled operations."}
              </p>
            </div>
          </div>

          {/* DUAL DOMAIN TOGGLE: FISHERIES vs POULTRY */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-[#040e0a] border border-slate-200 dark:border-emerald-900/50 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setActiveDomain("fisheries")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeDomain === "fisheries"
                  ? "bg-[#0F5132] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-400"
              }`}
            >
              <Waves className="w-4 h-4" />
              <span>{lang === "hi" ? "मत्स्य पालन (Fisheries)" : "Fisheries"}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {fisheriesBatches.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDomain("poultry")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeDomain === "poultry"
                  ? "bg-[#0F5132] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-400"
              }`}
            >
              <Feather className="w-4 h-4" />
              <span>{lang === "hi" ? "कुक्कुट पालन (Poultry)" : "Poultry"}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {poultryFlocks.length}
              </span>
            </button>
          </div>
        </div>

        {/* 2. BATCH SELECTION & ACTIVE BATCH HUD */}
        <div className="pt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Batch Selector Dropdown */}
          <div className="lg:col-span-5 space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>
                {activeDomain === "fisheries"
                  ? (lang === "hi" ? "सक्रिय तालाब / बैच चुनें:" : "Select Active Pond / Batch:")
                  : (lang === "hi" ? "सक्रिय शेड / झुंड (फ्लॉक) चुनें:" : "Select Active Shed / Flock:")}
              </span>
              <span className="text-[11px] font-normal text-emerald-700 dark:text-emerald-400">
                {lang === "hi" ? "बैच-वार कार्य" : "Batchwise Mode"}
              </span>
            </label>

            <div className="relative">
              {activeDomain === "fisheries" ? (
                <select
                  value={selectedFishBatchId}
                  onChange={(e) => setSelectedFishBatchId(e.target.value)}
                  className="w-full appearance-none px-4 py-3 text-sm font-semibold rounded-2xl border border-slate-300 dark:border-emerald-800/80 bg-slate-50 dark:bg-[#0c241a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F5132] pr-10 cursor-pointer shadow-2xs"
                >
                  {fisheriesBatches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} — {b.location} ({b.status})
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={selectedPoultryFlockId}
                  onChange={(e) => setSelectedPoultryFlockId(e.target.value)}
                  className="w-full appearance-none px-4 py-3 text-sm font-semibold rounded-2xl border border-slate-300 dark:border-emerald-800/80 bg-slate-50 dark:bg-[#0c241a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F5132] pr-10 cursor-pointer shadow-2xs"
                >
                  {poultryFlocks.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} — {f.breed} ({f.currentBirds.toLocaleString()} {lang === "hi" ? "पक्षी" : "birds"})
                    </option>
                  ))}
                </select>
              )}
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
            </div>
          </div>

          {/* Active Batch Summary Card */}
          <div className="lg:col-span-7">
            {activeDomain === "fisheries" && currentFishBatch && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 to-emerald-50/70 dark:from-blue-950/20 dark:to-emerald-950/30 border border-blue-200/60 dark:border-blue-900/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 font-bold">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {currentFishBatch.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      {currentFishBatch.speciesList?.map((s) => s.speciesName).join(", ") || "Mixed Carp"} • {currentFishBatch.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      {lang === "hi" ? "जल तापमान / DO" : "Water Temp / DO"}
                    </span>
                    <span className="font-mono font-bold text-[#0F5132] dark:text-emerald-400">
                      {currentFishBatch.waterTelemetry?.temperatureC ?? 28.5}°C • {currentFishBatch.waterTelemetry?.dissolvedOxygenMgL ?? 6.2} ppm
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onBatchNavigate ? onBatchNavigate("fisheries", currentFishBatch.id) : (window.location.href = "/fisheries")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-emerald-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 transition-all shadow-2xs"
                  >
                    <span>{lang === "hi" ? "तालाब देखें" : "Open Pond"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {activeDomain === "poultry" && currentPoultryFlock && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50/70 to-emerald-50/70 dark:from-amber-950/20 dark:to-emerald-950/30 border border-amber-200/60 dark:border-amber-900/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 font-bold">
                    <Feather className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {currentPoultryFlock.name} ({currentPoultryFlock.breed})
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      {currentPoultryFlock.currentBirds.toLocaleString()} {lang === "hi" ? "पक्षी" : "birds"} • {currentPoultryFlock.ageDays} {lang === "hi" ? "दिन" : "days old"} • {currentPoultryFlock.shedName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      {lang === "hi" ? "औसत वजन / FCR" : "Avg Weight / FCR"}
                    </span>
                    <span className="font-mono font-bold text-[#0F5132] dark:text-emerald-400">
                      {currentPoultryFlock.currentWeightGrams}g • FCR {currentPoultryFlock.fcr}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onBatchNavigate ? onBatchNavigate("poultry", currentPoultryFlock.id) : (window.location.href = "/poultry")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-emerald-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-50 transition-all shadow-2xs"
                  >
                    <span>{lang === "hi" ? "शेड देखें" : "Open Shed"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. TODAY'S WORK SCHEDULE & TASKS LIST */}
      <div className="rounded-3xl border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-[#071911] p-5 sm:p-7 shadow-sm transition-all">
        {/* Progress & Quick Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-emerald-950/40">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {lang === "hi" ? "आज का कार्य सूची (Schedule)" : "Today's Work Checklist"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-emerald-950/80 text-[#0F5132] dark:text-emerald-300">
                {completedCount} / {totalCount} {lang === "hi" ? "पूर्ण" : "Done"}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-48 sm:w-64 h-2 bg-slate-100 dark:bg-emerald-950 rounded-full mt-2 overflow-hidden border border-slate-200 dark:border-emerald-900/40">
              <div
                className="h-full bg-[#0F5132] dark:bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action buttons & filters */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Filter pills */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#040e0a] border border-slate-200 dark:border-emerald-900/40 text-xs font-bold">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  statusFilter === "all"
                    ? "bg-white dark:bg-emerald-800 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {lang === "hi" ? "सभी" : "All"}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("pending")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  statusFilter === "pending"
                    ? "bg-white dark:bg-emerald-800 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {lang === "hi" ? "शेष" : "Pending"}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("completed")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  statusFilter === "completed"
                    ? "bg-white dark:bg-emerald-800 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {lang === "hi" ? "पूर्ण" : "Done"}
              </button>
            </div>

            {/* Add task button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#0F5132] hover:bg-[#15803d] text-white shadow-2xs transition-all cursor-pointer active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === "hi" ? "नया कार्य जोड़ें" : "Add Task"}</span>
            </button>

            {/* Reset button */}
            <button
              type="button"
              onClick={handleResetTasks}
              title={lang === "hi" ? "कार्य रीसेट करें" : "Reset Tasks"}
              className="p-2 rounded-xl border border-slate-200 dark:border-emerald-800/60 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tasks List Container */}
        <div className="divide-y divide-slate-100 dark:divide-emerald-950/40 pt-2">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600/50" />
              <p className="text-sm font-semibold">
                {statusFilter === "completed"
                  ? (lang === "hi" ? "कोई कार्य अभी पूर्ण नहीं हुआ है।" : "No tasks completed yet.")
                  : (lang === "hi" ? "आज के सभी कार्य पूरे हो चुके हैं! उत्कृष्ट प्रबंधन।" : "All tasks for today are completed! Great job.")}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isCompleted = task.status === "completed";
              const isInProgress = task.status === "in_progress";

              return (
                <div
                  key={task.id}
                  onClick={() => handleToggleTaskStatus(task.id)}
                  className={`py-4 px-3 sm:px-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-all cursor-pointer hover:bg-slate-50/80 dark:hover:bg-[#0c241a]/60 ${
                    isCompleted
                      ? "opacity-65 bg-slate-50/40 dark:bg-emerald-950/10"
                      : "bg-transparent"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => handleDirectComplete(task.id, e)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                        isCompleted
                          ? "bg-[#0F5132] border-[#0F5132] text-white"
                          : isInProgress
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600"
                          : "border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911]"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : isInProgress ? (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      ) : null}
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm sm:text-base font-bold ${
                            isCompleted
                              ? "line-through text-slate-400 dark:text-slate-500"
                              : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {lang === "hi" ? task.titleHi : task.titleEn}
                        </span>

                        {/* Priority Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                            task.priority === "critical"
                              ? "bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300"
                              : task.priority === "high"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300"
                          }`}
                        >
                          {task.priority === "critical"
                            ? (lang === "hi" ? "अति-महत्वपूर्ण" : "Critical")
                            : task.priority === "high"
                            ? (lang === "hi" ? "महत्वपूर्ण" : "High")
                            : (lang === "hi" ? "नियमित" : "Routine")}
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-emerald-950 text-slate-600 dark:text-slate-300">
                          {task.category}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {lang === "hi" ? task.descriptionHi : task.descriptionEn}
                      </p>
                    </div>
                  </div>

                  {/* Right Status & Time Badge */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.time}</span>
                    </span>

                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                        isCompleted
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-[#0F5132] dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                          : isInProgress
                          ? "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                          : "bg-slate-50 dark:bg-[#071911] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-emerald-900"
                      }`}
                    >
                      {isCompleted
                        ? (lang === "hi" ? "पूर्ण" : "Completed")
                        : isInProgress
                        ? (lang === "hi" ? "प्रगति पर" : "In Progress")
                        : (lang === "hi" ? "लंबित" : "Pending")}
                    </span>

                    {task.isCustom && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteTask(task.id, e)}
                        className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        title={lang === "hi" ? "हटाएं" : "Delete"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. MODAL: ADD CUSTOM TASK */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0c241a] border border-slate-200 dark:border-emerald-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#0F5132]" />
              <span>{lang === "hi" ? "नया कार्य जोड़ें" : "Add Today's Work"}</span>
            </h3>

            <form onSubmit={handleAddNewTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === "hi" ? "कार्य का नाम *" : "Task Title *"}
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder={lang === "hi" ? "उदा. तालाब चूना छिड़काव / वैक्सीन बूस्टर" : "e.g. Liming application / Vaccination booster"}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "hi" ? "समय" : "Time"}
                  </label>
                  <input
                    type="text"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "hi" ? "प्राथमिकता" : "Priority"}
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white"
                  >
                    <option value="routine">{lang === "hi" ? "नियमित (Routine)" : "Routine"}</option>
                    <option value="high">{lang === "hi" ? "उच्च (High)" : "High"}</option>
                    <option value="critical">{lang === "hi" ? "अति-महत्वपूर्ण (Critical)" : "Critical"}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === "hi" ? "श्रेणी" : "Category"}
                </label>
                <input
                  type="text"
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  placeholder={lang === "hi" ? "आहार / बायो-सुरक्षा / दवा" : "Feeding / Biosecurity / Medication"}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-emerald-800 bg-white dark:bg-[#071911] text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/60"
                >
                  {lang === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0F5132] hover:bg-[#15803d] text-white shadow-xs"
                >
                  {lang === "hi" ? "सुरक्षित करें" : "Save Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
