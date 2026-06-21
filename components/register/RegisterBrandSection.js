import Image from "next/image";
import Link from "next/link";
import { Grip, Pulse, Comment } from "@gravity-ui/icons";
import Icon from "@/components/Icon";
import { HERO_IMAGE } from "@/lib/constants/images";

const LOGO_IMAGE =
  "https://lh3.googleusercontent.com/aida/AP1WRLsa8lsZMsP7-3wJ5w20PwFIaHHIGF2OFs-itquo_S9XLclfKE7rP9-4b1t4-4IiW4PAETKHAWi-L-9YpWO9vQATetII1uuQV6wXmj5TEoerRpse8iIhcoxdy2WUX7adf_gnp93q_E9AwwN08gweI5gaOauskdSmIPSf9W9c_W9btdUOsO2iC-GgrL2RyZ6kl_Rl5hmpQLgGUHotz4t0HowIGQ1rq7n7ay38ofK5vQnAHLUzseNu7qoj2A";

const valueProps = [
  { icon: Grip, label: "Personalized Training Plans", iconClass: "text-primary" },
  { icon: Pulse, label: "Progress Tracking Dashboard", iconClass: "text-secondary" },
  { icon: Comment, label: "Direct Trainer Messaging", iconClass: "text-primary-fixed" },
];

export default function RegisterBrandSection() {
  return (
    <section className="lg:col-span-5 relative min-h-[500px] lg:min-h-full flex flex-col justify-end p-10 lg:p-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMAGE}
          alt="Athlete focus background"
          fill
          className="object-cover object-top contrast-[1.05] saturate-[1.1] grayscale-[0.1]"
          priority
          sizes="(max-width: 1024px) 100vw, 42vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f2e] via-[#1a0f2e]/70 to-primary-container/20" />
        <div className="absolute inset-0 bg-primary-container/15 mix-blend-overlay" />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-3">
          <Image
            src={LOGO_IMAGE}
            alt="VIGOR logo"
            width={48}
            height={48}
            className="w-12 h-12"
          />
          <Link
            href="/"
            className="font-anybody text-headline-md font-black tracking-tighter italic text-primary uppercase"
          >
            VIGOR
          </Link>
        </div>

        <div className="space-y-4">
          <h1 className="font-anybody text-display-lg italic leading-tight text-white">
            Start Your <span className="auth-gradient-text">Journey</span> Today
          </h1>
          <p className="font-hanken text-body-lg text-on-surface-variant max-w-md">
            Create your free account and unlock access to world-class workouts,
            nutrition guidance, and a thriving athlete community.
          </p>
        </div>

        <div className="space-y-4">
          {valueProps.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 p-4 rounded-xl glass-panel snappy-transition hover:translate-x-2"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center">
                <Icon icon={item.icon} className={item.iconClass} size={22} />
              </div>
              <span className="font-geist-label text-label-bold text-on-surface">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-primary-container/20">
          <p className="font-geist-label text-label-sm text-on-surface-variant/60">
            © 2024 VIGOR Performance. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
