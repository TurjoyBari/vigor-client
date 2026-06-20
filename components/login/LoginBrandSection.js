import Image from "next/image";
import Link from "next/link";
import { Cup, Pulse, Persons } from "@gravity-ui/icons";
import Icon from "@/components/Icon";

const LOGIN_BG_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD1zU5C8edv4myHmq_UyvxVwCQaiPCJKVdPFCUoPKwKomMvyBCubvzqDqA5AvdOjgX_oQzlSH-lnQqJ3ypclxuhlrd82rp5_CZNemuwT7CPKfHVx9DT5USOxry9oYHq6HNUISbJHTeSwyO0SjNkyy79VjqF26_SUpzbDKHaQ2LYslgb7Al_zabP9cYeb-YJYw0GLe1XJo2QsFDFK8R90vsbPqxH4tBqxh1EknsFVHBWd44BduTWjqG0GuGdQvi954yEhIT-qmBiMcg";

const LOGO_IMAGE =
  "https://lh3.googleusercontent.com/aida/AP1WRLsa8lsZMsP7-3wJ5w20PwFIaHHIGF2OFs-itquo_S9XLclfKE7rP9-4b1t4-4IiW4PAETKHAWi-L-9YpWO9vQATetII1uuQV6wXmj5TEoerRpse8iIhcoxdy2WUX7adf_gnp93q_E9AwwN08gweI5gaOauskdSmIPSf9W9c_W9btdUOsO2iC-GgrL2RyZ6kl_Rl5hmpQLgGUHotz4t0HowIGQ1rq7n7ay38ofK5vQnAHLUzseNu7qoj2A";

const features = [
  { icon: Cup, iconClass: "text-primary", label: "500+ Expert-Curated Workouts" },
  { icon: Pulse, iconClass: "text-secondary", label: "Real-Time Progress Analytics" },
  { icon: Persons, iconClass: "text-primary-fixed", label: "Elite Trainer Community" },
];

export default function LoginBrandSection() {
  return (
    <div className="relative hidden md:flex flex-col justify-between p-12 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={LOGIN_BG_IMAGE}
          alt="Athlete performing a heavy deadlift in a premium gym"
          fill
          className="object-cover scale-105"
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1a0f2e] via-[#1a0f2e]/85 to-primary-container/10" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <Image
            src={LOGO_IMAGE}
            alt="VIGOR"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <Link
            href="/"
            className="font-anybody text-headline-md font-extrabold tracking-tighter text-primary italic"
          >
            VIGOR
          </Link>
        </div>

        <h1 className="font-anybody text-display-lg font-black leading-tight mb-6">
          Forge Your <br />
          <span className="auth-gradient-text">Strongest Self</span>
        </h1>

        <p className="font-hanken text-body-lg text-on-surface-variant max-w-md mb-8">
          Join thousands of athletes who train smarter, track harder, and push
          further — every single day.
        </p>

        <ul className="space-y-4">
          {features.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 glass-panel p-3 rounded-xl snappy-transition hover:border-secondary/30"
            >
              <Icon icon={item.icon} className={item.iconClass} size={22} />
              <span className="font-geist-label text-label-bold text-on-surface">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 mt-auto pt-12 border-t border-primary-container/20">
        <p className="font-geist-label text-label-sm text-on-surface-variant/60">
          © 2024 VIGOR PERFORMANCE. ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  );
}
