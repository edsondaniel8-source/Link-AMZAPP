import DriverPartnerships from "@/components/DriverPartnerships";
import PageHeader from "@/components/PageHeader";

export default function Partnerships() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader title="Parcerias" />
      <DriverPartnerships />
    </div>
  );
}