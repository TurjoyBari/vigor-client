import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { ArrowRight } from "@gravity-ui/icons";
import Icon from "./Icon";
import ScrollReveal from "./ScrollReveal";

const NEWS_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDxH-6WcnogrH4oF6SKYIiJp5FNSw8eu7h8iLUQKj7oRN84q4OhylqKomo4_7G5BMzwA9IFjCj9aRBKVm1k6HLRqrlht8BoJuoztw8D8kiCFrthZr8ZfTfe_g4ZZqPseuQ2NSk8H5KopHlRGiwjyaPrw2SHGd3neg1RzIjOrSs1fJFLTrXnWRfRg7xpmydMkeY0lkmoODg6DssaF1zBrUSulyqOrPipwAv2zXSCwVz27sPFXUoiq6-ueXKe4yporiSXX8N9NclqjmQ";

const COACH_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBNyIa2DmdDQcJinj56M2O6Aymqg7n4LZSfHhDJQLee34htNcRIVnSPDWGFqH38S2TkjzusdaZkexdCfupbQ1v77-zojSxiwivIr2-iEqP-EdQC8oFG-VPZHzaqWo3qnO2YPaV3I-3-YA99ozX_r8_BirXIBV3x-I4ERI2gwwnYUfazIli0v9v8a9-zDKwE757dbhz0nvnB0fKT63B-srclBSR9MEZ-dzSNEanboVM94Z5Wqha6agEQQJPV7El2toLVdci_UryAJao";

export default function NeuralFeed() {
  return (
    <section className="bg-surface py-section-gap">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-6 mb-16">
          <h2 className="font-anybody text-headline-lg font-black italic text-on-surface uppercase">
            Neural Feed &amp; Community
          </h2>
          <div className="h-px flex-1 bg-white/10" />
          <Link
            href="/community"
            className="text-primary font-geist-label text-label-bold text-sm tracking-widest hover:underline uppercase"
          >
            Enter Community Hub
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ScrollReveal className="md:col-span-2 md:row-span-2 p-10 rounded-3xl flex flex-col justify-between group cursor-pointer border-primary/30 bg-primary/5">
            <div>
              <div className="flex items-center gap-3 text-primary font-geist-label text-label-sm mb-6 uppercase tracking-widest font-bold">
                <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                Live Dispatch
              </div>
              <h3 className="font-anybody text-display-lg font-bold text-on-surface leading-tight tracking-tighter mb-6 group-hover:text-primary transition-colors">
                VIGOR V3: THE FUTURE OF HRV TRACKING IS HERE
              </h3>
              <p className="text-on-surface-variant font-hanken text-body-lg">
                We&apos;ve overhauled the core engine to predict muscular fatigue
                before it happens. Experience the next evolution of performance
                monitoring.
              </p>
            </div>
            <Button
              variant="ghost"
              className="mt-12 text-primary font-geist-label text-label-bold flex items-center gap-3 group/btn uppercase tracking-widest justify-start p-0 h-auto bg-transparent"
            >
              READ DATA-LINK
              <Icon
                icon={ArrowRight}
                className="group-hover/btn:translate-x-3 transition-transform"
                size={20}
              />
            </Button>
          </ScrollReveal>

          <ScrollReveal className="p-8 rounded-3xl flex flex-col group border-white/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full border border-primary/40 p-1 relative overflow-hidden">
                <Image
                  src={COACH_AVATAR}
                  alt="Coach Marcus"
                  fill
                  className="rounded-full object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <p className="text-sm font-geist-label text-label-bold text-on-surface">
                  Coach Marcus
                </p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                  Head of Performance
                </p>
              </div>
            </div>
            <p className="text-on-surface-variant text-lg font-hanken text-body-md italic leading-relaxed">
              &ldquo;Consistency is the only variable you can truly control.
              Data just proves it. Join the ranks of the elite.&rdquo;
            </p>
          </ScrollReveal>

          <ScrollReveal className="p-6 rounded-3xl flex flex-col group border-white/5 overflow-hidden">
            <div className="relative w-full h-44 rounded-xl mb-6 overflow-hidden">
              <Image
                src={NEWS_IMAGE}
                alt="Nutrition update"
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                sizes="300px"
              />
            </div>
            <h4 className="font-anybody text-label-bold text-on-surface uppercase mb-2 tracking-widest">
              Nutrition Update
            </h4>
            <p className="text-on-surface-variant text-sm font-hanken text-body-md line-clamp-3">
              Optimizing glycogen recovery for ultra-endurance sessions using
              biometric timing protocols.
            </p>
          </ScrollReveal>

          <ScrollReveal className="md:col-span-2 p-10 rounded-3xl border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left">
              <h4 className="font-anybody text-headline-md font-bold text-on-surface uppercase mb-2">
                COMMUNITY INTEL
              </h4>
              <p className="text-on-surface-variant font-hanken text-body-md">
                Connect with 150k+ elite athletes globally and compete in
                real-time leaderboards.
              </p>
            </div>
            <Button
              variant="secondary"
              className="bg-surface-container-highest px-10 py-5 h-auto rounded-xl font-geist-label text-label-bold uppercase border border-white/10 hover:bg-primary/10 hover:border-primary whitespace-nowrap tracking-widest"
            >
              JOIN THE HUB
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
