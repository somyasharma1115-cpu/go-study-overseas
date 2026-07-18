import { useState } from "react";
import uniboWordmark from "@/assets/web/logos/unibo-wordmark.webp";
import sapienzaIcon from "@/assets/web/italy-logos/sapienza-icon.png";
import unimiSeal from "@/assets/web/italy-logos/unimi-seal.png";
import unipdLogo from "@/assets/web/italy-logos/unipd.svg";
import unipiCherubino from "@/assets/web/italy-logos/unipi-cherubino.svg";
import uninaSeal from "@/assets/web/italy-logos/unina-seal.png";
import unifiIcon from "@/assets/web/italy-logos/unifi-icon.png";
import unitoLogo from "@/assets/web/italy-logos/unito-logo-trim.png";
import ygmLogo1 from "@/assets/web/ygm-logos/university-logo-1.png";
import ygmLogo2 from "@/assets/web/ygm-logos/university-logo-2.png";
import ygmLogo3 from "@/assets/web/ygm-logos/university-logo-3.png";
import ygmLogo4 from "@/assets/web/ygm-logos/university-logo-4.png";
import ygmLogo5 from "@/assets/web/ygm-logos/university-logo-5.png";
import ygmLogo6 from "@/assets/web/ygm-logos/university-logo-6.png";
import ygmLogo7 from "@/assets/web/ygm-logos/university-logo-7.png";
import ygmLogo8 from "@/assets/web/ygm-logos/university-logo-8.png";
import ygmLogo9 from "@/assets/web/ygm-logos/university-logo-9.png";
import ygmLogo10 from "@/assets/web/ygm-logos/university-logo-10.png";
import ygmLogo11 from "@/assets/web/ygm-logos/university-logo-11.png";
import ygmLogo12 from "@/assets/web/ygm-logos/university-logo-12.png";
import ygmLogo13 from "@/assets/web/ygm-logos/university-logo-13.png";
import ygmLogo14 from "@/assets/web/ygm-logos/university-logo-14.png";
import ygmLogo15 from "@/assets/web/ygm-logos/university-logo-15.png";
import ygmLogo16 from "@/assets/web/ygm-logos/university-logo-16.png";
import ygmLogo17 from "@/assets/web/ygm-logos/university-logo-17.png";
import ygmLogo18 from "@/assets/web/ygm-logos/university-logo-18.png";
import ygmLogo19 from "@/assets/web/ygm-logos/university-logo-19.png";
import ygmLogo20 from "@/assets/web/ygm-logos/university-logo-20.png";

const italyPublicUniversities = [
  { kind: "university" as const, name: "Sapienza University of Rome", logo: sapienzaIcon },
  { kind: "university" as const, name: "University of Bologna", logo: uniboWordmark },
  { kind: "university" as const, name: "University of Milan", logo: unimiSeal },
  { kind: "university" as const, name: "University of Padua", logo: unipdLogo },
  {
    kind: "university" as const,
    name: "University of Pisa",
    logo: unipiCherubino,
  },
  { kind: "university" as const, name: "University of Naples Federico II", logo: uninaSeal },
  { kind: "university" as const, name: "University of Florence", logo: unifiIcon },
  { kind: "university" as const, name: "University of Turin", logo: unitoLogo },
];

const legacyLogos = [
  ygmLogo1,
  ygmLogo2,
  ygmLogo3,
  ygmLogo4,
  ygmLogo5,
  ygmLogo6,
  ygmLogo7,
  ygmLogo8,
  ygmLogo9,
  ygmLogo10,
  ygmLogo11,
  ygmLogo12,
  ygmLogo13,
  ygmLogo14,
  ygmLogo15,
  ygmLogo16,
  ygmLogo17,
  ygmLogo18,
  ygmLogo19,
  ygmLogo20,
].map((logo, index) => ({
  kind: "legacy" as const,
  name: `Partner university ${index + 1}`,
  logo,
}));

const marqueeItems = [...italyPublicUniversities, ...legacyLogos];

type UniversityLogosMarqueeProps = {
  className?: string;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter((part) => part.length > 0 && part.toLowerCase() !== "of" && part.toLowerCase() !== "di")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const LogoCard = ({
  kind,
  name,
  logo,
  cardClassName,
  logoWrapperClassName,
}: {
  kind: "university" | "legacy";
  name: string;
  logo: string;
  cardClassName?: string;
  logoWrapperClassName?: string;
}) => {
  const [hasError, setHasError] = useState(false);
  const isUniversityCard = kind === "university";
  const showLabel = isUniversityCard;

  return (
    <div
      className={[
        "flex h-24 w-52 shrink-0 items-center justify-center overflow-hidden rounded-2xl px-4 shadow-sm ring-1 md:h-28 md:w-60",
        cardClassName ?? "bg-white ring-slate-200/80",
      ].join(" ")}
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 py-3 text-center">
        <div
          className={[
            "flex w-full min-w-0 items-center justify-center overflow-hidden rounded-2xl px-3",
            showLabel ? "h-12 md:h-14" : "h-14 md:h-16",
            logoWrapperClassName ?? (cardClassName ? "bg-white/10" : "bg-white"),
          ].join(" ")}
        >
          {hasError ? (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-sm font-bold tracking-[0.14em] text-slate-700 ring-1 ring-slate-200">
              {getInitials(name)}
            </div>
          ) : (
            <img
              src={logo}
              alt={isUniversityCard ? name : ""}
              aria-hidden={isUniversityCard ? undefined : "true"}
              loading="lazy"
              decoding="async"
              width={showLabel ? 160 : 120}
              height={showLabel ? 56 : 60}
              onError={() => setHasError(true)}
              className={[
                "block max-h-full max-w-full object-contain",
                showLabel ? "w-full" : "h-full w-full",
                cardClassName
                  ? "brightness-[1.08] contrast-[1.08] saturate-[1.08]"
                  : "contrast-[1.04]",
                name === "University of Pisa" ? "invert" : "",
              ].join(" ")}
            />
          )}
        </div>

        {showLabel ? (
          <span className={`line-clamp-2 text-[11px] font-semibold leading-4 ${cardClassName ? "text-white" : "text-slate-700"}`}>
            {name}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export const UniversityLogosMarquee = ({ className = "" }: UniversityLogosMarqueeProps) => {
  return (
    <div className={`overflow-hidden rounded-[2rem] border border-white/25 bg-transparent p-4 md:p-5 ${className}`.trim()}>
      <div className="flex w-max gap-4 animate-marquee">
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <LogoCard
            key={`${item.kind}-${item.name}-${i}`}
            kind={item.kind}
            name={item.name}
            logo={item.logo}
            cardClassName={item.kind === "university" && "cardClassName" in item ? item.cardClassName : undefined}
            logoWrapperClassName={item.kind === "university" && "logoWrapperClassName" in item ? item.logoWrapperClassName : undefined}
          />
        ))}
      </div>
    </div>
  );
};
