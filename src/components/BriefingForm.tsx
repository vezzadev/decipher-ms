import { useEffect, useRef, useState } from "react";
import { z } from "zod";


const schema = z.object({
  name: z.string().trim().min(1, "Required").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  company: z.string().trim().min(1, "Required").max(200),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  topic: z.string().trim().min(1, "Required").max(200),
  details: z.string().trim().min(10, "Add a bit more detail").max(4000),
});

type FormState = z.infer<typeof schema>;

const initial: FormState = {
  name: "",
  email: "",
  company: "",
  role: "",
  topic: "",
  details: "",
};

const TURNSTILE_SITE_KEY = "0x4AAAAAADXZiCqy8p3HZOMu";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

export default function BriefingForm() {
  const [values, setValues] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileEl = useRef<HTMLDivElement | null>(null);
  const turnstileWidget = useRef<string | null>(null);

  useEffect(() => {
    const id = "cf-turnstile-script";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }
    let cancelled = false;
    const renderWhenReady = () => {
      if (cancelled) return;
      if (!window.turnstile || !turnstileEl.current) {
        setTimeout(renderWhenReady, 100);
        return;
      }
      if (turnstileWidget.current) return;
      turnstileWidget.current = window.turnstile.render(turnstileEl.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "light",
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(null),
        "error-callback": () => setTurnstileToken(null),
      });
    };
    renderWhenReady();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
  };

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormState;
        fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setServerError(null);
    if (!turnstileToken) {
      setServerError("Please complete the challenge before submitting.");
      return;
    }
    setSubmitting(true);
    let res: Response;
    try {
      res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: parsed.data.name,
          email: parsed.data.email,
          company: parsed.data.company,
          role: parsed.data.role || null,
          topic: parsed.data.topic,
          details: parsed.data.details,
          turnstileToken,
        }),
      });
    } catch {
      setSubmitting(false);
      setServerError("Network error. Please try again.");
      return;
    }
    setSubmitting(false);
    if (!res.ok) {
      let msg = "Could not submit. Please try again.";
      try {
        const body = (await res.json()) as { error?: string };
        if (body?.error) msg = body.error;
      } catch {
        /* keep generic */
      }
      setServerError(msg);
      window.turnstile?.reset(turnstileWidget.current ?? undefined);
      setTurnstileToken(null);
      return;
    }
    setServerError("__ok__");
    setValues(initial);
    window.turnstile?.reset(turnstileWidget.current ?? undefined);
    setTurnstileToken(null);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Name" name="name" value={values.name} onChange={update("name")} error={errors.name} />
        <Field label="Work email" name="email" type="email" value={values.email} onChange={update("email")} error={errors.email} />
        <Field label="Company" name="company" value={values.company} onChange={update("company")} error={errors.company} />
        <Field label="Role (optional)" name="role" value={values.role ?? ""} onChange={update("role")} error={errors.role} />
      </div>
      <Field label="Question topic" name="topic" value={values.topic} onChange={update("topic")} error={errors.topic} placeholder="e.g. Securing Azure ML for SOC 2" />
      <div>
        <label htmlFor="details" className="block text-[10px] font-black uppercase tracking-[0.3em] text-background/60 mb-3">
          Question details
        </label>
        <textarea
          id="details"
          name="details"
          rows={4}
          value={values.details}
          onChange={update("details")}
          placeholder="Describe the decision you're facing, key constraints, and timeline."
          className="w-full bg-transparent border-2 border-background/20 px-4 py-3 text-background placeholder:text-background/30 focus:outline-none focus:border-accent transition-colors font-sans"
        />
        {errors.details && <p className="mt-2 text-xs text-accent font-bold">{errors.details}</p>}
      </div>
      <div ref={turnstileEl} />
      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={submitting || !turnstileToken}
          className="px-10 py-5 bg-accent text-background font-black uppercase tracking-widest text-xs hover:bg-background hover:text-foreground transition-all disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Request Briefing"}
        </button>
        {serverError === "__ok__" && (
          <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">
            Received — an analyst will respond within one business day.
          </span>
        )}
        {serverError && serverError !== "__ok__" && (
          <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">
            {serverError}
          </span>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[10px] font-black uppercase tracking-[0.3em] text-background/60 mb-3">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent border-2 border-background/20 px-4 py-3 text-background placeholder:text-background/30 focus:outline-none focus:border-accent transition-colors font-sans"
      />
      {error && <p className="mt-2 text-xs text-accent font-bold">{error}</p>}
    </div>
  );
}
