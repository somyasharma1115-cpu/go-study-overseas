type SheetTimelineItem = { label: string; value: string };
type SheetHighlight = { title: string; body: string };
type SheetFaq = { q: string; a: string };
type SheetVisuals = { heroBackground: string; heroFeature: string; overview: string };

export type UniversitySheetOverride = {
  countrySlug: string;
  slug: string;
  active: boolean;
  name?: string;
  countryName?: string;
  countryHeroImage?: string;
  menuNote?: string;
  heroTag?: string;
  program?: string;
  tag?: string;
  logo?: string;
  timeline?: SheetTimelineItem[];
  requirements?: string[];
  scholarships?: string[];
  costs?: SheetTimelineItem[];
  highlights?: SheetHighlight[];
  faqs?: SheetFaq[];
  visuals?: SheetVisuals;
  isMbbs?: boolean;
};

const parseBoolean = (value: string | undefined) => {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (!normalized) return true;
  return !["false", "0", "no", "inactive"].includes(normalized);
};

const parseStringList = (value: string | undefined) => {
  const text = String(value ?? "").trim();
  if (!text) return undefined;

  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      return undefined;
    }
  }

  return text
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseJsonValue = <T,>(value: string | undefined): T | undefined => {
  const text = String(value ?? "").trim();
  if (!text) return undefined;

  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined;
  }
};

const parseSheetRow = (record: Record<string, string>): UniversitySheetOverride | null => {
  const countrySlug = record.countryslug?.trim();
  const slug = record.slug?.trim();

  if (!countrySlug || !slug) {
    return null;
  }

  return {
    countrySlug,
    slug,
    active: parseBoolean(record.active),
    name: record.name?.trim() || undefined,
    countryName: record.countryname?.trim() || undefined,
    countryHeroImage: record.countryheroimage?.trim() || undefined,
    menuNote: record.menunote?.trim() || undefined,
    heroTag: record.herotag?.trim() || undefined,
    program: record.program?.trim() || undefined,
    tag: record.tag?.trim() || undefined,
    logo: record.logo?.trim() || undefined,
    timeline: parseJsonValue<SheetTimelineItem[]>(record.timelinejson),
    requirements: parseStringList(record.requirementsjson),
    scholarships: parseStringList(record.scholarshipsjson),
    costs: parseJsonValue<SheetTimelineItem[]>(record.costsjson),
    highlights: parseJsonValue<SheetHighlight[]>(record.highlightsjson),
    faqs: parseJsonValue<SheetFaq[]>(record.faqsjson),
    visuals: parseJsonValue<SheetVisuals>(record.visualsjson),
    isMbbs: record.ismbbs ? parseBoolean(record.ismbbs) : undefined,
  };
};

export const fetchUniversitySheetOverrides = async (): Promise<UniversitySheetOverride[]> => {
  return [];
};
