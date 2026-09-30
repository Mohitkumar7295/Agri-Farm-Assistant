export type AiLanguage = "en" | "hi";

export interface AiContent {
  header: {
    brandTitle: string;
    brandSubtitle: string;
    sectionTitle: string;
    mainTitle: string;
    subtitle: string;
    newChat: string;
    backHome: string;
  };
  sidebar: {
    newChatBtn: string;
    searchPlaceholder: string;
    contextHistoryHeading: string;
    recentHeading: string;
    todayHeading: string;
    previous7DaysHeading: string;
    dashboard: string;
    noConversations: string;
    clearHistory: string;
  };
  selectors: {
    domainLabel: string;
    fisheries: string;
    poultry: string;
    modeLabel: string;
    generalAi: string;
    batchAi: string;
    batchLabel: string;
    batchActiveBadge: string;
  };
  welcome: {
    heading: string;
    subheading: string;
    suggestedHeading: string;
    fisheriesQ1: string;
    fisheriesQ2: string;
    fisheriesQ3: string;
    fisheriesQ4: string;
    poultryQ1: string;
    poultryQ2: string;
    poultryQ3: string;
    poultryQ4: string;
  };
  input: {
    placeholderGeneral: string;
    placeholderBatchPrefix: string;
    sendTooltip: string;
    voiceTooltip: string;
    attachTooltip: string;
    voiceListening: string;
    disclaimer: string;
  };
  citations: {
    cifa: string;
    cari: string;
    verifiedBadge: string;
    safetyOverride: string;
  };
}

export const aiTranslations: Record<AiLanguage, AiContent> = {
  en: {
    header: {
      brandTitle: "AgriFarmAssistant",
      brandSubtitle: "Farm Management",
      sectionTitle: "AI Assistant",
      mainTitle: "AgriFarm AI Assistant",
      subtitle: "Your intelligent farming assistant for fisheries and poultry management.",
      newChat: "New Chat",
      backHome: "Dashboard",
    },
    sidebar: {
      newChatBtn: "+ New Chat",
      searchPlaceholder: "Search conversations...",
      contextHistoryHeading: "CONTEXT HISTORY",
      recentHeading: "RECENT CONVERSATIONS",
      todayHeading: "TODAY",
      previous7DaysHeading: "PREVIOUS 7 DAYS",
      dashboard: "Dashboard",
      noConversations: "No previous conversations found.",
      clearHistory: "Clear Chat History",
    },
    selectors: {
      domainLabel: "Farm Domain",
      fisheries: "Fisheries",
      poultry: "Poultry",
      modeLabel: "AI Mode",
      generalAi: "General AI",
      batchAi: "Batch AI",
      batchLabel: "Select Batch",
      batchActiveBadge: "Active Batch Context",
    },
    welcome: {
      heading: "How can I help with your farm?",
      subheading: "Get practical, data-driven guidance for your farm.",
      suggestedHeading: "Suggested Inquiries",
      fisheriesQ1: "How much feed should I give today?",
      fisheriesQ2: "Is my pond water quality suitable?",
      fisheriesQ3: "Why is fish growth slowing?",
      fisheriesQ4: "Calculate feed requirement",
      poultryQ1: "How much feed does this batch need?",
      poultryQ2: "Check today's batch health",
      poultryQ3: "Why is bird growth slowing?",
      poultryQ4: "Calculate feed requirement",
    },
    input: {
      placeholderGeneral: "Ask anything about farming...",
      placeholderBatchPrefix: "Ask about",
      sendTooltip: "Send message",
      voiceTooltip: "Voice input",
      attachTooltip: "Attach report or observation",
      voiceListening: "Listening to voice input...",
      disclaimer: "Verified against ICAR-CIFA & ICAR-CARI protocols. Real-time telemetry overrides apply.",
    },
    citations: {
      cifa: "ICAR-CIFA Freshwater Aquaculture Standards (Bhubaneswar)",
      cari: "ICAR-CARI Central Avian Research Standards (Izatnagar)",
      verifiedBadge: "Scientifically Verified",
      safetyOverride: "Safety Override Activated",
    },
  },
  hi: {
    header: {
      brandTitle: "कृषि-फार्म सहायक",
      brandSubtitle: "फार्म प्रबंधन",
      sectionTitle: "एआई सहायक",
      mainTitle: "कृषि-फार्म एआई सहायक",
      subtitle: "मत्स्य एवं कुक्कुट प्रबंधन हेतु आपका बुद्धिमान कृषि सहायक।",
      newChat: "नई बातचीत",
      backHome: "डैशबोर्ड",
    },
    sidebar: {
      newChatBtn: "+ नई बातचीत",
      searchPlaceholder: "बातचीत खोजें...",
      contextHistoryHeading: "संदर्भ इतिहास",
      recentHeading: "हाल की बातचीत",
      todayHeading: "आज",
      previous7DaysHeading: "पिछले 7 दिन",
      dashboard: "डैशबोर्ड",
      noConversations: "कोई पिछली बातचीत नहीं मिली।",
      clearHistory: "इतिहास साफ़ करें",
    },
    selectors: {
      domainLabel: "फार्म प्रभाग",
      fisheries: "मत्स्य पालन",
      poultry: "कुक्कुट पालन",
      modeLabel: "एआई मोड",
      generalAi: "सामान्य एआई",
      batchAi: "बैच एआई",
      batchLabel: "बैच चुनें",
      batchActiveBadge: "सक्रिय बैच संदर्भ",
    },
    welcome: {
      heading: "मैं आपके फार्म में क्या सहायता कर सकता हूँ?",
      subheading: "अपने फार्म के लिए व्यावहारिक एवं डेटा-संचालित वैज्ञानिक मार्गदर्शन प्राप्त करें।",
      suggestedHeading: "सुझाए गए प्रश्न",
      fisheriesQ1: "आज मुझे कितना आहार (चारा) देना चाहिए?",
      fisheriesQ2: "क्या मेरे तालाब के पानी की गुणवत्ता उपयुक्त है?",
      fisheriesQ3: "मछलियों की शारीरिक वृद्धि धीमी क्यों हो रही है?",
      fisheriesQ4: "दैनिक आहार आवश्यकता की गणना करें",
      poultryQ1: "इस बैच को आज कितने चारे की आवश्यकता है?",
      poultryQ2: "आज के बैच के स्वास्थ्य की जांच करें",
      poultryQ3: "पक्षियों की शारीरिक वृद्धि धीमी क्यों हो रही है?",
      poultryQ4: "दैनिक आहार आवश्यकता की गणना करें",
    },
    input: {
      placeholderGeneral: "खेती-किसानी के बारे में कुछ भी पूछें...",
      placeholderBatchPrefix: "के बारे में पूछें:",
      sendTooltip: "संदेश भेजें",
      voiceTooltip: "आवाज इनपुट",
      attachTooltip: "रिपोर्ट या निरीक्षण जोड़ें",
      voiceListening: "आवाज सुनी जा रही है...",
      disclaimer: "भाकृअनुप (ICAR-CIFA व ICAR-CARI) वैज्ञानिक मानकों द्वारा सत्यापित।",
    },
    citations: {
      cifa: "भाकृअनुप-सीआईएफए मीठे पानी के मत्स्य मानक (भुवनेश्वर)",
      cari: "भाकृअनुप-कारी केंद्रीय पक्षी अनुसंधान मानक (इज्जत नगर)",
      verifiedBadge: "वैज्ञानिक रूप से सत्यापित",
      safetyOverride: "सुरक्षा ओवरराइड सक्रिय",
    },
  },
};
