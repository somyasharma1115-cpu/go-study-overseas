import { useEffect, useState } from "react";
import { ChevronDown, LoaderCircle, Star } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useInitialPageReady } from "@/hooks/useInitialPageReady";
import aboutHero from "@/assets/about.jpeg";
import galleryOne from "@/assets/gallery/sub_team_photo.jpeg";
import galleryTwo from "@/assets/gallery/team_photo_2.jpeg";
import galleryThree from "@/assets/gallery/team_photo-3.jpeg";
import galleryFour from "@/assets/gallery/exhibition_stall.jpeg";
import galleryFive from "@/assets/gallery/unknown_student_awardgiving.jpeg";
import certificateOne from "@/assets/gallery/certificates/1.jpeg";
import certificateTwo from "@/assets/gallery/certificates/2.jpeg";
import certificateThree from "@/assets/gallery/certificates/3.jpeg";
import amitPhoto from "@/assets/gallery/team_pics/amit.jpeg";
import atishiPhoto from "@/assets/gallery/team_pics/atishi.jpeg";
import adityaPhoto from "@/assets/gallery/team_pics/aditya.jpeg";
import muskanPhoto from "@/assets/gallery/team_pics/muskan.jpeg";

const founders = [
  {
    name: "Amit Bukharia",
    role: "Founder",
    photo: amitPhoto,
    line: "Founder of Go Study Overseas, focused on transparent counselling, scholarship opportunities, and helping students build successful global careers.",
  },
  {
    name: "Atishi Jain",
    role: "Co-Founder",
    photo: atishiPhoto,
    line: "An international career counsellor who has helped a lot of students find the right career path and guided them with soft skills and profile building to help secure admission into good colleges abroad.",
  },
];

const supportTeam = [
  {
    name: "Aditya Bukharia",
    role: "Student Advisor",
    photo: adityaPhoto,
    line: "Aditya Bukharia is a Student Advisor at Go Study Overseas and is currently pursuing a Master’s in International Relations at the University of Milan, Italy. He guides students with university admissions, scholarships, and the Italy student visa process based on his firsthand experience.",
  },
  {
    name: "Muskan",
    role: "Student Advisor",
    photo: muskanPhoto,
    line: "Muskan is a Student Advisor at GoStudy Overseas and is currently pursuing a Master’s in Management Engineering at Politecnico di Milano. She completed her Bachelor’s in Computer Science and guides students with university admissions, scholarships, and the Italy student visa process based on her firsthand experience.",
  },
];

const gallery = [
  { image: galleryOne, label: "Award moment" },
  { image: galleryTwo, label: "Student celebration" },
  { image: galleryThree, label: "Student gathering" },
  { image: galleryFour, label: "Exhibition stall" },
  { image: galleryFive, label: "Recognition day" },
];

const certificates = [
  {
    image: certificateTwo,
    label: "Certificate 1",
    className: "aspect-[16/11] md:translate-y-2",
  },
  {
    image: certificateOne,
    label: "Certificate 2",
    className: "aspect-[4/5] md:-translate-y-4",
  },
  {
    image: certificateThree,
    label: "Certificate 3",
    className: "aspect-[16/11] md:translate-y-2",
  },
];

const testimonials = [
  {
    id: "review-1",
    name: "Atishi Bukharia",
    reviewCount: "8 reviews · 1 photo",
    quote:
      "Truly helpful and transparent consultancy! Go Study Overseas made my study abroad process so simple and stress-free. The team is very supportive and explains every step clearly - from university selection to visa guidance.",
  },
  {
    id: "review-2",
    name: "Gopal Malviya",
    reviewCount: "4 reviews",
    quote:
      "I appreciated the initial study abroad counselling session because they did not just push one specific country. We talked about different options and then they provided great scholarships support by helping me write my statement of purpose and finding grants that matched my academic achievements.",
  },
  {
    id: "review-3",
    name: "Harshit Joshi",
    reviewCount: "2 reviews",
    quote:
      "If you are looking for affordable study abroad options, this is definitely the best consultancy to visit in my opinion. They gave me great scholarships support and helped me find a program that fits my budget perfectly. The advice I received was very honest and they didn't try to hide any hidden costs from me.",
  },
  {
    id: "review-4",
    name: "Abhishek chakravati",
    reviewCount: "3 reviews",
    quote:
      "My dream was to Study in Italy, but I didn't know how to apply for the regional grants. The staff provided amazing scholarships support and helped me gather all the financial documents needed. They made the whole process feel very manageable and clear.",
  },
];

const isFounderReview = (name: string) => {
  const normalizedName = name.toLowerCase();
  return /\batishi\b/.test(normalizedName) || /\bbukhari(?:a|ya)\b/.test(normalizedName);
};

const visibleTestimonials = testimonials.filter((testimonial) => !isFounderReview(testimonial.name));

const faqs = [
  {
    q: "What makes your guidance different?",
    a: "We lead with transparency. Instead of pushing generic options, we map your profile to countries, universities, and scholarships that make sense.",
  },
  {
    q: "Do you work only with Italy?",
    a: "Italy is one of our core strengths, but we also support students considering Germany, France, the UK, Canada, the USA, and Australia.",
  },
  {
    q: "Can I speak to someone before applying?",
    a: "Yes. The first conversation is free, and it is the best way to understand fit, budget, and timeline before you commit to anything.",
  },
  {
    q: "Do you help with visas too?",
    a: "Yes. We stay involved after admission with documentation, visa preparation, and final checks so the process feels much less stressful.",
  },
];

export const About = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const testimonialColumns = [
    visibleTestimonials.filter((_, index) => index % 2 === 0),
    visibleTestimonials.filter((_, index) => index % 2 === 1),
  ];

  useInitialPageReady([aboutHero, founders[0]?.photo]);

  useEffect(() => {
    document.title = "About Go Study Overseas";
    const desc =
      "Meet the team behind Go Study Overseas. Honest admissions guidance, scholarship support, and end-to-end study abroad help for Indian students.";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    // Ensure About always opens at the top, even when the route is revisited from the same page.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    });
  }, []);

  return (
    <main className="min-h-screen bg-white text-[#18263f]">
      <Navbar />

      <section className="relative isolate bg-white pb-[6rem] md:pb-[10.5rem]">
        <div className="relative overflow-hidden pt-2 md:pt-0 md:min-h-[92svh]">
          <img
            src={aboutHero}
            alt="Go Study Overseas team"
            className="block h-auto w-full md:absolute md:inset-0 md:h-full md:w-full md:object-cover md:object-[center_26%]"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,20,32,0.10)_0%,rgba(14,20,32,0.28)_34%,rgba(14,20,32,0.58)_74%,rgba(14,20,32,0.86)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.86)_66%,rgba(255,255,255,1)_100%)] md:h-44" />
        </div>

        <div className="container relative z-10 w-full -mt-8 pb-8 md:pointer-events-none md:-mt-10 md:pb-10">
          <div className="pointer-events-auto grid gap-4 md:absolute md:left-1/2 md:bottom-0 md:w-[min(calc(100vw-24px),940px)] md:-translate-x-1/2 md:translate-y-[58%] md:grid-cols-2">
              {founders.map((director) => (
                <article
                  key={director.name}
                  className="overflow-hidden rounded-[1.6rem] border border-[#e8eef7] bg-white p-5 text-left text-[#18263f] shadow-[0_10px_26px_rgba(16,34,58,0.08)] md:p-6"
                >
                  <img
                    src={director.photo}
                    alt={director.name}
                    className={
                      director.name === "Atishi Jain"
                        ? "h-20 w-20 rounded-2xl object-cover object-top shadow-[0_10px_24px_rgba(16,34,58,0.12)]"
                        : "h-20 w-20 rounded-2xl object-cover shadow-[0_10px_24px_rgba(16,34,58,0.12)]"
                    }
                    decoding="async"
                  />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#d84f44]">
                    {director.role}
                  </p>
                  <h2 className="mt-2 font-display text-[1.7rem] leading-tight text-[#132745] sm:text-[1.95rem]">
                    {director.name}
                  </h2>
                  <p className="mt-2 text-[14px] italic leading-6 text-[#3f5576] sm:mt-3 sm:text-[15px] sm:leading-7">
                    {director.line}
                  </p>
                </article>
              ))}
            </div>
        </div>
      </section>

      <section className="pt-8 pb-14 sm:pt-10 sm:pb-16 md:pt-44 md:pb-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-[#ef5a4f]">Support team</p>
            <h2 className="mt-4 font-display text-4xl text-[#18263f] md:text-6xl">
              Advisors who support students on the ground.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#526179]">
              Our support team brings firsthand student experience from Italy to guide families
              through admissions, scholarships, and visa preparation with clarity.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
            {supportTeam.map((member) => (
              <article
                key={member.name}
                className="overflow-hidden rounded-[1.8rem] border border-[#e8eef7] bg-white p-5 text-left text-[#18263f] shadow-[0_14px_34px_rgba(16,34,58,0.08)] md:p-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="h-24 w-24 shrink-0 rounded-[1.35rem] object-cover shadow-[0_10px_24px_rgba(16,34,58,0.12)]"
                    decoding="async"
                  />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#d84f44]">
                      {member.role}
                    </p>
                    <h2 className="mt-2 font-display text-[1.7rem] leading-tight text-[#132745] sm:text-[1.95rem]">
                      {member.name}
                    </h2>
                  </div>
                </div>
                <p className="mt-4 text-[14px] italic leading-6 text-[#3f5576] sm:text-[15px] sm:leading-7">
                  {member.line}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate pt-8 pb-16 sm:pt-10 sm:pb-20 md:pt-48 md:pb-28">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-[#ef5a4f]">Certificates</p>
            <h2 className="mt-4 font-display text-4xl text-[#18263f] md:text-6xl">
              Recognitions that reflect our students' progress.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#526179]">
              A few recent certificates and achievements from the gallery, showing milestones
              our students have earned along the way.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:gap-6 md:grid-cols-3 md:gap-6">
            {certificates.map((certificate, index) => (
              <figure
                key={certificate.label}
                className={`overflow-hidden rounded-[1.8rem] border border-[#ebedf2] bg-white p-2.5 shadow-[0_14px_34px_rgba(31,38,63,0.08)] ${
                  index === 1 ? "md:scale-[1.03]" : ""
                } ${certificate.className}`}
              >
                <img
                  src={certificate.image}
                  alt={certificate.label}
                  className="h-full w-full rounded-[1.4rem] object-cover"
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-14 sm:pt-16 md:pt-20 md:pb-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-[#ef5a4f]">Student gallery</p>
            <h2 className="mt-4 font-display text-4xl text-[#18263f] md:text-6xl">
              Student movement from our global journey.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#526179]">
              From counselling sessions to campus arrivals, these snapshots reflect real milestones
              from students who trusted Go Study Overseas with their plans.
            </p>
          </div>

          <div className="about-gallery-rail mt-10">
            <section className="about-gallery-rail__viewport">
              <ul className="about-gallery-rail__track">
                {[...gallery, ...gallery].map((item, index) => (
                  <li key={`${item.label}-${index}`} className="list-none">
                    <figure
                      className={`about-gallery-rail__card shrink-0 overflow-hidden rounded-[1.8rem] border border-[#ebedf2] bg-white p-2.5 shadow-[0_14px_34px_rgba(31,38,63,0.08)] ${
                        index % 5 === 0
                          ? "w-[220px] sm:w-[250px]"
                          : index % 5 === 1
                            ? "w-[290px] sm:w-[330px]"
                            : index % 5 === 2
                              ? "w-[240px] sm:w-[280px]"
                              : index % 5 === 3
                                ? "w-[310px] sm:w-[350px]"
                                : "w-[230px] sm:w-[265px]"
                      } ${index % 2 === 1 ? "translate-y-4 sm:translate-y-7" : ""}`}
                    >
                      <img
                        src={item.image}
                        alt={item.label}
                        className={`w-full rounded-[1.4rem] object-cover ${
                          index % 5 === 1 || index % 5 === 3 ? "aspect-[16/10]" : "aspect-[4/5]"
                        }`}
                        decoding="async"
                      />
                    </figure>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-[#ef5a4f]">Our approach</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.02] text-[#18263f] md:text-6xl">
              Our approach is simple.
            </h2>
            <p className="mt-5 text-2xl font-semibold leading-tight text-[#ef5a4f] md:text-4xl">
              Honest Guidance.
              <br />
              Zero Hidden Charges.
              <br />
              360° Support.
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#5d6b7f] md:text-lg">
              We keep the process structured, human, and transparent so students and parents know
              exactly what is happening, what it costs, and what comes next.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-[#ef5a4f]">Testimonials</p>
            <h2 className="mt-4 font-display text-4xl text-[#18263f] md:text-6xl">
              Students and parents speak for us.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#526179]">
              Selected from our Google Maps reviews to keep the strongest feedback front and center.
            </p>
          </div>

          <div className="mt-10">
            <section className="about-testimonial-flow mx-auto max-w-5xl">
              <div className="about-testimonial-flow__viewport">
                <div className="about-testimonial-flow__columns">
                  {testimonialColumns.map((column, columnIndex) => (
                    <ul
                      key={`column-${columnIndex}`}
                      className={`about-testimonial-flow__track ${
                        columnIndex === 1 ? "about-testimonial-flow__track--offset" : ""
                      }`}
                    >
                      {[...column, ...column].map((item, index) => (
                        <li key={`${item.id}-${columnIndex}-${index}`} className="list-none">
                          <article className="about-testimonial-flow__card rounded-[1.5rem] border border-[#e9dfd0] bg-[#f9fcff] p-5 shadow-[0_16px_40px_rgba(31,38,63,0.07)]">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-display text-2xl text-[#18263f]">{item.name}</p>
                                <p className="text-xs uppercase tracking-[0.18em] text-[#7a8498]">
                                  {item.reviewCount}
                                </p>
                              </div>
                              <div className="inline-flex items-center gap-1 text-[#ef5a4f]">
                                <Star className="h-3.5 w-3.5 fill-current" />
                                <Star className="h-3.5 w-3.5 fill-current" />
                                <Star className="h-3.5 w-3.5 fill-current" />
                                <Star className="h-3.5 w-3.5 fill-current" />
                                <Star className="h-3.5 w-3.5 fill-current" />
                              </div>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-[#596680]">"{item.quote}"</p>
                          </article>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#e9dfd0] bg-white p-6 shadow-[0_18px_50px_rgba(31,38,63,0.08)] md:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-[#ef5a4f]">FAQ</p>
            <h2 className="mt-4 font-display text-4xl text-[#18263f] md:text-5xl">
              Questions we hear most often.
            </h2>

            <div className="mt-8 divide-y divide-[#eadfce]">
              {faqs.map((item, index) => {
                const isOpen = openFaq === index;

                return (
                  <div key={item.q} className="py-4">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between gap-4 text-left"
                    >
                      <span className="pr-4 font-display text-xl text-[#18263f]">{item.q}</span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                          isOpen
                            ? "rotate-180 border-[#ef5a4f] bg-[#fff4f2] text-[#ef5a4f]"
                            : "border-[#d9cdbb] text-[#526179]"
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>
                    <div className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-40 pt-4" : "max-h-0"}`}>
                      <p className="max-w-3xl font-poppins text-sm leading-7 text-[#596680]">{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer alwaysVisible />
    </main>
  );
};

export default About;
