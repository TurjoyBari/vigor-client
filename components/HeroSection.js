"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import {
  Thunderbolt,
  HeartFill,
  Flame,
  Cup,
  Persons,
  Grip,
} from "@gravity-ui/icons";
import Icon from "./Icon";
import { HERO_IMAGE } from "@/lib/constants/images";

const STATS = [
  { value: "12K+", label: "Active Athletes" },
  { value: "500+", label: "Expert Classes" },
  { value: "98%", label: "Goal Success" },
];

const FLOAT_STATS = [
  {
    icon: HeartFill,
    label: "Heart Rate",
    value: "164",
    unit: "BPM",
    color: "text-secondary",
    glow: "shadow-[0_0_20px_rgba(76,215,246,0.35)]",
    delay: 0.5,
  },
  {
    icon: Flame,
    label: "Active Burn",
    value: "842",
    unit: "KCAL",
    color: "text-primary",
    glow: "shadow-[0_0_20px_rgba(210,187,255,0.35)]",
    delay: 0.7,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

export default function HeroSection() {
  return (
    <main className="relative min-h-screen overflow-hidden hero-mesh-bg">
      {/* Ambient layers */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="hero-orb hero-orb-purple" />
        <div className="hero-orb hero-orb-cyan" />
        <div className="hero-grid-overlay" />
        <div className="noise-bg absolute inset-0" />
      </div>

      <section className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-28 md:pt-32 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center min-h-[calc(100vh-8rem)]">
          {/* Copy */}
          <div className="lg:col-span-5 text-left">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary-container/30 bg-primary-container/10 px-4 py-2 mb-6 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
              </span>
              <span className="font-geist-label text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
                Elite Performance Platform
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="font-anybody leading-[0.92] italic font-black"
            >
              <span className="block text-[clamp(2.8rem,9vw,5.5rem)] text-on-surface tracking-tighter">
                FORGE YOUR
              </span>
              <span className="block text-[clamp(3.2rem,11vw,6.5rem)] hero-gradient-text tracking-tighter uppercase">
                Strongest
              </span>
              <span className="block text-[clamp(2.8rem,9vw,5.5rem)] text-on-surface tracking-tighter">
                SELF
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mt-6 md:mt-8 font-hanken text-body-lg text-on-surface-variant max-w-lg leading-relaxed"
            >
              Elite biomechanics tracking meets world-class coaching. Train smarter,
              recover faster, and unlock real-time performance insights built for
              serious athletes.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-8 md:mt-10 flex flex-col sm:flex-row flex-wrap gap-4"
            >
              <Link href="/register">
                <Button className="w-full sm:w-auto bg-primary-container hover:brightness-110 px-8 md:px-10 py-5 h-auto rounded-xl text-on-primary-container font-anybody text-label-bold uppercase tracking-widest shadow-[0_0_32px_rgba(124,58,237,0.45)] hover:scale-[1.03] active:scale-[0.98] transition-all group">
                  Start Training
                  <Icon
                    icon={Thunderbolt}
                    className="group-hover:rotate-12 transition-transform"
                    size={20}
                  />
                </Button>
              </Link>
              <Link href="/classes">
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto border border-white/15 px-8 md:px-10 py-5 h-auto rounded-xl text-on-surface font-anybody text-label-bold uppercase tracking-widest backdrop-blur-md hover:bg-white/8 bg-white/5 hover:border-secondary/40 transition-all"
                >
                  View Programs
                </Button>
              </Link>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.55, delay: 0.32 }}
              className="mt-10 grid grid-cols-3 gap-3 md:gap-4 max-w-md"
            >
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-3 py-4 text-center hover:border-primary-container/30 transition-colors"
                >
                  <p className="font-anybody text-xl md:text-2xl font-black text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-geist-label text-[10px] md:text-label-sm uppercase tracking-wider text-on-surface-variant">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex justify-center lg:justify-end"
          >
            <div className="hero-image-shell relative w-full max-w-[min(100%,440px)] sm:max-w-[480px] lg:max-w-[540px]">
              <div
                className="hero-image-glow pointer-events-none"
                aria-hidden="true"
              />

              <div className="hero-image-frame relative z-10">
                <div className="hero-image-inner relative overflow-hidden bg-surface-container">
                  <Image
                    src={HERO_IMAGE}
                    alt="Athlete performing pull-ups showing muscular strength"
                    fill
                    className="object-cover object-top contrast-[1.08] saturate-[1.12]"
                    priority
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 540px"
                  />

                  {/* Cinematic overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/25 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0b1120]/35 via-transparent to-transparent" />
                  <div className="scanline-texture absolute inset-0 opacity-[0.1]" />

                  {/* Floating live stats */}
                  <div className="absolute top-4 left-4 right-4 sm:top-5 sm:left-5 sm:right-5 flex flex-col gap-3">
                    {FLOAT_STATS.map((item) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: item.delay, duration: 0.45 }}
                        className={`glass-card px-4 py-3 rounded-xl flex items-center gap-3 w-fit max-w-full ${item.glow}`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                          <Icon icon={item.icon} className={item.color} size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-geist-label uppercase tracking-widest text-on-surface-variant">
                            {item.label}
                          </p>
                          <p className={`text-xl font-anybody font-bold ${item.color}`}>
                            {item.value}{" "}
                            <span className="text-xs opacity-80">{item.unit}</span>
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bottom feature strip */}
                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 md:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0b1120]/80 backdrop-blur-xl px-3 py-3 sm:px-4 md:px-5 md:py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container/25">
                          <Icon icon={Cup} className="text-primary" size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-geist-label text-label-sm uppercase tracking-wider text-on-surface-variant">
                            Top Rated
                          </p>
                          <p className="font-anybody font-bold text-white text-sm md:text-base truncate">
                            #1 Fitness Platform
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 text-on-surface-variant">
                        <span className="flex items-center gap-1.5 text-xs font-geist-label whitespace-nowrap">
                          <Icon icon={Persons} size={14} className="text-secondary" />
                          12K+ members
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-geist-label whitespace-nowrap">
                          <Icon icon={Grip} size={14} className="text-primary" />
                          500+ classes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="hero-image-ring pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
