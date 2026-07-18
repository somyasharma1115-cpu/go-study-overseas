import { useState } from "react";
import { ArrowRight, Mail, Phone, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { WHATSAPP_URL, CHATBOT_URL } from "@/lib/links";
import { submitLeadSubmission } from "@/lib/leadSubmission";

const degrees = ["Bachelor's", "Master's", "MBA", "PhD"];
const countries = ["Italy 🇮🇹", "Germany", "France", "Ireland", "Netherlands", "UK", "Other"];

export const Contact = () => {
  const [degree, setDegree] = useState("Master's");
  const [picked, setPicked] = useState<string[]>(["Italy 🇮🇹"]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggle = (c: string) =>
    setPicked((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please share your name and phone");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitLeadSubmission({
        form: "contact-form",
        submittedAt: new Date().toISOString(),
        sourcePath: window.location.pathname,
        pageUrl: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        name: name.trim(),
        phone: phone.trim(),
        degree,
        countries: picked,
      });

      toast.success("Thanks! Our counsellor will reach out within 24 hours.");
      setName("");
      setPhone("");
      setDegree("Master's");
      setPicked(["Italy 🇮🇹"]);
    } catch (error) {
      console.error(error);
      toast.error("We could not send your request just now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      data-scroll-reveal
      data-controlled-scroll
      className="scroll-reveal-section relative isolate flex min-h-0 items-start overflow-hidden bg-fold-light py-20 md:min-h-[115svh] md:items-center md:py-40"
    >
      <div data-panel-content className="container relative z-10 w-full">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-20 items-start">
          {/* Direct contact */}
          <div className="order-2 min-w-0 lg:order-1 lg:sticky lg:top-28">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Direct contact</p>
            <h2 className="mt-4 font-display text-4xl md:text-6xl font-semibold text-primary text-balance">
              Prefer talking <em className="not-italic text-accent">right away?</em>
            </h2>
            <p className="mt-5 text-muted-foreground max-w-md">
              Reach our team directly via WhatsApp, the hotline, or email. The next step is always one click away.
            </p>

            <div className="mt-10 space-y-3">
              {[
                { Icon: MessageCircle, label: "WhatsApp", value: "+91 79099 09148", href: WHATSAPP_URL },
                { Icon: MessageCircle, label: "Chatbot", value: "+91 79099 09195", href: CHATBOT_URL },
                { Icon: Phone, label: "Call hotline", value: "+91 8269 342 639", href: "tel:+918269342639" },
                { Icon: Mail, label: "Email us", value: "gostudyoverseas.in@gmail.com", href: "mailto:gostudyoverseas.in@gmail.com" },
              ].map(({ Icon, ...c }) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="group flex flex-col items-start gap-4 rounded-2xl bg-white/72 p-4 shadow-soft backdrop-blur-md transition-smooth hover:shadow-card sm:flex-row sm:items-center sm:gap-5 sm:p-5"
                >
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-secondary flex items-center justify-center transition-smooth group-hover:bg-accent">
                    <Icon className="h-5 w-5 text-primary group-hover:text-accent-foreground transition-smooth" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                    <p className="break-words font-display text-base text-primary sm:text-lg">{c.value}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-smooth group-hover:translate-x-1 group-hover:text-accent" />
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={submit}
            className="order-1 min-w-0 w-full rounded-3xl border border-white/60 bg-white/76 p-4 shadow-elegant backdrop-blur-md sm:p-6 md:p-10 lg:order-2"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Free 1-on-1 expert call</span>
            </div>
            <h3 className="mt-3 font-display text-3xl md:text-4xl text-primary">
              Let's plan your journey
            </h3>

            <div className="mt-8">
              <label className="text-sm font-medium text-foreground/80">Which degree do you want to study?</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {degrees.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDegree(d)}
                    className={`rounded-full px-5 py-2.5 text-sm border transition-smooth ${
                      degree === d
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-foreground border-border hover:border-primary"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <label className="text-sm font-medium text-foreground/80">Country you aspire to study in</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {countries.map((c) => {
                  const on = picked.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggle(c)}
                      className={`rounded-full px-4 py-2 text-sm border transition-smooth ${
                        on
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-transparent text-foreground border-border hover:border-accent"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7 grid sm:grid-cols-2 gap-4">
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
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-medium text-primary-foreground shadow-soft transition-smooth hover:bg-primary-glow disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : "Continue - claim your free call"}
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              We never share your details. Reply within 24 hours.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
