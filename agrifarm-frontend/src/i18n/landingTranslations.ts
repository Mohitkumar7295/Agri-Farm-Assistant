export type SupportedLanguage = "en" | "hi";

export interface LandingContent {
  nav: {
    brandTitle: string;
    brandSubtitle: string;
    navFeatures: string;
    navSolutions: string;
    navLearnSupport: string;
    navPricing: string;
    signIn: string;
    launchPortal: string;
  };
  hero: {
    badge: string;
    headingLine1: string;
    headingLine2: string;
    subtext: string;
    btnGetStarted: string;
    tagline: string;
  };
  socialProof: {
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
  };
  coreFeatures: {
    heading: string;
    subheading: string;
    seeAll: string;
    items: Array<{
      title: string;
      desc: string;
    }>;
  };
  fisheries: {
    badge: string;
    heading: string;
    description: string;
    benefits: string[];
    linkText: string;
    cardGrowth: string;
    cardGrowthLegend1: string;
    cardGrowthLegend2: string;
    cardTotalFish: string;
    cardTotalFishVal: string;
    cardAvgWeight: string;
    cardAvgWeightVal: string;
    cardTotalFeed: string;
    cardTotalFeedVal: string;
  };
  poultry: {
    badge: string;
    heading: string;
    description: string;
    benefits: string[];
    linkText: string;
    cardTitle: string;
    cardStatus: string;
    cardLiveBirds: string;
    cardLiveBirdsVal: string;
    cardAvgWeight: string;
    cardAvgWeightVal: string;
    cardMortality: string;
    cardMortalityVal: string;
    legendWeight: string;
    legendMortality: string;
  };
  anywhere: {
    title: string;
    description: string;
    benefit1: string;
    benefit2: string;
    benefit3: string;
    videoCaption: string;
  };
  testimonials: {
    heading: string;
    items: Array<{
      quote: string;
      name: string;
      role: string;
    }>;
  };
  finalCta: {
    heading: string;
    description: string;
    btnGetStarted: string;
    badge1: string;
    badge2: string;
    badge3: string;
  };
  footer: {
    brandTitle: string;
    brandSubtitle: string;
    colPlatform: string;
    colCompany: string;
    colResources: string;
    copyright: string;
    platformLinks: Array<{ label: string; href?: string }>;
    companyLinks: Array<{ label: string; href?: string }>;
    resourceLinks: Array<{ label: string; href?: string }>;
  };
  authModal: {
    title: string;
    subtitle: string;
    description: string;
    featurePrompt: string;
    proceedButton: string;
    cancelButton: string;
  };
  megaMenu: {
    features: {
      title: string;
      farmManagementTitle: string;
      farmManagementItems: { title: string; desc: string; href?: string }[];
      intelligentSystemsTitle: string;
      intelligentSystemsItems: { title: string; desc: string; href?: string }[];
    };
    solutions: {
      title: string;
      organizationsTitle: string;
      organizationsItems: { title: string }[];
      farmTypesTitle: string;
      farmTypesItems: { title: string; status?: string; href?: string; isLive?: boolean }[];
    };
    learnSupport: {
      title: string;
      knowledgeTitle: string;
      knowledgeItems: { title: string; desc: string; href?: string }[];
      supportTitle: string;
      supportItems: { title: string; desc: string; href?: string }[];
    };
  };
}

export const landingTranslations: Record<SupportedLanguage, LandingContent> = {
  en: {
    nav: {
      brandTitle: "AgriFarmAssistant",
      brandSubtitle: "FARM MANAGEMENT PLATFORM",
      navFeatures: "Features",
      navSolutions: "Solutions",
      navLearnSupport: "Learn & Support",
      navPricing: "Pricing",
      signIn: "Login",
      launchPortal: "Dashboard",
    },
    hero: {
      badge: "AI-POWERED FARM MANAGEMENT",
      headingLine1: "Smart Farming.",
      headingLine2: "Better Decisions.",
      subtext:
        "Manage fisheries and poultry farms with AI, farm data, weather insights, and simple digital tools.",
      btnGetStarted: "Get Started →",
      tagline: "FISHERIES  •  POULTRY  •  AI  •  WEATHER",
    },
    socialProof: {
      stat1Value: "7,000+",
      stat1Label: "Farmers using AgriFarmAssistant",
      stat2Value: "4.9/5",
      stat2Label: "Farmer satisfaction rating",
      stat3Value: "15+",
      stat3Label: "Years of combined domain expertise",
    },
    coreFeatures: {
      heading: "Built to support modern farming",
      subheading:
        "Everything you need to manage your fish and poultry farm in one place.",
      seeAll: "See all features →",
      items: [
        {
          title: "Farm Management",
          desc: "Manage ponds, poultry, batches and daily operations",
        },
        {
          title: "AI Assistant",
          desc: "Get expert advice for fish and poultry in Hindi or English",
        },
        {
          title: "Weather Insights",
          desc: "Real-time weather data and early alerts for your farm",
        },
        {
          title: "Disease & Mortality Alerts",
          desc: "Early detection and preventive recommendations",
        },
        {
          title: "Feed & Growth Tracking",
          desc: "Track feed intake, growth and FCR with easy charts",
        },
        {
          title: "Expense Management",
          desc: "Record and categorize all farm expenses",
        },
      ],
    },
    fisheries: {
      badge: "FISHERIES MANAGEMENT",
      heading: "Complete pond management for better harvests",
      description:
        "Track pond batches, water quality, feeding schedules, growth performance and get AI-powered recommendations for healthy and profitable fish farming.",
      benefits: [
        "Manage multiple ponds and batches",
        "Track water quality (DO, pH, temperature)",
        "Feed calculation and FCR analysis",
        "Disease prediction and early alerts",
      ],
      linkText: "Explore fisheries features →",
      cardGrowth: "Growth Trend",
      cardGrowthLegend1: "Average Weight (g)",
      cardGrowthLegend2: "Total Biomass (kg)",
      cardTotalFish: "Total Fish",
      cardTotalFishVal: "12,500",
      cardAvgWeight: "Average Weight",
      cardAvgWeightVal: "320 g",
      cardTotalFeed: "Total Feed",
      cardTotalFeedVal: "850 kg",
    },
    poultry: {
      badge: "POULTRY MANAGEMENT",
      heading: "Healthy poultry. Higher productivity.",
      description:
        "Manage broiler and layer batches, track feed intake, monitor mortality, and get AI guidance for better poultry health and higher returns.",
      benefits: [
        "Track poultry batches and cycles",
        "Feed intake and weight monitoring",
        "Mortality tracking and alerts",
        "Vaccination and task reminders",
      ],
      linkText: "Explore poultry features →",
      cardTitle: "Poultry Performance",
      cardStatus: "Last 4 Weeks",
      cardLiveBirds: "Live Birds",
      cardLiveBirdsVal: "4,800",
      cardAvgWeight: "Avg. Weight",
      cardAvgWeightVal: "1.85 kg",
      cardMortality: "Mortality",
      cardMortalityVal: "2.1%",
      legendWeight: "Weight (kg)",
      legendMortality: "Mortality (%)",
    },
    anywhere: {
      title: "Access your farm anywhere",
      description:
        "Get real-time updates, AI advice and farm insights on web and mobile.",
      benefit1: "Real-time data and analytics",
      benefit2: "Weather alerts and notifications",
      benefit3: "Multilingual support (Hindi & English)",
      videoCaption: "Watch how AgriFarmAssistant helps farmers",
    },
    testimonials: {
      heading: "What Farmers Say",
      items: [
        {
          quote:
            "“AgriFarmAssistant helped me track my fish growth and feeding. The AI advice in Hindi is very useful.”",
          name: "Rajesh Kumar",
          role: "Fish Farmer, Bihar",
        },
        {
          quote:
            "“The poultry management features are simple and easy to use. It helped me reduce mortality in my farm.”",
          name: "Suresh Yadav",
          role: "Poultry Farmer, Uttar Pradesh",
        },
      ],
    },
    finalCta: {
      heading: "Start Your Smart Farming Journey",
      description:
        "Join thousands of farmers who are using AI and digital tools to improve productivity and profitability in fisheries and poultry farming.",
      btnGetStarted: "Get Started →",
      badge1: "Full access to all features",
      badge2: "No credit card required",
      badge3: "Cancel anytime",
    },
    footer: {
      brandTitle: "AgriFarmAssistant",
      brandSubtitle: "Farm Management Platform",
      colPlatform: "Platform",
      colCompany: "Company",
      colResources: "Resources",
      copyright: "© 2026 AgriFarmAssistant. All rights reserved.",
      platformLinks: [
        { label: "Fisheries", href: "/fisheries" },
        { label: "Poultry", href: "/poultry" },
        { label: "AI Assistant", href: "/ai-assistant" },
        { label: "Weather" },
        { label: "Alerts" },
        { label: "Expenses" },
      ],
      companyLinks: [
        { label: "About" },
        { label: "Contact" },
        { label: "Support" },
      ],
      resourceLinks: [
        { label: "Documentation" },
        { label: "Farming Guides" },
        { label: "Help Center" },
      ],
    },
    authModal: {
      title: "Authentication Required",
      subtitle: "Sign In to Access AgriFarmAssistant",
      description:
        "To manage batches, view real-time farm telemetry, or interact with the AI assistant, please sign in.",
      featurePrompt: "You are attempting to access",
      proceedButton: "Proceed to Login",
      cancelButton: "Continue Browsing",
    },
    megaMenu: {
      features: {
        title: "Platform Features",
        farmManagementTitle: "FARM MANAGEMENT",
        farmManagementItems: [
          {
            title: "Fisheries & Pond Batches",
            desc: "Pond stocking, biomass projection, feed calculation, and harvest cycles",
            href: "/fisheries",
          },
          {
            title: "Poultry Batches",
            desc: "Broiler & layer cohorts, mortality logging, and egg production",
            href: "/poultry",
          },
        ],
        intelligentSystemsTitle: "INTELLIGENT SYSTEMS",
        intelligentSystemsItems: [
          {
            title: "Feed & Biomass Tracking",
            desc: "Calculate feed intake, optimize FCR, and forecast biomass expansion",
          },
          {
            title: "Water Quality & Aeration",
            desc: "Track DO, pH, salinity, ammonia, and automated aerator run schedules",
          },
          {
            title: "Farm Expense Ledger",
            desc: "Record feed, seed, electricity, labor, medication, and fuel expenses",
          },
          {
            title: "Daily Farm Tasks & Schedules",
            desc: "Automated routine task lists, feeding alarms, and operational checklists",
          },
          {
            title: "AgriFarm AI Assistant",
            desc: "Bilingual voice and text diagnostics, dosage guides, and troubleshooting",
          },
          {
            title: "Hyperlocal Weather & Climate",
            desc: "Real-time rainfall, barometric trend, wind vector, and extreme alerts",
          },
          {
            title: "Disease & Mortality Alerts",
            desc: "Early symptom anomaly flags, necropsy logs, and biosecurity protocols",
          },
          {
            title: "Growth & FCR Analytics",
            desc: "Benchmark actual weight gain curves against scientific standard tables",
          },
          {
            title: "ICAR Scientific Protocols",
            desc: "Pre-loaded agronomic and fisheries guidelines calibrated for Indian zones",
          },
          {
            title: "Multilingual Voice & Text",
            desc: "Seamless translation between English and Hindi across the platform",
          },
        ],
      },
      solutions: {
        title: "Solutions",
        organizationsTitle: "BY OPERATION SCALE",
        organizationsItems: [
          { title: "Individual Farmers" },
          { title: "Commercial Farm Enterprises" },
          { title: "Agricultural Cooperatives" },
          { title: "Government & Research Bodies" },
        ],
        farmTypesTitle: "BY FARM TYPE",
        farmTypesItems: [
          { title: "Fisheries" },
          { title: "Chicken and Poultry" },
        ],
      },
      learnSupport: {
        title: "Learn & Support",
        knowledgeTitle: "KNOWLEDGE & PROTOCOLS",
        knowledgeItems: [
          {
            title: "ICAR Scientific Standards",
            desc: "Verified agricultural practices tailored for Indian climate zones",
          },
          {
            title: "Feed Conversion Ratio (FCR) Guide",
            desc: "Formulas, calculation tools, and benchmark FCR tables",
          },
          {
            title: "Broiler Temperature & Ventilation Guide",
            desc: "Brooding climate guidelines, heat stress, and airflow management",
          },
          {
            title: "Pond Water Safety Parameters",
            desc: "Optimal DO, pH, ammonia, alkalinity, and plankton bloom indicators",
          },
          {
            title: "Poultry Vaccination Schedule",
            desc: "Standard timetable for Mareks, ND, IBD, and booster doses",
          },
          {
            title: "Farm Biosecurity Checklist",
            desc: "Disinfection, footbaths, visitor containment, and hygiene standards",
          },
        ],
        supportTitle: "SUPPORT & RESOURCES",
        supportItems: [
          {
            title: "Farmer Help Center",
            desc: "Getting started guides, batch setup walkthroughs, and FAQs",
          },
          {
            title: "AgriFarm AI Assistant Advisory",
            desc: "Ask any farm management question 24/7 in English or Hindi",
          },
          {
            title: "Video Demonstrations",
            desc: "Watch how to manage ponds, poultry, feed, and telemetry",
          },
          {
            title: "Expert Consultation Network",
            desc: "Connect with certified veterinarians and fisheries specialists",
          },
          {
            title: "Community Discussions",
            desc: "Peer insights and collaborative advice from active farmers",
          },
          {
            title: "Direct Support Desk",
            desc: "Dedicated support team for onboarding and technical assistance",
          },
        ],
      },
    },
  },
  hi: {
    nav: {
      brandTitle: "कृषि-फार्म सहायक",
      brandSubtitle: "फार्म प्रबंधन प्लेटफॉर्म",
      navFeatures: "सुविधाएँ",
      navSolutions: "समाधान",
      navLearnSupport: "सीखें और सहायता",
      navPricing: "मूल्य निर्धारण",
      signIn: "लॉगिन",
      launchPortal: "डैशबोर्ड",
    },
    hero: {
      badge: "एआई-संचालित फार्म प्रबंधन",
      headingLine1: "स्मार्ट फार्मिंग।",
      headingLine2: "बेहतर निर्णय।",
      subtext:
        "एआई, फार्म डेटा, मौसम जानकारी और सरल डिजिटल टूल्स के साथ अपने मत्स्य और पोल्ट्री फार्म का प्रबंधन करें।",
      btnGetStarted: "शुरू करें →",
      tagline: "मत्स्य पालन  •  पोल्ट्री  •  एआई  •  मौसम",
    },
    socialProof: {
      stat1Value: "7,000+",
      stat1Label: "एग्रीफार्मअसिस्टेंट का उपयोग करने वाले किसान",
      stat2Value: "4.9/5",
      stat2Label: "किसान संतुष्टि रेटिंग",
      stat3Value: "15+",
      stat3Label: "कृषि क्षेत्र में वर्षों का संयुक्त अनुभव",
    },
    coreFeatures: {
      heading: "आधुनिक कृषि के लिए निर्मित",
      subheading:
        "अपने मछली और पोल्ट्री फार्म को एक ही स्थान पर प्रबंधित करने के लिए आवश्यक सब कुछ।",
      seeAll: "सभी सुविधाएं देखें →",
      items: [
        {
          title: "फार्म प्रबंधन",
          desc: "तालाबों, झुंडों, बैचों और दैनिक संचालन का प्रबंधन करें",
        },
        {
          title: "एआई सहायक",
          desc: "मछली और पोल्ट्री पालन के लिए हिंदी या अंग्रेजी में विशेषज्ञ सलाह लें",
        },
        {
          title: "मौसम की जानकारी",
          desc: "अपने फार्म के लिए वास्तविक समय का मौसम डेटा और प्रारंभिक अलर्ट",
        },
        {
          title: "रोग और मृत्यु दर अलर्ट",
          desc: "प्रारंभिक पहचान और निवारक सिफारिशें प्राप्त करें",
        },
        {
          title: "चारा और वृद्धि ट्रैकिंग",
          desc: "सरल चार्ट के साथ चारा सेवन, वृद्धि और एफसीआर को ट्रैक करें",
        },
        {
          title: "व्यय प्रबंधन",
          desc: "फार्म के सभी खर्चों को रिकॉर्ड और वर्गीकृत करें",
        },
      ],
    },
    fisheries: {
      badge: "मत्स्य प्रबंधन",
      heading: "बेहतर उपज के लिए सम्पूर्ण तालाब प्रबंधन",
      description:
        "तालाब के बैच, पानी की गुणवत्ता, भोजन का समय, विकास दर ट्रैक करें और स्वस्थ तथा अधिक लाभदायक मछली पालन के लिए एआई अनुशंसाएं प्राप्त करें।",
      benefits: [
        "कई तालाबों और बैचों का प्रबंधन करें",
        "पानी की गुणवत्ता (DO, pH, तापमान) ट्रैक करें",
        "चारा गणना और एफसीआर विश्लेषण",
        "रोग पूर्वानुमान और प्रारंभिक चेतावनी",
      ],
      linkText: "मत्स्य पालन सुविधाएं देखें →",
      cardGrowth: "वृद्धि रुझान",
      cardGrowthLegend1: "औसत वजन (g)",
      cardGrowthLegend2: "कुल बायोमास (kg)",
      cardTotalFish: "कुल मछलियां",
      cardTotalFishVal: "12,500",
      cardAvgWeight: "औसत वजन",
      cardAvgWeightVal: "320 ग्राम",
      cardTotalFeed: "कुल चारा",
      cardTotalFeedVal: "850 किग्रा",
    },
    poultry: {
      badge: "पोल्ट्री प्रबंधन",
      heading: "स्वस्थ झुंड। उच्च उत्पादकता।",
      description:
        "ब्रायलर और लेयर बैचों का प्रबंधन करें, दाना खपत ट्रैक करें, मृत्यु दर पर नजर रखें और बेहतर स्वास्थ्य और अधिक लाभ के लिए एआई सलाह लें।",
      benefits: [
        "झुंड बैचों और चक्रों को ट्रैक करें",
        "दाना खपत और वजन की निगरानी",
        "मृत्यु दर ट्रैकिंग और सतर्कताएं",
        "टीकाकरण और दैनिक कार्य अनुस्मारक",
      ],
      linkText: "पोल्ट्री सुविधाएं देखें →",
      cardTitle: "झुंड प्रदर्शन",
      cardStatus: "पिछले 4 सप्ताह",
      cardLiveBirds: "जीवित पक्षी",
      cardLiveBirdsVal: "4,800",
      cardAvgWeight: "औसत वजन",
      cardAvgWeightVal: "1.85 किग्रा",
      cardMortality: "मृत्यु दर",
      cardMortalityVal: "2.1%",
      legendWeight: "वजन (kg)",
      legendMortality: "मृत्यु दर (%)",
    },
    anywhere: {
      title: "कहीं से भी अपने फार्म तक पहुंचें",
      description:
        "वेब और मोबाइल पर रियल-टाइम अपडेट, एआई सलाह और फार्म की जानकारी प्राप्त करें।",
      benefit1: "वास्तविक समय डेटा और विश्लेषण",
      benefit2: "मौसम अलर्ट और सूचनाएं",
      benefit3: "बहुभाषी सहायता (हिन्दी एवं अंग्रेजी)",
      videoCaption: "देखें कि कैसे कृषि-फार्म सहायक किसानों की मदद करता है",
    },
    testimonials: {
      heading: "किसान क्या कहते हैं",
      items: [
        {
          quote:
            "“एग्रीफार्मअसिस्टेंट ने मुझे मछली की वृद्धि और दाना प्रबंधन में बहुत मदद की। हिंदी में एआई सलाह बहुत उपयोगी है।”",
          name: "राजेश कुमार",
          role: "मत्स्य फार्म स्वामी, बिहार",
        },
        {
          quote:
            "“पोल्ट्री प्रबंधन की सुविधाएं बहुत सरल और उपयोग में आसान हैं। इससे मेरे फार्म में मृत्यु दर को कम करने में मदद मिली।”",
          name: "सुरेश यादव",
          role: "पोल्ट्री फार्मर, उत्तर प्रदेश",
        },
      ],
    },
    finalCta: {
      heading: "अपनी स्मार्ट फार्मिंग यात्रा शुरू करें",
      description:
        "उन हजारों किसानों से जुड़ें जो मत्स्य और पोल्ट्री फार्मिंग में उत्पादकता और लाभ बढ़ाने के लिए एआई और डिजिटल टूल्स का उपयोग कर रहे हैं।",
      btnGetStarted: "शुरू करें →",
      badge1: "सभी सुविधाओं तक पूर्ण पहुंच",
      badge2: "किसी क्रेडिट कार्ड की आवश्यकता नहीं",
      badge3: "कभी भी रद्द करें",
    },
    footer: {
      brandTitle: "कृषि-फार्म सहायक",
      brandSubtitle: "फार्म प्रबंधन प्लेटफॉर्म",
      colPlatform: "प्लेटफॉर्म",
      colCompany: "कंपनी",
      colResources: "संसाधन",
      copyright: "© 2026 कृषि-फार्म सहायक। सर्वाधिकार सुरक्षित।",
      platformLinks: [
        { label: "मत्स्य पालन", href: "/fisheries" },
        { label: "पोल्ट्री", href: "/poultry" },
        { label: "एआई सहायक", href: "/ai-assistant" },
        { label: "मौसम" },
        { label: "अलर्ट" },
        { label: "व्यय" },
      ],
      companyLinks: [
        { label: "हमारे बारे में" },
        { label: "संपर्क" },
        { label: "सहायता" },
      ],
      resourceLinks: [
        { label: "दस्तावेज़ीकरण" },
        { label: "कृषि गाइड" },
        { label: "सहायता केंद्र" },
      ],
    },
    authModal: {
      title: "प्रमाणीकरण आवश्यक है",
      subtitle: "कृषि-फार्म सहायक का उपयोग करने के लिए लॉगिन करें",
      description:
        "बैच प्रबंधन, लाइव टेलीमेट्री और एआई सहायक का उपयोग करने के लिए कृपया साइन इन करें।",
      featurePrompt: "आप एक्सेस करने का प्रयास कर रहे हैं",
      proceedButton: "लॉगिन पर जाएं",
      cancelButton: "ब्राउज़ करना जारी रखें",
    },
    megaMenu: {
      features: {
        title: "प्लेटफॉर्म सुविधाएँ",
        farmManagementTitle: "फार्म प्रबंधन",
        farmManagementItems: [
          {
            title: "मत्स्य एवं तालाब बैच",
            desc: "तालाब स्टॉकिंग, बायोमास अनुमान, दाना गणना, और हार्वेस्ट चक्र",
            href: "/fisheries",
          },
          {
            title: "पोल्ट्री और झुंड बैच",
            desc: "ब्रायलर और लेयर झुंड, मृत्यु दर रिकॉर्डिंग, और अंडा उत्पादन",
            href: "/poultry",
          },
        ],
        intelligentSystemsTitle: "बुद्धिमान प्रणालियाँ",
        intelligentSystemsItems: [
          {
            title: "चारा एवं बायोमास ट्रैकिंग",
            desc: "चारा खपत की गणना करें, FCR अनुकूलित करें, और विकास का पूर्वानुमान लगाएं",
          },
          {
            title: "जल गुणवत्ता एवं वातन",
            desc: "DO, pH, लवणता, अमोनिया और वातन समय सारिणी ट्रैक करें",
          },
          {
            title: "फार्म व्यय बहीखाता",
            desc: "चारा, बीज, बिजली, श्रम, दवा और ईंधन खर्च रिकॉर्ड करें",
          },
          {
            title: "दैनिक फार्म कार्य एवं समय सारणी",
            desc: "स्वचालित दिनचर्या कार्य सूची, भोजन अलार्म, और संचालन चेकलिस्ट",
          },
          {
            title: "कृषि-फार्म एआई सहायक",
            desc: "द्विभाषी आवाज और पाठ निदान, खुराक गाइड, और समस्या निवारण",
          },
          {
            title: "हाइपरलोकल मौसम एवं जलवायु",
            desc: "वास्तविक समय वर्षा, वायुदाब, हवा की दिशा, और मौसम अलर्ट",
          },
          {
            title: "रोग एवं मृत्यु दर अलर्ट",
            desc: "प्रारंभिक लक्षण विसंगति संकेत और जैव सुरक्षा प्रोटोकॉल",
          },
          {
            title: "वृद्धि एवं एफसीआर एनालिटिक्स",
            desc: "वैज्ञानिक मानक तालिकाओं के विरुद्ध वास्तविक वजन की तुलना करें",
          },
          {
            title: "आईसीएआर वैज्ञानिक प्रोटोकॉल",
            desc: "भारतीय जलवायु क्षेत्रों के अनुसार पूर्व-भारित कृषि दिशा-निर्देश",
          },
          {
            title: "बहुभाषी आवाज और पाठ",
            desc: "अंग्रेजी और हिंदी के बीच सहज भाषा परिवर्तन",
          },
        ],
      },
      solutions: {
        title: "समाधान",
        organizationsTitle: "संचालन स्तर के अनुसार",
        organizationsItems: [
          { title: "व्यक्तिगत किसान" },
          { title: "व्यावसायिक कृषि उद्यम" },
          { title: "कृषि सहकारी समितियाँ" },
          { title: "सरकारी एवं अनुसंधान संस्थाएं" },
        ],
        farmTypesTitle: "फार्म के प्रकार अनुसार",
        farmTypesItems: [
          { title: "मत्स्य पालन" },
          { title: "मुर्गी एवं पोल्ट्री पालन" },
        ],
      },
      learnSupport: {
        title: "सीखें और सहायता",
        knowledgeTitle: "ज्ञान एवं प्रोटोकॉल",
        knowledgeItems: [
          {
            title: "आईसीएआर वैज्ञानिक मानक",
            desc: "भारतीय कृषि जलवायु क्षेत्रों के लिए सत्यापित कृषि पद्धतियाँ",
          },
          {
            title: "चारा रूपांतरण अनुपात (FCR) गाइड",
            desc: "सूत्र, गणना उपकरण और मानक FCR तालिकाएँ",
          },
          {
            title: "ब्रायलर तापमान और वेंटिलेशन गाइड",
            desc: "ब्रूडिंग तापमान दिशा-निर्देश, हीट स्ट्रेस, और वायु प्रवाह प्रबंधन",
          },
          {
            title: "तालाब जल सुरक्षा पैरामीटर",
            desc: "इष्टतम DO, pH, अमोनिया, क्षारीयता, और प्लवक ब्लूम संकेतक",
          },
          {
            title: "पोल्ट्री टीकाकरण समय सारणी",
            desc: "मारेक्स, एनडी, आईबीडी और बूस्टर खुराक के लिए मानक समय सारिणी",
          },
          {
            title: "फार्म जैव सुरक्षा चेकलिस्ट",
            desc: "कीटाणुशोधन, फुटबाथ, आगंतुक नियंत्रण और स्वच्छता मानक",
          },
        ],
        supportTitle: "सहायता एवं संसाधन",
        supportItems: [
          {
            title: "किसान सहायता केंद्र",
            desc: "शुरुआती गाइड, बैच सेटअप वॉकथ्रू और अक्सर पूछे जाने वाले प्रश्न",
          },
          {
            title: "कृषि-फार्म एआई सलाहकार",
            desc: "अंग्रेजी या हिंदी में 24/7 कोई भी फार्म प्रबंधन प्रश्न पूछें",
          },
          {
            title: "वीडियो प्रदर्शन",
            desc: "तालाब, झुंड, चारा और टेलीमेट्री प्रबंधित करने का वीडियो देखें",
          },
          {
            title: "विशेषज्ञ परामर्श नेटवर्क",
            desc: "प्रमाणित पशु चिकित्सकों और मत्स्य विशेषज्ञों से जुड़ें",
          },
          {
            title: "समुदाय चर्चा",
            desc: "सक्रिय किसानों से अनुभव और सहयोगात्मक सलाह",
          },
          {
            title: "प्रत्यक्ष सहायता डेस्क",
            desc: "ऑनबोर्डिंग और तकनीकी सहायता के लिए समर्पित टीम",
          },
        ],
      },
    },
  },
};
