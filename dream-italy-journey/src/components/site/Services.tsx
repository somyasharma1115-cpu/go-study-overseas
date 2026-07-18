import heroSky from "@/assets/bg-aerial.jpg";

const steps = [
  {
    title: "Profile Building",
    body: "Create a strong student profile highlighting strengths, goals.",
  },
  {
    title: "Course, College & Country Shortlisting",
    body: "Choose right program, university, and destination for success.",
  },
  {
    title: "Exam Preparation",
    body: "Prepare thoroughly for IELTS, TOEFL, GRE, or GMAT with expert guidance.",
  },
  {
    title: "University & Scholarship Application",
    body: "Apply to top universities with scholarship opportunities globally.",
  },
  {
    title: "Loan Assistance",
    body: "Get expert guidance for student loans with easy approvals.",
  },
  {
    title: "Visa Application & Accommodation Assistance",
    body: "Support in visa process and housing arrangements abroad.",
  },
  {
    title: "Flight / Insurance (Forex) Support",
    body: "Guidance on tickets, travel insurance, and foreign exchange.",
  },
  {
    title: "Pre-Departure Briefing",
    body: "Prepare for cultural, academic, and lifestyle adjustments overseas.",
  },
];

export const Services = () => {
  return (
    <section
      id="services"
      data-scroll-reveal
      data-controlled-scroll
      className="scroll-reveal-section ygm-process-section flex min-h-[115svh] items-center py-32 md:py-40"
    >
      <div data-panel-content className="ygm-process-shell">
        <div className="ygm-process-grid">
          <div className="ygm-process-left relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 z-0 opacity-45 lg:hidden">
              <img
                className="ygm-process-image"
                src={heroSky}
                alt="A sky journey visual"
                loading="lazy"
                decoding="async"
                width={1920}
                height={1080}
              />
            </div>
            <div className="relative z-10 p-5 sm:p-7 lg:p-0">
              <p className="ygm-process-overline">The Go Study Overseas way</p>
              <h2 className="ygm-process-title">Our Process</h2>
              <p className="ygm-process-intro">
                Step-by-step guidance from profile building to pre-departure, ensuring students achieve success in education and global opportunities.
              </p>
            </div>

            <div className="ygm-process-image-wrap hidden lg:block">
              <img
                className="ygm-process-image"
                src={heroSky}
                alt="A sky journey visual"
                loading="lazy"
                decoding="async"
                width={1920}
                height={1080}
              />
            </div>
          </div>

          <div className="ygm-process-steps relative -mt-16 rounded-2xl bg-[rgba(0,28,68,0.88)] p-4 backdrop-blur-md sm:p-6 lg:-mt-0 lg:rounded-none lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
            <div className="ygm-process-label">Steps</div>

            <div className="ygm-process-list">
              {steps.map((step, index) => (
                <div key={step.title} className="ygm-process-row">
                  <div className={`ygm-process-marker ${index === steps.length - 1 ? "ygm-process-marker-last" : ""}`}>
                    <span className="ygm-process-circle">{index + 1}</span>
                  </div>
                  <div className="ygm-process-copy">
                    <p className="ygm-process-text">
                      <span className="ygm-process-step-title">{step.title}</span>{" "}
                    </p>
                    <p className="ygm-process-body">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
