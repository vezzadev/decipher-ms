import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import pedro from "@/assets/pedro.jpg";

const roles = [
  {
    period: "Recent",
    title: "Principal Software Engineer · Tech Lead",
    org: "Microsoft — Substrate AI Platform (M365)",
    body:
      "Tech Lead driving security and infrastructure excellence for Microsoft's Substrate AI Platform — a SOC 2 Type II compliant platform enabling secure AI/ML development with both eyes-on and eyes-off training data access across Microsoft 365.",
    bullets: [
      "Spearheaded removal of overprivileged Azure RBAC role assignments across production subscriptions, establishing a least-privilege framework.",
      "Architected low-privilege access for the M365 internal AI/ML platform on Azure Machine Learning, enabling data scientists to work securely under SOC 2.",
      "Led unification of critical internal dataset environments and migration of internal Kubernetes clusters with zero downtime.",
      "Drove SOC 2023 audit readiness with comprehensive controls, audit logging, and compliance monitoring.",
    ],
  },
  {
    period: "Sep 2019 — Aug 2023",
    title: "Senior Software Engineer",
    org: "Microsoft — Dynamics 365 Resource Scheduling Optimization",
    body:
      "Expanded the Resource Scheduling Optimization (RSO) product with task dependencies and interactive optimization. Architected a multi-tenant migration to reduce infra cost and accelerate feature delivery.",
    bullets: [
      "Deployed RSO to Azure Government in record time to support NY State COVID-19 testing operations.",
      "Mentored three engineers (junior and mid-level) and acted as program manager for engineering-quality features.",
    ],
  },
  {
    period: "Mar 2017 — Aug 2019",
    title: "Software Engineer II",
    org: "Microsoft — Dynamics 365 RSO",
    body:
      "Core algorithm specialist for resource allocation. Worked directly with Microsoft Research to develop and benchmark new capabilities. Team security champion.",
    bullets: [],
  },
];

const expertise = [
  "Cloud Security & Compliance (SOC 2, Azure RBAC, Zero Trust)",
  "AI/ML Platform Engineering & Infrastructure",
  "Enterprise Software Architecture & SRE",
  "Microsoft Licensing — M365, Azure, Dynamics, Copilot",
  "Technical Leadership & Cross-Team Collaboration",
];

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/20">
      <Helmet>
        <title>About Pedro Paulo Vezza Campos — decipher.ms</title>
        <meta name="description" content="Founder of decipher.ms. Former Microsoft Principal Engineer and Tech Lead on the M365 Substrate AI Platform with 11 years inside Microsoft." />
        <link rel="canonical" href="https://decipher.ms/about" />
        <meta property="og:title" content="About the Founder — decipher.ms" />
        <meta property="og:description" content="Pedro Paulo Vezza Campos — former Microsoft Principal Engineer, Tech Lead on the M365 Substrate AI Platform, now running an independent Microsoft advisory." />
        <meta property="og:url" content="https://decipher.ms/about" />
        <meta property="og:type" content="profile" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Pedro Paulo Vezza Campos",
          "jobTitle": "Founder, decipher.ms",
          "description": "Former Microsoft Principal Software Engineer and Tech Lead on the M365 Substrate AI Platform.",
          "url": "https://decipher.ms/about",
          "worksFor": {
            "@type": "Organization",
            "name": "decipher.ms",
            "url": "https://decipher.ms/"
          },
          "alumniOf": {
            "@type": "Organization",
            "name": "Microsoft"
          }
        })}</script>
      </Helmet>
      {/* NAV */}
      <nav className="border-b-4 border-foreground px-6 py-6 flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur z-50">
        <Link
          to="/"
          className="font-serif text-3xl md:text-4xl font-black tracking-tighter uppercase italic"
        >
          decipher<span className="text-accent pl-2">.ms</span>
        </Link>
        <div className="hidden md:flex gap-8 text-[11px] font-extrabold uppercase tracking-[0.2em]">
          <Link to="/" className="hover:text-accent transition-colors">Services</Link>
          <Link to="/" className="hover:text-accent transition-colors">Approach</Link>
          <Link to="/" className="hover:text-accent transition-colors">Topics</Link>
          <Link to="/about" className="text-accent">About</Link>
          <Link to="/" className="hover:text-accent transition-colors">Briefing</Link>
        </div>
      </nav>

      <main>

      {/* HERO */}
      <header className="px-6 py-20 md:py-28 max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-start">
          <div className="border-l-8 border-accent pl-6 md:pl-10">
            <span className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-accent mb-8">
              About
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-black leading-[0.85] tracking-tighter mb-10">
              Pedro Paulo
              <br />
              <span className="text-accent italic">Vezza Campos</span>
            </h1>
            <p className="text-xl md:text-2xl font-semibold max-w-lg leading-tight tracking-tight text-foreground/80">
              Former Microsoft Principal Software Engineer and Tech Lead on the Substrate
              AI Platform — the team behind M365's AI/ML capabilities.
            </p>
            <p className="mt-6 text-base text-foreground/60 max-w-lg">
              I built decipher.ms because the best Microsoft answers shouldn't be locked inside Microsoft.
            </p>
            <p className="mt-4 text-sm text-foreground/70 font-medium">
              Greater Seattle Area · Remote
            </p>
          </div>

          <div className="border-4 border-foreground">
            <img
              src={pedro}
              alt="Pedro Paulo Vezza Campos"
              className="w-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </header>

      {/* WHY THIS MATTERS */}
      <section className="border-t-4 border-foreground bg-secondary/40 px-6 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 md:gap-20 items-start">
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              Why this
              <br />
              <span className="text-accent italic">background</span>
              <br />
              matters
            </h2>
            <div className="space-y-6 text-lg md:text-xl leading-relaxed text-foreground/70 font-medium">
              <p>
                Most Microsoft advisors learned the product matrix from the outside —
                reading docs, attending Ignite, going through a Microsoft Partner program.
              </p>
              <p>
                I've spent years on the inside, building the platforms that ship as
                M365 features. I've sat in the architecture reviews, written the security
                controls that SOC 2 auditors review, and watched first-hand how Microsoft
                prices, packages, and positions its products.
              </p>
              <p className="text-foreground font-black font-serif italic text-2xl md:text-3xl">
                That perspective is the product. You get a straight answer informed by
                what's actually being built — not what's being sold this quarter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="border-t-4 border-foreground px-6 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <span className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-accent mb-8">
            Areas of Expertise
          </span>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-14">
            What I know
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {expertise.map((e) => (
              <div
                key={e}
                className="border-2 border-foreground px-6 py-5 text-base font-bold hover:bg-accent hover:text-background hover:border-accent transition-colors"
              >
                {e}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="border-t-4 border-foreground bg-foreground text-background px-6 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <span className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-accent mb-8">
            Experience at Microsoft
          </span>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-16">
            Career
          </h2>
          <div className="space-y-0">
            {roles.map((r, i) => (
              <div
                key={r.title + r.period}
                className={`grid gap-6 md:grid-cols-[200px_1fr] py-10 ${
                  i > 0 ? "border-t-2 border-background/20" : ""
                }`}
              >
                <div>
                  <p className="text-sm text-background/50 font-black uppercase tracking-[0.2em]">
                    {r.period}
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl font-black uppercase leading-none mb-2">
                    {r.title}
                  </h3>
                  <p className="text-sm text-background/60 font-bold">{r.org}</p>
                  <p className="mt-4 text-base leading-relaxed text-background/80">
                    {r.body}
                  </p>
                  {r.bullets.length > 0 && (
                    <ul className="mt-4 space-y-2 text-base text-background/80">
                      {r.bullets.map((b) => (
                        <li key={b} className="flex gap-3">
                          <span className="mt-2 inline-block h-2 w-2 shrink-0 bg-accent" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECOGNITION & EDUCATION */}
      <section className="border-t-4 border-foreground px-6 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-0 border-4 border-foreground">
          <div className="p-10 md:p-12 border-b-4 md:border-b-0 md:border-r-2 border-foreground">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6 block">
              Recognition
            </span>
            <h3 className="font-serif text-3xl md:text-4xl font-black uppercase leading-none mb-6">
              Award
            </h3>
            <p className="text-base leading-relaxed text-foreground/70 mb-4">
              "What Makes BAG, BAG — We succeed when the customer succeeds." Issued by
              the Dynamics 365 Products Group, July 2020.
            </p>
            <p className="text-base italic text-foreground/50">
              "Pedro always strives to help our customers succeed, he researches new
              technologies, stays in touch with MS best practices and constantly shares
              them with the team."
            </p>
          </div>

          <div className="p-10 md:p-12">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6 block">
              Education
            </span>
            <h3 className="font-serif text-3xl md:text-4xl font-black uppercase leading-none mb-6">
              Degree
            </h3>
            <p className="text-base leading-relaxed text-foreground/70">
              Computer Science — Institute of Mathematics and Statistics, University of
              São Paulo (IME-USP). Graduated with honorable mention.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t-4 border-foreground px-6 py-24 md:py-32 text-center">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9] mb-10">
            Want a straight answer
            <br />
            on your Microsoft decision?
          </h2>
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 text-sm font-black uppercase tracking-[0.2em] hover:bg-accent transition-colors"
          >
            Request a briefing <span>→</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      </main>

      <footer className="p-6">
        <div className="bg-background border-t-4 border-foreground pt-12 md:pt-16">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 mb-16 px-6">
            <div>
              <p className="font-serif italic text-3xl md:text-4xl font-black tracking-tighter leading-tight max-w-md">
                Independent Microsoft decision support.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6">Services</p>
                <ul className="space-y-3 text-base font-bold">
                  <li><Link to="/" className="hover:text-accent transition-colors">Expert Call</Link></li>
                  <li><Link to="/" className="hover:text-accent transition-colors">Second Opinion</Link></li>
                  <li><Link to="/" className="hover:text-accent transition-colors">Technical Brief</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6">decipher.ms</p>
                <ul className="space-y-3 text-base font-bold">
                  <li><Link to="/" className="hover:text-accent transition-colors">Services</Link></li>
                  <li><Link to="/about" className="hover:text-accent transition-colors">About</Link></li>
                  <li><Link to="/" className="hover:text-accent transition-colors">Briefing</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between gap-6 text-[10px] font-black uppercase tracking-[0.4em] opacity-50 px-6">
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

export default About;
