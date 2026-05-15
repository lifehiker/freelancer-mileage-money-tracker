import { db } from "@/lib/db";
import { toMonthKey } from "@/lib/utils";

export async function recordExportUsage(userId: string, type: "csv" | "pdf") {
  const monthKey = toMonthKey(new Date());

  await db.exportUsage.upsert({
    where: {
      userId_monthKey: {
        userId,
        monthKey,
      },
    },
    update: {
      ...(type === "csv" ? { csvExports: { increment: 1 } } : {}),
      ...(type === "pdf" ? { pdfExports: { increment: 1 } } : {}),
    },
    create: {
      userId,
      monthKey,
      csvExports: type === "csv" ? 1 : 0,
      pdfExports: type === "pdf" ? 1 : 0,
    },
  });
}
