import { AppNotice } from "@/components/app-notice";
import { AppShell } from "@/components/app-shell";
import { TripsTable } from "@/components/record-table";
import { Button, Card, EmptyState, Field, Input, Select, SectionHeading, Textarea } from "@/components/ui";
import { saveTripAction } from "@/lib/actions";
import { requireOnboardedUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";
import { TRIP_CLASSIFICATIONS } from "@/lib/constants";
import { formatDateInput } from "@/lib/utils";

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const user = await requireOnboardedUser();
  const data = await getAppData(user.id);
  const editId = typeof params.edit === "string" ? params.edit : undefined;
  const notice = typeof params.notice === "string" ? params.notice : undefined;
  const editing = editId ? data.trips.find((trip) => trip.id === editId) : undefined;

  return (
    <AppShell
      pathname="/app/trips"
      userLabel={`${data.businessProfile?.businessName || user.email} • Trip logging`}
    >
      <div className="space-y-6">
        <Card>
          <SectionHeading
            eyebrow="Mileage"
            title={editing ? "Edit trip" : "Log a trip"}
            description="Keep the IRS-ready fields visible: date, purpose, start and end locations, mileage, and business classification."
          />
          <div className="mt-6 space-y-4">
            <AppNotice notice={notice} />
            <form action={saveTripAction} className="grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="id" value={editing?.id || ""} />
              <input type="hidden" name="redirectTo" value="/app/trips" />
              <Field label="Date">
                <Input defaultValue={editing ? formatDateInput(editing.date) : formatDateInput(new Date())} name="date" type="date" />
              </Field>
              <Field label="Classification">
                <Select defaultValue={editing?.classification || "business"} name="classification">
                  {TRIP_CLASSIFICATIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Business purpose">
                  <Input defaultValue={editing?.purpose || ""} name="purpose" placeholder="Client meeting, property showing, supply run" />
                </Field>
              </div>
              <Field label="Start location">
                <Input defaultValue={editing?.startLocation || ""} name="startLocation" placeholder="Home office" />
              </Field>
              <Field label="End location">
                <Input defaultValue={editing?.endLocation || ""} name="endLocation" placeholder="Client site" />
              </Field>
              <Field label="Odometer start" hint="Optional. If both odometer fields are entered, miles are auto-calculated.">
                <Input defaultValue={editing?.odometerStart ?? ""} min="0" name="odometerStart" step="0.1" type="number" />
              </Field>
              <Field label="Odometer end">
                <Input defaultValue={editing?.odometerEnd ?? ""} min="0" name="odometerEnd" step="0.1" type="number" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Miles driven" hint="Use this if you are not entering odometer readings.">
                  <Input defaultValue={editing?.miles ?? ""} min="0" name="miles" step="0.1" type="number" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Notes">
                  <Textarea defaultValue={editing?.notes || ""} name="notes" placeholder="Optional context for reimbursements or follow-up." />
                </Field>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row">
                <Button type="submit">{editing ? "Update trip" : "Save trip"}</Button>
                {editing ? (
                  <Button href="/app/trips" variant="secondary">
                    Cancel edit
                  </Button>
                ) : null}
              </div>
            </form>
          </div>
        </Card>

        {data.trips.length ? (
          <TripsTable trips={data.trips} currency={data.businessProfile?.preferredCurrency || "USD"} />
        ) : (
          <EmptyState
            title="No trips logged yet"
            description="Start logging the business miles you want available at tax time. Manual-first logging is the point: cleaner records, less cleanup."
          />
        )}
      </div>
    </AppShell>
  );
}
