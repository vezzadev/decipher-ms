import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BriefingForm from "@/components/BriefingForm";

const services = [
  {
    n: "01",
    name: "Expert Call",
    cadence: "1 hour",
    price: "$1,000",
    desc: "Live call with a Microsoft insider plus a written summary you can forward.",
  },
  {
    n: "02",
    name: "Second Opinion",
    cadence: "Written review",
    price: "$2,000",
    desc: "Independent assessment of a Microsoft technology bet you're about to make.",
  },
  {
    n: "03",
    name: "Technical Brief",
    cadence: "In-depth report",
    price: "$3,500",
    desc: "Long-form brief on a Microsoft cloud, AI, or security decision. $2,500 if publishable.",
  },
];

const topics = [
  "Securing Azure ML for AI/ML workloads",
  "Least-privilege Azure RBAC at production scale",
  "SOC 2 readiness for Azure and Azure ML",
  "Low-privilege access patterns for data scientists",
  "GitHub Copilot rollout: governance and controls",
  "Migrating Dynamics 365 RSO to multi-tenant",
  "Deploying Dynamics 365 to Azure Government (GCC)",
  "Resource scheduling optimization at scale",
  "Microsoft Purview integration for compliance",
  "Network isolation for M365 and Copilot data",
];

const why = [
  {
    n: "01",
    title: ["Insider", "Perspective"],
    body:
      "Led by a former Microsoft engineer from the M365 Substrate AI Platform — the team that builds the AI/ML and security platforms behind Microsoft 365.",
  },
  {
    n: "02",
    title: ["Vendor", "Independence"],
    body:
      "We don't resell, partner, or take referral fees. Our only motivation is giving you the right technical answer.",
  },
  {
    n: "03",
    title: ["Fixed Price.", "Fast."],
    body:
      "No hourly meters, no scope creep. You know the price before you start. Most engagements close in under a week.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/20">
      <Helmet>
        <title>decipher.ms — Independent Microsoft advisory</title>
        <meta name="description" content="Independent Microsoft advisory by a former Principal Engineer. Straight answers on cloud security, AI/ML platform architecture, and Dynamics engineering — vendor-neutral." />
        <link rel="canonical" href="https://decipher.ms/" />
        <meta property="og:title" content="decipher.ms — Independent Microsoft advisory" />
        <meta property="og:description" content="Straight answers on Azure security, AI/ML platforms, and Dynamics engineering from a former Microsoft Principal Engineer." />
        <meta property="og:url" content="https://decipher.ms/" />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* NAV */}
      <nav className="border-b-4 border-foreground px-6 py-6 flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur z-50">
        <a
          href="#"
          className="font-serif text-3xl md:text-4xl font-black tracking-tighter uppercase italic"
        >
          decipher<span className="text-accent pl-2">.ms</span>
        </a>
        <div className="hidden md:flex gap-8 text-[11px] font-extrabold uppercase tracking-[0.2em]">
          <a href="#services" className="hover:text-accent transition-colors">Services</a>
          <a href="#approach" className="hover:text-accent transition-colors">Approach</a>
          <a href="#topics" className="hover:text-accent transition-colors">Topics</a>
          <a href="/about" className="hover:text-accent transition-colors">About</a>
          <a href="#briefing" className="hover:text-accent transition-colors">Briefing</a>
        </div>
      </nav>

      <main>

      {/* HERO */}
      <header className="px-6 py-8 max-w-[1600px] mx-auto min-h-[calc(100svh-92px)] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          <div className="border-l-8 border-foreground pl-6 md:pl-10 min-w-0">
            <span className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-accent mb-8">
              Independent Microsoft advisory
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl xl:text-7xl 2xl:text-8xl font-black leading-[0.85] tracking-tighter mb-10 break-words lg:text-7xl">
              DECODE
              <br />
              <span className="text-accent italic">MICROSOFT.</span>
              <br />
              DECIDE.
            </h1>
            <p className="text-xl md:text-2xl font-semibold max-w-lg leading-tight tracking-tight text-foreground/80">
              Microsoft's cloud, AI, and security stack is a moving target. We give you clear,
              unbiased answers — from a former Microsoft engineer who spent years inside,
              building the platforms your teams now run on.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="p-8 md:p-10 bg-foreground text-background flex flex-col justify-between gap-6">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-60">
                A recent question
              </span>
              <blockquote className="font-serif italic font-black leading-[0.95] text-3xl md:text-4xl xl:text-5xl border-l-4 border-accent pl-5">
                "Our SOC 2 auditors are flagging Azure RBAC on production.
                Forty-seven services, no clear least-privilege model. Where do we start?"
              </blockquote>
              <div className="grid grid-cols-3 gap-4 text-[10px] uppercase tracking-widest">
                <div>
                  <p className="opacity-50">Turnaround</p>
                  <p className="font-black mt-1">5 days</p>
                </div>
                <div>
                  <p className="opacity-50">Deliverable</p>
                  <p className="font-black mt-1">12-page brief</p>
                </div>
                <div>
                  <p className="opacity-50">Vendor fees</p>
                  <p className="font-black mt-1">$0</p>
                </div>
              </div>
            </div>
            <a
              href="#briefing"
              className="group w-full py-6 md:py-7 bg-accent text-background text-lg md:text-xl font-black uppercase tracking-widest hover:bg-foreground transition-all flex justify-between px-8 md:px-10 items-center"
            >
              <span>Request Briefing</span>
              <span className="transition-transform group-hover:translate-x-2">→</span>
            </a>
          </div>
        </div>
      </header>

      {/* PROBLEM */}
      <section className="border-t-4 border-foreground px-6 py-24 md:py-32">
        <div className="max-w-[1600px] mx-auto grid md:grid-cols-[1fr_1.5fr] gap-12 md:gap-20 items-start">
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
            The wrong Microsoft call is{" "}
            <span className="text-accent italic">expensive</span>.
          </h2>
          <div className="space-y-6 text-lg md:text-xl leading-relaxed text-foreground/70 font-medium">
            <p>
              Azure, Azure ML, Copilot, Purview, Defender, Dynamics. Most teams learn this surface
              from docs, marketing pages, and conferences. The folks who actually build these
              platforms work inside Microsoft — and their answers stay there.
            </p>
            <p>
              You end up with architectures that don't quite hold up to audit, AI rollouts that
              surface compliance fires, or migrations that take twice as long as they should.
            </p>
            <p className="text-foreground font-black font-serif italic text-2xl md:text-3xl">
              decipher.ms exists to give you a straight answer.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="border-t-4 border-foreground">
        <div className="grid md:grid-cols-3">
          {services.map((s, i) => (
            <div
              key={s.name}
              className={`p-10 md:p-12 border-b-4 md:border-b-0 md:[&:not(:last-child)]:border-r-2 border-foreground group ${
                i % 2 === 0 ? "hover:bg-accent" : "hover:bg-foreground"
              } hover:text-background transition-colors duration-300 flex flex-col`}
            >
              <span className="text-5xl md:text-6xl font-serif font-black italic block mb-10">
                {s.n}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-3">
                {s.cadence}
              </span>
              <h3 className="font-serif text-3xl md:text-4xl font-black uppercase leading-none mb-6">
                {s.name}
              </h3>
              <p className="font-medium leading-snug mb-10 opacity-80 flex-1">{s.desc}</p>
              <p className="font-serif font-black italic text-5xl md:text-6xl tracking-tighter">
                {s.price}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TOPICS */}
      <section id="topics" className="border-t-4 border-foreground bg-secondary/40 px-6 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-14">
            <span className="font-serif italic text-accent text-xl md:text-2xl block mb-3">
              Inquiry Log
            </span>
            <h2 className="font-serif text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              Recent questions
              <br />
              on the desk.
            </h2>
            <p className="mt-6 text-foreground/60 text-lg max-w-xl">
              A snapshot of what teams are wrestling with right now.
            </p>
          </div>
          <ul className="flex flex-wrap gap-3">
            {topics.map((t) => (
              <li
                key={t}
                className="border-2 border-foreground bg-background px-5 py-3 text-sm md:text-base font-bold font-serif hover:bg-accent hover:text-background hover:border-accent transition-colors cursor-default"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* APPROACH / WHY */}
      <section id="approach" className="border-t-4 border-foreground bg-foreground text-background px-6 py-24 md:py-32">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6 border-b-2 border-background/20 pb-8">
            <h2 className="font-serif text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              Why decipher
            </h2>
            <span className="font-serif italic text-xl md:text-2xl text-accent">
              Three commitments. No exceptions.
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-background/20">
            {why.map((w) => (
              <div key={w.n} className="bg-foreground p-10 md:p-12">
                <span className="font-serif italic text-3xl text-accent block mb-8">{w.n}.</span>
                <h3 className="font-serif text-3xl md:text-4xl font-black uppercase leading-none mb-6">
                  {w.title[0]}
                  <br />
                  {w.title[1]}
                </h3>
                <p className="text-background/70 leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-t-4 border-foreground px-6 py-24 md:py-32">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
          <Stat n="5d" l="Median turnaround" />
          <Stat n="$0" l="Vendor referral fees" />
          <Stat n="11yr" l="Inside Microsoft" />
          <Stat n="1" l="Former Microsoft engineer" />
        </div>
      </section>

      {/* FOUNDER TEASER */}
      <section className="border-t-4 border-foreground px-6 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">
          <div>
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6">
              About the founder
            </span>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              Pedro Paulo
              <br />
              <span className="text-accent italic">Vezza Campos</span>
            </h2>
          </div>
          <div className="space-y-6 text-lg md:text-xl leading-relaxed text-foreground/70 font-medium">
            <p>
              Former Microsoft Principal Software Engineer and Tech Lead on the M365
              Substrate AI Platform — the team behind Microsoft's AI/ML capabilities.
            </p>
            <p>
              I built decipher.ms because the best Microsoft answers shouldn't be locked
              inside Microsoft.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] hover:text-accent transition-colors mt-4"
            >
              Read full bio <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* BRIEFING FORM */}
      <section
        id="briefing"
        className="border-t-4 border-foreground bg-foreground text-background px-6 py-24 md:py-32"
      >
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24">
          <div className="border-l-8 border-accent pl-8">
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-8">
              Request a Briefing
            </span>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-black italic leading-[0.95] tracking-tighter mb-8">
              Got a Microsoft
              <br />
              question?
            </h2>
            <p className="text-background/60 text-lg max-w-md">
              Tell us the decision you're working on. You'll hear back from a former Microsoft
              engineer — no sales call, no gatekeeping, no vendor agenda.
            </p>
          </div>
          <BriefingForm />
        </div>
      </section>

      </main>

      {/* FOOTER */}
      <footer className="p-6">
        <div className="bg-background border-t-4 border-foreground pt-12 md:pt-16">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 mb-16">
            <div>
              <p className="font-serif italic text-3xl md:text-4xl font-black tracking-tighter leading-tight max-w-md">
                Independent Microsoft decision support.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12">
              <FooterCol
                title="Services"
                items={["Expert Call", "Second Opinion", "Technical Brief"]}
              />
              <FooterCol
                title="decipher.ms"
                items={["Approach", "About", "Contact"]}
              />
            </div>
          </div>
          <div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between gap-6 text-[10px] font-black uppercase tracking-[0.4em] opacity-50">
            <span>© 2026 Vezza LLC</span>
            <div className="flex gap-12">
              <a href="#" className="hover:text-accent">Legal</a>
              <a href="#" className="hover:text-accent">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <span className="font-serif font-black text-5xl md:text-6xl lg:text-7xl tracking-tighter block">
        {n}
      </span>
      <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-foreground/50 mt-3">
        {l}
      </p>
    </div>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6">{title}</p>
      <ul className="space-y-3 text-base font-bold">
        {items.map((i) => (
          <li key={i}>
            <a href="#" className="hover:text-accent transition-colors">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Index;
