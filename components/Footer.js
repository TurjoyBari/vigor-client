import Link from "next/link";
import { FaceSmile, Globe, BroadcastSignal } from "@gravity-ui/icons";
import Icon from "./Icon";

const platformLinks = [
  { href: "#", label: "Workouts" },
  { href: "#", label: "Programs" },
  { href: "#", label: "Live Coaching" },
  { href: "#", label: "Diagnostic Lab" },
];

const companyLinks = [
  { href: "#", label: "Privacy" },
  { href: "#", label: "Terms" },
  { href: "#", label: "Support" },
  { href: "#", label: "Careers" },
];

const socialLinks = [
  { href: "#", icon: FaceSmile, label: "Social" },
  { href: "#", icon: Globe, label: "Website" },
  { href: "#", icon: BroadcastSignal, label: "Share" },
];

export default function Footer() {
  return (
    <footer className="relative w-full -mt-slant-angle clip-path-slant bg-gradient-to-b from-surface-container-high to-background flex flex-col items-center py-section-gap px-margin-mobile md:px-margin-desktop gap-8">
      <div className="w-full max-w-container-max flex flex-col md:flex-row justify-between items-start pt-20">
        <div className="mb-12 md:mb-0">
          <Link
            href="/"
            className="font-anybody text-headline-lg font-black italic text-primary uppercase"
          >
            VIGOR
          </Link>
          <p className="text-on-surface-variant font-hanken text-body-md mt-4 max-w-xs">
            Engineered for the elite. Powered by high-fidelity human telemetry.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div>
            <h5 className="font-geist-label text-label-bold text-on-surface uppercase mb-6 tracking-widest">
              Platform
            </h5>
            <ul className="flex flex-col gap-3">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-on-surface-variant hover:text-secondary-fixed transition-colors font-hanken text-body-md"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-geist-label text-label-bold text-on-surface uppercase mb-6 tracking-widest">
              Company
            </h5>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-on-surface-variant hover:text-secondary-fixed transition-colors font-hanken text-body-md"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-white/5 mt-12" />

      <div className="w-full max-w-container-max flex flex-col md:flex-row justify-between items-center py-8 gap-4">
        <p className="text-on-surface-variant font-geist-label text-label-sm uppercase tracking-widest">
          © 2024 VIGOR PERFORMANCE. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-6">
          {socialLinks.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              className="text-on-surface-variant hover:text-primary transition-colors"
              aria-label={social.label}
            >
              <Icon icon={social.icon} size={24} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
