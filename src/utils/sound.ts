/**
 * Утилиты для воспроизведения звуковых эффектов
 */

import showSoundUrl from '../assets/sounds/show.mp3';
import doneSoundUrl from '../assets/sounds/done.mp3';

type SoundName = 'show' | 'done';

type SoundConfig = {
  url: string;
  volume: number;
};

const SOUND_CONFIG: Record<SoundName, SoundConfig> = {
  show: { url: showSoundUrl, volume: 0.5 },
  done: { url: doneSoundUrl, volume: 0.5 },
};

let audioContext: AudioContext | null = null;
const decodedBuffers = new Map<string, AudioBuffer>();
const inflightDecodes = new Map<string, Promise<AudioBuffer>>();

function getAudioContext(): AudioContext | null {
  try {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    if (!audioContext) {
      // Важно: используем Web Audio, а не <audio>, чтобы короткие UI-звуки
      // не становились "Now Playing" в macOS и не перехватывали системные media keys.
      audioContext = new Ctor({ latencyHint: 'interactive' });
    }
    // WKWebView (и некоторые WebKit-сценарии) могут "закрыть" контекст после сна/ресурсов.
    // Тогда его нельзя реанимировать — надо пересоздать.
    if (audioContext.state === 'closed') {
      audioContext = new Ctor({ latencyHint: 'interactive' });
    }
    return audioContext;
  } catch (err) {
    console.warn('[Sound] Failed to create AudioContext:', err);
    return null;
  }
}

async function decodeBuffer(url: string): Promise<AudioBuffer> {
  const decoded = decodedBuffers.get(url);
  if (decoded) return decoded;

  const inflight = inflightDecodes.get(url);
  if (inflight) return inflight;

  const promise = (async (): Promise<AudioBuffer> => {
    const ctx = getAudioContext();
    if (!ctx) {
      throw new Error('AudioContext is not available');
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch sound: ${res.status} ${res.statusText}`);
    }
    const arr = await res.arrayBuffer();
    const buffer = await ctx.decodeAudioData(arr);
    decodedBuffers.set(url, buffer);
    return buffer;
  })();

  // Важно: НЕ кешируем "rejected" промисы навсегда.
  // Иначе редкий временный фейл декодинга превращается в "звук больше никогда не играет".
  inflightDecodes.set(url, promise);
  try {
    return await promise;
  } finally {
    inflightDecodes.delete(url);
  }
}

function fallbackPlayWithHtmlAudio(url: string, volume: number): void {
  try {
    const audio = new Audio(url);
    audio.volume = volume;
    audio.addEventListener(
      'ended',
      () => {
        try {
          audio.pause();
          // Важно "отвязать" src, чтобы даже в fallback режиме не оставаться последним медиаплеером.
          audio.removeAttribute('src');
          audio.load();
        } catch {
          // ignore
        }
      },
      { once: true },
    );
    void audio.play();
  } catch (err) {
    console.warn('[Sound] Failed to play sound in fallback mode:', err);
  }
}

async function tryPlayWithWebAudio(name: SoundName): Promise<boolean> {
  const { url, volume } = SOUND_CONFIG[name];

  const ctx = getAudioContext();
  if (!ctx) return false;

  try {
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const buffer = await decodeBuffer(url);

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.value = volume;

    source.connect(gain);
    gain.connect(ctx.destination);

    source.addEventListener(
      'ended',
      () => {
        try {
          source.disconnect();
          gain.disconnect();
        } catch {
          // ignore
        }
      },
      { once: true },
    );

    source.start(0);
    return true;
  } catch (err) {
    console.warn(`[Sound] Failed to play "${name}" sound via WebAudio (ctx.state=${ctx.state}):`, err);
    // На случай странного состояния WebAudio — не держим испорченный контекст.
    // Следующая попытка пересоздаст AudioContext.
    audioContext = null;
    return false;
  }
}

async function playUiSound(name: SoundName): Promise<void> {
  const { url, volume } = SOUND_CONFIG[name];
  const ok = await tryPlayWithWebAudio(name);
  if (!ok) {
    fallbackPlayWithHtmlAudio(url, volume);
  }
}

/**
 * Прогревает декодирование UI-звуков заранее.
 * Это важно для "done": его часто триггерим в момент auto-hide окна, и редкие фейлы декодинга
 * не должны "ломать звук навсегда" из-за кеша.
 */
export async function preloadUiSounds(): Promise<void> {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // decodeAudioData не требует running state, но в некоторых WebKit сценариях ctx может быть suspended.
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  } catch {
    // ignore - прогрев best-effort
  }

  await Promise.allSettled(Object.values(SOUND_CONFIG).map(({ url }) => decodeBuffer(url)));
}

/**
 * Проигрывает звук при открытии окна
 */
export function playShowSound(): void {
  void playUiSound('show');
}

/**
 * Проигрывает звук при успешном завершении записи и копировании в буфер
 */
export function playDoneSound(): void {
  void playUiSound('done');
}
