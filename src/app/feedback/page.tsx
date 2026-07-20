import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { FeedbackForm } from "@/components/marketing/feedback-form";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Tell us what's working, what's broken, or what Crowkis should do next. A human reads every message.",
  alternates: { canonical: "/feedback" },
};

export default function FeedbackPage() {
  return (
    <SiteShell>
      <section className="border-b-2 border-ink bg-paper-deep paper-grid">
        <div className="section py-14 md:py-16">
          <span className="eyebrow">Feedback</span>
          <h1 className="responsive-title mt-3">Tell us what you think.</h1>
          <p className="responsive-subtitle mt-4 max-w-2xl">
            Bug, rough edge, missing feature, or just a note, send it over. It goes straight to the
            people building Crowkis, and a human reads every one.
          </p>
        </div>
      </section>
      <section className="section py-12 md:py-16">
        <div className="mx-auto max-w-2xl">
          <FeedbackForm />
        </div>
      </section>
    </SiteShell>
  );
}
