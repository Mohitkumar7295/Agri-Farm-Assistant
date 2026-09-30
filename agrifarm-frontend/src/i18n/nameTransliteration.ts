/**
 * Name Transliteration and Language Formatting Utility
 * Strictly prevents language mixing between English and Hindi.
 */

// Common names and titles exact mappings
const NAME_MAP_EN_TO_HI: Record<string, string> = {
  ramu: "रामू",
  kisan: "किसान",
  farmer: "किसान साथी",
  ramesh: "रमेश",
  chandra: "चंद्र",
  mohit: "मोहित",
  kumar: "कुमार",
  suresh: "सुरेश",
  rajesh: "राजेश",
  dinesh: "दिनेश",
  mahesh: "महेश",
  mukesh: "मुकेश",
  anil: "अनिल",
  sunil: "सुनील",
  vijay: "विजय",
  ajay: "अजय",
  sanjay: "संजय",
  manoj: "मनोज",
  vikas: "विकास",
  amit: "अमित",
  rohit: "रोहित",
  patel: "पटेल",
  sharma: "शर्मा",
  verma: "वर्मा",
  singh: "सिंह",
  yadav: "यादव",
  choudhary: "चौधरी",
  chowdhury: "चौधरी",
  gupta: "गुप्ता",
  mishra: "मिश्रा",
  pandey: "पांडेय",
  joshi: "जोशी",
  rathore: "राठौर",
  meena: "मीणा",
  devi: "देवी",
  bai: "बाई",
  lal: "लाल",
  ram: "राम",
  kishore: "किशोर",
  prasad: "प्रसाद",
  prakash: "प्रकाश",
  deepak: "दीपक",
  pooja: "पूजा",
  priya: "प्रिया",
  sunita: "सुनीता",
  anita: "अनिता",
  rekha: "रेखा",
  geeta: "गीता",
  radha: "राधा",
  sita: "सीता",
  "ramu kisan": "रामू किसान",
  "ramesh chandra": "रमेश चंद्र",
  "mohit kumar": "मोहित कुमार",
};

const NAME_MAP_HI_TO_EN: Record<string, string> = {
  "रामू": "Ramu",
  "किसान": "Kisan",
  "किसान साथी": "Farmer",
  "रमेश": "Ramesh",
  "चंद्र": "Chandra",
  "मोहित": "Mohit",
  "कुमार": "Kumar",
  "सुरेश": "Suresh",
  "राजेश": "Rajesh",
  "दिनेश": "Dinesh",
  "महेश": "Mahesh",
  "मुकेश": "Mukesh",
  "अनिल": "Anil",
  "सुनील": "Sunil",
  "विजय": "Vijay",
  "अजय": "Ajay",
  "संजय": "Sanjay",
  "मनोज": "Manoj",
  "विकास": "Vikas",
  "अमित": "Amit",
  "रोहित": "Rohit",
  "पटेल": "Patel",
  "शर्मा": "Sharma",
  "वर्मा": "Verma",
  "सिंह": "Singh",
  "यादव": "Yadav",
  "चौधरी": "Choudhary",
  "गुप्ता": "Gupta",
  "मिश्रा": "Mishra",
  "पांडेय": "Pandey",
  "जोशी": "Joshi",
  "राठौर": "Rathore",
  "मीणा": "Meena",
  "देवी": "Devi",
  "बाई": "Bai",
  "लाल": "Lal",
  "राम": "Ram",
  "किशोर": "Kishore",
  "प्रसाद": "Prasad",
  "प्रकाश": "Prakash",
  "दीपक": "Deepak",
  "पूजा": "Pooja",
  "प्रिया": "Priya",
  "सुनीता": "Sunita",
  "अनिता": "Anita",
  "रेखा": "Rekha",
  "गीता": "Geeta",
  "राधा": "Radha",
  "सीता": "Sita",
  "रामू किसान": "Ramu Kisan",
  "रमेश चंद्र": "Ramesh Chandra",
  "मोहित कुमार": "Mohit Kumar",
};

// Check if string contains Devanagari characters
export function hasDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

// Convert English name to Devanagari Hindi
export function transliterateToHindi(name: string): string {
  if (!name || !name.trim()) return "रामू किसान";
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();

  // Full phrase match
  if (NAME_MAP_EN_TO_HI[lower]) {
    return NAME_MAP_EN_TO_HI[lower];
  }

  // Word-by-word match
  const words = trimmed.split(/\s+/);
  const translatedWords = words.map((word) => {
    const wLower = word.toLowerCase();
    if (NAME_MAP_EN_TO_HI[wLower]) {
      return NAME_MAP_EN_TO_HI[wLower];
    }
    // If already in Devanagari
    if (hasDevanagari(word)) {
      return word;
    }
    // Phonetic fallback
    return phoneticLatinToDevanagari(word);
  });

  return translatedWords.join(" ");
}

// Convert Devanagari Hindi name to English Latin
export function transliterateToEnglish(name: string): string {
  if (!name || !name.trim()) return "Ramu Kisan";
  const trimmed = name.trim();

  // Full phrase match
  if (NAME_MAP_HI_TO_EN[trimmed]) {
    return NAME_MAP_HI_TO_EN[trimmed];
  }

  // If already in Latin English
  if (!hasDevanagari(trimmed)) {
    return trimmed;
  }

  // Word-by-word match
  const words = trimmed.split(/\s+/);
  const convertedWords = words.map((word) => {
    if (NAME_MAP_HI_TO_EN[word]) {
      return NAME_MAP_HI_TO_EN[word];
    }
    return phoneticDevanagariToLatin(word);
  });

  return convertedWords.join(" ");
}

/**
 * Phonetic fallback for Latin to Devanagari
 */
function phoneticLatinToDevanagari(word: string): string {
  const w = word.toLowerCase();
  const vowels: Record<string, string> = {
    aa: "ा",
    ee: "ी",
    oo: "ू",
    ai: "ै",
    au: "ौ",
    a: "",
    i: "ि",
    u: "ु",
    e: "े",
    o: "ो",
  };

  const consonants: Record<string, string> = {
    kh: "ख",
    gh: "घ",
    ch: "च",
    chh: "छ",
    jh: "झ",
    th: "थ",
    dh: "ध",
    ph: "फ",
    bh: "भ",
    sh: "श",
    k: "क",
    g: "ग",
    c: "क",
    j: "ज",
    t: "त",
    d: "द",
    n: "न",
    p: "प",
    f: "फ",
    b: "ब",
    m: "म",
    y: "य",
    r: "र",
    l: "ल",
    v: "व",
    w: "व",
    s: "स",
    h: "ह",
  };

  let res = "";
  let i = 0;
  let isStart = true;

  while (i < w.length) {
    // Check 3-char consonants
    if (i + 2 < w.length && consonants[w.slice(i, i + 3)]) {
      res += consonants[w.slice(i, i + 3)];
      i += 3;
      isStart = false;
      continue;
    }
    // Check 2-char consonants
    if (i + 1 < w.length && consonants[w.slice(i, i + 2)]) {
      res += consonants[w.slice(i, i + 2)];
      i += 2;
      isStart = false;
      continue;
    }
    // Check 1-char consonants
    if (consonants[w[i]]) {
      res += consonants[w[i]];
      i++;
      isStart = false;
      continue;
    }
    // Check 2-char vowels
    if (i + 1 < w.length && vowels[w.slice(i, i + 2)] !== undefined) {
      const v = vowels[w.slice(i, i + 2)];
      res += isStart ? (w.slice(i, i + 2) === "aa" ? "आ" : "ए") : v;
      i += 2;
      isStart = false;
      continue;
    }
    // Check 1-char vowels
    if (vowels[w[i]] !== undefined) {
      const v = vowels[w[i]];
      if (isStart) {
        const startVowels: Record<string, string> = {
          a: "अ",
          i: "इ",
          u: "उ",
          e: "ए",
          o: "ओ",
        };
        res += startVowels[w[i]] || "अ";
      } else {
        res += v;
      }
      i++;
      isStart = false;
      continue;
    }
    // Any remaining char
    res += w[i];
    i++;
    isStart = false;
  }

  return res || word;
}

/**
 * Phonetic fallback for Devanagari to Latin
 */
function phoneticDevanagariToLatin(word: string): string {
  const map: Record<string, string> = {
    "क": "k", "ख": "kh", "ग": "g", "घ": "gh",
    "च": "ch", "छ": "chh", "ज": "j", "झ": "jh",
    "ट": "t", "ठ": "th", "ड": "d", "ढ": "dh", "ण": "n",
    "त": "t", "थ": "th", "द": "d", "ध": "dh", "न": "n",
    "प": "p", "फ": "ph", "ब": "b", "भ": "bh", "म": "m",
    "य": "y", "र": "r", "ल": "l", "व": "v",
    "श": "sh", "ष": "sh", "स": "s", "ह": "h",
    "ा": "a", "ि": "i", "ी": "ee", "ु": "u", "ू": "oo",
    "े": "e", "ै": "ai", "ो": "o", "ौ": "au",
    "ं": "n", "ः": "h", "्": "",
    "अ": "A", "आ": "Aa", "इ": "I", "ई": "Ee", "उ": "U", "ऊ": "Oo",
    "ए": "E", "ऐ": "Ai", "ओ": "O", "औ": "Au",
  };

  let res = "";
  for (const char of word) {
    if (map[char] !== undefined) {
      res += map[char];
    } else {
      res += char;
    }
  }

  if (res.length > 0) {
    return res.charAt(0).toUpperCase() + res.slice(1);
  }
  return word;
}

/**
 * Format Farmer Name according to target language:
 * - English mode: 100% English ("Ramu Kisan") without any brackets
 * - Hindi mode: 100% Hindi ("रामू किसान") without any brackets
 */
export function formatFarmerName(
  storedName: string | undefined | null,
  lang: "en" | "hi"
): string {
  const defaultEn = "Ramu Kisan";
  const defaultHi = "रामू किसान";

  if (!storedName || !storedName.trim()) {
    return lang === "hi" ? defaultHi : defaultEn;
  }

  let raw = storedName.trim();

  // If input contains bilingual pattern with brackets like:
  // "रामू किसान (Ramu Kisan)" or "Ramu Kisan (रामू किसान)" or "(Ramu Kisan)"
  const bracketMatch = raw.match(/[\(\[\{](.*?)[\)\]\}]/);
  if (bracketMatch) {
    const insideBracket = bracketMatch[1].trim();
    const outsideBracket = raw.replace(/[\(\[\{].*?[\)\]\}]/g, "").trim();

    if (lang === "en") {
      // Pick the English portion
      if (outsideBracket.length > 0 && !hasDevanagari(outsideBracket)) {
        raw = outsideBracket;
      } else if (insideBracket.length > 0 && !hasDevanagari(insideBracket)) {
        raw = insideBracket;
      } else {
        raw = outsideBracket || insideBracket;
      }
    } else {
      // Pick the Hindi portion
      if (hasDevanagari(outsideBracket)) {
        raw = outsideBracket;
      } else if (hasDevanagari(insideBracket)) {
        raw = insideBracket;
      } else {
        raw = outsideBracket || insideBracket;
      }
    }
  }

  // Strip all brackets/parentheses
  const clean = raw.replace(/[()[\]{}]/g, "").trim();

  if (!clean) {
    return lang === "hi" ? defaultHi : defaultEn;
  }

  if (lang === "en") {
    if (hasDevanagari(clean)) {
      return transliterateToEnglish(clean).replace(/[()[\]{}]/g, "").trim();
    }
    return clean;
  } else {
    if (!hasDevanagari(clean)) {
      return transliterateToHindi(clean).replace(/[()[\]{}]/g, "").trim();
    }
    return clean;
  }
}
