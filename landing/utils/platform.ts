import type { PlatformArch, PlatformOs } from "~/types/platform";

export const detectPlatform = (userAgent: string): PlatformOs => {
  const ua = userAgent.toLowerCase();
  if (ua.includes("mac")) return "macos";
  if (ua.includes("win")) return "windows";
  if (ua.includes("linux")) return "linux";
  return "unknown";
};

export const detectMacArch = (userAgent: string): PlatformArch => {
  const ua = userAgent.toLowerCase();
  if (ua.includes("arm") || ua.includes("aarch64")) return "arm64";
  return "x64";
};
