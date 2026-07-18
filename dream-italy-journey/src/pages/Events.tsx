import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock3, Globe2, LoaderCircle, MapPin, SlidersHorizontal } from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useInitialPageReady } from "@/hooks/useInitialPageReady";
import { openChatWidget } from "@/lib/chatWidget";
import { eventCategories, fetchEventEntries, type EventCategory, type EventEntry } from "@/lib/eventSheet";
import florenceSunset from "@/assets/web/florence-sunset.jpg";
import goStudyWayPoster from "@/assets/web/posters/go-study-way-reel.jpg";
import otrantoHarbor from "@/assets/web/otranto-harbor.jpg";
import ravelloCoast from "@/assets/web/ravello-coast.jpg";
import salernoDusk from "@/assets/web/salerno-dusk.jpg";
import taorminaStreet from "@/assets/web/taormina-street.jpg";
import webinar from "@/assets/webinar1.jpeg";

const filterOptions = ["All", ...eventCategories] as const;
type FilterOption = (typeof filterOptions)[number];

const fallbackEventCards: EventEntry[] = [
  {
    id: "italy-application-sprint",
    category: "Live",
    title: "Italy Application Sprint",
    date: "18 May 2026",
    time: "2:00 PM - 3:30 PM",
    location: "Live on Zoom",
    description: "A fast-paced live session covering documents, deadlines, and how to shortlist the best Italian universities.",
    image: florenceSunset,
    cta: "Join live",
  },
  {
    id: "milan-admissions-day",
    category: "Admission Day",
    title: "Milan Admissions Day",
    date: "21 May 2026",
    time: "11:00 AM - 5:00 PM",
    location: "Hyderabad",
    description: "Meet counsellors and get a one-stop review of profiles, offers, and next-step planning for autumn intake.",
    image: taorminaStreet,
    cta: "Reserve a seat",
  },
  {
    id: "europe-university-fair",
    category: "University Fair",
    title: "Europe University Fair",
    date: "24 May 2026",
    time: "10:30 AM - 4:30 PM",
    location: "Bengaluru",
    description: "A multi-university event for students comparing destinations, tuition, scholarships, and campus life.",
    image: ravelloCoast,
    cta: "See fair details",
  },
  {
    id: "scholarship-and-visa-webinar",
    category: "Webinar",
    title: "Scholarship and Visa Webinar",
    date: "27 May 2026",
    time: "6:00 PM - 7:15 PM",
    location: "Online",
    description: "Learn how to prepare a stronger application, line up scholarship options, and avoid common visa delays.",
    image: salernoDusk,
    cta: "Register online",
  },
  {
    id: "parent-counselling-live-qa",
    category: "Live",
    title: "Parent Counselling Live Q&A",
    date: "30 May 2026",
    time: "4:00 PM - 5:00 PM",
    location: "Live on Zoom",
    description: "A live discussion for families looking for clarity on budgets, safety, timelines, and support plans.",
    image: goStudyWayPoster,
    cta: "Ask a question",
  },
  {
    id: "italy-webinar-road-map",
    category: "Webinar",
    title: "Italy Webinar Road Map",
    date: "15 June 2026",
    time: "6:30 PM - 7:45 PM",
    location: "Online",
    description: "Join our expert-led webinar to map your journey to studying in Italy, from applications and scholarships to visas and arrival.",
    image: webinar,
    cta: "Book Your Seat Now",
    ctaLink: "https://login.funnelos.in/u/89747/italy-webinar-road-map",
  },
  {
    id: "campus-connect-roadshow",
    category: "University Fair",
    title: "Campus Connect Roadshow",
    date: "2 June 2026",
    time: "12:00 PM - 3:30 PM",
    location: "Pune",
    description: "Meet the team, explore destination comparisons, and get answers on programmes and post-study outcomes.",
    image: otrantoHarbor,
    cta: "Book your spot",
  },
];

const fallbackImages = [florenceSunset, taorminaStreet, ravelloCoast, salernoDusk, goStudyWayPoster, otrantoHarbor];

const categoryMeta: Record<EventCategory, { label: string; className: string }> = {
  Live: {
    label: "Live",
    className: "bg-[#e8fbfa] text-[#007f7a]",
  },
  "Admission Day": {
    label: "Admission Day",
    className: "bg-[#f2f7ff] text-[#3456d1]",
  },
  "University Fair": {
    label: "University Fair",
    className: "bg-[#f6f2ff] text-[#6c3fd6]",
  },
  Webinar: {
    label: "Webinar",
    className: "bg-[#fff4e9] text-[#c76a12]",
  },
};

export const Events = () => {
  const [searchParams] = useSearchParams();
  const {
    data: sheetEvents = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["event-entries"],
    queryFn: fetchEventEntries,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const eventCards = sheetEvents.length > 0 ? sheetEvents : fallbackEventCards;
  useInitialPageReady([eventCards[0]?.image || fallbackImages[0]]);

  useEffect(() => {
    document.title = "Upcoming Overseas Education Seminars & Events";

    const description =
      "Attend study abroad seminars, events, webinars, and fairs for expert advice, financing assistance & instant application processing. Get premium counselling with UniScholars.";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    });
  }, []);

  const filterParam = searchParams.get("filter");
  const activeFilter = filterOptions.includes(filterParam as FilterOption) ? (filterParam as FilterOption) : "All";
  const visibleEvents =
    activeFilter === "All" ? eventCards : eventCards.filter((event) => event.category === activeFilter);

  return (
    <main className="min-h-screen bg-[#f6f7f5] text-[#1d1e1e]">
      <Navbar forceSolidBackground />

      <section className="pt-28 pb-10 md:pb-14">
        <div className="container">
          <div className="mx-auto max-w-[1160px]">
            <h1 className="font-display text-[clamp(2rem,4vw,3.3rem)] leading-[1.05] text-[#1d1e1e]">
              Upcoming Events
            </h1>

            <div className="mt-6 flex flex-col gap-4 border-t border-[#eceef2] pt-6 md:flex-row md:items-center md:justify-between">
              <div role="tablist" aria-label="Event filters" className="flex flex-wrap gap-3">
                {filterOptions.map((filter) => {
                  const active = activeFilter === filter;
                  const href = filter === "All" ? "/events" : `/events?filter=${encodeURIComponent(filter)}`;

                  return (
                    <Link
                      key={filter}
                      to={href}
                      role="tab"
                      aria-selected={active}
                      aria-pressed={active}
                      className={`rounded-[12px] border px-5 py-3 text-[15px] font-medium transition-colors ${
                        active
                          ? "border-[#00a6a0] bg-[#f3fbfb] text-[#00a6a0]"
                          : "border-[#d7dbe2] bg-white text-[#1d1e1e] hover:border-[#00a6a0] hover:text-[#00a6a0]"
                      }`}
                    >
                      {filter}
                    </Link>
                  );
                })}
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-[12px] border border-[#d7dbe2] bg-white px-5 py-3 text-[15px] font-medium text-[#1d1e1e] transition-colors hover:border-[#00a6a0] hover:text-[#00a6a0]"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>

            <div className="mt-7 grid gap-6">
              {isLoading ? (
                <div className="flex min-h-[260px] items-center justify-center rounded-[2rem] border border-[#e6e8ec] bg-white shadow-[0_10px_30px_rgba(16,24,40,0.06)]">
                  <div className="inline-flex items-center gap-3 text-[15px] font-medium text-[#4f5257]">
                    <LoaderCircle className="h-5 w-5 animate-spin text-[#00a6a0]" />
                    Loading events
                  </div>
                </div>
              ) : isError && sheetEvents.length === 0 ? (
                <div className="rounded-[2rem] border border-[#f2d5d0] bg-[#fff7f5] p-8 text-[#6d3b34] shadow-[0_16px_40px_rgba(109,59,52,0.08)]">
                  <h2 className="font-display text-3xl text-[#4f241f]">We couldn&apos;t load events right now.</h2>
                  <p className="mt-3 max-w-2xl text-[16px] leading-7">
                    The sheet request failed, so the default event cards are unavailable until the connection responds again.
                  </p>
                </div>
              ) : visibleEvents.length === 0 ? (
                <div className="rounded-[2rem] border border-[#e6e8ec] bg-white p-8 shadow-[0_10px_30px_rgba(16,24,40,0.06)]">
                  <h2 className="font-display text-3xl text-[#1d1e1e]">No events yet.</h2>
                  <p className="mt-3 max-w-2xl text-[16px] leading-7 text-[#4f5257]">
                    Add rows to the <strong>Events</strong> sheet with <strong>Category</strong>, <strong>Title</strong>, <strong>Date</strong>, <strong>Time</strong>, <strong>Location</strong>, and <strong>Description</strong>, and they&apos;ll show up here.
                  </p>
                </div>
              ) : (
                visibleEvents.map((event, index) => {
                  const meta = categoryMeta[event.category];
                  const eventImage =
                    event.image ||
                    (event.id === "italy-webinar-road-map" ? webinar : fallbackImages[index % fallbackImages.length]);

                  return (
                    <article
                      key={event.id}
                      className="group overflow-hidden rounded-[2rem] border border-[#e6e8ec] bg-white shadow-[0_10px_30px_rgba(16,24,40,0.06)] transition-transform duration-300 hover:-translate-y-1"
                    >
                        <div className="grid lg:grid-cols-2">
                        <div className="relative min-h-[360px] bg-[#e9eef5] lg:min-h-[420px]">
                          <img
                            src={eventImage}
                            alt={event.title}
                            className="absolute inset-0 h-full w-full object-contain"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
                          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#1d1e1e] backdrop-blur">
                            <Globe2 className="h-3.5 w-3.5 text-[#00a6a0]" />
                            Upcoming event
                          </div>
                        </div>

                        <div className="p-5 sm:p-6 lg:p-7">
                          <div className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${meta.className}`}>
                            {meta.label}
                          </div>
                          <h2 className="mt-4 text-[clamp(1.55rem,2vw,2rem)] leading-tight text-[#1d1e1e]">
                            {event.title}
                          </h2>
                          <p className="mt-2 max-w-2xl text-[16px] leading-7 text-[#4f5257]">{event.description}</p>

                          <div className="mt-5 grid gap-3 text-[15px] text-[#5b5b5b] sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                            <div className="flex items-center gap-2">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f2f4]">
                                <CalendarDays className="h-4 w-4 text-[#5b5b5b]" />
                              </span>
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f2f4]">
                                <Clock3 className="h-4 w-4 text-[#5b5b5b]" />
                              </span>
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f2f4]">
                                <MapPin className="h-4 w-4 text-[#5b5b5b]" />
                              </span>
                              <span>{event.location}</span>
                            </div>
                          </div>

                          {event.ctaLink ? (
                            <a
                              href={event.ctaLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${event.cta} for ${event.title}`}
                              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#037990] px-5 py-3 text-[15px] font-semibold text-white transition-colors group-hover:bg-[#02657d]"
                            >
                              {event.cta}
                              <ArrowRight className="h-4 w-4" />
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={openChatWidget}
                              aria-label={`${event.cta} for ${event.title}`}
                              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#037990] px-5 py-3 text-[15px] font-semibold text-white transition-colors group-hover:bg-[#02657d]"
                            >
                              {event.cta}
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

          </div>
        </div>
      </section>

      <Footer alwaysVisible />
    </main>
  );
};

export default Events;
