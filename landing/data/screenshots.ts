import dark from "~/assets/images/screenshots/dark.svg";
import light from "~/assets/images/screenshots/light.svg";
import settings from "~/assets/images/screenshots/settings.svg";
import recording from "~/assets/images/screenshots/recording.svg";

export const screenshots = [
  {
    id: "dark",
    labelKey: "screenshots.dark",
    src: dark,
    width: 1200,
    height: 750
  },
  {
    id: "light",
    labelKey: "screenshots.light",
    src: light,
    width: 1200,
    height: 750
  },
  {
    id: "settings",
    labelKey: "screenshots.settings",
    src: settings,
    width: 1200,
    height: 750
  },
  {
    id: "recording",
    labelKey: "screenshots.recording",
    src: recording,
    width: 1200,
    height: 750
  }
] as const;
