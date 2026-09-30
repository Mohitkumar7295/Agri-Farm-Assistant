export type FisheriesLanguage = "en" | "hi";

export interface FisheriesContent {
  header: {
    title: string;
    subtitle: string;
    moduleLabel: string;
  };
  aiCard: {
    title: string;
    description: string;
    button: string;
  };
  batches: {
    title: string;
    totalLabel: string;
    addBatchBtn: string;
    activeStatus: string;
    inactiveStatus: string;
    pondAreaLabel: string;
    speciesLabel: string;
    quantityLabel: string;
    avgWeightLabel: string;
    biomassLabel: string;
    healthStatusLabel: string;
    btnBatchAi: string;
    btnManageBatch: string;
  };
  emptyState: {
    title: string;
    description: string;
    button: string;
  };
  wizard: {
    title: string;
    step1Tab: string;
    step2Tab: string;
    step3Tab: string;
    step1Heading: string;
    step2Heading: string;
    step3Heading: string;
    batchNameLabel: string;
    batchNamePlaceholder: string;
    stockingDateLabel: string;
    locationLabel: string;
    locationPlaceholder: string;
    pondSizeLabel: string;
    waterDepthLabel: string;
    btnAddSpecies: string;
    btnRemoveSpecies: string;
    speciesSelectLabel: string;
    customSpeciesLabel: string;
    customSpeciesPlaceholder: string;
    quantityLabel: string;
    initialWeightLabel: string;
    currentWeightLabel: string;
    targetWeightLabel: string;
    totalStockedReview: string;
    initialBiomassReview: string;
    currentBiomassReview: string;
    targetHarvestReview: string;
    speciesCompHeading: string;
    colSpecies: string;
    colQuantity: string;
    colAvgWeight: string;
    colBiomass: string;
    colTargetWeight: string;
    btnBack: string;
    btnNext: string;
    btnConfirm: string;
    acresUnit: string;
    feetUnit: string;
    gramsUnit: string;
    kgUnit: string;
  };
  details: {
    title: string;
    tabGrowth: string;
    tabWater: string;
    tabFeed: string;
    tabHealth: string;
    currentAvgWeight: string;
    currentBiomass: string;
    targetHarvestWeight: string;
    growthTrend: string;
    dwgLabel: string;
    waterTemp: string;
    waterPh: string;
    dissolvedOxygen: string;
    ammonia: string;
    optimalRange: string;
    todayFeed: string;
    feedConsumption: string;
    feedRequirement: string;
    feedingHistory: string;
    mortality: string;
    survivalRate: string;
    healthStatus: string;
    healthRecords: string;
    btnClose: string;
  };
  batchAi: {
    title: string;
    subtitle: string;
    evalTitle: string;
    stockingDensity: string;
    dwgAnalysis: string;
    waterRiskCheck: string;
    feedOptimization: string;
    askAiPlaceholder: string;
    btnAsk: string;
    suggestedHeading: string;
    q1: string;
    q2: string;
    q3: string;
    btnClose: string;
  };
}

export const fisheriesTranslations: Record<FisheriesLanguage, FisheriesContent> = {
  en: {
    header: {
      title: "Fish Farming",
      subtitle: "Monitor ponds, manage batches, track growth, and get AI-assisted fisheries guidance.",
      moduleLabel: "Fisheries Module",
    },
    aiCard: {
      title: "Fisheries AI Assistant",
      description: "Get practical guidance for fish farming, feeding, water quality, diseases, pond management, and fish growth.",
      button: "Open AI Assistant →",
    },
    batches: {
      title: "My Batches",
      totalLabel: "Total Batches",
      addBatchBtn: "+ Add New Batch",
      activeStatus: "Active",
      inactiveStatus: "Inactive",
      pondAreaLabel: "Pond Area",
      speciesLabel: "Species",
      quantityLabel: "Fish Quantity",
      avgWeightLabel: "Average Weight",
      biomassLabel: "Total Biomass",
      healthStatusLabel: "Health Status",
      btnBatchAi: "Batch AI",
      btnManageBatch: "Manage Batch",
    },
    emptyState: {
      title: "No fish batches yet",
      description: "Create your first batch to start monitoring fish growth, feeding, water quality, and farm performance.",
      button: "+ Add Fish Batch",
    },
    wizard: {
      title: "Add New Fish Batch",
      step1Tab: "1. Batch & Pond",
      step2Tab: "2. Species & Stocking",
      step3Tab: "3. Biomass Review",
      step1Heading: "Step 1 — Batch and Pond Information",
      step2Heading: "Step 2 — Species and Stocking Information",
      step3Heading: "Step 3 — Biomass Review and Confirmation",
      batchNameLabel: "Batch Name",
      batchNamePlaceholder: "e.g., Pond 3 - IMC Carp Polyculture",
      stockingDateLabel: "Stocking Date",
      locationLabel: "Location / Sector",
      locationPlaceholder: "e.g., North Nursery Sector",
      pondSizeLabel: "Pond Size (Acres)",
      waterDepthLabel: "Water Depth (Feet)",
      btnAddSpecies: "+ Add Another Species",
      btnRemoveSpecies: "Remove",
      speciesSelectLabel: "Select Species",
      customSpeciesLabel: "Custom Species Name",
      customSpeciesPlaceholder: "Enter species name",
      quantityLabel: "Quantity (Fish Count)",
      initialWeightLabel: "Initial Weight (g)",
      currentWeightLabel: "Current Weight (g)",
      targetWeightLabel: "Target Weight (g)",
      totalStockedReview: "Total Stocked",
      initialBiomassReview: "Initial Biomass",
      currentBiomassReview: "Current Biomass",
      targetHarvestReview: "Target Harvest",
      speciesCompHeading: "Species Composition Breakdown",
      colSpecies: "Species",
      colQuantity: "Quantity",
      colAvgWeight: "Avg Weight",
      colBiomass: "Biomass",
      colTargetWeight: "Target Weight",
      btnBack: "← Back",
      btnNext: "Next Step →",
      btnConfirm: "Confirm & Create Batch",
      acresUnit: "Acres",
      feetUnit: "ft",
      gramsUnit: "g",
      kgUnit: "kg",
    },
    details: {
      title: "Batch Management & Telemetry",
      tabGrowth: "Growth",
      tabWater: "Water Quality",
      tabFeed: "Feed",
      tabHealth: "Health",
      currentAvgWeight: "Average Weight",
      currentBiomass: "Current Biomass",
      targetHarvestWeight: "Target Weight",
      growthTrend: "Growth Velocity & Trend",
      dwgLabel: "Daily Weight Gain (DWG)",
      waterTemp: "Water Temperature",
      waterPh: "Water pH",
      dissolvedOxygen: "Dissolved Oxygen (DO)",
      ammonia: "Un-ionized Ammonia (NH3)",
      optimalRange: "ICAR-CIFA Optimal Range",
      todayFeed: "Today's Feed Allocation",
      feedConsumption: "Cumulative Feed Intake",
      feedRequirement: "10-Day Feed Requirement Model",
      feedingHistory: "Feeding History & Logs",
      mortality: "Recorded Mortalities",
      survivalRate: "Flock Survival Rate",
      healthStatus: "Biosecurity Health Status",
      healthRecords: "Clinical Health Logs",
      btnClose: "Close",
    },
    batchAi: {
      title: "Personalized Batch AI Consultation",
      subtitle: "Contextual advice generated from your actual pond, water, feed, and biomass telemetry",
      evalTitle: "Scientific ICAR-CIFA Batch Assessment",
      stockingDensity: "Stocking Density & Biomass Ratio",
      dwgAnalysis: "Growth Trajectory & DWG Velocity",
      waterRiskCheck: "Water Quality Diagnostic Check",
      feedOptimization: "Feed Ration Optimization",
      askAiPlaceholder: "Ask a specific question about this batch...",
      btnAsk: "Consult AI",
      suggestedHeading: "Recommended Inquiries for this Batch",
      q1: "How should I adjust feeding with cloudy overcast weather?",
      q2: "Is my Dissolved Oxygen level safe for this biomass?",
      q3: "When should I schedule the next harvest sampling?",
      btnClose: "Close AI",
    },
  },
  hi: {
    header: {
      title: "मत्स्य पालन",
      subtitle: "तालाबों की निगरानी करें, बैचों का प्रबंधन करें, शारीरिक वृद्धि ट्रैक करें और एआई-सहायता प्राप्त मत्स्य मार्गदर्शन पाएं।",
      moduleLabel: "मत्स्य पालन मॉड्यूल",
    },
    aiCard: {
      title: "मत्स्य एआई सहायक",
      description: "मछली पालन, आहार, जल गुणवत्ता, रोग निवारण, तालाब प्रबंधन और शारीरिक वृद्धि के लिए व्यावहारिक मार्गदर्शन प्राप्त करें।",
      button: "एआई सहायक खोलें →",
    },
    batches: {
      title: "मेरे बैच",
      totalLabel: "कुल बैच",
      addBatchBtn: "+ नया बैच जोड़ें",
      activeStatus: "सक्रिय",
      inactiveStatus: "निष्क्रिय",
      pondAreaLabel: "तालाब क्षेत्रफल",
      speciesLabel: "मत्स्य प्रजातियां",
      quantityLabel: "मत्स्य संख्या",
      avgWeightLabel: "औसत वज़न",
      biomassLabel: "कुल बायोमास",
      healthStatusLabel: "स्वास्थ्य स्थिति",
      btnBatchAi: "बैच एआई",
      btnManageBatch: "बैच प्रबंधन",
    },
    emptyState: {
      title: "अभी तक कोई मत्स्य बैच नहीं है",
      description: "मछलियों की शारीरिक वृद्धि, आहार, जल गुणवत्ता और फार्म प्रदर्शन की निगरानी शुरू करने के लिए अपना पहला बैच बनाएं।",
      button: "+ मत्स्य बैच जोड़ें",
    },
    wizard: {
      title: "नया मत्स्य बैच जोड़ें",
      step1Tab: "1. बैच व तालाब",
      step2Tab: "2. प्रजाति व संचयन",
      step3Tab: "3. बायोमास समीक्षा",
      step1Heading: "चरण 1 — बैच एवं तालाब विवरण",
      step2Heading: "चरण 2 — प्रजाति एवं संचयन विवरण",
      step3Heading: "चरण 3 — बायोमास समीक्षा एवं पुष्टि",
      batchNameLabel: "बैच का नाम",
      batchNamePlaceholder: "उदा. तालाब 3 - मिश्रित कार्प पालन",
      stockingDateLabel: "संचयन तिथि (स्टॉकिंग डेट)",
      locationLabel: "स्थान / प्रभाग",
      locationPlaceholder: "उदा. उत्तर नर्सरी प्रभाग",
      pondSizeLabel: "तालाब का आकार (एकड़)",
      waterDepthLabel: "जल की गहराई (फीट)",
      btnAddSpecies: "+ अन्य प्रजाति जोड़ें",
      btnRemoveSpecies: "हटाएं",
      speciesSelectLabel: "मछली प्रजाति चुनें",
      customSpeciesLabel: "अन्य प्रजाति का नाम",
      customSpeciesPlaceholder: "प्रजाति का नाम लिखें",
      quantityLabel: "संख्या (फिंगरलिंग्स गिनती)",
      initialWeightLabel: "आरंभिक वज़न (ग्राम)",
      currentWeightLabel: "वर्तमान वज़न (ग्राम)",
      targetWeightLabel: "लक्षित वज़न (ग्राम)",
      totalStockedReview: "कुल संचित मछलियाँ",
      initialBiomassReview: "आरंभिक बायोमास",
      currentBiomassReview: "वर्तमान बायोमास",
      targetHarvestReview: "लक्षित कुल उत्पादन",
      speciesCompHeading: "प्रजाति-वार विस्तृत संरचना",
      colSpecies: "प्रजाति",
      colQuantity: "संख्या",
      colAvgWeight: "औसत वज़न",
      colBiomass: "बायोमास",
      colTargetWeight: "लक्षित वज़न",
      btnBack: "← पीछे",
      btnNext: "अगला चरण →",
      btnConfirm: "पुष्टि कर बैच बनाएं",
      acresUnit: "एकड़",
      feetUnit: "फीट",
      gramsUnit: "ग्राम",
      kgUnit: "किग्रा",
    },
    details: {
      title: "बैच प्रबंधन एवं टेलीमेट्री",
      tabGrowth: "शारीरिक वृद्धि",
      tabWater: "जल गुणवत्ता",
      tabFeed: "आहार",
      tabHealth: "स्वास्थ्य",
      currentAvgWeight: "औसत वज़न",
      currentBiomass: "वर्तमान बायोमास",
      targetHarvestWeight: "लक्षित वज़न",
      growthTrend: "दैनिक वृद्धि दर एवं गति",
      dwgLabel: "दैनिक शारीरिक भार वृद्धि (DWG)",
      waterTemp: "जल तापमान",
      waterPh: "जल पीएच (pH)",
      dissolvedOxygen: "घुलित ऑक्सीजन (DO)",
      ammonia: "अमोनिया (NH3)",
      optimalRange: "आईसीएआर-सीआईएफए मानक दायरा",
      todayFeed: "आज का आहार आवंटन",
      feedConsumption: "संचयी आहार खपत",
      feedRequirement: "10-दिवसीय आहार पूर्वानुमान मॉडल",
      feedingHistory: "आहार वितरण इतिहास",
      mortality: "दर्ज की गई मृत्यु संख्या",
      survivalRate: "उत्तरजीविता दर",
      healthStatus: "स्वास्थ्य स्थिति",
      healthRecords: "स्वास्थ्य निरीक्षण रिकॉर्ड",
      btnClose: "बंद करें",
    },
    batchAi: {
      title: "व्यक्तिगत बैच एआई परामर्श",
      subtitle: "आपके वास्तविक तालाब, जल, आहार एवं बायोमास डेटा पर आधारित वैज्ञानिक मार्गदर्शन",
      evalTitle: "वैज्ञानिक आईसीएआर-सीआईएफए बैच विश्लेषण",
      stockingDensity: "संचयन घनत्व एवं बायोमास अनुपात",
      dwgAnalysis: "वृद्धि वक्र एवं डीडब्ल्यूजी विश्लेषण",
      waterRiskCheck: "जल गुणवत्ता परीक्षण",
      feedOptimization: "आहार मात्रा अनुकूलन",
      askAiPlaceholder: "इस बैच के बारे में कोई विशेष प्रश्न पूछें...",
      btnAsk: "एआई से पूछें",
      suggestedHeading: "इस बैच के लिए सुझाए गए प्रश्न",
      q1: "बादल छाए रहने पर आहार की मात्रा कैसे समायोजित करें?",
      q2: "क्या इस बायोमास के लिए घुलित ऑक्सीजन सुरक्षित है?",
      q3: "अगले नमूने की जांच कब करनी चाहिए?",
      btnClose: "बंद करें",
    },
  },
};
