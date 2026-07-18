import { useEffect } from "react";

const instagramReels = [
  {
    title: "Dubai is becoming a serious option for students who want stronger ROI.",
    href: "https://www.instagram.com/reel/DYgoNDrh3ZF/",
  },
  {
    title: "This is what student life feels like at Polimi.",
    href: "https://www.instagram.com/reel/DYgkv7xsvcn/",
  },
  {
    title: "Study in Hungary within 5 lakhs.",
    href: "https://www.instagram.com/reel/DYcXP6ohNsS/",
  },
];

const youtubeVideos = [
  {
    id: "Jx-d-eNHBUg",
    title: "Study in Germany at GISMA University of Applied Sciences | Scholarships Available 2026",
    href: "https://www.youtube.com/watch?v=Jx-d-eNHBUg",
  },
  {
    id: "zw09QRlhixU",
    title: "Don't Apply for Italy Without Watching This 2026/27 Visa Update",
    href: "https://www.youtube.com/watch?v=zw09QRlhixU",
  },
  {
    id: "T_4I-LKpRRU",
    title: "Why students are choosing Uzbekistan for MBBS",
    href: "https://www.youtube.com/watch?v=T_4I-LKpRRU",
  },
];

const cardShell =
  "group overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-soft backdrop-blur-md transition-smooth hover:-translate-y-1 hover:shadow-elegant";

const InstagramEmbed = ({ href }: { href: string }) => {
  const embedHref = `${href}?utm_source=ig_embed&utm_campaign=loading`;

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-captioned
      data-instgrm-permalink={embedHref}
      data-instgrm-version="14"
      style={{
        background: "#FFF",
        border: 0,
        borderRadius: 3,
        boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
        margin: 1,
        maxWidth: 540,
        minWidth: 326,
        padding: 0,
        width: "calc(100% - 2px)",
      }}
    >
      <a
        href={embedHref}
        style={{ background: "#FFFFFF", lineHeight: 0, padding: 0, textAlign: "center", textDecoration: "none", width: "100%" }}
        target="_blank"
        rel="noreferrer"
      >
        <div style={{ padding: "19% 0" }} />
        <div style={{ display: "block", height: 50, margin: "0 auto 12px", width: 50 }}>
          <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886" />
              </g>
            </g>
          </svg>
        </div>
        <div style={{ paddingTop: 8 }}>
          <div style={{ color: "#3897f0", fontFamily: "Arial,sans-serif", fontSize: 14, fontStyle: "normal", fontWeight: 550, lineHeight: "18px" }}>
            View this post on Instagram
          </div>
        </div>
      </a>
      <p
        style={{
          color: "#c9c8cd",
          fontFamily: "Arial,sans-serif",
          fontSize: 14,
          lineHeight: "17px",
          marginBottom: 0,
          marginTop: 8,
          overflow: "hidden",
          padding: "8px 0 7px",
          textAlign: "center",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        <a
          href={embedHref}
          style={{
            color: "#c9c8cd",
            fontFamily: "Arial,sans-serif",
            fontSize: 14,
            fontStyle: "normal",
            fontWeight: "normal",
            lineHeight: "17px",
            textDecoration: "none",
          }}
          target="_blank"
          rel="noreferrer"
        >
          A post shared by Gostudyoverseas (@gostudyoverseas_)
        </a>
      </p>
    </blockquote>
  );
};

export const SocialSpotlight = () => {
  useEffect(() => {
    const w = window as Window & {
      instgrm?: {
        Embeds?: {
          process?: () => void;
        };
      };
    };

    if (!document.getElementById("instagram-embed-script")) {
      const script = document.createElement("script");
      script.id = "instagram-embed-script";
      script.async = true;
      script.src = "https://www.instagram.com/embed.js";
      script.onload = () => w.instgrm?.Embeds?.process?.();
      document.body.appendChild(script);
    } else {
      w.instgrm?.Embeds?.process?.();
    }
  }, []);

  return (
    <section
      id="social"
      data-scroll-reveal
      data-controlled-scroll
      className="scroll-reveal-section relative isolate flex min-h-[115svh] items-start overflow-hidden bg-fold-light py-24 md:items-center md:py-36"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(29,84,156,0.12),_transparent_28%),radial-gradient(circle_at_85%_25%,_rgba(37,211,102,0.10),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.95),_rgba(245,248,252,0.92))]" />
      <div data-panel-content className="container relative z-10 w-full">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Social highlights</p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl font-semibold text-primary text-balance">
            The feeds worth watching, <em className="not-italic text-accent">right here.</em>
          </h2>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            A hand-picked set of recent Instagram reels and YouTube videos.
          </p>
        </div>

        <div className="mt-14 space-y-14">
          <div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-accent">Instagram reels</p>
                <h3 className="mt-2 font-display text-2xl md:text-3xl text-primary">Three recent reels from Gostudyoverseas</h3>
              </div>
              <a
                href="https://www.instagram.com/gostudyoverseas_/"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-accent hover:text-primary transition-smooth"
              >
                Open Instagram
              </a>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {instagramReels.map((reel, index) => (
                <article key={reel.href ?? index} className={cardShell}>
                  <div className="border-b border-black/5 bg-[#0e1726] p-3">
                    <div className="instagram-embed-wrap overflow-hidden rounded-[1.4rem] bg-white">
                      <InstagramEmbed href={reel.href} />
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Instagram reel</p>
                    <a href={reel.href} target="_blank" rel="noreferrer" className="mt-2 block font-display text-lg text-primary hover:text-accent transition-smooth">
                      {reel.title}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-accent">YouTube videos</p>
                <h3 className="mt-2 font-display text-2xl md:text-3xl text-primary">Three featured videos from the official channel</h3>
              </div>
              <a
                href="https://www.youtube.com/channel/UCdfc70lUXk2zkf7mSEkkK2w"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-accent hover:text-primary transition-smooth"
              >
                Open YouTube
              </a>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {youtubeVideos.map((video) => (
                <article key={video.id} className={cardShell}>
                  <div className="border-b border-black/5 bg-[#0e1726] p-3">
                    <div className="overflow-hidden rounded-[1.4rem] bg-black">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1`}
                        title={video.title}
                        className="aspect-video w-full"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">YouTube video</p>
                    <a href={video.href} target="_blank" rel="noreferrer" className="mt-2 block font-display text-lg text-primary hover:text-accent transition-smooth">
                      {video.title}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
