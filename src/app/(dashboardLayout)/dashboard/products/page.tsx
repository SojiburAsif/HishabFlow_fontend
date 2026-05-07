import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";

export default function DashboardProductsPage() {
  return (
    <DashboardRoutePage
      title="Products"
      description="Manage product catalog, pricing, and catalog changes from this page."
      badge="Catalog"
      accent="from-violet-500 to-fuchsia-500"
    />
  );
}
