import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Universities } from "@/components/site/Universities";
import { Stories } from "@/components/site/Stories";
import { Testimonials } from "@/components/site/Testimonials";
import { Manifesto } from "@/components/site/Manifesto";
import { Services } from "@/components/site/Services";
import { Contact } from "@/components/site/Contact";
import { SocialSpotlight } from "@/components/site/SocialSpotlight";
import { FAQ } from "@/components/site/FAQ";
import { News } from "@/components/site/News";
import { Footer } from "@/components/site/Footer";
import { useInitialPageReady } from "@/hooks/useInitialPageReady";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import heroPoster from "@/assets/web/posters/hero-background-video.jpg";
import initialDestinationImageUrl from "@/assets/dest-italy.jpg";

const SearchOverlay = lazy(() => import("@/components/site/SearchOverlay").then((module) => ({ default: module.SearchOverlay })));
const FindMyMatchWizard = lazy(() => import("@/components/site/FindMyMatchWizard").then((module) => ({ default: module.FindMyMatchWizard })));

const Index = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [matchOpen, setMatchOpen] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);

  useInitialPageReady([heroPoster, initialDestinationImageUrl]);

  useEffect(() => {
    document.title = "Study abroad with top scholarships";
    const desc = "Student-first study abroad consultancy. Scholarships, admissions and visa support across Italy, UK, Germany, France, Canada, USA, Australia, Malta, Dubai and MBBS routes.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", desc);

    // Global reveal-on-scroll observer
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const main = mainRef.current;

    if (!main) {
      return;
    }

    const getSections = () =>
      Array.from(main.children).filter((node): node is HTMLElement => {
        if (!(node instanceof HTMLElement)) return false;
        return node.tagName === "SECTION" || node.tagName === "FOOTER";
      });

    const getRevealSections = () => getSections().filter((section) => section.hasAttribute("data-scroll-reveal"));

    if (getSections().length === 0 || getRevealSections().length === 0) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resolveCurrentIndex = () => {
      const sections = getSections();
      const viewportAnchor = window.scrollY + window.innerHeight * 0.42;
      const index = sections.findIndex((section) => viewportAnchor < section.offsetTop + section.offsetHeight);
      return index === -1 ? sections.length - 1 : index;
    };

    let currentIndex = resolveCurrentIndex();
    let syncFrame: number | null = null;

    const setSectionState = (activeIndex: number) => {
      const sections = getSections();
      const revealSections = getRevealSections();
      revealSections.forEach((section) => {
        const sectionIndex = sections.indexOf(section);
        section.classList.toggle("is-entered", sectionIndex <= activeIndex);
        section.classList.toggle("is-active", sectionIndex === activeIndex);
        section.classList.toggle("is-visible", sectionIndex <= activeIndex);
      });
    };

    if (prefersReducedMotion.matches || searchOpen) {
      getRevealSections().forEach((section) => {
        section.classList.add("is-visible");
        section.classList.add("is-entered");
        section.classList.remove("is-active");
      });
      return;
    }

    const syncSectionState = () => {
      currentIndex = resolveCurrentIndex();
      setSectionState(currentIndex);
    };

    const scheduleSync = () => {
      if (syncFrame !== null) {
        return;
      }

      syncFrame = window.requestAnimationFrame(() => {
        syncFrame = null;
        syncSectionState();
      });
    };

    setSectionState(currentIndex);
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);

    return () => {
      if (syncFrame !== null) {
        window.cancelAnimationFrame(syncFrame);
      }
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
    };
  }, [searchOpen]);

  return (
    <main ref={mainRef} className="min-h-screen bg-background">
      <Navbar />
      <Hero onSearchOpen={() => setSearchOpen(true)} onMatchOpen={() => setMatchOpen(true)} />
      <Universities />
      <Stories />
      <Testimonials />
      <Manifesto />
      <Services />
      <Contact />
      <SocialSpotlight />
      <FAQ />
      <News />
      <Footer />
      {(searchOpen || matchOpen) ? (
        <Suspense fallback={null}>
          {searchOpen ? <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} /> : null}
          {matchOpen ? <FindMyMatchWizard open={matchOpen} onOpenChange={setMatchOpen} /> : null}
        </Suspense>
      ) : null}
    </main>
  );
};

export default Index;
