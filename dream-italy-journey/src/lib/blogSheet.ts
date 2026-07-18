import { fetchAppsScriptJson } from "@/lib/appsScriptApi";

export type BlogEntry = {
  id: string;
  slug: string;
  href: string;
  blogNumber?: number;
  headline: string;
  content: string;
};

const fetchBlogEntriesFromStaticFile = async (): Promise<BlogEntry[]> => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/blogs.json`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as BlogEntry[];
    return Array.isArray(payload) ? payload.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const fetchBlogEntriesFromAppsScript = async (): Promise<BlogEntry[]> =>
  (await fetchAppsScriptJson<BlogEntry[]>("blogs")) ?? [];

export const fetchBlogEntries = async (): Promise<BlogEntry[]> => {
  const appsScriptEntries = await fetchBlogEntriesFromAppsScript();
  if (appsScriptEntries.length > 0) {
    return appsScriptEntries;
  }

  return fetchBlogEntriesFromStaticFile();
};
