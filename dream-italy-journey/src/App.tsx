import { Component, Suspense, lazy, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import heroCloudsFull from "@/assets/web/optimized/blue-clouds-full-2.optimized.webp";
import heroCloudsTail from "@/assets/web/optimized/blue-clouds-tail-repeat.optimized.webp";
import aboutHero from "@/assets/about.jpeg";
import galleryOne from "@/assets/gallery/sub_team_photo.jpeg";
import galleryTwo from "@/assets/gallery/team_photo_2.jpeg";
import galleryThree from "@/assets/gallery/team_photo-3.jpeg";
import galleryFour from "@/assets/gallery/exhibition_stall.jpeg";
import galleryFive from "@/assets/gallery/unknown_student_awardgiving.jpeg";
import Index from "./pages/Index.tsx";

const About = lazy(() => import("./pages/About.tsx"));
const UniversityDataBoundary = lazy(() => import("./components/app/UniversityDataBoundary.tsx"));
const MBBSStudyAbroad = lazy(() =>
  import("./pages/MBBSStudyAbroad.tsx").then((module) => ({ default: module.MBBSStudyAbroad })),
);
const CountryPage = lazy(() =>
  import("./pages/CountryPage.tsx").then((module) => ({ default: module.CountryPage })),
);
const CourseFinder = lazy(() => import("./pages/CourseFinder.tsx"));
const Events = lazy(() => import("./pages/Events.tsx"));
const FindYourPath = lazy(() => import("./pages/FindYourPath.tsx"));
const ExamPage = lazy(() =>
  import("./pages/ExamPage.tsx").then((module) => ({ default: module.ExamPage })),
);
const ScholarshipFinder = lazy(() => import("./pages/ScholarshipFinder.tsx"));
const ScholarshipTest = lazy(() => import("./pages/ScholarshipTest.tsx"));
const UniversityPage = lazy(() =>
  import("./pages/UniversityPage.tsx").then((module) => ({ default: module.UniversityPage })),
);
const Blog = lazy(() => import("./pages/Blog.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const StudyItalyFree = lazy(() => import("./pages/StudyItalyFree.tsx"));

const HOME_BACKGROUND_PRELOADS = [heroCloudsFull, heroCloudsTail];
const ABOUT_BACKGROUND_PRELOADS = [aboutHero, galleryOne, galleryTwo, galleryThree, galleryFour, galleryFive];

const backgroundPrefetchedAssets = new Set<string>();

const preloadAssets = (sources: string[]) => {
  sources.forEach((src) => {
    if (!src || backgroundPrefetchedAssets.has(src)) {
      return;
    }

    backgroundPrefetchedAssets.add(src);
    const image = new Image();
    image.decoding = "async";
    image.src = src;
  });
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      return;
    }

    const targetId = hash.replace(/^#/, "");
    if (!targetId) {
      return;
    }

    let frameOne = 0;
    let frameTwo = 0;

    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      target?.scrollIntoView({ behavior: "auto", block: "start" });
    };

    frameOne = window.requestAnimationFrame(() => {
      frameTwo = window.requestAnimationFrame(scrollToTarget);
    });

    return () => {
      window.cancelAnimationFrame(frameOne);
      window.cancelAnimationFrame(frameTwo);
    };
  }, [hash, pathname]);

  return null;
};

const BackgroundAssetPrefetch = ({ enabled }: { enabled: boolean }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!enabled) return;

    const connection = navigator.connection as
      | {
          saveData?: boolean;
          effectiveType?: string;
        }
      | undefined;

    if (connection?.saveData || connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g") {
      return;
    }

    const assets = pathname === "/" ? HOME_BACKGROUND_PRELOADS : ABOUT_BACKGROUND_PRELOADS;

    const schedule = window.requestIdleCallback
      ? window.requestIdleCallback(() => preloadAssets(assets), { timeout: 3000 })
      : window.setTimeout(() => preloadAssets(assets), 1800);

    return () => {
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(schedule as number);
      } else {
        window.clearTimeout(schedule as number);
      }
    };
  }, [enabled, pathname]);

  return null;
};

const RouteFallback = () => <main className="min-h-screen bg-background" aria-hidden="true" />;

const CHUNK_RELOAD_KEY = "gso:chunk-reload-attempted";

const isChunkLoadError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk \d+ failed/i.test(message);
};

class ChunkLoadBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (isChunkLoadError(error)) {
      const lastAttempt = Number(window.sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
      const shouldRetry = !Number.isFinite(lastAttempt) || Date.now() - lastAttempt > 60_000;

      if (shouldRetry) {
        window.sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
        window.location.reload();
      }
    }
  }

  componentDidUpdate() {
    if (!this.state.hasError) {
      window.sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    }
  }

  retry = () => {
    if (this.state.hasError) {
      window.sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return <main className="min-h-screen bg-background" aria-hidden="true" onClick={this.retry} />;
    }

    return this.props.children;
  }
}

const App = () => {
  const appContentRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="app-shell">
      <div ref={appContentRef} className="app-content is-visible">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <ScrollToHash />
            <BackgroundAssetPrefetch enabled />
            <ChunkLoadBoundary>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/mbbs-study-abroad" element={<MBBSStudyAbroad />} />
                  <Route path="/find-your-path" element={<FindYourPath />} />
                  <Route path="/start-journey" element={<FindYourPath />} />
                  <Route path="/course-finder" element={<CourseFinder />} />
                  <Route path="/scholarship-finder" element={<ScholarshipFinder />} />
                  <Route path="/scholarship-test" element={<ScholarshipTest />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/exams" element={<Navigate to="/exams/ielts" replace />} />
                  <Route path="/exams/:slug" element={<ExamPage />} />
                  <Route element={<UniversityDataBoundary />}>
                    <Route path="/study-in/:slug" element={<CountryPage />} />
                    <Route path="/study-in/:slug/universities/:universitySlug" element={<UniversityPage />} />
                  </Route>
                  <Route path="/study-italy-free" element={<StudyItalyFree />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ChunkLoadBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default App;
