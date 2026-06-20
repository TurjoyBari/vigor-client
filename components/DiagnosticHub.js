"use client";

import { useMemo, useState } from "react";
import { Button, Input } from "@heroui/react";
import { ArrowUpRightFromSquare } from "@gravity-ui/icons";
import Icon from "./Icon";
import ScrollReveal from "./ScrollReveal";

function getBmiCategory(bmi) {
  if (bmi < 18.5) return { label: "Underweight", index: 0 };
  if (bmi < 25) return { label: "Normal", index: 1 };
  if (bmi < 30) return { label: "Overweight", index: 2 };
  return { label: "Obese", index: 3 };
}

const categories = ["Underweight", "Normal", "Overweight", "Obese"];

export default function DiagnosticHub() {
  const [height, setHeight] = useState(180);
  const [weight, setWeight] = useState(85);

  const bmi = useMemo(() => {
    const h = Number(height);
    const w = Number(weight);
    if (!h || !w) return 0;
    return Number((w / (h / 100) ** 2).toFixed(1));
  }, [height, weight]);

  const category = getBmiCategory(bmi);
  const barWidth = Math.min(Math.max((bmi / 40) * 100, 5), 100);

  return (
    <section className="relative bg-surface-container-low py-section-gap overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent blur-[120px]" />
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 text-center">
        <ScrollReveal className="max-w-2xl mx-auto p-8 md:p-12 rounded-3xl border-2 border-white/5 shadow-inner">
          <h2 className="font-anybody text-headline-lg font-black italic text-on-surface mb-4 uppercase tracking-tighter">
            Diagnostic Hub
          </h2>
          <p className="text-on-surface-variant mb-12 font-hanken text-body-md">
            Calculate your physiological baseline. Integrated labs for BMI,
            TDEE, and VO2 Max simulation.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="text-left">
              <label className="block text-xs font-geist-label text-label-bold text-on-surface-variant uppercase mb-2 tracking-widest">
                Height (CM)
              </label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-surface-container border border-white/10 rounded-xl px-6 py-4 font-anybody text-headline-md text-primary focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="text-left">
              <label className="block text-xs font-geist-label text-label-bold text-on-surface-variant uppercase mb-2 tracking-widest">
                Weight (KG)
              </label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-surface-container border border-white/10 rounded-xl px-6 py-4 font-anybody text-headline-md text-primary focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="relative h-16 bg-surface-container-high rounded-full overflow-hidden border border-white/5 mb-6">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary relative flex items-center justify-end px-6 shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-500"
              style={{ width: `${barWidth}%` }}
            >
              <span className="font-anybody font-black text-2xl italic text-on-primary">
                {bmi}
              </span>
            </div>
            <div className="absolute inset-0 scanline-texture opacity-30" />
          </div>

          <div className="flex justify-between text-[10px] font-geist-label text-label-sm text-on-surface-variant uppercase tracking-widest px-4">
            {categories.map((cat, i) => (
              <span
                key={cat}
                className={i === category.index ? "text-secondary font-bold" : ""}
              >
                {cat}
              </span>
            ))}
          </div>

          <Button
            variant="secondary"
            className="mt-12 w-full bg-white/5 hover:bg-white/10 text-on-surface py-5 h-auto rounded-2xl border border-white/10 font-geist-label text-label-bold uppercase tracking-[0.2em] group"
          >
            FULL LAB REPORT
            <Icon
              icon={ArrowUpRightFromSquare}
              className="group-hover:rotate-45 transition-transform"
              size={16}
            />
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
