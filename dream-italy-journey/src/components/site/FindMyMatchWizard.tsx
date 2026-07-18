import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Globe2, GraduationCap, MessageCircle, Phone, Send, User2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type FindMyMatchWizardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const steps = [
  { title: "Country", icon: Globe2 },
  { title: "Level of Study & Intake", icon: GraduationCap },
  { title: "Program", icon: Check },
  { title: "Info", icon: User2 },
  { title: "Contact", icon: Send },
];

const countryOptions = [
  { name: "Italy", note: "200+ routes · affordable tuition" },
  { name: "Germany", note: "Public universities · low fees" },
  { name: "France", note: "English-taught programs" },
  { name: "United Kingdom", note: "Fast-track degrees" },
  { name: "United States", note: "Flexible admissions" },
  { name: "Canada", note: "Post-study pathways" },
];

const levelOptions = ["Bachelor's", "Master's", "MBA", "PhD"];
const intakeOptions = ["Fall 2026", "Spring 2027", "Summer 2026", "Not sure yet"];
const programOptions = ["Business & Management", "Computer Science", "Engineering", "Medicine / MBBS", "Arts & Design"];

const stepCopy = [
  {
    title: "Pick a destination",
    description: "Start by shortlisting the country that best matches your budget, timeline, and study plans.",
  },
  {
    title: "Set your academic level",
    description: "Tell us the degree level and preferred intake so we can narrow the options quickly.",
  },
  {
    title: "Choose your program track",
    description: "We’ll align the course category with the universities and pathways that fit you best.",
  },
  {
    title: "Share a few details",
    description: "A couple of details helps us personalize counsellor guidance before we contact you.",
  },
  {
    title: "Get matched",
    description: "We’ll route your details to the right counsellor and follow up with the next best step.",
  },
];

export const FindMyMatchWizard = ({ open, onOpenChange }: FindMyMatchWizardProps) => {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState(countryOptions[0].name);
  const [level, setLevel] = useState(levelOptions[1]);
  const [intake, setIntake] = useState(intakeOptions[0]);
  const [program, setProgram] = useState(programOptions[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("");

  const currentStep = useMemo(() => steps[step] ?? steps[0], [step]);
  const resetWizard = useCallback(() => {
    setStep(0);
    setCountry(countryOptions[0].name);
    setLevel(levelOptions[1]);
    setIntake(intakeOptions[0]);
    setProgram(programOptions[0]);
    setName("");
    setPhone("");
    setEmail("");
    setGoal("");
  }, []);

  useEffect(() => {
    if (!open) {
      resetWizard();
    }
  }, [open, resetWizard]);

  const close = () => onOpenChange(false);

  const goNext = () => {
    if (step < steps.length - 1) {
      setStep((value) => value + 1);
      return;
    }

    if (!name.trim() || !phone.trim()) {
      toast.error("Please share your name and phone number");
      return;
    }

    toast.success("Thanks! A counsellor will reach out with your best match.");
    close();
  };

  const goBack = () => setStep((value) => Math.max(0, value - 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 left-0 top-0 z-50 grid h-[100dvh] w-[100vw] max-w-none translate-x-0 translate-y-0 overflow-hidden border-0 bg-transparent p-4 shadow-none sm:p-6 [&>button]:hidden">
        <div className="mx-auto flex h-full w-full max-w-6xl items-start justify-center pt-10 md:items-center md:pt-0">
          <div className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-border/60 bg-background shadow-elegant">
            <div className="border-b border-border/60 bg-gradient-dawn px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-accent">Find My Match</p>
                  <h2 className="mt-2 font-display text-3xl font-medium text-primary md:text-4xl">
                    Guided study abroad matching
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                    A short stepper helps us understand your destination, level, and course fit before we connect you to a counsellor.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={close}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background text-muted-foreground transition-smooth hover:border-accent hover:text-accent"
                  aria-label="Close matching wizard"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 hidden md:flex" data-cy="stepper-main-container">
                {steps.map((item, index) => {
                  const isDone = index < step;
                  const isCurrent = index === step;
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="relative flex-1" data-cy="stepper-child-container">
                      {index > 0 ? <div className="StepperDesktop_stepLineThrough__Yfyxj absolute left-[-50%] right-[50%] top-[4px] h-[1.5px] bg-[#e2e2e2]" /> : null}
                      <div className="flex flex-col items-center">
                        <div
                          data-cy="step-pointer"
                          className={cn(
                            "StepperDesktop_stepShape__2LIAr mb-[15px] flex h-5 w-5 items-center justify-center rounded-full transition-smooth",
                            isDone && "StepperDesktop_stepDone__ljDJo bg-accent text-accent-foreground",
                            isCurrent && "StepperDesktop_currentStep__Uc3mG mb-[5px] border-2 border-accent bg-background text-accent",
                            !isDone && !isCurrent && "border border-border/90 bg-background text-muted-foreground",
                          )}
                        >
                          {isDone ? <Check className="h-3 w-3" /> : isCurrent ? <Icon className="h-2.5 w-2.5" /> : null}
                        </div>
                        <div
                          data-cy="step-name"
                          className={cn(
                            "StepperDesktop_stepName__M9DxE text-center text-sm text-muted-foreground",
                            (isDone || isCurrent) && "StepperDesktop_completed__fYlXA text-primary",
                            isCurrent && "font-medium",
                          )}
                        >
                          {item.title}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-3xl border border-border/60 bg-background/80 px-4 py-4 shadow-soft md:hidden">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-accent">Step {step + 1} of {steps.length}</p>
                    <p className="mt-1 font-display text-xl text-primary">{currentStep.title}</p>
                  </div>
                  <span className="rounded-full border border-border/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {Math.round(((step + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="mt-4 h-1.5 rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full bg-gradient-brand transition-all duration-300"
                    style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid max-h-[72vh] overflow-y-auto px-5 py-5 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-6 lg:px-8 lg:py-8">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-accent">Step {step + 1}</p>
                <h3 className="mt-2 font-display text-2xl text-primary md:text-3xl">{stepCopy[step].title}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">{stepCopy[step].description}</p>

                <div className="mt-6">
                  {step === 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {countryOptions.map((option) => {
                        const active = country === option.name;
                        return (
                          <button
                            key={option.name}
                            type="button"
                            onClick={() => setCountry(option.name)}
                            className={cn(
                              "rounded-3xl border p-4 text-left transition-smooth hover:-translate-y-0.5 hover:shadow-soft",
                              active ? "border-accent bg-accent/10 shadow-soft" : "border-border/70 bg-card",
                            )}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.24em] text-accent">Country</p>
                                <h4 className="mt-1 font-display text-xl text-primary">{option.name}</h4>
                              </div>
                              <span
                                className={cn(
                                  "rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]",
                                  active ? "border-accent bg-accent text-accent-foreground" : "border-border/70 text-muted-foreground",
                                )}
                              >
                                {active ? "Selected" : "Select"}
                              </span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground">{option.note}</p>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  {step === 1 ? (
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm font-medium text-foreground/80">Which degree are you targeting?</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {levelOptions.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setLevel(option)}
                              className={cn(
                                "rounded-full border px-4 py-2.5 text-sm transition-smooth",
                                level === option
                                  ? "border-primary bg-primary text-primary-foreground shadow-soft"
                                  : "border-border bg-transparent text-foreground hover:border-primary",
                              )}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground/80">Preferred intake</p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {intakeOptions.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setIntake(option)}
                              className={cn(
                                "rounded-2xl border px-4 py-3 text-left text-sm transition-smooth",
                                intake === option
                                  ? "border-accent bg-accent text-accent-foreground shadow-soft"
                                  : "border-border bg-card text-foreground hover:border-accent",
                              )}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {step === 2 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {programOptions.map((option) => {
                        const active = program === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setProgram(option)}
                            className={cn(
                              "rounded-3xl border p-4 text-left transition-smooth hover:-translate-y-0.5 hover:shadow-soft",
                              active ? "border-accent bg-accent/10 shadow-soft" : "border-border/70 bg-card",
                            )}
                          >
                            <p className="text-[10px] uppercase tracking-[0.24em] text-accent">Program</p>
                            <h4 className="mt-1 font-display text-xl text-primary">{option}</h4>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                              {option === "Medicine / MBBS"
                                ? "Best for students exploring MBBS and health sciences pathways."
                                : "We’ll use this to surface the most relevant universities and course routes."}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  {step === 3 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <label className="text-sm font-medium text-foreground/80">Your name</label>
                        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Aarav Singh" className="mt-2 h-12 rounded-xl" />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="text-sm font-medium text-foreground/80">Phone number</label>
                        <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91 ..." className="mt-2 h-12 rounded-xl" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-foreground/80">Email</label>
                        <Input
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="you@example.com"
                          type="email"
                          className="mt-2 h-12 rounded-xl"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-foreground/80">What are you aiming for?</label>
                        <Textarea
                          value={goal}
                          onChange={(event) => setGoal(event.target.value)}
                          placeholder="Top universities, scholarships, visa help, MBBS, etc."
                          className="mt-2 min-h-[140px] rounded-2xl"
                        />
                      </div>
                    </div>
                  ) : null}

                  {step === 4 ? (
                    <div className="rounded-[28px] border border-border/70 bg-card p-5 shadow-soft">
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/12 text-accent">
                          <MessageCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-accent">Ready to connect</p>
                          <h4 className="mt-1 font-display text-2xl text-primary">We’ve got your match profile</h4>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {[
                          { label: "Country", value: country },
                          { label: "Level", value: level },
                          { label: "Intake", value: intake },
                          { label: "Program", value: program },
                        ].map((item) => (
                          <div key={item.label} className="rounded-2xl border border-border/70 bg-background px-4 py-3">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{item.label}</p>
                            <p className="mt-1 font-display text-lg text-primary">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 rounded-2xl border border-dashed border-border/70 bg-background/70 px-4 py-4">
                        <p className="text-sm font-medium text-foreground/80">Contact details</p>
                        <div className="mt-3 grid gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-accent" />
                            <span>{phone.trim() || "Phone not shared yet"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-accent" />
                            <span>{email.trim() || "Email not shared yet"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <aside className="mt-8 lg:mt-0">
                <div className="sticky top-6 rounded-[28px] border border-border/70 bg-gradient-to-b from-white to-muted/35 p-5 shadow-soft">
                  <p className="text-xs uppercase tracking-[0.26em] text-accent">Current match</p>
                  <h4 className="mt-2 font-display text-2xl text-primary">{country}</h4>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {level} · {intake} · {program}
                  </p>

                  <div className="mt-5 space-y-3">
                    {[
                      { label: "Country", value: country },
                      { label: "Academic level", value: level },
                      { label: "Preferred intake", value: intake },
                      { label: "Program", value: program },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-3">
                        <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{item.label}</span>
                        <span className="max-w-[60%] truncate text-sm font-medium text-primary">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-3xl bg-gradient-brand p-[1px] shadow-sky">
                    <div className="rounded-[22px] bg-background px-4 py-4">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-accent">Why this matters</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        These quick selections help us surface the right university fits before a counsellor reaches out.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            <div className="border-t border-border/60 bg-background/90 px-5 py-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-primary">{currentStep.title}</span>
                  <span className="mx-2">•</span>
                  <span>Step {step + 1} of {steps.length}</span>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <Button type="button" variant="outline" onClick={goBack} disabled={step === 0} className="rounded-full px-5">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button type="button" onClick={goNext} className="rounded-full px-6 shadow-pill">
                    {step === steps.length - 1 ? (
                      <>
                        Send my match
                        <Send className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Continue
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
