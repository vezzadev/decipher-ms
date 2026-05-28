import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/20">
      <Helmet>
        <title>Privacy — decipher.ms</title>
        <meta name="description" content="How decipher.ms handles personal data. Operated by Vezza LLC." />
        <link rel="canonical" href="https://decipher.ms/privacy" />
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
              How we handle data
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-black leading-[0.85] tracking-tighter mb-8">
              Privacy
            </h1>
            <p className="text-base text-foreground/60">
              Effective 2026-05-27 · Operated by Vezza LLC, Seattle, Washington, USA.
            </p>
          </div>
        </header>

        {/* SUMMARY */}
        <section className="border-t-4 border-foreground bg-secondary/40 px-6 py-16 md:py-20">
          <div className="max-w-[820px] mx-auto">
            <span className="font-serif italic text-accent text-xl md:text-2xl block mb-4">
              Short version
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-black tracking-tighter uppercase leading-[0.95] mb-8">
              We collect what you send us. Nothing more.
            </h2>
            <ul className="space-y-3 text-base md:text-lg leading-relaxed text-foreground/80">
              <li className="flex gap-4"><span className="mt-2 inline-block h-2 w-2 shrink-0 bg-accent" /><span>Only the fields you fill in the briefing form leave your browser as identifiable data.</span></li>
              <li className="flex gap-4"><span className="mt-2 inline-block h-2 w-2 shrink-0 bg-accent" /><span>Site analytics are anonymous — no IP address, no email, no user ID is sent to our telemetry pipeline.</span></li>
              <li className="flex gap-4"><span className="mt-2 inline-block h-2 w-2 shrink-0 bg-accent" /><span>Bot protection (Cloudflare Turnstile) doesn't track you across sites.</span></li>
              <li className="flex gap-4"><span className="mt-2 inline-block h-2 w-2 shrink-0 bg-accent" /><span>No advertising, no third-party tracking pixels, no data sales — ever.</span></li>
            </ul>
          </div>
        </section>

        {/* DETAILS */}
        <section className="border-t-4 border-foreground px-6 py-20 md:py-24">
          <div className="max-w-[820px] mx-auto space-y-14 text-base md:text-lg leading-relaxed text-foreground/80">

            <Block n="01" title="Briefing form submissions">
              <p>
                When you submit the briefing form, we collect the fields you
                provide: <strong className="text-foreground">name</strong>,{" "}
                <strong className="text-foreground">work email</strong>,{" "}
                <strong className="text-foreground">role</strong> (optional),{" "}
                <strong className="text-foreground">engagement type</strong>,{" "}
                <strong className="text-foreground">question topic</strong>, and{" "}
                <strong className="text-foreground">question details</strong>.
              </p>
              <p>
                We use this information to respond to your request and, if you
                proceed, to deliver the engagement. We don't use it for
                marketing and we don't share it with third parties for
                marketing.
              </p>
              <p>
                Submissions are stored in our database (Cloudflare D1) and a
                notification is sent to our intake mailbox via the Microsoft
                Graph API. We retain submissions for up to{" "}
                <strong className="text-foreground">three years</strong> after the last
                engagement-related contact, or until you ask us to delete them
                — whichever comes first.
              </p>
            </Block>

            <Block n="02" title="Anonymous site analytics">
              <p>
                We use Azure Application Insights to measure site performance
                (page-load metrics, Web Vitals like LCP, INP, CLS) and to
                catch errors. Our telemetry payload contains performance
                numbers and a generated session identifier scoped to one
                browser tab. It does <strong className="text-foreground">not</strong> include:
              </p>
              <ul className="space-y-2 pl-5 list-disc marker:text-accent">
                <li>Your IP address</li>
                <li>Your email or name</li>
                <li>A persistent user identifier</li>
                <li>The content of any form you've started typing</li>
              </ul>
              <p>
                Application Insights is operated by Microsoft. Microsoft acts
                as our data processor for telemetry data we send to it.
              </p>
            </Block>

            <Block n="03" title="Bot protection">
              <p>
                The briefing form is protected by{" "}
                <strong className="text-foreground">Cloudflare Turnstile</strong>, a
                privacy-friendly alternative to traditional CAPTCHAs.
                Cloudflare evaluates the challenge in your browser; we receive
                a yes/no token, not your raw browsing signals. Turnstile is
                designed not to track users across sites and does not display
                advertising.
              </p>
              <p>
                If you can't complete the challenge or block it at the network
                level, the form won't submit.
              </p>
            </Block>

            <Block n="04" title="Cookies">
              <p>
                We do not set first-party tracking cookies, advertising
                cookies, or analytics cookies. Cloudflare Turnstile may set
                short-lived cookies strictly necessary to complete the bot
                challenge.
              </p>
            </Block>

            <Block n="05" title="Subprocessors">
              <p>
                The infrastructure we rely on to operate the site:
              </p>
              <ul className="space-y-2 pl-5 list-disc marker:text-accent">
                <li>
                  <strong className="text-foreground">Cloudflare</strong> — site hosting (Pages /
                  Workers), database (D1), and Turnstile bot protection.
                </li>
                <li>
                  <strong className="text-foreground">Microsoft</strong> — Graph API for transactional
                  email; Application Insights for anonymous telemetry.
                </li>
              </ul>
              <p>
                Each subprocessor is bound by its own privacy and security
                terms. We do not authorize them to use your data for their own
                marketing.
              </p>
            </Block>

            <Block n="06" title="Server logs">
              <p>
                Like any web service, the Cloudflare edge and our Workers
                runtime briefly process standard request metadata (such as IP
                address and user-agent) to deliver the response. We do not
                persist these in our own database or copy them into our
                analytics pipeline.
              </p>
            </Block>

            <Block n="07" title="Your rights">
              <p>
                You can ask us to access, correct, or delete the personal
                information we hold about you. Send your request via the{" "}
                <Link to="/#briefing" className="text-accent underline underline-offset-4 hover:text-foreground transition-colors">
                  briefing form
                </Link>
                {" "}— mark your message "Privacy request" — and we'll respond
                within 30 days.
              </p>
              <p>
                If you're in a jurisdiction with additional rights (for
                example, the GDPR or California's CCPA/CPRA), those rights
                apply and you can exercise them through the same channel.
              </p>
            </Block>

            <Block n="08" title="Children">
              <p>
                This site is for business audiences. We do not knowingly
                collect information from children under 16. If you believe
                a child has submitted information to us, contact us and we
                will delete it.
              </p>
            </Block>

            <Block n="09" title="Changes">
              <p>
                We may update this policy from time to time. Material changes
                will be reflected by updating the effective date at the top of
                this page.
              </p>
            </Block>

            <Block n="10" title="Contact">
              <p>
                Privacy questions and rights requests can be sent via the{" "}
                <Link to="/#briefing" className="text-accent underline underline-offset-4 hover:text-foreground transition-colors">
                  briefing form
                </Link>
                . The data controller is{" "}
                <strong className="text-foreground">Vezza LLC</strong>, Seattle, Washington, USA.
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

export default Privacy;
