import admitsKanak from "@/assets/gallery/results/1_kanak_yadav.jpeg";
import admitsShashank from "@/assets/gallery/results/2_shashank.jpeg";
import admitsVibhu from "@/assets/gallery/results/3_vibhu.jpeg";
import admitsNikhil from "@/assets/gallery/results/4_nikhil.jpeg";
import admitsAreeb from "@/assets/gallery/results/5_areeb.jpeg";
import admitsMousam from "@/assets/gallery/results/6_mousam.jpeg";
import admitsMurlidhar from "@/assets/gallery/results/7_murlidhar.jpeg";
import admitsAbhishek from "@/assets/gallery/results/8_abhishek.jpeg";
import admitsSwara from "@/assets/gallery/results/swara.jpeg";
import admitsHaris from "@/assets/gallery/results/haris.jpeg";
import admitsYasvinder from "@/assets/gallery/results/yasvinder.jpeg";
import admitsSahil from "@/assets/gallery/results/sahil.jpeg";
import admitsSamarth from "@/assets/gallery/results/samarth.jpeg";
import admitsAshwindwer from "@/assets/gallery/results/ashwindwer.jpeg";
import admitsPrateek from "@/assets/gallery/results/prateek.jpeg";
import admitsNeeraj from "@/assets/gallery/results/Neeraj.jpeg";
import admitsVineel from "@/assets/gallery/results/vineel.jpeg";
import admitsSiri from "@/assets/gallery/results/siri.jpeg";
import admitsZahra from "@/assets/gallery/results/zahra.jpeg";
import { UniversityLogosMarquee } from "@/components/site/UniversityLogosMarquee";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";

const admits = [
  {
    name: "Kanak Yadav",
    uni: "University of Trieste",
    course: "Bachelors in Earth Sciences for Sustainable Development",
    img: admitsKanak,
    color: "from-amber-100 to-rose-100",
  },
  {
    name: "Shashank Singh",
    uni: "University of Trieste",
    course: "Bachelors in Earth Sciences for Sustainable Development",
    img: admitsShashank,
    color: "from-sky-100 to-indigo-100",
  },
  {
    name: "Vibhu",
    uni: "University of Messina",
    course: "Bachelors in Data Science",
    img: admitsVibhu,
    color: "from-rose-100 to-amber-100",
  },
  {
    name: "Nikhil",
    uni: "University of Trieste",
    course: "Bachelors in Earth Sciences for Sustainable Development",
    img: admitsNikhil,
    color: "from-violet-100 to-sky-100",
  },
  {
    name: "Areeb",
    uni: "University of Trieste",
    course: "Bachelors in Earth Sciences for Sustainable Development",
    img: admitsAreeb,
    color: "from-amber-100 to-pink-100",
  },
  {
    name: "Mousam Bhowmik",
    uni: "University of Siena and University of Venice",
    course: "M.Sc. Sustainable Industrial Pharmaceutical Biotechnology",
    img: admitsMousam,
    color: "from-sky-100 to-violet-100",
  },
  {
    name: "Murlidhar",
    uni: "Sapienza University of Rome",
    course: "M.Sc. Data Science",
    img: admitsMurlidhar,
    color: "from-emerald-100 to-sky-100",
  },
  {
    name: "Abhishek Telangana",
    uni: "University of Pavia, University of Parma, and University of Bologna",
    course: "M.Sc. Agriculture",
    img: admitsAbhishek,
    color: "from-orange-100 to-amber-100",
  },
  {
    name: "Swara",
    uni: "University of Cassino",
    course: "Bachelors in Economics and Business",
    img: admitsSwara,
    color: "from-pink-100 to-purple-100",
  },
  {
    name: "Haris",
    uni: "University of Messina",
    course: "Masters in Engineering in Computer Science",
    img: admitsHaris,
    color: "from-teal-100 to-cyan-100",
  },
  {
    name: "Yasvinder",
    uni: "University of Perugia",
    course: "Bachelors in Engineering Management",
    img: admitsYasvinder,
    color: "from-yellow-100 to-orange-100",
  },
  {
    name: "Sahil",
    uni: "University of Perugia",
    course: "Bachelors in Engineering Management",
    img: admitsSahil,
    color: "from-indigo-100 to-blue-100",
  },
  {
    name: "Samarth",
    uni: "University of Perugia",
    course: "Bachelors in Engineering Management",
    img: admitsSamarth,
    color: "from-lime-100 to-emerald-100",
  },
  {
    name: "Ashwindwer",
    uni: "University of Perugia",
    course: "Bachelors in Engineering Management",
    img: admitsAshwindwer,
    color: "from-cyan-100 to-sky-100",
  },
  {
    name: "Prateek",
    uni: "Offer from University of Venice; University of Milan",
    course: "Masters in Engineering Physics & Computer Sciences",
    img: admitsPrateek,
    color: "from-rose-100 to-red-100",
  },
  {
    name: "Neeraj",
    uni: "Offer letter from University of Perugia",
    course: "Bachelors in Engineering Management",
    img: admitsNeeraj,
    color: "from-green-100 to-teal-100",
  },
  {
    name: "Vineel",
    uni: "Offer letter from University of Perugia",
    course: "Bachelors in Engineering Management",
    img: admitsVineel,
    color: "from-purple-100 to-pink-100",
  },
  {
    name: "Siri",
    uni: "Offer letter from: Dublin City University",
    course: "M.Sc in Science and Health Communication",
    img: admitsSiri,
    color: "from-blue-100 to-indigo-100",
  },
  {
    name: "Zahra",
    uni: "Offer letter from University of Padova & University of Cassino",
    course: "Masters in Aerospace Engineering & Mechanical Engineering",
    img: admitsZahra,
    color: "from-fuchsia-100 to-rose-100",
  },
];

export const Stories = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  useEffect(() => {
    if (!emblaApi) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), 2600);
    return () => window.clearInterval(id);
  }, [emblaApi]);

  return (
    <section
      id="admits"
      data-scroll-reveal
      data-controlled-scroll
      className="scroll-reveal-section relative isolate flex min-h-[115svh] items-center overflow-hidden bg-fold-light py-32 md:py-40"
    >
      <div data-panel-content className="relative z-10 mx-auto w-full max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-ink-soft mb-3">Latest results</p>
          <h2 className="font-display text-4xl md:text-6xl text-ink">Our Admits</h2>
          <p className="mt-5 text-base md:text-lg leading-8 text-ink-soft">
            A snapshot of where our students are headed across the full range of international admissions.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-6xl md:mt-14">
          <div ref={emblaRef} className="overflow-hidden rounded-[2rem] md:hidden">
            <div className="-ml-4 flex">
              {admits.map((p, i) => (
                <div
                  key={`${p.name}-mobile-${i}`}
                  className="min-w-0 shrink-0 basis-[82%] pl-4"
                >
                  <div className={`group h-full rounded-3xl bg-gradient-to-br p-1 ${p.color} shadow-soft`}>
                    <div className="flex h-full flex-col items-center rounded-[22px] bg-card p-4 text-center">
                      <div className="relative mb-4 mt-2">
                        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-brand blur-xl opacity-60" />
                        <img
                          src={p.img}
                          alt={p.name}
                          decoding="async"
                          loading="lazy"
                          width={120}
                          height={120}
                          className="h-24 w-24 rounded-full object-cover ring-4 ring-white"
                        />
                      </div>
                      <div className="font-display text-lg leading-tight text-ink">{p.name}</div>
                      <div className="mt-1 text-xs text-ink-soft">{p.uni}</div>
                      <div className="mt-1 text-[11px] leading-snug text-ink-soft">{p.course}</div>
                      <div className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
                        ✦ Admitted
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden overflow-hidden rounded-[2rem] md:block">
            <div
              className="flex w-max gap-5 animate-marquee"
              style={{ animationDirection: "reverse" }}
            >
              {[...admits, ...admits].map((p, i) => (
                <div
                  key={`${p.name}-${i}`}
                  className={`group w-[15rem] shrink-0 rounded-3xl p-1 bg-gradient-to-br ${p.color} shadow-soft transition-all hover:-translate-y-1 hover:shadow-cloud md:w-[17rem]`}
                >
                  <div className="flex h-full flex-col items-center rounded-[22px] bg-card p-4 text-center">
                    <div className="relative mb-4 mt-2">
                      <div className="absolute inset-0 -z-10 rounded-full bg-gradient-brand blur-xl opacity-60" />
                      <img
                        src={p.img}
                        alt={p.name}
                        decoding="async"
                        loading="lazy"
                        width={120}
                        height={120}
                        className="h-24 w-24 rounded-full object-cover ring-4 ring-white md:h-28 md:w-28"
                      />
                    </div>
                    <div className="font-display text-lg leading-tight text-ink">{p.name}</div>
                    <div className="mt-1 text-xs text-ink-soft">{p.uni}</div>
                    <div className="mt-1 text-[11px] leading-snug text-ink-soft">{p.course}</div>
                    <div className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
                      ✦ Admitted
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <UniversityLogosMarquee />
          </div>
        </div>
      </div>
    </section>
  );
};
