export interface PoultryBatch {
  id: string;
  name: string;
  breed: string;
  category: "Broiler" | "Layer" | "Desi / Indigenous";
  status: "Active" | "Inactive";
  quantity: number;
  hatchDate: string;
  ageDays: number;
  currentWeightGrams: number;
  targetWeightGrams: number;
  shedName: string;
  shedSizeSqFt: number;
  temperatureC: number;
  humidityPercent: number;
  dailyFeedKg: number;
  cumulativeFeedKg: number;
  fcr: number;
  mortalityCount: number;
  survivalRatePercent: number;
  healthStatus: "Optimal" | "Good" | "Needs Attention";
  vaccinationStatus: string;
}

export const INITIAL_POULTRY_BATCHES: PoultryBatch[] = [
  {
    id: "poultry-flock-01",
    name: "Shed 1 - Commercial Broiler Cobb 500",
    breed: "Cobb 500",
    category: "Broiler",
    status: "Active",
    quantity: 4800,
    hatchDate: "2026-09-04",
    ageDays: 24,
    currentWeightGrams: 1480,
    targetWeightGrams: 2200,
    shedName: "Broiler Shed Alpha",
    shedSizeSqFt: 5000,
    temperatureC: 26.5,
    humidityPercent: 64,
    dailyFeedKg: 142,
    cumulativeFeedKg: 7850,
    fcr: 1.28,
    mortalityCount: 9,
    survivalRatePercent: 99.8,
    healthStatus: "Optimal",
    vaccinationStatus: "Day 21 Ranikhet Booster Completed",
  },
  {
    id: "poultry-flock-02",
    name: "Shed 2 - Desi Kadaknath Flock",
    breed: "Kadaknath",
    category: "Desi / Indigenous",
    status: "Active",
    quantity: 1200,
    hatchDate: "2026-08-01",
    ageDays: 58,
    currentWeightGrams: 560,
    targetWeightGrams: 1200,
    shedName: "Free-Range Shed Beta",
    shedSizeSqFt: 3000,
    temperatureC: 27.0,
    humidityPercent: 60,
    dailyFeedKg: 48,
    cumulativeFeedKg: 1920,
    fcr: 2.7,
    mortalityCount: 3,
    survivalRatePercent: 99.7,
    healthStatus: "Good",
    vaccinationStatus: "Week 6 Fowl Pox Completed",
  },
];
