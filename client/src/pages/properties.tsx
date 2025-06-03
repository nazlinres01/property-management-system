import { useState } from "react";
import Topbar from "@/components/layout/topbar";
import PropertyModal from "@/components/modals/property-modal";
import PropertyTable from "@/components/tables/property-table";

interface PropertiesProps {
  onMenuClick?: () => void;
}

export default function Properties({ onMenuClick }: PropertiesProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen">
      <Topbar
        title="Mülkler"
        onMenuClick={onMenuClick || (() => {})}
        onQuickAction={() => setShowModal(true)}
        quickActionLabel="Yeni Mülk"
      />

      <div className="p-6">
        <PropertyTable />
      </div>

      <PropertyModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
