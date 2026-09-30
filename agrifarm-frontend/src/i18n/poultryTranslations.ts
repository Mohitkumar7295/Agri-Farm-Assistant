export type PoultryLanguage = "en" | "hi";

export interface PoultryContent {
  header: {
    title: string;
    subtitle: string;
    addFlockBtn: string;
    langToggle: string;
  };
  aiSection: {
    title: string;
    description: string;
    btnAction: string;
  };
  myFlocks: {
    title: string;
    completedTitle: string;
    emptyTitle: string;
    emptySubtitle: string;
    emptyBtn: string;
    activeBadge: string;
    completedBadge: string;
    categoryLabel: string;
    ageLabel: string;
    daysSuffix: string;
    shedLabel: string;
    sqFtSuffix: string;
    weightLabel: string;
    birdsSuffix: string;
    btnFlockAi: string;
    btnManage: string;
  };
  wizard: {
    step1Tab: string;
    step2Tab: string;
    step3Tab: string;
    step1Title: string;
    step1Sub: string;
    step2Title: string;
    step2Sub: string;
    step3Title: string;
    step3Sub: string;
    flockNameLabel: string;
    flockNamePlaceholder: string;
    stockingDateLabel: string;
    locationLabel: string;
    locationPlaceholder: string;
    shedNameLabel: string;
    shedNamePlaceholder: string;
    shedAreaLabel: string;
    categoryLabel: string;
    breedLabel: string;
    initialBirdsLabel: string;
    initialWeightLabel: string;
    currentWeightLabel: string;
    targetWeightLabel: string;
    ageDaysLabel: string;
    dailyFeedLabel: string;
    btnNextData: string;
    btnNextReview: string;
    btnBack: string;
    btnRegister: string;
    summaryTitle: string;
    metricCol: string;
    valueCol: string;
    metricTotalBirds: string;
    metricInitialBiomass: string;
    metricCurrentBiomass: string;
    metricTargetBiomass: string;
    detailsTitle: string;
  };
  manage: {
    backBtn: string;
    activeStatus: string;
    completedStatus: string;
    tabOverview: string;
    tabGrowthFeed: string;
    tabHealth: string;
    tabVaccinations: string;
    metricBirdCount: string;
    metricAvgWeight: string;
    metricAge: string;
    metricTargetWeight: string;
    metricFeedConsumed: string;
    metricFcr: string;
    metricMortality: string;
    metricSurvivalRate: string;
    growthSectionTitle: string;
    feedSectionTitle: string;
    healthSectionTitle: string;
    vaccineSectionTitle: string;
    diseaseCol: string;
    vaccineCol: string;
    ageCol: string;
    statusCol: string;
    routeCol: string;
    feedDateCol: string;
    feedTypeCol: string;
    feedRationCol: string;
    feedFcrCol: string;
    btnAskAi: string;
    btnCloseFlock: string;
    btnDeleteFlock: string;
    btnRecordDailyFeed: string;
    btnRecordMortality: string;
  };
}

export const poultryTranslations: Record<PoultryLanguage, PoultryContent> = {
  en: {
    header: {
      title: "Poultry Farming",
      subtitle: "AI-assisted poultry advisory, flock tracking, FCR, and farm management.",
      addFlockBtn: "+ Add New Poultry Flock",
      langToggle: "हिन्दी",
    },
    aiSection: {
      title: "Poultry General AI Chat",
      description: "Ask anything about poultry feeding, flock health, vaccination schedules, growth, FCR, and farm management.",
      btnAction: "Open AI Chat →",
    },
    myFlocks: {
      title: "My Flocks",
      completedTitle: "Completed Flocks",
      emptyTitle: "No poultry flocks yet",
      emptySubtitle: "Add your first flock to start monitoring growth, feed, health, and production.",
      emptyBtn: "+ Add New Poultry Flock",
      activeBadge: "Active",
      completedBadge: "Completed",
      categoryLabel: "Bird Category",
      ageLabel: "Age",
      daysSuffix: "days",
      shedLabel: "Shed Area",
      sqFtSuffix: "sq ft",
      weightLabel: "Average Weight",
      birdsSuffix: "birds",
      btnFlockAi: "Flock AI",
      btnManage: "Manage Flock",
    },
    wizard: {
      step1Tab: "1 — Basic Details",
      step2Tab: "2 — Flock Data",
      step3Tab: "3 — Review",
      step1Title: "Register Poultry Flock",
      step1Sub: "Step 1: Flock name, shed information & bird category",
      step2Title: "Register Poultry Flock",
      step2Sub: "Step 2: Bird count, weights & production targets",
      step3Title: "Register Poultry Flock",
      step3Sub: "Step 3: Flock review & confirmation",
      flockNameLabel: "Flock Name",
      flockNamePlaceholder: "e.g. Shed 1 - Commercial Broiler Cobb 500",
      stockingDateLabel: "Stocking / Placement Date",
      locationLabel: "Farm Location / Shed Unit",
      locationPlaceholder: "e.g. East Broiler Wing",
      shedNameLabel: "Shed Identifier",
      shedNamePlaceholder: "e.g. Shed 1",
      shedAreaLabel: "Shed Area (sq. ft.)",
      categoryLabel: "Bird Category",
      breedLabel: "Breed / Genetic Line",
      initialBirdsLabel: "Initial Bird Count (Chicks Placed)",
      initialWeightLabel: "Initial Day-1 Weight (grams/bird)",
      currentWeightLabel: "Current Average Weight (grams/bird)",
      targetWeightLabel: "Target Market Weight (grams/bird)",
      ageDaysLabel: "Current Flock Age (days)",
      dailyFeedLabel: "Estimated Daily Feed (kg)",
      btnNextData: "Next: Add Flock Data →",
      btnNextReview: "Next: Review Flock →",
      btnBack: "Back",
      btnRegister: "Register Flock",
      summaryTitle: "Flock Summary",
      metricCol: "Metric",
      valueCol: "Value",
      metricTotalBirds: "Total Birds",
      metricInitialBiomass: "Initial Biomass",
      metricCurrentBiomass: "Current Biomass",
      metricTargetBiomass: "Target Biomass",
      detailsTitle: "Flock Details",
    },
    manage: {
      backBtn: "← Back to My Flocks",
      activeStatus: "Active",
      completedStatus: "Completed",
      tabOverview: "Flock Overview",
      tabGrowthFeed: "Growth & Feed",
      tabHealth: "Flock Health",
      tabVaccinations: "Vaccinations",
      metricBirdCount: "Bird Count",
      metricAvgWeight: "Average Weight",
      metricAge: "Age",
      metricTargetWeight: "Target Weight",
      metricFeedConsumed: "Feed Consumed",
      metricFcr: "FCR",
      metricMortality: "Mortality",
      metricSurvivalRate: "Survival Rate",
      growthSectionTitle: "Growth & Feed Performance",
      feedSectionTitle: "Feeding Logs",
      healthSectionTitle: "Health & Clinical Records",
      vaccineSectionTitle: "National Poultry Vaccination Protocol",
      diseaseCol: "Disease Prevented",
      vaccineCol: "Vaccine Strain",
      ageCol: "Schedule (Age)",
      statusCol: "Status",
      routeCol: "Route",
      feedDateCol: "Date & Time",
      feedTypeCol: "Feed Formulation",
      feedRationCol: "Ration (kg)",
      feedFcrCol: "FCR",
      btnAskAi: "Consult Flock AI",
      btnCloseFlock: "Mark as Completed",
      btnDeleteFlock: "Delete Flock",
      btnRecordDailyFeed: "Log Feed Consumption",
      btnRecordMortality: "Record Mortality",
    },
  },
  hi: {
    header: {
      title: "कुक्कुट पालन",
      subtitle: "एआई-सहायता प्राप्त कुक्कुट सलाह, झुंड ट्रैकिंग, एफसीआर एवं फार्म प्रबंधन।",
      addFlockBtn: "+ नया कुक्कुट झुंड जोड़ें",
      langToggle: "English",
    },
    aiSection: {
      title: "कुक्कुट सामान्य एआई चैट",
      description: "कुक्कुट आहार, झुंड स्वास्थ्य, टीकाकरण कार्यक्रम, वृद्धि, एफसीआर एवं फार्म प्रबंधन के बारे में कुछ भी पूछें।",
      btnAction: "एआई चैट खोलें →",
    },
    myFlocks: {
      title: "मेरे झुंड",
      completedTitle: "पूर्ण हो चुके झुंड",
      emptyTitle: "अभी तक कोई कुक्कुट झुंड नहीं है",
      emptySubtitle: "वृद्धि, आहार, स्वास्थ्य और उत्पादन की निगरानी शुरू करने के लिए अपना पहला झुंड जोड़ें।",
      emptyBtn: "+ नया कुक्कुट झुंड जोड़ें",
      activeBadge: "सक्रिय",
      completedBadge: "पूर्ण",
      categoryLabel: "पक्षी श्रेणी",
      ageLabel: "आयु",
      daysSuffix: "दिन",
      shedLabel: "शेड क्षेत्रफल",
      sqFtSuffix: "वर्ग फुट",
      weightLabel: "औसत भार",
      birdsSuffix: "पक्षी",
      btnFlockAi: "झुंड एआई",
      btnManage: "झुंड प्रबंधन",
    },
    wizard: {
      step1Tab: "1 — बुनियादी विवरण",
      step2Tab: "2 — झुंड डेटा",
      step3Tab: "3 — समीक्षा",
      step1Title: "कुक्कुट झुंड पंजीकृत करें",
      step1Sub: "चरण 1: झुंड का नाम, शेड की जानकारी और पक्षी श्रेणी",
      step2Title: "कुक्कुट झुंड पंजीकृत करें",
      step2Sub: "चरण 2: पक्षियों की संख्या, भार और उत्पादन लक्ष्य",
      step3Title: "कुक्कुट झुंड पंजीकृत करें",
      step3Sub: "चरण 3: झुंड समीक्षा और पुष्टि",
      flockNameLabel: "झुंड का नाम",
      flockNamePlaceholder: "उदा. शेड 1 - ब्रायलर कॉब 500",
      stockingDateLabel: "संचयन / शेड प्रवेश तिथि",
      locationLabel: "फार्म स्थान / शेड यूनिट",
      locationPlaceholder: "उदा. पूर्वी ब्रायलर शेड",
      shedNameLabel: "शेड पहचान",
      shedNamePlaceholder: "उदा. शेड 1",
      shedAreaLabel: "शेड क्षेत्रफल (वर्ग फुट)",
      categoryLabel: "पक्षी श्रेणी",
      breedLabel: "नस्ल / जेनेटिक लाइन",
      initialBirdsLabel: "प्रारंभिक पक्षी संख्या (चूजों की संख्या)",
      initialWeightLabel: "प्रारंभिक औसत भार (ग्राम/पक्षी)",
      currentWeightLabel: "वर्तमान औसत भार (ग्राम/पक्षी)",
      targetWeightLabel: "लक्ष्य बाज़ार भार (ग्राम/पक्षी)",
      ageDaysLabel: "झुंड की वर्तमान आयु (दिन)",
      dailyFeedLabel: "अनुमानित दैनिक आहार (किग्रा)",
      btnNextData: "आगे: झुंड डेटा जोड़ें →",
      btnNextReview: "आगे: समीक्षा करें →",
      btnBack: "पीछे",
      btnRegister: "झुंड पंजीकृत करें",
      summaryTitle: "झुंड सारांश",
      metricCol: "मापदंड",
      valueCol: "मान",
      metricTotalBirds: "कुल पक्षी",
      metricInitialBiomass: "प्रारंभिक बायोमास",
      metricCurrentBiomass: "वर्तमान बायोमास",
      metricTargetBiomass: "लक्ष्य बायोमास",
      detailsTitle: "झुंड विवरण",
    },
    manage: {
      backBtn: "← मेरे झुंड पर लौटें",
      activeStatus: "सक्रिय",
      completedStatus: "पूर्ण",
      tabOverview: "झुंड अवलोकन",
      tabGrowthFeed: "वृद्धि एवं आहार",
      tabHealth: "झुंड स्वास्थ्य",
      tabVaccinations: "टीकाकरण",
      metricBirdCount: "पक्षी संख्या",
      metricAvgWeight: "औसत भार",
      metricAge: "आयु",
      metricTargetWeight: "लक्ष्य भार",
      metricFeedConsumed: "खपत आहार",
      metricFcr: "एफसीआर",
      metricMortality: "मृत्यु दर",
      metricSurvivalRate: "उत्तरजीविता दर",
      growthSectionTitle: "वृद्धि एवं आहार प्रदर्शन",
      feedSectionTitle: "आहार वितरण लॉग",
      healthSectionTitle: "स्वास्थ्य एवं नैदानिक रिकॉर्ड",
      vaccineSectionTitle: "राष्ट्रीय कुक्कुट टीकाकरण प्रोटोकॉल",
      diseaseCol: "निवारित रोग",
      vaccineCol: "वैक्सीन स्ट्रेन",
      ageCol: "अनुसूची (आयु)",
      statusCol: "स्थिति",
      routeCol: "विधि",
      feedDateCol: "तिथि एवं समय",
      feedTypeCol: "आहार प्रकार",
      feedRationCol: "मात्रा (किग्रा)",
      feedFcrCol: "एफसीआर",
      btnAskAi: "झुंड एआई से पूछें",
      btnCloseFlock: "पूर्ण घोषित करें",
      btnDeleteFlock: "झुंड हटाएं",
      btnRecordDailyFeed: "दैनिक आहार दर्ज करें",
      btnRecordMortality: "मृत्यु संख्या दर्ज करें",
    },
  },
};
