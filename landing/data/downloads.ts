export type DownloadOs = "macos" | "windows" | "linux";
export type DownloadArch = "arm64" | "x64" | "universal";

export const downloadAssets = [
  {
    id: "macos-universal",
    os: "macos",
    arch: "universal",
    label: "macOS Universal",
    url: "https://github.com/777genius/voice-to-text/releases"
  },
  {
    id: "windows-x64",
    os: "windows",
    arch: "x64",
    label: "Windows x64",
    url: "https://github.com/777genius/voice-to-text/releases"
  },
  {
    id: "linux-appimage",
    os: "linux",
    arch: "x64",
    label: "Linux AppImage",
    url: "https://github.com/777genius/voice-to-text/releases"
  }
] as const;
