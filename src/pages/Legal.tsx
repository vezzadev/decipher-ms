import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Legal = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/20">
      <Helmet>
        <title>Legal — decipher.ms</title>
        <meta name="description" content="Terms of use and advisory disclaimer for decipher.ms, operated by Vezza LLC." />
        <link rel="canonical" href="https://decipher.ms/legal" />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      {/* NAV */}
      <nav className="border-b-4 border-foreground px-6 py-6 flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur z-50">
        <Link
          to="/"
          className="font-serif text-3xl md:text-4xl font-black tracking-tighter uppercase italic"
        >
          decipher<span className="text-accent ml-[0.05em]">.ms</span>
        </Link>
        <div className="hidden md:flex gap-8 text-[11px] font-extrabold uppercase tracking-[0.2em]">
          <Link to="/#services" className="hover:text-accent transition-colors">Services</Link>
          <Link to="/#topics" className="hover:text-accent transition-colors">Topics</Link>
          <Link to="/#approach" className="hover:text-accent transition-colors">Approach</Link>
          <Link to="/about" className="hover:text-accent transition-colors">About</Link>
          <Link to="/#briefing" className="hover:text-accent transition-colors">Briefing</Link>
        </div>
      </nav>

      <main>
        {/* HERO */}
        <header className="px-6 py-20 md:py-24 max-w-[1400px] mx-auto">
          <div className="border-l-8 border-accent pl-6 md:pl-10">
            <span className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-accent mb-8">
              Terms &amp; Disclaimer
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-black leading-[0.85] tracking-tighter mb-8">
              Legal
            </h1>
            <p className="text-base text-foreground/60">
              Effective 2026-05-27 · Operated by Vezza LLC, Seattle, Washington, USA.
            </p>
          </div>
        </header>

        {/* BODY */}
        <section className="border-t-4 border-foreground px-6 py-20 md:py-24">
          <div className="max-w-[820px] mx-auto space-y-14 text-base md:text-lg leading-relaxed text-foreground/80">

            <Block n="01" title="About this site">
              <p>
                <span className="text-foreground">decipher</span><span className="text-accent">.ms</span> is an independent
                Microsoft advisory operated by <strong className="text-foreground">Vezza LLC</strong>, a
                Washington State limited liability company. References to "we,"
                "us," or "decipher.ms" mean Vezza LLC.
              </p>
              <p>
                By accessing this website or engaging our services, you agree to
                these terms. If you don't agree, please don't use the site.
              </p>
            </Block>

            <Block n="02" title="Advisory disclaimer">
              <p>
                Briefings, written reports, calls, and any other materials we
                produce are <strong className="text-foreground">informational and advisory only</strong>. They
                reflect our analysis and judgment as of the date delivered and
                are based on the information you share with us.
              </p>
              <p>
                We are <strong className="text-foreground">not</strong> providing legal advice, tax advice,
                accounting advice, financial advice, or Microsoft licensing or
                contract advice. Nothing we deliver creates an attorney-client,
                fiduciary, or agency relationship between you and Vezza LLC.
              </p>
              <p>
                Our deliverables are <strong className="text-foreground">your inputs, not your decision</strong>.
                You remain responsible for validating our analysis against your
                own environment, requirements, and constraints — and for
                consulting your own legal, tax, security, and procurement
                advisors before acting on it.
              </p>
              <p>
                We make no warranties, express or implied, regarding the
                accuracy, completeness, fitness for a particular purpose, or
                non-infringement of any materials we provide.
              </p>
            </Block>

            <Block n="03" title="Independence from Microsoft">
              <p>
                <span className="text-foreground">decipher</span><span className="text-accent">.ms</span> is
                <strong className="text-foreground"> not affiliated with, endorsed by, or sponsored by
                Microsoft Corporation</strong>. References to Microsoft products,
                services, programs, or trademarks are nominative and do not
                imply any partnership.
              </p>
              <p>
                We do not resell Microsoft products, participate in the
                Microsoft Partner Network as a transacting partner, or accept
                referral commissions from Microsoft or any third party for
                advice we give you. If that ever changes for a specific
                engagement, we will disclose it to you in writing before the
                engagement begins.
              </p>
            </Block>

            <Block n="04" title="No Microsoft confidential information">
              <p>
                Our founder is a former Microsoft employee. We will{" "}
                <strong className="text-foreground">never</strong> share, reference, or rely on
                information that is confidential, proprietary, or otherwise
                non-public to Microsoft in any briefing, report, call, or
                informal exchange with you.
              </p>
              <p>
                Every deliverable is built exclusively from publicly available
                information, your inputs, and our independent analysis and
                experience. Confidentiality obligations to former employers
                remain in force and are not negotiable.
              </p>
            </Block>

            <Block n="05" title="Engagements">
              <p>
                These terms govern your use of the website. The specific scope,
                fees, deliverables, confidentiality, and ownership terms for any
                paid engagement are set out in the separate engagement letter or
                statement of work we send you before work begins. In case of
                conflict, the engagement letter controls.
              </p>
            </Block>

            <Block n="06" title="Intellectual property">
              <p>
                The site's content, design, code, and trademarks are owned by
                Vezza LLC or licensed to us. You may view and share normal
                excerpts for personal or internal business use.
              </p>
            </Block>

            <Block n="07" title="Limitation of liability">
              <p>
                To the maximum extent permitted by law, Vezza LLC will not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages arising from your use of the website or any
                free materials available on it. Liability arising from a paid
                engagement is governed by the engagement letter.
              </p>
            </Block>

            <Block n="08" title="Governing law">
              <p>
                These terms are governed by the laws of the State of Washington,
                USA, without regard to its conflict-of-laws principles. Any
                dispute will be resolved exclusively in the state or federal
                courts located in King County, Washington.
              </p>
            </Block>

            <Block n="09" title="Changes">
              <p>
                We may update these terms from time to time. Material changes
                will be reflected by updating the effective date at the top of
                this page. Continued use of the site after the effective date
                means you accept the updated terms.
              </p>
            </Block>

            <Block n="10" title="Contact">
              <p>
                Legal questions can be sent via the{" "}
                <Link to="/#briefing" className="text-accent underline underline-offset-4 hover:text-foreground transition-colors">
                  briefing form
                </Link>
                {" "}— mark your message "Legal inquiry."
              </p>
            </Block>
          </div>
        </section>
      </main>

      {/* FOOTER */}
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
                  <li><Link to="/#services" className="hover:text-accent transition-colors">Expert Call</Link></li>
                  <li><Link to="/#services" className="hover:text-accent transition-colors">Second Opinion</Link></li>
                  <li><Link to="/#services" className="hover:text-accent transition-colors">Technical Brief</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6">decipher.ms</p>
                <ul className="space-y-3 text-base font-bold">
                  <li><Link to="/#approach" className="hover:text-accent transition-colors">Approach</Link></li>
                  <li><Link to="/about" className="hover:text-accent transition-colors">About</Link></li>
                  <li><Link to="/#briefing" className="hover:text-accent transition-colors">Briefing</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between gap-6 text-[10px] font-black uppercase tracking-[0.4em] opacity-50 px-6">
            <span>© 2026 Vezza LLC</span>
            <div className="flex gap-12">
              <Link to="/legal" className="hover:text-accent">Legal</Link>
              <Link to="/privacy" className="hover:text-accent">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-baseline gap-5 mb-5">
        <span className="font-serif italic text-2xl md:text-3xl text-accent shrink-0">{n}.</span>
        <h2 className="font-serif text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none">
          {title}
        </h2>
      </div>
      <div className="space-y-4 pl-10 md:pl-12">{children}</div>
    </section>
  );
}

export default Legal;
