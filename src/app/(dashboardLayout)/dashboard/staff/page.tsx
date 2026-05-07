import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";

export default function DashboardStaffPage() {
  return (
    <DashboardRoutePage
      title="Staff"
      description="View team access, assignment status, and staff activity at a glance."
      badge="Team"
      accent="from-rose-500 to-pink-500"
    />
  );
}
