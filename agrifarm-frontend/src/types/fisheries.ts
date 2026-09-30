export const EXACT_FISH_SPECIES = [
  "Pangasius",
  "Rohu",
  "Catla",
  "Mrigal (Naini)",
  "Common Carp",
  "Grass Carp",
  "Silver Carp",
  "Bighead Carp",
  "Singhi",
  "Roopchand",
  "Black Carp",
  "Others",
] as const;

export type FishSpeciesName = (typeof EXACT_FISH_SPECIES)[number];

export interface BatchSpeciesItem {
  id: string;
  speciesName: FishSpeciesName;
  customName?: string;
  quantity: number;
  initialWeightGrams: number;
  currentWeightGrams: number;
  targetWeightGrams: number;
}

export interface WaterTelemetry {
  temperatureC: number;
  pH: number;
  dissolvedOxygenMgL: number;
  ammoniaMgL: number;
  lastUpdated: string;
}

export interface FeedingLog {
  id: string;
  date: string;
  time: string;
  rationKg: number;
  feedType: string;
  feedRatePercent: number;
  fcr: number;
}

export interface HealthRecord {
  id: string;
  date: string;
  mortalityCount: number;
  suspectedCause: string;
  notes: string;
  status: "Optimal" | "Good" | "Needs Attention";
}

export interface FisheriesBatch {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  stockingDate: string;
  location: string;
  pondAreaAcres: number;
  waterDepthFeet: number;
  speciesList: BatchSpeciesItem[];
  waterTelemetry: WaterTelemetry;
  todayFeedKg: number;
  feedingHistory: FeedingLog[];
  healthRecords: HealthRecord[];
  createdAt: string;
}
