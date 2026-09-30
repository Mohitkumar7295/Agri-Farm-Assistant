export const POULTRY_CATEGORIES = [
  "Commercial Broiler",
  "Layer (Egg Production)",
  "Desi / Indigenous (Kadaknath/Aseel)",
  "Dual Purpose",
] as const;

export type PoultryCategory = (typeof POULTRY_CATEGORIES)[number];

export const COMMON_POULTRY_BREEDS = [
  "Cobb 500",
  "Ross 308",
  "Hubbard",
  "Kadaknath",
  "Aseel",
  "BV 300",
  "Gramapriya",
  "Vanaraja",
  "Chabro",
  "Other",
] as const;

export type PoultryBreed = (typeof COMMON_POULTRY_BREEDS)[number];

export interface PoultryVaccinationRecord {
  id: string;
  ageDays: number;
  diseaseName: string;
  vaccineName: string;
  status: "Completed" | "Pending" | "Overdue";
  scheduledDate: string;
  administeredDate?: string;
  route: string;
}

export interface PoultryFeedingRecord {
  id: string;
  date: string;
  time: string;
  feedType: string;
  rationKg: number;
  fcr: number;
}

export interface PoultryHealthRecord {
  id: string;
  date: string;
  mortalityCount: number;
  suspectedCause: string;
  symptoms: string;
  status: "Optimal" | "Good" | "Needs Attention";
  notes: string;
}

export interface PoultryFlock {
  id: string;
  name: string;
  category: PoultryCategory;
  breed: string;
  status: "Active" | "Completed";
  stockingDate: string;
  location: string;
  shedName: string;
  shedSizeSqFt: number;
  initialBirds: number;
  currentBirds: number;
  ageDays: number;
  initialWeightGrams: number;
  currentWeightGrams: number;
  targetWeightGrams: number;
  dailyFeedKg: number;
  cumulativeFeedKg: number;
  fcr: number;
  mortalityCount: number;
  survivalRatePercent: number;
  healthStatus: "Optimal" | "Good" | "Needs Attention";
  temperatureC: number;
  humidityPercent: number;
  vaccinations: PoultryVaccinationRecord[];
  feedingHistory: PoultryFeedingRecord[];
  healthRecords: PoultryHealthRecord[];
  createdAt: string;
}
