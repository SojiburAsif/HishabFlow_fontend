import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";

export default function DashboardInventoryPage() {
  return (
    <DashboardRoutePage
      title="Inventory"
      description="Monitor stock levels, low inventory alerts, and product movement."
      badge="Stock"
      accent="from-cyan-500 to-sky-500"
    />
  );
}
