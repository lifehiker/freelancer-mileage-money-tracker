import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@prisma/client";

import { db } from "@/lib/db";

const SESSION_COOKIE = "fmmt_session";
const SESSION_AGE_MS = 1000 * 60 * 60 * 24 * 30;

export async function createSession(userId: string) {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_AGE_MS);

  await db.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await db.session.deleteMany({
      where: { token },
    });
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<
  | (User & {
      businessProfile: {
        businessName: string;
        businessType: string;
        defaultTaxRate: number;
        defaultMileageRate: number;
        preferredCurrency: string;
        country: string;
        exportPreference: string;
      } | null;
      subscription: {
        plan: "FREE" | "PRO";
        status: "ACTIVE" | "CANCELED" | "PAST_DUE" | "INACTIVE" | "PREVIEW";
        billingCycle: string;
      } | null;
    })
  | null
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await db.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          businessProfile: true,
          subscription: true,
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    cookieStore.delete(SESSION_COOKIE);
    if (session) {
      await db.session.delete({
        where: { token },
      });
    }
    return null;
  }

  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}

export async function requireOnboardedUser() {
  const user = await requireUser();

  if (!user.onboardingCompleted) {
    redirect("/onboarding");
  }

  return user;
}

export async function ensureUserAndProfile(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await db.user.findUnique({
    where: { email: normalizedEmail },
    include: {
      businessProfile: true,
      subscription: true,
    },
  });

  if (existing) {
    if (!existing.businessProfile) {
      await db.businessProfile.create({
        data: {
          userId: existing.id,
        },
      });
    }

    if (!existing.subscription) {
      await db.subscription.create({
        data: {
          userId: existing.id,
        },
      });
    }

    return existing;
  }

  return db.user.create({
    data: {
      email: normalizedEmail,
      businessProfile: {
        create: {},
      },
      subscription: {
        create: {},
      },
    },
    include: {
      businessProfile: true,
      subscription: true,
    },
  });
}
