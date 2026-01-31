import type { LocaleCode } from "~/data/i18n";

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
}

export interface ProviderItem {
  id: string;
  name: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface PrivacyContent {
  title: string;
  bullets: string[];
  openSourceNote: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
}

export interface DownloadContent {
  title: string;
  note: string;
}

export interface LandingContent {
  hero: HeroContent;
  features: FeatureItem[];
  providers: ProviderItem[];
  privacy: PrivacyContent;
  faq: FaqItem[];
  download: DownloadContent;
}

export type LocalizedContent = Record<LocaleCode, LandingContent>;
