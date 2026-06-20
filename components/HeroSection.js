import Image from "next/image";
import { Button } from "@heroui/react";
import { Thunderbolt, HeartFill, Flame } from "@gravity-ui/icons";
import Icon from "./Icon";
import NoiseBackground from "./NoiseBackground";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida/AP1WRLtCJNd7GGrZLAAM1Rl2NJf6X5sYijONIH94EItgwomRJU0NZhimF3Ghp-uURYwM7c0TMXr5543_WnhEAxKBzZDDwPN9AzkDL4Om-n1mHl5gB4w3diT_1yZiKZuoovGaOQo1pBQg2mnQCe9eJTGAsu9WwliavpvJl6rVISYTQhDrnU5TXTLeLjI4d9R04s0195ky9wMIA-LYNrq63370ug59nC-smrdSYMwvYsKw89BNFb12HXRJdUkC8_0";

export default function HeroSection() {
  return (
    <main className="relative pt-24 overflow-hidden">
      <NoiseBackground />

      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop min-h-[85vh] flex flex-col md:flex-row items-center gap-12 py-20 relative z-10">
        <div className="w-full md:w-5/12 text-left">
          <h1 className="font-anybody text-[8vw] md:text-display-xl leading-none italic font-black flex flex-col">
            <span className="text-on-surface">FORGE</span>
            <span className="text-on-surface">YOUR</span>
            <span className="glow-stroke uppercase">STRONGEST</span>
            <span className="text-on-surface">SELF</span>
          </h1>
          <p className="mt-8 font-hanken text-body-lg text-on-surface-variant max-w-md">
            Elite-level biomechanics tracking meets world-class coaching. Unlock
            the potential of your physiological data in real-time.
          </p>
          <div className="mt-12 flex flex-wrap gap-6">
            <Button className="bg-primary px-10 py-5 h-auto rounded-xl text-on-primary font-anybody text-label-bold uppercase tracking-tighter hover:scale-105 transition-all group">
              START TRAINING
              <Icon
                icon={Thunderbolt}
                className="group-hover:rotate-12 transition-transform"
                size={20}
              />
            </Button>
            <Button
              variant="secondary"
              className="border border-white/10 px-10 py-5 h-auto rounded-xl text-on-surface font-anybody text-label-bold uppercase tracking-tighter backdrop-blur-md hover:bg-white/5 bg-transparent"
            >
              VIEW PROGRAMS
            </Button>
          </div>
        </div>

        <div className="w-full md:w-7/12 relative">
          <div className="relative z-10 p-4 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-2xl animate-pulse-accent">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10]">
              <Image
                src={HERO_IMAGE}
                alt="Athlete training with biometric tracking"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-3">
                  <Icon icon={HeartFill} className="text-secondary" size={16} />
                  <div>
                    <p className="text-[10px] font-geist-label text-label-sm text-on-surface-variant uppercase">
                      Heart Rate
                    </p>
                    <p className="text-xl font-anybody font-bold text-secondary">
                      164 <span className="text-xs">BPM</span>
                    </p>
                  </div>
                </div>
                <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-3">
                  <Icon icon={Flame} className="text-primary" size={16} />
                  <div>
                    <p className="text-[10px] font-geist-label text-label-sm text-on-surface-variant uppercase">
                      Active Burn
                    </p>
                    <p className="text-xl font-anybody font-bold text-primary">
                      842 <span className="text-xs">KCAL</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="scanline-texture absolute inset-0 opacity-20" />
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />
        </div>
      </section>
    </main>
  );
}
