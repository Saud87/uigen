import { useState } from 'react';

const testimonials = [
  {
    quote: "This tool completely changed how our team ships product. We went from weeks of design back-and-forth to shipping in hours.",
    name: "Mara Schultz",
    role: "Head of Product",
    company: "Fieldwork Labs",
    avatar: "MS",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    quote: "I've tried every prototyping tool out there. Nothing comes close to the speed and quality of what this produces.",
    name: "James Okafor",
    role: "Senior Engineer",
    company: "Meridian",
    avatar: "JO",
    color: "from-cyan-500 to-blue-600",
  },
  {
    quote: "Our designers and engineers finally speak the same language. The output is production-ready from day one.",
    name: "Priya Nair",
    role: "Design Lead",
    company: "Solstice",
    avatar: "PN",
    color: "from-amber-400 to-orange-500",
  },
];

export default function TestimonialCard() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-8">
      <div className="w-full max-w-xl">

        {/* Card */}
        <div className="relative rounded-2xl overflow-hidden">
          {/* Gradient top bar */}
          <div className={`h-1 w-full bg-gradient-to-r ${t.color}`} />

          <div className="bg-[#13131a] border border-white/[0.06] px-10 py-10">
            {/* Quote mark */}
            <div className="text-7xl font-black leading-none text-white/[0.06] select-none mb-2">
              "
            </div>

            {/* Quote text */}
            <p className="text-white/80 text-lg leading-relaxed font-light tracking-wide mb-10">
              {t.quote}
            </p>

            {/* Author row */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold tracking-widest flex-shrink-0`}>
                {t.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm tracking-tight">{t.name}</div>
                <div className="text-white/40 text-xs mt-0.5 truncate">
                  {t.role} · {t.company}
                </div>
              </div>

              {/* Dots */}
              <div className="flex gap-2 flex-shrink-0">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === active
                        ? `w-6 h-2 bg-gradient-to-r ${t.color}`
                        : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ambient glow beneath card */}
        <div className={`h-px w-3/4 mx-auto bg-gradient-to-r ${t.color} opacity-30 blur-sm mt-0`} />

      </div>
    </div>
  );
}
