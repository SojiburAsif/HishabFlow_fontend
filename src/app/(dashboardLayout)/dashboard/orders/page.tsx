import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";

export default function DashboardOrdersPage() {
  return (
    <DashboardRoutePage
      title="Orders"
      description="Track order flow, recent sales, and fulfillment status from one place."
      badge="Shop Flow"
      accent="from-amber-500 to-orange-500"
    />
  );
}
