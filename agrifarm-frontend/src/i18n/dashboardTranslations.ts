import enLocale from "./locales/en.json";
import hiLocale from "./locales/hi.json";

export type DashboardLanguage = "en" | "hi";
export type DashboardContent = typeof enLocale;

export const dashboardTranslations: Record<DashboardLanguage, DashboardContent> = {
  en: enLocale,
  hi: hiLocale,
};
