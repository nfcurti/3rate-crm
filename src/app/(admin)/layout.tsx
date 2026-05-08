import { EndUserSelectionProvider } from "@/components/end-users/EndUserSelectionProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { VendorSelectionProvider } from "@/components/vendors/VendorSelectionProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F7F9] text-[#1f2b20]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <main className="w-full">
          <VendorSelectionProvider>
            <EndUserSelectionProvider>{children}</EndUserSelectionProvider>
          </VendorSelectionProvider>
        </main>
      </div>
    </div>
  );
}

