"use server";

import { withDb } from "@/lib/db";
import { rateLimited as limited } from "@/lib/rate-limit";

const rateLimited = () => limited("form", 5); // max submissions per 10 min per IP

async function insert(text: string, values: unknown[]): Promise<void> {
  await withDb((q) => q(text, values));
}

export type ActionResult = { ok: boolean; error?: string };

export async function submitFeedback(input: {
  name?: string;
  email?: string;
  message: string;
  source?: "feedback" | "contact";
}): Promise<ActionResult> {
  const message = (input.message ?? "").trim();
  if (message.length < 3) return { ok: false, error: "Please write a little more." };
  if (message.length > 4000) return { ok: false, error: "That's too long." };
  const name = (input.name ?? "").trim().slice(0, 120) || null;
  const email = (input.email ?? "").trim().slice(0, 200) || null;
  if (await rateLimited()) return { ok: false, error: "Too many submissions, try again later." };
  try {
    await insert("insert into feedback (name, email, message, source) values ($1, $2, $3, $4)", [
      name,
      email,
      message,
      input.source === "contact" ? "contact" : "feedback",
    ]);
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong, please try again." };
  }
}

export async function submitRating(input: {
  stars: number;
  comment?: string;
}): Promise<ActionResult> {
  const stars = Math.round(Number(input.stars));
  if (!(stars >= 1 && stars <= 5)) return { ok: false, error: "Pick 1 to 5 stars." };
  const comment = (input.comment ?? "").trim().slice(0, 2000) || null;
  if (await rateLimited()) return { ok: false, error: "Too many submissions, try again later." };
  try {
    await insert("insert into ratings (stars, comment) values ($1, $2)", [stars, comment]);
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong, please try again." };
  }
}
