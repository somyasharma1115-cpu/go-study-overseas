import { fetchAppsScriptJson } from "@/lib/appsScriptApi";

export const eventCategories = ["Live", "Admission Day", "University Fair", "Webinar"] as const;

export type EventCategory = (typeof eventCategories)[number];

export type EventEntry = {
  id: string;
  eventNumber?: number;
  category: EventCategory;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
  cta: string;
  ctaLink?: string;
};

const fetchEventEntriesFromStaticFile = async (): Promise<EventEntry[]> => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/events.json`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as EventEntry[];
    return Array.isArray(payload) ? payload.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const fetchEventEntriesFromAppsScript = async (): Promise<EventEntry[]> =>
  (await fetchAppsScriptJson<EventEntry[]>("events")) ?? [];

export const fetchEventEntries = async (): Promise<EventEntry[]> => {
  const appsScriptEntries = await fetchEventEntriesFromAppsScript();
  if (appsScriptEntries.length > 0) {
    return appsScriptEntries;
  }

  return fetchEventEntriesFromStaticFile();
};
