import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";


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

export default function BriefingForm() {
  const [values, setValues] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
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
    setSubmitting(true);
    const { error } = await supabase.from("briefing_requests").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company,
      role: parsed.data.role || null,
      topic: parsed.data.topic,
      details: parsed.data.details,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit. Please try again.");
      return;
    }
    setSubmitted(true);
    setValues(initial);
    toast.success("Briefing request received. An analyst will respond within one business day.");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <div className="grid md:grid-cols-2 gap-8">
        <Field label="Name" name="name" value={values.name} onChange={update("name")} error={errors.name} />
        <Field label="Work email" name="email" type="email" value={values.email} onChange={update("email")} error={errors.email} />
        <Field label="Company" name="company" value={values.company} onChange={update("company")} error={errors.company} />
        <Field label="Role (optional)" name="role" value={values.role ?? ""} onChange={update("role")} error={errors.role} />
      </div>
      <Field label="Question topic" name="topic" value={values.topic} onChange={update("topic")} error={errors.topic} placeholder="e.g. Microsoft EA renewal strategy" />
      <div>
        <label htmlFor="details" className="block text-[10px] font-black uppercase tracking-[0.3em] text-background/60 mb-3">
          Question details
        </label>
        <textarea
          id="details"
          name="details"
          rows={6}
          value={values.details}
          onChange={update("details")}
          placeholder="Describe the decision you're facing, key constraints, and timeline."
          className="w-full bg-transparent border-2 border-background/20 px-4 py-3 text-background placeholder:text-background/30 focus:outline-none focus:border-accent transition-colors font-sans"
        />
        {errors.details && <p className="mt-2 text-xs text-accent font-bold">{errors.details}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={submitting}
          className="px-10 py-5 bg-accent text-background font-black uppercase tracking-widest text-xs hover:bg-background hover:text-foreground transition-all disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Request Briefing"}
        </button>
        {submitted && (
          <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">
            Received — check your inbox.
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
