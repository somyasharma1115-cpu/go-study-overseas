const getAppsScriptEndpoint = () => {
  const endpoint = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_WEB_APP_URL as string | undefined;
  return endpoint?.trim() || "";
};

export const fetchAppsScriptJson = async <T>(action: string): Promise<T | null> => {
  const endpoint = getAppsScriptEndpoint();

  if (!endpoint) {
    return null;
  }

  try {
    const url = new URL(endpoint);
    url.searchParams.set("action", action);

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { ok?: boolean; data?: T };
    if (payload && payload.ok !== false && "data" in payload) {
      return payload.data ?? null;
    }
  } catch {
    return null;
  }

  return null;
};

