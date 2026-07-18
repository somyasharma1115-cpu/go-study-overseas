import { ArrowUpRight } from "lucide-react";
import { forwardRef, useEffect, useRef, useState, type MutableRefObject } from "react";
import { Link } from "react-router-dom";
import { ComposableMap, Geographies, Geography, Line, Marker } from "react-simple-maps";
import useEmblaCarousel from "embla-carousel-react";
import { destinationCards } from "@/data/countries";
import worldCountries from "world-atlas/countries-110m.json";

const destinationMapPoints: Record<string, { coordinates: [number, number]; geoName: string }> = {
  canada: { coordinates: [-106, 56], geoName: "Canada" },
  usa: { coordinates: [-98, 39], geoName: "United States of America" },
  uk: { coordinates: [-2, 54], geoName: "United Kingdom" },
  germany: { coordinates: [10, 51], geoName: "Germany" },
  france: { coordinates: [2, 46], geoName: "France" },
  italy: { coordinates: [12, 42], geoName: "Italy" },
  australia: { coordinates: [134, -25], geoName: "Australia" },
  malta: { coordinates: [14.4, 35.9], geoName: "Malta" },
  dubai: { coordinates: [55.27, 25.2], geoName: "United Arab Emirates" },
};

const indiaCoordinates: [number, number] = [78, 22];
const destinationPanelHeight = 560;
const destinationPanelHeightMobile = 280;

export const Universities = () => {
  const [activeSlug, setActiveSlug] = useState(destinationCards[0]?.slug ?? "italy");
  const [pauseUntil, setPauseUntil] = useState(0);
  const interactionSourceRef = useRef<"carousel" | "map" | "tile">("carousel");
  const activeDestination = destinationCards.find((destination) => destination.slug === activeSlug) ?? destinationCards[0];

  const handleMapSelect = (slug: string) => {
    interactionSourceRef.current = "map";
    setActiveSlug(slug);
  };

  const handleTileHover = (slug: string) => {
    interactionSourceRef.current = "tile";
    setActiveSlug(slug);
    setPauseUntil(Date.now() + 2000);
  };

  return (
    <section
      id="universities"
      data-scroll-reveal
      data-controlled-gateway
      className="scroll-reveal-section relative z-10 flex min-h-[115svh] items-center overflow-hidden bg-fold-blue py-32 md:py-40"
    >
      <div data-panel-content className="container relative z-10 w-full md:-translate-y-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/75">Destinations</p>
          <h2 className="mt-5 text-balance font-display text-4xl font-medium text-white md:text-6xl">
            A world of <em className="not-italic font-semibold text-white/90">possibility,</em>
            <span className="block">handpicked for you.</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2 lg:items-stretch">
          <div className="w-full lg:min-w-[560px] lg:flex-1">
            <DestinationSpotlight
              destination={activeDestination}
              onSelect={handleMapSelect}
            />
          </div>

          <div className="w-full lg:min-w-[560px] lg:flex-1">
            <DestinationCarousel
              activeSlug={activeDestination.slug}
              onSelect={setActiveSlug}
              onTileHover={handleTileHover}
              pauseUntil={pauseUntil}
              interactionSourceRef={interactionSourceRef}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

const DestinationSpotlight = ({
  destination,
  onSelect,
}: {
  destination: { slug: string; country: string; tag: string; img: string; unis: number };
  onSelect: (slug: string) => void;
}) => {
  return (
    <div className="lg:sticky lg:top-28">
      <div
        className="relative mx-auto h-[280px] w-full max-w-[930px] overflow-hidden rounded-[2rem] border border-white/12 bg-[#081a3b] shadow-elegant md:h-[560px] md:rounded-[2.25rem]"
        style={{ minHeight: destinationPanelHeightMobile }}
      >
        <ComposableMap
          width={930}
          height={destinationPanelHeight}
          projection="geoMercator"
          projectionConfig={{ scale: 150, center: [20, 18] }}
          className="absolute inset-0 h-full w-full"
        >
          <rect x="0" y="0" width="930" height={destinationPanelHeight} fill="#081a3b" />
          <Geographies geography={worldCountries}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const slug = destinationCards.find((country) => destinationMapPoints[country.slug]?.geoName === geo.properties?.name)?.slug;
                const isActive = slug === destination.slug;
                const isPartnerCountry = Boolean(slug);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => slug && onSelect(slug)}
                    onFocus={() => slug && onSelect(slug)}
                    tabIndex={slug ? 0 : -1}
                    style={{
                      default: {
                        fill: isActive ? "rgba(255,255,255,0.97)" : isPartnerCountry ? "rgba(96,186,255,0.42)" : "rgba(255,255,255,0.12)",
                        stroke: "rgba(255,255,255,0.2)",
                        strokeWidth: 0.45,
                        outline: "none",
                      },
                      hover: {
                        fill: isActive ? "rgba(255,255,255,0.98)" : "rgba(96,186,255,0.56)",
                        stroke: "rgba(255,255,255,0.42)",
                        strokeWidth: 0.7,
                        outline: "none",
                      },
                      pressed: {
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {destinationCards.map((country) => {
            const point = destinationMapPoints[country.slug];
            const isActive = country.slug === destination.slug;

            return (
              <Line
                key={`${country.slug}-route`}
                from={indiaCoordinates}
                to={point.coordinates}
                stroke={isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)"}
                strokeWidth={isActive ? 2.5 : 1.4}
                strokeLinecap="round"
                strokeDasharray={isActive ? "6 10" : "4 12"}
              />
            );
          })}

          <Marker coordinates={indiaCoordinates}>
            <g>
              <circle r={9} fill="rgba(255,255,255,0.96)" stroke="rgba(64,179,255,0.92)" strokeWidth={5} />
              <circle r={18} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={1.25} />
            </g>
          </Marker>

          {destinationCards.map((country) => {
            const point = destinationMapPoints[country.slug];
            const isActive = country.slug === destination.slug;

            return (
              <Marker
                key={country.slug}
                coordinates={point.coordinates}
                onMouseEnter={() => onSelect(country.slug)}
                onFocus={() => onSelect(country.slug)}
              >
                <g className="cursor-pointer">
                  {isActive ? (
                    <text
                      y={-24}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.96)"
                      fontSize="11"
                      fontWeight="600"
                      letterSpacing="0.08em"
                      style={{
                        pointerEvents: "none",
                        textTransform: "uppercase",
                        paintOrder: "stroke",
                        stroke: "rgba(8,26,59,0.9)",
                        strokeWidth: 4,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                      }}
                    >
                      {country.country}
                    </text>
                  ) : null}
                  <circle
                    r={isActive ? 9 : 6}
                    fill={isActive ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.72)"}
                    stroke="rgba(64,179,255,0.88)"
                    strokeWidth={isActive ? 5.5 : 3}
                    opacity={isActive ? 1 : 0.9}
                  />
                  <circle
                    r={isActive ? 16 : 12}
                    fill="none"
                    stroke={isActive ? "rgba(255,255,255,0.65)" : "rgba(64,179,255,0.35)"}
                    strokeWidth={1.25}
                    opacity={isActive ? 0.95 : 0.7}
                  />
                </g>
              </Marker>
            );
          })}
        </ComposableMap>
      </div>
    </div>
  );
};

const DestinationCarousel = ({
  activeSlug,
  onSelect,
  onTileHover,
  pauseUntil,
  interactionSourceRef,
}: {
  activeSlug: string;
  onSelect: (slug: string) => void;
  onTileHover: (slug: string) => void;
  pauseUntil: number;
  interactionSourceRef: MutableRefObject<"carousel" | "map" | "tile">;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, axis: "x", align: "start" });

  useEffect(() => {
    if (!emblaApi) return;
    if (interactionSourceRef.current !== "map") return;

    const index = destinationCards.findIndex((destination) => destination.slug === activeSlug);
    if (index >= 0) {
      emblaApi.scrollTo(index);
    }
  }, [activeSlug, emblaApi, interactionSourceRef]);

  useEffect(() => {
    if (!emblaApi) return;

    const syncActiveFromCarousel = () => {
      const snapIndex = emblaApi.selectedScrollSnap();
      const destination = destinationCards[snapIndex % destinationCards.length];
      if (!destination) return;
      interactionSourceRef.current = "carousel";
      onSelect(destination.slug);
    };

    syncActiveFromCarousel();
    emblaApi.on("select", syncActiveFromCarousel);
    emblaApi.on("settle", syncActiveFromCarousel);
    emblaApi.on("reInit", syncActiveFromCarousel);

    return () => {
      emblaApi.off("select", syncActiveFromCarousel);
      emblaApi.off("settle", syncActiveFromCarousel);
      emblaApi.off("reInit", syncActiveFromCarousel);
    };
  }, [emblaApi, onSelect, interactionSourceRef]);

  useEffect(() => {
    if (!emblaApi) return;

    const id = window.setInterval(() => {
      if (Date.now() < pauseUntil) {
        return;
      }
      emblaApi.scrollNext();
    }, 2400);

    return () => window.clearInterval(id);
  }, [emblaApi, pauseUntil]);

  return (
    <div className="flex h-[320px] min-h-[320px] flex-col md:h-[560px] md:min-h-[560px]">
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="-ml-4 flex h-full items-stretch">
          {destinationCards.map((destination) => (
            <div
              key={destination.slug}
              className="flex h-full min-w-0 shrink-0 basis-[84%] items-stretch pl-4 sm:basis-[62%] md:basis-[58%] xl:basis-[52%]"
            >
              <CompactDestinationCard
                {...destination}
                active={destination.slug === activeSlug}
                onHover={() => onTileHover(destination.slug)}
                onFocusSelect={() => onSelect(destination.slug)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CompactDestinationCard = forwardRef<
  HTMLAnchorElement,
  {
    slug: string;
    country: string;
    tag: string;
    img: string;
    unis: number;
    active: boolean;
    onHover: () => void;
    onFocusSelect: () => void;
  }
  >(({ slug, country, tag, img, unis, active, onHover, onFocusSelect }, ref) => (
  <Link
    to={`/study-in/${slug}`}
    ref={ref}
    onMouseEnter={onHover}
    onFocus={onFocusSelect}
    className={[
      "group relative flex h-full min-h-0 overflow-hidden rounded-[2rem] border border-white/15 bg-slate-950/85 text-white shadow-elegant transition-smooth hover:-translate-y-1 hover:shadow-[0_30px_70px_-22px_rgba(8,26,59,0.62)]",
      active ? "opacity-100 ring-1 ring-white/40" : "opacity-85 ring-1 ring-white/10",
    ].join(" ")}
  >
    <div className="relative h-full w-full overflow-hidden">
      <img
        src={img}
        alt={country}
        decoding="async"
        loading={active ? "eager" : "lazy"}
        fetchPriority={active ? "high" : "low"}
        className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,14,28,0)_0%,rgba(7,14,28,0.14)_64%,rgba(7,14,28,0.84)_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(64,179,255,0.18),transparent_32%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex translate-y-0 flex-wrap items-center gap-2 opacity-100 transition-all duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
              <p className="inline-flex items-center rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md">
                {unis}+ universities
              </p>
              <span className="rounded-full border border-white/16 bg-white/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/75 backdrop-blur-md">
                View details
              </span>
            </div>
            <p className="mb-1 translate-y-0 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/68 opacity-100 transition-all duration-500 delay-75 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
              Explore destination
            </p>
            <h3 className="font-display text-2xl font-semibold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.82)] md:text-3xl">
              {country}
            </h3>
            <p className="mt-2 max-w-[24ch] translate-y-0 text-sm font-medium leading-5 text-white/88 opacity-100 transition-all duration-500 delay-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.82)] md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
              {tag}
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 translate-y-0 items-center justify-center rounded-full border border-white/18 bg-white/90 opacity-100 shadow-[0_16px_30px_-12px_rgba(255,255,255,0.32)] backdrop-blur transition-all duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  </Link>
));
CompactDestinationCard.displayName = "CompactDestinationCard";
