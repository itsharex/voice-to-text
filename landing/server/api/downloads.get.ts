type UpdaterPlatformEntry = {
  url?: string;
  signature?: string;
  // На всякий случай: встречается в некоторых генераторах
  downloadUrl?: string;
  browser_download_url?: string;
};

type UpdaterFeed = {
  version?: string;
  notes?: string;
  pub_date?: string;
  platforms?: Record<string, UpdaterPlatformEntry>;
};

type NormalizedEntry = {
  key: string;
  url: string;
  signature?: string;
};

type NormalizedVariant = {
  url: string | null;
  platformKey: string | null;
  version: string | null;
};

type ApiResponse = {
  ok: boolean;
  source: "tauri-updater";
  updaterUrl: string;
  fetchedAt: string;
  version: string | null;
  notes: string | null;
  pubDate: string | null;
  variants: {
    macos: {
      arm64: NormalizedVariant;
      x64: NormalizedVariant;
      universal: NormalizedVariant;
    };
    windows: {
      x64: NormalizedVariant;
    };
    linux: {
      appimage: NormalizedVariant;
      deb: NormalizedVariant;
    };
  };
  all: NormalizedEntry[];
};

const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object";

const pickUrl = (entry: UpdaterPlatformEntry): string | null => {
  const url = entry.url || entry.downloadUrl || entry.browser_download_url;
  if (!url) return null;
  if (typeof url !== "string") return null;
  if (!url.startsWith("http")) return null;
  // На всякий случай: иногда рядом лежат *.sig — они нам не нужны как “скачивание”.
  if (url.endsWith(".sig")) return null;
  return url;
};

const normalizeFeed = (feed: unknown): { meta: Pick<ApiResponse, "version" | "notes" | "pubDate">; entries: NormalizedEntry[] } => {
  if (!isObject(feed)) {
    return { meta: { version: null, notes: null, pubDate: null }, entries: [] };
  }

  const f = feed as UpdaterFeed;
  const platforms = isObject(f.platforms) ? (f.platforms as Record<string, UpdaterPlatformEntry>) : {};

  const entries: NormalizedEntry[] = Object.entries(platforms)
    .map(([key, raw]) => {
      if (!raw) return null;
      const url = pickUrl(raw);
      if (!url) return null;
      return { key, url, signature: raw.signature };
    })
    .filter((x): x is NormalizedEntry => !!x);

  return {
    meta: {
      version: typeof f.version === "string" ? f.version : null,
      notes: typeof f.notes === "string" ? f.notes : null,
      pubDate: typeof f.pub_date === "string" ? f.pub_date : null
    },
    entries
  };
};

const isMac = (key: string) => /darwin|mac|macos/i.test(key);
const isWindows = (key: string) => /windows|win/i.test(key);
const isLinux = (key: string) => /linux/i.test(key);
const isArm64 = (key: string) => /aarch64|arm64/i.test(key);
const isX64 = (key: string) => /x86_64|amd64|x64/i.test(key);
const isUniversal = (key: string) => /universal/i.test(key);

const preferByExt = (entries: NormalizedEntry[], exts: string[]) => {
  for (const ext of exts) {
    const found = entries.find((e) => e.url.toLowerCase().endsWith(ext.toLowerCase()));
    if (found) return found;
  }
  return entries[0] || null;
};

function extractVersionFromUrl(url: string): string | null {
  // Под релизные артефакты у нас обычно имена вроде:
  // Voice-to-Text_0.5.0_x64.dmg / voice-to-text_0.5.0_amd64.AppImage / ..._0.5.0_... .msi
  const m =
    url.match(/[_-]v?(\d+\.\d+\.\d+)[_-]/i) ||
    url.match(/[_-]v?(\d+\.\d+\.\d+)\./i);
  return m?.[1] || null;
}

const toVariant = (entry: NormalizedEntry | null): NormalizedVariant => ({
  url: entry?.url || null,
  platformKey: entry?.key || null,
  version: entry?.url ? extractVersionFromUrl(entry.url) : null
});

let cache: { ts: number; value: ApiResponse } | null = null;

export default defineEventHandler(async (): Promise<ApiResponse> => {
  // Кэшируем в памяти, чтобы не долбить GitHub на каждый заход.
  if (cache && Date.now() - cache.ts < 5 * 60 * 1000) return cache.value;

  const config = useRuntimeConfig();
  const updaterUrl = (config.public.tauriUpdaterUrl as string) || "";

  const empty: ApiResponse = {
    ok: false,
    source: "tauri-updater",
    updaterUrl,
    fetchedAt: new Date().toISOString(),
    version: null,
    notes: null,
    pubDate: null,
    variants: {
      macos: {
        arm64: { url: null, platformKey: null, version: null },
        x64: { url: null, platformKey: null, version: null },
        universal: { url: null, platformKey: null, version: null }
      },
      windows: { x64: { url: null, platformKey: null, version: null } },
      linux: {
        appimage: { url: null, platformKey: null, version: null },
        deb: { url: null, platformKey: null, version: null }
      }
    },
    all: []
  };

  if (!updaterUrl) return empty;

  try {
    const feed = await $fetch(updaterUrl, {
      headers: {
        // GitHub любит, когда есть нормальный UA.
        "User-Agent": "voicetextai-landing"
      }
    });

    const { meta, entries } = normalizeFeed(feed);

    const macEntries = entries.filter((e) => isMac(e.key));
    const winEntries = entries.filter((e) => isWindows(e.key));
    const linuxEntries = entries.filter((e) => isLinux(e.key));

    const macArm = preferByExt(macEntries.filter((e) => isArm64(e.key)), [".dmg"]);
    const macX64 = preferByExt(macEntries.filter((e) => isX64(e.key)), [".dmg"]);
    const macUniversal = preferByExt(macEntries.filter((e) => isUniversal(e.key)), [".dmg"]);

    const winX64 = preferByExt(winEntries.filter((e) => isX64(e.key)), [".msi", ".exe"]);

    const linuxAppImage = preferByExt(linuxEntries, [".appimage", ".AppImage"]);
    const linuxDeb = preferByExt(linuxEntries, [".deb"]);

    const value: ApiResponse = {
      ok: entries.length > 0,
      source: "tauri-updater",
      updaterUrl,
      fetchedAt: new Date().toISOString(),
      version: meta.version,
      notes: meta.notes,
      pubDate: meta.pubDate,
      variants: {
        macos: {
          arm64: toVariant(macArm),
          x64: toVariant(macX64),
          universal: toVariant(macUniversal)
        },
        windows: {
          x64: toVariant(winX64)
        },
        linux: {
          appimage: toVariant(linuxAppImage),
          deb: toVariant(linuxDeb)
        }
      },
      all: entries
    };

    cache = { ts: Date.now(), value };
    return value;
  } catch {
    cache = { ts: Date.now(), value: empty };
    return empty;
  }
});

