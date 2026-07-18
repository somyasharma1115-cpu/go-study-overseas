import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Clock, GraduationCap, Globe2, MessageCircle, Plane, ShieldCheck, Sparkles } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFAB } from "@/components/site/WhatsAppFAB";
import { SocialSpotlight } from "@/components/site/SocialSpotlight";
import { FAQ } from "@/components/site/FAQ";
import { toast } from "sonner";
import { WHATSAPP_URL, buildWhatsAppUrl } from "@/lib/links";
import { submitLeadSubmission } from "@/lib/leadSubmission";
import heroPoster from "@/assets/web/posters/hero-background-video.jpg";
import heroBackgroundVideoDesktop from "../../hero_background_video.mp4";
import heroBackgroundVideoMobile from "../../hero_background_video_mobile.mp4";

const benefits = [
  { icon: GraduationCap, title: "100% Tuition Fee Waiver", body: "Regional Government Scholarships (DSU, EDISU, Lazio Disco) cover your entire tuition — and include a living stipend." },
  { icon: ShieldCheck, title: "Stipend up to €8,000/year", body: "Eligible students receive annual stipends that can make Italy effectively free to study in." },
  { icon: Globe2, title: "English-Taught Programs", body: "Bachelor's and Master's programs at top public universities — all taught in English. No Italian required." },
  { icon: Plane, title: "Schengen Visa Access", body: "Your Italian student visa opens travel across 27 Schengen countries. Study in Italy, explore Europe." },
  { icon: Clock, title: "1-Year Post-Study Visa", body: "Stay back after graduation to look for work and kick-start your international career." },
  { icon: Sparkles, title: "Low Living Costs", body: "Italy's cost of living is far lower than the UK, US, or Australia — typically €500–€700/month." },
];

const steps = [
  { step: "01", title: "Free Counselling Call", body: "Book a 1-on-1 session. We assess your profile and confirm your scholarship eligibility." },
  { step: "02", title: "University Shortlisting", body: "We shortlist 4–5 Italian public universities that match your academic background and goals." },
  { step: "03", title: "Application & Scholarship", body: "We handle applications, pre-enrollment, and the scholarship paperwork — included in the package." },
  { step: "04", title: "Visa & Pre-Departure", body: "Full visa guidance, accommodation tips, residence permit support, and cultural briefing before you fly." },
];

const universities = [
  "Sapienza University of Rome",
  "University of Bologna",
  "Politecnico di Milano",
  "University of Padua",
  "University of Milan",
  "Politecnico di Torino",
  "University of Pisa",
  "University of Florence",
  "University of Trento",
  "University of Turin",
];

const scholarships = [
  "DSU Scholarship",
  "Regional Scholarships (Lazio Disco, EDISU Piemonte, DSU Toscana, Veneto)",
  "University-Specific Scholarships",
  "Italian Government Scholarship",
  "Invest Your Talent in Italy (IYT)",
];

const ItalyHero = () => {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const resolveVideoSrc = () =>
      window.matchMedia("(max-width: 768px)").matches ? heroBackgroundVideoMobile : heroBackgroundVideoDesktop;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        setVideoSrc(resolveVideoSrc());
        setShouldLoadVideo(true);
        observer.disconnect();
      },
      { threshold: 0.15, rootMargin: "200px 0px" },
    );

    const section = document.getElementById("italy-hero");
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="italy-hero" className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="hero-parallax__video-wrap"
          aria-hidden="true"
          style={{ backgroundImage: `url(${heroPoster})` }}
        >
          {shouldLoadVideo ? (
            <video
              className="hero-parallax__video is-ready"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              src={videoSrc ?? undefined}
              poster={heroPoster}
            />
          ) : null}
        </div>
        <div className="hero-parallax__overlay" aria-hidden="true" />
        <div className="hero-parallax__fade" />
      </div>

      <div className="container relative z-10 w-full py-28 md:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto max-w-4xl rounded-[2rem] bg-black/10 px-5 py-6 backdrop-blur-[2px] md:px-8 md:py-8">
            <p className="text-xs uppercase tracking-[0.3em] text-white/80 mb-4">Study in Italy — 2026 Intake Now Open</p>
            <h1 className="font-display text-5xl font-semibold leading-[0.92] tracking-[-0.03em] text-white text-balance drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)] sm:text-6xl md:text-7xl lg:text-[6rem]">
              Study in Italy — <span className="text-accent">Tuition Free</span>
            </h1>
            <p className="mt-6 text-base font-medium tracking-[0.01em] text-white/95 md:text-lg text-pretty drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">
              100% tuition fee waivers · Scholarships up to €8,000/year · English-taught programs · Schengen visa access — all for a complete package of just ₹1.4 lakhs.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#lead-form"
              className="inline-flex items-center gap-2 bg-gradient-brand text-primary-foreground shadow-pill rounded-full px-6 py-3.5 text-sm font-semibold hover:opacity-95 transition-smooth"
            >
              Claim Your Free Call <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 glass text-ink rounded-full px-6 py-3.5 text-sm font-medium hover:bg-white/80 transition-smooth"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Us
            </a>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/80">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-accent" /> 200+ students admitted</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-accent" /> 15+ public universities</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-accent" /> End-to-end support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const LeadForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [degree, setDegree] = useState("Master's");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please share your name and phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitLeadSubmission({
        form: "study-italy-free",
        submittedAt: new Date().toISOString(),
        sourcePath: window.location.pathname,
        pageUrl: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        name: name.trim(),
        phone: phone.trim(),
        degree,
      });

      toast.success("Thanks! Our Italy counsellor will reach out within 24 hours.");
      setName("");
      setPhone("");
      setDegree("Master's");
    } catch (error) {
      console.error(error);
      toast.error("We could not send your request just now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const degrees = ["Bachelor's", "Master's", "MBA", "PhD"];

  return (
    <section id="lead-form" className="relative isolate overflow-hidden bg-fold-light py-20 md:py-28">
      <div className="container relative z-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Free 1-on-1 expert call</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold text-primary text-balance">
              Start your Italy journey today
            </h2>
            <p className="mt-5 max-w-md text-muted-foreground">
              Drop your details and our Italy specialist will call you within 24 hours to assess your scholarship eligibility and shortlist universities — completely free.
            </p>
            <div className="mt-8 space-y-3">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl bg-white/72 p-4 shadow-soft backdrop-blur-md transition-smooth hover:shadow-card sm:p-5">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-secondary flex items-center justify-center transition-smooth group-hover:bg-accent">
                  <MessageCircle className="h-5 w-5 text-primary group-hover:text-accent-foreground transition-smooth" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp</p>
                  <p className="font-display text-base text-primary sm:text-lg">+91 9111 342 639</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-smooth group-hover:translate-x-1 group-hover:text-accent" />
              </a>
            </div>
          </div>

          <form
            onSubmit={submit}
            className="w-full rounded-3xl border border-white/60 bg-white/76 p-4 shadow-elegant backdrop-blur-md sm:p-6 md:p-10"
          >
            <h3 className="font-display text-2xl md:text-3xl text-primary">Get your free counselling call</h3>

            <div className="mt-6">
              <label className="text-sm font-medium text-foreground/80">Which degree do you want to study?</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {degrees.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDegree(d)}
                    className={`rounded-full px-5 py-2.5 text-sm border transition-smooth ${
                      degree === d ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-foreground border-border hover:border-primary"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground/80">Your name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aarav Singh"
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-smooth"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground/80">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 ..."
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-smooth"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-medium text-primary-foreground shadow-soft transition-smooth hover:bg-primary-glow"
            >
              {isSubmitting ? "Sending..." : "Claim your free call"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-4 text-center text-xs text-muted-foreground">We never share your details. Reply within 24 hours.</p>
          </form>
        </div>
      </div>
    </section>
  );
};

const StudyItalyFree = () => {
  useEffect(() => {
    document.title = "Study in Italy Tuition Free — Scholarships, Admissions & Visa | Go Study Overseas";
    const desc = "Study in Italy with 100% tuition fee waivers and scholarships up to €8,000/year. English-taught programs at top public universities. Complete package for ₹1.4 lakhs. Apply now for the 2026 intake.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", desc);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <ItalyHero />

      {/* Benefits Grid */}
      <section className="relative overflow-hidden bg-background py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Why study in Italy</p>
            <h2 className="mt-4 font-display text-4xl md:text-6xl font-semibold text-primary text-balance">
              World-class education, <em className="not-italic text-accent">without the price tag</em>
            </h2>
            <p className="mt-5 text-muted-foreground">
              Italy's public university system and generous regional scholarships make it one of the most affordable study-abroad destinations in Europe.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-soft backdrop-blur-md transition-smooth hover:-translate-y-1 hover:shadow-elegant p-6"
              >
                <div className="h-12 w-12 rounded-2xl bg-accent-soft flex items-center justify-center transition-smooth group-hover:bg-accent">
                  <b.icon className="h-5 w-5 text-accent group-hover:text-accent-foreground transition-smooth" />
                </div>
                <h3 className="mt-5 font-display text-xl text-primary">{b.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scholarship Callout */}
      <section className="relative isolate overflow-hidden bg-fold-blue py-20 md:py-28 text-primary-foreground">
        <div className="container relative z-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Scholarships available</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl font-light text-white text-balance">
                Five scholarship pathways, <em className="not-italic font-normal text-white/85">one goal: zero tuition.</em>
              </h2>
              <p className="mt-5 max-w-md text-white/75 font-light">
                Every student we work with is eligible for at least one of these scholarship programs. We handle the entire application for you.
              </p>
              <a
                href={buildWhatsAppUrl("Hi! I'd like to know more about Italy scholarships and the free study program.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 bg-white text-primary rounded-full px-6 py-3 text-sm font-semibold hover:bg-white/90 transition-smooth"
              >
                Check my eligibility <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="space-y-3">
              {scholarships.map((s, i) => (
                <div
                  key={s}
                  className="flex items-center gap-4 rounded-2xl border border-white/18 bg-white/8 px-6 py-5 backdrop-blur-md transition-smooth hover:bg-white/12"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 font-display text-lg text-white">
                    {i + 1}
                  </span>
                  <span className="font-display text-lg text-white">{s}</span>
                  <Check className="ml-auto h-5 w-5 text-accent-glow shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Universities */}
      <section className="relative overflow-hidden bg-background py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Partner universities</p>
            <h2 className="mt-4 font-display text-4xl md:text-6xl font-semibold text-primary text-balance">
              Italy's top public universities
            </h2>
            <p className="mt-5 text-muted-foreground">
              We work with 15+ prestigious Italian public universities offering English-taught Bachelor's and Master's programs.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((uni) => (
              <div
                key={uni}
                className="flex items-center gap-3 rounded-2xl border border-border bg-white/70 px-5 py-4 shadow-soft transition-smooth hover:shadow-card hover:border-accent/30"
              >
                <GraduationCap className="h-5 w-5 text-accent shrink-0" />
                <span className="font-display text-base text-primary">{uni}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/study-in/italy"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-primary transition-smooth"
            >
              Explore all Italy universities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="relative overflow-hidden bg-fold-light py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">How it works</p>
            <h2 className="mt-4 font-display text-4xl md:text-6xl font-semibold text-primary text-balance">
              Four steps to Italy
            </h2>
            <p className="mt-5 text-muted-foreground">
              From your first call to your flight ticket — we're with you at every step. The complete package is ₹1.4 lakhs.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div
                key={s.step}
                className="relative rounded-[2rem] border border-white/70 bg-white/80 shadow-soft backdrop-blur-md p-6 transition-smooth hover:shadow-elegant"
              >
                <span className="font-display text-5xl font-light text-accent/30">{s.step}</span>
                <h3 className="mt-3 font-display text-xl text-primary">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Spotlight (Instagram + YouTube) */}
      <SocialSpotlight />

      {/* Lead Form */}
      <LeadForm />

      {/* FAQ */}
      <FAQ />

      {/* Footer */}
      <Footer alwaysVisible />

      <WhatsAppFAB />
    </main>
  );
};

export default StudyItalyFree;
