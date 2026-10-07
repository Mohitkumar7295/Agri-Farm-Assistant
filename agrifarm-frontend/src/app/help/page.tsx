"use client";

import React, { useState, useEffect } from "react";
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
  PhoneCall,
  Mail,
  MessageSquare,
  Search,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
  Send,
  ExternalLink,
  Sun,
  Moon,
  Globe,
  LifeBuoy,
  Phone,
} from "lucide-react";
import {
  dashboardTranslations,
  DashboardLanguage,
  DashboardContent,
} from "@/i18n/dashboardTranslations";

interface SupportTicket {
  id: string;
  category: string;
  priority: "normal" | "high" | "emergency";
  subject: string;
  message: string;
  contact: string;
  date: string;
  status: "Open" | "Under ICAR Review" | "Resolved";
}

const DEFAULT_FAQS = [
  {
    category: "fisheries",
    q_en: "What should I do immediately if dissolved oxygen falls below 3.5 mg/L?",
    q_hi: "यदि घुलित ऑक्सीजन (DO) 3.5 mg/L से कम हो जाए तो तुरंत क्या करें?",
    a_en: "1) Immediately start paddle-wheel aerators. 2) Stop feeding completely for 24 hours. 3) Exchange 15-20% pond water if clean freshwater is available. 4) Apply emergency sodium percarbonate (oxygen powder) at 2-3 kg/acre as recommended by ICAR-CIFA.",
    a_hi: "1) तुरंत पैडल-व्हील एरेटर चालू करें। 2) 24 घंटे के लिए दाना देना पूरी तरह बंद कर दें। 3) यदि उपलब्ध हो तो 15-20% ताजा पानी बदलें। 4) आईसीएआर-सीआईएफए के अनुसार 2-3 किग्रा/एकड़ की दर से आपातकालीन ऑक्सीजन पाउडर का छिड़काव करें।",
  },
  {
    category: "fisheries",
    q_en: "How to manage high toxic ammonia (NH3 > 0.05 mg/L) in ponds?",
    q_hi: "तालाब में अत्यधिक विषैले अमोनिया (NH3 > 0.05 mg/L) का प्रबंधन कैसे करें?",
    a_en: "Reduce feeding rate by 50%. Apply agricultural lime (CaCO3) at 100-150 kg/hectare if pH is acidic. Add probiotics or molasses (carbon source) at 10-20 kg/acre to stimulate beneficial heterotrophic bacteria.",
    a_hi: "आहार दर को 50% कम करें। यदि pH कम है तो 100-150 किग्रा/हेक्टेयर चूना डालें। फायदेमंद बैक्टीरिया को सक्रिय करने के लिए 10-20 किग्रा/एकड़ गुड़ (गुड़ का शीरा) या प्रोबायोटिक का उपयोग करें।",
  },
  {
    category: "poultry",
    q_en: "What is the benchmark FCR for Broilers at 35-42 days?",
    q_hi: "35-42 दिनों पर ब्रॉयलर कुक्कुट के लिए मानक एफसीआर (FCR) क्या है?",
    a_en: "According to ICAR-DPR guidelines, commercial broilers should achieve an FCR between 1.50 and 1.65 at 2.0-2.2 kg body weight. FCR above 1.8 indicates feed wastage, high temperature stress, or enteric health issues.",
    a_hi: "आईसीएआर-डीपीआर के अनुसार, 2.0-2.2 किग्रा शरीर के वजन पर ब्रॉयलर का एफसीआर 1.50 से 1.65 के बीच होना चाहिए। 1.8 से अधिक एफसीआर दाने की बर्बादी या तनाव का संकेत है।",
  },
  {
    category: "poultry",
    q_en: "What is the mandatory vaccination schedule for commercial chicks?",
    q_hi: "व्यावसायिक चूजों के लिए अनिवार्य टीकाकरण समय-सारणी क्या है?",
    a_en: "Day 1: Marek's disease (at hatchery). Day 5-7: Newcastle Disease (Ranikhet Lasota F1) eye-drop. Day 14: Infectious Bursal Disease (Gumboro) oral. Day 21: Lasota booster.",
    a_hi: "दिन 1: मैरेक रोग (हैचरी स्तर पर)। दिन 5-7: रानीखेत (लासोता F1) आंख की बूंद। दिन 14: गंबोरो (आईबीडी) मुंह से। दिन 21: रानीखेत लासोता बूस्टर खुराक।",
  },
  {
    category: "expenses",
    q_en: "How is batch-wise unit production cost calculated?",
    q_hi: "बैच-वार इकाई उत्पादन लागत की गणना कैसे की जाती है?",
    a_en: "Unit production cost equals total expenses allocated to that specific batch (feed, seed/chicks, medicine, electricity, labor) divided by current total harvestable biomass (kg for fish or live count for poultry birds).",
    a_hi: "इकाई उत्पादन लागत = उस विशिष्ट बैच पर कुल खर्च (दाना, बीज/चूजे, दवा, बिजली, मजदूरी) ÷ कुल तैयार बायोमास (मछली हेतु किग्रा या मुर्गियों की संख्या)।",
  },
  {
    category: "system",
    q_en: "Can I use AgriFarm Assistant on low-connectivity rural networks?",
    q_hi: "क्या मैं कम इंटरनेट कनेक्टिविटी वाले ग्रामीण क्षेत्रों में ऐप का उपयोग कर सकता हूं?",
    a_en: "Yes. All batch data, tasks, and expense ledgers are saved locally on your device storage first. Network connectivity is only required for real-time weather forecasts and cloud sync.",
    a_hi: "हाँ। सभी बैच डेटा, कार्य और व्यय आपके डिवाइस पर सुरक्षित रहते हैं। इंटरनेट की आवश्यकता केवल लाइव मौसम पूर्वानुमान और सिंक के समय होती है।",
  },
];

export default function HelpSupportPage() {
  const router = useRouter();
  const [lang, setLang] = useState<DashboardLanguage>("en");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // FAQ filters & accordions
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState<string>("all");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Ticket form
  const [ticketForm, setTicketForm] = useState({
    category: "fisheries",
    priority: "normal" as "normal" | "high" | "emergency",
    subject: "",
    message: "",
    contact: "",
  });
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketSuccessMsg, setTicketSuccessMsg] = useState<string | null>(null);

  const content: DashboardContent = dashboardTranslations[lang];

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

    // Load contact info
    const savedFarmerName = localStorage.getItem("agrifarm_farmer_name");
    const savedUserJson = localStorage.getItem("agrifarm_user");
    let contactInfo = "";
    if (savedUserJson) {
      try {
        const u = JSON.parse(savedUserJson);
        contactInfo = u.email || u.phoneNumber || "";
      } catch {
        // ignore
      }
    }
    if (!contactInfo && savedFarmerName) {
      contactInfo = savedFarmerName;
    }
    setTicketForm((prev) => ({ ...prev, contact: contactInfo }));

    // Load existing tickets
    const savedTickets = localStorage.getItem("agrifarm_support_tickets");
    if (savedTickets) {
      try {
        setTickets(JSON.parse(savedTickets));
      } catch {
        // fallback
      }
    } else {
      // Baseline sample
      const initialTicket: SupportTicket = {
        id: "TKT-2026-4821",
        category: "fisheries",
        priority: "normal",
        subject: "Pond 1 Water Bloom Management",
        message: "Requested advice on microcystis algae bloom after heavy monsoon rain.",
        contact: contactInfo || "farmer@agrifarm.in",
        date: "2026-10-05",
        status: "Resolved",
      };
      setTickets([initialTicket]);
      localStorage.setItem("agrifarm_support_tickets", JSON.stringify([initialTicket]));
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

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) return;

    const newTicket: SupportTicket = {
      id: `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      category: ticketForm.category,
      priority: ticketForm.priority,
      subject: ticketForm.subject.trim(),
      message: ticketForm.message.trim(),
      contact: ticketForm.contact.trim() || "Registered Farmer",
      date: new Date().toISOString().slice(0, 10),
      status: "Under ICAR Review",
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    localStorage.setItem("agrifarm_support_tickets", JSON.stringify(updated));

    setTicketSuccessMsg(
      lang === "hi"
        ? `टिकट दर्ज किया गया! संदर्भ संख्या: ${newTicket.id} (आईसीएआर विशेषज्ञ 24 घंटे में समीक्षा करेंगे)`
        : `Support ticket submitted! Ref #${newTicket.id} (Agronomist SLA: within 24 hours)`
    );

    setTicketForm((prev) => ({
      ...prev,
      subject: "",
      message: "",
    }));

    setTimeout(() => setTicketSuccessMsg(null), 6000);
  };

  const filteredFaqs = DEFAULT_FAQS.filter((faq) => {
    const matchesCat = faqCategory === "all" || faq.category === faqCategory;
    const qText = (lang === "hi" ? faq.q_hi : faq.q_en).toLowerCase();
    const aText = (lang === "hi" ? faq.a_hi : faq.a_en).toLowerCase();
    const matchesSearch =
      !faqSearch || qText.includes(faqSearch.toLowerCase()) || aText.includes(faqSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const navItems = [
    { key: "home", label: content.nav.home, icon: Home, href: "/dashboard" },
    { key: "fisheries", label: content.nav.fisheries, icon: Waves, href: "/fisheries" },
    { key: "poultry", label: content.nav.poultry, icon: Feather, href: "/poultry" },
    { key: "tasks", label: content.nav.tasks, icon: CheckSquare, href: "/tasks" },
    { key: "weather", label: content.nav.weather, icon: CloudSun, href: "/weather" },
    { key: "alerts", label: content.nav.alerts, icon: Bell, href: "/alerts" },
    { key: "expense", label: content.nav.expense, icon: Receipt, href: "/expense" },
    { key: "aiAssistant", label: content.nav.aiAssistant, icon: Bot, href: "/ai-assistant" },
    { key: "helpSupport", label: content.nav.helpSupport, icon: HelpCircle, href: "/help", active: true },
    { key: "settings", label: content.nav.settings, icon: SettingsIcon, href: "/settings" },
  ];

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark bg-slate-950 text-slate-100" : "bg-[#F8FAF9] text-slate-800"} flex flex-col`}>
      {/* ========================================================================= */}
      {/* 1. DESKTOP SIDEBAR                                                        */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed inset-y-0 left-0 z-30">
        <div className="flex items-center gap-3 px-6 h-20 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F5132] to-[#198754] flex items-center justify-center text-white shadow-md shadow-emerald-900/10 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-base font-extrabold text-[#0F5132] dark:text-emerald-400 block leading-tight tracking-tight truncate">
              {content.nav.brandTitle}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
              {lang === "hi" ? "सहायता व सहयोग" : "Help & Support Desk"}
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
            <span className="font-bold text-[#0F5132] dark:text-emerald-400">ICAR Kisan Advisory</span>
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
            <HelpCircle className="w-5 h-5 text-[#0F5132] dark:text-emerald-400" />
            <span className="text-sm font-black text-[#0F5132] dark:text-emerald-400">
              {lang === "hi" ? "सहायता व सहयोग" : "Help & Support"}
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
                  <HelpCircle className="w-5 h-5 text-[#0F5132] dark:text-emerald-400" />
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
                <LifeBuoy className="w-3.5 h-3.5 text-[#0F5132] dark:text-emerald-400" />
                <span>{lang === "hi" ? "24x7 किसान सहायता केंद्र" : "Farmer Help & Technical Advisory"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F5132] dark:text-emerald-400 tracking-tight">
                {lang === "hi" ? "सहायता व सहयोग केंद्र" : "Help & Support Center"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                {lang === "hi"
                  ? "आईसीएआर हेल्पलाइन नंबर, वैज्ञानिक परामर्श, तकनीकी टिकट और अक्सर पूछे जाने वाले प्रश्न।"
                  : "National ICAR agricultural helplines, scientific agronomy advice, ticket tracking, and knowledge base."}
              </p>
            </div>

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
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* SECTION 1: Emergency National Helplines */}
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>{lang === "hi" ? "आपातकालीन किसान व आईसीएआर हेल्पलाइन" : "Official ICAR & Government Helplines"}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Kisan Call Centre */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#0F5132] dark:text-emerald-400 flex items-center justify-center mb-3">
                    <Phone className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Kisan Call Centre (KCC)</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {lang === "hi" ? "24x7 सभी भारतीय भाषाओं में निःशुल्क कृषि सलाह" : "24x7 toll-free all Indian languages agronomist support"}
                  </p>
                </div>
                <a
                  href="tel:18001801551"
                  className="mt-4 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-[#0F5132] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>1800-180-1551</span>
                </a>
              </div>

              {/* Card 2: ICAR-CIFA */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-400 flex items-center justify-center mb-3">
                    <Waves className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">ICAR-CIFA Aqua Helpdesk</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {lang === "hi" ? "मीठे पानी में मछली रोग व जल गुणवत्ता आपातकालीन सलाह" : "Freshwater fish diseases, water quality & IMC breeding"}
                  </p>
                </div>
                <a
                  href="tel:+916742465421"
                  className="mt-4 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>+91-674-2465421</span>
                </a>
              </div>

              {/* Card 3: ICAR-DPR */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center justify-center mb-3">
                    <Feather className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">ICAR-DPR Poultry Desk</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {lang === "hi" ? "कुक्कुट बायोसिक्योरिटी, टीकाकरण व आहार सूत्रीकरण" : "Flock health, viral epidemic prevention & feed formulas"}
                  </p>
                </div>
                <a
                  href="tel:+914024015651"
                  className="mt-4 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>+91-40-24015651</span>
                </a>
              </div>

              {/* Card 4: PMMSY Scheme Helpdesk */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#0F5132] dark:text-emerald-400 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">PM Matsya Sampada (PMMSY)</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {lang === "hi" ? "सरकारी सब्सिडी, तालाब निर्माण व केसीसी ऋण मार्गदर्शन" : "Fisheries subsidies, infrastructure grants & KCC loans"}
                  </p>
                </div>
                <a
                  href="tel:18004251660"
                  className="mt-4 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-[#0F5132] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>1800-425-1660</span>
                </a>
              </div>
            </div>
          </div>

          {/* SECTION 2: Raise a Ticket & Open Tickets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Ticket Submission Form */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#0F5132] dark:text-emerald-400">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                    {lang === "hi" ? "सहायता टिकट दर्ज करें" : "Submit a Technical or Agronomy Ticket"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === "hi"
                      ? "समस्या का विवरण दर्ज करें, आईसीएआर कृषि वैज्ञानिक टीम समीक्षा करेगी।"
                      : "Direct connection with our aquaculture & poultry agronomist response team."}
                  </p>
                </div>
              </div>

              {ticketSuccessMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-[#0F5132] dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{ticketSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === "hi" ? "विभाग / विषय श्रेणी" : "Department Category"}
                    </label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="fisheries">{lang === "hi" ? "मत्स्य पालन (Water Quality / Fish Disease)" : "Fisheries (Water Quality / Health)"}</option>
                      <option value="poultry">{lang === "hi" ? "कुक्कुट पालन (Poultry Mortality / Vaccine)" : "Poultry (Mortality / Vaccine)"}</option>
                      <option value="tasks">{lang === "hi" ? "दैनिक कार्य प्रबंधन (Task Management)" : "Daily Tasks & Schedules"}</option>
                      <option value="expense">{lang === "hi" ? "व्यय बहीखाता (Expense Ledger & Audit)" : "Expense Ledger & Audits"}</option>
                      <option value="technical">{lang === "hi" ? "ऐप तकनीकी समस्या (App / Sensor Bug)" : "App & Sensor Diagnostics"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === "hi" ? "प्राथमिकता स्तर" : "Priority Severity"}
                    </label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value as "normal" | "high" | "emergency" })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="normal">{lang === "hi" ? "सामान्य (Normal - 24-48 hrs)" : "Normal (Response 24-48 hrs)"}</option>
                      <option value="high">{lang === "hi" ? "उच्च (High - 12 hrs)" : "High (Response within 12 hrs)"}</option>
                      <option value="emergency">{lang === "hi" ? "अति-गंभीर फार्म आपातकाल (Immediate)" : "Critical Farm Emergency (Immediate)"}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "hi" ? "विषय / समस्या संक्षेप" : "Subject Summary"}
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    placeholder={lang === "hi" ? "उदा. तालाब 2 में ऑक्सीजन स्तर गिर रहा है..." : "e.g., Pond 2 morning DO level dropping rapidly"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "hi" ? "विस्तृत विवरण" : "Detailed Description"}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                    placeholder={lang === "hi" ? "लक्षण, बैच संख्या, पानी का रंग या असामान्य संकेत..." : "Describe observations, batch id, water color, mortality count, feed intake changes..."}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "hi" ? "संपर्क फोन / ईमेल" : "Callback Phone / Email"}
                  </label>
                  <input
                    type="text"
                    value={ticketForm.contact}
                    onChange={(e) => setTicketForm({ ...ticketForm, contact: e.target.value })}
                    placeholder="+91 XXXXX XXXXX or email"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F5132] hover:bg-[#157347] transition-all cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === "hi" ? "टिकट भेजें" : "Submit Ticket"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* My Active Tickets */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0F5132] dark:text-emerald-400" />
                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                      {lang === "hi" ? "हाल के समर्थन टिकट" : "Recent Support Tickets"}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-[#0F5132] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {tickets.length} {lang === "hi" ? "कुल" : "Total"}
                  </span>
                </div>

                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {tickets.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      {lang === "hi" ? "कोई सक्रिय टिकट नहीं है।" : "No tickets logged yet."}
                    </div>
                  ) : (
                    tickets.map((t) => (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-[#0F5132] dark:text-emerald-400 font-mono">
                            {t.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              t.status === "Resolved"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{t.subject}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{t.message}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                          <span className="capitalize">{t.category}</span>
                          <span>{t.date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Direct channels */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <a
                  href="mailto:support@agrifarmassistant.in"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-700" />
                  <span>support@agrifarmassistant.in</span>
                </a>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{lang === "hi" ? "व्हाट्सएप पर कृषि सलाहकार से चैट करें" : "Chat on WhatsApp"}</span>
                </a>
              </div>
            </div>
          </div>

          {/* SECTION 3: Knowledge Base / FAQ */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                  {lang === "hi" ? "अक्सर पूछे जाने वाले प्रश्न (FAQ)" : "ICAR Knowledge Base & FAQs"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === "hi"
                    ? "जलीय कृषि, कुक्कुट प्रबंधन और फार्म संचालन संबंधी वैज्ञानिक समाधान।"
                    : "Scientifically vetted solutions for aquaculture, poultry health, and system management."}
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder={lang === "hi" ? "प्रश्न खोजें..." : "Search answers..."}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: "all", label_en: "All Topics", label_hi: "सभी विषय" },
                { key: "fisheries", label_en: "Aquaculture & Fish", label_hi: "मत्स्य पालन" },
                { key: "poultry", label_en: "Poultry & Flocks", label_hi: "कुक्कुट पालन" },
                { key: "expenses", label_en: "Financials & Ledgers", label_hi: "खर्च व वित्त" },
                { key: "system", label_en: "App & Offline", label_hi: "सिस्टम व ऐप" },
              ].map((pill) => (
                <button
                  key={pill.key}
                  type="button"
                  onClick={() => setFaqCategory(pill.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    faqCategory === pill.key
                      ? "bg-[#0F5132] text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {lang === "hi" ? pill.label_hi : pill.label_en}
                </button>
              ))}
            </div>

            {/* FAQ Accordions */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  {lang === "hi" ? "कोई संबंधित प्रश्न नहीं मिला।" : "No questions matched your search query."}
                </div>
              ) : (
                filteredFaqs.map((faq, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isOpen ? null : idx)}
                        className="w-full text-left px-4 py-3.5 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
                      >
                        <span>{lang === "hi" ? faq.q_hi : faq.q_en}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-4 py-3.5 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                          {lang === "hi" ? faq.a_hi : faq.a_en}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
