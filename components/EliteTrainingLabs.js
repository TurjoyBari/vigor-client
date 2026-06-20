import Image from "next/image";
import { Button } from "@heroui/react";
import {
  ArrowLeft,
  ArrowRight,
  ChartLineArrowUp,
  Grip,
  Person,
} from "@gravity-ui/icons";
import Icon from "./Icon";
import ScrollReveal from "./ScrollReveal";

const dossiers = [
  {
    id: "0192",
    title: "NEURAL\nREACTIVE HIIT",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ3VcelnXXNJMojlfBrpR4rB5dvrviELbUqtQVWvGI3RqDqXnZEOd3B--JwMwfxLUBTv1_3l2mxLNQ6bi0Zc2KlUgPsEzBvbw29HA5NcasSBL_VgGO87z9P0jPPuWWW3M7zCzwtVqIrF-fa-ryqLtfzToL6xYCcvjL-SRfjtdoRZcT9sMDoxEca7FuKstY7Fhng_Axd1UgYmjUTtWSYCKyBt9U8obmsnvvNlMUUOF1XsZG_eUxFKowhaj0WQIqsF-v0zZiK31DHZU",
    duration: "45 MIN",
    level: "ELITE",
    instructor: "VANEGAS",
    icon: ChartLineArrowUp,
  },
  {
    id: "0421",
    title: "KINETIC\nSTRENGTH MAX",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXynfw7OEy1_JpFPmNCc2KATfL268Ijpl1piMBALOdZhxclGZNA0iL1C6ehdvdbdyFlLntKzn99PK-UoSaFDvhFtp_ZTtbm5UyY0Aw_lh4FAKSlIKrPH6piIxOvqd4OMqekITZkFsjBucblVWk4izF9IVADmYUaYasTwiKt60Pm5Scf6CzpZulNiO7CN49qWKCF3BU51yrwN9qVqODRPvExLY2ezZlwGVkD4RxW9ULC625U3-XA3BnOPF4hZhAvlNMETBB3_C7CeU",
    duration: "60 MIN",
    level: "PRO",
    instructor: "DR. CHEN",
    icon: Grip,
  },
  {
    id: "0811",
    title: "HYBRID\nMOBILITY X",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCHu9HexAh2riwk_nydMTdf6r7hHpejI86Obnf0-6mDBUioSVxfRwcfquBQoD3Vexz5GAW34cl1yqgXBIsSdTtyqhzEJ1X5KCsRE6hclgBswTV6OFT6JJzFEJbENy6iiF9QdS4utK2-n3_hWkU7LwTpODbsJtXT-2fpHBT0XtEbji80trHCgklL15B6iUe4MtV_oaNXL5aaIvVv84SrhHrd3Asbj9UwPy9R6WIsWpqGlyk4ee4dYvWB5Moa31XREizwhzSgSL7ciK0",
    duration: "30 MIN",
    level: "ALL",
    instructor: "SARAH J.",
    icon: Person,
  },
];

export default function EliteTrainingLabs() {
  return (
    <section className="bg-surface py-section-gap relative">
      <div className="slant-separator absolute top-0 left-0 w-full z-0" />
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-anybody text-headline-lg font-black italic text-primary uppercase">
              Elite Training Labs
            </h2>
            <p className="text-on-surface-variant font-hanken text-body-md mt-2">
              Dossier-style curriculum curated for professional athletes.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              isIconOnly
              variant="secondary"
              className="rounded-full border border-white/10 bg-transparent hover:bg-white/5 min-w-12 h-12"
              aria-label="Previous"
            >
              <Icon icon={ArrowLeft} size={20} />
            </Button>
            <Button
              isIconOnly
              variant="secondary"
              className="rounded-full border border-white/10 bg-transparent hover:bg-white/5 min-w-12 h-12"
              aria-label="Next"
            >
              <Icon icon={ArrowRight} size={20} />
            </Button>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto custom-scrollbar pb-12 snap-x">
          {dossiers.map((dossier) => (
            <ScrollReveal
              key={dossier.id}
              className="min-w-[320px] md:min-w-[420px] rounded-2xl overflow-hidden snap-start flex flex-col"
            >
              <div className="h-56 relative group overflow-hidden">
                <Image
                  src={dossier.image}
                  alt={dossier.title.replace("\n", " ")}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="420px"
                />
                <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-md px-3 py-1 rounded text-[10px] font-geist-label font-bold tracking-widest text-on-primary uppercase">
                  DOSSIER #{dossier.id}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-anybody text-headline-md font-bold text-on-surface leading-tight whitespace-pre-line">
                    {dossier.title}
                  </h3>
                  <Icon icon={dossier.icon} className="text-secondary shrink-0" size={24} />
                </div>
                <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                  <div>
                    <p className="text-[10px] font-geist-label text-label-sm text-on-surface-variant uppercase">
                      Duration
                    </p>
                    <p className="font-anybody text-label-bold text-on-surface">
                      {dossier.duration}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-geist-label text-label-sm text-on-surface-variant uppercase">
                      Level
                    </p>
                    <p className="font-anybody text-label-bold text-secondary">
                      {dossier.level}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-geist-label text-label-sm text-on-surface-variant uppercase">
                      Instructor
                    </p>
                    <p className="font-anybody text-label-bold text-on-surface">
                      {dossier.instructor}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
