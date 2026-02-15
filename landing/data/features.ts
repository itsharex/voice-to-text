import { mdiMicrophoneOutline, mdiTranslate, mdiDevices, mdiOpenSourceInitiative } from '@mdi/js'

export const features = [
  { id: "realtime", icon: mdiMicrophoneOutline, key: "realtime", accent: "#6366f1" },
  { id: "multilingual", icon: mdiTranslate, key: "multilingual", accent: "#14b8a6" },
  { id: "crossPlatform", icon: mdiDevices, key: "crossPlatform", accent: "#3b82f6" },
  { id: "openSource", icon: mdiOpenSourceInitiative, key: "openSource", accent: "#8b5cf6" }
] as const;
