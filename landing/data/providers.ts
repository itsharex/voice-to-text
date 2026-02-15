import { mdiTarget, mdiTranslate, mdiTuneVariant, mdiDomain, mdiTrophy } from '@mdi/js'

export const providers = [
  { id: "nova3-accuracy", key: "nova3-accuracy", icon: mdiTarget, accent: "#6366f1" },
  { id: "nova3-multilingual", key: "nova3-multilingual", icon: mdiTranslate, accent: "#06b6d4" },
  { id: "nova3-customization", key: "nova3-customization", icon: mdiTuneVariant, accent: "#8b5cf6" },
  { id: "nova3-enterprise", key: "nova3-enterprise", icon: mdiDomain, accent: "#10b981" },
  { id: "nova3-preferred", key: "nova3-preferred", icon: mdiTrophy, accent: "#f59e0b" }
] as const;
