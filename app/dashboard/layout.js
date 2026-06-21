"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import RoleGuard from "@/components/dashboard/RoleGuard";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import { DASHBOARD_ROLES } from "@/lib/dashboard/navConfig";
import { cn, dashboardClasses } from "@/lib/dashboard/theme";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const user = session?.user;
  const role = DASHBOARD_ROLES.includes(user?.role) ? user.role : "user";

  return (
    <RoleGuard>
      {/* Full-viewport shell — sits above marketing Navbar/Footer */}
      <div className={cn(dashboardClasses.shell, "fixed inset-0 z-[100]")}>
        {isPending ? (
          <div className="flex-1 p-6 lg:p-8">
            <LoadingSkeleton variant="page" />
          </div>
        ) : (
          <>
            <Sidebar
              role={role}
              user={user}
              collapsed={collapsed}
              onToggleCollapse={() => setCollapsed((prev) => !prev)}
              mobileOpen={mobileOpen}
              onMobileClose={() => setMobileOpen(false)}
            />

            <div className={dashboardClasses.content}>
              <DashboardNavbar
                role={role}
                user={user}
                onMenuClick={() => setMobileOpen(true)}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
              />

              <main className={dashboardClasses.main}>{children}</main>
            </div>
          </>
        )}
      </div>
    </RoleGuard>
  );
}
