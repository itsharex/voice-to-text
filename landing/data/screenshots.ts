import mainLight from "~/assets/images/screenshots/main_light.png";
import mainDark from "~/assets/images/screenshots/main_dark.png";
import recordLight from "~/assets/images/screenshots/record_light.png";
import recordDark from "~/assets/images/screenshots/record_dark.png";
import settingsLight from "~/assets/images/screenshots/settings_light.png";
import settingsDark from "~/assets/images/screenshots/settings_dark.png";

export interface Screenshot {
  id: string;
  labelKey: string;
  lightSrc: string;
  darkSrc: string;
  width: number;
  height: number;
}

export const screenshots: Screenshot[] = [
  {
    id: "main",
    labelKey: "screenshots.main",
    lightSrc: mainLight,
    darkSrc: mainDark,
    width: 640,
    height: 400
  },
  {
    id: "recording",
    labelKey: "screenshots.recording",
    lightSrc: recordLight,
    darkSrc: recordDark,
    width: 640,
    height: 400
  },
  {
    id: "settings",
    labelKey: "screenshots.settings",
    lightSrc: settingsLight,
    darkSrc: settingsDark,
    width: 640,
    height: 400
  }
];
