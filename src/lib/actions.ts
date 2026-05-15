"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomInt, randomUUID } from "node:crypto";

import { endOfMonth, startOfMonth } from "date-fns";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import Stripe from "stripe";
import { z } from "zod";

import {
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  DEFAULT_MILEAGE_RATE,
  DEFAULT_TAX_RATE,
  EXPENSE_CATEGORIES,
  FREE_LIMITS,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
} from "@/lib/constants";
import { createSession, destroySession, ensureUserAndProfile, requireOnboardedUser, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { absoluteUrl, safeRedirectTarget } from "@/lib/utils";

const signInSchema = z.object({
  email: z.email(),
});

const verificationSchema = z.object({
  email: z.email(),
  code: z.string().trim().length(6),
});

const onboardingSchema = z.object({
  businessName: z.string().trim().min(2),
  businessType: z.string().trim().min(2),
  defaultTaxRate: z.coerce.number().min(0).max(1),
  defaultMileageRate: z.coerce.number().min(0),
  preferredCurrency: z.string().trim().min(3).max(3),
  country: z.string().trim().min(2),
});

const tripSchema = z
  .object({
    id: z.string().optional(),
    date: z.string().trim().min(1),
    purpose: z.string().trim().min(2),
    startLocation: z.string().trim().min(2),
    endLocation: z.string().trim().min(2),
    odometerStart: z.string().optional(),
    odometerEnd: z.string().optional(),
    miles: z.string().optional(),
    classification: z.enum(["business", "personal"]),
    notes: z.string().optional(),
  })
  .transform((value) => {
    const odometerStart = value.odometerStart ? Number(value.odometerStart) : null;
    const odometerEnd = value.odometerEnd ? Number(value.odometerEnd) : null;
    const milesInput = value.miles ? Number(value.miles) : null;
    const derivedMiles =
      odometerStart !== null && odometerEnd !== null ? Number((odometerEnd - odometerStart).toFixed(1)) : milesInput;

    if (!derivedMiles || derivedMiles <= 0) {
      throw new Error("Miles must be greater than zero.");
    }

    return {
      ...value,
      date: new Date(value.date),
      odometerStart,
      odometerEnd,
      miles: derivedMiles,
      notes: value.notes?.trim() || null,
    };
  });

const expenseSchema = z.object({
  id: z.string().optional(),
  date: z.string().trim().min(1),
  amount: z.coerce.number().positive(),
  category: z.enum(EXPENSE_CATEGORIES),
  vendor: z.string().trim().min(2),
  notes: z.string().optional(),
  paymentMethod: z.enum(PAYMENT_METHODS),
});

const incomeSchema = z.object({
  id: z.string().optional(),
  date: z.string().trim().min(1),
  amount: z.coerce.number().positive(),
  category: z.enum(INCOME_CATEGORIES),
  clientSource: z.string().trim().min(2),
  notes: z.string().optional(),
  status: z.enum(["paid", "unpaid"]),
});

function redirectWithNotice(pathname: string, notice: string): never {
  const url = new URL(pathname, absoluteUrl("/"));
  url.searchParams.set("notice", notice);
  redirect(`${url.pathname}?${url.searchParams.toString()}`);
}

async function sendEmailCode(email: string, code: string) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return false;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: "Your Freelancer Mileage & Money Tracker sign-in code",
    text: `Your sign-in code is ${code}. It expires in 15 minutes.`,
  });
  return true;
}

export async function requestEmailCodeAction(formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    redirectWithNotice("/sign-in", "Enter a valid email address.");
  }

  const email = parsed.data.email.trim().toLowerCase();
  const code = randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

  await db.authCode.create({
    data: {
      email,
      code,
      expiresAt,
    },
  });

  const emailed = await sendEmailCode(email, code).catch(() => false);
  const notice = emailed ? "Check your email for the 6-digit sign-in code." : "Email delivery is not configured. Use the local sign-in code below.";
  const url = new URL("/sign-in", absoluteUrl("/"));
  url.searchParams.set("email", email);
  url.searchParams.set("notice", notice);

  if (!emailed) {
    url.searchParams.set("code", code);
  }

  redirect(`${url.pathname}?${url.searchParams.toString()}`);
}

export async function verifyEmailCodeAction(formData: FormData) {
  const parsed = verificationSchema.safeParse({
    email: formData.get("email"),
    code: formData.get("code"),
  });

  if (!parsed.success) {
    redirectWithNotice("/sign-in", "Enter the email and 6-digit code.");
  }

  const email = parsed.data.email.trim().toLowerCase();
  const authCode = await db.authCode.findFirst({
    where: {
      email,
      code: parsed.data.code,
      consumedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!authCode) {
    redirectWithNotice("/sign-in", "That code is invalid or expired.");
  }

  const user = await ensureUserAndProfile(email);

  await db.authCode.update({
    where: { id: authCode.id },
    data: {
      consumedAt: new Date(),
      userId: user.id,
    },
  });

  await createSession(user.id);
  redirect(user.onboardingCompleted ? "/app" : "/onboarding");
}

export async function signOutAction() {
  await destroySession();
  redirect("/sign-in");
}

export async function continueWithGoogleAction() {
  redirectWithNotice(
    "/sign-in",
    "Google sign-in is ready for OAuth credentials, but local email sign-in is enabled right now.",
  );
}

export async function saveOnboardingAction(formData: FormData) {
  const user = await requireUser();
  const parsed = onboardingSchema.safeParse({
    businessName: formData.get("businessName"),
    businessType: formData.get("businessType"),
    defaultTaxRate: formData.get("defaultTaxRate"),
    defaultMileageRate: formData.get("defaultMileageRate"),
    preferredCurrency: formData.get("preferredCurrency"),
    country: formData.get("country"),
  });

  if (!parsed.success) {
    redirectWithNotice("/onboarding", "Complete each onboarding field before continuing.");
  }

  await db.$transaction([
    db.user.update({
      where: { id: user.id },
      data: {
        onboardingCompleted: true,
        country: parsed.data.country,
        currency: parsed.data.preferredCurrency.toUpperCase(),
      },
    }),
    db.businessProfile.upsert({
      where: { userId: user.id },
      update: {
        businessName: parsed.data.businessName,
        businessType: parsed.data.businessType,
        defaultTaxRate: parsed.data.defaultTaxRate,
        defaultMileageRate: parsed.data.defaultMileageRate,
        preferredCurrency: parsed.data.preferredCurrency.toUpperCase(),
        country: parsed.data.country,
      },
      create: {
        userId: user.id,
        businessName: parsed.data.businessName,
        businessType: parsed.data.businessType,
        defaultTaxRate: parsed.data.defaultTaxRate,
        defaultMileageRate: parsed.data.defaultMileageRate,
        preferredCurrency: parsed.data.preferredCurrency.toUpperCase(),
        country: parsed.data.country,
      },
    }),
  ]);

  revalidatePath("/app");
  redirect("/app");
}

async function enforceMonthlyLimit({
  userId,
  model,
  max,
}: {
  userId: string;
  model: "trip" | "expense" | "incomeEntry";
  max: number;
}) {
  const subscription = await db.subscription.findUnique({ where: { userId } });
  if (subscription?.plan === "PRO") {
    return;
  }

  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const count =
    model === "trip"
      ? await db.trip.count({ where: { userId, date: { gte: start, lte: end } } })
      : model === "expense"
        ? await db.expense.count({ where: { userId, date: { gte: start, lte: end } } })
        : await db.incomeEntry.count({ where: { userId, date: { gte: start, lte: end } } });

  if (count >= max) {
    throw new Error("You have reached the free plan limit for this month. Upgrade to Pro for unlimited entries.");
  }
}

async function ensureOwnedRecord({
  userId,
  id,
  model,
}: {
  userId: string;
  id: string;
  model: "trip" | "expense" | "incomeEntry";
}) {
  const record =
    model === "trip"
      ? await db.trip.findFirst({ where: { id, userId }, select: { id: true } })
      : model === "expense"
        ? await db.expense.findFirst({ where: { id, userId }, select: { id: true } })
        : await db.incomeEntry.findFirst({ where: { id, userId }, select: { id: true } });

  if (!record) {
    throw new Error("That record could not be found for this account.");
  }
}

export async function saveTripAction(formData: FormData) {
  const user = await requireOnboardedUser();
  const redirectTo = safeRedirectTarget(formData.get("redirectTo"), "/app/trips");

  try {
    const parsed = tripSchema.parse({
      id: formData.get("id") || undefined,
      date: formData.get("date"),
      purpose: formData.get("purpose"),
      startLocation: formData.get("startLocation"),
      endLocation: formData.get("endLocation"),
      odometerStart: formData.get("odometerStart") || undefined,
      odometerEnd: formData.get("odometerEnd") || undefined,
      miles: formData.get("miles") || undefined,
      classification: formData.get("classification"),
      notes: formData.get("notes") || undefined,
    });

    if (!parsed.id) {
      await enforceMonthlyLimit({
        userId: user.id,
        model: "trip",
        max: FREE_LIMITS.tripsPerMonth,
      });
    }

    if (parsed.id) {
      await ensureOwnedRecord({
        userId: user.id,
        id: parsed.id,
        model: "trip",
      });

      await db.trip.update({
        where: {
          id: parsed.id,
        },
        data: {
          date: parsed.date,
          purpose: parsed.purpose,
          startLocation: parsed.startLocation,
          endLocation: parsed.endLocation,
          odometerStart: parsed.odometerStart,
          odometerEnd: parsed.odometerEnd,
          miles: parsed.miles,
          classification: parsed.classification,
          notes: parsed.notes,
        },
      });
    } else {
      await db.trip.create({
        data: {
          userId: user.id,
          date: parsed.date,
          purpose: parsed.purpose,
          startLocation: parsed.startLocation,
          endLocation: parsed.endLocation,
          odometerStart: parsed.odometerStart,
          odometerEnd: parsed.odometerEnd,
          miles: parsed.miles,
          classification: parsed.classification,
          notes: parsed.notes,
        },
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save the trip.";
    redirectWithNotice(redirectTo, message);
  }

  revalidatePath("/app");
  revalidatePath("/app/trips");
  redirectWithNotice(redirectTo, "Trip saved.");
}

export async function deleteTripAction(formData: FormData) {
  const user = await requireOnboardedUser();
  const id = z.string().parse(formData.get("id"));

  await db.trip.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });

  revalidatePath("/app");
  revalidatePath("/app/trips");
  redirectWithNotice("/app/trips", "Trip deleted.");
}

async function saveReceiptFile(file: File, userId: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : ".bin";
  const directory = path.join(process.cwd(), "public", "uploads", "receipts");
  await mkdir(directory, { recursive: true });
  const filename = `${userId}-${randomUUID()}${extension}`;
  await writeFile(path.join(directory, filename), buffer);
  return `/uploads/receipts/${filename}`;
}

export async function saveExpenseAction(formData: FormData) {
  const user = await requireOnboardedUser();
  const redirectTo = safeRedirectTarget(formData.get("redirectTo"), "/app/expenses");

  try {
    const parsed = expenseSchema.parse({
      id: formData.get("id") || undefined,
      date: formData.get("date"),
      amount: formData.get("amount"),
      category: formData.get("category"),
      vendor: formData.get("vendor"),
      notes: formData.get("notes") || undefined,
      paymentMethod: formData.get("paymentMethod"),
    });

    if (!parsed.id) {
      await enforceMonthlyLimit({
        userId: user.id,
        model: "expense",
        max: FREE_LIMITS.expensesPerMonth,
      });
    }

    const subscription = await db.subscription.findUnique({ where: { userId: user.id } });
    let receiptPath: string | undefined;
    const receipt = formData.get("receipt");
    if (receipt instanceof File && receipt.size > 0) {
      if (subscription?.plan !== "PRO") {
        redirectWithNotice(redirectTo, "Receipt uploads are available on Pro. Save the expense without a file or upgrade.");
      }
      receiptPath = await saveReceiptFile(receipt, user.id);
    }

    if (parsed.id) {
      await ensureOwnedRecord({
        userId: user.id,
        id: parsed.id,
        model: "expense",
      });

      await db.expense.update({
        where: {
          id: parsed.id,
        },
        data: {
          date: new Date(parsed.date),
          amount: parsed.amount,
          category: parsed.category,
          vendor: parsed.vendor,
          notes: parsed.notes?.trim() || null,
          paymentMethod: parsed.paymentMethod,
          ...(receiptPath ? { receiptPath } : {}),
        },
      });
    } else {
      await db.expense.create({
        data: {
          userId: user.id,
          date: new Date(parsed.date),
          amount: parsed.amount,
          category: parsed.category,
          vendor: parsed.vendor,
          notes: parsed.notes?.trim() || null,
          paymentMethod: parsed.paymentMethod,
          receiptPath: receiptPath || null,
        },
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save the expense.";
    redirectWithNotice(redirectTo, message);
  }

  revalidatePath("/app");
  revalidatePath("/app/expenses");
  redirectWithNotice(redirectTo, "Expense saved.");
}

export async function deleteExpenseAction(formData: FormData) {
  const user = await requireOnboardedUser();
  const id = z.string().parse(formData.get("id"));

  await db.expense.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });

  revalidatePath("/app");
  revalidatePath("/app/expenses");
  redirectWithNotice("/app/expenses", "Expense deleted.");
}

export async function saveIncomeAction(formData: FormData) {
  const user = await requireOnboardedUser();
  const redirectTo = safeRedirectTarget(formData.get("redirectTo"), "/app/income");

  try {
    const parsed = incomeSchema.parse({
      id: formData.get("id") || undefined,
      date: formData.get("date"),
      amount: formData.get("amount"),
      category: formData.get("category"),
      clientSource: formData.get("clientSource"),
      notes: formData.get("notes") || undefined,
      status: formData.get("status"),
    });

    if (!parsed.id) {
      await enforceMonthlyLimit({
        userId: user.id,
        model: "incomeEntry",
        max: FREE_LIMITS.incomePerMonth,
      });
    }

    if (parsed.id) {
      await ensureOwnedRecord({
        userId: user.id,
        id: parsed.id,
        model: "incomeEntry",
      });

      await db.incomeEntry.update({
        where: {
          id: parsed.id,
        },
        data: {
          date: new Date(parsed.date),
          amount: parsed.amount,
          category: parsed.category,
          clientSource: parsed.clientSource,
          notes: parsed.notes?.trim() || null,
          status: parsed.status,
        },
      });
    } else {
      await db.incomeEntry.create({
        data: {
          userId: user.id,
          date: new Date(parsed.date),
          amount: parsed.amount,
          category: parsed.category,
          clientSource: parsed.clientSource,
          notes: parsed.notes?.trim() || null,
          status: parsed.status,
        },
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save the income entry.";
    redirectWithNotice(redirectTo, message);
  }

  revalidatePath("/app");
  revalidatePath("/app/income");
  redirectWithNotice(redirectTo, "Income entry saved.");
}

export async function deleteIncomeAction(formData: FormData) {
  const user = await requireOnboardedUser();
  const id = z.string().parse(formData.get("id"));

  await db.incomeEntry.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });

  revalidatePath("/app");
  revalidatePath("/app/income");
  redirectWithNotice("/app/income", "Income entry deleted.");
}

export async function saveSettingsAction(formData: FormData) {
  const user = await requireOnboardedUser();
  const parsed = onboardingSchema.extend({
    exportPreference: z.string().trim().min(2),
  }).safeParse({
    businessName: formData.get("businessName"),
    businessType: formData.get("businessType"),
    defaultTaxRate: formData.get("defaultTaxRate") || DEFAULT_TAX_RATE,
    defaultMileageRate: formData.get("defaultMileageRate") || DEFAULT_MILEAGE_RATE,
    preferredCurrency: formData.get("preferredCurrency") || DEFAULT_CURRENCY,
    country: formData.get("country") || DEFAULT_COUNTRY,
    exportPreference: formData.get("exportPreference"),
  });

  if (!parsed.success) {
    redirectWithNotice("/app/settings", "Review the settings fields and try again.");
  }

  await db.$transaction([
    db.user.update({
      where: { id: user.id },
      data: {
        country: parsed.data.country,
        currency: parsed.data.preferredCurrency.toUpperCase(),
      },
    }),
    db.businessProfile.upsert({
      where: { userId: user.id },
      update: {
        businessName: parsed.data.businessName,
        businessType: parsed.data.businessType,
        defaultTaxRate: parsed.data.defaultTaxRate,
        defaultMileageRate: parsed.data.defaultMileageRate,
        preferredCurrency: parsed.data.preferredCurrency.toUpperCase(),
        country: parsed.data.country,
        exportPreference: parsed.data.exportPreference,
      },
      create: {
        userId: user.id,
        businessName: parsed.data.businessName,
        businessType: parsed.data.businessType,
        defaultTaxRate: parsed.data.defaultTaxRate,
        defaultMileageRate: parsed.data.defaultMileageRate,
        preferredCurrency: parsed.data.preferredCurrency.toUpperCase(),
        country: parsed.data.country,
        exportPreference: parsed.data.exportPreference,
      },
    }),
  ]);

  revalidatePath("/app");
  revalidatePath("/app/settings");
  redirectWithNotice("/app/settings", "Settings saved.");
}

export async function seedSampleDataAction() {
  const user = await requireOnboardedUser();
  const existing = await Promise.all([
    db.trip.count({ where: { userId: user.id } }),
    db.expense.count({ where: { userId: user.id } }),
    db.incomeEntry.count({ where: { userId: user.id } }),
  ]);

  if (existing.some((count) => count > 0)) {
    redirectWithNotice("/app", "Sample data is only available for empty accounts.");
  }

  const baseDate = new Date();
  const daysAgo = (days: number) => new Date(baseDate.getTime() - days * 24 * 60 * 60 * 1000);

  await db.$transaction([
    db.trip.createMany({
      data: [
        {
          userId: user.id,
          date: daysAgo(2),
          purpose: "Client photo shoot",
          startLocation: "Home office",
          endLocation: "Downtown studio",
          miles: 18.4,
          classification: "business",
        },
        {
          userId: user.id,
          date: daysAgo(6),
          purpose: "Supply pickup",
          startLocation: "Studio",
          endLocation: "Office supply store",
          miles: 9.2,
          classification: "business",
        },
      ],
    }),
    db.expense.createMany({
      data: [
        {
          userId: user.id,
          date: daysAgo(3),
          amount: 68.12,
          category: "supplies",
          vendor: "Staples",
          paymentMethod: "credit card",
        },
        {
          userId: user.id,
          date: daysAgo(8),
          amount: 24.5,
          category: "parking",
          vendor: "City garage",
          paymentMethod: "debit card",
        },
      ],
    }),
    db.incomeEntry.createMany({
      data: [
        {
          userId: user.id,
          date: daysAgo(1),
          amount: 1800,
          category: "invoice payment",
          clientSource: "Northside Realty",
          status: "paid",
        },
        {
          userId: user.id,
          date: daysAgo(10),
          amount: 620,
          category: "platform payout",
          clientSource: "Marketplace",
          status: "paid",
        },
      ],
    }),
  ]);

  revalidatePath("/app");
  redirectWithNotice("/app", "Sample data loaded.");
}

export async function activateProPreviewAction(formData: FormData) {
  const user = await requireOnboardedUser();
  const billingCycle = formData.get("billingCycle") === "yearly" ? "yearly" : "monthly";

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_MONTHLY || !process.env.STRIPE_PRICE_YEARLY) {
    await db.subscription.upsert({
      where: { userId: user.id },
      update: {
        plan: "PRO",
        status: "PREVIEW",
        billingCycle,
      },
      create: {
        userId: user.id,
        plan: "PRO",
        status: "PREVIEW",
        billingCycle,
      },
    });
    revalidatePath("/app");
    redirectWithNotice(
      "/app/settings",
      "Pro preview activated locally. Add Stripe credentials to switch to live billing.",
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const subscription = await db.subscription.findUnique({ where: { userId: user.id } });
  const priceId =
    billingCycle === "yearly" ? process.env.STRIPE_PRICE_YEARLY : process.env.STRIPE_PRICE_MONTHLY;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: absoluteUrl("/app/settings?notice=Stripe checkout complete."),
    cancel_url: absoluteUrl("/app/settings?notice=Stripe checkout canceled."),
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.id,
    metadata: {
      userId: user.id,
    },
    subscription_data: {
      metadata: {
        userId: user.id,
      },
    },
    ...(subscription?.stripeCustomerId ? { customer: subscription.stripeCustomerId } : {}),
  });

  redirect(session.url || "/app/settings?notice=Unable to start Stripe checkout.");
}

export async function openBillingPortalAction() {
  const user = await requireOnboardedUser();
  const subscription = await db.subscription.findUnique({ where: { userId: user.id } });

  if (!process.env.STRIPE_SECRET_KEY || !subscription?.stripeCustomerId) {
    redirectWithNotice("/app/settings", "Stripe billing portal is unavailable in local preview mode.");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const portal = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: absoluteUrl("/app/settings"),
  });
  redirect(portal.url);
}

export async function downgradeToFreeAction() {
  const user = await requireOnboardedUser();
  await db.subscription.upsert({
    where: { userId: user.id },
    update: {
      plan: "FREE",
      status: "INACTIVE",
      billingCycle: "monthly",
    },
    create: {
      userId: user.id,
      plan: "FREE",
      status: "INACTIVE",
    },
  });
  revalidatePath("/app");
  redirectWithNotice("/app/settings", "Subscription set to Free.");
}

export async function deleteAccountAction() {
  const user = await requireOnboardedUser();
  await db.user.delete({
    where: { id: user.id },
  });
  await destroySession();
  redirect("/?notice=Your account has been deleted.");
}
