import { useEffect } from "react";

type UseInitialPageReadyOptions = {
  minDurationMs?: number;
  timeoutMs?: number;
};

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });

const markAppReady = () => {
  if (document.body.classList.contains("app-ready")) {
    return;
  }

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      document.body.classList.add("app-ready");
    });
  });
};

export const useInitialPageReady = (
  sources: Array<string | null | undefined>,
  { minDurationMs = 900, timeoutMs = 3200 }: UseInitialPageReadyOptions = {},
) => {
  useEffect(() => {
    if (typeof window === "undefined" || document.body.classList.contains("app-ready")) {
      return;
    }

    const cleanSources = sources.filter((source): source is string => Boolean(source));
    const minimumSplashDuration = new Promise<void>((resolve) => {
      window.setTimeout(resolve, minDurationMs);
    });
    const criticalVisualsReady =
      cleanSources.length > 0 ? Promise.allSettled(cleanSources.map((source) => preloadImage(source))) : Promise.resolve();
    const splashGuardTimeout = new Promise<void>((resolve) => {
      window.setTimeout(resolve, timeoutMs);
    });

    void Promise.all([
      minimumSplashDuration,
      Promise.race([criticalVisualsReady, splashGuardTimeout]),
    ]).then(markAppReady);
  }, [minDurationMs, sources, timeoutMs]);
};

