export type SupportedLanguage = "en" | "hi";

export interface LandingContent {
  nav: {
    brandTitle: string;
    brandSubtitle: string;
    navAquaculture: string;
    navPoultry: string;
    navAiCore: string;
    navWeather: string;
    navProtocols: string;
    signIn: string;
    launchPortal: string;
  };
  hero: {
    badge: string;
    headingLine1: string;
    headingLine2: string;
    subtext: string;
    btnGetStarted: string;
    btnExplore: string;
    tagline: string;
    showcase: {
      liveStatus: string;
      tabFisheries: string;
      tabPoultry: string;
      fisheriesTitle: string;
      fisheriesSub: string;
      waterMetric: string;
      biomassMetric: string;
      feedMetric: string;
      poultryTitle: string;
      poultrySub: string;
      birdsMetric: string;
      tempMetric: string;
      mortalityMetric: string;
      aiTipFish: string;
      aiTipPoultry: string;
      viewDashboardBtn: string;
    };
  };
  intro: {
    heading: string;
    description: string;
    card1Title: string;
    card1Desc: string;
    card1Btn: string;
    card2Title: string;
    card2Desc: string;
    card2Btn: string;
  };
  fisheries: {
    heading: string;
    description: string;
    f1Title: string;
    f1Desc: string;
    f2Title: string;
    f2Desc: string;
    f3Title: string;
    f3Desc: string;
    f4Title: string;
    f4Desc: string;
    f5Title: string;
    f5Desc: string;
    f6Title: string;
    f6Desc: string;
    btn: string;
  };
  fisheriesVideo: {
    headingLine1: string;
    headingLine2: string;
    subtext: string;
    btn: string;
  };
  species: {
    heading: string;
    description: string;
    items: string[];
  };
  fishDashboard: {
    heading: string;
    description: string;
    badgeDemo: string;
    m1Label: string;
    m1Value: string;
    m2Label: string;
    m2Value: string;
    m3Label: string;
    m3Value: string;
    m4Label: string;
    m4Value: string;
    m5Label: string;
    m5Value: string;
    m6Label: string;
    m6Value: string;
    growthChartTitle: string;
    feedTrendTitle: string;
    btn: string;
  };
  waterQuality: {
    heading: string;
    description: string;
    p1Label: string;
    p1Value: string;
    p1Status: string;
    p2Label: string;
    p2Value: string;
    p2Status: string;
    p3Label: string;
    p3Value: string;
    p3Status: string;
    p4Label: string;
    p4Value: string;
    p4Status: string;
    btn: string;
  };
  aiAssistant: {
    heading: string;
    description: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
    chatFarmerLabel: string;
    chatFarmerText: string;
    chatAiLabel: string;
    chatAiText: string;
    disclaimer: string;
    btn: string;
  };
  poultry: {
    heading: string;
    description: string;
    f1Title: string;
    f1Desc: string;
    f2Title: string;
    f2Desc: string;
    f3Title: string;
    f3Desc: string;
    f4Title: string;
    f4Desc: string;
    f5Title: string;
    f5Desc: string;
    f6Title: string;
    f6Desc: string;
    btn: string;
  };
  poultryVideo: {
    heading: string;
    subtext: string;
    btn: string;
  };
  poultryDashboard: {
    heading: string;
    description: string;
    badgeDemo: string;
    m1Label: string;
    m1Value: string;
    m2Label: string;
    m2Value: string;
    m3Label: string;
    m3Value: string;
    m4Label: string;
    m4Value: string;
    m5Label: string;
    m5Value: string;
    m6Label: string;
    m6Value: string;
    chartTitle: string;
    btn: string;
  };
  weather: {
    heading: string;
    description: string;
    tempLabel: string;
    tempValue: string;
    humidityLabel: string;
    humidityValue: string;
    rainLabel: string;
    rainValue: string;
    windLabel: string;
    windValue: string;
    forecastLabel: string;
    forecastDays: { day: string; condition: string; temp: string }[];
    btn: string;
  };
  weatherInsights: {
    heading: string;
    description: string;
    c1Title: string;
    c1Desc: string;
    c2Title: string;
    c2Desc: string;
    c3Title: string;
    c3Desc: string;
    c4Title: string;
    c4Desc: string;
    guidanceNote: string;
  };
  alerts: {
    heading: string;
    description: string;
    item1: { title: string; desc: string; type: string };
    item2: { title: string; desc: string; type: string };
    item3: { title: string; desc: string; type: string };
    item4: { title: string; desc: string; type: string };
    item5: { title: string; desc: string; type: string };
    btn: string;
  };
  expenses: {
    heading: string;
    description: string;
    categoriesTitle: string;
    categories: string[];
    m1Label: string;
    m1Value: string;
    m2Label: string;
    m2Value: string;
    m3Label: string;
    m3Value: string;
    m4Label: string;
    m4Value: string;
    btn: string;
  };
  analytics: {
    heading: string;
    description: string;
    fishTitle: string;
    fishItems: string[];
    poultryTitle: string;
    poultryItems: string[];
    btn: string;
  };
  farmBatchMgmt: {
    heading: string;
    description: string;
    tree1Title: string;
    tree1Step1: string;
    tree1Step2: string;
    tree1Step3: string;
    tree2Title: string;
    tree2Step1: string;
    tree2Step2: string;
    tree2Step3: string;
  };
  dailyBrief: {
    heading: string;
    description: string;
    greeting: string;
    cardTitle: string;
    i1Label: string;
    i1Value: string;
    i2Label: string;
    i2Value: string;
    i3Label: string;
    i3Value: string;
    i4Label: string;
    i4Value: string;
    i5Label: string;
    i5Value: string;
    emailNote: string;
    btn: string;
  };
  languageSec: {
    heading: string;
    description: string;
    toggleLabel: string;
  };
  mobileMgmt: {
    heading: string;
    description: string;
    b1: string;
    b2: string;
    b3: string;
    b4: string;
    b5: string;
    b6: string;
  };
  howItWorks: {
    heading: string;
    s1Num: string;
    s1Title: string;
    s1Desc: string;
    s2Num: string;
    s2Title: string;
    s2Desc: string;
    s3Num: string;
    s3Title: string;
    s3Desc: string;
    s4Num: string;
    s4Title: string;
    s4Desc: string;
  };
  featureSummary: {
    heading: string;
    items: { title: string; desc: string }[];
  };
  about: {
    heading: string;
    description: string;
    goalTitle: string;
    goalDesc: string;
  };
  finalCta: {
    heading: string;
    description: string;
    btnGetStarted: string;
    btnOpenDashboard: string;
  };
  footer: {
    brandTitle: string;
    tagline: string;
    col1Title: string;
    links: { label: string; href: string }[];
    otherTitle: string;
    otherLinks: { label: string; href: string }[];
    copyright: string;
  };
  authModal: {
    title: string;
    subtitle: string;
    description: string;
    featurePrompt: string;
    proceedButton: string;
    cancelButton: string;
  };
}

export const landingTranslations: Record<SupportedLanguage, LandingContent> = {
  en: {
    nav: {
      brandTitle: "AgriFarmAssistant",
      brandSubtitle: "Farm Management Platform",
      navAquaculture: "Fisheries",
      navPoultry: "Poultry",
      navAiCore: "AI Assistant",
      navWeather: "Weather",
      navProtocols: "Platform",
      signIn: "Login",
      launchPortal: "Dashboard",
    },
    hero: {
      badge: "AI-POWERED FARM MANAGEMENT",
      headingLine1: "Smart Farming.",
      headingLine2: "Better Decisions.",
      subtext:
        "Manage fisheries and poultry farms with AI, farm data, weather insights, and simple digital tools.",
      btnGetStarted: "Get Started",
      btnExplore: "Explore Platform",
      tagline: "Fisheries • Poultry • AI • Weather",
      showcase: {
        liveStatus: "Live Farm Console",
        tabFisheries: "Fisheries (Pond 01)",
        tabPoultry: "Poultry (Shed A)",
        fisheriesTitle: "Pond 01: Pangasius & Rohu",
        fisheriesSub: "Depth 5.2 ft • Dissolved Oxygen Optimal",
        waterMetric: "DO 6.4 mg/L",
        biomassMetric: "12,580 kg",
        feedMetric: "185 kg/day",
        poultryTitle: "Shed A: Broiler Flock #12",
        poultrySub: "Day 32 • Active Ventilation • Climate Normal",
        birdsMetric: "4,850 Birds",
        tempMetric: "28.5 °C",
        mortalityMetric: "0.02% (Normal)",
        aiTipFish: "Pond aeration on schedule. Water parameters within optimal limits.",
        aiTipPoultry: "Thermal index normal. Fan ventilation maintaining recommended airflow.",
        viewDashboardBtn: "Open Live Dashboard →",
      },
    },
    intro: {
      heading: "One Platform. Two Farming Domains.",
      description:
        "Manage your fisheries and poultry operations from one simple platform.",
      card1Title: "Fisheries",
      card1Desc:
        "Manage ponds, fish batches, feeding, water parameters, growth and farm performance.",
      card1Btn: "Explore Fisheries →",
      card2Title: "Poultry",
      card2Desc:
        "Manage poultry batches, feeding, health records, mortality, expenses and performance.",
      card2Btn: "Explore Poultry →",
    },
    fisheries: {
      heading: "Smart Fisheries Management",
      description: "Manage your ponds and fish batches from stocking to harvest.",
      f1Title: "Pond Management",
      f1Desc: "Track pond information and conditions.",
      f2Title: "Batch Management",
      f2Desc: "Organize fish species and batches.",
      f3Title: "Feed Management",
      f3Desc: "Track feeding and feed requirements.",
      f4Title: "Growth Tracking",
      f4Desc: "Monitor weight, biomass and growth.",
      f5Title: "Water Monitoring",
      f5Desc: "Record important water parameters.",
      f6Title: "Expense Tracking",
      f6Desc: "Manage farm costs and expenses.",
      btn: "Open Fisheries Dashboard →",
    },
    fisheriesVideo: {
      headingLine1: "Better Pond Management",
      headingLine2: "Starts With Better Data.",
      subtext: "Monitor. Understand. Improve.",
      btn: "Explore Fisheries →",
    },
    species: {
      heading: "Manage Your Fish Batches",
      description: "Keep species and batch information organized in one place.",
      items: [
        "Pangasius",
        "Rohu",
        "Catla",
        "Mrigal",
        "Common Carp",
        "Grass Carp",
        "Roopchand",
        "Black Carp",
        "Bighead Carp",
      ],
    },
    fishDashboard: {
      heading: "Your Pond, At a Glance",
      description: "Track the numbers that matter.",
      badgeDemo: "Sample Overview",
      m1Label: "Total Fish",
      m1Value: "18,500",
      m2Label: "Average Weight",
      m2Value: "680 g",
      m3Label: "Total Biomass",
      m3Value: "12,580 kg",
      m4Label: "Feed Consumed",
      m4Value: "420 kg / wk",
      m5Label: "Water Quality",
      m5Value: "Optimal (DO 6.2)",
      m6Label: "Farm Expenses",
      m6Value: "₹ 48,200",
      growthChartTitle: "Biomass Growth Curve",
      feedTrendTitle: "Weekly Feeding Rate",
      btn: "View Fisheries Analytics →",
    },
    waterQuality: {
      heading: "Know Your Water",
      description:
        "Monitor important water parameters and identify conditions that need attention.",
      p1Label: "pH Level",
      p1Value: "7.6",
      p1Status: "Normal Range",
      p2Label: "Temperature",
      p2Value: "28.5 °C",
      p2Status: "Optimal",
      p3Label: "Dissolved Oxygen",
      p3Value: "6.4 mg/L",
      p3Status: "Good",
      p4Label: "Water Level",
      p4Value: "5.2 ft",
      p4Status: "Adequate Depth",
      btn: "View Water Data →",
    },
    aiAssistant: {
      heading: "Your AI Farm Assistant",
      description: "Ask questions. Get practical farming guidance.",
      card1Title: "Fisheries AI",
      card1Desc:
        "Get guidance for fish farming, feeding, water quality and pond management.",
      card2Title: "Poultry AI",
      card2Desc:
        "Get guidance for flock management, feeding, health and farm conditions.",
      card3Title: "Farm-Aware AI",
      card3Desc:
        "Get more relevant responses using your farm and batch information.",
      chatFarmerLabel: "Farmer",
      chatFarmerText: "My Pangasius are not eating properly. What should I check?",
      chatAiLabel: "Farm AI",
      chatAiText:
        "Check recent changes in water temperature, dissolved oxygen, water quality and feeding conditions.",
      disclaimer:
        "Note: Farm AI provides general farming guidance and is not a substitute for professional veterinary or clinical advice.",
      btn: "Ask Farm AI →",
    },
    poultry: {
      heading: "Smart Poultry Management",
      description:
        "Manage your poultry batches, feeding, health, mortality and expenses in one place.",
      f1Title: "Batch Management",
      f1Desc: "Track each flock from placement to sale.",
      f2Title: "Feed Tracking",
      f2Desc: "Monitor feed consumption and costs.",
      f3Title: "Health Records",
      f3Desc: "Record health observations and important events.",
      f4Title: "Mortality Tracking",
      f4Desc: "Track mortality and changes over time.",
      f5Title: "Environment",
      f5Desc: "Monitor important environmental conditions.",
      f6Title: "Expense Management",
      f6Desc: "Keep poultry costs organized.",
      btn: "Open Poultry Dashboard →",
    },
    poultryVideo: {
      heading: "Smarter Poultry Management",
      subtext: "Track your flock. Understand your farm.",
      btn: "Explore Poultry →",
    },
    poultryDashboard: {
      heading: "Your Flock, At a Glance",
      description: "Simple numbers. Clear decisions.",
      badgeDemo: "Sample Overview",
      m1Label: "Total Birds",
      m1Value: "4,850",
      m2Label: "Average Weight",
      m2Value: "1.85 kg",
      m3Label: "Feed Consumed",
      m3Value: "3,120 kg",
      m4Label: "Mortality Rate",
      m4Value: "1.2% (Normal)",
      m5Label: "Batch Age",
      m5Value: "Day 32",
      m6Label: "Total Expenses",
      m6Value: "₹ 92,400",
      chartTitle: "Flock Weight Target vs Actual",
      btn: "View Poultry Dashboard →",
    },
    weather: {
      heading: "Weather for Your Farm",
      description: "Check current conditions and forecasts for your farm location.",
      tempLabel: "Temperature",
      tempValue: "31°C",
      humidityLabel: "Humidity",
      humidityValue: "74%",
      rainLabel: "Rainfall",
      rainValue: "0 mm",
      windLabel: "Wind",
      windValue: "12 km/h NE",
      forecastLabel: "3-Day Forecast",
      forecastDays: [
        { day: "Today", condition: "Partly Cloudy", temp: "31° / 24°C" },
        { day: "Tomorrow", condition: "Light Rain", temp: "29° / 23°C" },
        { day: "Wednesday", condition: "Sunny", temp: "32° / 24°C" },
      ],
      btn: "View Weather →",
    },
    weatherInsights: {
      heading: "Weather Meets Farm Data",
      description:
        "Use weather information alongside your farm records to support day-to-day decisions.",
      c1Title: "Rain Alert",
      c1Desc: "Prepare for changing farm conditions.",
      c2Title: "Temperature",
      c2Desc: "Monitor temperature-sensitive farm conditions.",
      c3Title: "Strong Wind",
      c3Desc: "Check outdoor equipment and structures.",
      c4Title: "Heat",
      c4Desc: "Pay attention to water and environmental conditions.",
      guidanceNote: "Guidance based on local weather conditions.",
    },
    alerts: {
      heading: "Important Updates, When You Need Them",
      description:
        "Get timely alerts for weather, farm activities and important changes.",
      item1: {
        title: "Weather Alert",
        desc: "Forecast indicates rain tomorrow morning.",
        type: "Weather",
      },
      item2: {
        title: "Feeding Reminder",
        desc: "Morning feeding scheduled for Pond 2.",
        type: "Feeding",
      },
      item3: {
        title: "Water Quality Alert",
        desc: "Check DO levels in Pond 1 before afternoon.",
        type: "Water",
      },
      item4: {
        title: "Batch Update",
        desc: "Batch 04 sampling due this Thursday.",
        type: "Batch",
      },
      item5: {
        title: "Farm Activity",
        desc: "Vaccine check completed for Shed A.",
        type: "Activity",
      },
      btn: "View Alerts →",
    },
    expenses: {
      heading: "Know Where Your Money Goes",
      description: "Track farm expenses and understand your operating costs.",
      categoriesTitle: "Expense Categories",
      categories: [
        "Feed",
        "Medicine",
        "Labour",
        "Electricity",
        "Equipment",
        "Transportation",
        "Other",
      ],
      m1Label: "Today",
      m1Value: "₹ 1,850",
      m2Label: "This Month",
      m2Value: "₹ 48,200",
      m3Label: "Total Cost",
      m3Value: "₹ 1,40,650",
      m4Label: "Cost per Batch",
      m4Value: "₹ 35,160",
      btn: "Manage Expenses →",
    },
    analytics: {
      heading: "Understand Your Farm Through Data",
      description: "Turn farm records into simple, useful insights.",
      fishTitle: "Fisheries Analytics",
      fishItems: [
        "Fish Growth",
        "Biomass",
        "Feed Consumption",
        "FCR",
        "Mortality",
        "Expenses",
      ],
      poultryTitle: "Poultry Analytics",
      poultryItems: [
        "Weight Growth",
        "Feed Consumption",
        "Mortality",
        "FCR",
        "Batch Performance",
        "Expenses",
      ],
      btn: "View Analytics →",
    },
    farmBatchMgmt: {
      heading: "Manage Every Farm and Batch",
      description: "Keep farms, ponds, sheds and batches organized separately.",
      tree1Title: "Fisheries Management Hierarchy",
      tree1Step1: "Farm",
      tree1Step2: "Pond",
      tree1Step3: "Fish Batch",
      tree2Title: "Poultry Management Hierarchy",
      tree2Step1: "Poultry Farm",
      tree2Step2: "Shed",
      tree2Step3: "Poultry Batch",
    },
    dailyBrief: {
      heading: "Start Every Day With a Farm Brief",
      description: "Get a simple summary of important farm information and tasks.",
      greeting: "Good Morning",
      cardTitle: "Today's Farm Brief",
      i1Label: "Weather",
      i1Value: "31°C, Partly Cloudy",
      i2Label: "Batches",
      i2Value: "4 Active Ponds, 2 Sheds",
      i3Label: "Feed Required",
      i3Value: "185 kg total planned",
      i4Label: "Water Check",
      i4Value: "Pond 1 & 2 Normal",
      i5Label: "Alerts",
      i5Value: "1 Feeding Reminder",
      emailNote: "Daily farm updates can also be delivered by email.",
      btn: "View Farm →",
    },
    languageSec: {
      heading: "Your Farm. Your Language.",
      description: "Use AgriFarmAssistant in English or Hindi.",
      toggleLabel: "English | हिंदी",
    },
    mobileMgmt: {
      heading: "Your Farm, Wherever You Are",
      description:
        "Access farm information, AI assistance, alerts and analytics from your phone.",
      b1: "Check farm data",
      b2: "Ask AI",
      b3: "Track batches",
      b4: "View weather",
      b5: "Check expenses",
      b6: "Receive alerts",
    },
    howItWorks: {
      heading: "How It Works",
      s1Num: "01",
      s1Title: "Add Your Farm",
      s1Desc: "Create your farm and add ponds or sheds.",
      s2Num: "02",
      s2Title: "Add Your Batch",
      s2Desc: "Record species, quantity and basic information.",
      s3Num: "03",
      s3Title: "Track Your Farm",
      s3Desc: "Record feeding, growth, water, health and expenses.",
      s4Num: "04",
      s4Title: "Get Insights",
      s4Desc: "Use AI, analytics, weather and alerts to support decisions.",
    },
    featureSummary: {
      heading: "Everything You Need",
      items: [
        { title: "AI Assistant", desc: "Farming guidance" },
        { title: "Fisheries", desc: "Pond and fish management" },
        { title: "Poultry", desc: "Flock management" },
        { title: "Weather", desc: "Farm weather information" },
        { title: "Alerts", desc: "Important updates" },
        { title: "Expenses", desc: "Cost tracking" },
        { title: "Analytics", desc: "Farm performance" },
        { title: "Batches", desc: "Batch-wise records" },
        { title: "Feed", desc: "Feeding management" },
        { title: "Water", desc: "Water parameter records" },
      ],
    },
    about: {
      heading: "About AgriFarmAssistant",
      description:
        "AgriFarmAssistant is an AI-powered farm management platform designed to help fisheries and poultry farmers organize operations, understand farm data and access practical AI assistance.",
      goalTitle: "Our Goal",
      goalDesc:
        "Make modern farm management simpler, more accessible and data-driven.",
    },
    finalCta: {
      heading: "Ready to Farm Smarter?",
      description:
        "Manage your farm. Understand your data. Get AI-powered assistance.",
      btnGetStarted: "Get Started",
      btnOpenDashboard: "Open Dashboard",
    },
    footer: {
      brandTitle: "AgriFarmAssistant",
      tagline: "Smart Farming. Better Decisions.",
      col1Title: "Features",
      links: [
        { label: "Fisheries", href: "#fisheries" },
        { label: "Poultry", href: "#poultry" },
        { label: "AI Assistant", href: "#ai-assistant" },
        { label: "Weather", href: "#weather" },
        { label: "Alerts", href: "#alerts" },
        { label: "Expenses", href: "#expenses" },
        { label: "Analytics", href: "#analytics" },
      ],
      otherTitle: "Platform",
      otherLinks: [
        { label: "About", href: "#about" },
        { label: "Contact", href: "#" },
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
      ],
      copyright: "© 2026 AgriFarmAssistant",
    },
    authModal: {
      title: "Authentication Required",
      subtitle: "Farm Portal Access",
      description:
        "Sign in to access your farm batches, telemetry, expenses, and AI advisory.",
      featurePrompt: "Selected feature:",
      proceedButton: "Sign In via Email OTP",
      cancelButton: "Cancel",
    },
  },
  hi: {
    nav: {
      brandTitle: "कृषि-फार्म सहायक",
      brandSubtitle: "फार्म प्रबंधन प्लेटफॉर्म",
      navAquaculture: "मत्स्य पालन",
      navPoultry: "पोल्ट्री",
      navAiCore: "एआई सहायक",
      navWeather: "मौसम",
      navProtocols: "प्लेटफॉर्म",
      signIn: "लॉगिन",
      launchPortal: "डैशबोर्ड",
    },
    hero: {
      badge: "एआई-संचालित फार्म प्रबंधन",
      headingLine1: "स्मार्ट फार्मिंग।",
      headingLine2: "बेहतर निर्णय।",
      subtext:
        "एआई, फार्म डेटा, मौसम जानकारी और सरल डिजिटल टूल्स के साथ अपने मत्स्य और पोल्ट्री फार्म का प्रबंधन करें।",
      btnGetStarted: "शुरू करें",
      btnExplore: "प्लेटफॉर्म देखें",
      tagline: "मत्स्य पालन • पोल्ट्री • एआई • मौसम",
      showcase: {
        liveStatus: "लाइव फार्म कंसोल",
        tabFisheries: "मत्स्य पालन (तालाब 01)",
        tabPoultry: "पोल्ट्री (शेड ए)",
        fisheriesTitle: "तालाब 01: पंगासियस एवं रोहू",
        fisheriesSub: "जल स्तर 5.2 फीट • घुलित ऑक्सीजन इष्टतम",
        waterMetric: "DO 6.4 mg/L",
        biomassMetric: "12,580 कि.ग्रा.",
        feedMetric: "185 कि.ग्रा./दिन",
        poultryTitle: "शेड ए: ब्रायलर झुंड #12",
        poultrySub: "दिन 32 • वायु-संचार सक्रिय • जलवायु सामान्य",
        birdsMetric: "4,850 पक्षी",
        tempMetric: "28.5 °C",
        mortalityMetric: "0.02% (सामान्य)",
        aiTipFish: "तालाब वायु-संचार समय पर सक्रिय। जल मानक इष्टतम सीमा में हैं।",
        aiTipPoultry: "तापमान-आर्द्रता सूचकांक सामान्य। पंखे अनुशंसित वायु प्रवाह बनाए हुए हैं।",
        viewDashboardBtn: "लाइव डैशबोर्ड खोलें →",
      },
    },
    intro: {
      heading: "एक प्लेटफॉर्म। दो कृषि क्षेत्र।",
      description:
        "एक ही सरल प्लेटफॉर्म से अपने मत्स्य पालन और पोल्ट्री संचालन का प्रबंधन करें।",
      card1Title: "मत्स्य पालन",
      card1Desc:
        "तालाब, मछली बैच, आहार, जल मानक, विकास और फार्म प्रदर्शन का प्रबंधन करें।",
      card1Btn: "मत्स्य पालन देखें →",
      card2Title: "पोल्ट्री",
      card2Desc:
        "पोल्ट्री बैच, आहार, स्वास्थ्य रिकॉर्ड, मृत्यु दर, खर्च और प्रदर्शन का प्रबंधन करें।",
      card2Btn: "पोल्ट्री देखें →",
    },
    fisheries: {
      heading: "स्मार्ट मत्स्य प्रबंधन",
      description: "संचयन से लेकर कटाई तक अपने तालाबों और मछली बैचों का प्रबंधन करें।",
      f1Title: "तालाब प्रबंधन",
      f1Desc: "तालाब की जानकारी और स्थितियों पर नज़र रखें।",
      f2Title: "बैच प्रबंधन",
      f2Desc: "मछली प्रजातियों और बैचों को व्यवस्थित रखें।",
      f3Title: "आहार प्रबंधन",
      f3Desc: "दैनिक आहार और फ़ीड आवश्यकताओं को ट्रैक करें।",
      f4Title: "विकास ट्रैकिंग",
      f4Desc: "वजन, बायोमास और विकास की निगरानी करें।",
      f5Title: "जल निगरानी",
      f5Desc: "महत्वपूर्ण जल मानकों का रिकॉर्ड रखें।",
      f6Title: "खर्च ट्रैकिंग",
      f6Desc: "फार्म लागत और खर्चों का प्रबंधन करें।",
      btn: "मत्स्य पालन डैशबोर्ड खोलें →",
    },
    fisheriesVideo: {
      headingLine1: "बेहतर तालाब प्रबंधन",
      headingLine2: "शुरुआत बेहतर डेटा से होती है।",
      subtext: "निगरानी करें। समझें। सुधारें।",
      btn: "मत्स्य पालन देखें →",
    },
    species: {
      heading: "अपने मछली बैचों का प्रबंधन करें",
      description: "प्रजातियों और बैच की जानकारी एक ही स्थान पर व्यवस्थित रखें।",
      items: [
        "पंगासियस",
        "रोहू",
        "कतला",
        "मृगल (नैन)",
        "कॉमन कार्प",
        "ग्रास कार्प",
        "रूपचंद",
        "ब्लैक कार्प",
        "बिगहेड कार्प",
      ],
    },
    fishDashboard: {
      heading: "आपका तालाब, एक नज़र में",
      description: "उन आंकड़ों पर नज़र रखें जो मायने रखते हैं।",
      badgeDemo: "नमूना अवलोकन",
      m1Label: "कुल मछलियां",
      m1Value: "18,500",
      m2Label: "औसत वजन",
      m2Value: "680 ग्राम",
      m3Label: "कुल बायोमास",
      m3Value: "12,580 कि.ग्रा.",
      m4Label: "आहार खपत",
      m4Value: "420 कि.ग्रा. / सप्ताह",
      m5Label: "जल गुणवत्ता",
      m5Value: "इष्टतम (DO 6.2)",
      m6Label: "फार्म खर्च",
      m6Value: "₹ 48,200",
      growthChartTitle: "बायोमास विकास वक्र",
      feedTrendTitle: "साप्ताहिक आहार दर",
      btn: "मत्स्य एनालिटिक्स देखें →",
    },
    waterQuality: {
      heading: "अपने पानी को जानें",
      description:
        "महत्वपूर्ण जल मानकों की निगरानी करें और ध्यान देने योग्य स्थितियों की पहचान करें।",
      p1Label: "पीएच (pH) स्तर",
      p1Value: "7.6",
      p1Status: "सामान्य श्रेणी",
      p2Label: "तापमान",
      p2Value: "28.5 °C",
      p2Status: "इष्टतम",
      p3Label: "घुलित ऑक्सीजन",
      p3Value: "6.4 mg/L",
      p3Status: "अच्छा",
      p4Label: "जल स्तर",
      p4Value: "5.2 फीट",
      p4Status: "पर्याप्त गहराई",
      btn: "जल डेटा देखें →",
    },
    aiAssistant: {
      heading: "आपका एआई फार्म सहायक",
      description: "सवाल पूछें। व्यावहारिक कृषि मार्गदर्शन प्राप्त करें।",
      card1Title: "मत्स्य पालन एआई",
      card1Desc:
        "मछली पालन, आहार, जल गुणवत्ता और तालाब प्रबंधन के लिए मार्गदर्शन प्राप्त करें।",
      card2Title: "पोल्ट्री एआई",
      card2Desc:
        "झुंड प्रबंधन, आहार, स्वास्थ्य और फार्म स्थितियों के लिए मार्गदर्शन प्राप्त करें।",
      card3Title: "फार्म-आधारित एआई",
      card3Desc:
        "अपने फार्म और बैच की जानकारी के आधार पर अधिक प्रासंगिक उत्तर प्राप्त करें।",
      chatFarmerLabel: "किसान",
      chatFarmerText: "मेरी पंगासियस ठीक से चारा नहीं खा रही हैं। मुझे क्या जांचना चाहिए?",
      chatAiLabel: "फार्म एआई",
      chatAiText:
        "पानी के तापमान, घुलित ऑक्सीजन, पानी की गुणवत्ता और आहार की हालिया स्थितियों की जांच करें।",
      disclaimer:
        "नोट: फार्म एआई सामान्य कृषि मार्गदर्शन प्रदान करता है और यह पेशेवर पशु चिकित्सा सलाह का विकल्प नहीं है।",
      btn: "फार्म एआई से पूछें →",
    },
    poultry: {
      heading: "स्मार्ट पोल्ट्री प्रबंधन",
      description:
        "अपने पोल्ट्री बैच, आहार, स्वास्थ्य, मृत्यु दर और खर्चों का प्रबंधन एक ही स्थान पर करें।",
      f1Title: "बैच प्रबंधन",
      f1Desc: "प्लेसमेंट से लेकर बिक्री तक प्रत्येक झुंड को ट्रैक करें।",
      f2Title: "आहार ट्रैकिंग",
      f2Desc: "आहार खपत और लागत की निगरानी करें।",
      f3Title: "स्वास्थ्य रिकॉर्ड",
      f3Desc: "स्वास्थ्य अवलोकन और महत्वपूर्ण घटनाओं को दर्ज करें।",
      f4Title: "मृत्यु दर ट्रैकिंग",
      f4Desc: "मृत्यु दर और समय के साथ बदलाव पर नज़र रखें।",
      f5Title: "पर्यावरण",
      f5Desc: "महत्वपूर्ण पर्यावरणीय परिस्थितियों की निगरानी करें।",
      f6Title: "खर्च प्रबंधन",
      f6Desc: "पोल्ट्री लागत को व्यवस्थित रखें।",
      btn: "पोल्ट्री डैशबोर्ड खोलें →",
    },
    poultryVideo: {
      heading: "समार्र्टर पोल्ट्री प्रबंधन",
      subtext: "अपने झुंड को ट्रैक करें। अपने फार्म को समझें।",
      btn: "पोल्ट्री देखें →",
    },
    poultryDashboard: {
      heading: "आपका झुंड, एक नज़र में",
      description: "सरल आंकड़े। स्पष्ट निर्णय।",
      badgeDemo: "नमूना अवलोकन",
      m1Label: "कुल पक्षी",
      m1Value: "4,850",
      m2Label: "औसत वजन",
      m2Value: "1.85 कि.ग्रा.",
      m3Label: "आहार खपत",
      m3Value: "3,120 कि.ग्रा.",
      m4Label: "मृत्यु दर",
      m4Value: "1.2% (सामान्य)",
      m5Label: "बैच आयु",
      m5Value: "दिन 32",
      m6Label: "कुल खर्च",
      m6Value: "₹ 92,400",
      chartTitle: "झुंड वजन लक्ष्य बनाम वास्तविक",
      btn: "पोल्ट्री डैशबोर्ड देखें →",
    },
    weather: {
      heading: "आपके फार्म का मौसम",
      description: "अपने फार्म स्थान के लिए वर्तमान मौसम और पूर्वानुमान देखें।",
      tempLabel: "तापमान",
      tempValue: "31°C",
      humidityLabel: "आर्द्रता",
      humidityValue: "74%",
      rainLabel: "वर्षा",
      rainValue: "0 मिमी",
      windLabel: "हवा",
      windValue: "12 किमी/घंटा",
      forecastLabel: "3-दिवसीय पूर्वानुमान",
      forecastDays: [
        { day: "आज", condition: "हल्के बादल", temp: "31° / 24°C" },
        { day: "कल", condition: "हल्की बारिश", temp: "29° / 23°C" },
        { day: "बुधवार", condition: "धूप", temp: "32° / 24°C" },
      ],
      btn: "मौसम देखें →",
    },
    weatherInsights: {
      heading: "मौसम और फार्म डेटा का मेल",
      description:
        "दैनिक निर्णयों में सहायता के लिए अपने फार्म रिकॉर्ड के साथ मौसम की जानकारी का उपयोग करें।",
      c1Title: "वर्षा अलर्ट",
      c1Desc: "बदलती फार्म परिस्थितियों के लिए पहले से तैयारी करें।",
      c2Title: "तापमान",
      c2Desc: "तापमान-संवेदनशील फार्म स्थितियों की निगरानी करें।",
      c3Title: "तेज़ हवा",
      c3Desc: "बाहरी उपकरणों और शेड संरचनाओं की जांच करें।",
      c4Title: "गर्मी",
      c4Desc: "पानी और पर्यावरणीय स्थितियों पर ध्यान दें।",
      guidanceNote: "स्थानीय मौसम स्थितियों पर आधारित मार्गदर्शन।",
    },
    alerts: {
      heading: "ज़रूरी अपडेट, जब आपको आवश्यकता हो",
      description:
        "मौसम, फार्म गतिविधियों और महत्वपूर्ण बदलावों के लिए समय पर अलर्ट प्राप्त करें।",
      item1: {
        title: "मौसम अलर्ट",
        desc: "पूर्वानुमान के अनुसार कल सुबह बारिश की संभावना।",
        type: "मौसम",
      },
      item2: {
        title: "आहार अनुस्मारक",
        desc: "तालाब 2 के लिए सुबह का आहार निर्धारित।",
        type: "आहार",
      },
      item3: {
        title: "जल गुणवत्ता अलर्ट",
        desc: "दोपहर से पहले तालाब 1 में ऑक्सीजन स्तर की जांच करें।",
        type: "जल",
      },
      item4: {
        title: "बैच अपडेट",
        desc: "बैच 04 के लिए गुरुवार को वजन नमूना निर्धारित।",
        type: "बैच",
      },
      item5: {
        title: "फार्म गतिविधि",
        desc: "शेड ए के लिए टीकाकरण जांच पूरी हुई।",
        type: "गतिविधि",
      },
      btn: "अलर्ट देखें →",
    },
    expenses: {
      heading: "अपने खर्चों का पूरा हिसाब रखें",
      description: "फार्म खर्चों को ट्रैक करें और अपनी परिचालन लागत को समझें।",
      categoriesTitle: "खर्च श्रेणियां",
      categories: [
        "आहार",
        "दवा",
        "मजदूरी",
        "बिजली",
        "उपकरण",
        "परिवहन",
        "अन्य",
      ],
      m1Label: "आज",
      m1Value: "₹ 1,850",
      m2Label: "इस महीने",
      m2Value: "₹ 48,200",
      m3Label: "कुल लागत",
      m3Value: "₹ 1,40,650",
      m4Label: "प्रति बैच लागत",
      m4Value: "₹ 35,160",
      btn: "खर्च प्रबंधित करें →",
    },
    analytics: {
      heading: "डेटा के माध्यम से अपने फार्म को समझें",
      description: "फार्म रिकॉर्ड को सरल और उपयोगी जानकारियों में बदलें।",
      fishTitle: "मत्स्य एनालिटिक्स",
      fishItems: [
        "मछली विकास",
        "बायोमास",
        "आहार खपत",
        "एफसीआर (FCR)",
        "मृत्यु दर",
        "खर्च",
      ],
      poultryTitle: "पोल्ट्री एनालिटिक्स",
      poultryItems: [
        "वजन विकास",
        "आहार खपत",
        "मृत्यु दर",
        "एफसीआर (FCR)",
        "बैच प्रदर्शन",
        "खर्च",
      ],
      btn: "एनालिटिक्स देखें →",
    },
    farmBatchMgmt: {
      heading: "प्रत्येक फार्म और बैच का प्रबंधन करें",
      description: "फार्म, तालाब, शेड और बैच को अलग-अलग व्यवस्थित रखें।",
      tree1Title: "मत्स्य प्रबंधन संरचना",
      tree1Step1: "फार्म",
      tree1Step2: "तालाब",
      tree1Step3: "मछली बैच",
      tree2Title: "पोल्ट्री प्रबंधन संरचना",
      tree2Step1: "पोल्ट्री फार्म",
      tree2Step2: "शेड",
      tree2Step3: "पोल्ट्री बैच",
    },
    dailyBrief: {
      heading: "फार्म बुलेटिन के साथ हर दिन की शुरुआत करें",
      description: "महत्वपूर्ण फार्म जानकारी और कार्यों का एक सरल सारांश प्राप्त करें।",
      greeting: "शुभ प्रभात",
      cardTitle: "आज का फार्म बुलेटिन",
      i1Label: "मौसम",
      i1Value: "31°C, हल्के बादल",
      i2Label: "बैच",
      i2Value: "4 सक्रिय तालाब, 2 शेड",
      i3Label: "आहार आवश्यकता",
      i3Value: "185 कि.ग्रा. कुल निर्धारित",
      i4Label: "जल जांच",
      i4Value: "तालाब 1 और 2 सामान्य",
      i5Label: "अलर्ट",
      i5Value: "1 आहार अनुस्मारक",
      emailNote: "दैनिक फार्म अपडेट ईमेल द्वारा भी प्राप्त किए जा सकते हैं।",
      btn: "फार्म देखें →",
    },
    languageSec: {
      heading: "आपका फार्म। आपकी भाषा।",
      description: "अंग्रेज़ी या हिंदी में कृषि-फार्म सहायक का उपयोग करें।",
      toggleLabel: "English | हिंदी",
    },
    mobileMgmt: {
      heading: "आपका फार्म, आप जहां भी हों",
      description:
        "अपने फोन से फार्म की जानकारी, एआई सहायता, अलर्ट और विश्लेषण तक पहुंचें।",
      b1: "फार्म डेटा जांचें",
      b2: "एआई से पूछें",
      b3: "बैच ट्रैक करें",
      b4: "मौसम देखें",
      b5: "खर्च देखें",
      b6: "अलर्ट प्राप्त करें",
    },
    howItWorks: {
      heading: "यह कैसे काम करता है",
      s1Num: "01",
      s1Title: "अपना फार्म जोड़ें",
      s1Desc: "अपना फार्म बनाएं और तालाब या शेड जोड़ें।",
      s2Num: "02",
      s2Title: "अपना बैच जोड़ें",
      s2Desc: "प्रजाति, संख्या और बुनियादी जानकारी दर्ज करें।",
      s3Num: "03",
      s3Title: "अपने फार्म को ट्रैक करें",
      s3Desc: "आहार, विकास, पानी, स्वास्थ्य और खर्च दर्ज करें।",
      s4Num: "04",
      s4Title: "जानकारी प्राप्त करें",
      s4Desc: "निर्णय लेने में सहायता के लिए एआई, एनालिटिक्स, मौसम और अलर्ट का उपयोग करें।",
    },
    featureSummary: {
      heading: "आपकी हर ज़रूरत के लिए",
      items: [
        { title: "एआई सहायक", desc: "कृषि मार्गदर्शन" },
        { title: "मत्स्य पालन", desc: "तालाब और मछली प्रबंधन" },
        { title: "पोल्ट्री", desc: "झुंड प्रबंधन" },
        { title: "मौसम", desc: "फार्म मौसम जानकारी" },
        { title: "अलर्ट", desc: "महत्वपूर्ण अपडेट" },
        { title: "खर्च", desc: "लागत ट्रैकिंग" },
        { title: "एनालिटिक्स", desc: "फार्म प्रदर्शन" },
        { title: "बैच", desc: "बैच-वार रिकॉर्ड" },
        { title: "आहार", desc: "आहार प्रबंधन" },
        { title: "जल", desc: "जल पैरामीटर रिकॉर्ड" },
      ],
    },
    about: {
      heading: "कृषि-फार्म सहायक के बारे में",
      description:
        "कृषि-फार्म सहायक एक एआई-संचालित फार्म प्रबंधन प्लेटफॉर्म है जिसे मत्स्य और पोल्ट्री किसानों को संचालन व्यवस्थित करने, फार्म डेटा समझने और व्यावहारिक एआई सहायता प्राप्त करने में मदद के लिए बनाया गया है।",
      goalTitle: "हमारा उद्देश्य",
      goalDesc:
        "आधुनिक फार्म प्रबंधन को अधिक सरल, सुलभ और डेटा-आधारित बनाना।",
    },
    finalCta: {
      heading: "क्या आप स्मार्ट फार्मिंग के लिए तैयार हैं?",
      description:
        "अपने फार्म का प्रबंधन करें। अपने डेटा को समझें। एआई-संचालित सहायता प्राप्त करें।",
      btnGetStarted: "शुरू करें",
      btnOpenDashboard: "डैशबोर्ड खोलें",
    },
    footer: {
      brandTitle: "कृषि-फार्म सहायक",
      tagline: "स्मार्ट फार्मिंग। बेहतर निर्णय।",
      col1Title: "सुविधाएं",
      links: [
        { label: "मत्स्य पालन", href: "#fisheries" },
        { label: "पोल्ट्री", href: "#poultry" },
        { label: "एआई सहायक", href: "#ai-assistant" },
        { label: "मौसम", href: "#weather" },
        { label: "अलर्ट", href: "#alerts" },
        { label: "खर्च", href: "#expenses" },
        { label: "एनालिटिक्स", href: "#analytics" },
      ],
      otherTitle: "प्लेटफॉर्म",
      otherLinks: [
        { label: "परिचय", href: "#about" },
        { label: "संपर्क", href: "#" },
        { label: "गोपनीयता", href: "#" },
        { label: "शर्तें", href: "#" },
      ],
      copyright: "© 2026 कृषि-फार्म सहायक",
    },
    authModal: {
      title: "प्रमाणीकरण आवश्यक है",
      subtitle: "फार्म पोर्टल पहुंच",
      description:
        "अपने फार्म बैच, टेलीमेट्री, खर्च और एआई परामर्श तक पहुंचने के लिए लॉगिन करें।",
      featurePrompt: "चयनित सुविधा:",
      proceedButton: "ईमेल ओटीपी द्वारा लॉगिन करें",
      cancelButton: "रद्द करें",
    },
  },
};
