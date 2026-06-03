"use client";

import { Drawer } from "@/components/ui/drawer";
import { Sidebar } from "./sidebar";

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="left"
      width="w-[280px]"
      ariaLabel="Mobile navigation"
      className="lg:hidden"
    >
      <Sidebar onNavigate={onClose} />
    </Drawer>
  );
}
