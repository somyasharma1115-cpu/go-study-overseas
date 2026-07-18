import { Link, useNavigate } from "react-router-dom";
import { type MouseEvent } from "react";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo-final.png";

export const Footer = ({ alwaysVisible = false }: { alwaysVisible?: boolean }) => {
  const navigate = useNavigate();

  const handleAboutClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate("/about");

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    });
  };

  return (
    <footer
      data-scroll-reveal
      data-controlled-scroll
      className={`scroll-reveal-section bg-primary pb-10 pt-20 text-primary-foreground ${
        alwaysVisible ? "is-active is-visible" : ""
      }`}
    >
      <div data-panel-content className="container">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="inline-flex rounded-2xl bg-white p-2 shadow-sm">
              <img src={logo} alt="Go Study Overseas" className="h-10 w-auto object-contain md:h-11" loading="lazy" width={422} height={97} />
            </div>
            <p className="mt-4 text-[10px] tracking-[0.25em] uppercase opacity-70">Your global education partner</p>
            <p className="mt-6 max-w-md text-primary-foreground/75 font-light">
              A student-first study abroad consultancy turning global ambitions into scholarship-backed realities — across Europe, North America and Australia.
            </p>
            <div className="mt-8 flex gap-3">
              {[
                { Icon: Instagram, href: "https://www.instagram.com/gostudyoverseas_/", label: "Instagram" },
                { Icon: Instagram, href: "https://www.instagram.com/italygostudyoverseas/", label: "Instagram Italy" },
                { Icon: Facebook, href: "https://www.facebook.com/61583519540289/", label: "Facebook" },
                { Icon: Youtube, href: "https://www.youtube.com/channel/UCdfc70lUXk2zkf7mSEkkK2w", label: "YouTube" },
              ].map(({ Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={label}
                  className="h-11 w-11 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-smooth"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] opacity-70">Explore</p>
            <ul className="mt-5 space-y-3 text-sm">
              {["About", "Blogs", "Universities", "Services", "Testimonials", "Contact", "FAQs"].map((l) => (
                <li key={l}>
                  <Link
                    to={l === "About" ? "/about" : l === "Blogs" ? "/blog" : `/#${l.toLowerCase()}`}
                    onClick={l === "About" ? handleAboutClick : undefined}
                    className="opacity-90 hover:opacity-100 hover:text-accent transition-smooth"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] opacity-70">Reach us</p>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="h-4 w-4 mt-1 text-accent shrink-0" />
                <span className="opacity-90">MSJ House, 3rd Floor, South Tukoganj, Indore — 452001</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-4 w-4 mt-1 text-accent shrink-0" />
                <a href="tel:+918269342639" className="opacity-90 hover:opacity-100">+91 8269 342 639</a>
              </li>
              <li className="flex gap-3">
                <Mail className="h-4 w-4 mt-1 text-accent shrink-0" />
                <a href="mailto:gostudyoverseas.in@gmail.com" className="opacity-90 hover:opacity-100 break-all">gostudyoverseas.in@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row gap-4 justify-between items-center text-xs opacity-70">
          <p>© {new Date().getFullYear()} Go Study Overseas. All rights reserved.</p>
          <p>Privacy Policy · Terms & Conditions · Refund Policy</p>
        </div>
      </div>
    </footer>
  );
};
