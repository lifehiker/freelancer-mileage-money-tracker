export const APP_NAME = "Freelancer Mileage & Money Tracker";
export const APP_TAGLINE =
  "The simple mileage, expense, and tax tracker for freelancers.";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const DEFAULT_COUNTRY = "United States";
export const DEFAULT_CURRENCY = "USD";
export const DEFAULT_TAX_RATE = 0.25;
export const DEFAULT_MILEAGE_RATE = 0.67;

export const FREE_LIMITS = {
  tripsPerMonth: 30,
  expensesPerMonth: 20,
  incomePerMonth: 20,
  csvExportsPerMonth: 3,
} as const;

export const TRIP_CLASSIFICATIONS = [
  { value: "business", label: "Business" },
  { value: "personal", label: "Personal" },
] as const;

export const BUSINESS_TYPES = [
  "Freelancer",
  "Contractor",
  "Realtor",
  "Photographer",
  "Gig worker",
  "Consultant",
  "Home service provider",
  "Mobile notary",
  "Other",
] as const;

export const EXPENSE_CATEGORIES = [
  "fuel",
  "parking",
  "tolls",
  "meals",
  "supplies",
  "software",
  "phone",
  "travel",
  "other",
] as const;

export const PAYMENT_METHODS = [
  "credit card",
  "debit card",
  "cash",
  "bank transfer",
  "other",
] as const;

export const INCOME_CATEGORIES = [
  "invoice payment",
  "cash payment",
  "platform payout",
  "reimbursement",
  "other",
] as const;

export const INCOME_STATUSES = [
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
] as const;

export const APP_NAV = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/trips", label: "Trips" },
  { href: "/app/expenses", label: "Expenses" },
  { href: "/app/income", label: "Income" },
  { href: "/app/reports", label: "Reports" },
  { href: "/app/settings", label: "Settings" },
] as const;

export const QUICK_ACTIONS = [
  { href: "/app/trips", label: "Log trip" },
  { href: "/app/expenses", label: "Log expense" },
  { href: "/app/income", label: "Log income" },
] as const;

export const FAQS = [
  {
    question: "Can I export mileage logs on the free plan?",
    answer:
      "Yes. The free plan includes limited CSV exports every month and a watermarked PDF summary so tax-time data is never locked away.",
  },
  {
    question: "Does the app track mileage automatically?",
    answer:
      "No. This app is intentionally manual-first so your records stay accurate instead of requiring cleanup from unreliable GPS trip detection.",
  },
  {
    question: "What counts toward the tax reserve estimate?",
    answer:
      "The app uses profit after expenses and the mileage deduction, then applies your tax rate: max((income - expenses - mileage deduction), 0) * tax rate.",
  },
  {
    question: "Can I upload receipts?",
    answer:
      "Yes on Pro. The app includes a safe local fallback for development and can be connected to managed storage for production.",
  },
] as const;

export const ROOT_SEO_PAGES = {
  "mileage-tracker-for-self-employed": {
    title: "Mileage Tracker for Self Employed Professionals",
    hero: "Mileage tracking for self-employed work without bloated accounting software.",
    intro:
      "Track deductible trips, expenses, income, and tax set-asides in one mobile-first workspace built for solo operators.",
    bullets: [
      "Log business mileage in seconds with IRS-ready fields.",
      "Capture expenses and income in the same flow instead of splitting tools.",
      "Export clean CSV and PDF summaries without an export hostage model.",
    ],
  },
  "business-mileage-log": {
    title: "Business Mileage Log That Stays IRS Ready",
    hero: "A business mileage log that is simple to maintain and ready to export.",
    intro:
      "Keep purpose, date, start and end locations, odometer readings, and business classification in a format your accountant can actually use.",
    bullets: [
      "Manual-first trip capture for cleaner records.",
      "Mileage deduction estimates update automatically.",
      "Monthly summaries keep tax season from becoming reconstruction season.",
    ],
  },
  "freelancer-expense-and-income-tracker": {
    title: "Freelancer Expense And Income Tracker",
    hero: "Income, expenses, mileage, and taxes in one lightweight tracker.",
    intro:
      "Freelancers do not need full bookkeeping complexity to stay organized. This app focuses on the daily capture workflow.",
    bullets: [
      "Large mobile-friendly forms for fast entry.",
      "Monthly and yearly reporting when you upgrade to Pro.",
      "Separate business and personal mileage without switching apps.",
    ],
  },
  "irs-mileage-log-app": {
    title: "IRS Mileage Log App For Freelancers",
    hero: "Built around the fields you need for a compliant mileage log.",
    intro:
      "The trip form keeps the required details visible so you can log accurately in the moment and export later with confidence.",
    bullets: [
      "Date, purpose, route details, and mileage captured clearly.",
      "Auto-calculated miles from odometer readings.",
      "Reports and exports designed for tax preparation.",
    ],
  },
  "mileage-tracker-without-subscription": {
    title: "Mileage Tracker Without Subscription Lock-In",
    hero: "A mileage tracker that still respects free users.",
    intro:
      "The free plan is designed to be useful on its own, with limited exports and monthly logging instead of a hard export paywall.",
    bullets: [
      "Free-tier CSV exports every month.",
      "Simple paid upgrade when your usage grows.",
      "Focused on freelancers instead of fleet teams.",
    ],
  },
} as const;

export const PERSONA_PAGES = {
  realtors: {
    title: "Mileage Tracker For Realtors",
    hero: "Track showings, open houses, errands, and client trips without bookkeeping overhead.",
    bullets: [
      "Separate brokerage reimbursements from taxable income.",
      "Keep trip purpose details for every showing and property visit.",
      "Estimate tax set-asides from your monthly profit automatically.",
    ],
  },
  contractors: {
    title: "Mileage Tracker For Contractors",
    hero: "Log site visits, supply runs, and billable travel with fast mobile forms.",
    bullets: [
      "Capture fuel, tolls, and supply expenses next to mileage.",
      "Track payouts and unpaid invoices in one ledger.",
      "Export clean logs for your accountant or tax preparer.",
    ],
  },
  "gig-workers": {
    title: "Mileage Tracker For Gig Workers",
    hero: "Mileage, expenses, and payout tracking for delivery and rideshare work.",
    bullets: [
      "Manual-first entries keep records accurate when auto-tracking fails.",
      "Track platform payouts and reimbursements separately.",
      "Know how much to hold back for taxes before the quarter ends.",
    ],
  },
} as const;

export const COMPARE_PAGES = {
  "mileiq-alternative": {
    title: "MileIQ Alternative For Freelancers",
    hero: "A MileIQ alternative that also handles expenses, income, and tax set-asides.",
    bullets: [
      "Manual-first instead of GPS-cleanup-first.",
      "Free exports with limits instead of an export hostage pattern.",
      "Designed for solo operators rather than a mileage-only workflow.",
    ],
  },
  "stride-alternative": {
    title: "Stride Alternative For Self Employed Work",
    hero: "A Stride alternative focused on daily logging instead of missed-trip cleanup.",
    bullets: [
      "Faster capture for trips, expenses, and income.",
      "Cleaner monthly reports and export workflows.",
      "A simpler paid plan when your usage grows.",
    ],
  },
  "quickbooks-self-employed-alternative": {
    title: "QuickBooks Self-Employed Alternative",
    hero: "A simpler alternative for people who need tax-ready logs, not full accounting software.",
    bullets: [
      "Lower-complexity workflow for daily capture.",
      "Mobile-first forms instead of a bookkeeping-heavy interface.",
      "Mileage, expenses, income, and tax reserve in one place.",
    ],
  },
} as const;
