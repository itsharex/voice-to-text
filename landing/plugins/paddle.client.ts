type PaddleEnvironment = "sandbox" | "live";

declare global {
  interface Window {
    Paddle?: any;
  }
}

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Уже загружен
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(el);
  });
}

export default defineNuxtPlugin(async () => {
  const cfg = useRuntimeConfig();
  const paddleCfg = cfg.public.paddle as {
    clientToken: string;
    environment: PaddleEnvironment;
  };

  // Если токен не задан — просто не включаем Paddle.js на сайте.
  if (!paddleCfg?.clientToken?.trim()) {
    return;
  }

  await loadScriptOnce("https://cdn.paddle.com/paddle/v2/paddle.js");

  const Paddle = window.Paddle;
  if (!Paddle) {
    return;
  }

  // Важно: sandbox нужно выставить ДО Initialize
  if (paddleCfg.environment === "sandbox") {
    Paddle.Environment.set("sandbox");
  }

  Paddle.Initialize({
    token: paddleCfg.clientToken,
    // Удобно для отладки интеграции (особенно в sandbox): события печатаем в консоль.
    eventCallback: (e: unknown) => {
      if (import.meta.dev) {
        // eslint-disable-next-line no-console
        console.log("[Paddle event]", e);
      }
    },
  });

  return {
    provide: {
      paddle: Paddle,
    },
  };
});

