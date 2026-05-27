import pillarBriefings from "@/assets/pillar-briefings.jpg";
import pillarAnalyst from "@/assets/pillar-analyst.jpg";
import pillarIntelligence from "@/assets/pillar-intelligence.jpg";
import analyst1 from "@/assets/analyst-1.jpg";
import analyst2 from "@/assets/analyst-2.jpg";
import analyst3 from "@/assets/analyst-3.jpg";
import analyst4 from "@/assets/analyst-4.jpg";
import analyst5 from "@/assets/analyst-5.jpg";
import analyst6 from "@/assets/analyst-6.jpg";
import BriefingForm from "@/components/BriefingForm";

const analysts = [
  { name: "Marcus Thorne", coverage: "SAP / ERP Strategy", img: analyst1 },
  { name: "Elena Vance", coverage: "Microsoft / Licensing", img: analyst2 },
  { name: "Dr. Aris Varma", coverage: "Infrastructure / Data", img: analyst3 },
  { name: "Sarah Chen", coverage: "FinOps / Cloud Cost", img: analyst4 },
  { name: "Julian Boyd", coverage: "Security / Risk", img: analyst5 },
  { name: "Naomi Reyes", coverage: "Procurement / Negotiation", img: analyst6 },
];

const inquiries = [
  {
    id: "8442",
    title: "Negotiating Oracle Java SE Universal Subscription renewal across 4,000 employee seats.",
    excerpt:
      "Client faced a 3× price increase under the new per-employee metric. We mapped three migration paths to OpenJDK plus a contractual lever based on their legacy footprint that recovered 62% of the proposed uplift.",
    analyst: "Naomi Reyes",
    role: "Principal Analyst, Procurement",
    resolved: "Resolved Oct 2025",
  },
  {
    id: "8821",
    title:
      "Mixing Enterprise Agreement and Microsoft Customer Agreement on a single Azure tenant for Copilot deployment.",
    excerpt:
      "We reconciled the seat-true-up rules across both vehicles and identified the exact billing scope boundary that lets the client run Copilot under MCA while keeping core Azure under their existing EA discount.",
    analyst: "Elena Vance",
    role: "Lead Analyst, Microsoft Licensing",
    resolved: "Resolved Nov 2025",
  },
  {
    id: "8820",
    title: "Evaluating SAP RISE migration: hidden compute overheads in the S/4HANA cloud edition.",
    excerpt:
      "Recovered three undocumented compute surcharges in the RISE pricing schedule and benchmarked them against a self-managed S/4HANA on hyperscaler — finding a 19% TCO delta the AE had not disclosed.",
    analyst: "Marcus Thorne",
    role: "Principal Analyst, ERP Strategy",
    resolved: "Resolved Jan 2026",
  },
];

const coverage = [
  { n: "01", t: "Licensing", d: "Enterprise software audits and compliance risk." },
  { n: "02", t: "Roadmaps", d: "Vendor product lifecycles and deprecation alerts." },
  { n: "03", t: "Architecture", d: "Cloud transition and hybrid stack validation." },
  { n: "04", t: "Negotiation", d: "Contract benchmarking and commercial leverage." },
  { n: "05", t: "Risk", d: "Supply chain resilience and technical debt." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/20">
      {/* NAV */}
      <nav className="border-b-4 border-foreground px-6 py-6 flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="flex items-center gap-12">
          <a
            href="#"
            className="font-serif text-3xl md:text-4xl font-black tracking-tighter uppercase italic"
          >
            decipher<span className="text-accent">.ms</span>
          </a>
          <div className="hidden md:flex gap-8 text-[11px] font-extrabold uppercase tracking-[0.2em]">
            <a href="#desk" className="hover:text-accent transition-colors">
              Desk
            </a>
            <a href="#analysts" className="hover:text-accent transition-colors">
              Analysts
            </a>
            <a href="#archive" className="hover:text-accent transition-colors">
              Archive
            </a>
            <a href="#briefing" className="hover:text-accent transition-colors">
              Briefing
            </a>
            <a href="#access" className="hover:text-accent transition-colors">
              Access
            </a>
          </div>
        </div>
        <button className="px-6 py-3 bg-foreground text-background text-xs font-black uppercase tracking-widest hover:bg-accent transition-all">
          Client Portal
        </button>
      </nav>

      {/* HERO */}
      <header className="px-6 py-20 md:py-28 max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="border-l-8 border-foreground pl-6 md:pl-10">
            <span className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-accent mb-8">
              The Research Desk · Est. 2014
            </span>
            <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl xl:text-9xl font-black leading-[0.85] tracking-tighter mb-10">
              BUILT
              <br />
              <span className="text-accent italic">FOR</span>
              <br />
              PRECISION.
            </h1>
            <p className="text-xl md:text-2xl font-semibold max-w-lg leading-tight tracking-tight text-foreground/80">
              Bypass generic research. Direct access to senior analysts on Microsoft licensing,
              cloud architecture, and contract negotiation — answered in writing, under 48 hours.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="p-10 md:p-12 bg-foreground text-background flex flex-col justify-between aspect-square">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-60">
                Current Response Latency
              </span>
              <p className="font-serif italic font-black leading-none text-7xl md:text-8xl xl:text-[10rem]">
                4.2h
              </p>
              <div className="flex justify-between items-end gap-6">
                <span className="text-[10px] uppercase tracking-widest opacity-50 max-w-[20ch]">
                  Median across last 100 briefings
                </span>
                <div className="h-1.5 flex-1 bg-accent"></div>
              </div>
            </div>
            <button className="group w-full py-7 md:py-8 bg-accent text-background text-lg md:text-xl font-black uppercase tracking-widest hover:bg-foreground transition-all flex justify-between px-8 md:px-10 items-center">
              <span>Request Briefing</span>
              <span className="transition-transform group-hover:translate-x-2">→</span>
            </button>
          </div>
        </div>
      </header>

      {/* PILLARS */}
      <section id="desk" className="border-t-4 border-foreground">
        <div className="grid md:grid-cols-3">
          <Pillar
            n="01"
            title={["Written", "Briefings"]}
            hover="hover:bg-accent"
            img={pillarBriefings}
            alt="Sample written briefing document"
          >
            Submit a specific technical question. Receive a 1,500-word memorandum with data-backed
            recommendations and contractual citations within one business day.
          </Pillar>
          <Pillar
            n="02"
            title={["Analyst", "Direct"]}
            hover="hover:bg-foreground"
            img={pillarAnalyst}
            alt="Senior analyst portrait"
          >
            Schedule a 30-minute deep dive with the principal analyst on your case. No sales reps,
            no account managers — peer-to-peer technical counsel.
          </Pillar>
          <Pillar
            n="03"
            title={["Vendor", "Intelligence"]}
            hover="hover:bg-accent"
            img={pillarIntelligence}
            alt="Vendor intelligence network"
          >
            Bi-weekly curation of vendor landscape shifts, deprecation alerts, and contract
            negotiation leverage relevant to your stack.
          </Pillar>
        </div>
      </section>

      {/* ANALYSTS */}
      <section id="analysts" className="border-t-4 border-foreground px-6 py-24 md:py-32">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6 border-b-2 border-foreground pb-8">
            <h2 className="font-serif text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              The Roster
            </h2>
            <span className="font-serif italic text-xl md:text-2xl text-accent">
              Six principals. Fifteen-year minimum.
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-foreground border border-foreground">
            {analysts.map((a) => (
              <div key={a.name} className="bg-background p-5 group cursor-pointer">
                <div className="aspect-square overflow-hidden mb-4 bg-secondary">
                  <img
                    src={a.img}
                    alt={`${a.name}, ${a.coverage}`}
                    width={512}
                    height={512}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="font-serif font-black text-lg leading-tight">{a.name}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-foreground/50 mt-1">
                  {a.coverage}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INQUIRIES */}
      <section
        id="archive"
        className="border-t-4 border-foreground bg-secondary/40 px-6 py-24 md:py-32"
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <span className="font-serif italic text-accent text-xl md:text-2xl block mb-3">
              Inquiry Log
            </span>
            <h2 className="font-serif text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              Recent Briefings.
            </h2>
          </div>
          <div className="space-y-6">
            {inquiries.map((q) => (
              <article key={q.id} className="bg-background border-2 border-foreground p-8 md:p-12">
                <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-foreground text-background">
                    Case #{q.id}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
                    {q.resolved}
                  </span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-black leading-tight mb-5 tracking-tight">
                  {q.title}
                </h3>
                <p className="text-foreground/70 mb-8 italic font-serif text-lg leading-relaxed">
                  "{q.excerpt}"
                </p>
                <div className="flex items-center gap-4 border-t-2 border-foreground/10 pt-6">
                  <div className="size-1.5 bg-accent" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest">{q.analyst}</p>
                    <p className="text-[10px] text-foreground/50 uppercase tracking-widest mt-1">
                      {q.role}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section className="border-t-4 border-foreground px-6 py-24 md:py-32">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6 border-b-2 border-foreground pb-8">
            <h2 className="font-serif text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              Core Coverage
            </h2>
            <span className="font-serif italic text-xl md:text-2xl text-accent">
              Five disciplines. Deep specialization.
            </span>
          </div>
          <div className="grid md:grid-cols-5 gap-px bg-foreground border border-foreground">
            {coverage.map((c) => (
              <div
                key={c.n}
                className="bg-background p-8 group hover:bg-accent hover:text-background transition-colors"
              >
                <span className="font-serif italic text-2xl block mb-8 text-accent group-hover:text-background">
                  {c.n}.
                </span>
                <h4 className="font-serif text-3xl font-black mb-4 leading-none">{c.t}</h4>
                <p className="text-sm font-medium opacity-70">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="bg-accent text-background py-28 md:py-40 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="font-serif text-4xl sm:text-5xl md:text-7xl font-black italic leading-[0.95] tracking-tighter">
            "Gartner-level depth, with the speed of an internal Slack message. We stopped paying
            three other advisories the day we joined."
          </p>
          <div className="mt-12 flex items-center gap-6">
            <div className="h-0.5 w-24 bg-background"></div>
            <span className="text-xs font-black uppercase tracking-[0.3em]">
              Director of Infrastructure · Global 500 Retailer
            </span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-t-4 border-foreground px-6 py-24 md:py-32">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
          <Stat n="4.2h" l="Median response time" />
          <Stat n="15yr" l="Minimum analyst tenure" />
          <Stat n="2,400" l="Briefings delivered" />
          <Stat n="94%" l="Subscription renewal rate" />
        </div>
      </section>

      {/* BRIEFING FORM */}
      <section id="briefing" className="border-t-4 border-foreground bg-foreground text-background px-6 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24">
          <div className="border-l-8 border-accent pl-8">
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-8">
              Request a Briefing
            </span>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-black italic leading-[0.95] tracking-tighter mb-8">
              Put a question
              <br />
              to the desk.
            </h2>
            <p className="text-background/60 text-lg max-w-md">
              Tell us the decision you're working on. An analyst with direct coverage will respond
              within one business day — no sales call, no gatekeeping.
            </p>
          </div>
          <BriefingForm />
        </div>
      </section>

      {/* FOOTER CTA */}
      <footer id="access" className="p-6">
        <div className="bg-foreground text-background p-10 md:p-20 lg:p-24">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-black italic leading-[0.95] mb-12 tracking-tighter">
                Secure your
                <br />
                intelligence desk.
              </h2>
              <p className="text-background/60 max-w-md mb-10 text-lg">
                Enterprise subscriptions from $4,500/month. Bespoke arrangements for global
                architecture teams.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 md:px-10 py-5 bg-background text-foreground font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-background transition-all">
                  Join the Desk
                </button>
                <button className="px-8 md:px-10 py-5 border-2 border-background/20 text-background font-black uppercase tracking-widest text-xs hover:bg-background/10">
                  Sample Briefing
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-12">
              <FooterCol
                title="Coverage"
                items={["Microsoft", "Oracle / SAP", "Cloud Architecture", "Negotiation"]}
              />
              <FooterCol
                title="decipher.ms"
                items={["The Network", "Methodology", "Ethics", "Contact"]}
              />
            </div>
          </div>
          <div className="mt-24 md:mt-32 pt-10 border-t border-background/10 flex flex-col md:flex-row justify-between gap-6 text-[10px] font-black uppercase tracking-[0.4em] opacity-50">
            <span>© 2026 Vezza LLC</span>
            <div className="flex gap-12">
              <a href="#" className="hover:text-accent">
                Legal
              </a>
              <a href="#" className="hover:text-accent">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function Pillar({
  n,
  title,
  hover,
  img,
  alt,
  children,
}: {
  n: string;
  title: [string, string];
  hover: string;
  img: string;
  alt: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`p-10 md:p-12 border-b-4 md:border-b-0 md:[&:not(:last-child)]:border-r-2 border-foreground group ${hover} hover:text-background transition-colors duration-300`}
    >
      <span className="text-5xl md:text-6xl font-serif font-black italic block mb-10">{n}</span>
      <h3 className="font-serif text-3xl md:text-4xl font-black uppercase leading-none mb-6">
        {title[0]}
        <br />
        {title[1]}
      </h3>
      <p className="font-medium leading-snug mb-10 opacity-80">{children}</p>
      <div className="aspect-square overflow-hidden border-2 border-foreground/10 group-hover:border-background/20">
        <img
          src={img}
          alt={alt}
          width={800}
          height={800}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

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
