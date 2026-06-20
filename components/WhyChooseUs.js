import { GraduationCap, Pulse, Persons } from "@gravity-ui/icons";
import Icon from "./Icon";
import ScrollReveal from "./ScrollReveal";

const advantages = [
  {
    icon: GraduationCap,
    title: "EXPERT COACHES",
    description:
      "Direct access to Olympic-level trainers and sports scientists who specialize in peak human performance and physiological adaptation.",
    highlight: false,
  },
  {
    icon: Pulse,
    title: "DATA-DRIVEN RESULTS",
    description:
      "Our proprietary AI engine analyzes over 50 biomarkers in real-time, adjusting your training intensity to prevent injury and maximize gains.",
    highlight: true,
  },
  {
    icon: Persons,
    title: "ELITE COMMUNITY",
    description:
      "Join a global collective of over 150k high-performers, sharing intelligence, competing in live challenges, and pushing human limits.",
    highlight: false,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-surface-container-lowest py-section-gap relative overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <h2 className="font-anybody text-headline-lg font-black italic text-on-surface uppercase mb-4">
            THE VIGOR ADVANTAGE
          </h2>
          <p className="text-on-surface-variant font-hanken text-body-lg max-w-2xl mx-auto">
            Engineered for those who refuse to settle for mediocrity. Our
            ecosystem is built on three pillars of performance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {advantages.map((item) => (
            <ScrollReveal
              key={item.title}
              className={`p-10 rounded-3xl group border-white/5 ${
                item.highlight
                  ? "border-primary/20 shadow-xl shadow-primary/5"
                  : ""
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${
                  item.highlight ? "bg-primary/20" : "bg-primary/10"
                }`}
              >
                <Icon icon={item.icon} className="text-primary" size={36} />
              </div>
              <h3
                className={`font-anybody text-headline-md font-bold mb-4 ${
                  item.highlight ? "text-primary" : "text-on-surface"
                }`}
              >
                {item.title}
              </h3>
              <p className="text-on-surface-variant font-hanken text-body-md leading-relaxed">
                {item.description}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
