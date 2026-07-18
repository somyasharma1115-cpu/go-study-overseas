import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";

import { countryPages, universityPages } from "@/data/countries";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type SearchItem = {
  kind: "Country" | "University" | "Page";
  title: string;
  note: string;
  href: string;
};

const pageItems: SearchItem[] = [
  {
    kind: "Page",
    title: "MBBS Study Abroad",
    note: "Country / University",
    href: "/mbbs-study-abroad",
  },
];

type SearchOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const countryKeywords = [
  "italy",
  "germany",
  "france",
  "canada",
  "australia",
  "uk",
  "united kingdom",
  "usa",
  "ireland",
  "netherlands",
];

const universityKeywords = [
  "university",
  "college",
  "institute",
  "school",
  "academy",
  "polytechnic",
  "hec",
  "bocconi",
  "imperial",
  "toronto",
  "bologna",
  "politecnico",
  "munich",
  "mbbs",
  "medical",
  "medicine",
];

export const SearchOverlay = ({ open, onOpenChange }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const countryItems = useMemo(
    () =>
      countryPages.map((item) => ({
        kind: "Country" as const,
        title: item.name,
        note: item.menuNote,
        href: `/study-in/${item.slug}`,
      })),
    [],
  );
  const universityItems = useMemo(
    () =>
      universityPages.map((university) => ({
        kind: "University" as const,
        title: university.name,
        note: university.countryName,
        href: `/study-in/${university.countrySlug}/universities/${university.slug}`,
      })),
    [],
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 300);
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        mode: "both" as const,
        countries: countryItems,
        universities: universityItems,
        pages: pageItems,
      };
    }

    const countryIntent =
      countryKeywords.some((keyword) => q.includes(keyword)) ||
      countryItems.some((item) => item.title.toLowerCase().includes(q));
    const universityIntent =
      universityKeywords.some((keyword) => q.includes(keyword)) ||
      universityItems.some((item) => item.title.toLowerCase().includes(q));
    const pageIntent = q.includes("mbbs") || q.includes("medical") || q.includes("medicine") || pageItems.some((item) => item.title.toLowerCase().includes(q));

    if (pageIntent) {
      return {
        mode: "pages" as const,
        countries: [],
        universities: [],
        pages: pageItems.filter((item) => item.title.toLowerCase().includes(q) || item.note.toLowerCase().includes(q)),
      };
    }

    if (countryIntent && !universityIntent) {
      return {
        mode: "countries" as const,
        countries: countryItems.filter((item) => item.title.toLowerCase().includes(q) || item.note.toLowerCase().includes(q)),
        universities: [],
        pages: [],
      };
    }

    if (universityIntent && !countryIntent) {
      return {
        mode: "universities" as const,
        countries: [],
        universities: universityItems.filter((item) => item.title.toLowerCase().includes(q) || item.note.toLowerCase().includes(q)),
        pages: [],
      };
    }

    const countries = countryItems.filter((item) => item.title.toLowerCase().includes(q) || item.note.toLowerCase().includes(q));
    if (countries.length > 0) {
      return { mode: "countries" as const, countries, universities: [], pages: [] };
    }

    const universities = universityItems.filter((item) => item.title.toLowerCase().includes(q) || item.note.toLowerCase().includes(q));
    if (universities.length > 0) {
      return { mode: "universities" as const, countries: [], universities, pages: [] };
    }

    const pages = pageItems.filter((item) => item.title.toLowerCase().includes(q) || item.note.toLowerCase().includes(q));
    if (pages.length > 0) {
      return { mode: "pages" as const, countries: [], universities: [], pages };
    }

    return { mode: "both" as const, countries: [], universities: [], pages: [] };
  }, [query]);

  const totalResults = filtered.countries.length + filtered.universities.length + filtered.pages.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 left-0 top-0 z-50 grid h-[100dvh] w-[100vw] max-w-none translate-x-0 translate-y-0 overflow-hidden border-0 bg-transparent p-4 shadow-none sm:p-6 [&>button]:hidden">
        <div className="mx-auto flex h-full w-full max-w-5xl items-start justify-center pt-10 md:items-center md:pt-0">
          <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-border/70 bg-background shadow-elegant">
            <div className="border-b border-border/70 bg-gradient-dawn px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-accent">Search</p>
                  <h2 className="mt-2 font-display text-3xl font-medium text-primary">
                    Search Countries, Universities
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Find destinations and universities without mixing result types.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background text-muted-foreground transition-smooth hover:border-accent hover:text-accent"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 rounded-2xl border border-border/70 bg-background px-4 py-3 shadow-soft">
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search Countries, Universities"
                    className="h-10 border-0 bg-transparent px-0 shadow-none ring-0 focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-muted-foreground">
                <span>{loading ? "Loading..." : `${totalResults} results`}</span>
                <span>
                  {filtered.mode === "both"
                    ? "All results"
                    : filtered.mode === "countries"
                      ? "Countries only"
                      : filtered.mode === "universities"
                        ? "Universities only"
                        : "Pages only"}
                </span>
              </div>
            </div>

            <div className="max-h-[64vh] overflow-y-auto px-5 py-5 sm:px-6">
              {loading ? (
                <div className="grid gap-3">
                  <div className="h-20 animate-pulse rounded-2xl bg-muted" />
                  <div className="h-20 animate-pulse rounded-2xl bg-muted" />
                  <div className="h-20 animate-pulse rounded-2xl bg-muted" />
                </div>
              ) : totalResults > 0 ? (
                <div className="grid gap-6">
                  {(filtered.mode === "both" || filtered.mode === "countries") && filtered.countries.length > 0 ? (
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-accent">Countries</p>
                      <div className="mt-3 grid gap-3">
                        {filtered.countries.map((item) => (
                          <Link
                            key={`${item.kind}-${item.title}`}
                            to={item.href}
                            onClick={() => onOpenChange(false)}
                            className="flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-4 text-left transition-smooth hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-soft"
                          >
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.24em] text-accent">Country</p>
                              <h3 className="mt-1 font-display text-xl font-medium text-primary">{item.title}</h3>
                              <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                            </div>
                            <span className="rounded-full border border-border/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                              Open
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {(filtered.mode === "both" || filtered.mode === "universities") && filtered.universities.length > 0 ? (
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-accent">Universities</p>
                      <div className="mt-3 grid gap-3">
                        {filtered.universities.map((item) => (
                          <Link
                            key={`${item.kind}-${item.title}`}
                            to={item.href}
                            onClick={() => onOpenChange(false)}
                            className="flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-4 text-left transition-smooth hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-soft"
                          >
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.24em] text-accent">University</p>
                              <h3 className="mt-1 font-display text-xl font-medium text-primary">{item.title}</h3>
                              <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                            </div>
                            <span className="rounded-full border border-border/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                              Open
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {(filtered.mode === "both" || filtered.mode === "pages") && filtered.pages.length > 0 ? (
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-accent">Pages</p>
                      <div className="mt-3 grid gap-3">
                        {filtered.pages.map((item) => (
                          <Link
                            key={`${item.kind}-${item.title}`}
                            to={item.href}
                            onClick={() => onOpenChange(false)}
                            className="flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-4 text-left transition-smooth hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-soft"
                          >
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.24em] text-accent">Page</p>
                              <h3 className="mt-1 font-display text-xl font-medium text-primary">{item.title}</h3>
                              <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                            </div>
                            <span className="rounded-full border border-border/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                              Open
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-muted/20 px-6 text-center">
                  <p className="font-display text-2xl font-medium text-primary">0 results</p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                    Try a country name like Italy or a university like Bologna.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
