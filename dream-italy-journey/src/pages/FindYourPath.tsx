import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe2,
  GraduationCap,
  PlaneTakeoff,
  Wallet,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { submitLeadSubmission } from "@/lib/leadSubmission";

import logoFinal from "@/assets/logo-final.png";
import countryAustralia from "@/assets/dest-australia.jpg";
import countryCanada from "@/assets/dest-canada.jpg";
import countryDubai from "@/assets/dest-dubai-burj.optimized.webp";
import countryFrance from "@/assets/dest-france.jpg";
import countryGermany from "@/assets/dest-germany.jpg";
import countryItaly from "@/assets/dest-italy.jpg";
import countryMalta from "@/assets/dest-malta-skyline.optimized.webp";
import countryUK from "@/assets/dest-uk.jpg";
import countryUSA from "@/assets/dest-usa.jpg";
import { useInitialPageReady } from "@/hooks/useInitialPageReady";
import { cn } from "@/lib/utils";

type StepKey = "country" | "intake" | "level" | "stream" | "tests" | "budget";

type StepMeta = {
  key: StepKey;
  title: string;
  question: string;
  icon: typeof Globe2;
};

const pageShell = "mx-auto w-full max-w-[1360px] px-4 md:px-6";

const steps: StepMeta[] = [
  { key: "country", title: "Country", question: "Which countries do you want us to consider for your application?", icon: Globe2 },
  { key: "intake", title: "Intake", question: "Which intake windows should we plan around?", icon: PlaneTakeoff },
  { key: "level", title: "Level", question: "What level of study are you applying for?", icon: GraduationCap },
  { key: "stream", title: "Stream", question: "Which academic streams should we explore for you?", icon: BadgeCheck },
  { key: "tests", title: "Tests", question: "Which exams have you taken or plan to take?", icon: FileText },
  { key: "budget", title: "Budget", question: "What budget range should we plan around?", icon: Wallet },
];

const countries = [
  { name: "Italy", image: countryItaly },
  { name: "Germany", image: countryGermany },
  { name: "France", image: countryFrance },
  { name: "United Kingdom", image: countryUK },
  { name: "Canada", image: countryCanada },
  { name: "United States", image: countryUSA },
  { name: "Australia", image: countryAustralia },
  { name: "Malta", image: countryMalta },
  { name: "Dubai", image: countryDubai },
];

const intakeOptions = ["Fall 2026", "Spring 2027", "Summer 2027", "Not decided yet"];
const levelOptions = ["Bachelor's", "Master's", "MBA", "PhD", "PG Diploma"];
const streamOptions = ["Management", "Engineering", "Design", "Medicine / MBBS", "Data & AI", "Law", "Arts & Humanities"];
const testOptions = ["IELTS", "TOEFL", "PTE", "Duolingo", "SAT / ACT", "Not taken"];
const budgetOptions = ["Self-funded", "Sponsored", "Partial loan", "Full loan"];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][\d\s().-]{6,}$/;

const FindYourPath = () => {
  useInitialPageReady([countryItaly], { minDurationMs: 900, timeoutMs: 3200 });

  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [countriesSelected, setCountriesSelected] = useState<string[]>([countries[0].name]);
  const [intakesSelected, setIntakesSelected] = useState<string[]>([intakeOptions[0]]);
  const [levelsSelected, setLevelsSelected] = useState<string[]>([levelOptions[1]]);
  const [streamsSelected, setStreamsSelected] = useState<string[]>([streamOptions[0]]);
  const [testsSelected, setTestsSelected] = useState<string[]>([testOptions[0]]);
  const [budget, setBudget] = useState(budgetOptions[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contactComplete, setContactComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeStep = steps[Math.min(step, steps.length - 1)] ?? steps[0];
  const totalVisibleSteps = steps.length;
  const progress = useMemo(() => {
    if (contactComplete) return 100;
    if (step === steps.length) return 92;
    return ((step + 1) / (totalVisibleSteps + 1)) * 92;
  }, [contactComplete, step, totalVisibleSteps]);
  const canGoBack = step > 0;
  const isBudgetStep = step === steps.length - 1;
  const isContactStep = step === steps.length;
  const canAdvanceFromStep = (currentStep: number) => {
    if (currentStep === 0) return countriesSelected.length > 0;
    if (currentStep === 1) return intakesSelected.length > 0;
    if (currentStep === 2) return levelsSelected.length > 0;
    if (currentStep === 3) return streamsSelected.length > 0;
    if (currentStep === 4) return testsSelected.length > 0;
    if (currentStep === 5) return Boolean(budget);
    return false;
  };

  useEffect(() => {
    document.title = "Find Scholarships — Go Study Overseas";

    const description = "A compact study abroad stepper.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, []);

  const goNext = async () => {
    if (step < steps.length - 1) {
      if (!canAdvanceFromStep(step)) {
        toast.error("Please select at least one option to continue.");
        return;
      }
      setStep((current) => current + 1);
      return;
    }

    if (isBudgetStep) {
      setStep(steps.length);
      return;
    }

    if (!phone.trim()) {
      toast.error("Please share your phone number.");
      return;
    }

    if (!name.trim()) {
      toast.error("Please share your name.");
      return;
    }

    const trimmedPhone = phone.trim();
    if (!phonePattern.test(trimmedPhone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    const trimmedEmail = email.trim();
    if (trimmedEmail && !emailPattern.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const payload = {
      countries: countriesSelected,
      intakes: intakesSelected,
      levels: levelsSelected,
      streams: streamsSelected,
      tests: testsSelected,
      budget,
      name: name.trim(),
      phone: trimmedPhone,
      email: trimmedEmail,
      submittedAt: new Date().toISOString(),
    };

    sessionStorage.setItem("findYourPathSelections", JSON.stringify(payload));

    setIsSubmitting(true);

    try {
      await submitLeadSubmission({
        form: "find-your-path",
        submittedAt: payload.submittedAt,
        sourcePath: window.location.pathname,
        pageUrl: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        name: payload.name,
        phone: payload.phone,
        email: payload.email || undefined,
        countries: payload.countries,
        intakes: payload.intakes,
        levels: payload.levels,
        streams: payload.streams,
        tests: payload.tests,
        budget: payload.budget,
      });

      toast.success("Opening your scholarship matches...");
      setContactComplete(true);
      navigate("/scholarship-finder");
    } catch (error) {
      console.error(error);
      toast.error("We could not send your request just now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (isContactStep) {
      setStep(steps.length - 1);
      return;
    }

    setStep((current) => Math.max(0, current - 1));
  };

  const toggleSelected = (value: string, selected: string[], setter: (items: string[]) => void) => {
    setter(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep <= step) {
      setStep(targetStep);
      return;
    }

    if (!canAdvanceFromStep(step)) {
      toast.error("Please select at least one option to continue.");
      return;
    }

    setStep(targetStep);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6fbff] text-foreground">
      <section className="relative isolate flex h-[100svh] flex-col overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,116,178,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,180,86,0.18),transparent_32%),linear-gradient(135deg,#f7fbff_0%,#edf5fb_56%,#eef7f2_100%)]" />

        <header className={`${pageShell} relative z-10 pt-3 sm:pt-4 md:pt-5`}>
          <div className="flex flex-col gap-2 md:grid md:min-h-[52px] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-3">
            <Link
              to="/"
              className="inline-flex items-center self-start rounded-lg bg-white px-2 py-1 shadow-sm transition-smooth hover:bg-[#f4f8fc] md:justify-self-start"
              aria-label="Go home"
            >
              <img src={logoFinal} alt="Go Study Overseas" className="h-8 w-auto object-contain md:h-9" width={422} height={97} />
            </Link>

            <div className="w-full rounded-[18px] border border-white/70 bg-white/80 px-2 py-2 shadow-soft backdrop-blur md:mx-auto md:max-w-5xl md:px-3 md:py-3">
              <div className="no-scrollbar flex items-center gap-1 overflow-x-auto pb-1 md:justify-between md:gap-2 md:overflow-visible">
                {steps.map((item, index) => {
                  const done = index < step || contactComplete;
                  const current = index === step && !contactComplete;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleStepClick(index)}
                      className="flex items-center gap-1 whitespace-nowrap"
                      aria-pressed={current || done}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold transition-smooth md:h-8 md:w-8",
                          done
                            ? "border-[#12304a] bg-[#12304a] text-white"
                            : current
                              ? "border-[#12304a] bg-[#eff7fc] text-[#12304a]"
                              : "border-[#d7e4ed] bg-white text-[#92a4b3]",
                        )}
                      >
                        {done ? <Check className="h-3 w-3 md:h-3.5 md:w-3.5" /> : <Icon className="h-3 w-3 md:h-3.5 md:w-3.5" />}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-semibold uppercase tracking-[0.14em] md:text-[11px]",
                          done || current ? "text-[#10273c]" : "text-[#92a4b3]",
                        )}
                      >
                        {item.title}
                      </span>
                      {index < steps.length - 1 ? <span className="mx-1 h-px w-3 bg-[#d7e4ed] md:mx-2 md:w-6" /> : null}
                    </button>
                  );
                })}

                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold transition-smooth md:h-8 md:w-8",
                      contactComplete ? "border-[#12304a] bg-[#12304a] text-white" : "border-[#d7e4ed] bg-white text-[#92a4b3]",
                    )}
                    aria-label="Contact completion"
                  >
                    <Check className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  </span>
                </div>
              </div>

              <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#e8eef4]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#16344b,#2d7cb5_55%,#6bb89a)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 flex flex-1 min-h-0">
          <div className={`${pageShell} flex w-full flex-1 min-h-0 py-2 md:py-3`}>
            <div className="mx-auto flex w-full max-w-5xl flex-1 min-h-0 flex-col gap-2 md:gap-3">
              <aside className="rounded-[22px] border border-white/70 bg-white/86 px-3 py-2.5 shadow-elegant backdrop-blur md:px-4 md:py-3.5">
                <h1 className="font-display text-[1.15rem] leading-[1.1] text-[#10273c] md:text-[1.85rem]">
                  {isContactStep ? "Where should we send you our Study Abroad Admissions Guide PDF?" : activeStep.question}
                </h1>
              </aside>

              <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-white/70 bg-white/86 p-3 shadow-elegant backdrop-blur md:p-4">
                <div className="mb-2.5 flex items-center justify-between gap-4">
                  <h2 className="font-display text-base text-[#10273c] md:text-xl">{isContactStep ? "Contact" : activeStep.title}</h2>
                </div>

                <div className="min-h-0 flex-1 overflow-hidden">
                  <div className="h-full min-h-0 overflow-y-auto pr-1">
                    {step === 0 ? (
                      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
                        {countries.map((option) => {
                          const active = countriesSelected.includes(option.name);

                          return (
                            <button
                              key={option.name}
                              type="button"
                              onClick={() => toggleSelected(option.name, countriesSelected, setCountriesSelected)}
                              className={cn(
                                "relative overflow-hidden rounded-[14px] border text-left transition-smooth hover:-translate-y-0.5 hover:shadow-soft",
                                active ? "border-[#12304a]/20 shadow-soft" : "border-[#d9e5ee]",
                              )}
                            >
                              <img src={option.image} alt={option.name} className="absolute inset-0 h-full w-full object-cover" />
                              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,18,30,0.06),rgba(6,18,30,0.82))]" />
                              <div className="relative flex aspect-[3/4] items-end justify-between p-2 text-white">
                                <h3 className="max-w-[74%] font-display text-[9px] leading-tight text-white sm:text-[10px] md:text-[15px]">
                                  {option.name}
                                </h3>
                                {active ? (
                                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#10273c] sm:h-6 sm:w-6">
                                    <Check className="h-3 w-3" />
                                  </span>
                                ) : null}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : null}

                    {step === 1 ? (
                      <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                        {intakeOptions.map((option) => {
                          const active = intakesSelected.includes(option);

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => toggleSelected(option, intakesSelected, setIntakesSelected)}
                              className={cn(
                                "flex items-center justify-between rounded-[16px] border px-3 py-2 text-left transition-smooth hover:-translate-y-0.5 hover:shadow-soft",
                                active ? "border-[#12304a]/20 bg-[#eff7fc] shadow-soft" : "border-[#d9e5ee] bg-[#fbfdff]",
                              )}
                            >
                              <p className="font-display text-[11px] text-[#10273c] sm:text-sm md:text-[15px]">{option}</p>
                              {active ? <Check className="h-3 w-3 text-[#2d7cb5] md:h-3.5 md:w-3.5" /> : null}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}

                    {step === 2 ? (
                      <div className="flex flex-wrap gap-2">
                        {levelOptions.map((option) => {
                          const active = levelsSelected.includes(option);

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => toggleSelected(option, levelsSelected, setLevelsSelected)}
                              className={cn(
                                "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-smooth md:px-3.5 md:py-2 md:text-sm",
                                active
                                  ? "border-[#12304a] bg-[#12304a] text-white shadow-[0_10px_24px_rgba(18,48,74,0.22)]"
                                  : "border-[#d9e5ee] bg-[#fbfdff] text-[#10273c] hover:border-[#12304a]/20",
                              )}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}

                    {step === 3 ? (
                      <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                        {streamOptions.map((option) => {
                          const active = streamsSelected.includes(option);

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => toggleSelected(option, streamsSelected, setStreamsSelected)}
                              className={cn(
                                "rounded-[16px] border px-3 py-2 text-left transition-smooth hover:-translate-y-0.5 hover:shadow-soft",
                                active ? "border-[#12304a]/20 bg-[#eff7fc] shadow-soft" : "border-[#d9e5ee] bg-[#fbfdff]",
                              )}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <p className="font-display text-[11px] leading-tight text-[#10273c] sm:text-sm md:text-[15px]">{option}</p>
                                {active ? <Check className="h-3 w-3 text-[#2d7cb5] md:h-3.5 md:w-3.5" /> : null}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : null}

                    {step === 4 ? (
                      <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                        {testOptions.map((option) => {
                          const active = testsSelected.includes(option);

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => toggleSelected(option, testsSelected, setTestsSelected)}
                              className={cn(
                                "rounded-[16px] border px-3 py-2 text-left transition-smooth hover:-translate-y-0.5 hover:shadow-soft",
                                active ? "border-[#12304a]/20 bg-[#eff7fc] shadow-soft" : "border-[#d9e5ee] bg-[#fbfdff]",
                              )}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <p className="font-display text-[11px] text-[#10273c] sm:text-sm md:text-[15px]">{option}</p>
                                {active ? <Check className="h-3 w-3 text-[#2d7cb5] md:h-3.5 md:w-3.5" /> : null}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : null}

                    {step === 5 ? (
                      <div className="grid gap-1.5 sm:grid-cols-2">
                        {budgetOptions.map((option) => {
                          const active = budget === option;

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setBudget(option)}
                              className={cn(
                                "rounded-[16px] border px-3 py-2 text-left transition-smooth hover:-translate-y-0.5 hover:shadow-soft",
                                active ? "border-[#12304a]/20 bg-[#eff7fc] shadow-soft" : "border-[#d9e5ee] bg-[#fbfdff]",
                              )}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <p className="font-display text-[11px] text-[#10273c] sm:text-sm md:text-[15px]">{option}</p>
                                {active ? <Check className="h-3 w-3 text-[#2d7cb5] md:h-3.5 md:w-3.5" /> : null}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : null}

                    {isContactStep ? (
                      <div className="mx-auto grid max-w-xl gap-2.5">
                        <label className="block">
                          <span className="text-xs font-medium text-[#32506e] md:text-sm">Name</span>
                          <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Your full name"
                            className="mt-2 w-full rounded-2xl border border-[#d9e5ee] bg-white px-3 py-2 text-sm outline-none transition-smooth focus:border-[#12304a]/50"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs font-medium text-[#32506e] md:text-sm">Phone number</span>
                          <input
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            placeholder="+91 ..."
                            className="mt-2 w-full rounded-2xl border border-[#d9e5ee] bg-white px-3 py-2 text-sm outline-none transition-smooth focus:border-[#12304a]/50"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs font-medium text-[#32506e] md:text-sm">Email address (optional)</span>
                          <input
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            type="email"
                            className="mt-2 w-full rounded-2xl border border-[#d9e5ee] bg-white px-3 py-2 text-sm outline-none transition-smooth focus:border-[#12304a]/50"
                          />
                        </label>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-3 border-t border-[#d9e5ee] pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={!canGoBack}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-smooth",
                      canGoBack
                        ? "border border-[#d9e5ee] bg-white text-[#10273c] hover:border-[#12304a]/20"
                        : "cursor-not-allowed border border-[#eef3f7] bg-[#f4f7fa] text-[#95a6b4]",
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#12304a] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(18,48,74,0.24)] transition-smooth hover:bg-[#163a58]"
                  >
                    {isSubmitting && isContactStep
                      ? "Sending..."
                      : isContactStep
                        ? "Submit"
                        : isBudgetStep
                          ? "Continue to contact"
                          : "Save & Proceed"}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FindYourPath;
