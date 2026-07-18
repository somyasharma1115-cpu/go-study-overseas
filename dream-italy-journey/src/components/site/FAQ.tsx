import { useState } from "react";
import { Plus } from "lucide-react";
import { countryPageMap } from "@/data/countries";

const faqs = countryPageMap.italy.faqs.slice(0, 7);

export const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      id="faqs"
      data-scroll-reveal
      data-controlled-scroll
      className="scroll-reveal-section relative isolate flex min-h-[115svh] items-center overflow-hidden bg-white py-32 md:py-40"
    >
      <div data-panel-content className="container relative z-10 w-full">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary/70">FAQs</p>
            <h2 className="mt-5 font-display text-4xl md:text-5xl font-light text-primary text-balance">
              Got questions? <em className="not-italic font-normal text-primary/80">We've got answers.</em>
            </h2>
          </div>

          <div className="md:col-span-2">
            <div className="divide-y divide-black/10 rounded-[2rem] border border-black/10 bg-black/[0.02] px-6 backdrop-blur-md md:px-8">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div key={i}>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-start justify-between gap-6 py-6 text-left"
                    >
                      <span className="font-display text-lg md:text-xl text-primary">{f.q}</span>
                      <span
                        className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-smooth ${
                          isOpen ? "rotate-45 border-primary/40 bg-primary text-white" : "border-black/20 text-primary"
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isOpen ? "max-h-60 pb-6" : "max-h-0"
                      }`}
                    >
                      <p className="pr-14 font-poppins text-sm leading-7 text-muted-foreground">{f.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-5 text-sm font-light text-primary/80">
              Couldn't find what you're looking for? Drop us a WhatsApp — we usually reply within an hour.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
