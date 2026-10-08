"use server";

import { notFound, redirect } from "next/navigation";
import { adminKeyOk, credentialsOk, endSession, startSession } from "@/lib/admin-auth";
import { rateLimited } from "@/lib/rate-limit";

export async function login(key: string, formData: FormData) {
  if (!adminKeyOk(key)) notFound();
  if (await rateLimited("admin-login", 5)) redirect(`/admin/${key}?error=locked`);
  const ok = credentialsOk(
    String(formData.get("username") ?? ""),
    String(formData.get("password") ?? ""),
  );
  if (!ok) redirect(`/admin/${key}?error=1`);
  await startSession();
  redirect(`/admin/${key}`);
}

export async function logout(key: string) {
  if (!adminKeyOk(key)) notFound();
  await endSession();
  redirect(`/admin/${key}`);
}
